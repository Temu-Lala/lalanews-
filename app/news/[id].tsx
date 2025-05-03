import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { useNewsStore } from '@/store/useNewsStore';
import { useThemeStore } from '@/store/useThemeStore';
import i18n from '@/i18n';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { news } = useNewsStore();
  const { theme } = useThemeStore();
  
  // Find news item by id
  const newsItem = news.find((item) => item.id === id);
  
  if (!newsItem) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>News item not found</Text>
      </View>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
    });
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${newsItem.title} - Read more in the React Native Community App`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: i18n.t('news'),
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Share2 size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.sourceContainer}>
            <Text style={[styles.source, { color: theme.colors.primary }]}>{newsItem.source}</Text>
            {newsItem.isOfficial && (
              <View style={[styles.officialBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.officialText}>{i18n.t('official')}</Text>
              </View>
            )}
            <Text style={[
              styles.category, 
              { 
                color: theme.colors.textSecondary,
                backgroundColor: theme.colors.card 
              }
            ]}>
              {newsItem.category}
            </Text>
          </View>
          
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
            {formatDate(newsItem.createdAt)}
          </Text>
        </View>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>{newsItem.title}</Text>
        
        {newsItem.image && (
          <Image
            source={{ uri: newsItem.image }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        )}
        
        <Text style={[styles.content, { color: theme.colors.text }]}>{newsItem.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginRight: 16,
  },
  shareButton: {
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  source: {
    fontSize: 14,
    fontWeight: '500',
  },
  officialBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  officialText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  category: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  date: {
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    paddingTop: 0,
    lineHeight: 34,
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    padding: 16,
  },
});
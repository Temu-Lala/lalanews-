import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { NewsItem } from '@/types';
import { useThemeStore } from '@/store/useThemeStore';
import i18n from '@/i18n';

interface NewsCardProps {
  news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { theme } = useThemeStore();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  };

  // On web, we need to handle Link differently to avoid errors
  if (Platform.OS === 'web') {
    return (
      <Link href={`/news/${news.id}`} style={{ textDecoration: 'none' }}>
        <View 
          style={[
            styles.container, 
            { 
              backgroundColor: theme.colors.background,
              borderBottomColor: theme.colors.border 
            }
          ]}
        >
          <View style={[
            styles.content, 
            news.image ? { marginRight: 16 } : {}
          ]}>
            <View style={styles.header}>
              <Text style={[styles.source, { color: theme.colors.primary }]}>{news.source}</Text>
              {news.isOfficial && (
                <View style={[styles.officialBadge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.officialText}>{i18n.t('official')}</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.title, { color: theme.colors.text }]}>{news.title}</Text>
            
            <Text style={[styles.excerpt, { color: theme.colors.textSecondary }]} numberOfLines={2}>
              {news.content}
            </Text>
            
            <View style={styles.footer}>
              <Text style={[
                styles.category, 
                { 
                  color: theme.colors.textSecondary,
                  backgroundColor: theme.colors.card 
                }
              ]}>
                {news.category}
              </Text>
              <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
                {formatDate(news.createdAt)}
              </Text>
            </View>
          </View>
          
          {news.image && (
            <Image
              source={{ uri: news.image }}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
          )}
        </View>
      </Link>
    );
  }

  // For native platforms, we can use the asChild pattern
  return (
    <Link href={`/news/${news.id}`} asChild>
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            backgroundColor: theme.colors.background,
            borderBottomColor: theme.colors.border 
          }
        ]} 
        activeOpacity={0.8}
      >
        <View style={[
          styles.content, 
          news.image ? { marginRight: 16 } : {}
        ]}>
          <View style={styles.header}>
            <Text style={[styles.source, { color: theme.colors.primary }]}>{news.source}</Text>
            {news.isOfficial && (
              <View style={[styles.officialBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.officialText}>{i18n.t('official')}</Text>
              </View>
            )}
          </View>
          
          <Text style={[styles.title, { color: theme.colors.text }]}>{news.title}</Text>
          
          <Text style={[styles.excerpt, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {news.content}
          </Text>
          
          <View style={styles.footer}>
            <Text style={[
              styles.category, 
              { 
                color: theme.colors.textSecondary,
                backgroundColor: theme.colors.card 
              }
            ]}>
              {news.category}
            </Text>
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
              {formatDate(news.createdAt)}
            </Text>
          </View>
        </View>
        
        {news.image && (
          <Image
            source={{ uri: news.image }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        )}
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    padding: 16,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  source: {
    fontSize: 12,
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  excerpt: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  date: {
    fontSize: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default NewsCard;
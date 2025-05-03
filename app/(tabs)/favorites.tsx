import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { usePostStore } from '@/store/usePostStore';
import PostList from '@/components/post/PostList';
import { useThemeStore } from '@/store/useThemeStore';
import i18n from '@/i18n';

export default function FavoritesScreen() {
  const { savedPosts, isLoading, fetchPosts } = usePostStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const HeaderComponent = (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        {i18n.t('savedPosts')}
      </Text>
      <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
        {i18n.t('savedPostsSubtitle')}
      </Text>
    </View>
  );

  const EmptyComponent = (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        {i18n.t('noSavedPosts')}
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
        {i18n.t('savePostsHint')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: i18n.t('favorites'),
          headerTitleStyle: [styles.headerTitle, { color: theme.colors.text }],
        }}
      />
      
      <PostList
        posts={savedPosts}
        isLoading={isLoading}
        onRefresh={fetchPosts}
        ListHeaderComponent={HeaderComponent}
        ListEmptyComponent={EmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
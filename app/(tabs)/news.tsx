import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { useNewsStore } from '@/store/useNewsStore';
import NewsList from '@/components/news/NewsList';
import CategoryFilter from '@/components/news/CategoryFilter';
import { useThemeStore } from '@/store/useThemeStore';
import i18n from '@/i18n';

export default function NewsScreen() {
  const { news, filteredNews, selectedCategory, isLoading, fetchNews, filterByCategory } = useNewsStore();
  const { theme } = useThemeStore();
  
  // Extract unique categories from news items
  const categories = [...new Set(news.map(item => item.category))];

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: i18n.t('news'),
          headerTitleStyle: [styles.headerTitle, { color: theme.colors.text }],
        }}
      />
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={filterByCategory}
      />
      
      <NewsList
        news={filteredNews}
        isLoading={isLoading}
        onRefresh={fetchNews}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
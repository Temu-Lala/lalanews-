import React from 'react';
import { FlatList, StyleSheet, RefreshControl, ActivityIndicator, Text, View } from 'react-native';
import { NewsItem } from '@/types';
import NewsCard from './NewsCard';
import { useThemeStore } from '@/store/useThemeStore';
import i18n from '@/i18n';

interface NewsListProps {
  news: NewsItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
}

export const NewsList: React.FC<NewsListProps> = ({
  news,
  isLoading = false,
  onRefresh,
  ListHeaderComponent,
  ListEmptyComponent,
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const { theme } = useThemeStore();

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const defaultEmptyComponent = (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        {i18n.t('noNewsToShow')}
      </Text>
    </View>
  );

  if (isLoading && news.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={news}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NewsCard news={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent || defaultEmptyComponent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NewsList;
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { usePostStore } from '@/store/usePostStore';
import PostList from '@/components/post/PostList';
import CreatePostButton from '@/components/post/CreatePostButton';
import { useThemeStore } from '@/store/useThemeStore';
import i18n from '@/i18n';

export default function HomeScreen() {
  const { homePosts, isLoading, fetchPosts } = usePostStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const HeaderComponent = (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        {i18n.t('verifiedPosts')}
      </Text>
      <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
        {i18n.t('verifiedPostsSubtitle')}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: i18n.t('home'),
          headerTitleStyle: [styles.headerTitle, { color: theme.colors.text }],
        }}
      />
      
      <PostList
        posts={homePosts}
        isLoading={isLoading}
        onRefresh={fetchPosts}
        ListHeaderComponent={HeaderComponent}
      />
      
      <CreatePostButton />
    </KeyboardAvoidingView>
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
});
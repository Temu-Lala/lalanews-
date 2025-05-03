import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { useUserStore } from '@/store/useUserStore';
import { usePostStore } from '@/store/usePostStore';
import { useThemeStore } from '@/store/useThemeStore';
import Avatar from '@/components/common/Avatar';
import { PostCard } from '@/components/post/PostCard';
import Button from '@/components/common/Button';
import i18n from '@/i18n';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { users, currentUser, followUser, unfollowUser, isFollowing } = useUserStore();
  const { homePosts, communityPosts } = usePostStore();
  const { theme } = useThemeStore();
  
  // Find user by id
  const user = users.find((u) => u.id === id);
  
  // Find posts by this user
  const userPosts = [...homePosts, ...communityPosts].filter(
    (post) => post.user.id === id
  );
  
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>User not found</Text>
      </View>
    );
  }
  
  const isCurrentUser = currentUser?.id === user.id;
  const following = isFollowing(user.id);
  
  const handleFollowToggle = () => {
    if (following) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  
  const handleEditProfile = () => {
    router.push('/edit-profile');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: user.name,
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <View style={styles.coverImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80' }}
              style={styles.coverImage}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Avatar 
                source={user.avatar} 
                size="large" 
                isVerified={user.isVerified}
                style={[styles.avatar, { borderColor: theme.colors.background }]}
              />
            </View>
            
            <View style={styles.nameContainer}>
              <Text style={[styles.name, { color: theme.colors.text }]}>{user.name}</Text>
              <Text style={[styles.username, { color: theme.colors.textSecondary }]}>
                @{user.username}
              </Text>
            </View>
            
            {isCurrentUser ? (
              <Button 
                title={i18n.t('editProfile')}
                variant="outline"
                size="small"
                style={styles.editButton}
                onPress={handleEditProfile}
              />
            ) : (
              <Button 
                title={following ? i18n.t('unfollow') : i18n.t('follow')}
                variant={following ? "outline" : "primary"}
                size="small"
                style={styles.followButton}
                onPress={handleFollowToggle}
              />
            )}
            
            {user.bio && (
              <Text style={[styles.bio, { color: theme.colors.text }]}>{user.bio}</Text>
            )}
            
            <View style={styles.infoItems}>
              <View style={styles.infoItem}>
                <Calendar size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  {i18n.t('joined')} {formatDate(user.joinedDate)}
                </Text>
              </View>
            </View>
            
            <View style={[
              styles.stats, 
              { 
                borderTopColor: theme.colors.border,
                borderBottomColor: theme.colors.border 
              }
            ]}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {user.followers}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  {i18n.t('followers')}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {user.following}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  {i18n.t('following')}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {userPosts.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  {i18n.t('posts')}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.postsSection}>
          <Text style={[styles.postsTitle, { color: theme.colors.text }]}>
            {i18n.t('posts')}
          </Text>
          
          {userPosts.length === 0 ? (
            <View style={styles.emptyPosts}>
              <Text style={[styles.emptyPostsText, { color: theme.colors.textSecondary }]}>
                {isCurrentUser 
                  ? i18n.t('youHaventPostedAnything')
                  : i18n.t('userHasntPostedAnything').replace('{name}', user.name)
                }
              </Text>
            </View>
          ) : (
            userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
  },
  coverImageContainer: {
    height: 150,
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    padding: 16,
  },
  avatarContainer: {
    marginTop: -40,
    marginBottom: 8,
  },
  avatar: {
    borderWidth: 4,
  },
  nameContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    marginTop: 2,
  },
  editButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  followButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  infoItems: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 4,
  },
  stats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  postsSection: {
    padding: 16,
    paddingTop: 0,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyPosts: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPostsText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
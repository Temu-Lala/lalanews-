import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react-native';
import { Post } from '@/types';
import Avatar from '@/components/common/Avatar';
import { usePostStore } from '@/store/usePostStore';
import { useThemeStore } from '@/store/useThemeStore';
import * as Haptics from 'expo-haptics';
import i18n from '@/i18n';
import MediaCarousel from './MediaCarousel';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { likePost, savePost } = usePostStore();
  const { theme } = useThemeStore();
  
  const handleLike = () => {
    likePost(post.id);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleSave = () => {
    savePost(post.id);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // User info section with conditional rendering for web
  const UserInfoSection = () => (
    <View style={styles.userInfo}>
      <Avatar 
        source={post.user.avatar} 
        size="medium" 
        isVerified={post.user.isVerified}
      />
      <View style={styles.nameContainer}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{post.user.name}</Text>
        <Text style={[styles.time, { color: theme.colors.textSecondary }]}>{formatDate(post.createdAt)}</Text>
      </View>
    </View>
  );

  // Post content section with conditional rendering for web
  const PostContentSection = () => (
    <View>
      <Text style={[styles.content, { color: theme.colors.text }]}>{post.content}</Text>
      
      {/* Media carousel for multiple images or videos */}
      {(post.images && post.images.length > 0) || (post.videos && post.videos.length > 0) ? (
        <MediaCarousel 
          images={post.images || []} 
          videos={post.videos || []} 
        />
      ) : null}
    </View>
  );

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.background,
        borderBottomColor: theme.colors.border 
      }
    ]}>
      <View style={styles.header}>
        {Platform.OS === 'web' ? (
          <Link href={`/profile/${post.user.id}`} style={{ textDecoration: 'none' }}>
            <UserInfoSection />
          </Link>
        ) : (
          <Link href={`/profile/${post.user.id}`} asChild>
            <TouchableOpacity style={styles.userInfo}>
              <UserInfoSection />
            </TouchableOpacity>
          </Link>
        )}
      </View>
      
      {Platform.OS === 'web' ? (
        <Link href={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
          <PostContentSection />
        </Link>
      ) : (
        <Link href={`/post/${post.id}`} asChild>
          <TouchableOpacity activeOpacity={0.9}>
            <PostContentSection />
          </TouchableOpacity>
        </Link>
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Heart 
            size={20} 
            color={post.isLiked ? theme.colors.like : theme.colors.textSecondary} 
            fill={post.isLiked ? theme.colors.like : 'transparent'} 
          />
          <Text 
            style={[
              styles.actionText, 
              { color: post.isLiked ? theme.colors.like : theme.colors.textSecondary }
            ]}
          >
            {post.likes}
          </Text>
        </TouchableOpacity>
        
        {Platform.OS === 'web' ? (
          <Link href={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
            <View style={styles.actionButton}>
              <MessageCircle size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>{post.comments}</Text>
            </View>
          </Link>
        ) : (
          <Link href={`/post/${post.id}`} asChild>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <MessageCircle size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>{post.comments}</Text>
            </TouchableOpacity>
          </Link>
        )}
        
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Share2 size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>{post.shares}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Bookmark 
            size={20} 
            color={theme.colors.textSecondary} 
            fill={post.isSaved ? theme.colors.textSecondary : 'transparent'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 4,
  },
  saveButton: {
    marginLeft: 'auto',
    paddingVertical: 4,
  },
});
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Heart, MessageCircle, Share2, Bookmark, ArrowLeft } from 'lucide-react-native';
import { usePostStore } from '@/store/usePostStore';
import { useUserStore } from '@/store/useUserStore';
import { useCommentStore } from '@/store/useCommentStore';
import { useThemeStore } from '@/store/useThemeStore';
import Avatar from '@/components/common/Avatar';
import CommentItem from '@/components/comment/CommentItem';
import CommentInput from '@/components/comment/CommentInput';
import MediaCarousel from '@/components/post/MediaCarousel';
import * as Haptics from 'expo-haptics';
import i18n from '@/i18n';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { homePosts, communityPosts, likePost, savePost } = usePostStore();
  const { theme } = useThemeStore();
  const { addComment, addReply, getComments, fetchComments, isLoading } = useCommentStore();
  
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; username: string } | null>(null);
  
  // Find post in either home or community posts
  const post = [...homePosts, ...communityPosts].find((p) => p.id === id);
  
  // Get comments for this post
  const comments = getComments(id || '');
  
  useEffect(() => {
    if (id) {
      fetchComments(id);
    }
  }, [id]);
  
  if (!post) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Post not found</Text>
      </View>
    );
  }
  
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
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleSendComment = (text: string) => {
    if (replyingTo) {
      // Add reply to a comment
      addReply(post.id, replyingTo.commentId, text);
      setReplyingTo(null);
    } else {
      // Add new comment
      addComment(post.id, text);
    }
  };
  
  const handleReply = (commentId: string, username: string) => {
    setReplyingTo({ commentId, username });
  };
  
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: i18n.t('post'),
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.postContainer, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.userInfo}
              onPress={() => router.push(`/profile/${post.user.id}`)}
            >
              <Avatar 
                source={post.user.avatar} 
                size="medium" 
                isVerified={post.user.isVerified}
              />
              <View style={styles.nameContainer}>
                <Text style={[styles.name, { color: theme.colors.text }]}>{post.user.name}</Text>
                <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
                  {formatDate(post.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.content, { color: theme.colors.text }]}>{post.content}</Text>
          
          {/* Media carousel for multiple images or videos */}
          {(post.images && post.images.length > 0) || (post.videos && post.videos.length > 0) ? (
            <MediaCarousel 
              images={post.images || []} 
              videos={post.videos || []} 
            />
          ) : null}
          
          <View style={[styles.stats, { borderColor: theme.colors.border }]}>
            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
              {post.likes} {i18n.t('like')}
            </Text>
            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
              {comments.length} {i18n.t('comment')}
            </Text>
            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
              {post.shares} {i18n.t('share')}
            </Text>
          </View>
          
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
                {i18n.t('like')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <MessageCircle size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                {i18n.t('comment')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Share2 size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                {i18n.t('share')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Bookmark 
                size={20} 
                color={theme.colors.textSecondary} 
                fill={post.isSaved ? theme.colors.textSecondary : 'transparent'} 
              />
              <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                {i18n.t('savePost')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.commentsSection}>
          <Text style={[styles.commentsTitle, { color: theme.colors.text }]}>
            {i18n.t('comments')} ({comments.length})
          </Text>
          
          {isLoading ? (
            <View style={styles.loadingComments}>
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                {i18n.t('loadingComments')}
              </Text>
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.emptyComments}>
              <Text style={[styles.emptyCommentsText, { color: theme.colors.textSecondary }]}>
                {i18n.t('noCommentsYet')}
              </Text>
            </View>
          ) : (
            <View style={styles.commentsList}>
              {comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  postId={post.id}
                  onReply={handleReply}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      <CommentInput 
        onSend={handleSendComment}
        replyingTo={replyingTo?.username}
        onCancelReply={handleCancelReply}
      />
    </KeyboardAvoidingView>
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
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    lineHeight: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 4,
  },
  commentsSection: {
    padding: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  loadingComments: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  emptyComments: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCommentsText: {
    fontSize: 14,
    textAlign: 'center',
  },
  commentsList: {
    marginBottom: 16,
  },
});
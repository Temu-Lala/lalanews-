import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Comment } from '@/types';
import Avatar from '@/components/common/Avatar';
import { useThemeStore } from '@/store/useThemeStore';
import { useCommentStore } from '@/store/useCommentStore';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import i18n from '@/i18n';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReply: (commentId: string, username: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  postId,
  onReply 
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const { theme } = useThemeStore();
  const { likeComment } = useCommentStore();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return diffMins === 1 
        ? i18n.t('minuteAgo') 
        : `${diffMins} ${i18n.t('minutesAgo')}`;
    } else if (diffHours < 24) {
      return diffHours === 1 
        ? i18n.t('hourAgo') 
        : `${diffHours} ${i18n.t('hoursAgo')}`;
    } else if (diffDays < 7) {
      return diffDays === 1 
        ? i18n.t('dayAgo') 
        : `${diffDays} ${i18n.t('daysAgo')}`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const handleLike = () => {
    likeComment(postId, comment.id);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleReply = () => {
    onReply(comment.id, comment.user.username);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };
  
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.commentHeader}>
        <Avatar 
          source={comment.user.avatar} 
          size="small" 
          isVerified={comment.user.isVerified}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentBubble}>
            <Text style={[styles.username, { color: theme.colors.text }]}>
              {comment.user.name}
            </Text>
            <Text style={[styles.commentText, { color: theme.colors.text }]}>
              {comment.content}
            </Text>
          </View>
          
          <View style={styles.commentActions}>
            <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
              {formatDate(comment.createdAt)}
            </Text>
            
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                {i18n.t('like')} ({comment.likes})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleReply} style={styles.actionButton}>
              <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                {i18n.t('reply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {hasReplies && (
        <TouchableOpacity 
          style={styles.repliesToggle}
          onPress={toggleReplies}
          activeOpacity={0.7}
        >
          <Text style={[styles.repliesToggleText, { color: theme.colors.primary }]}>
            {showReplies 
              ? i18n.t('hideReplies')
              : i18n.t('showReplies', { count: comment.replies!.length })
            }
          </Text>
          {showReplies 
            ? <ChevronUp size={16} color={theme.colors.primary} />
            : <ChevronDown size={16} color={theme.colors.primary} />
          }
        </TouchableOpacity>
      )}
      
      {showReplies && hasReplies && (
        <View style={styles.repliesContainer}>
          {comment.replies!.map((reply) => (
            <View key={reply.id} style={styles.replyContainer}>
              <Avatar 
                source={reply.user.avatar} 
                size="small" 
                isVerified={reply.user.isVerified}
              />
              <View style={styles.commentContent}>
                <View style={styles.commentBubble}>
                  <Text style={[styles.username, { color: theme.colors.text }]}>
                    {reply.user.name}
                  </Text>
                  <Text style={[styles.commentText, { color: theme.colors.text }]}>
                    {reply.content}
                  </Text>
                </View>
                
                <View style={styles.commentActions}>
                  <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
                    {formatDate(reply.createdAt)}
                  </Text>
                  
                  <TouchableOpacity 
                    onPress={() => likeComment(postId, reply.id)} 
                    style={styles.actionButton}
                  >
                    <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
                      {i18n.t('like')} ({reply.likes})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentContent: {
    flex: 1,
    marginLeft: 8,
  },
  commentBubble: {
    backgroundColor: '#F0F2F5',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  username: {
    fontWeight: '600',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    marginRight: 16,
  },
  actionButton: {
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  repliesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
    marginTop: 8,
  },
  repliesToggleText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  repliesContainer: {
    marginLeft: 32,
    marginTop: 8,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
});

export default CommentItem;
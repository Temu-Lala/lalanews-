import { create } from 'zustand';
import { Comment } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useUserStore } from './useUserStore';

interface CommentState {
  comments: Record<string, Comment[]>; // postId -> comments
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addComment: (postId: string, content: string) => void;
  addReply: (postId: string, commentId: string, content: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  fetchComments: (postId: string) => Promise<void>;
  getComments: (postId: string) => Comment[];
}

export const useCommentStore = create<CommentState>()(
  persist(
    (set, get) => ({
      comments: {},
      isLoading: false,
      error: null,
      
      addComment: (postId, content) => {
        const currentUser = useUserStore.getState().currentUser;
        
        if (!currentUser) return;
        
        const newComment: Comment = {
          id: Date.now().toString(),
          user: currentUser,
          content,
          likes: 0,
          createdAt: new Date().toISOString(),
          replies: [],
        };
        
        set((state) => ({
          comments: {
            ...state.comments,
            [postId]: state.comments[postId] 
              ? [newComment, ...state.comments[postId]] 
              : [newComment]
          }
        }));
      },
      
      addReply: (postId, commentId, content) => {
        const currentUser = useUserStore.getState().currentUser;
        
        if (!currentUser) return;
        
        const newReply: Comment = {
          id: Date.now().toString(),
          user: currentUser,
          content,
          likes: 0,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => {
          const postComments = state.comments[postId] || [];
          
          const updatedComments = postComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies ? [newReply, ...comment.replies] : [newReply]
              };
            }
            return comment;
          });
          
          return {
            comments: {
              ...state.comments,
              [postId]: updatedComments
            }
          };
        });
      },
      
      likeComment: (postId, commentId) => {
        set((state) => {
          const postComments = state.comments[postId] || [];
          
          // Check if the comment is a top-level comment
          const commentIndex = postComments.findIndex(c => c.id === commentId);
          
          if (commentIndex !== -1) {
            // It's a top-level comment
            const updatedComments = [...postComments];
            updatedComments[commentIndex] = {
              ...updatedComments[commentIndex],
              likes: updatedComments[commentIndex].likes + 1
            };
            
            return {
              comments: {
                ...state.comments,
                [postId]: updatedComments
              }
            };
          } else {
            // It might be a reply
            const updatedComments = postComments.map(comment => {
              if (comment.replies) {
                const replyIndex = comment.replies.findIndex(r => r.id === commentId);
                
                if (replyIndex !== -1) {
                  const updatedReplies = [...comment.replies];
                  updatedReplies[replyIndex] = {
                    ...updatedReplies[replyIndex],
                    likes: updatedReplies[replyIndex].likes + 1
                  };
                  
                  return {
                    ...comment,
                    replies: updatedReplies
                  };
                }
              }
              return comment;
            });
            
            return {
              comments: {
                ...state.comments,
                [postId]: updatedComments
              }
            };
          }
        });
      },
      
      fetchComments: async (postId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call with a delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // In a real app, you would fetch from an API here
          // For now, we'll just use what's in the store
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: 'Failed to fetch comments',
            isLoading: false 
          });
        }
      },
      
      getComments: (postId) => {
        return get().comments[postId] || [];
      }
    }),
    {
      name: 'comment-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
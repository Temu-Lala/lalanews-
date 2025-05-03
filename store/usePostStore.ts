import { create } from 'zustand';
import { Post } from '@/types';
import { posts, communityPosts } from '@/mocks/posts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PostState {
  homePosts: Post[];
  communityPosts: Post[];
  savedPosts: Post[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  createPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  fetchPosts: () => Promise<void>;
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      homePosts: posts,
      communityPosts: communityPosts,
      savedPosts: [],
      isLoading: false,
      error: null,
      
      likePost: (postId: string) => {
        // Update home posts
        set((state) => ({
          homePosts: state.homePosts.map((post) => {
            if (post.id === postId) {
              const isLiked = post.isLiked || false;
              return {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !isLiked,
              };
            }
            return post;
          }),
          
          // Also update in community posts if exists
          communityPosts: state.communityPosts.map((post) => {
            if (post.id === postId) {
              const isLiked = post.isLiked || false;
              return {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !isLiked,
              };
            }
            return post;
          }),
          
          // Also update in saved posts if exists
          savedPosts: state.savedPosts.map((post) => {
            if (post.id === postId) {
              const isLiked = post.isLiked || false;
              return {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !isLiked,
              };
            }
            return post;
          }),
        }));
      },
      
      savePost: (postId: string) => {
        const { homePosts, communityPosts, savedPosts } = get();
        
        // Find the post in either home or community posts
        const post = [...homePosts, ...communityPosts].find((p) => p.id === postId);
        
        if (!post) return;
        
        const isSaved = post.isSaved || false;
        
        if (isSaved) {
          // Remove from saved posts
          set((state) => ({
            savedPosts: state.savedPosts.filter((p) => p.id !== postId),
            
            // Update isSaved flag in home posts
            homePosts: state.homePosts.map((p) => 
              p.id === postId ? { ...p, isSaved: false } : p
            ),
            
            // Update isSaved flag in community posts
            communityPosts: state.communityPosts.map((p) => 
              p.id === postId ? { ...p, isSaved: false } : p
            ),
          }));
        } else {
          // Add to saved posts
          set((state) => ({
            savedPosts: [...state.savedPosts, { ...post, isSaved: true }],
            
            // Update isSaved flag in home posts
            homePosts: state.homePosts.map((p) => 
              p.id === postId ? { ...p, isSaved: true } : p
            ),
            
            // Update isSaved flag in community posts
            communityPosts: state.communityPosts.map((p) => 
              p.id === postId ? { ...p, isSaved: true } : p
            ),
          }));
        }
      },
      
      createPost: (post) => {
        const newPost: Post = {
          ...post,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          likes: 0,
          comments: 0,
          shares: 0,
        };
        
        // Add to appropriate feed based on user verification status
        if (post.user.isVerified) {
          set((state) => ({
            homePosts: [newPost, ...state.homePosts],
          }));
        } else {
          set((state) => ({
            communityPosts: [newPost, ...state.communityPosts],
          }));
        }
      },
      
      fetchPosts: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call with a delay
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // In a real app, you would fetch from an API here
          set({ 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Failed to fetch posts',
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'post-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ savedPosts: state.savedPosts }),
    }
  )
);
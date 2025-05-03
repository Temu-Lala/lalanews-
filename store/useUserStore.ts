import { create } from 'zustand';
import { User } from '@/types';
import { currentUser, users } from '@/mocks/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  currentUser: User | null;
  users: User[];
  followedUsers: string[]; // IDs of users followed by current user
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentUser: (user: User) => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  fetchUsers: () => Promise<void>;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser,
      users,
      followedUsers: [],
      isLoading: false,
      error: null,
      
      setCurrentUser: (user) => {
        set({ currentUser: user });
      },
      
      updateProfile: async (updates) => {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set((state) => {
          const updatedUser = state.currentUser 
            ? { ...state.currentUser, ...updates }
            : null;
            
          // Also update the user in the users array
          const updatedUsers = state.users.map(user => 
            user.id === updatedUser?.id ? updatedUser : user
          );
          
          return {
            currentUser: updatedUser,
            users: updatedUsers
          };
        });
      },
      
      fetchUsers: async () => {
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
            error: 'Failed to fetch users',
            isLoading: false 
          });
        }
      },

      followUser: (userId) => {
        const { followedUsers, users } = get();
        
        // Don't follow if already following
        if (followedUsers.includes(userId)) return;
        
        // Update followed users list
        set((state) => ({
          followedUsers: [...state.followedUsers, userId],
          // Update followers count for the followed user
          users: state.users.map(user => 
            user.id === userId 
              ? { ...user, followers: user.followers + 1 } 
              : user
          )
        }));
      },
      
      unfollowUser: (userId) => {
        const { followedUsers } = get();
        
        // Don't unfollow if not following
        if (!followedUsers.includes(userId)) return;
        
        // Update followed users list
        set((state) => ({
          followedUsers: state.followedUsers.filter(id => id !== userId),
          // Update followers count for the unfollowed user
          users: state.users.map(user => 
            user.id === userId 
              ? { ...user, followers: Math.max(0, user.followers - 1) } 
              : user
          )
        }));
      },
      
      isFollowing: (userId) => {
        return get().followedUsers.includes(userId);
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        followedUsers: state.followedUsers
      }),
    }
  )
);
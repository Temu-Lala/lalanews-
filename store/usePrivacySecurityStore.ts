import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PrivacySecurityState {
  // Privacy settings
  privateAccount: boolean;
  showOnlineStatus: boolean;
  blockedUsers: string[];
  
  // Interaction settings
  allowTagging: boolean;
  allowMentions: boolean;
  showReadReceipts: boolean;
  
  // Security settings
  twoFactorEnabled: boolean;
  dataSharing: boolean;
  
  // Actions
  togglePrivateAccount: () => void;
  toggleOnlineStatus: () => void;
  toggleAllowTagging: () => void;
  toggleAllowMentions: () => void;
  toggleReadReceipts: () => void;
  toggleTwoFactor: () => void;
  toggleDataSharing: () => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  isUserBlocked: (userId: string) => boolean;
}

export const usePrivacySecurityStore = create<PrivacySecurityState>()(
  persist(
    (set, get) => ({
      // Privacy settings
      privateAccount: false,
      showOnlineStatus: true,
      blockedUsers: [],
      
      // Interaction settings
      allowTagging: true,
      allowMentions: true,
      showReadReceipts: true,
      
      // Security settings
      twoFactorEnabled: false,
      dataSharing: true,
      
      // Actions
      togglePrivateAccount: () => {
        set((state) => ({ privateAccount: !state.privateAccount }));
      },
      
      toggleOnlineStatus: () => {
        set((state) => ({ showOnlineStatus: !state.showOnlineStatus }));
      },
      
      toggleAllowTagging: () => {
        set((state) => ({ allowTagging: !state.allowTagging }));
      },
      
      toggleAllowMentions: () => {
        set((state) => ({ allowMentions: !state.allowMentions }));
      },
      
      toggleReadReceipts: () => {
        set((state) => ({ showReadReceipts: !state.showReadReceipts }));
      },
      
      toggleTwoFactor: () => {
        set((state) => ({ twoFactorEnabled: !state.twoFactorEnabled }));
      },
      
      toggleDataSharing: () => {
        set((state) => ({ dataSharing: !state.dataSharing }));
      },
      
      blockUser: (userId: string) => {
        const { blockedUsers, isUserBlocked } = get();
        
        // Don't add if already blocked
        if (isUserBlocked(userId)) return;
        
        set({ blockedUsers: [...blockedUsers, userId] });
      },
      
      unblockUser: (userId: string) => {
        const { blockedUsers } = get();
        
        set({
          blockedUsers: blockedUsers.filter((id) => id !== userId)
        });
      },
      
      isUserBlocked: (userId: string) => {
        return get().blockedUsers.includes(userId);
      },
    }),
    {
      name: 'privacy-security-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
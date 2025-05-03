import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { changeLanguage, getCurrentLocale } from '@/i18n';

interface LanguageState {
  currentLanguage: string;
  isRTL: boolean;
  setLanguage: (language: string) => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: getCurrentLocale() || 'en',
      isRTL: getCurrentLocale() === 'am', // Amharic is RTL
      
      setLanguage: async (language: string) => {
        await changeLanguage(language);
        set({
          currentLanguage: language,
          isRTL: language === 'am',
        });
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTheme, lightColors, darkColors } from '@/constants/colors';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  theme: ReturnType<typeof createTheme>;
  setThemeMode: (mode: ThemeMode) => void;
  updateThemeFromSystem: () => void;
}

// Initialize with default theme to avoid undefined
const defaultTheme = createTheme(false);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      isDarkMode: false,
      theme: defaultTheme,
      
      setThemeMode: (mode: ThemeMode) => {
        let isDark = false;
        
        if (mode === 'system') {
          // Get system preference using Appearance API instead of hook
          const colorScheme = Appearance.getColorScheme();
          isDark = colorScheme === 'dark';
        } else {
          isDark = mode === 'dark';
        }
        
        set({
          themeMode: mode,
          isDarkMode: isDark,
          theme: createTheme(isDark),
        });
      },
      
      updateThemeFromSystem: () => {
        const { themeMode } = get();
        
        if (themeMode === 'system') {
          // Use Appearance API instead of hook
          const colorScheme = Appearance.getColorScheme();
          const isDark = colorScheme === 'dark';
          
          set({
            isDarkMode: isDark,
            theme: createTheme(isDark),
          });
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themeMode: state.themeMode }),
    }
  )
);
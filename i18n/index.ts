import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './translations/en';
import am from './translations/am';

// Create i18n instance
const i18n = new I18n({
  en,
  am,
});

// Set the locale once at the beginning of your app
export const setupI18n = async () => {
  try {
    // Try to get stored language
    const storedLanguage = await AsyncStorage.getItem('user-language');
    
    if (storedLanguage) {
      i18n.locale = storedLanguage;
    } else {
      // Fallback to device locale or English
      const deviceLocale = getLocales()[0]?.languageCode;
      i18n.locale = deviceLocale && ['en', 'am'].includes(deviceLocale) 
        ? deviceLocale 
        : 'en';
    }
  } catch (error) {
    console.error('Failed to load language:', error);
    i18n.locale = 'en'; // Default to English on error
  }
  
  // Configure fallbacks
  i18n.enableFallback = true;
  i18n.defaultLocale = 'en';
};

// Function to change language
export const changeLanguage = async (locale: string) => {
  try {
    i18n.locale = locale;
    await AsyncStorage.setItem('user-language', locale);
  } catch (error) {
    console.error('Failed to save language:', error);
  }
};

// Helper function to get current locale
export const getCurrentLocale = () => i18n.locale;

// Export the i18n instance
export default i18n;
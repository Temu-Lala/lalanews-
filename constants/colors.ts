// Color palette for the app
export const lightColors = {
  // Primary colors
  primary: '#4A80F0', // Soft blue as primary color
  secondary: '#F3A8FF', // Soft purple as secondary color
  
  // UI colors
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#1A1D1F',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  
  // Status colors
  success: '#4CD964',
  error: '#FF3B30',
  warning: '#FFCC00',
  
  // Social interaction colors
  like: '#FF3B30',
  comment: '#4A80F0',
  share: '#4CD964',
  
  // Gradients
  gradientStart: '#4A80F0',
  gradientEnd: '#56CCF2',
  
  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#4A80F0',
  tabBarInactive: '#ADB5BD',
};

export const darkColors = {
  // Primary colors
  primary: '#5D8DF7', // Brighter blue for dark mode
  secondary: '#F3A8FF', // Same purple
  
  // UI colors
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  
  // Status colors
  success: '#4CD964',
  error: '#FF453A',
  warning: '#FFD60A',
  
  // Social interaction colors
  like: '#FF453A',
  comment: '#5D8DF7',
  share: '#4CD964',
  
  // Gradients
  gradientStart: '#5D8DF7',
  gradientEnd: '#56CCF2',
  
  // Tab bar
  tabBarBackground: '#1E1E1E',
  tabBarActive: '#5D8DF7',
  tabBarInactive: '#777777',
};

// Default spacing, border radius, and font size values
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 24,
  full: 9999,
};

const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Theme object for consistent styling
export const createTheme = (isDark: boolean) => {
  const colors = isDark ? darkColors : lightColors;
  
  return {
    colors,
    spacing,
    borderRadius,
    fontSize,
    fontWeight,
  };
};

// Export a default theme (light) for static references
export const theme = createTheme(false);
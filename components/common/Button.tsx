import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const { theme } = useThemeStore();

  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryContainer;
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'ghost':
        return styles.ghostContainer;
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallContainer;
      case 'medium':
        return styles.mediumContainer;
      case 'large':
        return styles.largeContainer;
      default:
        return styles.mediumContainer;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getContainerStyle(),
        getSizeStyle(),
        { borderRadius: theme.borderRadius.md },
        style,
        props.disabled && styles.disabledContainer,
        variant === 'primary' && { backgroundColor: theme.colors.primary },
        variant === 'secondary' && { backgroundColor: theme.colors.secondary },
        variant === 'outline' && { 
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary 
        },
      ]}
      activeOpacity={0.8}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : 'white'} 
          size="small" 
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text 
            style={[
              styles.text, 
              getTextStyle(), 
              getTextSizeStyle(), 
              variant === 'primary' && { color: 'white' },
              variant === 'secondary' && { color: theme.colors.text },
              variant === 'outline' && { color: theme.colors.primary },
              variant === 'ghost' && { color: theme.colors.primary },
              textStyle,
              props.disabled && styles.disabledText,
              leftIcon && { marginLeft: 8 },
              rightIcon && { marginRight: 8 },
            ]}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
  },
  // Variants
  primaryContainer: {
    // Colors applied inline
  },
  primaryText: {
    // Colors applied inline
  },
  secondaryContainer: {
    // Colors applied inline
  },
  secondaryText: {
    // Colors applied inline
  },
  outlineContainer: {
    // Colors applied inline
  },
  outlineText: {
    // Colors applied inline
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    // Colors applied inline
  },
  // Sizes
  smallContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  smallText: {
    fontSize: 12,
  },
  mediumContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  mediumText: {
    fontSize: 14,
  },
  largeContainer: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  largeText: {
    fontSize: 16,
  },
  // Disabled
  disabledContainer: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button;
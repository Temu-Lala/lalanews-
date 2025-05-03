import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useThemeStore } from '@/store/useThemeStore';
import { CheckCircle } from 'lucide-react-native';

interface AvatarProps {
  source: string;
  size?: 'small' | 'medium' | 'large' | number;
  style?: ViewStyle;
  isVerified?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'medium',
  style,
  isVerified = false,
}) => {
  const { theme } = useThemeStore();
  
  const getSize = () => {
    if (typeof size === 'number') return size;
    
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      default:
        return 48;
    }
  };

  const avatarSize = getSize();
  const borderColor = theme?.colors?.background || '#FFFFFF';
  const badgeColor = theme?.colors?.primary || '#4A80F0';
  const borderColorFallback = theme?.colors?.border || '#E9ECEF';

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: source }}
        style={[
          {
            width: avatarSize, 
            height: avatarSize, 
            borderRadius: avatarSize / 2,
            backgroundColor: borderColorFallback
          }
        ]}
        contentFit="cover"
        transition={200}
      />
      {isVerified && (
        <View 
          style={[
            styles.verifiedBadge,
            { 
              right: -2,
              bottom: -2,
            }
          ]}
        >
          <CheckCircle 
            size={avatarSize / 3} 
            color={badgeColor} 
            fill="white"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    borderRadius: 999,
  },
});

export default Avatar;
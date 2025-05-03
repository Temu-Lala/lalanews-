import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { X, Video as VideoIcon } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';

interface MediaPreviewProps {
  images: string[];
  videos: string[];
  onRemove: (type: 'image' | 'video', index: number) => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  images, 
  videos, 
  onRemove 
}) => {
  const { theme } = useThemeStore();
  
  if (images.length === 0 && videos.length === 0) return null;
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((uri, index) => (
          <View key={`image-${index}`} style={styles.mediaContainer}>
            <Image
              source={{ uri }}
              style={styles.media}
              contentFit="cover"
            />
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: theme.colors.error }]}
              onPress={() => onRemove('image', index)}
            >
              <X size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        
        {videos.map((uri, index) => (
          <View key={`video-${index}`} style={styles.mediaContainer}>
            <Image
              source={{ uri }}
              style={styles.media}
              contentFit="cover"
            />
            <View style={styles.videoIndicator}>
              <VideoIcon size={20} color="white" />
            </View>
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: theme.colors.error }]}
              onPress={() => onRemove('video', index)}
            >
              <X size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  mediaContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MediaPreview;
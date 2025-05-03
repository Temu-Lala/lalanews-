import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { X, Image as ImageIcon, Video, Smile } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { usePostStore } from '@/store/usePostStore';
import { useUserStore } from '@/store/useUserStore';
import { useThemeStore } from '@/store/useThemeStore';
import Button from '@/components/common/Button';
import EmojiPicker from '@/components/comment/EmojiPicker';
import i18n from '@/i18n';

export default function CreatePostScreen() {
  const router = useRouter();
  const { createPost } = usePostStore();
  const { currentUser } = useUserStore();
  const { theme } = useThemeStore();
  
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const handleClose = () => {
    router.back();
  };
  
  const handlePickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Add new images to existing images array
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };
  
  const handlePickVideo = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideos([...videos, result.assets[0].uri]);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleRemoveVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleSubmit = () => {
    if (!content.trim() && images.length === 0 && videos.length === 0) return;
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    // Create new post with all required fields
    createPost({
      user: currentUser,
      content: content.trim(),
      images: images.length > 0 ? images : undefined,
      videos: videos.length > 0 ? videos : undefined,
      likes: 0,
      comments: 0,
      shares: 0,
    });
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Navigate back
    router.back();
  };
  
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  
  const handleEmojiSelected = (emoji: string) => {
    setContent(prev => prev + emoji);
  };
  
  const isDisabled = (!content.trim() && images.length === 0 && videos.length === 0) || isSubmitting;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: i18n.t('createPost'),
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Button
              title={i18n.t('post')}
              size="small"
              disabled={isDisabled}
              isLoading={isSubmitting}
              onPress={handleSubmit}
            />
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder={i18n.t('whatsOnYourMind')}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
          />
          
          {images.length > 0 && (
            <View style={styles.imagesContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: image }}
                    style={styles.image}
                    contentFit="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {videos.length > 0 && (
            <View style={styles.videosContainer}>
              {videos.map((video, index) => (
                <View key={index} style={styles.videoWrapper}>
                  <Image
                    source={{ uri: video }}
                    style={styles.video}
                    contentFit="cover"
                  />
                  <View style={styles.videoOverlay}>
                    <Video size={24} color="white" />
                  </View>
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => handleRemoveVideo(index)}
                  >
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      {showEmojiPicker && (
        <EmojiPicker onEmojiSelected={handleEmojiSelected} />
      )}
      
      <View style={[
        styles.footer, 
        { 
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.background 
        }
      ]}>
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={handlePickImage}
          activeOpacity={0.7}
        >
          <ImageIcon size={24} color={theme.colors.primary} />
          <Text style={[styles.mediaButtonText, { color: theme.colors.primary }]}>
            {i18n.t('addPhoto')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={handlePickVideo}
          activeOpacity={0.7}
        >
          <Video size={24} color={theme.colors.primary} />
          <Text style={[styles.mediaButtonText, { color: theme.colors.primary }]}>
            {i18n.t('addVideo')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={toggleEmojiPicker}
          activeOpacity={0.7}
        >
          <Smile size={24} color={theme.colors.primary} />
          <Text style={[styles.mediaButtonText, { color: theme.colors.primary }]}>
            {i18n.t('addEmoji')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    marginRight: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  input: {
    fontSize: 18,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  imageWrapper: {
    position: 'relative',
    width: '48%',
    aspectRatio: 1,
    marginBottom: 8,
    marginRight: '4%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videosContainer: {
    marginTop: 16,
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16/9,
    marginBottom: 8,
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 999,
    padding: 4,
  },
  footer: {
    borderTopWidth: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  mediaButtonText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
});
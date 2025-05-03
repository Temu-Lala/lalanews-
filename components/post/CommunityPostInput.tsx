import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text,
  Platform,
  Keyboard,
  Animated
} from 'react-native';
import { Image as ImageIcon, Video, Smile, Camera, Send } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { usePostStore } from '@/store/usePostStore';
import { useUserStore } from '@/store/useUserStore';
import { useThemeStore } from '@/store/useThemeStore';
import Avatar from '@/components/common/Avatar';
import EmojiPicker from '@/components/comment/EmojiPicker';
import i18n from '@/i18n';
import { MediaPreview } from './MediaPreview';

export const CommunityPostInput: React.FC = () => {
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { createPost } = usePostStore();
  const { currentUser } = useUserStore();
  const { theme } = useThemeStore();
  
  const inputRef = useRef<TextInput>(null);
  const expandAnimation = useRef(new Animated.Value(0)).current;
  
  const expandInput = () => {
    setIsExpanded(true);
    Animated.timing(expandAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    inputRef.current?.focus();
  };
  
  const collapseInput = () => {
    Keyboard.dismiss();
    setShowEmojiPicker(false);
    
    Animated.timing(expandAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setIsExpanded(false);
      setText('');
      setImages([]);
      setVideos([]);
    });
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
      allowsEditing: false,
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
      
      // Expand the input if not already expanded
      if (!isExpanded) {
        expandInput();
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
      
      // Expand the input if not already expanded
      if (!isExpanded) {
        expandInput();
      }
    }
  };
  
  const handleTakePhoto = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Expand the input if not already expanded
      if (!isExpanded) {
        expandInput();
      }
    }
  };
  
  const handleRemoveMedia = (type: 'image' | 'video', index: number) => {
    if (type === 'image') {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    } else {
      const newVideos = [...videos];
      newVideos.splice(index, 1);
      setVideos(newVideos);
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const toggleEmojiPicker = () => {
    // Always expand input when showing emoji picker
    if (!isExpanded) {
      expandInput();
    }
    
    setShowEmojiPicker(!showEmojiPicker);
    
    // If opening emoji picker, dismiss keyboard
    if (!showEmojiPicker) {
      Keyboard.dismiss();
    } else {
      // If closing emoji picker, focus input
      inputRef.current?.focus();
    }
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleEmojiSelected = (emoji: string) => {
    setText(prev => prev + emoji);
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleSubmit = () => {
    if (!currentUser) return;
    if ((!text.trim() && images.length === 0 && videos.length === 0) || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Create new post with all required fields
    createPost({
      user: currentUser,
      content: text.trim(),
      images: images.length > 0 ? images : undefined,
      videos: videos.length > 0 ? videos : undefined,
      likes: 0,
      comments: 0,
      shares: 0,
    });
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Reset state
    setIsSubmitting(false);
    collapseInput();
  };
  
  const inputHeight = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [56, 120]
  });
  
  const hasMedia = images.length > 0 || videos.length > 0;
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.border 
      }
    ]}>
      <Animated.View style={[
        styles.inputContainer,
        { height: inputHeight }
      ]}>
        <Avatar 
          source={currentUser?.avatar || ''} 
          size="small"
          isVerified={currentUser?.isVerified}
        />
        
        <TouchableOpacity 
          style={[
            styles.inputWrapper, 
            { 
              backgroundColor: theme.colors.card,
              borderColor: isExpanded ? theme.colors.primary : theme.colors.border
            }
          ]}
          onPress={expandInput}
          activeOpacity={0.8}
        >
          {isExpanded ? (
            <TextInput
              ref={inputRef}
              style={[
                styles.input, 
                { color: theme.colors.text }
              ]}
              placeholder={i18n.t('whatsOnYourMind')}
              placeholderTextColor={theme.colors.textSecondary}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={1000}
              onFocus={() => setShowEmojiPicker(false)}
            />
          ) : (
            <Text style={[styles.placeholder, { color: theme.colors.textSecondary }]}>
              {i18n.t('whatsOnYourMind')}
            </Text>
          )}
        </TouchableOpacity>
        
        {isExpanded && (
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!text.trim() && !hasMedia) && styles.sendButtonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={(!text.trim() && !hasMedia) || isSubmitting}
            activeOpacity={0.7}
          >
            <Send 
              size={20} 
              color={(!text.trim() && !hasMedia) ? theme.colors.textSecondary : theme.colors.primary} 
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {isExpanded && hasMedia && (
        <MediaPreview 
          images={images}
          videos={videos}
          onRemove={handleRemoveMedia}
        />
      )}
      
      <View style={[
        styles.actionBar, 
        { 
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.background 
        }
      ]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handlePickImage}
          activeOpacity={0.7}
        >
          <ImageIcon size={20} color={theme.colors.primary} />
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>
            {i18n.t('photo')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handlePickVideo}
          activeOpacity={0.7}
        >
          <Video size={20} color={theme.colors.primary} />
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>
            {i18n.t('video')}
          </Text>
        </TouchableOpacity>
        
        {Platform.OS !== 'web' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTakePhoto}
            activeOpacity={0.7}
          >
            <Camera size={20} color={theme.colors.primary} />
            <Text style={[styles.actionText, { color: theme.colors.primary }]}>
              {i18n.t('camera')}
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            showEmojiPicker && styles.activeActionButton
          ]}
          onPress={toggleEmojiPicker}
          activeOpacity={0.7}
        >
          <Smile 
            size={20} 
            color={showEmojiPicker ? theme.colors.secondary : theme.colors.primary} 
          />
          <Text 
            style={[
              styles.actionText, 
              { color: showEmojiPicker ? theme.colors.secondary : theme.colors.primary }
            ]}
          >
            {i18n.t('emoji')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {showEmojiPicker && (
        <EmojiPicker onEmojiSelected={handleEmojiSelected} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    maxHeight: 100,
  },
  placeholder: {
    fontSize: 14,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
  },
  activeActionButton: {
    backgroundColor: 'rgba(243, 168, 255, 0.2)', // Light version of secondary color
  },
  actionText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default CommunityPostInput;
import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Keyboard,
  Platform,
  Animated,
  Text
} from 'react-native';
import { Send, Smile } from 'lucide-react-native';
import Avatar from '@/components/common/Avatar';
import { useThemeStore } from '@/store/useThemeStore';
import { useUserStore } from '@/store/useUserStore';
import * as Haptics from 'expo-haptics';
import EmojiPicker from './EmojiPicker';
import i18n from '@/i18n';

interface CommentInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  replyingTo?: string;
  onCancelReply?: () => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSend,
  placeholder = i18n.t('writeAComment'),
  replyingTo,
  onCancelReply,
}) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { theme } = useThemeStore();
  const { currentUser } = useUserStore();
  const inputRef = useRef<TextInput>(null);
  
  const handleSend = () => {
    if (text.trim() === '') return;
    
    onSend(text.trim());
    setText('');
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Close emoji picker if open
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
    }
    
    // Clear reply state if replying
    if (replyingTo && onCancelReply) {
      onCancelReply();
    }
    
    // Dismiss keyboard
    Keyboard.dismiss();
  };
  
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    
    // If opening emoji picker, dismiss keyboard
    if (!showEmojiPicker) {
      Keyboard.dismiss();
    } else {
      // If closing emoji picker, focus input
      inputRef.current?.focus();
    }
  };
  
  const handleEmojiSelected = (emoji: string) => {
    setText(prev => prev + emoji);
  };
  
  const handleCancelReply = () => {
    if (onCancelReply) {
      onCancelReply();
    }
  };

  return (
    <View style={styles.container}>
      {replyingTo && (
        <View style={[
          styles.replyingToContainer, 
          { backgroundColor: theme.colors.card }
        ]}>
          <Text style={[styles.replyingToText, { color: theme.colors.textSecondary }]}>
            {i18n.t('replyingTo')} @{replyingTo}
          </Text>
          <TouchableOpacity onPress={handleCancelReply}>
            <Text style={[styles.cancelText, { color: theme.colors.primary }]}>
              {i18n.t('cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <Avatar 
          source={currentUser?.avatar || ''} 
          size="small"
        />
        
        <View style={[
          styles.inputWrapper, 
          { 
            backgroundColor: theme.colors.card,
            borderColor: showEmojiPicker ? theme.colors.primary : theme.colors.border
          }
        ]}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input, 
              { color: theme.colors.text }
            ]}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={1000}
          />
          
          <View style={styles.inputActions}>
            <TouchableOpacity 
              style={styles.emojiButton} 
              onPress={toggleEmojiPicker}
              activeOpacity={0.7}
            >
              <Smile 
                size={24} 
                color={showEmojiPicker ? theme.colors.primary : theme.colors.textSecondary} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                text.trim() === '' && styles.sendButtonDisabled
              ]} 
              onPress={handleSend}
              disabled={text.trim() === ''}
              activeOpacity={0.7}
            >
              <Send 
                size={20} 
                color={text.trim() === '' ? theme.colors.textSecondary : theme.colors.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>
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
  },
  replyingToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  replyingToText: {
    fontSize: 12,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 8,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  emojiButton: {
    marginRight: 8,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default CommentInput;
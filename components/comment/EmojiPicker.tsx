import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import * as Haptics from 'expo-haptics';

interface EmojiPickerProps {
  onEmojiSelected: (emoji: string) => void;
}

// Common emojis grouped by category
const EMOJIS = {
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  emotions: ['😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗'],
  gestures: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '✋', '🤚', '👋', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🦾', '🖐️', '✍️', '🤳', '💅', '🦵', '🦶'],
  people: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳‍♂️', '🧕', '👮‍♀️', '👮‍♂️', '👷‍♀️', '👷‍♂️', '💂‍♀️', '💂‍♂️', '🕵️‍♀️', '🕵️‍♂️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇'],
  food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠'],
  activities: ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳️', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸', '🥌', '🎿'],
  travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝'],
  objects: ['⌚️', '📱', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚'],
  symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️'],
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelected }) => {
  const { theme } = useThemeStore();
  const [activeCategory, setActiveCategory] = React.useState<keyof typeof EMOJIS>('smileys');
  
  const handleEmojiPress = (emoji: string) => {
    onEmojiSelected(emoji);
    
    // Provide haptic feedback on native platforms
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleCategoryPress = (category: keyof typeof EMOJIS) => {
    setActiveCategory(category);
    
    // Provide haptic feedback on native platforms
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const renderCategoryTabs = () => {
    return Object.keys(EMOJIS).map((category) => (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryTab,
          activeCategory === category && { 
            borderBottomColor: theme.colors.primary,
            borderBottomWidth: 2,
            backgroundColor: 'rgba(74, 128, 240, 0.1)', // Light version of primary color
          }
        ]}
        onPress={() => handleCategoryPress(category as keyof typeof EMOJIS)}
      >
        <Text style={styles.categoryText}>
          {getCategoryEmoji(category as keyof typeof EMOJIS)}
        </Text>
      </TouchableOpacity>
    ));
  };
  
  const getCategoryEmoji = (category: keyof typeof EMOJIS): string => {
    switch (category) {
      case 'smileys': return '😀';
      case 'emotions': return '😢';
      case 'gestures': return '👍';
      case 'people': return '👨‍👩‍👧‍👦';
      case 'animals': return '🐶';
      case 'food': return '🍔';
      case 'activities': return '⚽️';
      case 'travel': return '✈️';
      case 'objects': return '💻';
      case 'symbols': return '❤️';
      default: return '😀';
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.card,
        borderTopColor: theme.colors.border,
      }
    ]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[
          styles.categoriesContainer,
          { borderBottomColor: theme.colors.border }
        ]}
      >
        {renderCategoryTabs()}
      </ScrollView>
      
      <ScrollView style={styles.emojiScrollView}>
        <View style={styles.emojiGrid}>
          {EMOJIS[activeCategory].map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={styles.emojiButton}
              onPress={() => handleEmojiPress(emoji)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    height: 250,
  },
  categoriesContainer: {
    flexDirection: 'row',
    height: 50,
    borderBottomWidth: 1,
  },
  categoryTab: {
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 22,
  },
  emojiScrollView: {
    flex: 1,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  emojiButton: {
    width: '14.28%', // 7 emojis per row
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
});

export default EmojiPicker;
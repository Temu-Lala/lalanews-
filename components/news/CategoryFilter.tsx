import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import i18n from '@/i18n';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const { theme } = useThemeStore();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.background,
        borderBottomColor: theme.colors.border 
      }
    ]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryItem,
            { backgroundColor: selectedCategory === null ? theme.colors.primary : theme.colors.card }
          ]}
          onPress={() => onSelectCategory(null)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.categoryText,
              { color: selectedCategory === null ? 'white' : theme.colors.textSecondary }
            ]}
          >
            {i18n.t('allNews')}
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryItem,
              { backgroundColor: selectedCategory === category ? theme.colors.primary : theme.colors.card }
            ]}
            onPress={() => onSelectCategory(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                { color: selectedCategory === category ? 'white' : theme.colors.textSecondary }
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 9999,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CategoryFilter;
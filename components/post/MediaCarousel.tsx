import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Video } from 'expo-av';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';

interface MediaCarouselProps {
  images: string[];
  videos: string[];
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 32; // Full width minus padding

export const MediaCarousel: React.FC<MediaCarouselProps> = ({ images, videos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useThemeStore();
  
  // Combine images and videos into a single media array
  const media = [
    ...images.map(url => ({ type: 'image', url })),
    ...videos.map(url => ({ type: 'video', url }))
  ];
  
  if (media.length === 0) return null;
  
  // If there's only one media item, just show it without carousel controls
  if (media.length === 1) {
    return (
      <View style={styles.singleContainer}>
        {media[0].type === 'image' ? (
          <Image
            source={{ uri: media[0].url }}
            style={styles.singleMedia}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <Video
            source={{ uri: media[0].url }}
            style={styles.singleMedia}
            useNativeControls
            resizeMode="cover"
            isLooping={false}
          />
        )}
      </View>
    );
  }
  
  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / ITEM_WIDTH);
    setActiveIndex(index);
  };
  
  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * ITEM_WIDTH, animated: true });
    }
  };
  
  const scrollViewRef = React.useRef<ScrollView>(null);
  
  const goToPrevious = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (activeIndex < media.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {media.map((item, index) => (
          <View key={index} style={styles.mediaContainer}>
            {item.type === 'image' ? (
              <Image
                source={{ uri: item.url }}
                style={styles.media}
                contentFit="cover"
                transition={300}
              />
            ) : (
              <Video
                source={{ uri: item.url }}
                style={styles.media}
                useNativeControls
                resizeMode="cover"
                isLooping={false}
              />
            )}
          </View>
        ))}
      </ScrollView>
      
      {/* Pagination indicators */}
      <View style={styles.pagination}>
        {media.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === activeIndex 
                  ? theme.colors.primary 
                  : theme.colors.border,
              },
            ]}
          />
        ))}
      </View>
      
      {/* Navigation arrows */}
      {activeIndex > 0 && (
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonLeft]}
          onPress={goToPrevious}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
      )}
      
      {activeIndex < media.length - 1 && (
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonRight]}
          onPress={goToNext}
          activeOpacity={0.7}
        >
          <ChevronRight size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
  },
  scrollView: {
    width: ITEM_WIDTH,
  },
  scrollContent: {
    alignItems: 'center',
  },
  mediaContainer: {
    width: ITEM_WIDTH,
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  singleContainer: {
    width: ITEM_WIDTH,
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  singleMedia: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonLeft: {
    left: 10,
  },
  navButtonRight: {
    right: 10,
  },
});

export default MediaCarousel;
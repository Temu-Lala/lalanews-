import { create } from 'zustand';
import { NewsItem } from '@/types';
import { newsItems } from '@/mocks/news';

interface NewsState {
  news: NewsItem[];
  filteredNews: NewsItem[];
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNews: () => Promise<void>;
  filterByCategory: (category: string | null) => void;
}

export const useNewsStore = create<NewsState>()((set, get) => ({
  news: newsItems,
  filteredNews: newsItems,
  selectedCategory: null,
  isLoading: false,
  error: null,
  
  fetchNews: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch from an API here
      set({ 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch news',
        isLoading: false 
      });
    }
  },
  
  filterByCategory: (category) => {
    const { news } = get();
    
    if (!category) {
      set({ 
        filteredNews: news,
        selectedCategory: null 
      });
    } else {
      set({ 
        filteredNews: news.filter((item) => item.category === category),
        selectedCategory: category 
      });
    }
  },
}));
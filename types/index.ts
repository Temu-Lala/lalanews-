export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  isVerified: boolean;
  followers: number;
  following: number;
  joinedDate: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  images?: string[];
  videos?: string[];
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  likes: number;
  createdAt: string;
  replies?: Comment[];
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  source: string;
  category: string;
  createdAt: string;
  isOfficial: boolean;
}
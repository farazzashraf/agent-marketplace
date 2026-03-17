export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: 'developer' | 'consumer';
  followers: string[];
  following: string[];
}

export interface Developer extends User {
  role: 'developer';
  availableForHire: boolean;
  rating: number;
  completedProjects: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Agent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  upvotes: number;
  commentsCount: number;
  developer: Developer;
  categories: string[];
  imageUrl: string;
  pricing: string;
  reviews: Review[];
  userVote?: 'up' | 'down' | null;
  views?: number;
  clicks?: number;
}

export interface PostReply {
  id: string;
  authorName: string;
  authorRole: 'Developer' | 'Consumer' | 'User' | 'AI';
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean; // NEW: Track if the current user liked the reply
  isAiResponse?: boolean;
}

export interface Post {
  id: string;
  authorName: string;
  authorRole: 'Developer' | 'Consumer' | 'User';
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isBookmarked?: boolean; // NEW: Track if the current user bookmarked the post
  tags?: string[];
  replies?: PostReply[];
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  agentIds: string[];
  creator: Developer;
  upvotes: number;
  imageUrl: string;
}
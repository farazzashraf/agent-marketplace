import { Agent, Developer, User, Post } from './types';

export const mockConsumers: User[] = [
  {
    id: 'c1',
    name: 'David Kim',
    avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=random',
    bio: 'Product Manager looking for AI tools to automate workflows.',
    role: 'consumer',
    followers: ['d1'],
    following: ['d1', 'd2'],
  },
  {
    id: 'c2',
    name: 'Elena Rodriguez',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random',
    bio: 'Marketing director exploring AI content generation.',
    role: 'consumer',
    followers: [],
    following: ['d3'],
  }
];

export const mockDevelopers: Developer[] = [
  {
    id: 'd1',
    name: 'Alice Chen',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Chen&background=random',
    bio: 'Ex-OpenAI researcher building autonomous workflow agents. Specializes in LangChain and multi-agent systems.',
    role: 'developer',
    followers: ['c1', 'd2'],
    following: ['c1'],
    availableForHire: true,
    rating: 4.9,
    completedProjects: 12,
  },
  {
    id: 'd2',
    name: 'Marcus Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=random',
    bio: 'Full-stack AI developer. I build agents that integrate deeply with your existing SaaS tools.',
    role: 'developer',
    followers: ['c1'],
    following: ['d1'],
    availableForHire: true,
    rating: 4.7,
    completedProjects: 8,
  },
  {
    id: 'd3',
    name: 'Sarah Lee',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Lee&background=random',
    bio: 'Focused on voice-native AI agents and customer support automation.',
    role: 'developer',
    followers: ['c2'],
    following: [],
    availableForHire: false,
    rating: 4.8,
    completedProjects: 24,
  }
];

export const allMockUsers: User[] = [...mockDevelopers, ...mockConsumers];

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'AutoWriter Pro',
    tagline: 'Generates SEO-optimized blog posts in seconds.',
    description: 'An AI assistant that researches and writes complete articles based on a single keyword.',
    categories: ['Writing Assistant', 'Marketing'],
    pricing: 'Freemium',
    developer: mockDevelopers[0], // Using the properly typed mock developer
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200',
    upvotes: 342,
    commentsCount: 28,
    userVote: null,
    reviews: []
  },
  {
    id: '2',
    name: 'CodeBuddy',
    tagline: 'Your AI pair programmer.',
    description: 'Fixes bugs, writes unit tests, and refactors code right in your IDE.',
    categories: ['Developer Tools', 'Productivity'],
    pricing: '$15/mo',
    developer: mockDevelopers[1], // Using the properly typed mock developer
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200',
    
    // imageUrl: 'https://images.unsplash.com/photo-1678286599522-cb5287f3b60e?auto=format&fit=crop&q=80&w=200',
    upvotes: 512,
    commentsCount: 45,
    userVote: 'up',
    reviews: []
  },
  {
    id: '3',
    name: 'SoraClip',
    tagline: 'Text to high-definition video generation.',
    description: 'Generate hyper-realistic b-roll and explainer videos from text prompts.',
    categories: ['Video Generator'],
    pricing: '$30/mo',
    developer: mockDevelopers[2], // Using the properly typed mock developer
    imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?auto=format&fit=crop&q=80&w=200',
    upvotes: 890,
    commentsCount: 112,
    userVote: null,
    reviews: []
  },
  {
    id: '4',
    name: 'MidCanvas',
    tagline: 'Advanced AI image generation with precise control.',
    description: 'Create logos, illustrations, and photorealistic images with easy slider controls.',
    categories: ['Image Generator', 'Productivity'],
    pricing: '$10/mo',
    developer: mockDevelopers[0], // Using the properly typed mock developer
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=200',
    
    // imageUrl: 'https://images.unsplash.com/photo-1682687982501-1e58f813f228?auto=format&fit=crop&q=80&w=200',
    upvotes: 750,
    commentsCount: 89,
    userVote: null,
    reviews: []
  },
  {
    id: '5',
    name: 'VoiceClone',
    tagline: 'Ultra-realistic text-to-speech.',
    description: 'Clone your voice with 3 seconds of audio or choose from 1000+ realistic AI voices.',
    categories: ['Audio & Voice', 'Video Generator'],
    pricing: 'Free',
    developer: mockDevelopers[1], // Using the properly typed mock developer
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=200',
    upvotes: 210,
    commentsCount: 15,
    userVote: null,
    reviews: []
  }
];

export const mockPosts: Post[] = [
  {
    id: 'p6',
    authorName: 'Elena Rodriguez',
    authorRole: 'Consumer',
    authorAvatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random',
    content: 'I recently started using @MidCanvas for our ad creatives and the level of control is insane! Has anyone managed to hook it up to an automated pipeline? Also heavily testing out @AutoWriter Pro for the copy.',
    timestamp: '15 minutes ago',
    likes: 42,
    comments: 1,
    isLiked: false,
    tags: ['Marketing', 'Productivity', 'Help'],
    replies: [
      {
        id: 'r3',
        authorName: 'Alice Chen',
        authorRole: 'Developer',
        authorAvatar: 'https://ui-avatars.com/api/?name=Alice+Chen&background=random',
        content: 'Yes! We wrote a small LangChain script to pipe the SEO output from @AutoWriter Pro directly into the prompt generator for @MidCanvas. It works like a charm. Let me know if you want the snippet!',
        timestamp: '5 minutes ago',
        likes: 12
      }
    ]
  },
  // --- TOP POST ---
  {
    id: 'p5',
    authorName: 'Marcus Johnson',
    authorRole: 'Developer',
    authorAvatar: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=random',
    content: 'Just pushed a massive update to CodeBuddy! V2.0 now supports direct integration with VS Code Live Share. You can literally watch the agent type the code in real-time alongside you.',
    timestamp: '2 days ago',
    likes: 512,
    comments: 89,
    isLiked: true,
    isBookmarked: true,
    tags: ['Developer Tools', 'Updates', 'Showcase'],
    replies: []
  },
  // --- TOP POST ---
  {
    id: 'p3',
    authorName: 'Alice Chen',
    authorRole: 'Developer',
    authorAvatar: 'https://ui-avatars.com/api/?name=Alice+Chen&background=random',
    content: 'I see a lot of requests for data extraction agents. \n\n**Pro-tip:** when requesting a custom agent, please provide sample data structures (like a target `JSON` schema)! It cuts development time in half. \n\nWhat to include:\n- The source URL or Document type\n- The specific fields you need extracted\n- The final output format you want (`CSV`, `JSON`, `Postgres`)\n\n🚀',
    timestamp: '5 hours ago',
    likes: 342,
    comments: 45,
    isLiked: false,
    tags: ['Productivity', 'Tips', 'Development'],
    replies: []
  },
  // --- LATEST ---
  {
    id: 'p1',
    authorName: 'Sarah Lee',
    authorRole: 'Developer',
    authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Lee&background=random',
    content: 'Just updated DevOpsBot to handle Kubernetes cluster autoscaling! Anyone want to beta test the new feature? Looking for feedback from teams managing `>50 nodes`.',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 2,
    isLiked: false,
    tags: ['Developer Tools', 'Kubernetes', 'Beta'],
    replies: [
      {
        id: 'r1',
        authorName: 'Alex Johnson',
        authorRole: 'Consumer',
        authorAvatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=random',
        content: '@ai Can you explain what Kubernetes cluster autoscaling means in simple terms?',
        timestamp: '1 hour ago',
        likes: 3
      },
      {
        id: 'r2',
        authorName: 'AI Assistant',
        authorRole: 'AI',
        authorAvatar: 'https://ui-avatars.com/api/?name=AI&background=6366f1&color=fff',
        content: 'Sure! **Kubernetes cluster autoscaling** automatically adjusts the number of servers (nodes) in your cluster based on the demands of your applications.\n\nIt\'s like automatically adding or removing cashiers at a grocery store based on how long the checkout line is.',
        timestamp: '1 hour ago',
        likes: 15,
        isAiResponse: true
      }
    ]
  },
  // --- UNANSWERED ---
  {
    id: 'p2',
    authorName: 'David Kim',
    authorRole: 'Consumer',
    authorAvatar: 'https://ui-avatars.com/api/?name=David+Kim&background=random',
    content: 'Looking for a custom agent that can read my daily supplier emails (PDF attachments) and update our Shopify inventory automatically. Any developers available for this? Budget is flexible.',
    timestamp: '4 hours ago',
    likes: 12,
    comments: 0,
    isLiked: false,
    tags: ['Productivity', 'Automation', 'Hiring'],
    replies: []
  }
];
import { Agent, Developer, User, Post } from './types';

export const mockConsumers: User[] = [
  {
    id: 'c1',
    name: 'David Kim',
    avatar: 'https://picsum.photos/seed/david/150/150',
    bio: 'Product Manager looking for AI tools to automate workflows.',
    role: 'consumer',
    followers: ['d1'],
    following: ['d1', 'd2'],
  },
  {
    id: 'c2',
    name: 'Elena Rodriguez',
    avatar: 'https://picsum.photos/seed/elena/150/150',
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
    avatar: 'https://picsum.photos/seed/alice/150/150',
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
    avatar: 'https://picsum.photos/seed/marcus/150/150',
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
    avatar: 'https://picsum.photos/seed/sarah/150/150',
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
    id: 'a1',
    name: 'DataScribe',
    tagline: 'Autonomous data analyst that builds dashboards from plain English.',
    description: 'DataScribe connects directly to your Postgres or Snowflake database. Instead of writing SQL, you just ask questions. It not only fetches the data but automatically generates Recharts dashboards and writes a weekly summary report for your team.',
    upvotes: 342,
    commentsCount: 45,
    developer: mockDevelopers[0],
    categories: ['Data Analysis', 'Internal Tools'],
    imageUrl: 'https://picsum.photos/seed/datascribe/400/300',
    pricing: 'Freemium',
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'David Kim',
        userAvatar: 'https://picsum.photos/seed/david/100/100',
        rating: 5,
        comment: 'Saved our startup from hiring a full-time data analyst early on. The dashboards are incredibly accurate.',
        date: '2 days ago'
      }
    ]
  },
  {
    id: 'a2',
    name: 'SalesCloser AI',
    tagline: 'Your autonomous SDR that researches leads and drafts hyper-personalized emails.',
    description: 'SalesCloser doesn\'t just send templates. It reads a prospect\'s LinkedIn, their company\'s recent news, and their GitHub activity to draft highly personalized outreach. It can even handle initial objections autonomously.',
    upvotes: 289,
    commentsCount: 32,
    developer: mockDevelopers[1],
    categories: ['Sales', 'Outreach'],
    imageUrl: 'https://picsum.photos/seed/salescloser/400/300',
    pricing: '$49/mo',
    reviews: [
      {
        id: 'r2',
        userId: 'u2',
        userName: 'Emily Chen',
        userAvatar: 'https://picsum.photos/seed/emily/100/100',
        rating: 4,
        comment: 'Great tool. The personalization is spooky good. Sometimes it hallucinates a bit on company news, but Marcus is quick to fix bugs.',
        date: '1 week ago'
      }
    ]
  },
  {
    id: 'a3',
    name: 'DevOpsBot',
    tagline: 'Resolves PagerDuty alerts by reading logs and applying safe fixes.',
    description: 'When an alert fires, DevOpsBot reads the stack trace, checks Datadog logs, and proposes a fix. For known issues, it can automatically restart services or rollback deployments via your CI/CD pipeline.',
    upvotes: 512,
    commentsCount: 89,
    developer: mockDevelopers[2],
    categories: ['DevOps', 'Engineering'],
    imageUrl: 'https://picsum.photos/seed/devopsbot/400/300',
    pricing: 'Enterprise',
    reviews: [
      {
        id: 'r3',
        userId: 'u3',
        userName: 'Alex Rivera',
        userAvatar: 'https://picsum.photos/seed/alex/100/100',
        rating: 5,
        comment: 'Literally lets me sleep through the night. Handled 4 minor outages last month without waking me up.',
        date: '3 weeks ago'
      }
    ]
  },
  {
    id: 'a4',
    name: 'LegalEagle',
    tagline: 'AI paralegal that reviews contracts and flags risky clauses.',
    description: 'Upload any NDA, MSA, or employment contract. LegalEagle highlights non-standard clauses, explains them in plain English, and suggests redlines based on your company\'s standard playbook.',
    upvotes: 156,
    commentsCount: 18,
    developer: mockDevelopers[0],
    categories: ['Legal', 'Productivity'],
    imageUrl: 'https://picsum.photos/seed/legaleagle/400/300',
    pricing: 'Pay-per-use',
    reviews: []
  }
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    authorName: 'Sarah Lee',
    authorRole: 'Developer',
    authorAvatar: 'https://picsum.photos/seed/sarah/150/150',
    content: 'Just updated DevOpsBot to handle Kubernetes cluster autoscaling! Anyone want to beta test the new feature? Looking for feedback from teams managing >50 nodes.',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
    isLiked: false,
    tags: ['DevOps', 'Kubernetes', 'BetaTesting'],
    replies: [
      {
        id: 'r1',
        authorName: 'Alex Johnson',
        authorRole: 'Consumer',
        authorAvatar: 'https://picsum.photos/seed/alex/150/150',
        content: '@ai Can you explain what Kubernetes cluster autoscaling means in simple terms?',
        timestamp: '1 hour ago',
        likes: 3
      },
      {
        id: 'r2',
        authorName: 'AI Assistant',
        authorRole: 'AI',
        authorAvatar: 'https://picsum.photos/seed/ai/150/150',
        content: 'Sure! Kubernetes cluster autoscaling automatically adjusts the number of servers (nodes) in your cluster based on the demands of your applications. If your apps need more resources, it adds servers. If they need less, it removes them to save costs. It\'s like automatically adding or removing cashiers at a grocery store based on how long the checkout line is.',
        timestamp: '1 hour ago',
        likes: 15,
        isAiResponse: true
      }
    ]
  },
  {
    id: 'p2',
    authorName: 'Michael Chang',
    authorRole: 'Consumer',
    authorAvatar: 'https://picsum.photos/seed/michael/150/150',
    content: 'Looking for a custom agent that can read my daily supplier emails (PDF attachments) and update our Shopify inventory automatically. Any developers available for this? Budget is flexible.',
    timestamp: '4 hours ago',
    likes: 12,
    comments: 8,
    isLiked: false,
    tags: ['ECommerce', 'Automation', 'Hiring']
  },
  {
    id: 'p3',
    authorName: 'Alice Chen',
    authorRole: 'Developer',
    authorAvatar: 'https://picsum.photos/seed/alice/150/150',
    content: 'I see a lot of requests for data extraction agents. Pro-tip: when requesting a custom agent, please provide sample data structures! It cuts development time in half. ð',
    timestamp: '5 hours ago',
    likes: 89,
    comments: 14,
    isLiked: true,
    tags: ['Tips', 'DataExtraction', 'Development']
  }
];

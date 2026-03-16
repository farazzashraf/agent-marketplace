import { useState } from 'react';
import { Post } from '../types';
import { MessageSquare, Heart, Send, Tag, Reply, Share2, Sparkles, Loader2, X } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface CommunityFeedProps {
  initialPosts: Post[];
}

export default function CommunityFeed({ initialPosts }: CommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const displayRole = 'User';

  const [activeAiPostId, setActiveAiPostId] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponses, setAiResponses] = useState<Record<string, { query: string, response: string, isLoading: boolean }[]>>({});

  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Extract all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || []))).sort();

  const filteredPosts = activeFilter 
    ? posts.filter(post => post.tags?.includes(activeFilter))
    : posts;

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    
    const tags = newPostTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const newPost: Post = {
      id: Date.now().toString(),
      authorName: 'Current User',
      authorRole: displayRole,
      authorAvatar: 'https://picsum.photos/seed/user/100/100',
      content: newPostContent,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      isLiked: false,
      tags: tags.length > 0 ? tags : undefined
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostTags('');
  };

  const handleAskAi = async (post: Post) => {
    if (!aiQuery.trim()) return;

    const currentQuery = aiQuery;
    setAiQuery('');
    
    setAiResponses(prev => ({
      ...prev,
      [post.id]: [...(prev[post.id] || []), { query: currentQuery, response: '', isLoading: true }]
    }));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a helpful AI assistant analyzing a community post. 
Post Content: "${post.content}"
Tags: ${post.tags?.join(', ') || 'None'}
Author: ${post.authorName} (${post.authorRole})

User Question: ${currentQuery}

Provide a concise, helpful answer based on the post context.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiResponses(prev => {
        const postResponses = [...(prev[post.id] || [])];
        const lastIndex = postResponses.length - 1;
        postResponses[lastIndex] = {
          ...postResponses[lastIndex],
          response: response.text || 'Sorry, I could not generate a response.',
          isLoading: false
        };
        return { ...prev, [post.id]: postResponses };
      });
    } catch (error) {
      console.error('AI Error:', error);
      setAiResponses(prev => {
        const postResponses = [...(prev[post.id] || [])];
        const lastIndex = postResponses.length - 1;
        postResponses[lastIndex] = {
          ...postResponses[lastIndex],
          response: 'Sorry, there was an error communicating with the AI.',
          isLoading: false
        };
        return { ...prev, [post.id]: postResponses };
      });
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = post.isLiked;
        return {
          ...post,
          isLiked: !isCurrentlyLiked,
          likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleReply = async (post: Post) => {
    if (!replyContent.trim()) return;

    const newReply = {
      id: Date.now().toString(),
      authorName: 'Current User',
      authorRole: displayRole as 'Developer' | 'Consumer',
      authorAvatar: 'https://picsum.photos/seed/user/100/100',
      content: replyContent,
      timestamp: 'Just now',
      likes: 0
    };

    // Add user's reply immediately
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          comments: p.comments + 1,
          replies: [...(p.replies || []), newReply]
        };
      }
      return p;
    }));

    const contentToCheck = replyContent.toLowerCase();
    setReplyContent('');

    // Check if user is asking AI
    if (contentToCheck.includes('@ai') || contentToCheck.includes('@grok')) {
      setIsAiReplying(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are a helpful AI assistant participating in a community forum. 
Post Content: "${post.content}"
Tags: ${post.tags?.join(', ') || 'None'}
Author: ${post.authorName} (${post.authorRole})

User Reply/Question: ${contentToCheck}

Provide a concise, helpful, and friendly answer based on the post context.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });

        const aiReply = {
          id: (Date.now() + 1).toString(),
          authorName: 'AI Assistant',
          authorRole: 'AI' as const,
          authorAvatar: 'https://picsum.photos/seed/ai/150/150',
          content: response.text || 'Sorry, I could not generate a response.',
          timestamp: 'Just now',
          likes: 0,
          isAiResponse: true
        };

        setPosts(prevPosts => prevPosts.map(p => {
          if (p.id === post.id) {
            return {
              ...p,
              comments: p.comments + 1,
              replies: [...(p.replies || []), aiReply]
            };
          }
          return p;
        }));
      } catch (error) {
        console.error('AI Error:', error);
      } finally {
        setIsAiReplying(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex gap-4">
          <img src="https://picsum.photos/seed/user/100/100" alt="User" className="h-10 w-10 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
          <div className="flex-1 space-y-3">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What kind of AI agent are you looking for? Or what did you just build?"
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              rows={3}
            />
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-indigo-500 transition-colors">
              <Tag size={14} className="text-gray-400" />
              <input
                type="text"
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                placeholder="Add tags (comma separated, e.g. DevOps, Automation)"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 sm:gap-2">
              <button 
                onClick={handlePost}
                disabled={!newPostContent.trim()}
                className="w-full sm:w-auto flex justify-center items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Send size={16} />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            <button
              onClick={() => setActiveFilter(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeFilter === null 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Posts
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeFilter === tag 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Tag size={12} />
                {tag}
              </button>
            ))}
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            No posts found with the selected tag.
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <img src={post.authorAvatar} alt={post.authorName} className="h-10 w-10 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">{post.authorName}</h4>
                </div>
                <p className="text-xs text-gray-500">{post.timestamp}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{post.content}</p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <button 
                    key={index} 
                    onClick={() => setActiveFilter(tag)}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                  >
                    <Tag size={10} />
                    {tag}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-6 border-t border-gray-100 pt-4 text-gray-500">
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${post.isLiked ? 'text-pink-600' : 'hover:text-pink-600'}`}
              >
                <Heart size={16} className={post.isLiked ? 'fill-current' : ''} /> {post.likes}
              </button>
              <button 
                onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${activeReplyPostId === post.id ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
              >
                <MessageSquare size={16} /> {post.comments}
              </button>
              <button 
                onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                className="flex items-center gap-1.5 text-xs font-medium hover:text-indigo-600 transition-colors"
              >
                <Reply size={16} /> Reply
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium hover:text-indigo-600 transition-colors">
                <Share2 size={16} /> Share
              </button>
              <button 
                onClick={() => setActiveAiPostId(activeAiPostId === post.id ? null : post.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${activeAiPostId === post.id ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
              >
                <Sparkles size={16} /> Ask AI
              </button>
            </div>

            {activeReplyPostId === post.id && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                {/* Existing Replies */}
                {post.replies && post.replies.length > 0 && (
                  <div className="mb-4 space-y-4">
                    {post.replies.map(reply => (
                      <div key={reply.id} className={`flex gap-3 p-3 rounded-xl ${reply.isAiResponse ? 'bg-indigo-50/50 border border-indigo-100' : 'bg-gray-50'}`}>
                        <img src={reply.authorAvatar} alt={reply.authorName} className="h-8 w-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                              {reply.authorName}
                              {reply.isAiResponse && <Sparkles size={12} className="text-indigo-600" />}
                            </h5>
                            <span className="text-[10px] text-gray-500">{reply.timestamp}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <div className="flex gap-3">
                  <img src="https://picsum.photos/seed/user/100/100" alt="User" className="h-8 w-8 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                  <div className="flex-1 flex flex-col gap-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply... Mention @ai or @grok to ask the AI assistant!"
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                      rows={2}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Tip: Type <span className="font-medium text-indigo-600">@ai</span> to get an AI response
                      </span>
                      <button
                        onClick={() => handleReply(post)}
                        disabled={!replyContent.trim() || isAiReplying}
                        className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        {isAiReplying ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeAiPostId === post.id && (
              <div className="mt-4 rounded-xl bg-indigo-50/50 p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-600" />
                    Ask AI about this post
                  </h4>
                  <button onClick={() => setActiveAiPostId(null)} className="text-indigo-400 hover:text-indigo-600">
                    <X size={14} />
                  </button>
                </div>
                
                <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
                  {(aiResponses[post.id] || []).map((resp, idx) => (
                    <div key={idx} className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="font-medium text-gray-700">You:</span>
                        <span className="text-gray-600">{resp.query}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium text-indigo-700">AI:</span>
                        {resp.isLoading ? (
                          <Loader2 size={14} className="animate-spin text-indigo-500 mt-0.5" />
                        ) : (
                          <span className="text-indigo-900">{resp.response}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAskAi(post);
                      }
                    }}
                    placeholder="Ask something..."
                    className="flex-1 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleAskAi(post)}
                    disabled={!aiQuery.trim()}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )))}
      </div>
    </div>
  );
}

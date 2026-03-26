import { useState, useMemo } from 'react';
import { Post, PostReply, Agent } from '../types';
import { MessageSquare, Eye, Clock, Plus, Pin, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { mockAgents } from '../mockData';

// --- EMBEDDED AGENT CARD COMPONENT ---
// 1. Add onAgentClick to the props here
// --- EMBEDDED AGENT CARD COMPONENT ---
const EmbeddedAgentCard = ({ agent, onAgentClick }: { agent: Agent, onAgentClick?: (agent: Agent) => void }) => {
  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAgentClick) onAgentClick(agent);
      }}
      className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all bg-white no-underline text-left w-full max-w-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <img 
        src={agent.imageUrl} 
        alt={agent.name} 
        className="h-10 w-10 rounded-lg object-cover border border-gray-200" 
        referrerPolicy="no-referrer" 
      />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-bold text-sm text-gray-900 truncate">{agent.name}</span>
        <span className="text-xs text-gray-500 truncate">{agent.tagline}</span>
      </div>
      <div className="shrink-0 ml-2">
        <span className="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold">
          View
        </span>
      </div>
    </button>
  );
};

interface CommunityFeedProps {
  initialPosts: Post[];
  onAgentClick?: (agent: Agent) => void;
}

export default function CommunityFeed({ initialPosts, onAgentClick }: CommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeFilter, setActiveFilter] = useState('latest');
  
  // Modals state
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // New Topic state
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicTags, setNewTopicTags] = useState('');
  
  // Reply state
  const [replyContent, setReplyContent] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  // --- FILTER LOGIC ---
  const displayedPosts = useMemo(() => {
    let filtered = [...posts];
    
    if (activeFilter === 'top') {
      filtered.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    } else if (activeFilter === 'unanswered') {
      filtered = filtered.filter(p => p.comments === 0 && (!p.replies || p.replies.length === 0));
    } else if (activeFilter === 'categories') {
      filtered.sort((a, b) => (a.tags?.[0] || '').localeCompare(b.tags?.[0] || ''));
    }
    
    return filtered;
  }, [posts, activeFilter]);

  const getTagColor = (tag: string) => {
    switch(tag.toLowerCase()) {
      case 'developer tools':
      case 'api': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'productivity':
      case 'tips': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'video generator':
      case 'audio & voice': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hiring':
      case 'help': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'bugreport': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // --- RICH TEXT PARSER (MARKDOWN + MENTIONS) ---
  const renderRichText = (text: string) => {
    if (!text) return null;
    
    const mentionRegex = /(@[a-zA-Z0-9_]+)/g;
    
    // Find all unique valid agents mentioned in the text
    const mentionedAgents = Array.from(new Set(text.match(mentionRegex) || []))
      .map(mention => mention.substring(1)) // Remove the '@'
      .map(name => mockAgents.find(a => a.name.toLowerCase() === name.toLowerCase()))
      .filter((agent): agent is Agent => !!agent); // Filter out invalid mentions
    
    // 1. Escape HTML to prevent XSS
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2. Highlight Valid Mentions Inline
    html = html.replace(mentionRegex, (match) => {
      const name = match.substring(1);
      const isValid = mockAgents.some(a => a.name.toLowerCase() === name.toLowerCase());
      if (isValid) {
        return `<span class="text-indigo-600 font-semibold bg-indigo-50 px-1 rounded-md">${match}</span>`;
      }
      return match;
    });

    // 3. Parse Code Blocks (```code```)
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono my-4 shadow-md"><code>$1</code></pre>');
    
    // 4. Parse Inline Code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code class="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md text-[0.9em] font-mono border border-indigo-100">$1</code>');
    
    // 5. Parse Bold Text (**text**)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
    
    // 6. Parse Bullet Points (- item or * item)
    html = html.replace(/^(?:-|\*)\s+(.*)$/gm, '<li class="ml-5 list-disc my-1 text-gray-800">$1</li>');
    
    // 7. Handle Line Breaks
    html = html.replace(/\n/g, '<br />');
    
    // Clean up <br> tags inside <pre> blocks so code doesn't get double-spaced
    html = html.replace(/(<pre[^>]*>[\s\S]*?<\/pre>)/g, (match) => {
        return match.replace(/<br \/>/g, '\n');
    });

    return (
      <div className="flex flex-col gap-3">
        <div dangerouslySetInnerHTML={{ __html: html }} className="text-gray-700 leading-relaxed text-sm sm:text-base break-words" />
        
        {/* Render the unfurled agent cards below the text */}
        {/* Render the unfurled agent cards below the text */}
        {mentionedAgents.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {mentionedAgents.map(agent => (
              <EmbeddedAgentCard 
                key={agent.id} 
                agent={agent} 
                onAgentClick={onAgentClick} // <-- ADD THIS PROP
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicContent.trim()) return;

    const newPost: Post = {
      id: `p${Date.now()}`,
      authorName: 'Current User',
      authorRole: 'Developer',
      authorAvatar: 'https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff',
      content: newTopicContent,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      tags: newTopicTags.split(',').map(t => t.trim()).filter(t => t),
      replies: []
    };

    setPosts([newPost, ...posts]);
    setIsNewTopicOpen(false);
    setNewTopicContent('');
    setNewTopicTags('');
    setActiveFilter('latest');
  };

  const handleAddReply = () => {
    if (!replyContent.trim() || !selectedPost) return;

    const newReply: PostReply = {
      id: `r${Date.now()}`,
      authorName: 'Current User',
      authorRole: 'Developer',
      authorAvatar: 'https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff',
      content: replyContent,
      timestamp: 'Just now',
      likes: 0
    };

    updatePostWithReply(selectedPost.id, newReply);
    setReplyContent('');
  };

  const handleAskAI = async () => {
    if (!selectedPost) return;
    setIsAILoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // Instruct the AI to use Markdown formatting
      const prompt = `You are a helpful AI assistant in a developer community forum for AI Agents. 
      Read the following forum post and provide a helpful, concise, and technical reply.
      Use markdown formatting (like **bold**, \`inline code\`, and \`\`\`code blocks\`\`\`) where appropriate.
      
      Post: "${selectedPost.content}"
      
      Reply directly to the user's post without any intro or outro.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      if (response.text) {
        const aiReply: PostReply = {
          id: `ai${Date.now()}`,
          authorName: 'AI Assistant',
          authorRole: 'AI',
          authorAvatar: 'https://ui-avatars.com/api/?name=AI&background=6366f1&color=fff',
          content: response.text,
          timestamp: 'Just now',
          likes: 0,
          isAiResponse: true
        };
        updatePostWithReply(selectedPost.id, aiReply);
      }
    } catch (error) {
      console.error("AI Reply error:", error);
      alert("Error getting AI response. Please check your API key.");
    } finally {
      setIsAILoading(false);
    }
  };

  const updatePostWithReply = (postId: string, reply: PostReply) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const updatedPost = { 
          ...p, 
          replies: [...(p.replies || []), reply],
          comments: p.comments + 1
        };
        if (selectedPost?.id === postId) setSelectedPost(updatedPost);
        return updatedPost;
      }
      return p;
    });
    setPosts(updatedPosts);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {['latest', 'top', 'unanswered', 'categories'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`capitalize px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter 
                  ? 'bg-gray-900 text-white shadow-md scale-105' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsNewTopicOpen(true)}
          className="shrink-0 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={18} /> New Topic
        </button>
      </div>

      {/* Forum Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-6 lg:col-span-7 pl-2">Topic</div>
          <div className="col-span-2 hidden lg:flex justify-center">Participants</div>
          <div className="col-span-2 lg:col-span-1 text-center">Replies</div>
          <div className="col-span-2 lg:col-span-1 text-center">Views</div>
          <div className="col-span-2 lg:col-span-1 text-right pr-4">Activity</div>
        </div>

        {/* Forum Threads */}
        <div className="divide-y divide-gray-100">
          {displayedPosts.length > 0 ? displayedPosts.map((post, index) => {
            const participants = [post.authorAvatar];
            post.replies?.forEach(reply => {
              if (!participants.includes(reply.authorAvatar)) participants.push(reply.authorAvatar);
            });

            const mockViews = (post.likes * 14) + (post.comments * 32) + 142;
            const isPinned = index === 0 && (activeFilter === 'latest' || activeFilter === 'top'); 

            // Strip markdown for the clean preview in the table
            const plainTextPreview = post.content
                .replace(/```([\s\S]*?)```/g, '[Code Snippet] ')
                .replace(/[*`_]/g, '');

            return (
              <div 
                key={post.id} 
                onClick={() => setSelectedPost(post)}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 sm:p-5 transition-colors cursor-pointer group ${isPinned ? 'bg-indigo-50/30 hover:bg-indigo-50/60' : 'hover:bg-gray-50'}`}
              >
                <div className="md:col-span-6 lg:col-span-7 flex gap-4 items-start">
                  <div className="mt-1 flex-shrink-0 md:hidden lg:block relative">
                    <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
                    {isPinned && (
                      <div className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white p-1 rounded-full border-2 border-white">
                        <Pin size={10} className="fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug pr-4">
                      {isPinned && <span className="text-indigo-600 mr-2 md:hidden"><Pin size={14} className="inline fill-current -mt-0.5" /></span>}
                      {plainTextPreview}
                    </h3>
                    
                    <div className="mt-2.5 flex flex-wrap gap-2 items-center">
                      {post.tags?.map(tag => (
                        <span key={tag} className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-md border ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 font-medium md:hidden flex items-center gap-1 mt-1 ml-auto">
                        <Clock size={12} /> {post.timestamp.replace(' ago', '')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex col-span-2 items-center justify-center">
                  <div className="flex -space-x-2.5 overflow-hidden p-1">
                    {participants.slice(0, 4).map((avatar, i) => (
                      <img key={i} src={avatar} alt="participant" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-sm" referrerPolicy="no-referrer" />
                    ))}
                    {participants.length > 4 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-xs font-bold text-gray-600 shadow-sm">
                        +{participants.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-6 lg:col-span-3 flex items-center justify-between md:grid md:grid-cols-3 gap-4 text-gray-500 border-t border-gray-100 pt-3 mt-1 md:border-0 md:pt-0 md:mt-0">
                  <div className="flex items-center gap-1.5 md:flex-col md:justify-center md:gap-0.5">
                    <span className="md:hidden text-gray-400"><MessageSquare size={16} /></span>
                    <span className={`font-semibold md:text-lg ${post.comments > 10 ? 'text-indigo-600' : 'text-gray-700'}`}>
                      {post.comments || post.replies?.length || 0}
                    </span>
                    <span className="hidden md:block text-[10px] uppercase tracking-wider font-bold text-gray-400">Replies</span>
                  </div>

                  <div className="flex items-center gap-1.5 md:flex-col md:justify-center md:gap-0.5">
                    <span className="md:hidden text-gray-400"><Eye size={16} /></span>
                    <span className="font-semibold text-gray-700 md:text-lg">
                      {mockViews >= 1000 ? (mockViews/1000).toFixed(1) + 'k' : mockViews}
                    </span>
                    <span className="hidden md:block text-[10px] uppercase tracking-wider font-bold text-gray-400">Views</span>
                  </div>

                  <div className="hidden md:flex flex-col items-end justify-center text-right pr-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {post.timestamp.replace(' hours ago', 'h').replace(' hour ago', 'h').replace(' days ago', 'd').replace(' day ago', 'd').replace(' minutes ago', 'm')}
                    </span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-16 text-center text-gray-500">
              No topics found for this filter.
            </div>
          )}
        </div>
      </div>

      {/* --- NEW TOPIC MODAL --- */}
      {isNewTopicOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Create New Topic</h2>
              <button onClick={() => setIsNewTopicOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateTopic} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">What is on your mind?</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Ask a question, share a tip... (Markdown supported: **bold**, `code block`, @Agent)"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-colors"
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., DevOps, API, Need Help"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-colors"
                  value={newTopicTags}
                  onChange={(e) => setNewTopicTags(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsNewTopicOpen(false)} className="px-5 py-2.5 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:-translate-y-0.5 transition-all">Post Topic</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- THREAD DETAILS MODAL --- */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">Topic Details</h2>
              <button onClick={() => setSelectedPost(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 space-y-6">
              
              {/* Original Post (Markdown Rendered) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <img src={selectedPost.authorAvatar} alt="author" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-gray-900">{selectedPost.authorName}</div>
                    <div className="text-xs font-medium text-gray-500">{selectedPost.timestamp}</div>
                  </div>
                </div>
                
                {renderRichText(selectedPost.content)}
                
                <div className="mt-5 flex flex-wrap gap-2">
                  {selectedPost.tags?.map(tag => (
                    <span key={tag} className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getTagColor(tag)}`}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Replies (Markdown Rendered) */}
              <div className="space-y-4 pl-4 sm:pl-8 border-l-2 border-gray-100">
                {selectedPost.replies?.map(reply => (
                  <div key={reply.id} className={`bg-white rounded-2xl p-5 border shadow-sm ${reply.isAiResponse ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={reply.authorAvatar} alt="author" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          {reply.authorName}
                          {reply.isAiResponse && <Sparkles size={14} className="text-indigo-500" />}
                        </div>
                        <div className="text-xs font-medium text-gray-500">{reply.timestamp}</div>
                      </div>
                    </div>
                    {renderRichText(reply.content)}
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Input Area */}
            <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Write a reply... (Markdown supported, @Agent)"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddReply()}
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-colors"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddReply}
                    disabled={!replyContent.trim()}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-sm"
                  >
                    <Send size={18} /> Reply
                  </button>
                  <button 
                    onClick={handleAskAI}
                    disabled={isAILoading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all shadow-md whitespace-nowrap"
                  >
                    {isAILoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} Ask AI
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
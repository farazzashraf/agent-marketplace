import { useState, useMemo } from 'react';
import Navbar, { ViewType } from './components/Navbar';
import AgentCard from './components/AgentCard';
import Sidebar from './components/Sidebar';
import AgentDetailsModal from './components/AgentDetailsModal';
import AISearchModal from './components/AISearchModal';
import RequestAgentModal from './components/RequestAgentModal';
import CommunityFeed from './components/CommunityFeed';
import SubmitAgent from './components/SubmitAgent';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import Settings from './components/Settings';
import UserRequests from './components/UserRequests';
import AgentTester from './components/AgentTester';
import Network from './components/Network';
import Leaderboard from './components/Leaderboard';
import { mockAgents, mockPosts, allMockUsers } from './mockData';
import { Agent, Review, Developer, User } from './types';

// Icons for Category Grid
import { Folder, ArrowRight, Zap, Video, Image as ImageIcon, PenTool, Code, Mic, Megaphone, GraduationCap } from 'lucide-react';

export default function App() {
  const [users, setUsers] = useState<User[]>(allMockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(allMockUsers[0]);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'newest' | 'recommended'>('trending');
  
  // DEFAULT VIEW IS NOW CATEGORIES
  const [mainView, setMainView] = useState<ViewType>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recommendedAgentIds, setRecommendedAgentIds] = useState<string[] | null>(null);

  // Helper to get icons for categories dynamically
  const getCategoryIcon = (cat: string) => {
    switch(cat.toLowerCase()) {
      case 'productivity': return <Zap size={28} />;
      case 'video generator': return <Video size={28} />;
      case 'image generator': return <ImageIcon size={28} />;
      case 'writing assistant': return <PenTool size={28} />;
      case 'developer tools': return <Code size={28} />;
      case 'audio & voice': return <Mic size={28} />;
      case 'marketing': return <Megaphone size={28} />;
      case 'education': return <GraduationCap size={28} />;
      default: return <Folder size={28} />;
    }
  };

  const handleAgentRequest = (requestData: any) => {
    console.log("New Agent Request Submitted:", requestData);
    alert("Your request has been posted to the community!");
  };

  const handleDeveloperClick = (developer: Developer) => {
    const user = users.find(u => u.id === developer.id);
    setSelectedUser(user || developer);
    setMainView('developerProfile');
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setMainView('developerProfile');
  };

  const handleToggleFollow = (targetUserId: string) => {
    if (!currentUser) return;
    setUsers(prevUsers => {
      const isFollowing = currentUser.following.includes(targetUserId);
      return prevUsers.map(u => {
        if (u.id === currentUser.id) return { ...u, following: isFollowing ? u.following.filter(id => id !== targetUserId) : [...u.following, targetUserId] };
        if (u.id === targetUserId) return { ...u, followers: isFollowing ? u.followers.filter(id => id !== currentUser.id) : [...u.followers, currentUser.id] };
        return u;
      });
    });

    setCurrentUser(prev => {
      if (!prev) return prev;
      const isFollowing = prev.following.includes(targetUserId);
      return { ...prev, following: isFollowing ? prev.following.filter(id => id !== targetUserId) : [...prev.following, targetUserId] };
    });

    setSelectedUser(prev => {
      if (!prev || prev.id !== targetUserId) return prev;
      const isFollowing = currentUser.following.includes(targetUserId);
      return { ...prev, followers: isFollowing ? prev.followers.filter(id => id !== currentUser.id) : [...prev.followers, currentUser.id] };
    });
  };

  const handleAddAgent = (newAgent: Agent) => {
    setAgents([newAgent, ...agents]);
    setMainView('agents');
    setActiveTab('newest');
    setSelectedCategory('All');
  };

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    agents.forEach(agent => agent.categories.forEach(c => categories.add(c)));
    const sortedCategories = Array.from(categories).sort();
    return ['All', ...sortedCategories];
  }, [agents]);

  const displayedAgents = useMemo(() => {
    let filtered = agents.filter(agent => selectedCategory === 'All' || agent.categories.includes(selectedCategory));
    if (activeTab === 'recommended' && recommendedAgentIds) filtered = filtered.filter(agent => recommendedAgentIds.includes(agent.id));
    else if (activeTab === 'trending') filtered.sort((a, b) => b.upvotes - a.upvotes);
    return filtered;
  }, [agents, selectedCategory, activeTab, recommendedAgentIds]);

  const leaderboardData = useMemo(() => {
    return users.map(user => {
      const userAgents = agents.filter(a => a.developer.id === user.id);
      const totalUpvotes = userAgents.reduce((sum, a) => sum + a.upvotes, 0);
      const score = (userAgents.length * 50) + (totalUpvotes * 10);
      return { ...user, score, agentsCount: userAgents.length, totalUpvotes };
    }).sort((a, b) => b.score - a.score);
  }, [users, agents]);

  const handleAddReview = (agentId: string, newReview: Review) => {
    const updatedAgents = agents.map(agent => {
      if (agent.id === agentId) return { ...agent, reviews: [newReview, ...agent.reviews], commentsCount: agent.commentsCount + 1 };
      return agent;
    });
    setAgents(updatedAgents);
    if (selectedAgent && selectedAgent.id === agentId) {
      setSelectedAgent({ ...selectedAgent, reviews: [newReview, ...selectedAgent.reviews], commentsCount: selectedAgent.commentsCount + 1 });
    }
  };

  // UPDATED: No Downvote Logic
  const handleVote = (agentId: string) => {
    setAgents(prevAgents => prevAgents.map(agent => {
      if (agent.id === agentId) {
        let newUpvotes = agent.upvotes;
        let newUserVote = agent.userVote;
        
        if (agent.userVote === 'up') {
          newUpvotes -= 1; 
          newUserVote = null; 
        } else {
          if (agent.userVote === 'down') newUpvotes += 2; // Clean up legacy downvotes if they exist
          else newUpvotes += 1;
          newUserVote = 'up'; 
        }
        
        const updatedAgent = { ...agent, upvotes: newUpvotes, userVote: newUserVote };
        if (selectedAgent && selectedAgent.id === agentId) setSelectedAgent(updatedAgent);
        return updatedAgent;
      }
      return agent;
    }));
  };

  const renderContent = () => {
    switch (mainView) {
      
      // FUTUREPEDIA-STYLE CATEGORIES VIEW
      case 'categories':
        const categoryList = allCategories.filter(c => c !== 'All');
        return (
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {categoryList.map(cat => {
                const count = agents.filter(a => a.categories.includes(cat)).length;
                return (
                  <div 
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMainView('agents');
                    }}
                    className="group flex flex-col items-center justify-center p-6 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:-translate-y-1 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                      {getCategoryIcon(cat)}
                    </div>
                    <h3 className="font-bold text-center text-gray-900 group-hover:text-indigo-600 transition-colors">{cat}</h3>
                    <p className="text-sm font-semibold text-gray-400 mt-1.5 bg-gray-50 px-3 py-1 rounded-full">{count} {count === 1 ? 'Agent' : 'Agents'}</p>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-16 text-center">
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setMainView('agents');
                }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white font-bold hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-gray-900/20"
              >
                Browse All Agents <ArrowRight size={20} />
              </button>
            </div>
          </div>
        );

      case 'launch': return <SubmitAgent onAddAgent={handleAddAgent} onCancel={() => setMainView('agents')} />;
      case 'notifications': return <Notifications />;
      case 'profile': return <Profile user={currentUser!} currentUser={currentUser} users={users} isCurrentUser={true} agents={agents.filter(a => a.developer.id === currentUser?.id)} onEditProfile={() => setMainView('settings')} onAgentClick={setSelectedAgent} onVote={handleVote} onUserClick={handleUserClick} onToggleFollow={handleToggleFollow} onViewNetwork={() => setMainView('network')} onDeveloperClick={handleDeveloperClick} />;
      case 'developerProfile': if (!selectedUser) return null; return <Profile user={selectedUser} currentUser={currentUser} users={users} agents={agents.filter(a => a.developer.id === selectedUser.id)} isCurrentUser={currentUser?.id === selectedUser.id} onAgentClick={setSelectedAgent} onVote={handleVote} onUserClick={handleUserClick} onToggleFollow={handleToggleFollow} onViewNetwork={() => setMainView('network')} onDeveloperClick={handleDeveloperClick} />;
      case 'network': return <Network users={users} currentUser={currentUser} onToggleFollow={handleToggleFollow} onUserClick={handleUserClick} />;
      case 'leaderboard': return <Leaderboard users={users} agents={agents} onUserClick={handleUserClick} />;
      case 'settings': return <Settings />;
      case 'userRequests': return <UserRequests />;
      case 'agentTester': return <AgentTester agents={agents} />;
      case 'community': return (
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 max-w-full">
            <div className="lg:col-span-8 xl:col-span-9 min-w-0">
              <CommunityFeed initialPosts={mockPosts} />
            </div>
            <div className="lg:col-span-4 xl:col-span-3 min-w-0">
              <Sidebar leaderboard={leaderboardData.slice(0, 3)} onUserClick={handleUserClick} onViewLeaderboard={() => setMainView('leaderboard')} showLeaderboard={false} />
            </div>
          </div>
        );
      case 'agents': return (
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 max-w-full animate-in fade-in duration-300">
            <div className="lg:col-span-8 xl:col-span-9 min-w-0">
              <div className="mb-6 flex flex-col gap-4 max-w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200">
                  <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar touch-pan-x w-full">
                    {recommendedAgentIds && recommendedAgentIds.length > 0 && (
                      <button onClick={() => setActiveTab('recommended')} className={`whitespace-nowrap shrink-0 text-sm sm:text-base font-semibold transition-colors relative pb-3 sm:pb-4 ${activeTab === 'recommended' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
                        Recommended for You
                        {activeTab === 'recommended' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
                      </button>
                    )}
                    <button onClick={() => setActiveTab('trending')} className={`whitespace-nowrap shrink-0 text-sm sm:text-base font-semibold transition-colors relative pb-3 sm:pb-4 ${activeTab === 'trending' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
                      Trending Agents
                      {activeTab === 'trending' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
                    </button>
                    <button onClick={() => setActiveTab('newest')} className={`whitespace-nowrap shrink-0 text-sm sm:text-base font-semibold transition-colors relative pb-3 sm:pb-4 ${activeTab === 'newest' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}>
                      Newest
                      {activeTab === 'newest' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x pb-2 w-full">
                  {allCategories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap shrink-0 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {displayedAgents.length > 0 ? (
                  displayedAgents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} onClick={setSelectedAgent} onVote={handleVote} onDeveloperClick={handleDeveloperClick} />
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 sm:p-16 text-center">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">No agents found</h3>
                    <p className="mt-2 text-sm sm:text-base text-gray-500">Try selecting a different category or clearing filters.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 xl:col-span-3 mt-8 lg:mt-0 min-w-0">
              <Sidebar leaderboard={leaderboardData.slice(0, 3)} onUserClick={handleUserClick} onViewLeaderboard={() => setMainView('leaderboard')} showLeaderboard={true} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 overflow-x-hidden w-full selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar 
        activeView={mainView} 
        setActiveView={setMainView} 
        onOpenAISearch={() => setIsAISearchOpen(true)}
        onOpenRequestModal={() => setIsRequestModalOpen(true)} 
      />
      
      <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 md:px-8 lg:py-10 overflow-hidden">
        
        {/* DYNAMIC HERO SECTION FOR CATEGORIES, AGENTS, AND COMMUNITY */}
        {(mainView === 'categories' || mainView === 'agents' || mainView === 'community') && (
          <div className="mb-10 sm:mb-14 py-8 text-center sm:py-12 md:py-16 max-w-full">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-[4rem] leading-tight break-words">
              {mainView === 'categories' ? (
                <>Find the perfect <br className="hidden sm:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI Agent</span> for your workflow</>
              ) : mainView === 'agents' ? (
                <><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Explore Agents</span></>
              ) : (
                <>The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI Agent</span> Community</>
              )}
            </h1>
            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-gray-500 px-2">
              {mainView === 'categories' ? "Browse our directory of autonomous agents categorized by use-case and industry." :
               mainView === 'agents' ? `Discover and review top AI agents${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}.` :
               "Connect with developers building the future, or request custom AI agents for your specific business needs."
              }
            </p>
          </div>
        )}
        
        {renderContent()}
      </main>

      {selectedAgent && <AgentDetailsModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} onAddReview={handleAddReview} onVote={handleVote} onDeveloperClick={handleDeveloperClick} />}
      <AISearchModal isOpen={isAISearchOpen} onClose={() => setIsAISearchOpen(false)} agents={agents} onAgentClick={setSelectedAgent} onVote={handleVote} onDeveloperClick={handleDeveloperClick} />
      <RequestAgentModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} onSubmit={handleAgentRequest} />
    </div>
  );
}
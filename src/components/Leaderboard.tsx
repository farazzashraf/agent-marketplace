import { useState, useMemo } from 'react';
import { Trophy, Bot, TrendingUp, Award, LayoutGrid, Star } from 'lucide-react';
import { User, Agent, Developer } from '../types';

interface LeaderboardProps {
  users: User[];
  agents: Agent[];
  onUserClick: (user: User) => void;
}

export default function Leaderboard({ users, agents, onUserClick }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<string>('Global');

  // Extract unique categories dynamically from the agents
  const categories = useMemo(() => {
    const cats = new Set<string>();
    agents.forEach(a => a.categories.forEach(c => cats.add(c)));
    return Array.from(cats).sort();
  }, [agents]);

  const tabs = ['Global', "Editor's Choice", ...categories];

  // Calculate scores and filter users based on the active tab
  const rankedData = useMemo(() => {
    const relevantAgents = (activeTab === 'Global' || activeTab === "Editor's Choice")
      ? agents
      : agents.filter(a => a.categories.includes(activeTab));

    let data = users.map(user => {
      const userAgents = relevantAgents.filter(a => a.developer.id === user.id);
      const totalUpvotes = userAgents.reduce((sum, a) => sum + a.upvotes, 0);
      const score = (userAgents.length * 50) + (totalUpvotes * 10);
      
      // Consumers don't have ratings, so safely default to 0
      const rating = 'rating' in user ? (user as Developer).rating : 0;
      
      return { ...user, score, agentsCount: userAgents.length, totalUpvotes, rating };
    }).filter(u => u.agentsCount > 0); // Only show creators who have agents in this category

    if (activeTab === "Editor's Choice") {
      // Editor's choice curates highly rated developers (e.g., Rating >= 4.8)
      data = data.filter(u => u.rating >= 4.8).sort((a, b) => b.rating - a.rating);
    } else {
      data.sort((a, b) => b.score - a.score);
    }

    return data;
  }, [users, agents, activeTab]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-8">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-white shadow-lg transition-colors duration-500 ${activeTab === "Editor's Choice" ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
          {activeTab === "Editor's Choice" ? <Award size={32} /> : <Trophy size={32} />}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
          {activeTab === 'Global' ? 'Global Leaderboard' : activeTab === "Editor's Choice" ? "Editor's Choice Creators" : `${activeTab} Leaders`}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base px-4">
          {activeTab === "Editor's Choice" 
            ? "Hand-picked top-tier creators delivering exceptional, highly-rated AI agents."
            : "Top creators ranked by their contribution to the platform. Scores are calculated based on agents launched and community upvotes."}
        </p>
      </div>

      {/* Scrollable Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x pb-4 border-b border-gray-200 mask-fade-edges">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
              activeTab === tab 
                ? tab === "Editor's Choice" 
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/20 scale-105'
                  : 'bg-gray-900 text-white shadow-md scale-105' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {tab === 'Global' && <Trophy size={16} className={activeTab === tab ? 'text-white' : 'text-gray-400'} />}
            {tab === "Editor's Choice" && <Award size={18} className={activeTab === tab ? 'text-white' : 'text-amber-500'} />}
            {tab !== 'Global' && tab !== "Editor's Choice" && <LayoutGrid size={16} className={activeTab === tab ? 'text-white' : 'text-gray-400'} />}
            {tab}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/40">
        {rankedData.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {rankedData.map((user, index) => (
              <div 
                key={user.id}
                onClick={() => onUserClick(user)}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 hover:bg-indigo-50/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto flex-1 min-w-0">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black text-lg shadow-sm ${
                    index === 0 ? 'bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900' :
                    index === 1 ? 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800' :
                    index === 2 ? 'bg-gradient-to-br from-orange-200 to-orange-300 text-orange-900' :
                    'bg-gray-50 text-gray-500 border border-gray-100'
                  }`}>
                    #{index + 1}
                  </div>
                  
                  <div className="relative shrink-0">
                    <img src={user.avatar} alt={user.name} className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-white shadow-md group-hover:border-indigo-100 transition-colors" referrerPolicy="no-referrer" />
                    {activeTab === "Editor's Choice" && (
                      <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white p-1 rounded-full border-2 border-white shadow-sm">
                        <Star size={12} className="fill-current" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{user.name}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100"><Bot size={14} className="text-indigo-500" /> {user.agentsCount} Agents</span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100"><TrendingUp size={14} className="text-emerald-500" /> {user.totalUpvotes} Upvotes</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left sm:text-right pl-16 sm:pl-0">
                  <div className={`text-2xl sm:text-3xl font-black tracking-tight ${activeTab === "Editor's Choice" ? 'text-amber-500' : 'text-indigo-600'}`}>
                    {activeTab === "Editor's Choice" ? user.rating.toFixed(1) : user.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-0.5">
                    {activeTab === "Editor's Choice" ? 'Rating' : 'Score'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-50 text-gray-400 mb-4">
              <LayoutGrid size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No creators found</h3>
            <p className="mt-2 text-sm text-gray-500">There are no agents in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
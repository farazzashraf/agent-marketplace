import { Developer, User } from '../types';
import { Star, Briefcase, Trophy, ChevronRight, TrendingUp } from 'lucide-react';

interface SidebarProps {
  leaderboard: (User & { score: number })[];
  onUserClick?: (user: User) => void;
  onViewLeaderboard?: () => void;
  showLeaderboard?: boolean;
}

export default function Sidebar({ leaderboard, onUserClick, onViewLeaderboard, showLeaderboard = true }: SidebarProps) {
  return (
    <div className="sticky top-24 space-y-6 sm:space-y-8">
      {/* Leaderboard Section */}
      {showLeaderboard && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-7 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2.5">
              <Trophy size={18} className="text-indigo-500" />
              Top Creators
            </h3>
          </div>
          
          <div className="space-y-4 sm:space-y-5">
            {leaderboard.map((user, index) => (
              <div 
                key={user.id} 
                className="flex items-center gap-3.5 cursor-pointer group"
                onClick={() => onUserClick && onUserClick(user)}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-sm ${
                  index === 0 ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-100' :
                  index === 1 ? 'bg-gray-100 text-gray-600 ring-2 ring-gray-100' :
                  index === 2 ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-100' :
                  'bg-gray-50 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-11 w-11 rounded-full border-2 border-transparent object-cover group-hover:border-indigo-200 transition-all group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</h4>
                  <p className="mt-0.5 truncate text-xs font-medium text-gray-500">{user.score.toLocaleString()} pts</p>
                </div>
              </div>
            ))}
          </div>
          
          {onViewLeaderboard && (
            <button 
              onClick={onViewLeaderboard}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:text-indigo-600 hover:border-gray-300 active:scale-95"
            >
              View Full Leaderboard
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      )}

      {/* Trending Categories */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-7 shadow-sm transition-shadow hover:shadow-md">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2.5">
          <TrendingUp size={18} className="text-emerald-500" />
          Trending Tags
        </h3>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {['Sales', 'Data Analysis', 'Customer Support', 'DevOps', 'Legal', 'Marketing'].map((cat) => (
            <span key={cat} className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-gray-600 transition-colors hover:bg-white hover:border-indigo-300 hover:text-indigo-600 shadow-sm">
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
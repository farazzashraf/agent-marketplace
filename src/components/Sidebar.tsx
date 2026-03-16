import { Developer, User } from '../types';
import { Star, Briefcase, Trophy, ChevronRight } from 'lucide-react';

interface SidebarProps {
  leaderboard: (User & { score: number })[];
  onUserClick?: (user: User) => void;
  onViewLeaderboard?: () => void;
  showLeaderboard?: boolean;
}

export default function Sidebar({ leaderboard, onUserClick, onViewLeaderboard, showLeaderboard = true }: SidebarProps) {
  return (
    <div className="space-y-8">
      {/* Leaderboard Section */}
      {showLeaderboard && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Trophy size={16} className="text-indigo-500" />
              Leaderboard
            </h3>
          </div>
          
          <div className="space-y-5">
            {leaderboard.map((user, index) => (
              <div 
                key={user.id} 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onUserClick && onUserClick(user)}
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  index === 0 ? 'bg-amber-100 text-amber-600' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  index === 2 ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-50 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-10 w-10 rounded-full border border-gray-100 object-cover group-hover:border-indigo-200 transition-colors"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</h4>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{user.score} pts</p>
                </div>
              </div>
            ))}
          </div>
          
          {onViewLeaderboard && (
            <button 
              onClick={onViewLeaderboard}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-indigo-600"
            >
              View Full Leaderboard
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}

      {/* Trending Categories */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Trending Categories</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Sales', 'Data Analysis', 'Customer Support', 'DevOps', 'Legal', 'Marketing'].map((cat) => (
            <span key={cat} className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200">
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

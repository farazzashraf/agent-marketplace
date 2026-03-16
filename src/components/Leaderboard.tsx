import { Trophy, Star, Bot, TrendingUp } from 'lucide-react';
import { User } from '../types';

interface LeaderboardProps {
  data: (User & { score: number; agentsCount: number; totalUpvotes: number })[];
  onUserClick: (user: User) => void;
}

export default function Leaderboard({ data, onUserClick }: LeaderboardProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center space-y-4 mb-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <Trophy size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Global Leaderboard</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Top creators ranked by their contribution to the platform. Scores are calculated based on agents launched and community upvotes.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="divide-y divide-gray-100">
          {data.map((user, index) => (
            <div 
              key={user.id}
              onClick={() => onUserClick(user)}
              className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                index === 0 ? 'bg-amber-100 text-amber-600' :
                index === 1 ? 'bg-gray-100 text-gray-600' :
                index === 2 ? 'bg-orange-100 text-orange-600' :
                'bg-gray-50 text-gray-400'
              }`}>
                #{index + 1}
              </div>
              
              <img src={user.avatar} alt={user.name} className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
              
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Bot size={14} /> {user.agentsCount} Agents</span>
                  <span className="flex items-center gap-1"><TrendingUp size={14} /> {user.totalUpvotes} Upvotes</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg sm:text-2xl font-bold text-indigo-600">{user.score}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

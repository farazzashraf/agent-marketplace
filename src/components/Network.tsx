import { useState } from 'react';
import { Users, UserPlus, UserMinus, Search } from 'lucide-react';
import { User } from '../types';

interface NetworkProps {
  users: User[];
  currentUser: User | null;
  onToggleFollow: (userId: string) => void;
  onUserClick: (user: User) => void;
}

export default function Network({ users, currentUser, onToggleFollow, onUserClick }: NetworkProps) {
  const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'discover'>('following');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  const followingUsers = users.filter(u => currentUser.following.includes(u.id));
  const followerUsers = users.filter(u => currentUser.followers.includes(u.id));
  const discoverUsers = users.filter(u => u.id !== currentUser.id && !currentUser.following.includes(u.id));

  const getDisplayedUsers = () => {
    let list = [];
    if (activeTab === 'following') list = followingUsers;
    else if (activeTab === 'followers') list = followerUsers;
    else list = discoverUsers;

    if (searchQuery) {
      list = list.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  };

  const displayedUsers = getDisplayedUsers();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Network</h1>
          <p className="text-gray-500 mt-1">Connect with developers and other explorers.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full sm:w-64 rounded-full border border-gray-300 bg-white pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200 text-sm font-medium">
        <button
          onClick={() => setActiveTab('following')}
          className={`pb-4 transition-colors relative ${activeTab === 'following' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Following ({followingUsers.length})
          {activeTab === 'following' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('followers')}
          className={`pb-4 transition-colors relative ${activeTab === 'followers' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Followers ({followerUsers.length})
          {activeTab === 'followers' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`pb-4 transition-colors relative ${activeTab === 'discover' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Discover
          {activeTab === 'discover' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedUsers.length > 0 ? (
          displayedUsers.map(user => {
            const isFollowing = currentUser.following.includes(user.id);
            return (
              <div key={user.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full object-cover cursor-pointer"
                  onClick={() => onUserClick(user)}
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 
                      className="font-semibold text-gray-900 truncate cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => onUserClick(user)}
                    >
                      {user.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{user.bio}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users size={12} /> {user.followers.length} followers</span>
                    </div>
                    <button 
                      onClick={() => onToggleFollow(user.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isFollowing 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus size={14} />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Users className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No users found</h3>
            <p className="text-gray-500 mt-1">
              {activeTab === 'following' && "You aren't following anyone yet."}
              {activeTab === 'followers' && "You don't have any followers yet."}
              {activeTab === 'discover' && "No new users to discover right now."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

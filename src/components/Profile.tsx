import { useState, useEffect } from 'react';
import { Settings, MapPin, Link as LinkIcon, Calendar, Briefcase, Bookmark, MessageSquare, Users, UserPlus, UserMinus } from 'lucide-react';
import { Agent, Developer, User } from '../types';
import AgentCard from './AgentCard';

interface ProfileProps {
  user?: User;
  currentUser?: User | null;
  users?: User[];
  agents: Agent[];
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
  onAgentClick: (agent: Agent) => void;
  onVote: (agentId: string, voteType: 'up' | 'down') => void;
  onUserClick?: (user: User) => void;
  onToggleFollow?: (userId: string) => void;
  onViewNetwork?: () => void;
  onDeveloperClick?: (developer: Developer) => void;
}

export default function Profile({ user, currentUser, users = [], agents, isCurrentUser = false, onEditProfile, onAgentClick, onVote, onUserClick, onToggleFollow, onViewNetwork, onDeveloperClick }: ProfileProps) {
  const profileUser = user || {
    id: 'current-user',
    name: 'Current User',
    avatar: 'https://picsum.photos/seed/user/200/200',
    bio: 'AI Enthusiast & Developer',
    role: 'developer',
    followers: [],
    following: [],
    availableForHire: true,
    rating: 5.0,
    completedProjects: 3
  };

  const isFollowing = currentUser?.following?.includes(profileUser.id);
  const [activeTab, setActiveTab] = useState('Agents');

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Profile Header */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="h-48 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="relative px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0">
            <div className="-mt-16 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              <img 
                src={profileUser.avatar} 
                alt="Profile" 
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl border-4 border-white bg-white object-cover shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profileUser.name}</h1>
                <p className="text-base sm:text-lg font-medium text-gray-500">{profileUser.bio}</p>
              </div>
            </div>
            {isCurrentUser && onEditProfile && (
              <button 
                onClick={onEditProfile}
                className="mb-2 flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Settings size={18} />
                Edit Profile
              </button>
            )}
            {!isCurrentUser && currentUser && onToggleFollow && (
              <button 
                onClick={() => onToggleFollow(profileUser.id)}
                className={`mb-2 flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium shadow-sm transition-colors ${
                  isFollowing 
                    ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus size={18} />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Follow
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                <p className="mt-2 leading-relaxed text-gray-600">
                  {profileUser.bio}
                  {!user && " I build autonomous agents that help businesses automate their boring workflows. Currently exploring multi-agent orchestration and voice-native AI. Always open to collaborate on interesting projects!"}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  San Francisco, CA
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon size={16} className="text-gray-400" />
                  <a href="#" className="text-indigo-600 hover:underline">github.com/currentuser</a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  Joined March 2024
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Stats</h3>
              <div className="mt-4 space-y-4">
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 -mx-2 rounded-lg transition-colors"
                  onClick={onViewNetwork}
                >
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users size={18} className="text-indigo-500" />
                    <span className="font-medium">Followers</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profileUser.followers?.length || 0}</span>
                </div>
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 -mx-2 rounded-lg transition-colors"
                  onClick={onViewNetwork}
                >
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users size={18} className="text-purple-500" />
                    <span className="font-medium">Following</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profileUser.following?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between p-2 -mx-2">
                  <span className="text-gray-600">Agents Built</span>
                  <span className="font-semibold text-gray-900">{agents.length}</span>
                </div>
                <div className="flex items-center justify-between p-2 -mx-2">
                  <span className="text-gray-600">Total Upvotes</span>
                  <span className="font-semibold text-gray-900">{agents.reduce((acc, agent) => acc + agent.upvotes, 0)}</span>
                </div>
                <div className="flex items-center justify-between p-2 -mx-2">
                  <span className="text-gray-600 flex items-center gap-2"><Bookmark size={14} /> Saved Agents</span>
                  <span className="font-semibold text-gray-900">{agents.length}</span>
                </div>
                <div className="flex items-center justify-between p-2 -mx-2">
                  <span className="text-gray-600 flex items-center gap-2"><MessageSquare size={14} /> Reviews Written</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
              </div>
              
              {(profileUser as Developer).availableForHire && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <Briefcase size={16} />
                    Available for Hire
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Content */}
      <div className="space-y-6">
        <div className="flex items-center gap-6 border-b border-gray-200 text-sm font-medium overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('Agents')}
            className={`pb-4 ${activeTab === 'Agents' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {isCurrentUser ? 'My Agents' : 'Agents'}
          </button>
          <button 
            onClick={() => setActiveTab('Saved')}
            className={`pb-4 ${activeTab === 'Saved' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Saved
          </button>
          <button 
            onClick={() => setActiveTab('Activity')}
            className={`pb-4 ${activeTab === 'Activity' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Activity
          </button>
        </div>
        
        <div className="space-y-4">
          {agents.length > 0 ? (
            agents.map(agent => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onClick={onAgentClick} 
                onVote={onVote} 
                onDeveloperClick={onDeveloperClick}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <h3 className="text-sm font-medium text-gray-900">
                No agents found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isCurrentUser 
                  ? "Submit your first AI agent to showcase it to the community." 
                  : "This user hasn't published any agents yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

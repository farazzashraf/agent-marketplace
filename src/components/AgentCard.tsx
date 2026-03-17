import { useEffect, useRef } from 'react';
import { Agent, Developer } from '../types';
import { ChevronUp, MessageSquare, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
  onVote: (agentId: string) => void; // Removed the voteType from the signature
  onDeveloperClick?: (developer: Developer) => void;
}

export default function AgentCard({ agent, onClick, onVote, onDeveloperClick }: AgentCardProps) {
  const prevUpvotesRef = useRef(agent.upvotes);
  const direction = agent.upvotes > prevUpvotesRef.current ? 1 : agent.upvotes < prevUpvotesRef.current ? -1 : 0;

  useEffect(() => {
    prevUpvotesRef.current = agent.upvotes;
  }, [agent.upvotes]);

  return (
    <div 
      onClick={() => onClick(agent)}
      className="group flex cursor-pointer items-start sm:items-center gap-4 sm:gap-6 rounded-2xl bg-white p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md border border-gray-100 hover:border-gray-200"
    >
      <div className="h-14 w-14 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
        <img 
          src={agent.imageUrl} 
          alt={agent.name} 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="flex-1 min-w-0 py-1">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="truncate text-base sm:text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {agent.name}
          </h3>
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100/50">
            {agent.pricing}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-gray-500 sm:text-base leading-relaxed">
          {agent.tagline}
        </p>
        
        <div className="mt-3.5 flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
            <Star size={14} className="fill-current" />
            <span className="font-bold">
              {agent.reviews.length > 0 
                ? (agent.reviews.reduce((acc, rev) => acc + rev.rating, 0) / agent.reviews.length).toFixed(1)
                : 'New'}
            </span>
            <span className="opacity-70">({agent.reviews.length})</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
            <MessageSquare size={16} />
            <span className="font-medium">{agent.commentsCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium bg-gray-100 px-2 py-1 rounded-md text-gray-600">{agent.categories[0]}</span>
          </div>
          <div 
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
            onClick={(e) => {
              if (onDeveloperClick) {
                e.stopPropagation();
                onDeveloperClick(agent.developer);
              }
            }}
          >
            By <span className="font-semibold text-gray-700 hover:text-indigo-600 underline-offset-2 hover:underline">{agent.developer.name}</span>
          </div>
        </div>
      </div>

      {/* VOTE SECTION - Downvote Removed */}
      <div className="flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-xl p-2 border border-gray-100">
        <button 
          onClick={(e) => { e.stopPropagation(); onVote(agent.id); }}
          className={`rounded-lg p-1.5 sm:p-2 transition-all ${agent.userVote === 'up' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-400 hover:bg-white hover:text-gray-900 hover:shadow-sm'}`}
        >
          <ChevronUp size={22} className="sm:h-6 sm:w-6" />
        </button>
        <div className="relative flex h-6 w-10 sm:h-7 sm:w-12 items-center justify-center overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.span
              key={agent.upvotes}
              initial={{ opacity: 0, y: direction * 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction * -15 }}
              transition={{ duration: 0.2 }}
              className={`absolute text-sm sm:text-base font-bold ${agent.userVote === 'up' ? 'text-indigo-600' : 'text-gray-800'}`}
            >
              {agent.upvotes}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
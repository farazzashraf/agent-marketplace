import { useEffect, useRef } from 'react';
import { Agent, Developer } from '../types';
import { ChevronUp, ChevronDown, MessageSquare, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
  onVote: (agentId: string, voteType: 'up' | 'down') => void;
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
      className="group flex cursor-pointer items-start gap-4 rounded-2xl bg-white p-4 transition-all hover:bg-gray-50 hover:shadow-sm border border-transparent hover:border-gray-200"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <img 
          src={agent.imageUrl} 
          alt={agent.name} 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {agent.name}
          </h3>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {agent.pricing}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {agent.tagline}
        </p>
        
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-amber-500 fill-current" />
            <span className="font-medium text-gray-700">
              {agent.reviews.length > 0 
                ? (agent.reviews.reduce((acc, rev) => acc + rev.rating, 0) / agent.reviews.length).toFixed(1)
                : 'New'}
            </span>
            <span>({agent.reviews.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare size={14} />
            {agent.commentsCount}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-700">{agent.categories[0]}</span>
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
            By <span className="font-medium text-gray-700 hover:text-indigo-600">{agent.developer.name}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onVote(agent.id, 'up'); }}
          className={`rounded-md p-1 transition-colors ${agent.userVote === 'up' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
        >
          <ChevronUp size={20} />
        </button>
        <div className="relative flex h-6 w-8 items-center justify-center overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.span
              key={agent.upvotes}
              initial={{ opacity: 0, y: direction * 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction * -15 }}
              transition={{ duration: 0.2 }}
              className={`absolute text-sm font-semibold ${agent.userVote === 'up' ? 'text-indigo-600' : agent.userVote === 'down' ? 'text-rose-600' : 'text-gray-700'}`}
            >
              {agent.upvotes}
            </motion.span>
          </AnimatePresence>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onVote(agent.id, 'down'); }}
          className={`rounded-md p-1 transition-colors ${agent.userVote === 'down' ? 'bg-rose-100 text-rose-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  );
}

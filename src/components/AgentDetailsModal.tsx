import { useState, useEffect, useRef } from 'react';
import { Agent, Review, Developer } from '../types';
import { X, ExternalLink, Star, MessageSquare, ChevronUp, ChevronDown, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AgentDetailsModalProps {
  agent: Agent | null;
  onClose: () => void;
  onAddReview: (agentId: string, review: Review) => void;
  onVote: (agentId: string, voteType: 'up' | 'down') => void;
  onDeveloperClick?: (developer: Developer) => void;
}

export default function AgentDetailsModal({ agent, onClose, onAddReview, onVote, onDeveloperClick }: AgentDetailsModalProps) {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const prevUpvotesRef = useRef(agent?.upvotes ?? 0);
  const direction = agent ? (agent.upvotes > prevUpvotesRef.current ? 1 : agent.upvotes < prevUpvotesRef.current ? -1 : 0) : 0;

  useEffect(() => {
    if (agent) {
      prevUpvotesRef.current = agent.upvotes;
    }
  }, [agent?.upvotes]);

  if (!agent) return null;

  const handleSubmitReview = () => {
    if (!comment.trim() || !agent) return;
    
    const newReview: Review = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Current User',
      userAvatar: 'https://picsum.photos/seed/user/100/100',
      rating,
      comment,
      date: 'Just now'
    };

    onAddReview(agent.id, newReview);
    setIsWritingReview(false);
    setComment('');
    setRating(5);
  };

  return (
    <AnimatePresence>
      {agent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <img src={agent.imageUrl} alt={agent.name} className="h-10 w-10 rounded-lg object-cover border border-gray-200" referrerPolicy="no-referrer" />
                {/* <img 
                  src={agent.imageUrl} 
                  alt={agent.name} 
                  // ADD THIS ONERROR BLOCK 👇
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=e0e7ff&color=4f46e5&bold=true`;
                  }}
                  // KEEP YOUR EXISTING CLASSNAMES 👇
                  className="w-full h-full object-cover"
                /> */}
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">{agent.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{agent.tagline}</p>
                </div>
              </div>
              <button onClick={onClose} className="shrink-0 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                
                {/* Main Info */}
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900">About this Agent</h3>
                    <p className="mt-3 leading-relaxed text-gray-600">{agent.description}</p>
                  </section>

                  <section>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Community Reviews</h3>
                      {!isWritingReview && (
                        <button onClick={() => setIsWritingReview(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Write a Review</button>
                      )}
                    </div>
                    
                    {isWritingReview && (
                      <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={24}
                              className={`cursor-pointer transition-colors ${star <= rating ? "fill-amber-500 text-amber-500" : "text-gray-300 hover:text-amber-300"}`}
                              onClick={() => setRating(star)}
                            />
                          ))}
                        </div>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="What do you think about this agent? How did it help your workflow?"
                          className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          rows={3}
                        />
                        <div className="mt-3 flex justify-end gap-2">
                          <button onClick={() => setIsWritingReview(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                          <button onClick={handleSubmitReview} disabled={!comment.trim()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors">Submit Review</button>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 space-y-4">
                      {agent.reviews.length > 0 ? (
                        agent.reviews.map(review => (
                          <div key={review.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img src={review.userAvatar} alt={review.userName} className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
                                <span className="text-sm font-medium text-gray-900">{review.userName}</span>
                              </div>
                              <div className="flex items-center text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-300"} />
                                ))}
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                            <p className="mt-2 text-xs text-gray-400">{review.date}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No reviews yet. Be the first!</p>
                      )}
                    </div>
                  </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Pricing</span>
                      <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm border border-gray-200">
                        {agent.pricing}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
                        Try Agent <ExternalLink size={16} />
                      </button>
                      <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm">
                        <button 
                          onClick={() => onVote(agent.id, 'up')}
                          className={`px-3 py-2.5 transition-colors rounded-l-xl ${agent.userVote === 'up' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          <ChevronUp size={20} />
                        </button>
                        <div className="relative flex h-full w-10 items-center justify-center overflow-hidden">
                          <AnimatePresence initial={false}>
                            <motion.span
                              key={agent.upvotes}
                              initial={{ opacity: 0, y: direction * 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: direction * -15 }}
                              transition={{ duration: 0.2 }}
                              className={`absolute px-2 text-sm font-semibold ${agent.userVote === 'up' ? 'text-indigo-600' : agent.userVote === 'down' ? 'text-rose-600' : 'text-gray-700'}`}
                            >
                              {agent.upvotes}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <button 
                          onClick={() => onVote(agent.id, 'down')}
                          className={`px-3 py-2.5 transition-colors rounded-r-xl ${agent.userVote === 'down' ? 'bg-rose-50 text-rose-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Built by</h4>
                    <div 
                      className="mt-4 flex items-start gap-3 cursor-pointer group"
                      onClick={() => {
                        if (onDeveloperClick) {
                          onDeveloperClick(agent.developer);
                          onClose();
                        }
                      }}
                    >
                      <img src={agent.developer.avatar} alt={agent.developer.name} className="h-12 w-12 rounded-full object-cover border border-gray-200 group-hover:border-indigo-200 transition-colors" referrerPolicy="no-referrer" />
                      <div>
                        <h5 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{agent.developer.name}</h5>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center text-amber-500"><Star size={12} className="mr-0.5 fill-current"/> {agent.developer.rating}</span>
                          <span>•</span>
                          <span>{agent.developer.completedProjects} projects</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-3">{agent.developer.bio}</p>
                    
                    {agent.developer.availableForHire && (
                      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors">
                        <Briefcase size={16} />
                        Request Custom Agent
                      </button>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Categories</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {agent.categories.map(cat => (
                        <span key={cat} className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

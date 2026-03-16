import { useState } from 'react';
import { Agent, Developer } from '../types';
import { X, Sparkles, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from '@google/genai';
import AgentCard from './AgentCard';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  onAgentClick: (agent: Agent) => void;
  onVote: (agentId: string, voteType: 'up' | 'down') => void;
  onDeveloperClick: (developer: Developer) => void;
}

export default function AISearchModal({ isOpen, onClose, agents, onAgentClick, onVote, onDeveloperClick }: AISearchModalProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ message: string, recommendedAgentIds: string[] } | null>(null);

  const recommendedAgents = result ? agents.filter(a => result.recommendedAgentIds.includes(a.id)) : [];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      // Initialize the Google Gen AI client
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // Prepare a concise context of available agents
      const agentsContext = agents.map(a => ({
        id: a.id,
        name: a.name,
        tagline: a.tagline,
        description: a.description,
        categories: a.categories,
        pricing: a.pricing
      }));

      const prompt = `You are an AI assistant for an AI Agent marketplace. The user is looking for an agent.
Here is the list of available agents in the platform right now:
${JSON.stringify(agentsContext)}

User's request: "${query}"

Recommend the best agents for the user's request. Return a friendly message explaining why these agents were chosen and an array of the recommended agent IDs.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING, description: "A friendly message explaining why these agents were chosen." },
              recommendedAgentIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of agent IDs that best match the query."
              }
            },
            required: ["message", "recommendedAgentIds"]
          }
        }
      });

      if (response.text) {
        setResult(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      setResult({ 
        message: "Sorry, I encountered an error while searching for agents. Please try again.", 
        recommendedAgentIds: [] 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start sm:items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">AI Agent Finder</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Describe what you need, and I'll find the perfect agent.</p>
                </div>
              </div>
              <button onClick={onClose} className="shrink-0 rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
              <div className="space-y-6">
                
                {/* Search Input */}
                <div className="relative">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    placeholder="E.g., I need an agent to help me analyze my sales data and generate reports..."
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-white p-4 pr-14 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    rows={3}
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={isLoading || !query.trim()}
                    className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  </button>
                </div>

                {/* Results */}
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="rounded-2xl bg-indigo-50 p-4 sm:p-5 text-sm leading-relaxed text-indigo-900 border border-indigo-100">
                      {result.message}
                    </div>

                    {recommendedAgents.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Recommended Agents</h3>
                        <div className="grid gap-4">
                          {recommendedAgents.map(agent => (
                            <AgentCard 
                              key={agent.id} 
                              agent={agent} 
                              onClick={(a) => {
                                onAgentClick(a);
                                onClose();
                              }} 
                              onVote={onVote}
                              onDeveloperClick={(d) => {
                                onDeveloperClick(d);
                                onClose();
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                        <p className="text-sm text-gray-500">No agents found matching your criteria.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

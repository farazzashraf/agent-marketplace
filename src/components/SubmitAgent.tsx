import { useState } from 'react';
import { Agent } from '../types';
import { Upload, Plus, X, Rocket, CheckCircle } from 'lucide-react';

interface SubmitAgentProps {
  onAddAgent: (agent: Agent) => void;
  onCancel: () => void;
}

export default function SubmitAgent({ onAddAgent, onCancel }: SubmitAgentProps) {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [pricing, setPricing] = useState('Free');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/newagent/400/300');
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAddCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAgent: Agent = {
      id: Date.now().toString(),
      name,
      tagline,
      description,
      upvotes: 0,
      commentsCount: 0,
      developer: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://picsum.photos/seed/user/150/150',
        bio: 'AI Enthusiast and Developer',
        role: 'developer',
        followers: [],
        following: [],
        availableForHire: true,
        rating: 5.0,
        completedProjects: 1
      },
      categories: categories.length > 0 ? categories : ['General'],
      imageUrl,
      pricing,
      reviews: []
    };

    onAddAgent(newAgent);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Agent Launched!</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your agent has been submitted successfully. The platform will review and test the agent and will approve to get the agent into the platform shortly.
        </p>
        <button 
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all"
        >
          Back to Agents
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
      <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <Rocket size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Launch an AI Agent</h2>
          <p className="mt-1 text-sm text-gray-500">Share your custom AI agent with the community. Fill out the details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Agent Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DataScribe" 
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Pricing Model</label>
            <select 
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option>Free</option>
              <option>Freemium</option>
              <option>Pay-per-use</option>
              <option>Subscription</option>
              <option>Enterprise</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tagline</label>
          <input 
            required
            type="text" 
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="A short, catchy description (max 60 chars)" 
            maxLength={60}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Full Description</label>
          <textarea 
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain what your agent does, how it works, and who it's for..." 
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Categories</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
              placeholder="e.g. Sales, DevOps" 
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button 
              type="button"
              onClick={handleAddCategory}
              className="flex items-center justify-center rounded-xl bg-gray-100 px-4 text-gray-700 hover:bg-gray-200"
            >
              <Plus size={20} />
            </button>
          </div>
          {categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map(cat => (
                <span key={cat} className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  {cat}
                  <button type="button" onClick={() => handleRemoveCategory(cat)} className="text-indigo-400 hover:text-indigo-600">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Cover Image URL</label>
          <div className="flex gap-4 items-center">
            <input 
              type="url" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..." 
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {imageUrl && <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-100">
          <button 
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto rounded-xl px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="w-full sm:w-auto flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Rocket size={18} />
            Launch Agent
          </button>
        </div>
      </form>
    </div>
  );
}

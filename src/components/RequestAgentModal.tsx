import { useState } from 'react';
import { X, Sparkles, Send, DollarSign } from 'lucide-react';

interface RequestAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: any) => void;
}

export default function RequestAgentModal({ isOpen, onClose, onSubmit }: RequestAgentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('Sales');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, budget, category });
    onClose();
    setTitle('');
    setDescription('');
    setBudget('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Request an Agent</h2>
              <p className="text-sm text-gray-500">Can't find what you need? Ask the community.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700">What do you need the agent to do?</label>
              <input
                type="text"
                required
                placeholder="e.g., An agent that automatically replies to customer emails"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Detailed Description</label>
              <textarea
                required
                rows={4}
                placeholder="Describe the workflow, the tools it needs to integrate with, and your expected outcome..."
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Category</label>
                <select
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Sales</option>
                  <option>Customer Support</option>
                  <option>Data Analysis</option>
                  <option>Marketing</option>
                  <option>DevOps</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Budget (Optional)</label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="e.g., $500"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-4 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md"
            >
              <Send size={16} />
              Post Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
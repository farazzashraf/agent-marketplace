import { useState } from 'react';
import { Search, Bell, PlusCircle, Bot, Users, Settings as SettingsIcon, Sparkles, Menu, X, LogOut, ShieldCheck, Rocket, Trophy } from 'lucide-react';

export type ViewType = 'agents' | 'community' | 'launch' | 'notifications' | 'profile' | 'settings' | 'developerProfile' | 'userRequests' | 'agentTester' | 'network' | 'leaderboard';

interface NavbarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onOpenAISearch: () => void;
}

export default function Navbar({ activeView, setActiveView, onOpenAISearch }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('agents')}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Bot size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">AgentHunt</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar max-w-[50vw] lg:max-w-none">
            <button 
              onClick={() => handleNavClick('agents')}
              className={`whitespace-nowrap flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeView === 'agents' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Bot size={16} />
              Agents
            </button>
            <button 
              onClick={() => handleNavClick('community')}
              className={`whitespace-nowrap flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeView === 'community' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Users size={16} />
              Community
            </button>
            <button 
              onClick={() => handleNavClick('userRequests')}
              className={`whitespace-nowrap flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeView === 'userRequests' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Sparkles size={16} />
              User Requests
            </button>
            <button 
              onClick={() => handleNavClick('agentTester')}
              className={`whitespace-nowrap flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeView === 'agentTester' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ShieldCheck size={16} />
              Agent Tester
            </button>
            <button 
              onClick={() => handleNavClick('leaderboard')}
              className={`whitespace-nowrap flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeView === 'leaderboard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Trophy size={16} />
              Leaderboard
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center relative mr-2">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="h-9 w-64 rounded-full border border-gray-300 bg-gray-50 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button 
            onClick={() => { onOpenAISearch(); setIsMobileMenuOpen(false); }}
            className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow"
          >
            <Sparkles size={16} />
            Ask AI
          </button>
          <button 
            onClick={() => handleNavClick('launch')}
            className={`hidden sm:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeView === 'launch' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
          >
            <Rocket size={16} />
            Launch Agent
          </button>
          <button 
            onClick={() => handleNavClick('notifications')}
            className={`relative p-2 rounded-full transition-colors ${activeView === 'notifications' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          <button 
            onClick={() => handleNavClick('settings')}
            className={`hidden sm:block p-2 rounded-full transition-colors ${activeView === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <SettingsIcon size={20} />
          </button>
          <div 
            onClick={() => handleNavClick('profile')}
            className={`hidden sm:block h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 transition-colors ${activeView === 'profile' ? 'border-indigo-600' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <img src="https://picsum.photos/seed/user/100/100" alt="User" referrerPolicy="no-referrer" />
          </div>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white px-4 py-4 shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2 py-2 cursor-pointer rounded-lg hover:bg-gray-50" onClick={() => handleNavClick('profile')}>
              <img src="https://picsum.photos/seed/user/100/100" alt="User" className="h-10 w-10 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
              <div>
                <p className="text-sm font-medium text-gray-900">Current User</p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>
            </div>
            
            <div className="h-px w-full bg-gray-100 my-1"></div>
            
            <button 
              onClick={() => handleNavClick('agents')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'agents' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Bot size={18} />
              Agents
            </button>
            <button 
              onClick={() => handleNavClick('community')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'community' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Users size={18} />
              Community
            </button>
            <button 
              onClick={() => handleNavClick('userRequests')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'userRequests' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Sparkles size={18} />
              User Requests
            </button>
            <button 
              onClick={() => handleNavClick('agentTester')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'agentTester' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <ShieldCheck size={18} />
              Agent Tester
            </button>
            <button 
              onClick={() => handleNavClick('leaderboard')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'leaderboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Trophy size={18} />
              Leaderboard
            </button>
            <button 
              onClick={() => { onOpenAISearch(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <Sparkles size={18} />
              Ask AI
            </button>
            <button 
              onClick={() => handleNavClick('launch')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'launch' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Rocket size={18} />
              Launch Agent
            </button>
            <button 
              onClick={() => handleNavClick('settings')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <SettingsIcon size={18} />
              Settings
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

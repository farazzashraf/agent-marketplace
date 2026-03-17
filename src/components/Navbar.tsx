import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Bot, Users, Settings as SettingsIcon, Sparkles, Menu, X, Rocket, Trophy, ShieldCheck, PenTool, LayoutGrid } from 'lucide-react';

export type ViewType = 'categories' | 'agents' | 'community' | 'launch' | 'notifications' | 'profile' | 'settings' | 'developerProfile' | 'userRequests' | 'agentTester' | 'network' | 'leaderboard';

interface NavbarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onOpenAISearch: () => void;
  onOpenRequestModal: () => void;
}

export default function Navbar({ activeView, setActiveView, onOpenAISearch, onOpenRequestModal }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-xl transition-all" ref={menuRef}>
      <div className="mx-auto flex h-16 sm:h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 md:px-8">
        
        <div className="flex items-center gap-6 lg:gap-10">
          <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNavClick('categories')}>
            <div className="flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm">
              <Bot size={22} />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">AgentHunt</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden xl:flex items-center relative mr-2">
            <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search agents..." 
              className="h-10 w-64 rounded-full border border-gray-200 bg-gray-50/50 pl-10 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          
          <button 
            onClick={() => { onOpenAISearch(); setIsMobileMenuOpen(false); }}
            className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            <Sparkles size={18} />
            Ask AI
          </button>
          
          <button 
            onClick={() => { onOpenRequestModal(); setIsMobileMenuOpen(false); }}
            className="hidden lg:flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md"
          >
            <PenTool size={16} />
            Request
          </button>
          
          <button 
            onClick={() => handleNavClick('launch')}
            className={`hidden lg:flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${activeView === 'launch' ? 'bg-gray-900 text-white shadow-md' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'}`}
          >
            <Rocket size={18} />
            Launch
          </button>
          
          <button 
            onClick={() => handleNavClick('notifications')}
            className={`relative shrink-0 p-2 sm:p-2.5 rounded-full transition-colors ${activeView === 'notifications' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <Bell size={22} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>
          
          <div 
            onClick={() => handleNavClick('profile')}
            className={`hidden sm:flex shrink-0 items-center justify-center h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 transition-transform hover:scale-105 ${activeView === 'profile' ? 'border-indigo-600 shadow-sm' : 'border-gray-200'}`}
          >
            <img src="https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff" alt="User" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-1 sm:-mr-2 rounded-xl text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 w-full sm:w-80 sm:right-6 sm:top-[calc(100%-10px)] sm:rounded-2xl border-b sm:border border-gray-200 bg-white/95 backdrop-blur-xl shadow-2xl origin-top sm:origin-top-right animate-in fade-in slide-in-from-top-2 sm:zoom-in-95">
          <div className="flex flex-col gap-1 p-4 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="sm:hidden flex items-center gap-3 px-3 py-3 cursor-pointer rounded-xl hover:bg-gray-50 transition-colors" onClick={() => handleNavClick('profile')}>
              <img src="https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff" alt="User" className="h-12 w-12 shrink-0 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
              <div>
                <p className="text-base font-bold text-gray-900">Current User</p>
                <p className="text-sm text-indigo-600 font-medium">View Profile</p>
              </div>
            </div>
            
            <div className="sm:hidden h-px w-full bg-gray-100 my-2"></div>

            <div className="px-3 pb-2 pt-1 hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Navigation</p>
            </div>
            
            {[
              { id: 'categories', icon: LayoutGrid, label: 'Categories' },
              { id: 'agents', icon: Bot, label: 'Explore Agents' },
              { id: 'community', icon: Users, label: 'Community' },
              { id: 'userRequests', icon: Sparkles, label: 'User Requests' },
              { id: 'agentTester', icon: ShieldCheck, label: 'Agent Tester' },
              { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
              { id: 'launch', icon: Rocket, label: 'Launch Agent' },
              { id: 'settings', icon: SettingsIcon, label: 'Settings' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewType)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeView === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <item.icon size={18} className={activeView === item.id ? 'text-indigo-600' : 'text-gray-400'} />
                {item.label}
              </button>
            ))}

            <div className="lg:hidden h-px w-full bg-gray-100 my-2"></div>

            <button 
              onClick={() => { onOpenRequestModal(); setIsMobileMenuOpen(false); }}
              className="lg:hidden mt-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <PenTool size={18} />
              Request Custom Agent
            </button>

            <button 
              onClick={() => { onOpenAISearch(); setIsMobileMenuOpen(false); }}
              className="sm:hidden mt-2 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
            >
              <Sparkles size={18} />
              Ask AI
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
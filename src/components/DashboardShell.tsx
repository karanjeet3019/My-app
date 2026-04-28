import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Zap, 
  Palette, 
  Image as ImageIcon, 
  FileOutput, 
  Settings, 
  ChevronRight,
  Menu,
  X,
  Store,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  id: string;
  key?: string;
}

const NavItem = ({ icon: Icon, label, active, onClick, id }: NavItemProps) => (
  <button
    id={`nav-${id}`}
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg group",
      active 
        ? "bg-indigo-50 text-indigo-700 shadow-sm" 
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
    <span>{label}</span>
  </button>
);

export default function DashboardShell({ 
  children, 
  activeTab, 
  setActiveTab 
}: { 
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'analyze', label: 'URL Analyzer', icon: Search },
    { id: 'remix', label: 'Page Builder', icon: Zap },
    { id: 'rebrand', label: 'Rebrand Studio', icon: Palette },
    { id: 'images', label: 'Image Prompts', icon: ImageIcon },
    { id: 'export', label: 'Export Center', icon: FileOutput },
    { id: 'shopify', label: 'Shopify Store', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F7] flex text-slate-900 font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-slate-200 transition-all duration-300 fixed lg:static z-50 h-full",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className={cn("flex items-center gap-2 font-bold text-xl tracking-tight text-indigo-950", !isSidebarOpen && "hidden")}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span>PageRemix <span className="text-indigo-600">AI</span></span>
            </div>
            {!isSidebarOpen && (
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-4">
            {navItems.map((item) => (
              <NavItem 
                key={item.id}
                id={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className={cn("bg-green-50 rounded-xl p-4", !isSidebarOpen && "hidden")}>
               <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Plan: Free</p>
               <p className="text-sm text-slate-600">Unlimited AI Remixes</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 lg:flex hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="font-semibold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h2>
           </div>

           <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="avatar" />
                   </div>
                 ))}
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                 <ExternalLink className="w-4 h-4" />
                 View Store
              </button>
           </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

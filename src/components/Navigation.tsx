import React from 'react';
import { Home, Compass, BookOpen, History, Settings } from 'lucide-react';

export type NavTab = 'home' | 'guided' | 'tasks' | 'history' | 'settings';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasActiveTask: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  hasActiveTask,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    {
      id: 'guided' as NavTab,
      label: 'Guided Help',
      icon: Compass,
      badge: hasActiveTask ? 'Active' : null,
    },
    { id: 'tasks' as NavTab, label: 'Task Library', icon: BookOpen },
    { id: 'history' as NavTab, label: 'History', icon: History },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1.5 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 shadow-xs border border-blue-200 dark:border-blue-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1.5">
        <span className="font-medium text-slate-700 dark:text-slate-300">DeskSense</span>
        <span>•</span>
        <span>"Learn your computer with confidence"</span>
      </div>
    </nav>
  );
};

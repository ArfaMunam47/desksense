import React from 'react';
import {
  Home,
  Compass,
  BookOpen,
  Code2,
  History,
  Info,
  Settings,
} from 'lucide-react';
import { NavTab } from '../types';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasActiveTask: boolean;
  hasActiveCoding: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  hasActiveTask,
  hasActiveCoding,
}) => {
  const navItems = [
    {
      id: 'home' as NavTab,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'guided' as NavTab,
      label: 'Guided Help',
      icon: Compass,
      badge: hasActiveTask ? 'Active' : null,
    },
    {
      id: 'tasks' as NavTab,
      label: 'Task Library',
      icon: BookOpen,
    },
    {
      id: 'coding' as NavTab,
      label: 'Coding Help',
      icon: Code2,
      badge: hasActiveCoding ? 'Ready' : null,
    },
    {
      id: 'history' as NavTab,
      label: 'History',
      icon: History,
    },
    {
      id: 'about' as NavTab,
      label: 'About',
      icon: Info,
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav
      className="bg-white border-b border-[#E8DDDA] px-4 sm:px-6 flex items-center justify-between shadow-[0_2px_8px_rgba(60,52,54,0.03)]"
      aria-label="Main Navigation"
    >
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#F5E2E3] text-[#3C3436] font-bold shadow-2xs border border-[#D98F9B]'
                  : 'text-[#6F6263] hover:text-[#3C3436] hover:bg-[#FFF9F5] border border-transparent'
              }`}
            >
              <Icon
                className={`w-4.5 h-4.5 ${isActive ? 'text-[#D98F9B]' : 'text-[#6F6263]'}`}
                strokeWidth={2.25}
              />
              <span>{item.label}</span>
              {item.badge && (
                <span className="w-2 h-2 rounded-full bg-[#D98F9B] animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center text-xs text-[#6F6263] gap-2">
        <span className="font-extrabold text-[#3C3436]">DeskSense</span>
        <span className="text-[#E8DDDA]">|</span>
        <span className="text-[#254E4A] font-medium">Learn your computer with confidence.</span>
      </div>
    </nav>
  );
};

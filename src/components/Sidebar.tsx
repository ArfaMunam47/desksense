import React from 'react';
import {
  Home,
  Compass,
  BookOpen,
  Code2,
  Clock,
  Info,
  Settings,
  Monitor,
  Camera,
  Sparkles,
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasActiveTask: boolean;
  hasActiveCoding: boolean;
  onQuickCapture?: () => void;
  hasActiveCapture?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  hasActiveTask,
  hasActiveCoding,
  onQuickCapture,
  hasActiveCapture,
}) => {
  const mainNavItems = [
    {
      id: 'home' as NavTab,
      label: 'Home',
      icon: Home,
      accentBg: 'bg-[#DDEBDD]',
      accentText: 'text-[#355C4B]',
      accentBorder: 'border-[#A9C9AD]',
    },
    {
      id: 'guided' as NavTab,
      label: 'Get Help',
      icon: Compass,
      badge: hasActiveTask ? 'Active' : null,
      accentBg: 'bg-[#DDEBDD]',
      accentText: 'text-[#355C4B]',
      accentBorder: 'border-[#A9C9AD]',
    },
    {
      id: 'tasks' as NavTab,
      label: 'Task Library',
      icon: BookOpen,
      accentBg: 'bg-[#F4EBCF]',
      accentText: 'text-[#303B38]',
      accentBorder: 'border-[#E2D6B2]',
    },
    {
      id: 'coding' as NavTab,
      label: 'Coding Help',
      icon: Code2,
      badge: hasActiveCoding ? 'Ready' : null,
      accentBg: 'bg-[#E8E2F1]',
      accentText: 'text-[#65517E]',
      accentBorder: 'border-[#C8BFD8]',
    },
    {
      id: 'history' as NavTab,
      label: 'Activity',
      icon: Clock,
      accentBg: 'bg-[#F4E3D6]',
      accentText: 'text-[#303B38]',
      accentBorder: 'border-[#E4CCBC]',
    },
  ];

  const secondaryNavItems = [
    {
      id: 'about' as NavTab,
      label: 'About DeskSense',
      icon: Info,
      accentBg: 'bg-[#ECEDE9]',
      accentText: 'text-[#303B38]',
      accentBorder: 'border-[#E2E4DF]',
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
      accentBg: 'bg-[#ECEDE9]',
      accentText: 'text-[#303B38]',
      accentBorder: 'border-[#E2E4DF]',
    },
  ];

  return (
    <aside
      className="w-60 lg:w-64 bg-[#FFFFFF] border-r border-[#E2E4DF] flex flex-col justify-between shrink-0 select-none z-20 h-full"
      aria-label="Desktop Sidebar Navigation"
    >
      {/* Top Brand Section */}
      <div className="p-5 border-b border-[#E2E4DF]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#DDEBDD] border border-[#A9C9AD] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),0_3px_8px_rgba(53,92,75,0.18)] flex items-center justify-center text-[#355C4B] shrink-0 transition-transform hover:scale-103">
            <Monitor className="w-[23px] h-[23px]" strokeWidth={2.7} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[#303B38] text-base tracking-tight leading-tight">
                DeskSense
              </span>
              <span className="text-[10px] font-bold bg-[#ECEDE9] text-[#727A75] px-1.5 py-0.5 rounded-md">
                v0.9
              </span>
            </div>
            <p className="text-[11px] text-[#727A75] truncate mt-0.5 font-medium">
              Computer Guidance
            </p>
          </div>
        </div>
      </div>

      {/* Middle Navigation Menus */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* Main Section */}
        <div className="space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-extrabold text-[#727A75] uppercase tracking-wider">
            Menu
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? `${item.accentBg} ${item.accentText} border ${item.accentBorder} shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_4px_rgba(48,59,56,0.06)] font-bold`
                    : 'text-[#727A75] hover:text-[#303B38] hover:bg-[#ECEDE9]/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-[22px] h-[22px] shrink-0 ${
                      isActive ? item.accentText : 'text-[#727A75]'
                    }`}
                    strokeWidth={2.65}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#355C4B] border border-[#A9C9AD] shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* System & Support Section */}
        <div className="space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-extrabold text-[#727A75] uppercase tracking-wider">
            Preferences
          </div>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ECEDE9] text-[#303B38] border border-[#E2E4DF] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_4px_rgba(48,59,56,0.06)] font-bold'
                    : 'text-[#727A75] hover:text-[#303B38] hover:bg-[#ECEDE9]/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-[22px] h-[22px] shrink-0 ${
                      isActive ? 'text-[#303B38]' : 'text-[#727A75]'
                    }`}
                    strokeWidth={2.65}
                  />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar Clean Bottom */}
      <div className="p-4 border-t border-[#E2E4DF] flex items-center justify-between text-[11px] text-[#727A75]">
        <span className="font-semibold text-[#303B38] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#355C4B]" />
          <span>DeskSense</span>
        </span>
        <span className="font-mono text-[10px] text-[#727A75]">Ready</span>
      </div>
    </aside>
  );
};

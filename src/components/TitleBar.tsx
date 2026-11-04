import React from 'react';
import { Minus, Square, X, Camera } from 'lucide-react';
import { ServerStatus } from '../types';

interface TitleBarProps {
  status: ServerStatus | null;
  onQuickCapture?: () => void;
  hasActiveCapture: boolean;
  currentPageTitle?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  status,
  onQuickCapture,
  hasActiveCapture,
  currentPageTitle,
}) => {
  return (
    <header className="h-9 bg-[#FFFFFF] border-b border-[#E2E4DF] text-[#303B38] flex items-center justify-between px-4 select-none text-xs font-sans shrink-0">
      {/* Left: Window Title or Location */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#727A75] text-[11px] tracking-wide">
          DeskSense
        </span>
        {currentPageTitle && (
          <>
            <span className="text-[#E2E4DF]">•</span>
            <span className="font-semibold text-[#303B38] text-[11px]">
              {currentPageTitle}
            </span>
          </>
        )}
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center gap-2">
        {hasActiveCapture && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#DDEBDD] text-[#355C4B] border border-[#A9C9AD] text-[10px] font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]">
            <Camera className="w-3.5 h-3.5 text-[#355C4B]" strokeWidth={2.6} />
            <span>Screen Attached</span>
          </span>
        )}

        <div className="flex items-center text-[#727A75] ml-1 gap-0.5">
          <button
            className="w-6.5 h-6.5 flex items-center justify-center hover:bg-[#ECEDE9] rounded-md transition-colors"
            title="Minimize"
            aria-label="Minimize"
          >
            <Minus className="w-3.5 h-3.5" strokeWidth={2.6} />
          </button>
          <button
            className="w-6.5 h-6.5 flex items-center justify-center hover:bg-[#ECEDE9] rounded-md transition-colors"
            title="Maximize"
            aria-label="Maximize"
          >
            <Square className="w-3 h-3" strokeWidth={2.6} />
          </button>
          <button
            className="w-6.5 h-6.5 flex items-center justify-center hover:bg-[#F1DDE0] hover:text-[#B96F7D] rounded-md transition-colors"
            title="Close"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.6} />
          </button>
        </div>
      </div>
    </header>
  );
};

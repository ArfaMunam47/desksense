import React from 'react';
import { Monitor, Camera, Shield, Minus, Square, X } from 'lucide-react';
import { ServerStatus } from '../types';

interface TitleBarProps {
  status: ServerStatus | null;
  onQuickCapture: () => void;
  hasActiveCapture: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  status,
  onQuickCapture,
  hasActiveCapture,
}) => {
  return (
    <header className="h-10 bg-[#FFF9F5] border-b border-[#E8DDDA] text-[#3C3436] flex items-center justify-between px-4 select-none text-xs font-sans transition-colors">
      {/* Left: App Identity with Strong Brand Mark */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#254E4A] text-white font-bold shadow-[0_1px_4px_rgba(37,78,74,0.3)]">
          <Monitor className="w-3.5 h-3.5 text-white" strokeWidth={2.25} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#3C3436] tracking-tight text-sm">DeskSense</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E3EFEB] text-[#254E4A] border border-[#254E4A]/25">
            v0.9.0
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 ml-3 pl-3 border-l border-[#E8DDDA] text-[11px] text-[#6F6263]">
          <Shield className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />
          <span className="font-medium">Zero Background Recording</span>
        </div>
      </div>

      {/* Center: System Status */}
      <div className="hidden md:flex items-center gap-2 text-[11px]">
        {status?.aiConfigured ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E3EFEB] text-[#254E4A] border border-[#254E4A]/20 font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#254E4A] animate-pulse" />
            <span>AI Screen Vision Active</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#6F6263] border border-[#E8DDDA] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6F6263]" />
            <span>Task Library & Local Mode</span>
          </span>
        )}

        {hasActiveCapture && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5E2E3] text-[#D98F9B] border border-[#D98F9B] font-bold">
            <Camera className="w-3.5 h-3.5 text-[#D98F9B]" strokeWidth={2.25} />
            <span>Screenshot Attached</span>
          </span>
        )}
      </div>

      {/* Right: Quick Capture Action & Window Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onQuickCapture}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E3EFEB] hover:bg-[#D4E8E2] active:bg-[#C2DCD4] text-[#254E4A] transition-all border border-[#254E4A]/30 text-xs font-bold cursor-pointer shadow-2xs"
          title="Capture screen now (User-Authorized)"
        >
          <Camera className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />
          <span className="hidden sm:inline">Capture Screen</span>
        </button>

        {/* Desktop window controls */}
        <div className="flex items-center text-[#6F6263] ml-1">
          <button
            className="w-7 h-7 flex items-center justify-center hover:bg-[#E8DDDA] rounded-md transition-colors"
            title="Minimize"
            aria-label="Minimize"
          >
            <Minus className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center hover:bg-[#E8DDDA] rounded-md transition-colors"
            title="Maximize"
            aria-label="Maximize"
          >
            <Square className="w-3 h-3" strokeWidth={2.25} />
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center hover:bg-[#D98F9B] hover:text-white rounded-md transition-colors"
            title="Close"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </header>
  );
};

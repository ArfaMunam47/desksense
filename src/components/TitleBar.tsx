import React from 'react';
import { Monitor, Camera, Sparkles, Shield, Minus, Square, X } from 'lucide-react';
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
    <header className="h-10 bg-slate-900 border-b border-slate-800 text-slate-300 flex items-center justify-between px-3 select-none text-xs font-sans">
      {/* Left: App Identity */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-600 text-white font-bold shadow-xs">
          <Monitor className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-100 tracking-tight">DeskSense</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700/80">
            v0.9.0 Preview
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-800 text-[11px] text-slate-400">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Zero Background Recording</span>
        </div>
      </div>

      {/* Center: System Status */}
      <div className="hidden md:flex items-center gap-2 text-[11px]">
        {status?.aiConfigured ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Sparkles className="w-3 h-3" />
            <span>AI Screen Vision Active</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>Task Library & Offline Mode</span>
          </span>
        )}

        {hasActiveCapture && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/80">
            <Camera className="w-3 h-3" />
            <span>Screenshot Attached</span>
          </span>
        )}
      </div>

      {/* Right: Quick Capture Action & Window Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onQuickCapture}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 hover:text-white transition-colors border border-slate-700 text-xs font-medium cursor-pointer"
          title="Capture screen now (User-Authorized)"
        >
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Capture Screen</span>
        </button>

        {/* Windows 11 style window control buttons */}
        <div className="flex items-center text-slate-400 ml-1">
          <button
            className="w-7 h-7 flex items-center justify-center hover:bg-slate-800 rounded-sm transition-colors"
            title="Minimize (Desktop Shell Simulation)"
            aria-label="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center hover:bg-slate-800 rounded-sm transition-colors"
            title="Maximize (Desktop Shell Simulation)"
            aria-label="Maximize"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center hover:bg-red-600 hover:text-white rounded-sm transition-colors"
            title="Close (Desktop Shell Simulation)"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

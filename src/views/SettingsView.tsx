import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Monitor,
  Eye,
  Shield,
  Layers,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Trash2,
  Save,
} from 'lucide-react';
import { AppSettings, ServerStatus } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  serverStatus: ServerStatus | null;
  onRefreshStatus: () => void;
  onClearAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  serverStatus,
  onRefreshStatus,
  onClearAllData,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const tauriArchitectureSnippet = `# DeskSense Desktop Architecture
# 1. Desktop Shell (Tauri 2.0 / Rust)
#    - Native OS window controls & hotkey registration (Win+Alt+D)
#    - Native screen capture via tauri-plugin-screenshot
#
# 2. Frontend Layer (React 19 + TypeScript + Tailwind)
#    - The UI components you are viewing right now
#    - Calls Tauri IPC: invoke('capture_active_window')
#
# 3. Python Local Engine (Optional Sidecar)
#    - Local OCR (Tesseract / EasyOCR) for offline text detection
#    - Fallback to server-side Gemini 3.8 Flash for rich vision interpretation`;

  const handleCopyArchitecture = () => {
    navigator.clipboard.writeText(tauriArchitectureSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <Settings className="w-4 h-4" />
          <span>Application Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Settings & Architecture
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your accessibility preferences, view AI service health, and review desktop integration.
        </p>
      </div>

      {/* Accessibility & Visual Comfort */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Accessibility & Reading Comfort</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Font Scaling */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              Text Scaling (Large Typography for Beginners):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'Default' },
                { id: 'large', label: 'Large (115%)' },
                { id: 'extra-large', label: 'X-Large (130%)' },
              ].map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ ...settings, fontSize: size.id as any })
                  }
                  className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                    settings.fontSize === size.id
                      ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Preference */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              Color Theme:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light' },
                { id: 'dark', label: 'Dark' },
                { id: 'system', label: 'Auto (System)' },
              ].map((thm) => (
                <button
                  key={thm.id}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ ...settings, theme: thm.id as any })
                  }
                  className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                    settings.theme === thm.id
                      ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-600 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {thm.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* High contrast switch */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              High Contrast Borders
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Adds stronger borders around clickable action targets and buttons.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) =>
              onUpdateSettings({ ...settings, highContrast: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* AI Screen Understanding Backend Status */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>AI Screen Vision Service (Gemini API)</span>
          </div>
          <button
            type="button"
            onClick={onRefreshStatus}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Status</span>
          </button>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Backend Server:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">
              Express 4 + Vite ({serverStatus?.environment || 'active'})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">AI Screen Vision Model:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {serverStatus?.model || 'gemini-3.8-flash (when configured)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">API Key Configuration:</span>
            {serverStatus?.aiConfigured ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Configured & Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Key Not Detected in Environment
              </span>
            )}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          DeskSense never fabricates responses. When the Gemini Vision model is not configured, the app seamlessly provides verified, deterministic guides from the Task Library.
        </p>
      </div>

      {/* Desktop Shell (Tauri) and Python Architecture Path */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Target Desktop Architecture (Tauri + Python Road Map)</span>
          </div>
          <button
            type="button"
            onClick={handleCopyArchitecture}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{copiedCode ? 'Copied!' : 'Copy Summary'}</span>
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            As specified in the product engineering blueprint, DeskSense is architected for export into a native Windows desktop application:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                1. Web Front End
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                React 19 + TypeScript. Reusable UI and guidance player running right now.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                2. Tauri Desktop Shell
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Lightweight Rust wrapper providing native OS screen capture, tray icon, and offline file permissions.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                3. Python Local Engine
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Local OCR (Tesseract / EasyOCR) for reading on-screen menus with zero cloud latency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Local Storage & Privacy Management */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Local Data & Privacy Controls</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          DeskSense values user privacy above all else. No user accounts are required, no passwords are asked or stored, and screenshots are never preserved across browser reloads.
        </p>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400">
            Reset all settings & wipe saved session history from this browser:
          </span>
          <button
            type="button"
            onClick={onClearAllData}
            className="px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Local Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

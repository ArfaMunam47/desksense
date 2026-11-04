import React, { useState } from 'react';
import {
  Settings,
  Sparkles,
  Eye,
  Shield,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Trash2,
  Camera,
  Sliders,
  Info,
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
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const tauriArchitectureSnippet = `# DeskSense Desktop Architecture
# 1. Desktop Shell (Tauri 2.0 / Rust)
#    - Native OS window controls & hotkey registration (Win+Alt+D)
#    - Native screen capture via tauri-plugin-screenshot
#
# 2. Frontend Layer (React 19 + TypeScript + Tailwind)
#    - Desktop UI & interactive step player
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
    <div className="max-w-4xl mx-auto px-6 py-6 sm:py-8 space-y-7">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECEDE9] text-[#303B38] text-xs font-bold border border-[#E2E4DF] shadow-2xs">
          <Settings className="w-4.5 h-4.5 text-[#303B38]" strokeWidth={2.65} />
          <span>Application Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#303B38]">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#727A75]">
          Configure interface accessibility, privacy controls, screen capture preferences, and service status.
        </p>
      </div>

      {/* 1. General Preferences */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 text-sm font-extrabold text-[#303B38]">
          <div className="w-10 h-10 rounded-xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_4px_rgba(53,92,75,0.12)]">
            <Sliders className="w-5 h-5" strokeWidth={2.7} />
          </div>
          <span>General Preferences</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Default Operating System Context */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#303B38] block">
              Operating System Context:
            </label>
            <select
              value={settings.defaultOs}
              onChange={(e) =>
                onUpdateSettings({ ...settings, defaultOs: e.target.value as any })
              }
              className="w-full px-3.5 py-2.5 bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-xs text-[#303B38] focus:outline-hidden focus:ring-2 focus:ring-[#355C4B] focus:bg-[#FFFFFF] font-bold"
            >
              <option value="Windows 11">Windows 11 (Default)</option>
              <option value="Windows 10">Windows 10</option>
              <option value="macOS">macOS</option>
              <option value="Linux">Linux</option>
            </select>
            <p className="text-[11px] text-[#727A75]">
              Assumed operating system when answering general shortcuts or settings questions.
            </p>
          </div>

          {/* Startup Destination */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#303B38] block">
              Default Startup View:
            </label>
            <select
              value={settings.startupDestination}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  startupDestination: e.target.value as any,
                })
              }
              className="w-full px-3.5 py-2.5 bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-xs text-[#303B38] focus:outline-hidden focus:ring-2 focus:ring-[#355C4B] focus:bg-[#FFFFFF] font-bold"
            >
              <option value="home">Home Dashboard</option>
              <option value="guided">Get Help Workspace</option>
              <option value="tasks">Task Library</option>
              <option value="coding">Coding Help</option>
            </select>
            <p className="text-[11px] text-[#727A75]">
              The initial view presented when DeskSense opens.
            </p>
          </div>
        </div>

        {/* Beginner Terminology Mode */}
        <div className="pt-2 border-t border-[#E2E4DF] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#303B38]">
              Beginner Terminology Mode
            </div>
            <p className="text-[11px] text-[#727A75]">
              Prefers everyday terms (e.g., "Folder", "Right mouse button", "Shortcut") instead of technical jargon.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.beginnerTerminologyMode}
            onChange={(e) =>
              onUpdateSettings({
                ...settings,
                beginnerTerminologyMode: e.target.checked,
              })
            }
            className="w-4.5 h-4.5 rounded cursor-pointer accent-[#355C4B]"
          />
        </div>
      </div>

      {/* 2. Appearance & Accessibility */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 text-sm font-extrabold text-[#303B38]">
          <div className="w-10 h-10 rounded-xl bg-[#E8E2F1] text-[#65517E] flex items-center justify-center border border-[#C8BFD8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_4px_rgba(101,81,126,0.12)]">
            <Eye className="w-5 h-5" strokeWidth={2.7} />
          </div>
          <span>Appearance & Accessibility</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Text Scaling */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#303B38] block">
              Text Scaling (Large Typography for Readability):
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
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    settings.fontSize === size.id
                      ? 'bg-[#DDEBDD] border-[#A9C9AD] text-[#355C4B] shadow-2xs'
                      : 'bg-[#F4F4F1] border-[#E2E4DF] text-[#303B38] hover:bg-[#ECEDE9]'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Preference */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#303B38] block">
              Color Theme:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Light' },
                { id: 'dark', label: 'Dark' },
                { id: 'system', label: 'System' },
              ].map((thm) => (
                <button
                  key={thm.id}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ ...settings, theme: thm.id as any })
                  }
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    settings.theme === thm.id
                      ? 'bg-[#DDEBDD] border-[#A9C9AD] text-[#355C4B] shadow-2xs'
                      : 'bg-[#F4F4F1] border-[#E2E4DF] text-[#303B38] hover:bg-[#ECEDE9]'
                  }`}
                >
                  {thm.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* High contrast switch */}
        <div className="pt-2 border-t border-[#E2E4DF] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#303B38]">
              High Contrast Action Outlines
            </div>
            <p className="text-[11px] text-[#727A75]">
              Highlights clickable steps and action badges with high-contrast borders.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) =>
              onUpdateSettings({ ...settings, highContrast: e.target.checked })
            }
            className="w-4.5 h-4.5 rounded cursor-pointer accent-[#355C4B]"
          />
        </div>
      </div>

      {/* 3. Screen Capture Preferences */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 text-sm font-extrabold text-[#303B38]">
          <div className="w-10 h-10 rounded-xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_4px_rgba(53,92,75,0.12)] shrink-0">
            <Camera className="w-5 h-5" strokeWidth={2.7} />
          </div>
          <span>Screen Capture Settings</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-[#303B38]">
              Primary Screen Access Method:
            </span>
            <div className="p-3.5 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#303B38]">
                  Browser Display Media (getDisplayMedia)
                </p>
                <p className="text-[11px] text-[#727A75]">
                  Requests explicit per-frame permission via browser dialog. Tracks stop instantly after 1 snapshot.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] bg-[#DDEBDD] text-[#355C4B] font-bold border border-[#A9C9AD] shadow-2xs">
                Active & Working
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF] text-[11px] text-[#727A75] space-y-1">
            <p className="font-bold text-[#303B38]">
              Future Desktop Integration (Tauri Native Shell):
            </p>
            <p className="leading-relaxed">
              Native global hotkey capture (e.g., Win+Alt+D) and window-specific hooks will be enabled when compiled into a native desktop installer.
            </p>
          </div>
        </div>
      </div>

      {/* 4. AI Services & Health */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-extrabold text-[#303B38]">
            <div className="w-10 h-10 rounded-xl bg-[#F4EBCF] text-[#5A4F35] flex items-center justify-center border border-[#E2D6B2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_4px_rgba(90,79,53,0.1)] shrink-0">
              <Sparkles className="w-5 h-5 text-[#355C4B]" strokeWidth={2.7} />
            </div>
            <span>AI Screen Vision & Assistant Services</span>
          </div>
          <button
            type="button"
            onClick={onRefreshStatus}
            className="text-xs text-[#355C4B] hover:underline flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2.65} />
            <span>Refresh Status</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF] space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#727A75] font-medium">Backend Server:</span>
            <span className="font-mono font-bold text-[#303B38]">
              Express 4 + Vite ({serverStatus?.environment || 'online'})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#727A75] font-medium">AI Screen Vision & Assistant Model:</span>
            <span className="font-mono font-bold text-[#355C4B]">
              {serverStatus?.model || 'gemini-3.8-flash (via @google/genai SDK)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#727A75] font-medium">API Key Configuration:</span>
            {serverStatus?.aiConfigured ? (
              <span className="inline-flex items-center gap-1.5 text-[#355C4B] font-bold">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
                Configured & Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#727A75] font-medium">
                <AlertTriangle className="w-4.5 h-4.5 text-[#727A75]" strokeWidth={2.65} />
                Key Not Detected
              </span>
            )}
          </div>
        </div>

        <p className="text-[11px] text-[#727A75] leading-relaxed">
          DeskSense never presents fake AI responses. If the AI service is unreachable, verified task definitions from the Task Library remain 100% available offline.
        </p>
      </div>

      {/* 5. Privacy & Data Management */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 text-sm font-extrabold text-[#303B38]">
          <div className="w-10 h-10 rounded-xl bg-[#F1DDE0] text-[#B96F7D] flex items-center justify-center border border-[#DFC0C7] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_4px_rgba(185,111,125,0.12)] shrink-0">
            <Shield className="w-5 h-5" strokeWidth={2.7} />
          </div>
          <span>Privacy & Data Management</span>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-[#303B38]">
                Save Completed Sessions to Local History
              </div>
              <p className="text-[11px] text-[#727A75]">
                Only records task titles and steps. Screenshots are never saved.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.saveHistory}
              onChange={(e) =>
                onUpdateSettings({ ...settings, saveHistory: e.target.checked })
              }
              className="w-4.5 h-4.5 rounded cursor-pointer accent-[#355C4B]"
            />
          </div>

          <div className="pt-2 border-t border-[#E2E4DF] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#303B38]">
                Reset All Local Settings & Activity Records
              </div>
              <p className="text-[11px] text-[#727A75]">
                Wipes all stored records from your browser's localStorage.
              </p>
            </div>

            {resetConfirmed ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearAllData();
                    setResetConfirmed(false);
                  }}
                  className="px-3.5 py-2 bg-[#B96F7D] hover:bg-[#A35967] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Confirm Reset
                </button>
                <button
                  type="button"
                  onClick={() => setResetConfirmed(false)}
                  className="px-3 py-2 bg-[#FFFFFF] text-[#303B38] rounded-xl text-xs font-semibold cursor-pointer border border-[#E2E4DF]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setResetConfirmed(true)}
                className="px-3.5 py-1.5 rounded-xl border border-[#B96F7D] text-[#B96F7D] hover:bg-[#F1DDE0] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs bg-[#FFFFFF]"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.65} />
                <span>Reset Local Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6. Application Information */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-extrabold text-[#303B38]">
            <div className="w-10 h-10 rounded-xl bg-[#ECEDE9] text-[#303B38] flex items-center justify-center border border-[#E2E4DF] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_4px_rgba(48,59,56,0.06)] shrink-0">
              <Info className="w-5 h-5" strokeWidth={2.7} />
            </div>
            <span>Application Information</span>
          </div>
          <button
            type="button"
            onClick={handleCopyArchitecture}
            className="text-xs text-[#355C4B] hover:underline flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Code2 className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
            <span>{copiedCode ? 'Copied Snippet!' : 'Copy Desktop Architecture'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF]">
            <span className="text-[#727A75] block text-[11px]">Application:</span>
            <span className="font-extrabold text-[#303B38]">
              DeskSense (Intelligent Desktop Assistant)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF]">
            <span className="text-[#727A75] block text-[11px]">Version:</span>
            <span className="font-mono font-bold text-[#355C4B]">
              {serverStatus?.version || '0.9.0-preview'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF] sm:col-span-2">
            <span className="text-[#727A75] block text-[11px]">Target Architecture:</span>
            <span className="text-[#303B38] leading-relaxed text-[11px] font-medium">
              React 19 + TypeScript frontend with Express backend bridge, ready for Tauri 2.0 (Rust) desktop shell packaging and local Python OCR engine.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

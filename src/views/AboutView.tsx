import React from 'react';
import {
  Monitor,
  Heart,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Code2,
  BookOpen,
  ArrowRight,
  Compass,
  Sparkles,
} from 'lucide-react';
import { ServerStatus } from '../types';

interface AboutViewProps {
  serverStatus: ServerStatus | null;
  onNavigateToTasks: () => void;
  onNavigateToCoding: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  serverStatus,
  onNavigateToTasks,
  onNavigateToCoding,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
      {/* Section 1: Product Identity Hero */}
      <div className="space-y-3 border-b border-[#E2E4DF] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDEBDD] text-[#355C4B] text-xs font-bold border border-[#A9C9AD] shadow-2xs">
          <Monitor className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
          <span>Product Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#303B38] tracking-tight">
          DeskSense
        </h1>
        <p className="text-lg sm:text-xl text-[#355C4B] font-bold">
          Learn your computer with confidence.
        </p>
        <p className="text-sm sm:text-base text-[#727A75] font-medium leading-relaxed max-w-2xl">
          DeskSense is an AI-powered desktop assistant designed to help people understand computers, navigate everyday software, resolve errors, and develop lasting digital confidence through patient, step-by-step guidance.
        </p>
      </div>

      {/* Section 2: Why DeskSense Exists */}
      <section className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 sm:p-7 space-y-3.5 shadow-xs">
        <h2 className="text-lg font-extrabold text-[#303B38] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_5px_rgba(53,92,75,0.12)]">
            <Heart className="w-5 h-5 text-[#355C4B]" strokeWidth={2.7} />
          </div>
          <span>Why DeskSense exists</span>
        </h2>
        <div className="space-y-3 text-sm text-[#303B38] leading-relaxed font-medium">
          <p>
            Computers are essential for education, employment, and everyday life. However, not everyone has had the opportunity to learn how to use them with confidence.
          </p>
          <p className="text-[#727A75]">
            Simple tasks can quickly become frustrating when people do not know where to begin. Some people hesitate to ask classmates, colleagues, or family members for help because they fear being judged for not knowing something others consider basic.
          </p>
          <p className="font-extrabold text-[#355C4B] pt-1">
            DeskSense provides accessible, patient, practical guidance at the moment it is needed—without judgment or embarrassment.
          </p>
        </div>
      </section>

      {/* Section 3: Our Mission */}
      <section className="bg-[#F4EBCF] p-6 rounded-2xl border border-[#E2D6B2] shadow-xs space-y-2">
        <div className="text-xs font-bold text-[#303B38] uppercase tracking-wider flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#FFFFFF] flex items-center justify-center border border-[#E2D6B2] shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />
          </div>
          <span>Our Mission</span>
        </div>
        <p className="text-lg sm:text-xl font-extrabold text-[#303B38] leading-snug">
          "Make computer literacy more accessible, one step at a time."
        </p>
      </section>

      {/* Section 4: What DeskSense Helps With */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#303B38]">
          What DeskSense helps with
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
          {[
            {
              title: 'Everyday Computer Guidance',
              desc: 'Pinning applications, understanding the Start menu, sound, display, and Bluetooth.',
              bg: 'bg-[#DDEBDD]',
              border: 'border-[#A9C9AD]',
              text: 'text-[#355C4B]',
            },
            {
              title: 'Application Understanding',
              desc: 'Navigating unfamiliar menus, browser profiles, toolbar settings, and window modes.',
              bg: 'bg-[#F1DDE0]',
              border: 'border-[#DFC0C7]',
              text: 'text-[#B96F7D]',
            },
            {
              title: 'Coding & Development Support',
              desc: 'Explaining cryptic terminal outputs, VS Code setups, Python tracebacks, and npm errors.',
              bg: 'bg-[#E8E2F1]',
              border: 'border-[#C8BFD8]',
              text: 'text-[#65517E]',
            },
            {
              title: 'File & Document Management',
              desc: 'Locating downloads, extracting ZIP archives, organizing folders, and moving files.',
              bg: 'bg-[#F4E3D6]',
              border: 'border-[#E4CCBC]',
              text: 'text-[#8E5E47]',
            },
            {
              title: 'Computer Troubleshooting',
              desc: 'Safely unfreezing stuck applications, checking task managers, and diagnosing audio.',
              bg: 'bg-[#F4EBCF]',
              border: 'border-[#E2D6B2]',
              text: 'text-[#303B38]',
            },
            {
              title: 'Step-by-Step Learning',
              desc: 'Guided numbered actions that explain why each step matters, fostering independence.',
              bg: 'bg-[#ECEDE9]',
              border: 'border-[#E2E4DF]',
              text: 'text-[#303B38]',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#E2E4DF] bg-[#FFFFFF] space-y-2 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.bg} border ${item.border}`} />
                <h3 className="text-sm font-extrabold text-[#303B38]">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-[#727A75] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Our Values */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#303B38]">
          Our Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="p-5 rounded-2xl border border-[#A9C9AD] bg-[#DDEBDD]/60 space-y-2 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#355C4B]">
              1. Accessibility
            </h3>
            <p className="text-xs text-[#303B38] leading-relaxed">
              Computer guidance should be understandable to everyone. No technical jargon where simple words will do.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#C8BFD8] bg-[#E8E2F1]/60 space-y-2 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#65517E]">
              2. Confidence
            </h3>
            <p className="text-xs text-[#303B38] leading-relaxed">
              Users should feel comfortable asking questions without fear of judgment. Every resolved task builds capability.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#E2D6B2] bg-[#F4EBCF]/60 space-y-2 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#303B38]">
              3. Independence
            </h3>
            <p className="text-xs text-[#303B38] leading-relaxed">
              The goal is to help people develop lasting skills and solve future computer problems themselves.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#DFC0C7] bg-[#F1DDE0]/60 space-y-2 shadow-xs">
            <h3 className="text-sm font-extrabold text-[#B96F7D]">
              4. Patient guidance
            </h3>
            <p className="text-xs text-[#303B38] leading-relaxed">
              Step-by-step assistance that moves at the learner's own pace with clear, calm explanations.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#E4CCBC] bg-[#F4E3D6]/60 space-y-2 shadow-xs sm:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-extrabold text-[#8E5E47]">
              5. Privacy and transparency
            </h3>
            <p className="text-xs text-[#303B38] leading-relaxed">
              Single-frame observation only when explicitly requested; strictly zero background recording or secret telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Privacy and Trust */}
      <section className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 sm:p-7 space-y-3.5 shadow-xs">
        <h2 className="text-lg font-extrabold text-[#303B38] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_5px_rgba(53,92,75,0.12)]">
            <ShieldCheck className="w-5 h-5 text-[#355C4B]" strokeWidth={2.7} />
          </div>
          <span>Privacy & Trust</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-[#303B38] leading-relaxed font-medium">
          <p>
            Screen access is <strong>strictly user-initiated and permission-based</strong>. When you click "Capture Screen", your browser requests explicit consent. Media streams are stopped immediately after capturing a single frame.
          </p>
          <p className="text-[#727A75]">
            DeskSense has <strong>zero continuous background recording</strong> and <strong>no surveillance</strong>. When vision assistance is requested, the single snapshot is transmitted securely to the server-side Gemini 3.8 Flash model for analysis. Screenshots are never saved permanently to disk or retained in your local history logs.
          </p>
        </div>
      </section>

      {/* Section 7: Product Information */}
      <section className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-xs font-bold text-[#355C4B] uppercase tracking-wider flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#DDEBDD] flex items-center justify-center border border-[#A9C9AD]/60 shadow-2xs">
            <Cpu className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />
          </div>
          <span>Product & Architecture Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF] space-y-0.5">
            <span className="text-[#727A75] font-medium">Product Name:</span>
            <p className="font-extrabold text-[#303B38]">DeskSense</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF] space-y-0.5">
            <span className="text-[#727A75] font-medium">Current Version:</span>
            <p className="font-mono font-bold text-[#355C4B]">
              {serverStatus?.version || '0.9.0-preview'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF] space-y-0.5">
            <span className="text-[#727A75] font-medium">Development Status:</span>
            <p className="font-semibold text-[#303B38]">
              Web preview with desktop bridge architecture for Tauri (Rust) and Python local OCR engine
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF] space-y-0.5">
            <span className="text-[#727A75] font-medium">Confirmed Technology Stack:</span>
            <p className="font-semibold text-[#303B38]">
              React 19, TypeScript, Tailwind CSS, Vite, Express, @google/genai (Gemini 3.8 Flash)
            </p>
          </div>
        </div>

        <p className="text-[11px] text-[#727A75] italic">
          Note: DeskSense is actively evolving. Native desktop integration with direct operating-system window hooks and offline local OCR will follow in subsequent desktop build releases.
        </p>
      </section>

      {/* Quick Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2E4DF]">
        <button
          type="button"
          onClick={onNavigateToTasks}
          className="text-xs font-bold text-[#355C4B] hover:underline flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
          <span>Explore Verified Task Library</span>
          <ArrowRight className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />
        </button>

        <button
          type="button"
          onClick={onNavigateToCoding}
          className="text-xs font-bold text-[#65517E] hover:underline flex items-center gap-2 cursor-pointer"
        >
          <Code2 className="w-4.5 h-4.5 text-[#65517E]" strokeWidth={2.65} />
          <span>Explore Coding Help</span>
          <ArrowRight className="w-4 h-4 text-[#65517E]" strokeWidth={2.65} />
        </button>
      </div>

      {/* Creator Credit */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 text-center space-y-1.5 shadow-2xs">
        <p className="text-xs font-semibold text-[#727A75] leading-none">
          Designed &amp; Developed by
        </p>
        <p className="text-base font-extrabold text-[#355C4B] tracking-tight">
          Arfa Munam
        </p>
        <p className="text-xs text-[#727A75] font-mono pt-1">
          © 2026 DeskSense. All rights reserved.
        </p>
      </div>
    </div>
  );
};

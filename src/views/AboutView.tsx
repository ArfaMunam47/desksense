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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Brand Hero */}
      <div className="space-y-3 border-b border-[#E8DDDA] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EFEB] text-[#254E4A] text-xs font-bold border border-[#254E4A]/30 shadow-2xs">
          <Monitor className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
          <span>Product Overview & Philosophy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3C3436] tracking-tight">
          About DeskSense
        </h1>
        <p className="text-base sm:text-lg text-[#6F6263] font-medium leading-relaxed">
          Learn your computer with confidence.
        </p>
      </div>

      {/* 1. What is DeskSense? */}
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-[#3C3436]">
          What is DeskSense?
        </h2>
        <p className="text-sm sm:text-base text-[#3C3436] leading-relaxed font-medium">
          DeskSense is an AI-powered desktop assistant designed to help people understand their computers and navigate everyday digital tasks.
        </p>
        <p className="text-sm sm:text-base text-[#6F6263] leading-relaxed">
          It provides patient, contextual, step-by-step guidance so users can solve problems, navigate software, and build genuine digital confidence.
        </p>
      </section>

      {/* 2. Why does DeskSense exist? */}
      <section className="bg-white border border-[#E8DDDA] rounded-2xl p-6 sm:p-7 space-y-3.5 shadow-[0_4px_16px_rgba(60,52,54,0.04)]">
        <h2 className="text-lg font-extrabold text-[#3C3436] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E3EFEB] text-[#254E4A] flex items-center justify-center border border-[#254E4A]/25">
            <Heart className="w-4.5 h-4.5 text-[#254E4A]" strokeWidth={2.25} />
          </div>
          <span>Why does DeskSense exist?</span>
        </h2>
        <div className="space-y-3 text-sm text-[#3C3436] leading-relaxed font-medium">
          <p>
            Not everyone has access to someone who can patiently explain how to use a computer.
          </p>
          <p className="text-[#6F6263]">
            Simple tasks can quickly become frustrating when people do not know where to begin. Some users hesitate to ask teachers, colleagues, or family members for help because they fear being judged or feeling embarrassed.
          </p>
          <p className="font-extrabold text-[#254E4A] pt-1">
            DeskSense aims to make learning computer skills more accessible, comfortable, and independent.
          </p>
        </div>
      </section>

      {/* 3. Our Mission */}
      <section className="bg-[#FFF9F5] p-6 rounded-2xl border border-[#E8DDDA] shadow-xs space-y-2">
        <div className="text-xs font-bold text-[#D98F9B] uppercase tracking-wider">
          Our Mission
        </div>
        <p className="text-lg sm:text-xl font-extrabold text-[#3C3436] leading-snug">
          "Make computer literacy accessible to everyone by turning confusing computer tasks into understandable, manageable steps."
        </p>
      </section>

      {/* 4. What can DeskSense help with? */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#3C3436]">
          What can DeskSense help with?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
          {[
            'Everyday computer tasks & basic navigation',
            'File, folder, and download management',
            'Browser profiles, bookmarks, and downloads',
            'Windows settings, display scaling, and troubleshooting',
            'Understanding unfamiliar applications and menus',
            'Programming tools, code editors, and coding errors',
            'Learning technical concepts in simple, plain language',
            'Diagnosing audio, freeze, or display issues safely',
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[#E8DDDA] bg-white flex items-start gap-3 shadow-[0_2px_8px_rgba(60,52,54,0.03)]"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-[#254E4A] shrink-0 mt-0.5" strokeWidth={2.25} />
              <span className="text-[#3C3436] font-bold text-xs sm:text-sm">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Our Philosophy */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#3C3436]">
          Our Philosophy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-[#E8DDDA] bg-white space-y-2 shadow-[0_4px_16px_rgba(60,52,54,0.04)]">
            <h3 className="text-sm font-extrabold text-[#254E4A] flex items-center gap-1.5">
              <span>1. Accessibility</span>
            </h3>
            <p className="text-xs text-[#6F6263] leading-relaxed">
              No technical jargon where plain words will do. Everyone deserves to feel welcome in front of a keyboard.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#E8DDDA] bg-white space-y-2 shadow-[0_4px_16px_rgba(60,52,54,0.04)]">
            <h3 className="text-sm font-extrabold text-[#D98F9B] flex items-center gap-1.5">
              <span>2. Confidence</span>
            </h3>
            <p className="text-xs text-[#6F6263] leading-relaxed">
              Every resolved problem is a step toward confidence. DeskSense explains the "why", not just the "click".
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#E8DDDA] bg-white space-y-2 shadow-[0_4px_16px_rgba(60,52,54,0.04)]">
            <h3 className="text-sm font-extrabold text-[#254E4A] flex items-center gap-1.5">
              <span>3. Independence</span>
            </h3>
            <p className="text-xs text-[#6F6263] leading-relaxed">
              The goal is not to keep you dependent on software, but to equip you with the knowledge to do it yourself next time.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Privacy by Design */}
      <section className="bg-white border border-[#E8DDDA] rounded-2xl p-6 sm:p-7 space-y-3.5 shadow-[0_4px_16px_rgba(60,52,54,0.04)]">
        <h2 className="text-lg font-extrabold text-[#3C3436] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E3EFEB] text-[#254E4A] flex items-center justify-center border border-[#254E4A]/25">
            <ShieldCheck className="w-4.5 h-4.5 text-[#254E4A]" strokeWidth={2.25} />
          </div>
          <span>Privacy by Design</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-[#3C3436] leading-relaxed font-medium">
          <p>
            Screen access is <strong>strictly user-initiated and permission-based</strong>. When you click "Capture Screen", your browser requests explicit consent. Media streams are stopped immediately after capturing a single frame.
          </p>
          <p className="text-[#6F6263]">
            DeskSense has <strong>zero continuous background recording</strong> and <strong>no surveillance</strong>. When vision assistance is requested, the single snapshot is transmitted securely to the server-side Gemini 3.8 Flash model for analysis. Screenshots are never saved permanently to disk or retained in your local history logs.
          </p>
        </div>
      </section>

      {/* 7. Development Information */}
      <section className="bg-white border border-[#E8DDDA] rounded-2xl p-6 space-y-4 shadow-[0_4px_16px_rgba(60,52,54,0.04)]">
        <h2 className="text-xs font-bold text-[#254E4A] uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
          <span>Development Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#E8DDDA] space-y-0.5">
            <span className="text-[#6F6263] font-medium">Product Name:</span>
            <p className="font-extrabold text-[#3C3436]">DeskSense</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#E8DDDA] space-y-0.5">
            <span className="text-[#6F6263] font-medium">Current Version:</span>
            <p className="font-mono font-bold text-[#254E4A]">
              {serverStatus?.version || '0.9.0-preview'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#E8DDDA] space-y-0.5">
            <span className="text-[#6F6263] font-medium">Development Status:</span>
            <p className="font-semibold text-[#3C3436]">
              Web preview with desktop bridge architecture for Tauri (Rust) and Python local OCR engine
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#E8DDDA] space-y-0.5">
            <span className="text-[#6F6263] font-medium">Confirmed Technology Stack:</span>
            <p className="font-semibold text-[#3C3436]">
              React 19, TypeScript, Tailwind CSS, Vite, Express, @google/genai (Gemini 3.8 Flash)
            </p>
          </div>
        </div>

        <p className="text-[11px] text-[#6F6263] italic">
          Note: DeskSense is actively evolving. Native desktop integration with direct operating-system window hooks and offline local OCR will follow in subsequent desktop build releases.
        </p>
      </section>

      {/* Quick Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E8DDDA]">
        <button
          type="button"
          onClick={onNavigateToTasks}
          className="text-xs font-bold text-[#254E4A] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
          <span>Explore Verified Task Library</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />
        </button>

        <button
          type="button"
          onClick={onNavigateToCoding}
          className="text-xs font-bold text-[#D98F9B] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <Code2 className="w-4 h-4 text-[#D98F9B]" strokeWidth={2.25} />
          <span>Explore Coding Help</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#D98F9B]" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
};

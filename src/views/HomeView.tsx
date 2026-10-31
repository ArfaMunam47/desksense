import React, { useState } from 'react';
import {
  Camera,
  Search,
  ArrowRight,
  ShieldCheck,
  Code2,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { Task, ScreenCapture } from '../types';
import { VERIFIED_TASKS } from '../data/taskLibrary';

interface HomeViewProps {
  onAskQuestion: (question: string) => void;
  onOpenCapture: () => void;
  onSelectTask: (task: Task) => void;
  onNavigateToTasks: () => void;
  onNavigateToCoding: () => void;
  currentCapture: ScreenCapture | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onAskQuestion,
  onOpenCapture,
  onSelectTask,
  onNavigateToTasks,
  onNavigateToCoding,
  currentCapture,
}) => {
  const [questionInput, setQuestionInput] = useState('');

  const exampleQuestions = [
    'How do I download this picture?',
    'How do I create a new folder?',
    'Where did my downloaded file go?',
    'How do I make text on screen bigger?',
    'How do I create another Chrome profile?',
    'How do I connect Bluetooth headphones?',
  ];

  const popularTasks = VERIFIED_TASKS.slice(0, 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionInput.trim()) {
      onAskQuestion(questionInput.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setQuestionInput(example);
    onAskQuestion(example);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-9">
      {/* 1. Welcoming Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EFEB] text-[#254E4A] text-xs font-bold border border-[#254E4A]/30 shadow-2xs">
          <Compass className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
          <span>Patient Desktop Guidance</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3C3436] tracking-tight">
          What would you like help with today?
        </h1>

        <p className="text-sm sm:text-base text-[#6F6263] max-w-2xl leading-relaxed font-medium">
          DeskSense helps you navigate computer tasks, configure settings, organize files, and solve software errors through calm, step-by-step guidance.
        </p>
      </div>

      {/* 2. Prominent Natural-Language Question Input Card on Pure White */}
      <div className="bg-white border border-[#E8DDDA] rounded-2xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(60,52,54,0.06)] space-y-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-extrabold text-[#3C3436] uppercase tracking-wider">
            Ask in ordinary language:
          </label>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative grow">
              <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#254E4A]" strokeWidth={2.25} />
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="E.g., 'How do I download this picture?' or 'How do I unfreeze an app?'"
                className="w-full pl-11 pr-4 py-3 bg-[#FFF9F5] border border-[#E8DDDA] rounded-xl text-xs sm:text-sm text-[#3C3436] placeholder-[#6F6263]/70 focus:outline-hidden focus:ring-2 focus:ring-[#D98F9B] focus:bg-white transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={!questionInput.trim()}
              className="px-6 py-3 bg-[#D98F9B] hover:bg-[#C77D89] disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-[0_3px_12px_rgba(217,143,155,0.35)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Ask DeskSense</span>
              <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.25} />
            </button>
          </div>
        </form>

        {/* Screen Capture Attachment & Privacy Bar */}
        <div className="pt-3 border-t border-[#E8DDDA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenCapture}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold border transition-all cursor-pointer shadow-2xs ${
                currentCapture
                  ? 'bg-[#F5E2E3] border-[#D98F9B] text-[#D98F9B]'
                  : 'bg-[#E3EFEB] hover:bg-[#D4E8E2] border-[#254E4A]/30 text-[#254E4A]'
              }`}
            >
              <Camera className="w-4 h-4 text-current" strokeWidth={2.25} />
              <span>{currentCapture ? 'Change Attached Screenshot' : 'Capture Screen'}</span>
            </button>

            {currentCapture && (
              <span className="text-[11px] text-[#254E4A] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
                <span>Screenshot Ready</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#6F6263]">
            <ShieldCheck className="w-4 h-4 text-[#254E4A] shrink-0" strokeWidth={2.25} />
            <span>Screen capture is strictly user-authorized. Zero background monitoring.</span>
          </div>
        </div>

        {/* Example prompts */}
        <div className="pt-2 space-y-2">
          <span className="text-[11px] font-bold text-[#6F6263] uppercase tracking-wider">
            Quick Examples
          </span>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleExampleClick(q)}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#FFF9F5] hover:bg-[#F5E2E3] text-[#3C3436] hover:text-[#D98F9B] border border-[#E8DDDA] cursor-pointer transition-colors text-left font-semibold shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Quick Access to Coding Help Banner with Deep Teal */}
      <div className="bg-white border border-[#E8DDDA] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(60,52,54,0.05)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E3EFEB] text-[#254E4A] flex items-center justify-center shrink-0 border border-[#254E4A]/20 shadow-xs">
            <Code2 className="w-6 h-6" strokeWidth={2.25} />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-extrabold text-[#3C3436]">
              Working on code or learning programming?
            </h3>
            <p className="text-xs text-[#6F6263] leading-relaxed">
              Use our dedicated Coding Help to explain terminal errors, troubleshoot VS Code, or fix install issues safely.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToCoding}
          className="px-4 py-2.5 rounded-xl bg-[#254E4A] hover:bg-[#1C3D3A] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0 transition-colors shadow-2xs"
        >
          <span>Open Coding Help</span>
          <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
        </button>
      </div>

      {/* 4. Popular Beginner Tasks with Differentiated Icon Themes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#3C3436]">
              Popular Verified Guides
            </h2>
            <p className="text-xs text-[#6F6263]">
              Step-by-step instructions verified for everyday computer tasks
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToTasks}
            className="text-xs font-bold text-[#254E4A] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularTasks.map((task, idx) => {
            const isTealAccent = idx % 2 === 0;
            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="bg-white border border-[#E8DDDA] hover:border-[#D98F9B] hover:shadow-[0_4px_20px_rgba(60,52,54,0.08)] rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-bold text-[11px] px-2.5 py-0.5 rounded-md border ${
                        isTealAccent
                          ? 'bg-[#E3EFEB] text-[#254E4A] border-[#254E4A]/25'
                          : 'bg-[#F5E2E3] text-[#D98F9B] border-[#D98F9B]/40'
                      }`}
                    >
                      {task.category}
                    </span>
                    <span className="text-[#6F6263] font-mono text-[11px] font-semibold">
                      {task.steps.length} Steps
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#3C3436] group-hover:text-[#D98F9B] transition-colors leading-snug">
                    {task.title}
                  </h3>
                  <p className="text-xs text-[#6F6263] line-clamp-2 leading-relaxed">
                    {task.summary}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#E8DDDA] text-[11px]">
                  <span className="text-[#6F6263] font-mono font-medium">
                    {task.osContext}
                  </span>
                  <span className="text-[#254E4A] font-extrabold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Start Guide →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

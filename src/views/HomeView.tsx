import React, { useState } from 'react';
import {
  Camera,
  Search,
  ArrowRight,
  ShieldCheck,
  Code2,
  Monitor,
  Folder,
  AppWindow,
  CheckCircle2,
  Sparkles,
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

  // 6 specific popular tasks from the verified catalog
  const popularTasks = VERIFIED_TASKS.slice(0, 6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionInput.trim()) {
      onAskQuestion(questionInput.trim());
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'Coding Help') {
      onNavigateToCoding();
    } else {
      onNavigateToTasks();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* A. Welcome Section */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#727A75] uppercase tracking-wider flex items-center gap-1.5">
          <span>Good to see you</span>
          <span className="text-sm">👋</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#303B38] tracking-tight">
          What can we figure out today?
        </h1>
        <p className="text-sm sm:text-base text-[#727A75] max-w-2xl leading-relaxed font-medium">
          From everyday computer tasks to confusing software errors, DeskSense helps you move forward with patient, step-by-step guidance.
        </p>
      </div>

      {/* B. Main Ask DeskSense Area */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(48,59,56,0.04)] space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-extrabold text-[#303B38] uppercase tracking-wider">
            Ask any question in plain language:
          </label>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative grow">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#727A75]" strokeWidth={2.65} />
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="E.g., 'How do I download this picture?' or 'Where did my file go?'"
                className="w-full pl-12 pr-4 py-3.5 bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-sm text-[#303B38] placeholder-[#727A75]/70 focus:outline-hidden focus:ring-2 focus:ring-[#355C4B] focus:bg-[#FFFFFF] transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={!questionInput.trim()}
              className="px-6 py-3.5 bg-[#355C4B] hover:bg-[#29473A] disabled:opacity-40 text-white font-extrabold text-sm rounded-xl transition-all shadow-[0_3px_10px_rgba(53,92,75,0.25)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Ask DeskSense</span>
              <ArrowRight className="w-5 h-5" strokeWidth={2.7} />
            </button>
          </div>
        </form>

        {/* Attachment & Simple Reassurance */}
        <div className="pt-3 border-t border-[#E2E4DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenCapture}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                currentCapture
                  ? 'bg-[#DDEBDD] border-[#A9C9AD] text-[#355C4B] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]'
                  : 'bg-[#F4F4F1] hover:bg-[#ECEDE9] border-[#E2E4DF] text-[#303B38]'
              }`}
            >
              <Camera className="w-4.5 h-4.5 text-current" strokeWidth={2.65} />
              <span>{currentCapture ? 'Change Attached Screenshot' : 'Attach Screenshot'}</span>
            </button>

            {currentCapture && (
              <span className="text-[11px] text-[#355C4B] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
                <span>Ready for observation</span>
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#727A75] font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
            <span>Your screen is only captured when you choose to share it.</span>
          </div>
        </div>
      </div>

      {/* C. Explore Assistance Categories (Dashboard Grid) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#303B38]">
            Explore Guidance Areas
          </h2>
          <span className="text-xs text-[#727A75] font-medium">
            Jump directly into verified guides
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Computer Basics */}
          <div
            onClick={() => handleCategoryClick('Computer Basics')}
            className="bg-[#DDEBDD] border border-[#A9C9AD] hover:border-[#355C4B] rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-[0_2px_8px_rgba(53,92,75,0.06)] hover:shadow-[0_4px_12px_rgba(53,92,75,0.12)]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] text-[#355C4B] flex items-center justify-center border border-[#A9C9AD]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_6px_rgba(53,92,75,0.12)] group-hover:scale-105 transition-transform">
                <Monitor className="w-6 h-6 text-[#355C4B]" strokeWidth={2.75} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#303B38] group-hover:text-[#355C4B] transition-colors">
                  Computer Basics
                </h3>
                <p className="text-xs text-[#727A75] mt-1 leading-relaxed">
                  Learn everyday computer tasks, shortcuts, and essential settings.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#A9C9AD]/40 flex items-center justify-between text-[11px] text-[#355C4B] font-bold">
              <span>Explore Basics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.65} />
            </div>
          </div>

          {/* 2. Coding Help */}
          <div
            onClick={() => handleCategoryClick('Coding Help')}
            className="bg-[#E8E2F1] border border-[#C8BFD8] hover:border-[#65517E] rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-[0_2px_8px_rgba(101,81,126,0.06)] hover:shadow-[0_4px_12px_rgba(101,81,126,0.12)]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] text-[#65517E] flex items-center justify-center border border-[#C8BFD8]/70 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_6px_rgba(101,81,126,0.12)] group-hover:scale-105 transition-transform">
                <Code2 className="w-6 h-6 text-[#65517E]" strokeWidth={2.75} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#303B38] group-hover:text-[#65517E] transition-colors">
                  Coding Help
                </h3>
                <p className="text-xs text-[#727A75] mt-1 leading-relaxed">
                  Understand code errors, terminal output, and development problems.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#C8BFD8]/40 flex items-center justify-between text-[11px] text-[#65517E] font-bold">
              <span>Open Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.65} />
            </div>
          </div>

          {/* 3. Files and Folders */}
          <div
            onClick={() => handleCategoryClick('Files and Folders')}
            className="bg-[#F4E3D6] border border-[#E4CCBC] hover:border-[#8E5E47] rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-[0_2px_8px_rgba(142,94,71,0.06)] hover:shadow-[0_4px_12px_rgba(142,94,71,0.12)]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] text-[#8E5E47] flex items-center justify-center border border-[#E4CCBC]/70 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_6px_rgba(142,94,71,0.12)] group-hover:scale-105 transition-transform">
                <Folder className="w-6 h-6 text-[#8E5E47]" strokeWidth={2.75} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#303B38] group-hover:text-[#8E5E47] transition-colors">
                  Files and Folders
                </h3>
                <p className="text-xs text-[#727A75] mt-1 leading-relaxed">
                  Organize files, locate downloads, and manage folder structures.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E4CCBC]/40 flex items-center justify-between text-[11px] text-[#8E5E47] font-bold">
              <span>View Guides</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.65} />
            </div>
          </div>

          {/* 4. Application Guidance */}
          <div
            onClick={() => handleCategoryClick('Application Guidance')}
            className="bg-[#F1DDE0] border border-[#DFC0C7] hover:border-[#B96F7D] rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-[0_2px_8px_rgba(185,111,125,0.06)] hover:shadow-[0_4px_12px_rgba(185,111,125,0.12)]"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] text-[#B96F7D] flex items-center justify-center border border-[#DFC0C7]/70 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_6px_rgba(185,111,125,0.12)] group-hover:scale-105 transition-transform">
                <AppWindow className="w-6 h-6 text-[#B96F7D]" strokeWidth={2.75} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#303B38] group-hover:text-[#B96F7D] transition-colors">
                  Application Guidance
                </h3>
                <p className="text-xs text-[#727A75] mt-1 leading-relaxed">
                  Understand unfamiliar application windows, tools, and menu controls.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#DFC0C7]/40 flex items-center justify-between text-[11px] text-[#B96F7D] font-bold">
              <span>Browse Guides</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.65} />
            </div>
          </div>
        </div>
      </div>

      {/* D. Popular Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#303B38]">
              Popular Everyday Tasks
            </h2>
            <p className="text-xs text-[#727A75]">
              Vetted step-by-step walkthroughs to get started right away
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToTasks}
            className="text-xs font-bold text-[#355C4B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Guides ({VERIFIED_TASKS.length})</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.65} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {popularTasks.map((task, idx) => {
            const badgeClasses = [
              'bg-[#DDEBDD] text-[#355C4B] border-[#A9C9AD]',
              'bg-[#E8E2F1] text-[#65517E] border-[#C8BFD8]',
              'bg-[#F4E3D6] text-[#8E5E47] border-[#E4CCBC]',
              'bg-[#F1DDE0] text-[#B96F7D] border-[#DFC0C7]',
              'bg-[#F4EBCF] text-[#303B38] border-[#E2D6B2]',
              'bg-[#ECEDE9] text-[#303B38] border-[#E2E4DF]',
            ][idx % 6];

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="bg-[#FFFFFF] border border-[#E2E4DF] hover:border-[#355C4B] hover:shadow-[0_4px_16px_rgba(48,59,56,0.06)] rounded-2xl p-4 sm:p-5 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeClasses}`}>
                      {task.category}
                    </span>
                    <span className="text-[#727A75] font-mono text-[10px] font-semibold">
                      {task.steps.length} steps
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#303B38] group-hover:text-[#355C4B] transition-colors leading-snug">
                    {task.title}
                  </h3>
                  <p className="text-xs text-[#727A75] line-clamp-2 leading-relaxed">
                    {task.summary}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#E2E4DF] text-[11px]">
                  <span className="text-[#727A75] font-mono text-[10px]">
                    {task.osContext}
                  </span>
                  <span className="text-[#355C4B] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Start Guide →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* E. Subtle Privacy Message */}
      <div className="pt-2 text-center text-xs text-[#727A75] font-medium">
        <span>DeskSense prioritizes your digital privacy. </span>
        <span className="text-[#303B38] font-bold">Your screen is only captured when you choose to share it.</span>
      </div>
    </div>
  );
};

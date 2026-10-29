import React, { useState } from 'react';
import {
  Camera,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FolderPlus,
  Download,
  Users,
  Volume2,
  Maximize2,
  HelpCircle,
  Laptop,
} from 'lucide-react';
import { Task, ScreenCapture } from '../types';
import { VERIFIED_TASKS } from '../data/taskLibrary';

interface HomeViewProps {
  onAskQuestion: (question: string) => void;
  onOpenCapture: () => void;
  onSelectTask: (task: Task) => void;
  onNavigateToTasks: () => void;
  currentCapture: ScreenCapture | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onAskQuestion,
  onOpenCapture,
  onSelectTask,
  onNavigateToTasks,
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
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Laptop className="w-3.5 h-3.5" />
          <span>Patient & Judgment-Free Desktop Assistance</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Learn to use your computer confidently,{' '}
          <span className="text-blue-600 dark:text-blue-400">one step at a time.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
          DeskSense helps you navigate everyday tasks like saving files, creating folders, and tweaking settings with simple, clear instructions.
        </p>
      </div>

      {/* Main Question & Screen Capture Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            What do you want to do on your computer?
          </label>

          <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative grow">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask in ordinary language (e.g., 'How do I download this picture?')"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!questionInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-medium text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Ask DeskSense</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Screen Capture Attachment Row */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenCapture}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                currentCapture
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{currentCapture ? 'Change Attached Screenshot' : 'Attach Screen Capture'}</span>
            </button>

            {currentCapture && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ 1 Screenshot Attached
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Only captured when you click. Never recorded in the background.</span>
          </div>
        </div>

        {/* Example prompts */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Common questions you can ask
          </p>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleExampleClick(q)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Beginner Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Popular Beginner Guides
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Step-by-step instructions verified for Windows 11 & modern browsers
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToTasks}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All 10 Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 rounded-xl p-5 transition-all shadow-xs hover:shadow-md cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {task.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {task.steps.length} Steps
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {task.summary}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  {task.osContext}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Start Guide →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 6-Step Philosophy Explainer */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          How DeskSense Works
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          {[
            { step: '1. Ask', desc: 'Describe your task in plain words' },
            { step: '2. Observe', desc: 'Explicitly capture your window' },
            { step: '3. Understand', desc: 'Detect visible menus and icons' },
            { step: '4. Guide', desc: 'Step-by-step instructions' },
            { step: '5. Verify', desc: 'Check progress honestly' },
            { step: '6. Learn', desc: 'Build computer confidence' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1"
            >
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.step}</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

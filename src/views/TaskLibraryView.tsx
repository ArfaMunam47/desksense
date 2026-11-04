import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Monitor,
  Folder,
  Globe,
  Sliders,
  Bluetooth,
  FileText,
  Code2,
  Wrench,
} from 'lucide-react';
import { Task, TaskCategory } from '../types';
import { VERIFIED_TASKS, TASK_CATEGORIES } from '../data/taskLibrary';
import { ActionBadge } from '../components/ActionBadge';

interface TaskLibraryViewProps {
  onSelectTask: (task: Task) => void;
}

export const TaskLibraryView: React.FC<TaskLibraryViewProps> = ({ onSelectTask }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const categoryMeta: Record<
    string,
    { icon: any; bg: string; text: string; border: string; desc: string }
  > = {
    'Computer Basics': {
      icon: Monitor,
      bg: 'bg-[#DDEBDD]',
      text: 'text-[#355C4B]',
      border: 'border-[#A9C9AD]',
      desc: 'Fundamental navigation, shortcuts, and taskbar management',
    },
    'Files and Folders': {
      icon: Folder,
      bg: 'bg-[#F4E3D6]',
      text: 'text-[#8E5E47]',
      border: 'border-[#E4CCBC]',
      desc: 'Creating, organizing, moving, and locating downloads',
    },
    'Internet and Browsers': {
      icon: Globe,
      bg: 'bg-[#F4EBCF]',
      text: 'text-[#303B38]',
      border: 'border-[#E2D6B2]',
      desc: 'Chrome profiles, bookmarks, searching, and downloads',
    },
    'Windows Settings': {
      icon: Sliders,
      bg: 'bg-[#DDEBDD]',
      text: 'text-[#355C4B]',
      border: 'border-[#A9C9AD]',
      desc: 'Display scaling, night light, audio, and personalizing Windows',
    },
    'Devices and Connectivity': {
      icon: Bluetooth,
      bg: 'bg-[#E8E2F1]',
      text: 'text-[#65517E]',
      border: 'border-[#C8BFD8]',
      desc: 'Bluetooth headphones, Wi-Fi networks, and external displays',
    },
    'Documents and Productivity': {
      icon: FileText,
      bg: 'bg-[#F4E3D6]',
      text: 'text-[#8E5E47]',
      border: 'border-[#E4CCBC]',
      desc: 'ZIP files, screenshots, text documents, and PDFs',
    },
    'Programming and Development': {
      icon: Code2,
      bg: 'bg-[#E8E2F1]',
      text: 'text-[#65517E]',
      border: 'border-[#C8BFD8]',
      desc: 'VS Code, Git, Python, and terminal setup guides',
    },
    'Troubleshooting': {
      icon: Wrench,
      bg: 'bg-[#F1DDE0]',
      text: 'text-[#B96F7D]',
      border: 'border-[#DFC0C7]',
      desc: 'Unfreezing apps, task manager, and restoring sound',
    },
  };

  const filteredTasks = useMemo(() => {
    return VERIFIED_TASKS.filter((task) => {
      // Category filter
      if (selectedCategory !== 'All' && task.category !== selectedCategory) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'All' && task.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesSummary = task.summary.toLowerCase().includes(query);
        const matchesCategory = task.category.toLowerCase().includes(query);
        const matchesTags = task.tags.some((t) => t.toLowerCase().includes(query));
        const matchesSteps = task.steps.some(
          (s) => s.title.toLowerCase().includes(query) || s.instruction.toLowerCase().includes(query)
        );
        return matchesTitle || matchesSummary || matchesCategory || matchesTags || matchesSteps;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 sm:py-8 space-y-7">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDEBDD] text-[#355C4B] text-xs font-bold border border-[#A9C9AD] shadow-2xs">
          <BookOpen className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
          <span>Curated Learning Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#303B38]">
          Task Library
        </h1>
        <p className="text-xs sm:text-sm text-[#727A75] max-w-2xl leading-relaxed">
          Browse vetted, step-by-step instructions for everyday Windows, browser, and development tasks. No AI prompt required.
        </p>
      </div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TASK_CATEGORIES.map((cat) => {
          const meta = categoryMeta[cat];
          const Icon = meta.icon;
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(isSelected ? 'All' : cat)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                isSelected
                  ? `${meta.bg} ${meta.border} shadow-[0_2px_8px_rgba(53,92,75,0.12)] ring-2 ring-[#355C4B]`
                  : 'bg-[#FFFFFF] hover:bg-[#F4F4F1] border-[#E2E4DF] shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl ${meta.bg} ${meta.text} flex items-center justify-center border ${meta.border} shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_5px_rgba(0,0,0,0.06)]`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.7} />
                </div>
                <span className="text-[10px] font-mono text-[#727A75] font-semibold">
                  {VERIFIED_TASKS.filter((t) => t.category === cat).length}
                </span>
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#303B38] line-clamp-1">
                  {cat}
                </p>
                <p className="text-[10px] text-[#727A75] line-clamp-1 mt-0.5 font-medium">
                  {meta.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-5 shadow-[0_4px_16px_rgba(48,59,56,0.04)] space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-[#727A75]" strokeWidth={2.65} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides by keyword (e.g. 'download picture', 'bluetooth', 'python', 'zip', 'restart')..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-xs sm:text-sm text-[#303B38] placeholder-[#727A75] focus:outline-hidden focus:ring-2 focus:ring-[#355C4B] focus:bg-[#FFFFFF] font-medium"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#355C4B] text-white shadow-2xs'
                  : 'bg-[#F4F4F1] text-[#727A75] hover:text-[#303B38] hover:bg-[#ECEDE9] border border-[#E2E4DF]'
              }`}
            >
              All Guides ({VERIFIED_TASKS.length})
            </button>
            {selectedCategory !== 'All' && (
              <span className="text-xs font-bold text-[#355C4B] bg-[#DDEBDD] px-3 py-1.5 rounded-xl border border-[#A9C9AD]">
                Filtered: {selectedCategory}
              </span>
            )}
          </div>

          <span className="font-mono text-[11px] text-[#727A75] font-semibold">
            {filteredTasks.length} Guides matching
          </span>
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            const meta = categoryMeta[task.category] || {
              bg: 'bg-[#ECEDE9]',
              text: 'text-[#303B38]',
              border: 'border-[#E2E4DF]',
            };

            return (
              <div
                key={task.id}
                className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl overflow-hidden shadow-xs hover:border-[#355C4B] hover:shadow-[0_6px_20px_rgba(48,59,56,0.06)] transition-all flex flex-col justify-between"
              >
                <div className="p-5 sm:p-6 space-y-3.5">
                  {/* Category & Tags Header */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`font-bold text-[11px] px-2.5 py-0.5 rounded-md border ${meta.bg} ${meta.text} ${meta.border}`}
                    >
                      {task.category}
                    </span>
                    <span className="text-[#727A75] font-mono text-[11px] font-semibold">
                      {task.difficulty}
                    </span>
                  </div>

                  {/* Title and summary */}
                  <div>
                    <h3 className="text-base font-extrabold text-[#303B38] leading-snug">
                      {task.title}
                    </h3>
                    <p className="text-xs text-[#727A75] mt-1.5 leading-relaxed font-medium">
                      {task.summary}
                    </p>
                  </div>

                  {/* Prerequisites */}
                  <div className="text-[11px] text-[#727A75] bg-[#F4F4F1] p-2.5 rounded-xl border border-[#E2E4DF]">
                    <span className="font-bold text-[#303B38]">Before starting: </span>
                    {task.prerequisites}
                  </div>

                  {/* Expanded Step Preview */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-[#E2E4DF] space-y-3 text-xs">
                      <div className="font-extrabold text-[#303B38]">
                        Instructions Breakdown ({task.steps.length} Steps):
                      </div>
                      <div className="space-y-2">
                        {task.steps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="p-3 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF] space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#303B38]">
                                Step {step.stepNumber}: {step.title}
                              </span>
                              <ActionBadge actionType={step.actionType} size="sm" />
                            </div>
                            <p className="text-[#727A75] text-[11px] leading-relaxed">
                              {step.instruction}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Common Problems & Recovery */}
                      {task.commonProblems.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-[#F1DDE0] border border-[#DFC0C7] space-y-1 shadow-2xs">
                          <div className="flex items-center gap-2 font-bold text-[#B96F7D] text-[11px]">
                            <div className="w-5 h-5 rounded-md bg-[#FFFFFF] flex items-center justify-center border border-[#DFC0C7]/80 shrink-0">
                              <AlertTriangle className="w-3.5 h-3.5 text-[#B96F7D]" strokeWidth={2.65} />
                            </div>
                            <span>Common Pitfall & Recovery:</span>
                          </div>
                          <p className="text-[#303B38] text-[11px] font-bold">
                            {task.commonProblems[0].issue}
                          </p>
                          <p className="text-[#727A75] text-[11px] italic">
                            Solution: {task.commonProblems[0].solution}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 bg-[#F4F4F1] border-t border-[#E2E4DF] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(task.id, e)}
                    className="text-[#727A75] hover:text-[#303B38] flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Steps' : 'Preview Steps'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.7} />
                    ) : (
                      <ChevronDown className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.7} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTask(task)}
                    className="px-4 py-2 rounded-xl bg-[#355C4B] hover:bg-[#29473A] text-white font-bold flex items-center gap-2 cursor-pointer shadow-[0_2px_8px_rgba(53,92,75,0.2)] transition-all hover:scale-102 active:scale-98"
                  >
                    <span>Start Guided Guide</span>
                    <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.7} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-10 text-center space-y-3 shadow-xs">
          <p className="text-xs sm:text-sm text-[#727A75]">
            No guides match your search "{searchQuery}" in this category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs text-[#355C4B] font-bold hover:underline cursor-pointer"
          >
            Clear filters and show all tasks
          </button>
        </div>
      )}
    </div>
  );
};

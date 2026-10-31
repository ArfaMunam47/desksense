import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
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
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-7">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EFEB] text-[#254E4A] text-xs font-bold border border-[#254E4A]/30 shadow-2xs">
          <BookOpen className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
          <span>Verified Computer Tasks Catalog</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3436]">
          Task Library
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6263] max-w-2xl leading-relaxed">
          Browse vetted, step-by-step instructions for everyday Windows, browser, and development tasks. No AI prompt required.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-[#E8DDDA] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(60,52,54,0.04)] space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-[#254E4A]" strokeWidth={2.25} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides by keyword (e.g. 'download picture', 'bluetooth', 'python', 'zip', 'restart')..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#FFF9F5] border border-[#E8DDDA] rounded-xl text-xs sm:text-sm text-[#3C3436] placeholder-[#6F6263] focus:outline-hidden focus:ring-2 focus:ring-[#D98F9B] focus:bg-white font-medium"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-[#6F6263] flex items-center justify-between uppercase tracking-wider">
            <span>Categories</span>
            <span className="font-mono">{filteredTasks.length} Guides Available</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#254E4A] text-white shadow-[0_2px_8px_rgba(37,78,74,0.25)]'
                  : 'bg-[#FFF9F5] text-[#6F6263] hover:text-[#3C3436] hover:bg-[#E3EFEB] border border-[#E8DDDA]'
              }`}
            >
              All Categories
            </button>
            {TASK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#254E4A] text-white shadow-[0_2px_8px_rgba(37,78,74,0.25)]'
                    : 'bg-[#FFF9F5] text-[#6F6263] hover:text-[#3C3436] hover:bg-[#E3EFEB] border border-[#E8DDDA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task, idx) => {
            const isExpanded = expandedTaskId === task.id;
            const isTealBadge = idx % 2 === 0;
            return (
              <div
                key={task.id}
                className="bg-white border border-[#E8DDDA] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(60,52,54,0.04)] hover:border-[#D98F9B] hover:shadow-[0_6px_20px_rgba(60,52,54,0.08)] transition-all flex flex-col justify-between"
              >
                <div className="p-5 sm:p-6 space-y-3.5">
                  {/* Category & Tags Header */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`font-bold text-[11px] px-2.5 py-0.5 rounded-md border ${
                        isTealBadge
                          ? 'bg-[#E3EFEB] text-[#254E4A] border-[#254E4A]/25'
                          : 'bg-[#F5E2E3] text-[#D98F9B] border-[#D98F9B]/40'
                      }`}
                    >
                      {task.category}
                    </span>
                    <span className="text-[#6F6263] font-mono text-[11px] font-semibold">
                      {task.difficulty}
                    </span>
                  </div>

                  {/* Title and summary */}
                  <div>
                    <h3 className="text-base font-extrabold text-[#3C3436] leading-snug">
                      {task.title}
                    </h3>
                    <p className="text-xs text-[#6F6263] mt-1.5 leading-relaxed font-medium">
                      {task.summary}
                    </p>
                  </div>

                  {/* Prerequisites */}
                  <div className="text-[11px] text-[#6F6263] bg-[#FFF9F5] p-2.5 rounded-xl border border-[#E8DDDA]">
                    <span className="font-bold text-[#3C3436]">Before starting: </span>
                    {task.prerequisites}
                  </div>

                  {/* Expanded Step Preview */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-[#E8DDDA] space-y-3 text-xs">
                      <div className="font-extrabold text-[#3C3436]">
                        Instructions Breakdown ({task.steps.length} Steps):
                      </div>
                      <div className="space-y-2">
                        {task.steps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="p-3 rounded-xl bg-[#FFF9F5] border border-[#E8DDDA] space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#3C3436]">
                                Step {step.stepNumber}: {step.title}
                              </span>
                              <ActionBadge actionType={step.actionType} size="sm" />
                            </div>
                            <p className="text-[#6F6263] text-[11px] leading-relaxed">
                              {step.instruction}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Common Problems & Recovery */}
                      {task.commonProblems.length > 0 && (
                        <div className="p-3 rounded-xl bg-[#F5E2E3] border border-[#D98F9B] space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-[#D98F9B] text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.25} />
                            <span>Common Pitfall & Recovery:</span>
                          </div>
                          <p className="text-[#3C3436] text-[11px] font-bold">
                            {task.commonProblems[0].issue}
                          </p>
                          <p className="text-[#6F6263] text-[11px] italic">
                            Solution: {task.commonProblems[0].solution}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 bg-[#FFF9F5] border-t border-[#E8DDDA] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(task.id, e)}
                    className="text-[#6F6263] hover:text-[#3C3436] flex items-center gap-1 cursor-pointer font-bold transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Steps' : 'Preview Steps'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTask(task)}
                    className="px-4 py-2 rounded-xl bg-[#D98F9B] hover:bg-[#C77D89] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(217,143,155,0.3)] transition-all"
                  >
                    <span>Start Guided Guide</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[#E8DDDA] rounded-2xl p-10 text-center space-y-3 shadow-2xs">
          <p className="text-xs sm:text-sm text-[#6F6263]">
            No guides match your search "{searchQuery}" in this category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs text-[#254E4A] font-bold hover:underline cursor-pointer"
          >
            Clear filters and show all tasks
          </button>
        </div>
      )}
    </div>
  );
};

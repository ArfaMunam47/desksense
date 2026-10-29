import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Laptop,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
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
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <BookOpen className="w-4 h-4" />
          <span>Verified Computer Tasks Catalog</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Beginner Task Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Browse vetted, step-by-step instructions for everyday Windows 11 and web tasks. No AI prompt required.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides by keyword (e.g. 'download picture', 'bluetooth', 'zip', 'restart')..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Filter by Category:</span>
            <span>{filteredTasks.length} Guides Available</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Categories
            </button>
            {TASK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
          {filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            return (
              <div
                key={task.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  {/* Category & Tags Header */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                      {task.category}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {task.difficulty}
                    </span>
                  </div>

                  {/* Title and summary */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {task.summary}
                    </p>
                  </div>

                  {/* Prerequisites */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2 rounded border border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Before starting: </span>
                    {task.prerequisites}
                  </div>

                  {/* Expanded Step Preview */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        Instructions Breakdown ({task.steps.length} Steps):
                      </div>
                      <div className="space-y-2">
                        {task.steps.map((step) => (
                          <div
                            key={step.stepNumber}
                            className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                Step {step.stepNumber}: {step.title}
                              </span>
                              <ActionBadge actionType={step.actionType} size="sm" />
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                              {step.instruction}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Common Problems & Recovery */}
                      {task.commonProblems.length > 0 && (
                        <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Common Pitfall & Recovery:</span>
                          </div>
                          <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                            {task.commonProblems[0].issue}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px] italic">
                            Solution: {task.commonProblems[0].solution}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(task.id, e)}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <span>{isExpanded ? 'Hide Steps' : 'Preview Steps'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTask(task)}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>Start Guided Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No guides match your search "{searchQuery}" in this category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Clear filters and show all tasks
          </button>
        </div>
      )}
    </div>
  );
};

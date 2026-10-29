import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  CheckCircle2,
  Calendar,
  Compass,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { HistoryItem } from '../types';
import { loadHistory, deleteHistoryItem, clearAllHistory } from '../services/storage';

interface HistoryViewProps {
  onResumeQuestion?: (question: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onResumeQuestion }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  useEffect(() => {
    setHistoryItems(loadHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistoryItems(loadHistory());
  };

  const handleClearAll = () => {
    clearAllHistory();
    setHistoryItems([]);
    setConfirmClearAll(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <History className="w-4 h-4" />
            <span>Learning Session History</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Your Guided Sessions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review tasks you completed previously to reinforce your learning.
          </p>
        </div>

        {historyItems.length > 0 && (
          <div>
            {confirmClearAll ? (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/60 p-2 rounded-lg border border-red-200 dark:border-red-900">
                <span className="text-xs text-red-700 dark:text-red-300 font-medium">Are you sure?</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-medium cursor-pointer"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-3.5 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-emerald-800/90 dark:text-emerald-300/80">
          <strong>Privacy Guarantee:</strong> History records only the question title and completion record. Captured screenshots are <em>never</em> stored in your history or saved to disk.
        </p>
      </div>

      {/* History List */}
      {historyItems.length > 0 ? (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {item.category || 'General Computer'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.question}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Delete from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Takeaway banner if present */}
              {item.takeaway && (
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Takeaway:</strong> {item.takeaway}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.completedSteps} of {item.totalSteps} steps completed</span>
                </span>

                {onResumeQuestion && (
                  <button
                    type="button"
                    onClick={() => onResumeQuestion(item.question)}
                    className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                  >
                    Ask about this again →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            No Saved Sessions Yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            When you complete guided tasks or ask questions, your completed milestones will be listed here for quick review.
          </p>
        </div>
      )}
    </div>
  );
};

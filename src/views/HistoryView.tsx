import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Code2,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { HistoryItem } from '../types';
import { loadHistory, deleteHistoryItem, clearAllHistory } from '../services/storage';

interface HistoryViewProps {
  onResumeQuestion?: (question: string) => void;
  onNavigateToCoding?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onResumeQuestion,
  onNavigateToCoding,
}) => {
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
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EFEB] text-[#254E4A] text-xs font-bold border border-[#254E4A]/30 shadow-2xs">
            <History className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
            <span>Assistance History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3436]">
            Previous Sessions
          </h1>
          <p className="text-xs text-[#6F6263]">
            Review completed desktop guidance and coding help sessions from this device.
          </p>
        </div>

        {historyItems.length > 0 && (
          <div>
            {confirmClearAll ? (
              <div className="flex items-center gap-2 bg-[#F5E2E3] p-2 rounded-xl border border-[#D98F9B]">
                <span className="text-xs text-[#3C3436] font-bold">Clear all history?</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1 bg-[#D98F9B] hover:bg-[#C77D89] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="px-3 py-1 bg-white text-[#3C3436] rounded-lg text-xs font-semibold cursor-pointer border border-[#E8DDDA]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="px-3.5 py-2 rounded-xl border border-[#E8DDDA] text-[#6F6263] hover:text-[#D98F9B] hover:bg-[#F5E2E3] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs bg-white"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={2.25} />
                <span>Clear History</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="bg-[#E3EFEB] border border-[#254E4A]/25 rounded-2xl p-4 text-xs text-[#3C3436] flex items-start gap-3 shadow-[0_2px_10px_rgba(37,78,74,0.04)]">
        <ShieldCheck className="w-4.5 h-4.5 text-[#254E4A] shrink-0 mt-0.5" strokeWidth={2.25} />
        <p className="leading-relaxed text-[#3C3436] font-medium">
          <strong className="text-[#254E4A]">Privacy note:</strong> History records only store text titles and completed milestones in your browser's private local storage. Screenshots are never saved in your history.
        </p>
      </div>

      {/* History List */}
      {historyItems.length > 0 ? (
        <div className="space-y-3.5">
          {historyItems.map((item) => {
            const isCoding = item.source === 'coding_help';
            return (
              <div
                key={item.id}
                className="bg-white border border-[#E8DDDA] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(60,52,54,0.04)] hover:border-[#D98F9B] transition-all space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 font-bold text-[11px] px-2.5 py-0.5 rounded-md border ${
                          isCoding
                            ? 'bg-[#E3EFEB] text-[#254E4A] border-[#254E4A]/25'
                            : 'bg-[#F5E2E3] text-[#D98F9B] border-[#D98F9B]/40'
                        }`}
                      >
                        {isCoding ? (
                          <>
                            <Code2 className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />
                            <span>Coding Help</span>
                          </>
                        ) : (
                          <>
                            <Compass className="w-3.5 h-3.5 text-[#D98F9B]" strokeWidth={2.25} />
                            <span>{item.category || 'Desktop Guidance'}</span>
                          </>
                        )}
                      </span>
                      <span className="text-[#E8DDDA]">•</span>
                      <span className="flex items-center gap-1 text-[#6F6263] font-mono text-[11px] font-semibold">
                        <Calendar className="w-3 h-3" strokeWidth={2} />
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-[#3C3436]">
                      {item.question}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-[#6F6263] hover:text-[#D98F9B] rounded-xl hover:bg-[#F5E2E3] transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2.25} />
                  </button>
                </div>

                {/* Takeaway banner if present */}
                {item.takeaway && (
                  <div className="bg-[#FFF9F5] p-3 rounded-xl border border-[#E8DDDA] text-xs text-[#3C3436] flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#D98F9B] shrink-0 mt-0.5" strokeWidth={2.25} />
                    <span className="leading-relaxed font-medium">
                      <strong className="text-[#3C3436]">Takeaway:</strong> {item.takeaway}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-xs text-[#6F6263]">
                  <span className="inline-flex items-center gap-1.5 text-[#254E4A] font-bold text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
                    <span>{item.completedSteps} of {item.totalSteps} steps completed</span>
                  </span>

                  {isCoding && onNavigateToCoding ? (
                    <button
                      type="button"
                      onClick={onNavigateToCoding}
                      className="text-[#254E4A] hover:underline cursor-pointer font-bold flex items-center gap-1 text-xs"
                    >
                      <span>Open Coding Help</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />
                    </button>
                  ) : onResumeQuestion ? (
                    <button
                      type="button"
                      onClick={() => onResumeQuestion(item.question.replace(/^\[Coding Help\]\s*/, ''))}
                      className="text-[#D98F9B] hover:underline cursor-pointer font-bold flex items-center gap-1 text-xs"
                    >
                      <span>Reopen in Guided Help</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D98F9B]" strokeWidth={2.25} />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[#E8DDDA] rounded-2xl p-12 text-center space-y-3.5 shadow-[0_4px_16px_rgba(60,52,54,0.04)]">
          <div className="w-12 h-12 rounded-2xl bg-[#E3EFEB] text-[#254E4A] flex items-center justify-center mx-auto border border-[#254E4A]/25">
            <BookOpen className="w-6 h-6 text-[#254E4A]" strokeWidth={2.25} />
          </div>
          <h3 className="text-sm font-extrabold text-[#3C3436]">
            No Saved Sessions Yet
          </h3>
          <p className="text-xs text-[#6F6263] max-w-sm mx-auto leading-relaxed">
            When you complete guided tasks or ask questions, your completed milestones will be listed here for quick review.
          </p>
        </div>
      )}
    </div>
  );
};

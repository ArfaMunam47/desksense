import React, { useState, useEffect } from 'react';
import {
  Clock,
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
    <div className="max-w-4xl mx-auto px-6 py-6 sm:py-8 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4E3D6] text-[#8E5E47] text-xs font-bold border border-[#E4CCBC] shadow-2xs">
            <Clock className="w-4.5 h-4.5 text-[#8E5E47]" strokeWidth={2.65} />
            <span>Activity Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#303B38]">
            Activity
          </h1>
          <p className="text-xs text-[#727A75]">
            Review completed desktop guidance and coding help sessions from this device.
          </p>
        </div>

        {historyItems.length > 0 && (
          <div>
            {confirmClearAll ? (
              <div className="flex items-center gap-2 bg-[#F1DDE0] p-2 rounded-xl border border-[#B96F7D] shadow-2xs">
                <span className="text-xs text-[#303B38] font-bold">Clear all history?</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-1 bg-[#B96F7D] hover:bg-[#A35967] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Yes, Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="px-3 py-1 bg-[#FFFFFF] text-[#303B38] rounded-lg text-xs font-semibold cursor-pointer border border-[#E2E4DF]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="px-3.5 py-2 rounded-xl border border-[#E2E4DF] text-[#727A75] hover:text-[#B96F7D] hover:bg-[#F1DDE0] text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-2xs bg-[#FFFFFF]"
              >
                <Trash2 className="w-4 h-4 text-current" strokeWidth={2.65} />
                <span>Clear History</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-4 text-xs text-[#303B38] flex items-start gap-3 shadow-xs">
        <div className="w-7 h-7 rounded-lg bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center shrink-0 border border-[#A9C9AD]/60 shadow-2xs mt-0.5">
          <ShieldCheck className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
        </div>
        <p className="leading-relaxed text-[#727A75] font-medium pt-0.5">
          <strong className="text-[#303B38]">Privacy note:</strong> Activity records only store text titles and completed milestones in your browser's private local storage. Screenshots are never saved in your history.
        </p>
      </div>

      {/* History List */}
      {historyItems.length > 0 ? (
        <div className="space-y-3">
          {historyItems.map((item) => {
            const isCoding = item.source === 'coding_help';
            return (
              <div
                key={item.id}
                className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-5 shadow-xs hover:border-[#355C4B] transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 font-bold text-[10px] px-2.5 py-1 rounded-md border ${
                          isCoding
                            ? 'bg-[#E8E2F1] text-[#65517E] border-[#C8BFD8]'
                            : 'bg-[#DDEBDD] text-[#355C4B] border-[#A9C9AD]'
                        }`}
                      >
                        {isCoding ? (
                          <>
                            <Code2 className="w-4 h-4 text-[#65517E]" strokeWidth={2.65} />
                            <span>Coding Help</span>
                          </>
                        ) : (
                          <>
                            <Compass className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />
                            <span>{item.category || 'Desktop Guidance'}</span>
                          </>
                        )}
                      </span>
                      <span className="text-[#E2E4DF]">•</span>
                      <span className="flex items-center gap-1.5 text-[#727A75] font-mono text-[11px] font-semibold">
                        <Calendar className="w-3.5 h-3.5" strokeWidth={2.5} />
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-[#303B38]">
                      {item.question}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-[#727A75] hover:text-[#B96F7D] rounded-xl hover:bg-[#F1DDE0] transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4.5 h-4.5" strokeWidth={2.65} />
                  </button>
                </div>

                {/* Takeaway banner if present */}
                {item.takeaway && (
                  <div className="bg-[#F4F4F1] p-3.5 rounded-xl border border-[#E2E4DF] text-xs text-[#303B38] flex items-start gap-2.5 shadow-2xs">
                    <Sparkles className="w-4.5 h-4.5 text-[#355C4B] shrink-0 mt-0.5" strokeWidth={2.65} />
                    <span className="leading-relaxed font-medium">
                      <strong className="text-[#303B38]">Takeaway:</strong> {item.takeaway}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-xs text-[#727A75]">
                  <span className="inline-flex items-center gap-1.5 text-[#355C4B] font-bold text-[11px]">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
                    <span>{item.completedSteps} of {item.totalSteps} steps completed</span>
                  </span>

                  {isCoding && onNavigateToCoding ? (
                    <button
                      type="button"
                      onClick={onNavigateToCoding}
                      className="text-[#65517E] hover:underline cursor-pointer font-bold flex items-center gap-1 text-xs"
                    >
                      <span>Open in Coding Help</span>
                      <ArrowRight className="w-4 h-4 text-[#65517E]" strokeWidth={2.65} />
                    </button>
                  ) : onResumeQuestion ? (
                    <button
                      type="button"
                      onClick={() => onResumeQuestion(item.question.replace(/^\[Coding Help\]\s*/, ''))}
                      className="text-[#355C4B] hover:underline cursor-pointer font-bold flex items-center gap-1 text-xs"
                    >
                      <span>Reopen in Get Help</span>
                      <ArrowRight className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-12 text-center space-y-3.5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center mx-auto border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_6px_rgba(53,92,75,0.12)]">
            <Compass className="w-7 h-7 text-[#355C4B]" strokeWidth={2.75} />
          </div>
          <h3 className="text-base font-extrabold text-[#303B38]">
            Your learning journey starts here.
          </h3>
          <p className="text-xs sm:text-sm text-[#727A75] max-w-md mx-auto leading-relaxed">
            When you complete tasks or ask questions, your recent activity will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

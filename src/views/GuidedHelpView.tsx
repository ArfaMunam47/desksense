import React, { useState } from 'react';
import {
  Camera,
  Trash2,
  Sparkles,
  AlertCircle,
  Eye,
  Maximize2,
  RefreshCw,
  FileQuestion,
  ShieldCheck,
  Compass,
  Send,
  MessageSquare,
} from 'lucide-react';
import { GuidanceStep, ScreenCapture, ScreenAnalysisData } from '../types';
import { StepPlayer } from '../components/StepPlayer';
import { askFollowUpQuestion } from '../services/api';

interface GuidedHelpViewProps {
  question: string;
  onUpdateQuestion: (newQuestion: string) => void;
  capture: ScreenCapture | null;
  onOpenCapture: () => void;
  onDiscardCapture: () => void;
  analysisData: ScreenAnalysisData | null;
  activeSteps: GuidanceStep[];
  currentStepIndex: number;
  isLoading: boolean;
  errorMessage: string | null;
  onNextStep: () => void;
  onPrevStep: () => void;
  onJumpToStep: (index: number) => void;
  onCompleteTask: () => void;
  onTriggerAnalysis: () => void;
}

export const GuidedHelpView: React.FC<GuidedHelpViewProps> = ({
  question,
  onUpdateQuestion,
  capture,
  onOpenCapture,
  onDiscardCapture,
  analysisData,
  activeSteps,
  currentStepIndex,
  isLoading,
  errorMessage,
  onNextStep,
  onPrevStep,
  onJumpToStep,
  onCompleteTask,
  onTriggerAnalysis,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [questionDraft, setQuestionDraft] = useState(question);

  // Follow-up question state
  const [followUpText, setFollowUpText] = useState('');
  const [followUpHistory, setFollowUpHistory] = useState<
    Array<{ role: 'user' | 'assistant'; text: string }>
  >([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionDraft.trim()) {
      onUpdateQuestion(questionDraft.trim());
      setEditingQuestion(false);
      setFollowUpHistory([]);
    }
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim()) return;

    const query = followUpText.trim();
    setFollowUpText('');
    const newHistory = [...followUpHistory, { role: 'user' as const, text: query }];
    setFollowUpHistory(newHistory);
    setIsFollowUpLoading(true);

    try {
      const res = await askFollowUpQuestion(question, activeSteps, query, 'guided_help');
      if (res.success && res.answer) {
        setFollowUpHistory([...newHistory, { role: 'assistant' as const, text: res.answer }]);
      } else {
        setFollowUpHistory([
          ...newHistory,
          {
            role: 'assistant' as const,
            text: res.error || 'I could not process that follow-up. Please try asking again.',
          },
        ]);
      }
    } catch (err: any) {
      setFollowUpHistory([
        ...newHistory,
        {
          role: 'assistant' as const,
          text: 'Unable to reach the assistant. Please check your network connection.',
        },
      ]);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* 1. Question Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(48,59,56,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 grow">
          <div className="flex items-center gap-2 text-xs font-bold text-[#355C4B]">
            <Compass className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
            <span>Get Help Workspace</span>
          </div>

          {editingQuestion ? (
            <form onSubmit={handleSaveQuestion} className="flex items-center gap-2.5 pt-1">
              <input
                type="text"
                value={questionDraft}
                onChange={(e) => setQuestionDraft(e.target.value)}
                className="px-3.5 py-2 border border-[#E2E4DF] bg-[#F4F4F1] rounded-xl text-xs sm:text-sm text-[#303B38] grow focus:outline-hidden focus:ring-2 focus:ring-[#355C4B] focus:bg-[#FFFFFF] font-medium"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#355C4B] hover:bg-[#29473A] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingQuestion(false)}
                className="px-3.5 py-2 bg-[#F4F4F1] text-[#303B38] rounded-xl text-xs font-semibold cursor-pointer border border-[#E2E4DF]"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-base sm:text-lg font-extrabold text-[#303B38]">
                {question || 'How can DeskSense help you today?'}
              </h1>
              <button
                type="button"
                onClick={() => {
                  setQuestionDraft(question);
                  setEditingQuestion(true);
                }}
                className="text-xs text-[#355C4B] hover:underline cursor-pointer font-bold"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Capture Screen Quick Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCapture}
            className="px-4 py-2 rounded-xl bg-[#F4F4F1] hover:bg-[#ECEDE9] border border-[#E2E4DF] text-[#303B38] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
          >
            <Camera className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />
            <span>{capture ? 'Replace Snapshot' : 'Attach Screenshot'}</span>
          </button>

          {capture && (
            <button
              type="button"
              onClick={onDiscardCapture}
              className="p-2 rounded-xl border border-[#E2E4DF] text-[#727A75] hover:text-[#B96F7D] hover:bg-[#F1DDE0] transition-colors cursor-pointer"
              title="Discard screenshot"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.65} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Screen Context & Observation Inspector (5 columns on large screen) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(48,59,56,0.04)]">
            <div className="px-5 py-3.5 bg-[#F4F4F1] border-b border-[#E2E4DF] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#303B38]">
                <Eye className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
                <span>Screen Context & Elements</span>
              </div>
              {capture && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-1.5 rounded-md text-[#727A75] hover:text-[#303B38] hover:bg-[#ECEDE9] text-xs cursor-pointer"
                    title={isZoomed ? 'Shrink preview' : 'Enlarge preview'}
                  >
                    <Maximize2 className="w-4 h-4" strokeWidth={2.65} />
                  </button>
                  <span className="text-[11px] font-mono text-[#727A75] font-semibold">
                    {capture.dimensions ? `${capture.dimensions.width}×${capture.dimensions.height}` : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              {capture ? (
                <div className="space-y-3">
                  <div
                    className={`relative rounded-xl overflow-hidden border border-[#E2E4DF] bg-[#303B38]/5 flex items-center justify-center cursor-pointer transition-all ${
                      isZoomed ? 'max-h-[500px]' : 'max-h-60'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    <img
                      src={capture.dataUrl}
                      alt="Current screen snapshot"
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#303B38]/80 rounded-lg text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                      <Maximize2 className="w-3.5 h-3.5" strokeWidth={2.65} />
                      <span>{isZoomed ? 'Minimize' : 'Zoom'}</span>
                    </div>
                  </div>

                  {/* AI Vision Observations Breakdown */}
                  {analysisData ? (
                    <div className="space-y-3 pt-2 text-xs">
                      {/* Active Application Identified */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#DDEBDD] border border-[#A9C9AD]">
                        <span className="text-[#727A75] font-medium">Detected Window:</span>
                        <span className="font-extrabold text-[#355C4B]">
                          {analysisData.activeApplication || 'Desktop'}
                        </span>
                      </div>

                      {/* Interface Description */}
                      <div className="space-y-1">
                        <span className="font-extrabold text-[#303B38]">
                          Observed Context:
                        </span>
                        <p className="text-[#727A75] leading-relaxed bg-[#F4F4F1] p-3 rounded-xl border border-[#E2E4DF] font-medium">
                          {analysisData.interfaceDescription}
                        </p>
                      </div>

                      {/* Detected UI Elements */}
                      {analysisData.visibleElements && analysisData.visibleElements.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-extrabold text-[#303B38]">
                            Identified Visual Elements:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisData.visibleElements.map((elem, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#ECEDE9] text-[#303B38] border border-[#E2E4DF]"
                              >
                                {elem}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pt-2 text-center space-y-2">
                      <p className="text-xs text-[#727A75]">
                        Screenshot attached. Click below to analyze your screen with DeskSense.
                      </p>
                      <button
                        type="button"
                        onClick={onTriggerAnalysis}
                        disabled={isLoading}
                        className="w-full py-2.5 bg-[#355C4B] hover:bg-[#29473A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-[0_3px_10px_rgba(53,92,75,0.25)] cursor-pointer disabled:opacity-50 transition-all"
                      >
                        <Sparkles className="w-4.5 h-4.5" strokeWidth={2.65} />
                        <span>Analyze Screen Context</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 px-4 space-y-3 border-2 border-dashed border-[#A9C9AD] rounded-2xl bg-[#F4F4F1]">
                  <div className="w-12 h-12 rounded-2xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center mx-auto border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_5px_rgba(53,92,75,0.12)]">
                    <Camera className="w-6 h-6" strokeWidth={2.7} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-[#303B38]">
                      No Screenshot Attached Yet
                    </h4>
                    <p className="text-[11px] text-[#727A75] max-w-xs mx-auto leading-relaxed">
                      Sharing a screenshot helps DeskSense identify exact menus and controls on your screen.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCapture}
                    className="px-4 py-2 rounded-xl bg-[#355C4B] hover:bg-[#29473A] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-2 shadow-[0_2px_8px_rgba(53,92,75,0.2)] transition-colors"
                  >
                    <Camera className="w-4 h-4" strokeWidth={2.65} />
                    <span>Attach Screenshot Now</span>
                  </button>
                </div>
              )}

              {/* Privacy Footer Tag */}
              <div className="pt-2 border-t border-[#E2E4DF] flex items-center gap-2 text-[11px] text-[#727A75]">
                <ShieldCheck className="w-4.5 h-4.5 text-[#355C4B] shrink-0" strokeWidth={2.65} />
                <span>Single frame snapshot • Zero background monitoring</span>
              </div>
            </div>
          </div>

          {/* Follow-up / Clarification Drawer */}
          {activeSteps.length > 0 && (
            <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-5 shadow-[0_4px_16px_rgba(48,59,56,0.04)] space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#303B38]">
                <MessageSquare className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
                <span>Ask a Follow-Up Question</span>
              </div>

              {followUpHistory.length > 0 && (
                <div className="space-y-2.5 max-h-56 overflow-y-auto text-xs">
                  {followUpHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl ${
                        item.role === 'user'
                          ? 'bg-[#DDEBDD] text-[#303B38] border border-[#A9C9AD]'
                          : 'bg-[#F4F4F1] text-[#303B38] border border-[#E2E4DF]'
                      }`}
                    >
                      <p className="font-extrabold text-[11px] text-[#355C4B] mb-1">
                        {item.role === 'user' ? 'You' : 'DeskSense'}
                      </p>
                      <p className="whitespace-pre-line leading-relaxed font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendFollowUp} className="flex items-center gap-2">
                <input
                  type="text"
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                  placeholder="Need something clarified? Ask here..."
                  className="grow px-3.5 py-2 bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-xs text-[#303B38] placeholder-[#727A75] focus:outline-hidden focus:ring-2 focus:ring-[#355C4B] focus:bg-[#FFFFFF] font-medium"
                />
                <button
                  type="submit"
                  disabled={!followUpText.trim() || isFollowUpLoading}
                  className="px-4 py-2 bg-[#355C4B] hover:bg-[#29473A] disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  {isFollowUpLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2.65} />
                  ) : (
                    <Send className="w-4 h-4" strokeWidth={2.65} />
                  )}
                  <span>Ask</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Step Guidance & Action Player (7 columns on large screen) */}
        <div className="lg:col-span-7 space-y-4">
          {isLoading ? (
            <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-10 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center mx-auto border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_5px_rgba(53,92,75,0.12)]">
                <RefreshCw className="w-7 h-7 animate-spin text-[#355C4B]" strokeWidth={2.7} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-[#303B38]">
                  DeskSense is Observing Your Screen...
                </h3>
                <p className="text-xs text-[#727A75] max-w-md mx-auto leading-relaxed">
                  Identifying open windows, reading landmark buttons, and preparing calm step-by-step instructions.
                </p>
              </div>
            </div>
          ) : errorMessage ? (
            <div className="bg-[#FFFFFF] border border-[#B96F7D] rounded-2xl p-6 space-y-3.5 shadow-2xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#B96F7D] shrink-0 mt-0.5" strokeWidth={2.65} />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#303B38]">
                    Assistance Notice
                  </h3>
                  <p className="text-xs text-[#727A75] leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onTriggerAnalysis}
                  className="px-4 py-2 rounded-xl bg-[#355C4B] hover:bg-[#29473A] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          ) : activeSteps.length > 0 ? (
            <StepPlayer
              taskTitle={question || 'Guided Task'}
              category={analysisData?.activeApplication || 'Computer Guidance'}
              steps={activeSteps}
              currentStepIndex={currentStepIndex}
              onNextStep={onNextStep}
              onPrevStep={onPrevStep}
              onJumpToStep={onJumpToStep}
              onComplete={onCompleteTask}
              onRequestReanalysis={onOpenCapture}
              expectedResult={analysisData?.expectedResult}
              learningTakeaway={analysisData?.learningTakeaway}
              confidence={analysisData?.confidence}
              confidenceReason={analysisData?.confidenceReason}
            />
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-10 text-center space-y-3.5 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center mx-auto border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_5px_rgba(53,92,75,0.12)]">
                <FileQuestion className="w-7 h-7 text-[#355C4B]" strokeWidth={2.7} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#303B38]">
                  Ready to Guide You
                </h3>
                <p className="text-xs text-[#727A75] max-w-sm mx-auto leading-relaxed">
                  Type your computer question above or attach a screenshot to get personalized, step-by-step assistance.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onTriggerAnalysis}
                  className="px-5 py-2.5 bg-[#355C4B] hover:bg-[#29473A] text-white rounded-xl text-xs font-bold cursor-pointer shadow-[0_2px_8px_rgba(53,92,75,0.2)] transition-all"
                >
                  Start Guidance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

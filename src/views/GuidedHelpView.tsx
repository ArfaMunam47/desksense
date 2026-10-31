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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Question Header Card */}
      <div className="bg-white border border-[#E8DDDA] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(60,52,54,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 grow">
          <div className="flex items-center gap-2 text-xs font-bold text-[#254E4A]">
            <Compass className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
            <span>Guided Help Workspace</span>
          </div>

          {editingQuestion ? (
            <form onSubmit={handleSaveQuestion} className="flex items-center gap-2.5 pt-1">
              <input
                type="text"
                value={questionDraft}
                onChange={(e) => setQuestionDraft(e.target.value)}
                className="px-3.5 py-2 border border-[#E8DDDA] bg-[#FFF9F5] rounded-xl text-xs sm:text-sm text-[#3C3436] grow focus:outline-hidden focus:ring-2 focus:ring-[#D98F9B] focus:bg-white font-medium"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#D98F9B] hover:bg-[#C77D89] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingQuestion(false)}
                className="px-3.5 py-2 bg-[#FFF9F5] text-[#3C3436] rounded-xl text-xs font-semibold cursor-pointer border border-[#E8DDDA]"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-base sm:text-lg font-extrabold text-[#3C3436]">
                {question || 'How can DeskSense help you today?'}
              </h1>
              <button
                type="button"
                onClick={() => {
                  setQuestionDraft(question);
                  setEditingQuestion(true);
                }}
                className="text-xs text-[#254E4A] hover:underline cursor-pointer font-bold"
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
            className="px-4 py-2 rounded-xl bg-[#E3EFEB] hover:bg-[#D4E8E2] border border-[#254E4A]/30 text-[#254E4A] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
          >
            <Camera className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
            <span>{capture ? 'Replace Screenshot' : 'Capture Screen'}</span>
          </button>

          {capture && (
            <button
              type="button"
              onClick={onDiscardCapture}
              className="p-2 rounded-xl border border-[#E8DDDA] text-[#6F6263] hover:text-[#D98F9B] hover:bg-[#F5E2E3] transition-colors cursor-pointer"
              title="Discard screenshot"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.25} />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Screen Context & Observation Inspector (5 columns on large screen) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E8DDDA] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(60,52,54,0.04)]">
            <div className="px-5 py-3.5 bg-[#FFF9F5] border-b border-[#E8DDDA] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3C3436]">
                <Eye className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
                <span>Screen Observation</span>
              </div>
              {capture && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-1 rounded-md text-[#6F6263] hover:text-[#3C3436] hover:bg-[#E3EFEB] text-xs cursor-pointer"
                    title={isZoomed ? 'Shrink preview' : 'Enlarge preview'}
                  >
                    <Maximize2 className="w-3.5 h-3.5" strokeWidth={2.25} />
                  </button>
                  <span className="text-[11px] font-mono text-[#6F6263] font-semibold">
                    {capture.dimensions ? `${capture.dimensions.width}×${capture.dimensions.height}` : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              {capture ? (
                <div className="space-y-3">
                  <div
                    className={`relative rounded-xl overflow-hidden border border-[#E8DDDA] bg-[#3C3436]/5 flex items-center justify-center cursor-pointer transition-all ${
                      isZoomed ? 'max-h-[500px]' : 'max-h-60'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    <img
                      src={capture.dataUrl}
                      alt="Current screen snapshot"
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#3C3436]/80 rounded-lg text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" strokeWidth={2.25} />
                      <span>{isZoomed ? 'Minimize' : 'Zoom'}</span>
                    </div>
                  </div>

                  {/* AI Vision Observations Breakdown */}
                  {analysisData ? (
                    <div className="space-y-3 pt-2 text-xs">
                      {/* Active Application Identified */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#E3EFEB] border border-[#254E4A]/25">
                        <span className="text-[#6F6263] font-medium">Detected Window:</span>
                        <span className="font-extrabold text-[#254E4A]">
                          {analysisData.activeApplication || 'Desktop'}
                        </span>
                      </div>

                      {/* Interface Description */}
                      <div className="space-y-1">
                        <span className="font-extrabold text-[#3C3436]">
                          Observed Interface:
                        </span>
                        <p className="text-[#6F6263] leading-relaxed bg-[#FFF9F5] p-3 rounded-xl border border-[#E8DDDA] font-medium">
                          {analysisData.interfaceDescription}
                        </p>
                      </div>

                      {/* Detected UI Elements */}
                      {analysisData.visibleElements && analysisData.visibleElements.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-extrabold text-[#3C3436]">
                            Identified Visual Elements:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisData.visibleElements.map((elem, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E3EFEB] text-[#254E4A] border border-[#254E4A]/20"
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
                      <p className="text-xs text-[#6F6263]">
                        Screenshot attached. Click below to analyze your screen with DeskSense.
                      </p>
                      <button
                        type="button"
                        onClick={onTriggerAnalysis}
                        disabled={isLoading}
                        className="w-full py-2.5 bg-[#D98F9B] hover:bg-[#C77D89] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-[0_3px_10px_rgba(217,143,155,0.3)] cursor-pointer disabled:opacity-50 transition-all"
                      >
                        <Sparkles className="w-4 h-4" strokeWidth={2.25} />
                        <span>Analyze Screen with DeskSense</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 px-4 space-y-3 border-2 border-dashed border-[#254E4A]/30 rounded-2xl bg-[#E3EFEB]/40">
                  <div className="w-10 h-10 rounded-2xl bg-[#E3EFEB] text-[#254E4A] flex items-center justify-center mx-auto border border-[#254E4A]/25">
                    <Camera className="w-5 h-5" strokeWidth={2.25} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-[#3C3436]">
                      No Screenshot Attached Yet
                    </h4>
                    <p className="text-[11px] text-[#6F6263] max-w-xs mx-auto leading-relaxed">
                      Attaching a screenshot allows DeskSense to pinpoint the exact menu or button on your screen.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCapture}
                    className="px-4 py-2 rounded-xl bg-[#254E4A] hover:bg-[#1C3D3A] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-[0_2px_8px_rgba(37,78,74,0.25)] transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-white" strokeWidth={2.25} />
                    <span>Attach Screenshot Now</span>
                  </button>
                </div>
              )}

              {/* Privacy Footer Tag */}
              <div className="pt-2 border-t border-[#E8DDDA] flex items-center gap-2 text-[11px] text-[#6F6263]">
                <ShieldCheck className="w-4 h-4 text-[#254E4A] shrink-0" strokeWidth={2.25} />
                <span>Single user-authorized frame • Never recorded in background</span>
              </div>
            </div>
          </div>

          {/* Follow-up / Clarification Panel */}
          {activeSteps.length > 0 && (
            <div className="bg-white border border-[#E8DDDA] rounded-2xl p-5 shadow-[0_4px_16px_rgba(60,52,54,0.04)] space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3C3436]">
                <MessageSquare className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
                <span>Ask a Follow-Up Question</span>
              </div>

              {followUpHistory.length > 0 && (
                <div className="space-y-2.5 max-h-56 overflow-y-auto text-xs">
                  {followUpHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl ${
                        item.role === 'user'
                          ? 'bg-[#E3EFEB] text-[#3C3436] border border-[#254E4A]/30'
                          : 'bg-[#FFF9F5] text-[#3C3436] border border-[#E8DDDA]'
                      }`}
                    >
                      <p className="font-extrabold text-[11px] text-[#254E4A] mb-1">
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
                  className="grow px-3.5 py-2 bg-[#FFF9F5] border border-[#E8DDDA] rounded-xl text-xs text-[#3C3436] placeholder-[#6F6263] focus:outline-hidden focus:ring-2 focus:ring-[#D98F9B] focus:bg-white font-medium"
                />
                <button
                  type="submit"
                  disabled={!followUpText.trim() || isFollowUpLoading}
                  className="px-4 py-2 bg-[#D98F9B] hover:bg-[#C77D89] disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1 shadow-2xs transition-colors"
                >
                  {isFollowUpLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2.25} />
                  ) : (
                    <Send className="w-3.5 h-3.5" strokeWidth={2.25} />
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
            <div className="bg-white border border-[#E8DDDA] rounded-2xl p-10 text-center space-y-4 shadow-[0_4px_20px_rgba(60,52,54,0.05)]">
              <div className="w-12 h-12 rounded-2xl bg-[#E3EFEB] text-[#254E4A] flex items-center justify-center mx-auto border border-[#254E4A]/30">
                <RefreshCw className="w-6 h-6 animate-spin text-[#254E4A]" strokeWidth={2.25} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-[#3C3436]">
                  DeskSense is Observing Your Screen...
                </h3>
                <p className="text-xs text-[#6F6263] max-w-md mx-auto leading-relaxed">
                  Identifying open windows, reading landmark buttons, and preparing calm step-by-step instructions.
                </p>
              </div>
            </div>
          ) : errorMessage ? (
            <div className="bg-white border border-[#D98F9B] rounded-2xl p-6 space-y-3.5 shadow-2xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#D98F9B] shrink-0 mt-0.5" strokeWidth={2.25} />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#3C3436]">
                    Assistance Notice
                  </h3>
                  <p className="text-xs text-[#6F6263] leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onTriggerAnalysis}
                  className="px-4 py-2 rounded-xl bg-[#D98F9B] hover:bg-[#C77D89] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
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
            <div className="bg-white border border-[#E8DDDA] rounded-2xl p-10 text-center space-y-3.5 shadow-[0_4px_20px_rgba(60,52,54,0.05)]">
              <div className="w-12 h-12 rounded-2xl bg-[#E3EFEB] text-[#254E4A] flex items-center justify-center mx-auto border border-[#254E4A]/30">
                <FileQuestion className="w-6 h-6 text-[#254E4A]" strokeWidth={2.25} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#3C3436]">
                  Ready to Guide You
                </h3>
                <p className="text-xs text-[#6F6263] max-w-sm mx-auto leading-relaxed">
                  Type your computer question above or attach a screenshot to get personalized, step-by-step assistance.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onTriggerAnalysis}
                  className="px-5 py-2.5 bg-[#D98F9B] hover:bg-[#C77D89] text-white rounded-xl text-xs font-bold cursor-pointer shadow-[0_2px_8px_rgba(217,143,155,0.3)] transition-all"
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

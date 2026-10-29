import React, { useState } from 'react';
import {
  Camera,
  Trash2,
  Sparkles,
  AlertCircle,
  Eye,
  Maximize2,
  RefreshCw,
  Search,
  CheckCircle2,
  HelpCircle,
  FileQuestion,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { GuidanceStep, ScreenCapture, ScreenAnalysisData } from '../types';
import { StepPlayer } from '../components/StepPlayer';

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

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionDraft.trim()) {
      onUpdateQuestion(questionDraft.trim());
      setEditingQuestion(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Question Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 grow">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Compass className="w-4 h-4" />
            <span>Guided Help Workspace</span>
          </div>

          {editingQuestion ? (
            <form onSubmit={handleSaveQuestion} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={questionDraft}
                onChange={(e) => setQuestionDraft(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 grow focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingQuestion(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                {question || 'How can DeskSense help you today?'}
              </h1>
              <button
                type="button"
                onClick={() => {
                  setQuestionDraft(question);
                  setEditingQuestion(true);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Capture Screen Quick Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCapture}
            className="px-3.5 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{capture ? 'Replace Screenshot' : 'Capture Screen'}</span>
          </button>

          {capture && (
            <button
              type="button"
              onClick={onDiscardCapture}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Discard screenshot"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Screen Context & Observation Inspector (5 columns on large screen) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Eye className="w-4 h-4 text-slate-500" />
                <span>Screen Observation</span>
              </div>
              {capture && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs cursor-pointer"
                    title={isZoomed ? 'Shrink preview' : 'Enlarge preview'}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">
                    {capture.dimensions ? `${capture.dimensions.width}×${capture.dimensions.height}` : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 space-y-4">
              {capture ? (
                <div className="space-y-3">
                  <div
                    className={`relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center cursor-pointer transition-all ${
                      isZoomed ? 'max-h-[500px]' : 'max-h-60'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    <img
                      src={capture.dataUrl}
                      alt="Current screen snapshot"
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-[10px] text-white backdrop-blur-xs flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" />
                      <span>{isZoomed ? 'Click to minimize' : 'Click to zoom'}</span>
                    </div>
                  </div>

                  {/* AI Vision Observations Breakdown */}
                  {analysisData ? (
                    <div className="space-y-3 pt-2 text-xs">
                      {/* Active Application Identified */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Detected Window:</span>
                        <span className="font-bold text-blue-700 dark:text-blue-300">
                          {analysisData.activeApplication || 'Desktop'}
                        </span>
                      </div>

                      {/* Interface Description */}
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Observed Interface:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                          {analysisData.interfaceDescription}
                        </p>
                      </div>

                      {/* Detected UI Elements */}
                      {analysisData.visibleElements && analysisData.visibleElements.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Identified Visual Elements:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysisData.visibleElements.map((elem, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
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
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Screenshot ready. Click below to analyze your screen with DeskSense.
                      </p>
                      <button
                        type="button"
                        onClick={onTriggerAnalysis}
                        disabled={isLoading}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Analyze Screen with DeskSense</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 px-4 space-y-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      No Screenshot Attached Yet
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                      Attaching a screenshot helps DeskSense pinpoint the exact button on your screen.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCapture}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Attach Screenshot Now</span>
                  </button>
                </div>
              )}

              {/* Privacy Footer Tag */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Single authorized capture • Never saved on remote servers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step Guidance & Action Player (7 columns on large screen) */}
        <div className="lg:col-span-7 space-y-4">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  DeskSense is Observing Your Screen...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Identifying open windows, reading landmark buttons, and preparing calm step-by-step instructions.
                </p>
              </div>
            </div>
          ) : errorMessage ? (
            <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-xl p-6 space-y-4 shadow-xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Assistance Notice
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onTriggerAnalysis}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-3 shadow-xs">
              <FileQuestion className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Ready to Guide You
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Type your computer question above or attach a screenshot to get personalized, step-by-step assistance.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onTriggerAnalysis}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
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

import React, { useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { GuidanceStep } from '../types';
import { ActionBadge } from './ActionBadge';

interface StepPlayerProps {
  taskTitle: string;
  category?: string;
  steps: GuidanceStep[];
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onJumpToStep: (index: number) => void;
  onComplete: () => void;
  onRequestReanalysis?: () => void;
  expectedResult?: string;
  learningTakeaway?: string;
  confidence?: 'high' | 'medium' | 'low' | 'needs_clarification';
  confidenceReason?: string;
}

export const StepPlayer: React.FC<StepPlayerProps> = ({
  taskTitle,
  category,
  steps,
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onJumpToStep,
  onComplete,
  onRequestReanalysis,
  expectedResult,
  learningTakeaway,
  confidence,
  confidenceReason,
}) => {
  const [showStuckHelp, setShowStuckHelp] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isFinished = currentStepIndex >= steps.length;
  const currentStep = steps[currentStepIndex];

  // Speech synthesis for accessibility
  const handleSpeakInstruction = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!currentStep) return;

    const textToSpeak = `Step ${currentStep.stepNumber}: ${currentStep.title}. ${currentStep.instruction}. ${
      currentStep.tip ? 'Tip: ' + currentStep.tip : ''
    }`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9; // Slightly slower, calm cadence for beginners
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // If completed all steps: Render the "Learn" card (Core Experience Step 6)
  if (isFinished) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Task Completed Successfully
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{taskTitle}</h2>
          </div>
        </div>

        {/* Expected Result verification */}
        {expectedResult && (
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              What you should see right now
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {expectedResult}
            </p>
          </div>
        )}

        {/* Learning Takeaway (Core Product Philosophy) */}
        {learningTakeaway && (
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>What You Learned Today</span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              {learningTakeaway}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 pt-1">
              "Learn to use your computer confidently, one step at a time."
            </p>
          </div>
        )}

        {/* Verification transparency banner */}
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40 px-3 py-2 rounded border border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Verified by user-confirmed completion. Full automated desktop inspection will be supported in future native builds.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => onJumpToStep(0)}
            className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Review Steps Again</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Finish and Return to Home</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Player Header */}
      <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <div>
          {category && (
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {category}
            </span>
          )}
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
            {taskTitle}
          </h2>
        </div>

        {/* Step Indicator Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <button
            onClick={handleSpeakInstruction}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isSpeaking ? 'Stop speaking' : 'Read instruction aloud'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Main Step Content */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Confidence Notice if AI generated */}
        {confidence && confidence !== 'high' && (
          <div className="text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5 text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">AI Confidence: {confidence}</span>
              {confidenceReason && <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">{confidenceReason}</p>}
            </div>
          </div>
        )}

        {/* Step Action & Title */}
        <div className="space-y-3">
          <ActionBadge
            actionType={currentStep.actionType}
            targetElement={currentStep.targetElement}
          />
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {currentStep.title}
          </h3>
        </div>

        {/* Step Detailed Instruction */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-normal leading-relaxed">
            {currentStep.instruction}
          </p>
        </div>

        {/* Helpful Tip */}
        {currentStep.tip && (
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-lg p-3">
            <span className="font-bold text-blue-700 dark:text-blue-300">Tip:</span>
            <span>{currentStep.tip}</span>
          </div>
        )}

        {/* "I'm Stuck" Drawer */}
        {showStuckHelp && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 space-y-3 text-xs sm:text-sm text-amber-950 dark:text-amber-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between font-semibold text-amber-900 dark:text-amber-200">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                No worries! Let's solve this step together:
              </span>
              <button
                type="button"
                onClick={() => setShowStuckHelp(false)}
                className="text-xs text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
              >
                Hide
              </button>
            </div>

            <ul className="list-disc pl-5 space-y-1.5 text-xs text-amber-900/90 dark:text-amber-200/90">
              <li>
                <strong>Don't see the button?</strong> Make sure your target application (like Chrome or File Explorer) is the front window. Click anywhere inside it once.
              </li>
              <li>
                <strong>Did a menu close?</strong> Simply right-click on the target item again.
              </li>
              <li>
                <strong>Need another screen check?</strong> You can capture a fresh screenshot of what you see right now so DeskSense can update its view.
              </li>
            </ul>

            {onRequestReanalysis && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onRequestReanalysis}
                  className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium cursor-pointer"
                >
                  Capture fresh screenshot for help
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step Actions Footer */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Previous Step & I'm Stuck */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStuckHelp(!showStuckHelp)}
            className="px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 hover:bg-amber-100 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>I'm Stuck</span>
          </button>
        </div>

        {/* Right Side: Done / Next Step */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNextStep}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>
              {currentStepIndex === steps.length - 1 ? 'Complete Task' : 'I Did This (Next Step)'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

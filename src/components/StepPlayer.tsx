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
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // If completed all steps: Render the "Learn" card
  if (isFinished) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_5px_rgba(53,92,75,0.12)]">
            <Check className="w-6 h-6 stroke-[3.2]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#355C4B] uppercase tracking-wider">
              Task Completed Successfully
            </span>
            <h2 className="text-xl font-extrabold text-[#303B38]">{taskTitle}</h2>
          </div>
        </div>

        {/* Expected Result verification */}
        {expectedResult && (
          <div className="bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl p-4 space-y-1">
            <p className="text-xs font-bold text-[#727A75] uppercase tracking-wider">
              What you should see right now
            </p>
            <p className="text-sm font-semibold text-[#303B38]">
              {expectedResult}
            </p>
          </div>
        )}

        {/* Learning Takeaway */}
        {learningTakeaway && (
          <div className="bg-[#F4EBCF] border border-[#E2D6B2] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#303B38] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
              <span>What You Learned Today</span>
            </div>
            <p className="text-sm text-[#303B38] leading-relaxed font-sans font-medium">
              {learningTakeaway}
            </p>
            <p className="text-xs text-[#355C4B] font-bold pt-1">
              "Learn to use your computer confidently, one step at a time."
            </p>
          </div>
        )}

        {/* Verification transparency banner */}
        <div className="text-xs text-[#727A75] bg-[#F4F4F1] px-3.5 py-2.5 rounded-xl border border-[#E2E4DF] flex items-center gap-2.5">
          <BookOpen className="w-4.5 h-4.5 text-[#355C4B] shrink-0" strokeWidth={2.65} />
          <span>
            Verified by user-confirmed completion. Full automated desktop inspection will be supported in future native builds.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => onJumpToStep(0)}
            className="px-4 py-2.5 rounded-xl border border-[#E2E4DF] bg-[#FFFFFF] text-[#303B38] hover:bg-[#ECEDE9] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />
            <span>Review Steps Again</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            className="px-5 py-2.5 rounded-xl bg-[#355C4B] hover:bg-[#29473A] text-white text-xs font-bold flex items-center gap-2 shadow-[0_2px_8px_rgba(53,92,75,0.25)] cursor-pointer transition-all"
          >
            <span>Finish and Return to Home</span>
            <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.65} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Player Header */}
      <div className="px-6 py-4 bg-[#F4F4F1] border-b border-[#E2E4DF] flex items-center justify-between gap-4">
        <div>
          {category && (
            <span className="text-[11px] font-bold text-[#355C4B] bg-[#DDEBDD] px-2.5 py-0.5 rounded-md border border-[#A9C9AD]/40 uppercase tracking-wider inline-block mb-1">
              {category}
            </span>
          )}
          <h2 className="text-sm sm:text-base font-extrabold text-[#303B38] line-clamp-1">
            {taskTitle}
          </h2>
        </div>

        {/* Step Indicator Pill & Audio */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECEDE9] text-[#303B38] border border-[#E2E4DF]">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <button
            onClick={handleSpeakInstruction}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-[#355C4B] text-white border-[#355C4B]'
                : 'text-[#727A75] hover:text-[#303B38] border-[#E2E4DF] bg-[#FFFFFF] hover:bg-[#ECEDE9]'
            }`}
            title={isSpeaking ? 'Stop speaking' : 'Read instruction aloud'}
          >
            {isSpeaking ? (
              <VolumeX className="w-4.5 h-4.5" strokeWidth={2.65} />
            ) : (
              <Volume2 className="w-4.5 h-4.5" strokeWidth={2.65} />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#E2E4DF] h-1.5 overflow-hidden">
        <div
          className="bg-[#355C4B] h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Main Step Content */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Confidence Notice if AI generated */}
        {confidence && confidence !== 'high' && (
          <div className="text-xs bg-[#F4F4F1] border border-[#E2D6B2] rounded-xl p-3 text-[#303B38] flex items-start gap-2.5">
            <ShieldAlert className="w-4.5 h-4.5 text-[#B96F7D] shrink-0 mt-0.5" strokeWidth={2.65} />
            <div>
              <span className="font-bold">AI Confidence: {confidence}</span>
              {confidenceReason && (
                <p className="text-[11px] text-[#727A75] mt-0.5">{confidenceReason}</p>
              )}
            </div>
          </div>
        )}

        {/* Step Action & Title */}
        <div className="space-y-3">
          <ActionBadge
            actionType={currentStep.actionType}
            targetElement={currentStep.targetElement}
          />
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#303B38] leading-snug">
            {currentStep.title}
          </h3>
        </div>

        {/* Step Detailed Instruction on White */}
        <div className="bg-[#F4F4F1] border border-[#E2E4DF] rounded-2xl p-5 shadow-2xs">
          <p className="text-base sm:text-lg text-[#303B38] font-medium leading-relaxed">
            {currentStep.instruction}
          </p>
        </div>

        {/* Helpful Tip in Soft Sage */}
        {currentStep.tip && (
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#303B38] bg-[#DDEBDD]/70 border border-[#A9C9AD] rounded-xl p-3.5">
            <span className="font-bold text-[#355C4B]">Tip:</span>
            <span className="leading-relaxed">{currentStep.tip}</span>
          </div>
        )}

        {/* "I'm Stuck" Drawer in Soft Butter */}
        {showStuckHelp && (
          <div className="bg-[#F4EBCF] border border-[#E2D6B2] rounded-2xl p-5 space-y-3 text-xs sm:text-sm text-[#303B38] animate-in fade-in duration-200">
            <div className="flex items-center justify-between font-bold text-[#303B38]">
              <span className="flex items-center gap-2 font-extrabold">
                <HelpCircle className="w-5 h-5 text-[#355C4B]" strokeWidth={2.65} />
                No worries! Let's solve this step together:
              </span>
              <button
                type="button"
                onClick={() => setShowStuckHelp(false)}
                className="text-xs text-[#355C4B] hover:underline cursor-pointer font-bold"
              >
                Hide
              </button>
            </div>

            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#303B38] leading-relaxed">
              <li>
                <strong>Don't see the button?</strong> Make sure your target application (like Chrome or File Explorer) is in front. Click anywhere inside it once.
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
                  className="px-3.5 py-1.5 rounded-xl bg-[#355C4B] hover:bg-[#29473A] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Capture fresh screenshot for help
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step Actions Footer */}
      <div className="px-6 py-4 bg-[#F4F4F1] border-t border-[#E2E4DF] flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Previous Step & I'm Stuck */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className="px-3.5 py-2 rounded-xl border border-[#E2E4DF] bg-[#FFFFFF] text-[#303B38] hover:bg-[#ECEDE9] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4.5 h-4.5" strokeWidth={2.7} />
            <span>Previous Step</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStuckHelp(!showStuckHelp)}
            className="px-3.5 py-2 rounded-xl border border-[#E2D6B2] bg-[#F4EBCF] text-[#303B38] hover:bg-[#EFE4C4] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />
            <span>I'm Stuck</span>
          </button>
        </div>

        {/* Right Side: Done / Next Step */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNextStep}
            className="px-5 py-2.5 rounded-xl bg-[#355C4B] hover:bg-[#29473A] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_2px_8px_rgba(53,92,75,0.25)] cursor-pointer transition-all"
          >
            <Check className="w-4.5 h-4.5 stroke-[3.2]" />
            <span>
              {currentStepIndex === steps.length - 1 ? 'Complete Task' : 'I Did This (Next Step)'}
            </span>
            <ChevronRight className="w-4.5 h-4.5" strokeWidth={2.7} />
          </button>
        </div>
      </div>
    </div>
  );
};

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
      <div className="bg-white border border-[#E8DDDA] rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_4px_20px_rgba(60,52,54,0.05)]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E3EFEB] text-[#254E4A] flex items-center justify-center border border-[#254E4A]/30 shadow-xs">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#254E4A] uppercase tracking-wider">
              Task Completed Successfully
            </span>
            <h2 className="text-xl font-extrabold text-[#3C3436]">{taskTitle}</h2>
          </div>
        </div>

        {/* Expected Result verification */}
        {expectedResult && (
          <div className="bg-[#FFF9F5] border border-[#E8DDDA] rounded-xl p-4 space-y-1">
            <p className="text-xs font-bold text-[#6F6263] uppercase tracking-wider">
              What you should see right now
            </p>
            <p className="text-sm font-semibold text-[#3C3436]">
              {expectedResult}
            </p>
          </div>
        )}

        {/* Learning Takeaway */}
        {learningTakeaway && (
          <div className="bg-[#F5E2E3] border border-[#D98F9B] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#D98F9B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#D98F9B]" strokeWidth={2.25} />
              <span>What You Learned Today</span>
            </div>
            <p className="text-sm text-[#3C3436] leading-relaxed font-sans font-medium">
              {learningTakeaway}
            </p>
            <p className="text-xs text-[#254E4A] font-bold pt-1">
              "Learn to use your computer confidently, one step at a time."
            </p>
          </div>
        )}

        {/* Verification transparency banner */}
        <div className="text-xs text-[#6F6263] bg-[#E3EFEB]/60 px-3.5 py-2.5 rounded-xl border border-[#254E4A]/20 flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-[#254E4A] shrink-0" strokeWidth={2.25} />
          <span>
            Verified by user-confirmed completion. Full automated desktop inspection will be supported in future native builds.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => onJumpToStep(0)}
            className="px-4 py-2.5 rounded-xl border border-[#E8DDDA] text-[#3C3436] hover:bg-[#FFF9F5] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />
            <span>Review Steps Again</span>
          </button>

          <button
            type="button"
            onClick={onComplete}
            className="px-5 py-2.5 rounded-xl bg-[#D98F9B] hover:bg-[#C77D89] text-white text-xs font-bold flex items-center gap-2 shadow-[0_2px_8px_rgba(217,143,155,0.3)] cursor-pointer transition-all"
          >
            <span>Finish and Return to Home</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8DDDA] rounded-2xl shadow-[0_4px_20px_rgba(60,52,54,0.05)] overflow-hidden flex flex-col">
      {/* Player Header */}
      <div className="px-6 py-4 bg-[#FFF9F5] border-b border-[#E8DDDA] flex items-center justify-between gap-4">
        <div>
          {category && (
            <span className="text-[11px] font-bold text-[#254E4A] bg-[#E3EFEB] px-2.5 py-0.5 rounded-md border border-[#254E4A]/20 uppercase tracking-wider inline-block mb-1">
              {category}
            </span>
          )}
          <h2 className="text-sm sm:text-base font-extrabold text-[#3C3436] line-clamp-1">
            {taskTitle}
          </h2>
        </div>

        {/* Step Indicator Pill & Audio */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F5E2E3] text-[#3C3436] border border-[#D98F9B]">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <button
            onClick={handleSpeakInstruction}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-[#254E4A] text-white border-[#254E4A]'
                : 'text-[#6F6263] hover:text-[#3C3436] border-[#E8DDDA] hover:bg-[#E3EFEB]'
            }`}
            title={isSpeaking ? 'Stop speaking' : 'Read instruction aloud'}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" strokeWidth={2.25} />
            ) : (
              <Volume2 className="w-4 h-4" strokeWidth={2.25} />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#E8DDDA] h-1.5 overflow-hidden">
        <div
          className="bg-[#D98F9B] h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Main Step Content */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Confidence Notice if AI generated */}
        {confidence && confidence !== 'high' && (
          <div className="text-xs bg-[#FFF9F5] border border-[#D98F9B] rounded-xl p-3 text-[#3C3436] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#D98F9B] shrink-0 mt-0.5" strokeWidth={2.25} />
            <div>
              <span className="font-bold">AI Confidence: {confidence}</span>
              {confidenceReason && (
                <p className="text-[11px] text-[#6F6263] mt-0.5">{confidenceReason}</p>
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
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#3C3436] leading-snug">
            {currentStep.title}
          </h3>
        </div>

        {/* Step Detailed Instruction on White */}
        <div className="bg-[#FFF9F5] border border-[#E8DDDA] rounded-2xl p-5 shadow-2xs">
          <p className="text-base sm:text-lg text-[#3C3436] font-medium leading-relaxed">
            {currentStep.instruction}
          </p>
        </div>

        {/* Helpful Tip in Soft Teal */}
        {currentStep.tip && (
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3C3436] bg-[#E3EFEB] border border-[#254E4A]/25 rounded-xl p-3.5">
            <span className="font-bold text-[#254E4A]">Tip:</span>
            <span className="leading-relaxed">{currentStep.tip}</span>
          </div>
        )}

        {/* "I'm Stuck" Drawer in Soft Teal */}
        {showStuckHelp && (
          <div className="bg-[#E3EFEB] border border-[#254E4A]/30 rounded-2xl p-5 space-y-3 text-xs sm:text-sm text-[#3C3436] animate-in fade-in duration-200">
            <div className="flex items-center justify-between font-bold text-[#254E4A]">
              <span className="flex items-center gap-1.5 font-bold">
                <HelpCircle className="w-4.5 h-4.5 text-[#254E4A]" strokeWidth={2.25} />
                No worries! Let's solve this step together:
              </span>
              <button
                type="button"
                onClick={() => setShowStuckHelp(false)}
                className="text-xs text-[#254E4A] hover:underline cursor-pointer font-bold"
              >
                Hide
              </button>
            </div>

            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#3C3436] leading-relaxed">
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
                  className="px-3.5 py-1.5 rounded-xl bg-[#254E4A] hover:bg-[#1C3D3A] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Capture fresh screenshot for help
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step Actions Footer */}
      <div className="px-6 py-4 bg-[#FFF9F5] border-t border-[#E8DDDA] flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Previous Step & I'm Stuck */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className="px-3.5 py-2 rounded-xl border border-[#E8DDDA] bg-white text-[#3C3436] hover:bg-[#FFF9F5] text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.25} />
            <span>Previous Step</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStuckHelp(!showStuckHelp)}
            className="px-3.5 py-2 rounded-xl border border-[#254E4A]/30 bg-[#E3EFEB] text-[#254E4A] hover:bg-[#D4E8E2] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />
            <span>I'm Stuck</span>
          </button>
        </div>

        {/* Right Side: Done / Next Step */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNextStep}
            className="px-5 py-2.5 rounded-xl bg-[#D98F9B] hover:bg-[#C77D89] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_2px_8px_rgba(217,143,155,0.3)] cursor-pointer transition-all"
          >
            <Check className="w-4 h-4" strokeWidth={2.25} />
            <span>
              {currentStepIndex === steps.length - 1 ? 'Complete Task' : 'I Did This (Next Step)'}
            </span>
            <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </div>
  );
};

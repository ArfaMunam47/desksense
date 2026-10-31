import React, { useState } from 'react';
import {
  Code2,
  AlertTriangle,
  HelpCircle,
  Camera,
  Trash2,
  Check,
  Copy,
  ArrowRight,
  ShieldAlert,
  Send,
  Sparkles,
  RefreshCw,
  FolderCode,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import {
  CodingTaskType,
  CodingHelpResponse,
  ScreenCapture,
  GuidanceStep,
} from '../types';
import { requestCodingHelp, askFollowUpQuestion } from '../services/api';
import { ActionBadge } from '../components/ActionBadge';

interface CodingHelpViewProps {
  onOpenCapture: () => void;
  currentCapture: ScreenCapture | null;
  onDiscardCapture: () => void;
  onSaveToHistory?: (record: any) => void;
}

export const CodingHelpView: React.FC<CodingHelpViewProps> = ({
  onOpenCapture,
  currentCapture,
  onDiscardCapture,
  onSaveToHistory,
}) => {
  const [taskType, setTaskType] = useState<CodingTaskType>('explain_error');
  const [environment, setEnvironment] = useState<string>('Visual Studio Code');
  const [description, setDescription] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [includeScreenshot, setIncludeScreenshot] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<CodingHelpResponse | null>(null);

  // Follow-up conversation state
  const [followUpQuestion, setFollowUpQuestion] = useState<string>('');
  const [followUpHistory, setFollowUpHistory] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>
  >([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const taskOptions: Array<{ id: CodingTaskType; label: string; desc: string }> = [
    {
      id: 'explain_error',
      label: 'Explain an error',
      desc: 'Decode cryptic terminal errors or compiler tracebacks in plain English',
    },
    {
      id: 'explain_code',
      label: 'Explain a piece of code',
      desc: 'Break down an unfamiliar function, script, or syntax line-by-line',
    },
    {
      id: 'terminal_output',
      label: 'Understand terminal output',
      desc: 'Clarify command outputs, exit codes, or unreadable console text',
    },
    {
      id: 'env_troubleshoot',
      label: 'Troubleshoot development environment',
      desc: 'Fix PATH issues, Python virtualenvs, or editor configuration',
    },
    {
      id: 'install_dependency',
      label: 'Installation & dependency issues',
      desc: 'Solve package install failures, npm/pip conflicts, or missing binaries',
    },
    {
      id: 'fix_issue',
      label: 'Guidance fixing a coding issue',
      desc: 'Safe, guided approach to locate and fix a logic bug or unexpected result',
    },
    {
      id: 'next_steps',
      label: 'Understand what to do next',
      desc: 'Figure out the next logical implementation step in your project',
    },
  ];

  const envOptions = [
    'Visual Studio Code',
    'Windows Terminal / PowerShell',
    'Node.js / npm',
    'Python / pip',
    'Git / GitHub',
    'HTML / CSS / JavaScript',
    'Linux / Bash',
    'Other Editor / IDE',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !errorMessage.trim() && !codeSnippet.trim() && !currentCapture) {
      setApiError('Please provide a description, error message, code snippet, or screenshot.');
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setResult(null);
    setFollowUpHistory([]);

    try {
      const response = await requestCodingHelp({
        taskType,
        environment,
        description: description.trim(),
        errorMessage: errorMessage.trim() || undefined,
        codeSnippet: codeSnippet.trim() || undefined,
        imageBase64: includeScreenshot && currentCapture ? currentCapture.dataUrl : undefined,
      });

      if (response.success && response.data) {
        setResult(response.data);
        if (onSaveToHistory) {
          onSaveToHistory({
            question: `[Coding Help] ${taskOptions.find((t) => t.id === taskType)?.label || 'Code Assistance'}: ${
              description.slice(0, 60) || environment
            }`,
            category: 'Programming and Development',
            completedSteps: response.data.steps.length,
            totalSteps: response.data.steps.length,
            source: 'coding_help',
            takeaway: response.data.learningTakeaway,
            codingContext: {
              taskType,
              environment,
              summary: response.data.identifiedGoal,
            },
          });
        }
      } else {
        setApiError(
          response.error ||
            'Could not complete coding analysis. Please check your environment or try verified library guides.'
        );
      }
    } catch (err: any) {
      setApiError(err.message || 'An unexpected error occurred while requesting coding help.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim() || !result) return;

    const userText = followUpQuestion.trim();
    setFollowUpQuestion('');
    const newHistory = [
      ...followUpHistory,
      { role: 'user' as const, text: userText, timestamp: new Date().toLocaleTimeString() },
    ];
    setFollowUpHistory(newHistory);
    setIsFollowUpLoading(true);

    try {
      const contextSummary = `Goal: ${result.identifiedGoal}. Problem: ${result.problemExplanation}. Environment: ${environment}.`;
      const res = await askFollowUpQuestion(
        contextSummary,
        result.steps,
        userText,
        'coding_help'
      );

      if (res.success && res.answer) {
        setFollowUpHistory([
          ...newHistory,
          {
            role: 'assistant' as const,
            text: res.answer,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        setFollowUpHistory([
          ...newHistory,
          {
            role: 'assistant' as const,
            text:
              res.error ||
              'I am having trouble answering right now. Please rephrase or review the previous steps.',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (err: any) {
      setFollowUpHistory([
        ...newHistory,
        {
          role: 'assistant' as const,
          text: 'Unable to reach the assistant. Please try again.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleQuickFollowUpClick = (questionText: string) => {
    setFollowUpQuestion(questionText);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-7">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E3EFEB] text-[#254E4A] text-xs font-bold border border-[#254E4A]/30 shadow-2xs">
          <Code2 className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
          <span>Programming & Developer Support</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3436]">
          Coding Help
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6263] max-w-2xl leading-relaxed">
          Get patient, contextual assistance for programming errors, terminal outputs, and development environment roadblocks without judgment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Context Input (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E8DDDA] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(60,52,54,0.04)] space-y-4"
          >
            {/* Task Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#3C3436]">
                What do you need help with?
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as CodingTaskType)}
                className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-[#E8DDDA] rounded-xl text-xs font-bold text-[#3C3436] focus:outline-hidden focus:ring-2 focus:ring-[#D98F9B] focus:bg-white"
              >
                {taskOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#6F6263]">
                {taskOptions.find((t) => t.id === taskType)?.desc}
              </p>
            </div>

            {/* Development Environment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#3C3436]">
                Development Environment or Tool:
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-[#E8DDDA] rounded-xl text-xs font-bold text-[#3C3436] focus:outline-hidden focus:ring-2 focus:ring-[#D98F9B] focus:bg-white"
              >
                {envOptions.map((env) => (
                  <option key={env} value={env}>
                    {env}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#3C3436]">
                Description of what you are trying to do:
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened or what command you ran..."
                className="w-full px-3.5 py-2.5 bg-[#FFF9F5] border border-[#E8DDDA] rounded-xl text-xs text-[#3C3436] placeholder-[#6F6263] focus:outline-hidden focus:ring-2 focus:ring-[#D98F9B] focus:bg-white font-medium"
              />
            </div>

            {/* Error Message Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#3C3436]">
                Error Message or Terminal Output (Optional):
              </label>
              <textarea
                rows={3}
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Paste the exact red error text or traceback here..."
                className="w-full px-3.5 py-2.5 font-mono text-xs bg-[#FFF9F5] border border-[#E8DDDA] rounded-xl text-[#3C3436] placeholder-[#6F6263] focus:outline-hidden focus:ring-2 focus:ring-[#D98F9B] focus:bg-white"
              />
            </div>

            {/* Code Snippet Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#3C3436]">
                Relevant Code Snippet (Optional):
              </label>
              <textarea
                rows={4}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Paste the code block or function you're working on..."
                className="w-full px-3.5 py-2.5 font-mono text-xs bg-[#FFF9F5] border border-[#E8DDDA] rounded-xl text-[#3C3436] placeholder-[#6F6263] focus:outline-hidden focus:ring-2 focus:ring-[#D98F9B] focus:bg-white"
              />
            </div>

            {/* User-Approved Screenshot Context */}
            <div className="pt-2 border-t border-[#E8DDDA] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#3C3436]">
                  Visual Screen Context:
                </span>
                {currentCapture ? (
                  <button
                    type="button"
                    onClick={onDiscardCapture}
                    className="text-[#D98F9B] hover:underline text-[11px] flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                ) : null}
              </div>

              {currentCapture ? (
                <div className="p-3 rounded-xl border border-[#254E4A]/30 bg-[#E3EFEB] flex items-center gap-3">
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#3C3436]/10 shrink-0 border border-[#E8DDDA]">
                    <img
                      src={currentCapture.dataUrl}
                      alt="Capture thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grow min-w-0">
                    <p className="text-xs font-bold text-[#254E4A] truncate">
                      Screenshot Attached
                    </p>
                    <label className="flex items-center gap-1.5 text-[11px] text-[#6F6263] mt-0.5 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={includeScreenshot}
                        onChange={(e) => setIncludeScreenshot(e.target.checked)}
                        className="rounded accent-[#254E4A]"
                      />
                      <span>Include in coding analysis</span>
                    </label>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenCapture}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#254E4A]/40 text-[#254E4A] hover:bg-[#E3EFEB] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Camera className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
                  <span>Attach Screenshot of Editor / Terminal</span>
                </button>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#254E4A] hover:bg-[#1C3D3A] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-[0_3px_10px_rgba(37,78,74,0.3)] cursor-pointer transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2.25} />
                    <span>Analyzing Problem & Formulating Safe Fix...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" strokeWidth={2.25} />
                    <span>Analyze & Get Step-by-Step Fix</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Safety Notice Card */}
          <div className="bg-[#E3EFEB] border border-[#254E4A]/25 rounded-2xl p-4 text-xs text-[#3C3436] space-y-1.5">
            <div className="font-extrabold text-[#254E4A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
              <span>DeskSense Safety Guarantee</span>
            </div>
            <p className="text-[11px] text-[#3C3436] leading-relaxed font-medium">
              DeskSense never executes commands silently or modifies project files behind your back. All terminal commands are presented for your review first, with dangerous flags clearly highlighted.
            </p>
          </div>
        </div>

        {/* Right Area: Results, Guidance & Follow-up Q&A (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {isLoading ? (
            <div className="bg-white border border-[#E8DDDA] rounded-2xl p-10 text-center space-y-4 shadow-[0_4px_16px_rgba(60,52,54,0.04)]">
              <div className="w-12 h-12 rounded-2xl bg-[#E3EFEB] text-[#254E4A] flex items-center justify-center mx-auto border border-[#254E4A]/30">
                <RefreshCw className="w-6 h-6 animate-spin text-[#254E4A]" strokeWidth={2.25} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#3C3436]">
                  DeskSense is Inspecting Your Coding Roadblock
                </h3>
                <p className="text-xs text-[#6F6263] max-w-md mx-auto leading-relaxed">
                  Decoding error traces, evaluating root causes, and formulating a safe, step-by-step fix...
                </p>
              </div>
            </div>
          ) : apiError ? (
            <div className="bg-white border border-[#D98F9B] rounded-2xl p-6 space-y-3.5 shadow-2xs">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#D98F9B] shrink-0 mt-0.5" strokeWidth={2.25} />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#3C3436]">
                    Coding Assistance Notice
                  </h3>
                  <p className="text-xs text-[#6F6263] leading-relaxed">
                    {apiError}
                  </p>
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Identified Goal & Problem Explanation */}
              <div className="bg-white border border-[#E8DDDA] rounded-2xl p-6 shadow-[0_4px_16px_rgba(60,52,54,0.04)] space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#254E4A] uppercase tracking-wider bg-[#E3EFEB] px-2.5 py-0.5 rounded-md border border-[#254E4A]/25 inline-block">
                    Identified Goal
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#3C3436]">
                    {result.identifiedGoal}
                  </h2>
                </div>

                {/* Potentially Destructive Warning Banner if present */}
                {result.isPotentiallyDestructive && (
                  <div className="p-4 rounded-xl bg-[#F5E2E3] border-2 border-[#D98F9B] text-xs text-[#3C3436] space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-[#D98F9B]">
                      <ShieldAlert className="w-4 h-4 shrink-0" strokeWidth={2.25} />
                      <span>CAUTION: Potentially Destructive Operation</span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-semibold text-[#3C3436]">
                      {result.destructiveWarning ||
                        'This solution involves commands or flags that can delete files or reset history. Please create a backup copy before executing.'}
                    </p>
                  </div>
                )}

                {/* Plain-English Problem Explanation */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#3C3436]">
                    Why This Happened (In Plain English):
                  </span>
                  <p className="text-xs sm:text-sm text-[#3C3436] leading-relaxed bg-[#FFF9F5] p-4 rounded-xl border border-[#E8DDDA] font-medium">
                    {result.problemExplanation}
                  </p>
                </div>

                {/* Likely Causes */}
                {result.likelyCauses && result.likelyCauses.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#3C3436]">
                      Likely Causes (Acknowledging Uncertainty):
                    </span>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-[#6F6263]">
                      {result.likelyCauses.map((cause, i) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safe Solution Summary */}
                <div className="p-3.5 rounded-xl bg-[#E3EFEB] border border-[#254E4A]/25 space-y-1">
                  <span className="text-xs font-bold text-[#254E4A]">
                    Recommended Safe Solution:
                  </span>
                  <p className="text-xs text-[#3C3436] leading-relaxed font-semibold">
                    {result.safeSolutionSummary}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Fix Instructions */}
              <div className="bg-white border border-[#E8DDDA] rounded-2xl p-6 shadow-[0_4px_16px_rgba(60,52,54,0.04)] space-y-4">
                <h3 className="text-sm font-extrabold text-[#3C3436] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
                  <span>Step-by-Step Guidance</span>
                </h3>

                <div className="space-y-3">
                  {result.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 rounded-xl bg-[#FFF9F5] border border-[#E8DDDA] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-xs sm:text-sm text-[#3C3436]">
                          Step {step.stepNumber}: {step.title}
                        </span>
                        <ActionBadge actionType={step.actionType} size="sm" />
                      </div>
                      <p className="text-xs text-[#3C3436] leading-relaxed font-medium">
                        {step.instruction}
                      </p>
                      {step.tip && (
                        <p className="text-[11px] text-[#254E4A] font-semibold italic">
                          Tip: {step.tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Proposed Code Snippet / Diff */}
                {result.codeDiffOrSnippet && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#3C3436] flex items-center gap-1.5">
                        <FileCode className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
                        <span>Proposed Code or Command ({result.codeDiffOrSnippet.language}):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(result.codeDiffOrSnippet!.code)}
                        className="text-xs text-[#254E4A] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        {copiedSnippet ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" strokeWidth={2.25} />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Clean warm espresso neutral code container */}
                    <div className="relative rounded-xl overflow-hidden border border-[#E8DDDA] bg-[#2A2426] p-4 font-mono text-xs text-[#FFF9F5] overflow-x-auto shadow-inner">
                      <pre>{result.codeDiffOrSnippet.code}</pre>
                    </div>
                    <p className="text-[11px] text-[#6F6263]">
                      {result.codeDiffOrSnippet.description}
                    </p>
                  </div>
                )}

                {/* Developer Learning Takeaway */}
                {result.learningTakeaway && (
                  <div className="p-4 rounded-xl bg-[#F5E2E3] border border-[#D98F9B] space-y-1">
                    <span className="text-xs font-bold text-[#D98F9B]">
                      Developer Literacy Takeaway:
                    </span>
                    <p className="text-xs text-[#3C3436] leading-relaxed font-medium">
                      {result.learningTakeaway}
                    </p>
                  </div>
                )}
              </div>

              {/* Follow-Up Q&A Section */}
              <div className="bg-white border border-[#E8DDDA] rounded-2xl p-6 shadow-[0_4px_16px_rgba(60,52,54,0.04)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#3C3436] flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#254E4A]" strokeWidth={2.25} />
                    <span>Ask a Follow-up Question</span>
                  </h3>
                  <span className="text-[11px] text-[#6F6263] font-medium">Contextual Discussion</span>
                </div>

                {/* Suggested Follow-Ups */}
                {result.suggestedFollowUps && result.suggestedFollowUps.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#6F6263] uppercase tracking-wider">
                      Suggested questions you can ask:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {result.suggestedFollowUps.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickFollowUpClick(q)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-[#FFF9F5] hover:bg-[#E3EFEB] text-[#3C3436] hover:text-[#254E4A] border border-[#E8DDDA] cursor-pointer transition-colors text-left font-semibold"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Message History */}
                {followUpHistory.length > 0 && (
                  <div className="space-y-2.5 pt-2 max-h-80 overflow-y-auto">
                    {followUpHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#E3EFEB] text-[#3C3436] ml-6 border border-[#254E4A]/30 font-medium'
                            : 'bg-[#FFF9F5] text-[#3C3436] mr-6 border border-[#E8DDDA] font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1 text-[11px]">
                          <span className={msg.role === 'user' ? 'text-[#254E4A]' : 'text-[#3C3436]'}>
                            {msg.role === 'user' ? 'You' : 'DeskSense'}
                          </span>
                          <span className="text-[#6F6263] font-normal">{msg.timestamp}</span>
                        </div>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow-up Input */}
                <form onSubmit={handleSendFollowUp} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    placeholder="Ask a clarifying question (e.g. 'What does this flag mean?' or 'It gave me error 127')..."
                    className="grow px-3.5 py-2.5 bg-[#FFF9F5] border border-[#E8DDDA] rounded-xl text-xs text-[#3C3436] placeholder-[#6F6263] focus:outline-hidden focus:ring-2 focus:ring-[#D98F9B] focus:bg-white font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!followUpQuestion.trim() || isFollowUpLoading}
                    className="px-4 py-2.5 bg-[#254E4A] hover:bg-[#1C3D3A] disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-2xs"
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
            </div>
          ) : (
            <div className="bg-white border border-[#E8DDDA] rounded-2xl p-10 text-center space-y-3.5 shadow-[0_4px_16px_rgba(60,52,54,0.04)]">
              <div className="w-12 h-12 rounded-2xl bg-[#E3EFEB] text-[#254E4A] flex items-center justify-center mx-auto border border-[#254E4A]/30">
                <FolderCode className="w-6 h-6 text-[#254E4A]" strokeWidth={2.25} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#3C3436]">
                  Ready for Your Coding Questions
                </h3>
                <p className="text-xs text-[#6F6263] max-w-sm mx-auto leading-relaxed">
                  Select your task type and environment on the left, paste an error message or code snippet, and DeskSense will break it down into safe, manageable steps.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

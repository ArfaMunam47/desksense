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
  Terminal,
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

  const entryPoints = [
    {
      id: 'explain_error',
      title: 'Explain an error',
      desc: 'Decode cryptic terminal errors or compiler tracebacks in plain English',
      task: 'explain_error' as CodingTaskType,
      env: 'Node.js / npm',
      icon: AlertTriangle,
      color: 'bg-[#F1DDE0] text-[#B96F7D] border-[#DFC0C7]',
    },
    {
      id: 'understand_code',
      title: 'Understand code',
      desc: 'Break down an unfamiliar function, script, or syntax step-by-step',
      task: 'explain_code' as CodingTaskType,
      env: 'HTML / CSS / JavaScript',
      icon: Code2,
      color: 'bg-[#E8E2F1] text-[#65517E] border-[#C8BFD8]',
    },
    {
      id: 'terminal_output',
      title: 'Understand terminal output',
      desc: 'Clarify command outputs, exit codes, or unreadable console logs',
      task: 'terminal_output' as CodingTaskType,
      env: 'Windows Terminal / PowerShell',
      icon: Terminal,
      color: 'bg-[#DDEBDD] text-[#355C4B] border-[#A9C9AD]',
    },
    {
      id: 'python_problem',
      title: 'Debug a Python problem',
      desc: 'Troubleshoot indentation, TypeError, virtualenvs, or pip packages',
      task: 'fix_issue' as CodingTaskType,
      env: 'Python / pip',
      icon: Sparkles,
      color: 'bg-[#F4EBCF] text-[#303B38] border-[#E2D6B2]',
    },
    {
      id: 'vs_code',
      title: 'Troubleshoot VS Code',
      desc: 'Fix extension conflicts, path detection, or editor settings',
      task: 'env_troubleshoot' as CodingTaskType,
      env: 'Visual Studio Code',
      icon: FolderCode,
      color: 'bg-[#E8E2F1] text-[#65517E] border-[#C8BFD8]',
    },
    {
      id: 'install_errors',
      title: 'Understand installation errors',
      desc: 'Resolve npm, pip, or git setup failures without breaking configurations',
      task: 'install_dependency' as CodingTaskType,
      env: 'Node.js / npm',
      icon: FileCode,
      color: 'bg-[#F4E3D6] text-[#8E5E47] border-[#E4CCBC]',
    },
  ];

  const handleSelectEntryPoint = (entry: typeof entryPoints[0]) => {
    setTaskType(entry.task);
    setEnvironment(entry.env);
    setDescription(`I need help to ${entry.title.toLowerCase()} in ${entry.env}.`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 sm:py-8 space-y-7">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8E2F1] text-[#65517E] text-xs font-bold border border-[#C8BFD8] shadow-2xs">
          <Terminal className="w-4 h-4 text-[#65517E]" strokeWidth={2.2} />
          <span>Developer & Programming Guidance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#303B38]">
          Coding Help
        </h1>
        <p className="text-xs sm:text-sm text-[#727A75] max-w-2xl leading-relaxed">
          Get patient, contextual assistance for programming errors, terminal outputs, and development environment roadblocks without judgment.
        </p>
      </div>

      {/* Clear Entry Points Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#303B38] uppercase tracking-wider">
            Quick Entry Points
          </span>
          <span className="text-xs text-[#727A75] font-medium">
            Click to configure common coding scenarios
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {entryPoints.map((entry) => {
            const Icon = entry.icon;
            const isSelected =
              taskType === entry.task && environment === entry.env;

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => handleSelectEntryPoint(entry)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? `${entry.color} ring-2 ring-[#65517E] shadow-[0_2px_8px_rgba(101,81,126,0.15)]`
                    : 'bg-[#FFFFFF] hover:bg-[#F4F4F1] border-[#E2E4DF] shadow-2xs'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${entry.color} flex items-center justify-center shrink-0 border shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_5px_rgba(0,0,0,0.06)]`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.7} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#303B38] line-clamp-1">
                    {entry.title}
                  </h4>
                  <p className="text-[10px] text-[#727A75] line-clamp-2 mt-0.5 leading-snug font-medium">
                    {entry.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Context Input (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(48,59,56,0.04)] space-y-4"
          >
            {/* Task Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303B38]">
                What do you need help with?
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value as CodingTaskType)}
                className="w-full px-3.5 py-2.5 bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-xs font-bold text-[#303B38] focus:outline-hidden focus:ring-2 focus:ring-[#65517E] focus:bg-[#FFFFFF]"
              >
                {taskOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#727A75]">
                {taskOptions.find((t) => t.id === taskType)?.desc}
              </p>
            </div>

            {/* Development Environment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303B38]">
                Development Environment or Tool:
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-xs font-bold text-[#303B38] focus:outline-hidden focus:ring-2 focus:ring-[#65517E] focus:bg-[#FFFFFF]"
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
              <label className="block text-xs font-bold text-[#303B38]">
                Description of what you are trying to do:
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened or what command you ran..."
                className="w-full px-3.5 py-2.5 bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-xs text-[#303B38] placeholder-[#727A75] focus:outline-hidden focus:ring-2 focus:ring-[#65517E] focus:bg-[#FFFFFF] font-medium"
              />
            </div>

            {/* Error Message Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303B38]">
                Error Message or Terminal Output (Optional):
              </label>
              <textarea
                rows={3}
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                placeholder="Paste the exact red error text or traceback here..."
                className="w-full px-3.5 py-2.5 font-mono text-xs bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-[#303B38] placeholder-[#727A75] focus:outline-hidden focus:ring-2 focus:ring-[#65517E] focus:bg-[#FFFFFF]"
              />
            </div>

            {/* Code Snippet Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303B38]">
                Relevant Code Snippet (Optional):
              </label>
              <textarea
                rows={4}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Paste the code block or function you're working on..."
                className="w-full px-3.5 py-2.5 font-mono text-xs bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-[#303B38] placeholder-[#727A75] focus:outline-hidden focus:ring-2 focus:ring-[#65517E] focus:bg-[#FFFFFF]"
              />
            </div>

            {/* User-Approved Screenshot Context */}
            <div className="pt-2 border-t border-[#E2E4DF] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#303B38]">
                  Visual Screen Context:
                </span>
                {currentCapture ? (
                  <button
                    type="button"
                    onClick={onDiscardCapture}
                    className="text-[#B96F7D] hover:underline text-[11px] flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2.65} />
                    <span>Remove</span>
                  </button>
                ) : null}
              </div>

              {currentCapture ? (
                <div className="p-3 rounded-xl border border-[#C8BFD8] bg-[#E8E2F1]/50 flex items-center gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]">
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#303B38]/10 shrink-0 border border-[#E2E4DF]">
                    <img
                      src={currentCapture.dataUrl}
                      alt="Capture thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grow min-w-0">
                    <p className="text-xs font-bold text-[#65517E] truncate">
                      Screenshot Attached
                    </p>
                    <label className="flex items-center gap-1.5 text-[11px] text-[#727A75] mt-0.5 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={includeScreenshot}
                        onChange={(e) => setIncludeScreenshot(e.target.checked)}
                        className="rounded accent-[#65517E]"
                      />
                      <span>Include in coding analysis</span>
                    </label>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenCapture}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#C8BFD8] text-[#65517E] hover:bg-[#E8E2F1]/50 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Camera className="w-4.5 h-4.5 text-[#65517E]" strokeWidth={2.65} />
                  <span>Attach Screenshot of Editor / Terminal</span>
                </button>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#65517E] hover:bg-[#514066] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-[0_3px_10px_rgba(101,81,126,0.25)] cursor-pointer transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4.5 h-4.5 animate-spin" strokeWidth={2.65} />
                    <span>Analyzing Problem & Formulating Safe Fix...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5 text-white" strokeWidth={2.65} />
                    <span>Analyze & Get Step-by-Step Fix</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Safety Notice Card */}
          <div className="bg-[#DDEBDD] border border-[#A9C9AD] rounded-2xl p-4 text-xs text-[#303B38] space-y-1.5 shadow-2xs">
            <div className="font-extrabold text-[#355C4B] flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
              <span>DeskSense Safety Guarantee</span>
            </div>
            <p className="text-[11px] text-[#303B38] leading-relaxed font-medium">
              DeskSense never executes commands silently or modifies project files behind your back. All terminal commands are presented for your review first, with dangerous flags clearly highlighted.
            </p>
          </div>
        </div>

        {/* Right Area: Results, Guidance & Follow-up Q&A (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {isLoading ? (
            <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-10 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#E8E2F1] text-[#65517E] flex items-center justify-center mx-auto border border-[#C8BFD8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_6px_rgba(101,81,126,0.12)]">
                <RefreshCw className="w-7 h-7 animate-spin text-[#65517E]" strokeWidth={2.7} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#303B38]">
                  DeskSense is Inspecting Your Coding Roadblock
                </h3>
                <p className="text-xs text-[#727A75] max-w-md mx-auto leading-relaxed">
                  Decoding error traces, evaluating root causes, and formulating a safe, step-by-step fix...
                </p>
              </div>
            </div>
          ) : apiError ? (
            <div className="bg-[#FFFFFF] border border-[#B96F7D] rounded-2xl p-6 space-y-3.5 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F1DDE0] text-[#B96F7D] flex items-center justify-center shrink-0 border border-[#DFC0C7] shadow-2xs">
                  <AlertTriangle className="w-5 h-5 text-[#B96F7D]" strokeWidth={2.7} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#303B38]">
                    Coding Assistance Notice
                  </h3>
                  <p className="text-xs text-[#727A75] leading-relaxed">
                    {apiError}
                  </p>
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Identified Goal & Problem Explanation */}
              <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 shadow-[0_4px_16px_rgba(48,59,56,0.04)] space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#65517E] uppercase tracking-wider bg-[#E8E2F1] px-2.5 py-0.5 rounded-md border border-[#C8BFD8] inline-block shadow-2xs">
                    Identified Goal
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#303B38]">
                    {result.identifiedGoal}
                  </h2>
                </div>

                {/* Potentially Destructive Warning Banner if present */}
                {result.isPotentiallyDestructive && (
                  <div className="p-4 rounded-xl bg-[#F1DDE0] border-2 border-[#B96F7D] text-xs text-[#303B38] space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-2 font-bold text-[#B96F7D]">
                      <ShieldAlert className="w-5 h-5 shrink-0" strokeWidth={2.7} />
                      <span>CAUTION: Potentially Destructive Operation</span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-semibold text-[#303B38]">
                      {result.destructiveWarning ||
                        'This solution involves commands or flags that can delete files or reset history. Please create a backup copy before executing.'}
                    </p>
                  </div>
                )}

                {/* Plain-English Problem Explanation */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#303B38]">
                    Why This Happened (In Plain English):
                  </span>
                  <p className="text-xs sm:text-sm text-[#303B38] leading-relaxed bg-[#F4F4F1] p-4 rounded-xl border border-[#E2E4DF] font-medium">
                    {result.problemExplanation}
                  </p>
                </div>

                {/* Likely Causes */}
                {result.likelyCauses && result.likelyCauses.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#303B38]">
                      Likely Causes (Acknowledging Uncertainty):
                    </span>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-[#727A75]">
                      {result.likelyCauses.map((cause, i) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safe Solution Summary */}
                <div className="p-3.5 rounded-xl bg-[#DDEBDD] border border-[#A9C9AD] space-y-1 shadow-2xs">
                  <span className="text-xs font-bold text-[#355C4B]">
                    Recommended Safe Solution:
                  </span>
                  <p className="text-xs text-[#303B38] leading-relaxed font-semibold">
                    {result.safeSolutionSummary}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Fix Instructions */}
              <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 shadow-[0_4px_16px_rgba(48,59,56,0.04)] space-y-4">
                <h3 className="text-sm font-extrabold text-[#303B38] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#355C4B]" strokeWidth={2.65} />
                  <span>Step-by-Step Guidance</span>
                </h3>

                <div className="space-y-3">
                  {result.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 rounded-xl bg-[#F4F4F1] border border-[#E2E4DF] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-xs sm:text-sm text-[#303B38]">
                          Step {step.stepNumber}: {step.title}
                        </span>
                        <ActionBadge actionType={step.actionType} size="sm" />
                      </div>
                      <p className="text-xs text-[#303B38] leading-relaxed font-medium">
                        {step.instruction}
                      </p>
                      {step.tip && (
                        <p className="text-[11px] text-[#65517E] font-semibold italic">
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
                      <span className="font-bold text-[#303B38] flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#E8E2F1] text-[#65517E] flex items-center justify-center border border-[#C8BFD8]">
                          <FileCode className="w-4 h-4 text-[#65517E]" strokeWidth={2.65} />
                        </div>
                        <span>Proposed Code or Command ({result.codeDiffOrSnippet.language}):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(result.codeDiffOrSnippet!.code)}
                        className="text-xs text-[#65517E] hover:underline flex items-center gap-1.5 cursor-pointer font-bold bg-[#E8E2F1]/50 px-2.5 py-1 rounded-lg border border-[#C8BFD8]"
                      >
                        {copiedSnippet ? (
                          <>
                            <Check className="w-4 h-4 text-[#355C4B]" strokeWidth={2.75} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" strokeWidth={2.65} />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Clean neutral dark editor container */}
                    <div className="relative rounded-xl overflow-hidden border border-[#E2E4DF] bg-[#252928] p-4 font-mono text-xs text-[#F4F4F1] overflow-x-auto shadow-inner">
                      <pre>{result.codeDiffOrSnippet.code}</pre>
                    </div>
                    <p className="text-[11px] text-[#727A75]">
                      {result.codeDiffOrSnippet.description}
                    </p>
                  </div>
                )}

                {/* Developer Learning Takeaway */}
                {result.learningTakeaway && (
                  <div className="p-4 rounded-xl bg-[#F4EBCF] border border-[#E2D6B2] space-y-1 shadow-2xs">
                    <span className="text-xs font-bold text-[#303B38]">
                      Developer Literacy Takeaway:
                    </span>
                    <p className="text-xs text-[#303B38] leading-relaxed font-medium">
                      {result.learningTakeaway}
                    </p>
                  </div>
                )}
              </div>

              {/* Follow-Up Q&A Section */}
              <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-6 shadow-[0_4px_16px_rgba(48,59,56,0.04)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#303B38] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#E8E2F1] text-[#65517E] flex items-center justify-center border border-[#C8BFD8]">
                      <HelpCircle className="w-4 h-4 text-[#65517E]" strokeWidth={2.65} />
                    </div>
                    <span>Ask a Follow-up Question</span>
                  </h3>
                  <span className="text-[11px] text-[#727A75] font-medium">Contextual Discussion</span>
                </div>

                {/* Suggested Follow-Ups */}
                {result.suggestedFollowUps && result.suggestedFollowUps.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#727A75] uppercase tracking-wider">
                      Suggested questions you can ask:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {result.suggestedFollowUps.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleQuickFollowUpClick(q)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-[#F4F4F1] hover:bg-[#E8E2F1] text-[#303B38] hover:text-[#65517E] border border-[#E2E4DF] cursor-pointer transition-colors text-left font-semibold"
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
                            ? 'bg-[#E8E2F1] text-[#303B38] ml-6 border border-[#C8BFD8] font-medium'
                            : 'bg-[#F4F4F1] text-[#303B38] mr-6 border border-[#E2E4DF] font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1 text-[11px]">
                          <span className={msg.role === 'user' ? 'text-[#65517E]' : 'text-[#303B38]'}>
                            {msg.role === 'user' ? 'You' : 'DeskSense'}
                          </span>
                          <span className="text-[#727A75] font-normal">{msg.timestamp}</span>
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
                    className="grow px-3.5 py-2.5 bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-xs text-[#303B38] placeholder-[#727A75] focus:outline-hidden focus:ring-2 focus:ring-[#65517E] focus:bg-[#FFFFFF] font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!followUpQuestion.trim() || isFollowUpLoading}
                    className="px-4 py-2.5 bg-[#65517E] hover:bg-[#514066] disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-2xs hover:scale-102 active:scale-98"
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
            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl p-10 text-center space-y-3.5 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#E8E2F1] text-[#65517E] flex items-center justify-center mx-auto border border-[#C8BFD8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_6px_rgba(101,81,126,0.12)]">
                <FolderCode className="w-7 h-7 text-[#65517E]" strokeWidth={2.7} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#303B38]">
                  Ready for Your Coding Questions
                </h3>
                <p className="text-xs text-[#727A75] max-w-sm mx-auto leading-relaxed">
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

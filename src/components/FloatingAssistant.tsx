import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  Send,
  Square,
  Camera,
  FileText,
  Download,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Bot,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import { ScreenCapture } from '../types';
import { streamChat } from '../services/api';
import { DeskSenseEmblem } from './DeskSenseEmblem';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  steps?: string[];
  takeaway?: string;
  hasImage?: boolean;
  attachedFileName?: string;
  categoryLabel?: string;
}

interface FloatingAssistantProps {
  onOpenCapture: () => void;
  currentCapture: ScreenCapture | null;
  onDiscardCapture: () => void;
  defaultOs?: string;
}

const CodeOrMarkdownBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = 'document.txt';
    const lang = (language || '').toLowerCase();
    if (lang === 'markdown' || lang === 'md' || code.trim().startsWith('#')) {
      filename = 'README.md';
    } else if (lang === 'python' || lang === 'py') {
      filename = 'script.py';
    } else if (lang === 'javascript' || lang === 'js') {
      filename = 'index.js';
    } else if (lang === 'typescript' || lang === 'ts') {
      filename = 'index.ts';
    } else if (lang === 'html') {
      filename = 'index.html';
    } else if (lang === 'css') {
      filename = 'styles.css';
    } else if (lang === 'json') {
      filename = 'config.json';
    } else if (lang === 'sql') {
      filename = 'query.sql';
    } else if (lang === 'sh' || lang === 'bash') {
      filename = 'script.sh';
    }

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-2 rounded-xl border border-[#E2E4DF] bg-[#252928] overflow-hidden text-xs shadow-inner">
      <div className="bg-[#1D2120] px-3 py-1.5 flex items-center justify-between border-b border-white/10 text-[10px] text-[#A9B2AD]">
        <span className="font-mono font-bold text-white uppercase tracking-wider">
          {language || 'Code / Document'}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/10 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#A9C9AD]" strokeWidth={2.65} />
                <span className="text-[#A9C9AD] font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" strokeWidth={2.65} />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#355C4B] hover:bg-[#29473A] text-white transition-colors cursor-pointer font-bold shadow-2xs"
            title="Download file to computer"
          >
            <Download className="w-3 h-3" strokeWidth={2.65} />
            <span>Download</span>
          </button>
        </div>
      </div>
      <pre className="p-3 font-mono text-[11px] leading-relaxed text-[#F4F4F1] overflow-x-auto whitespace-pre">
        {code}
      </pre>
    </div>
  );
};

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  onOpenCapture,
  currentCapture,
  onDiscardCapture,
  defaultOs = 'Windows 11',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReceivingFirstToken, setIsReceivingFirstToken] = useState(false);
  const [attachedScreenshot, setAttachedScreenshot] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    content: string;
    size: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-greeting',
      role: 'assistant',
      text: "Hi! 👋 I'm DeskSense. Tell me what you're trying to do, and let's figure it out together.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Sync screenshot from global capture modal if user triggered it
  useEffect(() => {
    if (currentCapture) {
      setAttachedScreenshot(currentCapture.dataUrl);
    }
  }, [currentCapture]);

  const quickPrompts = [
    'Where did my downloaded file go?',
    'How do I take a screenshot on Windows?',
    'Explain a coding error to me',
    'How do I connect Bluetooth headphones?',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Please select a text or code file under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      setAttachedFile({
        name: file.name,
        content,
        size: file.size,
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setIsReceivingFirstToken(false);
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    if (isLoading) return;
    const query = (textToSend || input).trim();
    if (!query && !attachedScreenshot && !attachedFile) return;

    // Abort any pending stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text:
        query ||
        (attachedFile
          ? `Please inspect attached file "${attachedFile.name}"`
          : 'Analyze this screen for me, please.'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasImage: Boolean(attachedScreenshot),
      attachedFileName: attachedFile?.name,
    };

    const assistantId = `assistant-${Date.now() + 1}`;
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);
    setIsReceivingFirstToken(true);

    const imageToUse = attachedScreenshot;
    const fileToUse = attachedFile;
    setAttachedScreenshot(null);
    setAttachedFile(null);
    if (currentCapture) {
      onDiscardCapture();
    }

    // Keep context compact (last 6 non-greeting messages)
    const historyForStream = messages
      .filter((m) => m.id !== 'initial-greeting' && m.text.trim())
      .slice(-6)
      .map((m) => ({
        role: m.role,
        text: m.text,
      }));

    try {
      let accumulated = '';
      await streamChat({
        message: query,
        history: historyForStream,
        imageBase64: imageToUse,
        attachedFile: fileToUse,
        osContext: defaultOs,
        signal: controller.signal,
        onMeta: (meta) => {
          setIsReceivingFirstToken(false);
          if (meta?.categoryLabel) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId ? { ...msg, categoryLabel: meta.categoryLabel } : msg
              )
            );
          }
        },
        onChunk: (chunk) => {
          setIsReceivingFirstToken(false);
          accumulated += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, text: accumulated } : msg
            )
          );
        },
        onError: (err) => {
          setIsReceivingFirstToken(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? {
                    ...msg,
                    text: accumulated
                      ? accumulated + `\n\n[Note: ${err}]`
                      : err || 'DeskSense took longer than expected. Please try again.',
                  }
                : msg
            )
          );
        },
        onDone: () => {
          setIsReceivingFirstToken(false);
        },
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId && !msg.text
              ? {
                  ...msg,
                  text: 'DeskSense could not connect to the AI service. Please check your connection or retry.',
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      setIsReceivingFirstToken(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    handleCancel();
    setMessages([
      {
        id: 'initial-greeting',
        role: 'assistant',
        text: "Hi! 👋 I'm DeskSense. Tell me what you're trying to do, and let's figure it out together.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setAttachedScreenshot(null);
    setAttachedFile(null);
  };

  const renderMessageContent = (text: string) => {
    if (!text.includes('```')) {
      return (
        <p className="whitespace-pre-line text-xs font-normal leading-relaxed">
          {text}
        </p>
      );
    }

    const parts = text.split(/(```[\s\S]*?```)/g);
    return (
      <div className="space-y-2 text-xs font-normal leading-relaxed">
        {parts.map((part, idx) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const firstLineEnd = part.indexOf('\n');
            const lang = firstLineEnd !== -1 ? part.slice(3, firstLineEnd).trim() : '';
            const code = firstLineEnd !== -1 ? part.slice(firstLineEnd + 1, -3) : part.slice(3, -3);
            return <CodeOrMarkdownBlock key={idx} code={code} language={lang} />;
          }
          if (!part.trim()) return null;
          return (
            <p key={idx} className="whitespace-pre-line">
              {part}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-9 right-6 z-40 bg-[#355C4B] hover:bg-[#29473A] text-white p-3.5 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(53,92,75,0.35)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_12px_28px_rgba(53,92,75,0.45)] flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95 group select-none border border-white/20"
          title="Open DeskSense AI Assistant"
          aria-label="Open DeskSense AI Assistant"
        >
          <div className="relative">
            <DeskSenseEmblem className="w-5.5 h-5.5 text-white" strokeWidth={2.6} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#DDEBDD] ring-2 ring-[#355C4B]" />
          </div>
          <span className="text-xs font-extrabold pr-1 tracking-wide">
            DeskSense AI
          </span>
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className={`fixed right-6 z-40 w-[370px] sm:w-[390px] bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl shadow-[0_16px_40px_rgba(48,59,56,0.16)] flex flex-col transition-all overflow-hidden ${
            isMinimized
              ? 'bottom-9 h-14'
              : 'bottom-9 h-[510px]'
          }`}
          role="dialog"
          aria-label="DeskSense AI Assistant Panel"
        >
          {/* Header */}
          <div className="bg-[#FFFFFF] border-b border-[#E2E4DF] px-4 py-3 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#DDEBDD] border border-[#A9C9AD] text-[#355C4B] flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_4px_rgba(53,92,75,0.12)]">
                <DeskSenseEmblem className="w-5 h-5 text-[#355C4B]" strokeWidth={2.6} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-extrabold text-[#303B38] leading-tight">
                    DeskSense AI
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#355C4B]" />
                </div>
                <p className="text-[10px] text-[#727A75] font-medium leading-tight">
                  Your computer companion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 text-[#727A75] hover:text-[#B96F7D] rounded-lg hover:bg-[#F4F4F1] transition-colors cursor-pointer"
                title="Restart conversation"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.65} />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-[#727A75] hover:text-[#303B38] rounded-lg hover:bg-[#F4F4F1] transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" strokeWidth={2.65} />
                ) : (
                  <Minimize2 className="w-4 h-4" strokeWidth={2.65} />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#727A75] hover:text-[#303B38] rounded-lg hover:bg-[#F4F4F1] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4.5 h-4.5" strokeWidth={2.65} />
              </button>
            </div>
          </div>

          {/* Body Content (Hidden if Minimized) */}
          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F6]">
                {messages.map((msg) => {
                  if (msg.role === 'assistant' && !msg.text && isLoading) return null;
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isUser ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed space-y-2 ${
                          isUser
                            ? 'bg-[#355C4B] text-white rounded-br-xs shadow-2xs font-medium'
                            : 'bg-[#FFFFFF] text-[#303B38] border border-[#E2E4DF] rounded-bl-xs shadow-2xs font-normal'
                        }`}
                      >
                        {msg.hasImage && (
                          <div className="flex items-center gap-1.5 text-[10px] bg-black/10 text-white/90 px-2 py-0.5 rounded-md font-semibold mb-1 w-fit">
                            <ImageIcon className="w-3.5 h-3.5" strokeWidth={2.65} />
                            <span>Attached Screenshot</span>
                          </div>
                        )}

                        {msg.attachedFileName && (
                          <div className="flex items-center gap-1.5 text-[10px] bg-black/10 text-white/90 px-2 py-0.5 rounded-md font-semibold mb-1 w-fit">
                            <FileText className="w-3.5 h-3.5" strokeWidth={2.65} />
                            <span>Attached: {msg.attachedFileName}</span>
                          </div>
                        )}

                        {!isUser && msg.categoryLabel && (
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#65517E] bg-[#E8E2F1] px-2 py-0.5 rounded-md border border-[#C8BFD8] w-fit mb-1">
                            <Sparkles className="w-3 h-3 text-[#65517E]" strokeWidth={2.65} />
                            <span>{msg.categoryLabel}</span>
                          </div>
                        )}

                        {renderMessageContent(msg.text)}

                        {/* Numbered steps if returned by assistant */}
                        {msg.steps && msg.steps.length > 0 && (
                          <div className="space-y-1.5 pt-1.5 border-t border-[#E2E4DF]">
                            {msg.steps.map((step, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-lg bg-[#F4F4F1] border border-[#E2E4DF] text-[11px] text-[#303B38] font-medium leading-snug"
                              >
                                {step}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Literacy takeaway */}
                        {msg.takeaway && (
                          <div className="p-2 rounded-lg bg-[#F4EBCF] border border-[#E2D6B2] text-[10px] text-[#303B38] font-medium">
                            <span className="font-bold">Tip: </span>
                            {msg.takeaway}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-[#727A75] mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {isLoading && isReceivingFirstToken && (
                  <div className="flex items-start gap-2">
                    <div className="bg-[#FFFFFF] border border-[#E2E4DF] rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-2xs text-xs text-[#727A75] flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#355C4B]" strokeWidth={2.65} />
                      <span className="font-medium">Thinking patiently...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel if only greeting is showing */}
              {messages.length === 1 && (
                <div className="p-3 bg-[#FFFFFF] border-t border-[#E2E4DF] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#727A75] uppercase tracking-wider block">
                    Quick questions:
                  </span>
                  <div className="flex flex-col gap-1">
                    {quickPrompts.slice(0, 3).map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-[#F4F4F1] hover:bg-[#DDEBDD] hover:text-[#355C4B] border border-[#E2E4DF] text-[#303B38] font-medium transition-colors cursor-pointer truncate flex items-center justify-between group"
                      >
                        <span className="truncate">{prompt}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#727A75] group-hover:text-[#355C4B] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" strokeWidth={2.65} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Screenshot Attachment Preview Bar */}
              {attachedScreenshot && (
                <div className="px-3.5 py-2 bg-[#DDEBDD] border-t border-[#A9C9AD] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-6 rounded bg-[#355C4B]/10 overflow-hidden border border-[#A9C9AD] shrink-0">
                      <img
                        src={attachedScreenshot}
                        alt="Screenshot thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#355C4B] truncate">
                      Screenshot ready for analysis
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedScreenshot(null);
                      if (currentCapture) onDiscardCapture();
                    }}
                    className="text-[#355C4B] hover:text-[#29473A] font-bold text-[10px] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* File Attachment Preview Bar */}
              {attachedFile && (
                <div className="px-3.5 py-2 bg-[#DDEBDD] border-t border-[#A9C9AD] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded bg-[#355C4B]/10 flex items-center justify-center border border-[#A9C9AD] shrink-0 text-[#355C4B]">
                      <FileText className="w-3.5 h-3.5" strokeWidth={2.65} />
                    </div>
                    <span className="text-[11px] font-bold text-[#355C4B] truncate">
                      {attachedFile.name} ({(attachedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="text-[#355C4B] hover:text-[#29473A] font-bold text-[10px] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-[#FFFFFF] border-t border-[#E2E4DF] space-y-2">
                <div className="relative">
                  <textarea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything, generate documents, code, or debug... (Enter)"
                    className="w-full pl-3 pr-24 py-2 bg-[#F4F4F1] border border-[#E2E4DF] rounded-xl text-xs text-[#303B38] placeholder-[#727A75]/80 focus:outline-hidden focus:ring-2 focus:ring-[#355C4B] focus:bg-[#FFFFFF] resize-none font-medium"
                  />

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".txt,.md,.py,.js,.ts,.jsx,.tsx,.json,.html,.css,.sql,.java,.c,.cpp,.h,.toml,.yaml,.yml,.sh,.bat,.ps1,.csv"
                  />

                  <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        attachedFile
                          ? 'bg-[#DDEBDD] text-[#355C4B] border-[#A9C9AD]'
                          : 'bg-[#FFFFFF] hover:bg-[#ECEDE9] text-[#727A75] border-[#E2E4DF]'
                      }`}
                      title={attachedFile ? 'Change attached file' : 'Attach project file or code'}
                    >
                      <FileText className="w-4 h-4" strokeWidth={2.65} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenCapture()}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        attachedScreenshot
                          ? 'bg-[#DDEBDD] text-[#355C4B] border-[#A9C9AD]'
                          : 'bg-[#FFFFFF] hover:bg-[#ECEDE9] text-[#727A75] border-[#E2E4DF]'
                      }`}
                      title={attachedScreenshot ? 'Change screenshot' : 'Attach screenshot'}
                    >
                      <Camera className="w-4 h-4" strokeWidth={2.65} />
                    </button>

                    {isLoading ? (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="p-1.5 rounded-lg bg-[#B96F7D] hover:bg-[#A35967] text-white transition-all cursor-pointer shadow-2xs"
                        title="Stop generating"
                        aria-label="Stop generating"
                      >
                        <Square className="w-4 h-4 fill-current" strokeWidth={2} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSend()}
                        disabled={!input.trim() && !attachedScreenshot && !attachedFile}
                        className="p-1.5 rounded-lg bg-[#355C4B] hover:bg-[#29473A] disabled:opacity-40 text-white transition-all cursor-pointer shadow-2xs"
                        title="Send question"
                        aria-label="Send question"
                      >
                        <Send className="w-4 h-4" strokeWidth={2.65} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#727A75]">
                  <span>Shift + Enter for new line</span>
                  <span className="flex items-center gap-1 text-[#355C4B] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#355C4B]" strokeWidth={2.65} />
                    <span>Private & On-demand</span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

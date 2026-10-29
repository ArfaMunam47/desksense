import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Clipboard, X, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { ScreenCapture } from '../types';
import { captureScreenFrame, processImageFile } from '../services/screenCapture';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureComplete: (capture: ScreenCapture) => void;
  currentCapture: ScreenCapture | null;
  onDiscardCapture: () => void;
}

export const CaptureModal: React.FC<CaptureModalProps> = ({
  isOpen,
  onClose,
  onCaptureComplete,
  currentCapture,
  onDiscardCapture,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewCapture, setPreviewCapture] = useState<ScreenCapture | null>(currentCapture);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewCapture(currentCapture);
  }, [currentCapture]);

  // Support paste from clipboard inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            try {
              setIsCapturing(true);
              setError(null);
              const cap = await processImageFile(file);
              setPreviewCapture(cap);
            } catch (err: any) {
              setError(err.message || 'Failed to read pasted image.');
            } finally {
              setIsCapturing(false);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartBrowserCapture = async () => {
    setIsCapturing(true);
    setError(null);
    try {
      const cap = await captureScreenFrame();
      setPreviewCapture(cap);
    } catch (err: any) {
      setError(err.message || 'Screen capture was cancelled or failed.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCapturing(true);
    setError(null);
    try {
      const cap = await processImageFile(file);
      setPreviewCapture(cap);
    } catch (err: any) {
      setError(err.message || 'Failed to process screenshot file.');
    } finally {
      setIsCapturing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirm = () => {
    if (previewCapture) {
      onCaptureComplete(previewCapture);
      onClose();
    }
  };

  const handleDiscard = () => {
    setPreviewCapture(null);
    onDiscardCapture();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Authorize Screen Capture
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explicit single snapshot • No continuous background recording
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Privacy Reassurance Banner */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-lg p-3 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">Privacy First & User-Controlled</p>
              <p className="text-emerald-800/90 dark:text-emerald-300/80">
                DeskSense captures only a single frame when you approve it. Screen sharing stops immediately once the picture is taken. Sensitive data is never monitored in the background.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Notice</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Screen preview state */}
          {previewCapture ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="font-medium flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Screenshot Ready for Analysis
                </span>
                {previewCapture.dimensions && (
                  <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {previewCapture.dimensions.width} × {previewCapture.dimensions.height} px
                  </span>
                )}
              </div>

              <div className="relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 max-h-72 flex items-center justify-center">
                <img
                  src={previewCapture.dataUrl}
                  alt="Captured screen preview"
                  className="max-h-72 w-auto object-contain"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Discard and Remove
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartBrowserCapture}
                    disabled={isCapturing}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCapturing ? 'animate-spin' : ''}`} />
                    Capture Again
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    Use This Screenshot
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4 px-2 space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  How DeskSense uses your screen
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  When you ask a question like <em>"How do I download this picture?"</em>, seeing your screen allows DeskSense to point to the exact menu or button on your screen without guessing.
                </p>
              </div>

              {/* Main Capture Button */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Capture Window or Screen
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your browser will ask which window or screen you want to share.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartBrowserCapture}
                  disabled={isCapturing}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isCapturing ? 'Waiting for Selection...' : 'Capture Screen Now'}</span>
                </button>
              </div>

              {/* Alternative methods: Paste / Upload */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-slate-200 dark:border-slate-800" />
                  <span className="shrink mx-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                    Or alternative methods
                  </span>
                  <div className="grow border-t border-slate-200 dark:border-slate-800" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {/* Paste Box */}
                  <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <Clipboard className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Paste Clipboard (Ctrl + V)
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Press Win+Shift+S, snip, then press Ctrl+V here.
                      </p>
                    </div>
                  </div>

                  {/* Upload Image File */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Upload Screenshot File
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Select a .PNG or .JPG image from your computer.
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            DeskSense Privacy Guarantee
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

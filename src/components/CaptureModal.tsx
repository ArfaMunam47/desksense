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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#303B38]/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] rounded-2xl shadow-[0_16px_50px_rgba(48,59,56,0.18)] border border-[#E2E4DF] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E4DF] flex items-center justify-between bg-[#F4F4F1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_4px_rgba(53,92,75,0.12)] shrink-0">
              <Camera className="w-5 h-5" strokeWidth={2.7} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#303B38]">
                Authorize Screen Capture
              </h2>
              <p className="text-xs text-[#727A75]">
                Explicit single snapshot • No continuous background recording
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-[#ECEDE9] text-[#727A75] hover:text-[#303B38] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" strokeWidth={2.65} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Privacy Reassurance Banner in Soft Sage */}
          <div className="bg-[#DDEBDD] border border-[#A9C9AD] rounded-xl p-3.5 text-xs text-[#303B38] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#355C4B] shrink-0 mt-0.5" strokeWidth={2.65} />
            <div className="space-y-0.5">
              <p className="font-extrabold text-[#355C4B]">Privacy First & User-Controlled</p>
              <p className="text-[#303B38] leading-relaxed">
                DeskSense captures only a single frame when you approve it. Screen sharing stops immediately once the picture is taken. Sensitive data is never monitored in the background.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-[#F1DDE0] border border-[#B96F7D] rounded-xl p-3.5 text-xs text-[#303B38] flex items-start gap-2.5">
              <AlertTriangle className="w-4.5 h-4.5 text-[#B96F7D] shrink-0 mt-0.5" strokeWidth={2.65} />
              <div>
                <p className="font-bold">Notice</p>
                <p className="text-[#727A75]">{error}</p>
              </div>
            </div>
          )}

          {/* Screen preview state */}
          {previewCapture ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#727A75]">
                <span className="font-bold flex items-center gap-1.5 text-[#355C4B]">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#355C4B]" strokeWidth={2.65} />
                  Screenshot Ready for Analysis
                </span>
                {previewCapture.dimensions && (
                  <span className="font-mono text-[11px] bg-[#F4F4F1] text-[#303B38] px-2.5 py-0.5 rounded-md border border-[#E2E4DF] font-semibold">
                    {previewCapture.dimensions.width} × {previewCapture.dimensions.height} px
                  </span>
                )}
              </div>

              <div className="relative rounded-xl overflow-hidden border border-[#E2E4DF] bg-[#303B38]/5 max-h-72 flex items-center justify-center shadow-inner">
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
                  className="text-xs text-[#B96F7D] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <X className="w-4 h-4" strokeWidth={2.65} />
                  Discard and Remove
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartBrowserCapture}
                    disabled={isCapturing}
                    className="px-3.5 py-2 rounded-xl border border-[#E2E4DF] text-xs font-bold text-[#303B38] hover:bg-[#ECEDE9] flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  >
                    <RefreshCw className={`w-4 h-4 ${isCapturing ? 'animate-spin' : ''}`} strokeWidth={2.65} />
                    Capture Again
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="px-5 py-2 rounded-xl bg-[#355C4B] hover:bg-[#29473A] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(53,92,75,0.3)] cursor-pointer transition-all"
                  >
                    Use This Screenshot
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-2 px-2 space-y-1.5">
                <h3 className="text-sm font-bold text-[#303B38]">
                  How DeskSense uses your screen
                </h3>
                <p className="text-xs text-[#727A75] max-w-md mx-auto leading-relaxed">
                  When you ask a question like <em>"How do I download this picture?"</em>, seeing your screen allows DeskSense to point to the exact menu or button on your screen without guessing.
                </p>
              </div>

              {/* Main Capture Button Box */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#A9C9AD] bg-[#F4F4F1] rounded-2xl p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#DDEBDD] text-[#355C4B] flex items-center justify-center border border-[#A9C9AD] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_5px_rgba(53,92,75,0.12)]">
                  <Camera className="w-7 h-7" strokeWidth={2.7} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#303B38]">
                    Capture Window or Screen
                  </h4>
                  <p className="text-xs text-[#727A75]">
                    Your browser will prompt which window or screen you wish to share.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartBrowserCapture}
                  disabled={isCapturing}
                  className="px-5 py-2.5 rounded-xl bg-[#355C4B] hover:bg-[#29473A] text-white text-xs sm:text-sm font-bold transition-all shadow-[0_3px_10px_rgba(53,92,75,0.25)] flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Camera className="w-4.5 h-4.5" strokeWidth={2.65} />
                  <span>{isCapturing ? 'Waiting for Selection...' : 'Capture Screen Now'}</span>
                </button>
              </div>

              {/* Alternative methods: Paste / Upload */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="grow border-t border-[#E2E4DF]" />
                  <span className="shrink mx-3 text-[11px] text-[#727A75] font-bold uppercase tracking-wider">
                    Or alternative methods
                  </span>
                  <div className="grow border-t border-[#E2E4DF]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {/* Paste Box */}
                  <div className="p-3 border border-[#E2E4DF] rounded-xl bg-[#FFFFFF] flex items-center gap-3 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-[#E8E2F1] text-[#65517E] flex items-center justify-center shrink-0 border border-[#C8BFD8] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_4px_rgba(101,81,126,0.1)]">
                      <Clipboard className="w-5 h-5" strokeWidth={2.7} />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-[#303B38]">
                        Paste Clipboard (Ctrl + V)
                      </p>
                      <p className="text-[#727A75] text-[11px]">
                        Press Win+Shift+S, then Ctrl+V here.
                      </p>
                    </div>
                  </div>

                  {/* Upload Image File */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 border border-[#E2E4DF] rounded-xl bg-[#FFFFFF] flex items-center gap-3 cursor-pointer hover:bg-[#ECEDE9] transition-colors shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F4E3D6] text-[#303B38] flex items-center justify-center shrink-0 border border-[#E4CCBC] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_2px_4px_rgba(48,59,56,0.08)]">
                      <Upload className="w-5 h-5" strokeWidth={2.7} />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-[#303B38]">
                        Upload Screenshot File
                      </p>
                      <p className="text-[#727A75] text-[11px]">
                        Select a .PNG or .JPG image file.
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
        <div className="px-6 py-3 border-t border-[#E2E4DF] bg-[#F4F4F1] flex items-center justify-between text-xs">
          <span className="text-[#727A75] font-medium">
            DeskSense Privacy Guarantee
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-[#303B38] hover:bg-[#ECEDE9] transition-colors cursor-pointer font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Sparkles, Flame, Zap, Check, HelpCircle, BarChart3 } from 'lucide-react';
import { ImageAnalysisData } from '../types/meme';

interface ImageAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ImageAnalysisData | null;
  isLoading: boolean;
  onApplyAngle?: (angle: string) => void;
}

export const ImageAnalysisModal: React.FC<ImageAnalysisModalProps> = ({
  isOpen,
  onClose,
  data,
  isLoading,
  onApplyAngle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900/30 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
              <Flame className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Image Roast & Analysis</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-xs text-slate-400">Deep visual inspection & meme potential breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-300 font-medium">Deconstructing image humor dynamics...</p>
            </div>
          ) : data ? (
            <>
              {/* Viral Score Gauge */}
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block">
                    Viral Meme Potential
                  </span>
                  <div className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                    {data.memePotentialScore}/100
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {data.vibeCategory || 'High Impact'}
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-purple-500 flex items-center justify-center font-black text-lg text-amber-300 shadow-inner">
                  🔥
                </div>
              </div>

              {/* The Roast */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  AI Roast:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{data.roast}"
                </p>
              </div>

              {/* Visual Breakdown */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Visual Subject:
                </span>
                <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                  {data.visualSubject}
                </p>
              </div>

              {/* Suggested Meme Angles */}
              {data.suggestedAngles && data.suggestedAngles.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Recommended Meme Angles:
                  </span>
                  <div className="space-y-1.5">
                    {data.suggestedAngles.map((angle, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-300 flex items-center justify-between gap-2"
                      >
                        <span>👉 {angle}</span>
                        {onApplyAngle && (
                          <button
                            onClick={() => {
                              onApplyAngle(angle);
                              onClose();
                            }}
                            className="px-2 py-1 rounded bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white text-[10px] font-semibold transition shrink-0"
                          >
                            Use Theme
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No analysis data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

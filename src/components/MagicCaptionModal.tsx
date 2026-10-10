import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check, ArrowRight, Zap, Flame, Smile, Laptop, HelpCircle, Layers } from 'lucide-react';
import { MagicCaptionItem } from '../types/meme';

interface MagicCaptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  captions: MagicCaptionItem[];
  imageAnalysis: string;
  isLoading: boolean;
  onFetchCaptions: (vibe: string, customPrompt: string) => Promise<void>;
  onApplyCaption: (caption: MagicCaptionItem, targetMode: 'split' | 'single' | 'header') => void;
}

const VIBE_PRESETS = [
  { id: 'sarcastic', label: 'Sarcastic & Savage', icon: Flame, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { id: 'relatable', label: 'Hyper-Relatable', icon: Smile, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { id: 'tech', label: 'Tech & Work Pain', icon: Laptop, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  { id: 'unhinged', label: 'Unhinged / Brainrot', icon: Zap, color: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10' },
  { id: 'classic', label: 'Classic Setup/Punchline', icon: Layers, color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' },
];

export const MagicCaptionModal: React.FC<MagicCaptionModalProps> = ({
  isOpen,
  onClose,
  captions,
  imageAnalysis,
  isLoading,
  onFetchCaptions,
  onApplyCaption,
}) => {
  const [selectedVibe, setSelectedVibe] = useState('sarcastic');
  const [customPrompt, setCustomPrompt] = useState('');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = (caption: MagicCaptionItem, mode: 'split' | 'single' | 'header') => {
    onApplyCaption(caption, mode);
    setAppliedId(caption.id);
    setTimeout(() => {
      setAppliedId(null);
    }, 1200);
  };

  const handleRefresh = () => {
    onFetchCaptions(selectedVibe, customPrompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/50 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900/30 via-slate-900 to-indigo-900/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">Magic Caption AI</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-xs text-slate-400">Contextual image understanding & viral humor engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Vibe selection bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Humor Tone & Vibe:
            </label>
            <div className="flex flex-wrap gap-2">
              {VIBE_PRESETS.map((vibe) => {
                const Icon = vibe.icon;
                const isSelected = selectedVibe === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? `${vibe.color} shadow-sm ring-1 ring-white/20 font-bold scale-102`
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {vibe.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom angle input & Generate button */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Custom theme (e.g., 'Software engineer on Friday at 4:59 PM', 'Cat judging me')..."
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRefresh();
              }}
            />
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Analyzing...' : 'Generate 5 Captions'}
            </button>
          </div>

          {/* Image context insight from AI */}
          {imageAnalysis && (
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-purple-300">Visual Context Analysis: </span>
                {imageAnalysis}
              </div>
            </div>
          )}

          {/* Captions list */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <Sparkles className="w-5 h-5 text-purple-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <p className="text-sm font-medium text-slate-300">Turbo AI is analyzing image expressions & context...</p>
              <p className="text-xs text-purple-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                Optimized sub-second multimodal stream...
              </p>
            </div>
          ) : captions.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Click any caption to overlay instantly:
                </span>
                <span className="text-xs text-slate-500">5 Contextual suggestions</span>
              </div>

              {captions.map((cap, idx) => {
                const isJustApplied = appliedId === cap.id;
                return (
                  <div
                    key={cap.id || idx}
                    className="group relative p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 hover:border-purple-500/50 transition-all shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {cap.tag || `Angle ${idx + 1}`}
                      </span>
                      {cap.explanation && (
                        <span className="text-[11px] text-slate-400 italic truncate max-w-[280px]">
                          💡 {cap.explanation}
                        </span>
                      )}
                    </div>

                    {/* Caption Preview Box */}
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      {cap.topText && cap.bottomText ? (
                        <div className="space-y-1">
                          <div className="text-xs font-black uppercase text-amber-300 font-impact tracking-wider">
                            [TOP]: {cap.topText}
                          </div>
                          <div className="text-xs font-black uppercase text-white font-impact tracking-wider">
                            [BOTTOM]: {cap.bottomText}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-white font-sans">
                          "{cap.text}"
                        </div>
                      )}
                    </div>

                    {/* Action Overlay Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-slate-400">
                        Overlay format:
                      </div>
                      <div className="flex items-center gap-1.5">
                        {cap.topText && cap.bottomText ? (
                          <button
                            onClick={() => handleApply(cap, 'split')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isJustApplied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                            }`}
                          >
                            {isJustApplied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                            {isJustApplied ? 'Applied!' : 'Overlay Top/Bottom'}
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleApply(cap, 'header')}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
                            >
                              As Header Banner
                            </button>
                            <button
                              onClick={() => handleApply(cap, 'single')}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                isJustApplied
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                              }`}
                            >
                              {isJustApplied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                              {isJustApplied ? 'Applied!' : 'Overlay Text'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-medium text-slate-400">Ready to analyze this image</p>
              <p className="text-xs text-slate-500">Click "Generate 5 Captions" above to inspect context and expressions.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            AI analyzes facial expressions, posture, and comedic tension.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Wand2, ImagePlus, RefreshCw, Check, ArrowRight, Palette, Sliders, Crown } from 'lucide-react';
import { usePro } from '../context/ProContext';

interface AiImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageSrc: string;
  onSelectGeneratedImage: (newImageSrc: string) => void;
}

const MEME_PROMPT_INSPIRATIONS = [
  'A corporate cat in a suit having an existential crisis during a Zoom meeting',
  'A dog wearing sunglasses pretending to understand cryptocurrency charts',
  'Medieval painting of a peasant discovering JavaScript console errors',
  'A programmer holding coffee staring in absolute disbelief at a flying bug',
  'A hamster dressed as an astronaut dramatically looking back at Earth',
  'Dramatic explosion in the background of a toddler eating ice cream peacefully',
];

const EDIT_PROMPT_INSPIRATIONS = [
  'Add glowing red laser eyes',
  'Put a silly party hat with confetti',
  'Add dramatic cartoon fire and flames in the background',
  'Turn the art style into retro 90s pixel comic',
  'Add an oversized golden winner trophy',
];

export const AiImageStudioModal: React.FC<AiImageStudioModalProps> = ({
  isOpen,
  onClose,
  currentImageSrc,
  onSelectGeneratedImage,
}) => {
  const { isPro, credits, useCredit, openProModal } = usePro();
  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '16:9'>('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!generatePrompt.trim()) return;

    if (!useCredit()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setPreviewResult(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: generatePrompt,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setPreviewResult(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Image generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editPrompt.trim() || !currentImageSrc) return;

    if (!useCredit()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setPreviewResult(null);

    try {
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: currentImageSrc,
          prompt: editPrompt,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error || 'Failed to edit image');
      }

      setPreviewResult(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Image editing failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseImage = () => {
    if (previewResult) {
      onSelectGeneratedImage(previewResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/50 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-900/30 via-slate-900 to-purple-900/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 text-white shadow-lg shadow-indigo-600/30">
              <Wand2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">AI Image Studio</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  gemini-image
                </span>
                {isPro ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    PRO Unlimited
                  </span>
                ) : (
                  <button
                    onClick={openProModal}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold hover:border-purple-400 transition"
                  >
                    {credits} Free Credits • Get PRO
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400">Generate original meme bases or edit existing photos with AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => {
              setActiveTab('generate');
              setPreviewResult(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'generate'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImagePlus className="w-4 h-4" />
            Generate New Meme Base
          </button>
          <button
            onClick={() => {
              setActiveTab('edit');
              setPreviewResult(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'edit'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            Edit Current Image with Text
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab === 'generate' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Describe the Meme Image you want to create:
                </label>
                <textarea
                  value={generatePrompt}
                  onChange={(e) => setGeneratePrompt(e.target.value)}
                  rows={3}
                  placeholder="e.g. A cat wearing business glasses giving a PowerPoint presentation about why walks should be doubled..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Aspect Ratio picker */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400">Aspect Ratio:</span>
                {(['1:1', '4:3', '16:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                      aspectRatio === ratio
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ratio === '1:1' ? '1:1 (Square)' : ratio === '4:3' ? '4:3 (Classic)' : '16:9 (Wide)'}
                  </button>
                ))}
              </div>

              {/* Inspiration pills */}
              <div>
                <span className="text-xs text-slate-500 block mb-1.5">Meme Prompt Ideas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {MEME_PROMPT_INSPIRATIONS.map((idea, i) => (
                    <button
                      key={i}
                      onClick={() => setGeneratePrompt(idea)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition text-left"
                    >
                      💡 {idea}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !generatePrompt.trim()}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating with gemini-nano-banana-2.1...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Meme Image
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  How should AI modify the current image?
                </label>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  rows={3}
                  placeholder="e.g. Add glowing red laser eyes to the character, and add fire in background..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Inspiration pills */}
              <div>
                <span className="text-xs text-slate-500 block mb-1.5">Edit Ideas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {EDIT_PROMPT_INSPIRATIONS.map((idea, i) => (
                    <button
                      key={i}
                      onClick={() => setEditPrompt(idea)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
                    >
                      ⚡ {idea}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleEdit}
                disabled={isLoading || !editPrompt.trim()}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Modifying image with gemini-nano-banana-2.1...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Apply AI Image Edit
                  </>
                )}
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Result preview */}
          {previewResult && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-300">Generated Result:</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> High-Resolution Ready
                </span>
              </div>
              <div className="flex justify-center bg-black/40 rounded-lg p-2 max-h-64 overflow-hidden">
                <img
                  src={previewResult}
                  alt="Generated Meme Base"
                  className="max-h-60 rounded object-contain"
                />
              </div>
              <button
                onClick={handleUseImage}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
              >
                <Check className="w-4 h-4" />
                Use this as Meme Canvas Image
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">Powered by Gemini multimodal image generation</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Copy, Check, ExternalLink, Download, Sparkles, MessageSquare } from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  memeTitle: string;
  captionText?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  memeTitle,
  captionText = '',
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareText = encodeURIComponent(
    `${captionText || memeTitle || 'Created this meme with AI'} #memes #MemeGenAI`
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    } catch (e) {
      console.error('Failed to copy image to clipboard:', e);
      // Fallback: download
      handleDownload();
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `meme-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Social sharing links
  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareReddit = () => {
    window.open(`https://www.reddit.com/submit?title=${encodeURIComponent(memeTitle || 'AI Meme')}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'meme.png', { type: 'image/png' });
        await navigator.share({
          title: memeTitle || 'AI Meme',
          text: captionText || 'Check out this meme created with MemeGen AI!',
          files: [file],
        });
      } catch (e) {
        console.warn('Native share error or dismissed:', e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Share Your Viral Meme</h3>
              <p className="text-xs text-slate-400">One-tap sharing to all major social platforms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Meme preview thumbnail */}
        <div className="p-4 sm:p-6 space-y-5">
          <div className="flex justify-center bg-slate-950 rounded-xl p-2 max-h-52 overflow-hidden border border-slate-800">
            <img src={imageUrl} alt="Meme Preview" className="max-h-48 rounded object-contain" />
          </div>

          {/* Social buttons grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Share directly to:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Twitter / X */}
              <button
                onClick={shareTwitter}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 transition group hover:border-sky-500/50"
              >
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                  <Twitter className="w-5 h-5 text-sky-400 fill-sky-400" />
                </div>
                <span className="text-xs font-semibold">Twitter / X</span>
              </button>

              {/* Reddit */}
              <button
                onClick={shareReddit}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 transition group hover:border-orange-500/50"
              >
                <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold">Reddit</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareFacebook}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 transition group hover:border-blue-500/50"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold">Facebook</span>
              </button>

              {/* Instagram / Copy */}
              <button
                onClick={handleCopyImage}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 transition group hover:border-pink-500/50"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                  <Copy className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold">Instagram</span>
              </button>
            </div>
          </div>

          {/* Quick copy options */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <button
              onClick={handleCopyImage}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition"
            >
              {copiedImage ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copiedImage ? 'Copied Image to Clipboard!' : 'Copy Meme Image (Paste anywhere)'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5" />}
                {copiedLink ? 'Link Copied!' : 'Copy Web Link'}
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download PNG
              </button>
            </div>

            {'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2 text-xs text-purple-400 hover:text-purple-300 font-medium text-center transition"
              >
                Open System Share Sheet...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

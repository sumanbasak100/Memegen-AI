import React, { useState } from 'react';
import { Crown, Zap, Sparkles, Check, Flame, ShieldCheck, CreditCard, RefreshCw, X, Gift, Star } from 'lucide-react';
import { usePro } from '../context/ProContext';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ isOpen, onClose }) => {
  const { isPro, proPlan, credits, upgradeToPro, buyCredits, restorePurchases } = usePro();
  const [selectedTier, setSelectedTier] = useState<'monthly' | 'lifetime' | 'credits'>('lifetime');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate lightning-fast checkout flow
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (selectedTier === 'credits') {
      await buyCredits(100);
    } else {
      await upgradeToPro(selectedTier);
    }

    setIsProcessing(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const handleRestore = async () => {
    setIsProcessing(true);
    const restored = await restorePurchases();
    setIsProcessing(false);
    if (restored) {
      setRestoreMessage('Your PRO subscription has been restored!');
    } else {
      setRestoreMessage('No prior purchase found. You can unlock PRO below.');
    }
    setTimeout(() => setRestoreMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl shadow-amber-950/40 overflow-hidden">
        {/* Glow Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 bg-gradient-to-b from-amber-500/15 via-purple-900/15 to-transparent relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
              <Crown className="w-6 h-6 text-white animate-bounce-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wide">MemeGen PRO Pass</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold uppercase tracking-wider">
                  VIP Club
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Unlock lightning-fast Turbo AI & Unlimited Meme Generations
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Free vs Pro Transparency Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-start gap-2.5 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-200">100% Free Core App: </span>
              All templates, custom canvas editor, fonts, text layers, stickers, downloads, and social sharing remain completely FREE forever! PRO is an optional superpower for heavy AI creators.
            </div>
          </div>

          {/* Perks Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Exclusive PRO Superpowers:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-200">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">Sub-Second Turbo AI</strong> context analysis</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-200">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong className="text-white">Unlimited AI Image Gen</strong> & Style Edits</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-200">
                <Flame className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong className="text-white">Deep Comedic Roast</strong> & viral radar</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-slate-200">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">VIP Badges</strong> & 4K Ultra Canvas Export</span>
              </div>
            </div>
          </div>

          {/* Plan Selector */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Choose Your Plan:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Lifetime Pass */}
              <div
                onClick={() => setSelectedTier('lifetime')}
                className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedTier === 'lifetime'
                    ? 'bg-amber-500/10 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                  Best Value 70% Off
                </div>
                <div className="text-xs font-bold text-amber-400">Meme God Lifetime</div>
                <div className="text-xl font-black text-white mt-1">$29.99</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Pay once, own forever</div>
              </div>

              {/* Monthly Pass */}
              <div
                onClick={() => setSelectedTier('monthly')}
                className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedTier === 'monthly'
                    ? 'bg-purple-500/10 border-purple-400 shadow-md ring-1 ring-purple-400/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-purple-400">Meme Lord Monthly</div>
                <div className="text-xl font-black text-white mt-1">
                  $4.99<span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Cancel anytime</div>
              </div>

              {/* Credits Booster */}
              <div
                onClick={() => setSelectedTier('credits')}
                className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedTier === 'credits'
                    ? 'bg-indigo-500/10 border-indigo-400 shadow-md ring-1 ring-indigo-400/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-indigo-400">100 AI Credits</div>
                <div className="text-xl font-black text-white mt-1">$1.99</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Never expire</div>
              </div>
            </div>
          </div>

          {restoreMessage && (
            <div className="p-2.5 rounded-xl bg-slate-800 text-center text-xs text-amber-300">
              {restoreMessage}
            </div>
          )}

          {/* Action Button */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleCheckout}
              disabled={isProcessing || isPro}
              className={`w-full py-3 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition transform active:scale-98 ${
                isPro
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 shadow-amber-500/25'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  Activating Your PRO Pass...
                </>
              ) : isSuccess || isPro ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  PRO Pass Active! Enjoy Unlimited AI
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 fill-slate-950" />
                  Unlock PRO Now (Instant Simulation)
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
              <span>Instant sandbox checkout • No credit card needed</span>
              <button
                onClick={handleRestore}
                className="text-amber-400 hover:underline"
              >
                Restore Purchases
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

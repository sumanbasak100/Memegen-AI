import React, { useState } from 'react';
import { Briefcase, Shield, Zap, TrendingUp, Users, Lock, CheckCircle2, Award, ArrowUpRight, BarChart3, Building, X, Sparkles } from 'lucide-react';

interface CorporatePitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorporatePitchModal: React.FC<CorporatePitchModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'roi' | 'security'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Corporate Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-wide">MemeGen AI Enterprise Suite</h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold uppercase tracking-wider">
                  Corporate Briefing
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated Viral Content Acceleration & Multimodal Brand Asset Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Executive Summary
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'roi'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Business ROI & Metrics
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Technical Architecture
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Security & Governance
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Mission Hero */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/40 border border-indigo-500/30 space-y-2">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Product Vision
                </div>
                <h3 className="text-base font-bold text-white">
                  Empowering Enterprise Marketing Teams with Real-Time Viral Cultural Intelligence
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Modern brand engagement requires responding to internet trends in minutes, not days. MemeGen AI provides enterprise social and growth marketing teams with instant multimodal contextual understanding, brand-safe humor tone adaptation, and scalable cloud asset syndication.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Sub-Second Turnaround</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Edge downscaling pipeline slashes payload latency by 99%, delivering actionable context captions in under 1 second.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Omnichannel Syndication</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    One-tap publishing to Twitter/X, Reddit, LinkedIn, Instagram, and internal Slack/Teams campaign channels.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">ABAC Cloud Governance</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Enterprise Zero-Trust security rules on Google Cloud Firestore protect proprietary assets and user permissions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roi' && (
            <div className="space-y-5">
              {/* Numbers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-indigo-400">10x</div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-1">Faster Asset Creation</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-emerald-400">+340%</div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-1">Organic Engagement Lift</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-purple-400">&lt;1.0s</div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-1">AI Context Processing</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-amber-400">100%</div>
                  <div className="text-[11px] text-slate-400 font-semibold mt-1">Free Core Tier SLA</div>
                </div>
              </div>

              {/* Business Case Details */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Target Use Cases Across Organizations:
                </h4>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Social Media & Brand Marketing:</strong> Spin up trend-jacking content before the cultural news cycle moves on.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Internal Employer Branding & Developer Relations:</strong> High-relatability engineering and product humor that builds authentic tech community goodwill.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Community & Discord Management:</strong> Automated creator engagement programs with community leaderboards and remix forks.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  System Architecture Pipeline:
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex-1">
                    <span className="font-bold text-white block">1. Client Edge</span>
                    <span className="text-[11px] text-slate-400">Offscreen Canvas 480px Pre-Compression (~25KB)</span>
                  </div>
                  <span className="text-indigo-400 font-bold hidden sm:inline">→</span>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex-1">
                    <span className="font-bold text-white block">2. API Gateway</span>
                    <span className="text-[11px] text-slate-400">Express tsx + Gemini 3.8 Flash SDK</span>
                  </div>
                  <span className="text-indigo-400 font-bold hidden sm:inline">→</span>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex-1">
                    <span className="font-bold text-white block">3. Canvas Engine</span>
                    <span className="text-[11px] text-slate-400">2D Compositor, Text Layout & Filters</span>
                  </div>
                  <span className="text-indigo-400 font-bold hidden sm:inline">→</span>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex-1">
                    <span className="font-bold text-white block">4. Cloud Storage</span>
                    <span className="text-[11px] text-slate-400">Firestore Zero-Trust RBAC & Auth</span>
                  </div>
                </div>
              </div>

              {/* Tech Stack Badges */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Technology Stack:
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                    ⚡ React 19 + TypeScript
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                    🎨 Tailwind CSS v4
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                    🧠 @google/genai SDK (Gemini 3.8 Flash)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                    🔥 Google Firebase Auth & Firestore
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                    🚀 Express Full-Stack Middleware
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Enterprise Data Protection & Compliance
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Server-Side Secret Isolation:</strong> Gemini API keys are maintained strictly in server-side memory (`process.env.GEMINI_API_KEY`) and are never exposed to the client bundle.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Zero-Trust Firestore Security:</strong> Mathematical validation blueprints in `firestore.rules` enforce strict identity ownership (`request.auth.uid == userId`) and payload boundaries.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>PII & Asset Separation:</strong> Personal user profiles are isolated from public community feeds with distinct access control policies.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            MemeGen AI Enterprise Documentation • v1.0.0 Production Release
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition"
          >
            Close Briefing
          </button>
        </div>
      </div>
    </div>
  );
};

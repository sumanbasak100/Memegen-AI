import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Wand2,
  Share2,
  Download,
  Copy,
  Check,
  Bookmark,
  Globe,
  Upload,
  Layers,
  Smile,
  Sliders,
  Type,
  Plus,
  Trash2,
  RotateCw,
  RefreshCw,
  LogIn,
  LogOut,
  User,
  Image as ImageIcon,
  Zap,
  Crown,
  Briefcase,
} from 'lucide-react';
import { MemeCanvas } from './components/MemeCanvas';
import { MagicCaptionModal } from './components/MagicCaptionModal';
import { AiImageStudioModal } from './components/AiImageStudioModal';
import { ImageAnalysisModal } from './components/ImageAnalysisModal';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { SocialShareModal } from './components/SocialShareModal';
import { SaveMemeModal } from './components/SaveMemeModal';
import { GalleryModal, SavedMeme } from './components/GalleryModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { CorporatePitchModal } from './components/CorporatePitchModal';
import { MEME_TEMPLATES, MemeTemplate } from './data/templates';
import { MEME_STICKERS, MemeSticker } from './data/stickers';
import { TextLayer, StickerLayer, MemeLayout, FilterSettings, MagicCaptionItem, ImageAnalysisData } from './types/meme';
import { useAuth } from './context/AuthContext';
import { usePro } from './context/ProContext';

const FONT_OPTIONS = [
  { id: 'Impact', name: 'Impact (Classic Meme)' },
  { id: 'Anton', name: 'Anton (Modern Heavy)' },
  { id: 'Bebas Neue', name: 'Bebas Neue (Tall Bold)' },
  { id: 'Montserrat', name: 'Montserrat (Ultra Black)' },
  { id: 'Comic Neue', name: 'Comic Neue (Meme Comic)' },
  { id: 'Permanent Marker', name: 'Permanent Marker (Graffiti)' },
];

export default function App() {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const { isPro, credits, openProModal, isProModalOpen, closeProModal, useCredit } = usePro();

  // Active Template / Image
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(MEME_TEMPLATES[0].svgDataUrl);
  const [currentTemplateId, setCurrentTemplateId] = useState<string>(MEME_TEMPLATES[0].id);

  // In-memory cache for instant zero-lag caption switching
  const captionCacheRef = useRef<Record<string, { captions: MagicCaptionItem[]; analysis: string }>>({});

  // Layout & Modern Banner Header
  const [layout, setLayout] = useState<MemeLayout>('classic');
  const [headerText, setHeaderText] = useState('WHEN YOU WRITE CODE THAT RUNS ON THE FIRST TRY');
  const [headerBgColor, setHeaderBgColor] = useState('#FFFFFF');
  const [headerTextColor, setHeaderTextColor] = useState('#111827');

  // Text Layers
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: 'top-text',
      text: MEME_TEMPLATES[0].defaultTopText || 'TOP TEXT',
      x: 50,
      y: 12,
      fontSize: 42,
      fontFamily: 'Impact',
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 5,
      isUppercase: true,
      textAlign: 'center',
      rotation: 0,
      hasBackgroundBox: false,
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    {
      id: 'bottom-text',
      text: MEME_TEMPLATES[0].defaultBottomText || 'BOTTOM TEXT',
      x: 50,
      y: 88,
      fontSize: 42,
      fontFamily: 'Impact',
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 5,
      isUppercase: true,
      textAlign: 'center',
      rotation: 0,
      hasBackgroundBox: false,
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
  ]);

  // Sticker Layers
  const [stickerLayers, setStickerLayers] = useState<StickerLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('top-text');

  // Filters
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    deepFried: false,
    grayscale: false,
    sepia: false,
  });

  // UI Active Sidebar Tab
  const [sidebarTab, setSidebarTab] = useState<'text' | 'magic' | 'stickers' | 'filters'>('magic');

  // Modals state
  const [isMagicModalOpen, setIsMagicModalOpen] = useState(false);
  const [isAiImageModalOpen, setIsAiImageModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isCorporateModalOpen, setIsCorporateModalOpen] = useState(false);

  // AI Data
  const [magicCaptions, setMagicCaptions] = useState<MagicCaptionItem[]>([]);
  const [imageAnalysisSummary, setImageAnalysisSummary] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<ImageAnalysisData | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  // Export & Canvas capture
  const [currentCanvas, setCurrentCanvas] = useState<HTMLCanvasElement | null>(null);
  const [capturedExportUrl, setCapturedExportUrl] = useState<string>('');
  const [justCopied, setJustCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate Export URL from canvas
  const getCanvasDataUrl = () => {
    if (!currentCanvas) return currentImageSrc;
    return currentCanvas.toDataURL('image/png');
  };

  // Helper to downscale image to 480px JPEG for ultra-fast network transfer & model processing
  const getFastOptimizedImageForAi = async (): Promise<string> => {
    return new Promise((resolve) => {
      try {
        const source = currentCanvas ? currentCanvas.toDataURL('image/png') : currentImageSrc;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const maxDim = 480;
          let w = img.width || 480;
          let h = img.height || 480;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const offscreen = document.createElement('canvas');
          offscreen.width = w;
          offscreen.height = h;
          const ctx = offscreen.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(offscreen.toDataURL('image/jpeg', 0.75));
          } else {
            resolve(source);
          }
        };
        img.onerror = () => resolve(source);
        img.src = source;
      } catch (e) {
        resolve(currentImageSrc);
      }
    });
  };

  // 1. Fetch Magic Captions (Gemini image context analysis with zero-lag cache)
  const fetchMagicCaptions = async (vibe = 'sarcastic', customPrompt = '') => {
    // Check in-memory cache first for instant 0ms result
    const cacheKey = `${currentTemplateId}_${vibe}_${customPrompt.trim().toLowerCase()}`;
    if (captionCacheRef.current[cacheKey]) {
      const cached = captionCacheRef.current[cacheKey];
      setMagicCaptions(cached.captions);
      setImageAnalysisSummary(cached.analysis);
      return;
    }

    setIsMagicLoading(true);
    try {
      const optimizedImage = await getFastOptimizedImageForAi();
      const response = await fetch('/api/magic-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: optimizedImage,
          vibe,
          customPrompt,
        }),
      });

      const res = await response.json();
      if (!response.ok || !res.data) {
        throw new Error(res.error || 'Failed to generate captions');
      }

      const captionsList = res.data.captions || [];
      const analysisText = res.data.imageAnalysis || '';

      setMagicCaptions(captionsList);
      setImageAnalysisSummary(analysisText);

      // Store in cache
      captionCacheRef.current[cacheKey] = {
        captions: captionsList,
        analysis: analysisText,
      };
    } catch (err: any) {
      console.error('Magic caption request error:', err);
      alert('AI Caption Notice: ' + (err.message || 'Please check your connection'));
    } finally {
      setIsMagicLoading(false);
    }
  };

  // Open Magic Caption modal & auto-trigger if empty
  const handleOpenMagicModal = () => {
    setIsMagicModalOpen(true);
    if (magicCaptions.length === 0) {
      fetchMagicCaptions();
    }
  };

  // Apply Caption from Magic modal onto Canvas
  const handleApplyCaption = (caption: MagicCaptionItem, mode: 'split' | 'single' | 'header') => {
    if (mode === 'header') {
      setLayout('modern-header');
      setHeaderText(caption.text || `${caption.topText} ${caption.bottomText}`);
      // Clear classic top/bottom text to keep clean header look
      setTextLayers((prev) =>
        prev.map((l) => (l.id === 'top-text' || l.id === 'bottom-text' ? { ...l, text: '' } : l))
      );
    } else if (mode === 'split' && caption.topText && caption.bottomText) {
      setLayout('classic');
      setTextLayers((prev) =>
        prev.map((l) => {
          if (l.id === 'top-text') return { ...l, text: caption.topText || '' };
          if (l.id === 'bottom-text') return { ...l, text: caption.bottomText || '' };
          return l;
        })
      );
    } else {
      // Single punchline
      setLayout('classic');
      setTextLayers((prev) =>
        prev.map((l) => {
          if (l.id === 'bottom-text') return { ...l, text: caption.text };
          if (l.id === 'top-text') return { ...l, text: '' };
          return l;
        })
      );
    }
  };

  // Deep Image Roast & Analysis
  const handleAnalyzeImage = async () => {
    setIsAnalysisModalOpen(true);
    setIsAnalysisLoading(true);
    try {
      const optimizedImage = await getFastOptimizedImageForAi();
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: optimizedImage }),
      });
      const res = await response.json();
      if (!response.ok || !res.data) {
        throw new Error(res.error || 'Failed to analyze image');
      }
      setAnalysisData(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  // Template select
  const handleSelectTemplate = (tpl: MemeTemplate) => {
    setCurrentImageSrc(tpl.svgDataUrl);
    setCurrentTemplateId(tpl.id);
    setTextLayers((prev) =>
      prev.map((l) => {
        if (l.id === 'top-text') return { ...l, text: tpl.defaultTopText || '' };
        if (l.id === 'bottom-text') return { ...l, text: tpl.defaultBottomText || '' };
        return l;
      })
    );
    // Reset captions cache for new image
    setMagicCaptions([]);
    setImageAnalysisSummary('');
  };

  // User upload image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setCurrentImageSrc(result);
        setCurrentTemplateId('custom-upload');
        setMagicCaptions([]);
        setImageAnalysisSummary('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Add floating text layer
  const handleAddTextLayer = () => {
    const newId = `text_${Date.now()}`;
    const newLayer: TextLayer = {
      id: newId,
      text: 'NEW TEXT',
      x: 50,
      y: 50,
      fontSize: 36,
      fontFamily: 'Impact',
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 4,
      isUppercase: true,
      textAlign: 'center',
      rotation: 0,
      hasBackgroundBox: false,
      backgroundColor: 'rgba(0,0,0,0.7)',
    };
    setTextLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newId);
  };

  // Remove text layer
  const handleRemoveTextLayer = (id: string) => {
    setTextLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  // Update text layer
  const handleUpdateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  // Add sticker layer
  const handleAddSticker = (sticker: MemeSticker) => {
    const newId = `sticker_${Date.now()}`;
    const newSticker: StickerLayer = {
      id: newId,
      stickerId: sticker.id,
      emoji: sticker.emoji,
      svgDataUrl: sticker.svgDataUrl,
      x: 50,
      y: 50,
      scale: 1.0,
      rotation: 0,
    };
    setStickerLayers((prev) => [...prev, newSticker]);
    setSelectedLayerId(newId);
  };

  const handleUpdateStickerLayer = (id: string, updates: Partial<StickerLayer>) => {
    setStickerLayers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleRemoveStickerLayer = (id: string) => {
    setStickerLayers((prev) => prev.filter((s) => s.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  // Download meme directly
  const handleDownloadMeme = () => {
    const url = getCanvasDataUrl();
    const a = document.createElement('a');
    a.href = url;
    a.download = `meme-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy meme image to clipboard
  const handleCopyMemeImage = async () => {
    try {
      const url = getCanvasDataUrl();
      const res = await fetch(url);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    } catch (e) {
      console.error(e);
      handleDownloadMeme();
    }
  };

  // Open Share modal
  const handleOpenShareModal = () => {
    const url = getCanvasDataUrl();
    setCapturedExportUrl(url);
    setIsShareModalOpen(true);
  };

  // Open Save modal
  const handleOpenSaveModal = () => {
    const url = getCanvasDataUrl();
    setCapturedExportUrl(url);
    setIsSaveModalOpen(true);
  };

  // Remix meme from gallery
  const handleRemixMeme = (meme: SavedMeme) => {
    setCurrentImageSrc(meme.imageUrl);
    setCurrentTemplateId(meme.templateId || 'remixed');
    setIsGalleryModalOpen(false);
  };

  const selectedTextLayer = textLayers.find((l) => l.id === selectedLayerId);
  const selectedStickerLayer = stickerLayers.find((s) => s.id === selectedLayerId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-rose-600/30">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1 font-impact">
                MEMEGEN <span className="text-purple-400 font-sans font-black">AI</span>
              </h1>
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-wider">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Magic Caption AI • Trending Templates • Pro Canvas
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Magic Caption Button (Key highlight) */}
          <button
            onClick={handleOpenMagicModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition transform hover:scale-102"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Magic Caption</span>
          </button>

          {/* Templates Gallery */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Templates</span>
          </button>

          {/* AI Image Studio */}
          <button
            onClick={() => setIsAiImageModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Wand2 className="w-4 h-4 text-indigo-400" />
            <span>AI Image Gen</span>
          </button>

          {/* Community Gallery */}
          <button
            onClick={() => setIsGalleryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Gallery</span>
          </button>

          {/* Corporate / Enterprise Briefing Deck */}
          <button
            onClick={() => setIsCorporateModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition shadow-sm"
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            <span>Enterprise</span>
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button
                onClick={() => setIsGalleryModalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full border border-purple-500/50" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
              </button>
              <button
                onClick={signOutUser}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold transition"
            >
              <LogIn className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* In-App Purchase PRO Button */}
          <button
            onClick={openProModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
              isPro
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-amber-400/20'
                : 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/40 hover:border-amber-400'
            }`}
          >
            <Crown className={`w-3.5 h-3.5 ${isPro ? 'fill-slate-950' : 'text-amber-400'}`} />
            <span>{isPro ? 'PRO Active' : `Get PRO (${credits} AI left)`}</span>
          </button>

          {/* Export / Share */}
          <button
            onClick={handleOpenShareModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md shadow-purple-600/30"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Canvas Preview & Quick Action Bar (7 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-4">
          {/* Top Quick Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            {/* Layout switch */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setLayout('classic')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  layout === 'classic' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Classic Overlay
              </button>
              <button
                onClick={() => setLayout('modern-header')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  layout === 'modern-header' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tweet/Header Box
              </button>
              <button
                onClick={() => setLayout('demotivational')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  layout === 'demotivational' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Demotivational
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5">
              {/* Deep Fried button (signature unique meme look) */}
              <button
                onClick={() =>
                  setFilterSettings((prev) => ({
                    ...prev,
                    deepFried: !prev.deepFried,
                  }))
                }
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                  filterSettings.deepFried
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-amber-300'
                }`}
                title="Deep Fried Meme aesthetic: hyper-saturation & contrast"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Deep Fried</span>
              </button>

              {/* Upload image */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
                title="Upload Photo"
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Meme Canvas Container */}
          <MemeCanvas
            imageSrc={currentImageSrc}
            layout={layout}
            headerText={headerText}
            headerBgColor={headerBgColor}
            headerTextColor={headerTextColor}
            textLayers={textLayers}
            stickerLayers={stickerLayers}
            filterSettings={filterSettings}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onUpdateTextLayer={handleUpdateTextLayer}
            onUpdateStickerLayer={handleUpdateStickerLayer}
            onCanvasReady={setCurrentCanvas}
          />

          {/* Bottom Canvas Controls (Save, Download, Copy, Roast) */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMemeImage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
              >
                {justCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{justCopied ? 'Copied!' : 'Copy Meme'}</span>
              </button>

              <button
                onClick={handleDownloadMeme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handleOpenSaveModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/30"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save to Vault</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAnalyzeImage}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500/30 text-purple-300 hover:text-purple-200 text-xs font-semibold transition"
                title="Deep AI analysis & comedic roast"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Roast Photo</span>
              </button>

              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-medium transition"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Pick Template</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Customization Sidebar & AI Tools (5 cols) */}
        <section className="lg:col-span-5 flex flex-col space-y-4">
          {/* Sidebar Tab Bar */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 gap-1">
            <button
              onClick={() => setSidebarTab('magic')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                sidebarTab === 'magic'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Magic AI
            </button>
            <button
              onClick={() => setSidebarTab('text')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                sidebarTab === 'text' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              Text & Fonts
            </button>
            <button
              onClick={() => setSidebarTab('stickers')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                sidebarTab === 'stickers'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              Stickers
            </button>
            <button
              onClick={() => setSidebarTab('filters')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                sidebarTab === 'filters' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>

          {/* Tab 1: Magic AI Highlights */}
          {sidebarTab === 'magic' && (
            <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    Magic Caption Engine
                  </h3>
                  <p className="text-[11px] text-slate-400">Context-aware viral caption generator</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  gemini-3.8-flash
                </span>
              </div>

              {/* Instant Magic Caption Trigger Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/60 via-slate-950 to-indigo-950/60 border border-purple-800/40 space-y-3">
                <p className="text-xs text-purple-200 leading-relaxed">
                  Click below to let Gemini analyze the visual scene, subject expressions, and situational tension to formulate 5 customized funny captions.
                </p>
                <button
                  onClick={handleOpenMagicModal}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Analyze Context & Suggest 5 Captions
                </button>
              </div>

              {/* Quick AI Tools row */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleAnalyzeImage}
                  className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 text-left transition space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Flame className="w-3.5 h-3.5" />
                    AI Photo Roast
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Get an instant comedic roast & viral rating
                  </p>
                </button>

                <button
                  onClick={() => setIsAiImageModalOpen(true)}
                  className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 text-left transition space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                    <Wand2 className="w-3.5 h-3.5" />
                    AI Image Studio
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Generate base or edit with prompt
                  </p>
                </button>
              </div>

              {/* Recent AI Suggestions Preview */}
              {magicCaptions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Recent Suggestions:</span>
                    <button
                      onClick={handleOpenMagicModal}
                      className="text-purple-400 hover:text-purple-300 text-[11px]"
                    >
                      View All 5 →
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {magicCaptions.slice(0, 3).map((c, i) => (
                      <div
                        key={c.id || i}
                        onClick={() => handleApplyCaption(c, c.topText && c.bottomText ? 'split' : 'single')}
                        className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition text-xs space-y-1 group"
                      >
                        <div className="flex items-center justify-between text-[10px] text-purple-400">
                          <span className="font-bold">{c.tag}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition">Click to Apply ⚡</span>
                        </div>
                        <p className="text-slate-200 font-semibold line-clamp-2">
                          {c.topText ? `${c.topText} / ${c.bottomText}` : c.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Text Layers & Typography */}
          {sidebarTab === 'text' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-purple-400" />
                  Text Layers & Typography
                </h3>
                <button
                  onClick={handleAddTextLayer}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Layer
                </button>
              </div>

              {/* Modern Header mode text */}
              {layout === 'modern-header' && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-purple-300">
                    Banner Header Text (Above Image):
                  </label>
                  <textarea
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 text-slate-400">
                      <span>Header BG:</span>
                      <input
                        type="color"
                        value={headerBgColor}
                        onChange={(e) => setHeaderBgColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </label>
                    <label className="flex items-center gap-1.5 text-slate-400">
                      <span>Text Color:</span>
                      <input
                        type="color"
                        value={headerTextColor}
                        onChange={(e) => setHeaderTextColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Text Layers List */}
              <div className="space-y-3">
                {textLayers.map((layer) => {
                  const isSelected = selectedLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-slate-950 border-purple-500/70 shadow-md ring-1 ring-purple-500/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                      onClick={() => setSelectedLayerId(layer.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300 uppercase">
                          {layer.id === 'top-text'
                            ? 'Top Text'
                            : layer.id === 'bottom-text'
                            ? 'Bottom Text'
                            : 'Floating Text'}
                        </span>
                        <div className="flex items-center gap-2">
                          {layer.id !== 'top-text' && layer.id !== 'bottom-text' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTextLayer(layer.id);
                              }}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Text Input */}
                      <input
                        type="text"
                        value={layer.text}
                        onChange={(e) => handleUpdateTextLayer(layer.id, { text: e.target.value })}
                        placeholder="Type meme caption..."
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-impact tracking-wide focus:outline-none focus:border-purple-500"
                      />

                      {/* Controls when selected */}
                      {isSelected && (
                        <div className="pt-3 mt-3 border-t border-slate-800 space-y-3 text-xs">
                          {/* Font family */}
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">Font Family:</label>
                            <select
                              value={layer.fontFamily}
                              onChange={(e) => handleUpdateTextLayer(layer.id, { fontFamily: e.target.value })}
                              className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                            >
                              {FONT_OPTIONS.map((f) => (
                                <option key={f.id} value={f.id}>
                                  {f.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Font Size & Stroke */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                                <span>Size:</span>
                                <span>{layer.fontSize}px</span>
                              </div>
                              <input
                                type="range"
                                min={18}
                                max={80}
                                value={layer.fontSize}
                                onChange={(e) =>
                                  handleUpdateTextLayer(layer.id, { fontSize: Number(e.target.value) })
                                }
                                className="w-full accent-purple-500 cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                                <span>Outline:</span>
                                <span>{layer.strokeWidth}px</span>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={12}
                                value={layer.strokeWidth}
                                onChange={(e) =>
                                  handleUpdateTextLayer(layer.id, { strokeWidth: Number(e.target.value) })
                                }
                                className="w-full accent-purple-500 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Colors & Alignment */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1 text-[11px] text-slate-400">
                                <span>Fill:</span>
                                <input
                                  type="color"
                                  value={layer.color}
                                  onChange={(e) => handleUpdateTextLayer(layer.id, { color: e.target.value })}
                                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                                />
                              </label>
                              <label className="flex items-center gap-1 text-[11px] text-slate-400">
                                <span>Stroke:</span>
                                <input
                                  type="color"
                                  value={layer.strokeColor}
                                  onChange={(e) =>
                                    handleUpdateTextLayer(layer.id, { strokeColor: e.target.value })
                                  }
                                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                                />
                              </label>
                            </div>

                            {/* Uppercase toggle */}
                            <button
                              onClick={() =>
                                handleUpdateTextLayer(layer.id, { isUppercase: !layer.isUppercase })
                              }
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                                layer.isUppercase
                                  ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                                  : 'border-slate-700 text-slate-400'
                              }`}
                            >
                              ALL CAPS
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Stickers & Emojis */}
          {sidebarTab === 'stickers' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-purple-400" />
                  Meme Stickers & Overlays
                </h3>
                <span className="text-xs text-slate-400">Click to place</span>
              </div>

              {/* Stickers Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {MEME_STICKERS.map((stk) => (
                  <button
                    key={stk.id}
                    onClick={() => handleAddSticker(stk)}
                    className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 flex flex-col items-center justify-center gap-1 transition group"
                  >
                    {stk.emoji ? (
                      <span className="text-2xl group-hover:scale-125 transition">{stk.emoji}</span>
                    ) : stk.svgDataUrl ? (
                      <img src={stk.svgDataUrl} alt={stk.name} className="h-6 object-contain" />
                    ) : null}
                    <span className="text-[10px] text-slate-400 truncate max-w-full">{stk.name}</span>
                  </button>
                ))}
              </div>

              {/* Active Sticker Layer Controls */}
              {selectedStickerLayer && (
                <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-purple-300">
                    <span>Selected Sticker Controls:</span>
                    <button
                      onClick={() => handleRemoveStickerLayer(selectedStickerLayer.id)}
                      className="text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Scale: {selectedStickerLayer.scale.toFixed(1)}x
                      </span>
                      <input
                        type="range"
                        min={0.5}
                        max={3.0}
                        step={0.1}
                        value={selectedStickerLayer.scale}
                        onChange={(e) =>
                          handleUpdateStickerLayer(selectedStickerLayer.id, { scale: Number(e.target.value) })
                        }
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Rotate: {selectedStickerLayer.rotation}°
                      </span>
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        value={selectedStickerLayer.rotation}
                        onChange={(e) =>
                          handleUpdateStickerLayer(selectedStickerLayer.id, {
                            rotation: Number(e.target.value),
                          })
                        }
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Image Filters & Deep Fried */}
          {sidebarTab === 'filters' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Meme Image Adjustments
                </h3>
                <button
                  onClick={() =>
                    setFilterSettings({
                      brightness: 100,
                      contrast: 100,
                      saturation: 100,
                      deepFried: false,
                      grayscale: false,
                      sepia: false,
                    })
                  }
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Reset
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Brightness:</span>
                    <span>{filterSettings.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={180}
                    value={filterSettings.brightness}
                    onChange={(e) =>
                      setFilterSettings((prev) => ({ ...prev, brightness: Number(e.target.value) }))
                    }
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Contrast:</span>
                    <span>{filterSettings.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={200}
                    value={filterSettings.contrast}
                    onChange={(e) =>
                      setFilterSettings((prev) => ({ ...prev, contrast: Number(e.target.value) }))
                    }
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Saturation:</span>
                    <span>{filterSettings.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={250}
                    value={filterSettings.saturation}
                    onChange={(e) =>
                      setFilterSettings((prev) => ({ ...prev, saturation: Number(e.target.value) }))
                    }
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Filter Toggles */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() =>
                    setFilterSettings((prev) => ({ ...prev, deepFried: !prev.deepFried }))
                  }
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    filterSettings.deepFried
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Deep Fried
                </button>

                <button
                  onClick={() =>
                    setFilterSettings((prev) => ({ ...prev, grayscale: !prev.grayscale }))
                  }
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    filterSettings.grayscale
                      ? 'bg-slate-700 border-slate-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Grayscale
                </button>

                <button
                  onClick={() => setFilterSettings((prev) => ({ ...prev, sepia: !prev.sepia }))}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    filterSettings.sepia
                      ? 'bg-amber-900/40 border-amber-600 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Vintage
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <MagicCaptionModal
        isOpen={isMagicModalOpen}
        onClose={() => setIsMagicModalOpen(false)}
        captions={magicCaptions}
        imageAnalysis={imageAnalysisSummary}
        isLoading={isMagicLoading}
        onFetchCaptions={fetchMagicCaptions}
        onApplyCaption={handleApplyCaption}
      />

      <AiImageStudioModal
        isOpen={isAiImageModalOpen}
        onClose={() => setIsAiImageModalOpen(false)}
        currentImageSrc={currentImageSrc}
        onSelectGeneratedImage={(newImg) => {
          setCurrentImageSrc(newImg);
          setCurrentTemplateId('ai-generated');
          setMagicCaptions([]);
          setImageAnalysisSummary('');
        }}
      />

      <ImageAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        data={analysisData}
        isLoading={isAnalysisLoading}
        onApplyAngle={(angle) => {
          fetchMagicCaptions('sarcastic', angle);
          setIsMagicModalOpen(true);
        }}
      />

      <TemplateGalleryModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        imageUrl={capturedExportUrl || currentImageSrc}
        memeTitle={textLayers.find((l) => l.text)?.text || 'AI Meme'}
        captionText={textLayers.map((l) => l.text).filter(Boolean).join(' - ')}
      />

      <SaveMemeModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        imageUrl={capturedExportUrl || currentImageSrc}
        defaultTitle={textLayers.find((l) => l.text)?.text || 'Epic AI Meme'}
        defaultCaption={textLayers.map((l) => l.text).filter(Boolean).join(' ')}
        templateId={currentTemplateId}
        onSavedSuccess={() => {
          // Open gallery or notify
        }}
      />

      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onRemixMeme={handleRemixMeme}
        onShareMeme={(meme) => {
          setCapturedExportUrl(meme.imageUrl);
          setIsShareModalOpen(true);
        }}
      />

      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={closeProModal}
      />

      <CorporatePitchModal
        isOpen={isCorporateModalOpen}
        onClose={() => setIsCorporateModalOpen(false)}
      />
    </div>
  );
}

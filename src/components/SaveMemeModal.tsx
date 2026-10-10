import React, { useState } from 'react';
import { Bookmark, Globe, Lock, Sparkles, Check, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface SaveMemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  defaultTitle?: string;
  defaultCaption?: string;
  templateId?: string;
  onSavedSuccess?: () => void;
}

export const SaveMemeModal: React.FC<SaveMemeModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  defaultTitle = '',
  defaultCaption = '',
  templateId = '',
  onSavedSuccess,
}) => {
  const { user, signInWithGoogle } = useAuth();
  const [title, setTitle] = useState(defaultTitle || 'My Epic Meme');
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState('trending, funny');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!user) {
      setErrorMsg('Please sign in to save memes to your personal vault.');
      return;
    }
    setIsSaving(true);
    setErrorMsg(null);

    const memeId = `meme_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const memeData = {
      id: memeId,
      userId: user.uid,
      userDisplayName: user.displayName || 'Anonymous Memer',
      userEmail: user.email || '',
      title: title.trim() || 'Untitled Meme',
      caption: defaultCaption.trim(),
      imageUrl: imageUrl,
      isPublic: isPublic,
      likesCount: 0,
      tags: tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      templateId: templateId || 'custom',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'memes', memeId), memeData);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        if (onSavedSuccess) onSavedSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Error saving meme:', err);
      handleFirestoreError(err, OperationType.CREATE, `memes/${memeId}`);
      setErrorMsg(err.message || 'Failed to save meme');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Save Meme to Cloud</h3>
              <p className="text-xs text-slate-400">Store in your personal vault & share publicly</p>
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
          {!user ? (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-white">Sign In to Save</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Connect your Google account to access your personal gallery from any device.
                </p>
              </div>
              <button
                onClick={signInWithGoogle}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                <LogIn className="w-4 h-4 text-indigo-600" />
                Sign In with Google
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Meme Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your meme a punchy title..."
                  className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="trending, tech, relatable..."
                  className="w-full px-3 py-2 text-sm bg-slate-950/80 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Public gallery toggle */}
              <div
                onClick={() => setIsPublic(!isPublic)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  isPublic
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isPublic ? <Globe className="w-4 h-4 text-indigo-400" /> : <Lock className="w-4 h-4 text-slate-400" />}
                  <div>
                    <div className="text-xs font-bold text-white">
                      {isPublic ? 'Showcase in Public Gallery' : 'Private (Only in My Vault)'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isPublic ? 'Others can discover, upvote, and remix your creation' : 'Hidden from community feed'}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isPublic ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-600'
                  }`}
                >
                  {isPublic && <Check className="w-3 h-3" />}
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" /> Saved Successfully!
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" /> Save Meme
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

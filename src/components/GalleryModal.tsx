import React, { useState, useEffect } from 'react';
import { Globe, User, Heart, Share2, Download, Trash2, Edit3, Sparkles, Flame, RefreshCw, Search, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, increment } from 'firebase/firestore';

export interface SavedMeme {
  id: string;
  userId: string;
  userDisplayName: string;
  userEmail?: string;
  title: string;
  caption?: string;
  imageUrl: string;
  isPublic: boolean;
  likesCount: number;
  tags?: string[];
  templateId?: string;
  createdAt: string;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemixMeme: (meme: SavedMeme) => void;
  onShareMeme: (meme: SavedMeme) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onRemixMeme,
  onShareMeme,
}) => {
  const { user, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'public' | 'my-vault'>('public');
  const [memes, setMemes] = useState<SavedMeme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedMemeIds, setLikedMemeIds] = useState<Set<string>>(new Set());

  // Load liked memes from localStorage to prevent spamming
  useEffect(() => {
    try {
      const stored = localStorage.getItem('memegen_liked_ids');
      if (stored) {
        setLikedMemeIds(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const fetchMemes = async () => {
    setIsLoading(true);
    try {
      let q;
      if (activeTab === 'public') {
        q = query(collection(db, 'memes'), where('isPublic', '==', true));
      } else {
        if (!user) {
          setMemes([]);
          setIsLoading(false);
          return;
        }
        q = query(collection(db, 'memes'), where('userId', '==', user.uid));
      }

      const snapshot = await getDocs(q);
      const list: SavedMeme[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as SavedMeme);
      });

      // Sort client-side by likes or newest
      list.sort((a, b) => {
        if (activeTab === 'public') {
          return (b.likesCount || 0) - (a.likesCount || 0);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setMemes(list);
    } catch (err: any) {
      console.error('Error fetching memes:', err);
      handleFirestoreError(err, OperationType.GET, 'memes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMemes();
    }
  }, [isOpen, activeTab, user]);

  const handleLike = async (meme: SavedMeme) => {
    if (likedMemeIds.has(meme.id)) return;

    try {
      const memeRef = doc(db, 'memes', meme.id);
      await updateDoc(memeRef, {
        likesCount: increment(1),
      });

      setMemes((prev) =>
        prev.map((m) => (m.id === meme.id ? { ...m, likesCount: (m.likesCount || 0) + 1 } : m))
      );

      const updatedSet = new Set(likedMemeIds);
      updatedSet.add(meme.id);
      setLikedMemeIds(updatedSet);
      localStorage.setItem('memegen_liked_ids', JSON.stringify(Array.from(updatedSet)));
    } catch (err: any) {
      console.error('Error liking meme:', err);
      handleFirestoreError(err, OperationType.UPDATE, `memes/${meme.id}`);
    }
  };

  const handleDelete = async (memeId: string) => {
    if (!confirm('Are you sure you want to delete this meme?')) return;
    try {
      await deleteDoc(doc(db, 'memes', memeId));
      setMemes((prev) => prev.filter((m) => m.id !== memeId));
    } catch (err: any) {
      console.error('Error deleting meme:', err);
      handleFirestoreError(err, OperationType.DELETE, `memes/${memeId}`);
    }
  };

  if (!isOpen) return null;

  const filteredMemes = memes.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      (m.tags && m.tags.some((t) => t.toLowerCase().includes(q))) ||
      (m.caption && m.caption.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with Tabs */}
        <div className="px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('public')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'public'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              Public Community Gallery
            </button>
            <button
              onClick={() => setActiveTab('my-vault')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'my-vault'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              My Personal Vault {user ? `(${memes.filter((m) => m.userId === user?.uid).length})` : ''}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search memes & tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              onClick={fetchMemes}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'my-vault' && !user ? (
            <div className="py-16 text-center max-w-sm mx-auto space-y-4">
              <User className="w-12 h-12 text-indigo-400 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-white">Sign In to View Your Vault</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Keep track of all memes you have crafted across devices and publish them to the community.
                </p>
              </div>
              <button
                onClick={signInWithGoogle}
                className="py-2.5 px-5 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md mx-auto transition"
              >
                <LogIn className="w-4 h-4 text-indigo-600" />
                Sign In with Google
              </button>
            </div>
          ) : isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-xs text-slate-400">Loading gallery memes...</p>
            </div>
          ) : filteredMemes.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">
                {activeTab === 'public' ? 'No public memes found' : 'Your vault is empty'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {activeTab === 'public'
                  ? 'Be the first to publish a meme from the studio!'
                  : 'Craft a meme and click "Save & Vault" to store it here.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMemes.map((m) => {
                const isLiked = likedMemeIds.has(m.id);
                const isMyMeme = user?.uid === m.userId;

                return (
                  <div
                    key={m.id}
                    className="group bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col"
                  >
                    {/* Image display */}
                    <div className="relative bg-black flex items-center justify-center max-h-72 overflow-hidden cursor-pointer">
                      <img
                        src={m.imageUrl}
                        alt={m.title}
                        className="w-full max-h-72 object-contain group-hover:scale-102 transition duration-200"
                        onClick={() => onRemixMeme(m)}
                      />

                      {/* AI Certified Stamp badge */}
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm border border-purple-500/40 text-[10px] text-purple-300 font-bold flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        MemeGen AI
                      </div>

                      {/* Quick Remix overlay button */}
                      <button
                        onClick={() => onRemixMeme(m)}
                        className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold shadow-lg transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        Remix in Studio
                      </button>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{m.title}</h4>
                          <span className="text-[11px] text-slate-500 shrink-0">
                            by {m.userDisplayName || 'Memer'}
                          </span>
                        </div>

                        {/* Tags */}
                        {m.tags && m.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {m.tags.slice(0, 3).map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom action row */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        {/* Likes */}
                        <button
                          onClick={() => handleLike(m)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                            isLiked
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                          {m.likesCount || 0}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onShareMeme(m)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Share Meme"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={m.imageUrl}
                            download={`meme-${m.id}.png`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>

                          {isMyMeme && (
                            <button
                              onClick={() => handleDelete(m.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition"
                              title="Delete Meme"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

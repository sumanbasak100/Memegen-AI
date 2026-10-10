export interface MemeSticker {
  id: string;
  name: string;
  emoji?: string;
  svgDataUrl?: string;
}

export const MEME_STICKERS: MemeSticker[] = [
  {
    id: 'thug-sunglasses',
    name: 'Deal With It Glasses',
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" width="160" height="40">
        <rect x="0" y="8" width="60" height="24" fill="#000000"/>
        <rect x="100" y="8" width="60" height="24" fill="#000000"/>
        <rect x="58" y="14" width="44" height="8" fill="#000000"/>
        <!-- Pixel highlights -->
        <rect x="8" y="12" width="12" height="6" fill="#ffffff"/>
        <rect x="108" y="12" width="12" height="6" fill="#ffffff"/>
      </svg>
    `)}`,
  },
  {
    id: 'laser-eyes',
    name: 'Laser Eyes Glow',
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" width="120" height="40">
        <!-- Left eye flare -->
        <circle cx="30" cy="20" r="16" fill="#ef4444" opacity="0.6"/>
        <circle cx="30" cy="20" r="8" fill="#f87171"/>
        <circle cx="30" cy="20" r="4" fill="#ffffff"/>
        <line x1="0" y1="20" x2="60" y2="20" stroke="#fca5a5" stroke-width="4"/>
        
        <!-- Right eye flare -->
        <circle cx="90" cy="20" r="16" fill="#ef4444" opacity="0.6"/>
        <circle cx="90" cy="20" r="8" fill="#f87171"/>
        <circle cx="90" cy="20" r="4" fill="#ffffff"/>
        <line x1="60" y1="20" x2="120" y2="20" stroke="#fca5a5" stroke-width="4"/>
      </svg>
    `)}`,
  },
  {
    id: 'verified-badge',
    name: 'Verified Checkmark',
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
        <circle cx="30" cy="30" r="26" fill="#1d9bf0"/>
        <path d="M 18 31 L 26 39 L 42 22" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
    `)}`,
  },
  {
    id: 'breaking-news',
    name: 'Breaking News Banner',
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 50" width="240" height="50">
        <rect width="240" height="50" fill="#dc2626"/>
        <rect y="38" width="240" height="12" fill="#fbbf24"/>
        <text x="120" y="28" text-anchor="middle" font-family="Impact, sans-serif" font-size="24" fill="#ffffff" letter-spacing="2">BREAKING NEWS</text>
      </svg>
    `)}`,
  },
  { id: 'skull', name: 'Dead / Skull', emoji: '💀' },
  { id: 'crying-laugh', name: 'Crying Laughing', emoji: '😂' },
  { id: 'fire', name: 'Fire', emoji: '🔥' },
  { id: 'clown', name: 'Clown', emoji: '🤡' },
  { id: 'sob', name: 'Loudly Crying', emoji: '😭' },
  { id: '100', name: 'Keep it 100', emoji: '💯' },
  { id: 'eyes', name: 'Side Eye', emoji: '👀' },
  { id: 'moai', name: 'Moai Stone', emoji: '🗿' },
  { id: 'brain', name: 'Galaxy Brain', emoji: '🧠' },
  { id: 'party', name: 'Party Popper', emoji: '🎉' },
];

export interface MemeTemplate {
  id: string;
  name: string;
  category: 'Classic' | 'Trending' | 'Work & Tech' | 'Reactions' | 'Animals';
  defaultTopText?: string;
  defaultBottomText?: string;
  svgDataUrl: string;
  suggestedTags: string[];
}

// Crisp, high quality vector-drawn iconic meme templates that never fail to load
export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake-hotline',
    name: 'Drake Hotline Bling',
    category: 'Classic',
    defaultTopText: 'WAKING UP AT 6 AM TO BE PRODUCTIVE',
    defaultBottomText: 'STAYING UP TILL 3 AM MAKING MEMES',
    suggestedTags: ['comparison', 'preference', 'classic'],
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" fill="#f8fafc"/>
        <line x1="0" y1="300" x2="600" y2="300" stroke="#cbd5e1" stroke-width="4"/>
        <line x1="300" y1="0" x2="300" y2="600" stroke="#cbd5e1" stroke-width="4"/>
        
        <!-- Top Left: Drake Reject -->
        <rect x="0" y="0" width="300" height="300" fill="#fef2f2"/>
        <circle cx="150" cy="110" r="50" fill="#d97706"/>
        <!-- Head -->
        <circle cx="150" cy="95" r="35" fill="#f59e0b"/>
        <!-- Beard & hair -->
        <path d="M 120 90 Q 150 140 180 90 Q 165 130 135 130 Z" fill="#78350f"/>
        <path d="M 120 80 Q 150 50 180 80 Q 150 65 120 80 Z" fill="#78350f"/>
        <!-- Closed reject eyes & frown -->
        <path d="M 132 90 L 142 94" stroke="#451a03" stroke-width="3" stroke-linecap="round"/>
        <path d="M 158 94 L 168 90" stroke="#451a03" stroke-width="3" stroke-linecap="round"/>
        <path d="M 142 112 Q 150 106 158 112" stroke="#451a03" stroke-width="3" fill="none"/>
        <!-- Reject hand pushing away -->
        <rect x="70" y="150" width="160" height="150" rx="20" fill="#ea580c"/>
        <circle cx="210" cy="120" r="22" fill="#f59e0b"/>
        <path d="M 195 105 L 210 135 L 225 110" stroke="#ea580c" stroke-width="4" fill="none"/>
        <text x="25" y="45" font-family="sans-serif" font-weight="900" font-size="24" fill="#dc2626">NOPE</text>

        <!-- Top Right Blank Meme Box for text -->
        <rect x="300" y="0" width="300" height="300" fill="#ffffff"/>
        
        <!-- Bottom Left: Drake Approves -->
        <rect x="0" y="300" width="300" height="300" fill="#f0fdf4"/>
        <circle cx="140" cy="410" r="50" fill="#d97706"/>
        <circle cx="140" cy="395" r="35" fill="#f59e0b"/>
        <path d="M 110 390 Q 140 440 170 390 Q 155 430 125 430 Z" fill="#78350f"/>
        <path d="M 110 380 Q 140 350 170 380 Q 140 365 110 380 Z" fill="#78350f"/>
        <!-- Wink / smile -->
        <circle cx="130" cy="390" r="4" fill="#451a03"/>
        <path d="M 150 390 Q 158 385 164 390" stroke="#451a03" stroke-width="3" fill="none"/>
        <path d="M 130 408 Q 142 422 154 408" stroke="#451a03" stroke-width="3" fill="#ffffff"/>
        <!-- Approving jacket & pointing finger -->
        <rect x="60" y="450" width="160" height="150" rx="20" fill="#ea580c"/>
        <circle cx="215" cy="430" r="18" fill="#f59e0b"/>
        <!-- Finger gun -->
        <rect x="210" y="420" width="45" height="12" rx="6" fill="#f59e0b"/>
        <text x="25" y="345" font-family="sans-serif" font-weight="900" font-size="24" fill="#16a34a">YESSS</text>

        <!-- Bottom Right Blank Meme Box for text -->
        <rect x="300" y="300" width="300" height="300" fill="#ffffff"/>
      </svg>
    `)}`,
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons / Daily Struggle',
    category: 'Trending',
    defaultTopText: 'FIX THE PRODUCTION BUG',
    defaultBottomText: 'PRETEND IT IS A PLANNED FEATURE',
    suggestedTags: ['dilemma', 'choice', 'sweating'],
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="600" height="500">
        <rect width="600" height="500" fill="#1e293b"/>
        <!-- Console control board -->
        <polygon points="40,240 560,240 500,480 100,480" fill="#334155" stroke="#475569" stroke-width="4"/>
        <!-- Left Red Button -->
        <ellipse cx="220" cy="330" rx="65" ry="35" fill="#991b1b"/>
        <ellipse cx="220" cy="320" rx="55" ry="28" fill="#ef4444"/>
        <!-- Right Red Button -->
        <ellipse cx="380" cy="330" rx="65" ry="35" fill="#991b1b"/>
        <ellipse cx="380" cy="320" rx="55" ry="28" fill="#ef4444"/>

        <!-- Guy Sweating In Background -->
        <ellipse cx="300" cy="110" rx="90" ry="85" fill="#fed7aa"/>
        <!-- Hair -->
        <path d="M 215 90 Q 300 20 385 90 Q 350 40 240 50 Z" fill="#3b82f6"/>
        <!-- Sweating Face & Towel -->
        <circle cx="265" cy="105" r="12" fill="#ffffff" stroke="#000" stroke-width="2"/>
        <circle cx="265" cy="105" r="5" fill="#000"/>
        <circle cx="335" cy="105" r="12" fill="#ffffff" stroke="#000" stroke-width="2"/>
        <circle cx="335" cy="105" r="5" fill="#000"/>
        <!-- Worried mouth -->
        <path d="M 270 145 Q 300 130 330 145" stroke="#9a3412" stroke-width="4" fill="none"/>
        <!-- Big Sweat Drops -->
        <path d="M 370 70 C 370 60 385 60 385 70 C 385 78 370 78 370 70 Z" fill="#38bdf8"/>
        <path d="M 230 110 C 230 100 242 100 242 110 C 242 118 230 118 230 110 Z" fill="#38bdf8"/>
        <!-- Hand holding towel -->
        <path d="M 360 120 Q 430 90 410 160 Q 370 150 360 120 Z" fill="#e2e8f0"/>
      </svg>
    `)}`,
  },
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Guy Looking Back',
    category: 'Trending',
    defaultTopText: 'NEW JAVASCRIPT FRAMEWORK',
    defaultBottomText: 'MY CURRENT WORKING CODEBASE',
    suggestedTags: ['distraction', 'temptation', 'tech'],
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
        <rect width="600" height="400" fill="#e2e8f0"/>
        <!-- Street sidewalk -->
        <rect y="280" width="600" height="120" fill="#94a3b8"/>
        
        <!-- Girl in Red (Temptation) -->
        <g id="girl-red">
          <circle cx="120" cy="120" r="30" fill="#fde047"/>
          <path d="M 90 150 L 150 150 L 170 300 L 70 300 Z" fill="#dc2626"/>
          <!-- Confident walk -->
          <line x1="100" y1="300" x2="85" y2="380" stroke="#fde047" stroke-width="12" stroke-linecap="round"/>
          <line x1="140" y1="300" x2="155" y2="380" stroke="#fde047" stroke-width="12" stroke-linecap="round"/>
        </g>

        <!-- Guy looking back (Distracted) -->
        <g id="boyfriend">
          <circle cx="320" cy="110" r="32" fill="#fed7aa"/>
          <path d="M 285 85 Q 315 65 345 85 Z" fill="#78350f"/>
          <!-- Eyes turned completely to the left -->
          <ellipse cx="305" cy="108" rx="7" ry="5" fill="#fff"/>
          <circle cx="302" cy="108" r="3" fill="#000"/>
          <ellipse cx="322" cy="108" rx="7" ry="5" fill="#fff"/>
          <circle cx="319" cy="108" r="3" fill="#000"/>
          <!-- Open jaw wow mouth -->
          <ellipse cx="310" cy="125" rx="8" ry="6" fill="#7f1d1d"/>
          <!-- Plaid shirt -->
          <rect x="270" y="145" width="90" height="150" fill="#0284c7" rx="10"/>
          <line x1="290" y1="295" x2="280" y2="380" stroke="#1e293b" stroke-width="14" stroke-linecap="round"/>
          <line x1="335" y1="295" x2="345" y2="380" stroke="#1e293b" stroke-width="14" stroke-linecap="round"/>
        </g>

        <!-- Girlfriend in shock/disgust -->
        <g id="girlfriend">
          <circle cx="480" cy="120" r="30" fill="#fed7aa"/>
          <path d="M 445 100 Q 480 60 515 100 Q 520 140 450 140 Z" fill="#451a03"/>
          <!-- Furious eyes & gaping mouth -->
          <circle cx="468" cy="118" r="6" fill="#fff"/>
          <circle cx="468" cy="118" r="3" fill="#000"/>
          <circle cx="490" cy="118" r="6" fill="#fff"/>
          <circle cx="490" cy="118" r="3" fill="#000"/>
          <path d="M 465 135 Q 480 145 495 135" stroke="#991b1b" stroke-width="3" fill="none"/>
          <rect x="440" y="150" width="75" height="145" fill="#059669" rx="10"/>
          <!-- Holding arm pulling guy -->
          <line x1="440" y1="180" x2="360" y2="190" stroke="#fed7aa" stroke-width="10" stroke-linecap="round"/>
        </g>
      </svg>
    `)}`,
  },
  {
    id: 'woman-yelling-cat',
    name: 'Woman Yelling at Confused Cat',
    category: 'Trending',
    defaultTopText: 'YOU CANNOT JUST SLEEP 14 HOURS A DAY',
    defaultBottomText: 'ME:',
    suggestedTags: ['argument', 'cat', 'unbothered'],
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" width="600" height="300">
        <!-- Split frame -->
        <rect width="300" height="300" fill="#fef2f2"/>
        <rect x="300" width="300" height="300" fill="#f8fafc"/>
        <line x1="300" y1="0" x2="300" y2="300" stroke="#cbd5e1" stroke-width="4"/>

        <!-- Left: Woman crying & pointing -->
        <circle cx="120" cy="110" r="45" fill="#fed7aa"/>
        <path d="M 70 80 Q 120 30 170 80 Q 180 150 80 140 Z" fill="#ca8a04"/>
        <!-- Angry crying eyes & pointing arm -->
        <path d="M 100 100 L 115 105" stroke="#b91c1c" stroke-width="4"/>
        <path d="M 125 105 L 140 100" stroke="#b91c1c" stroke-width="4"/>
        <ellipse cx="120" cy="125" rx="15" ry="10" fill="#991b1b"/>
        <!-- Aggressive finger point across border -->
        <line x1="160" y1="160" x2="280" y2="140" stroke="#fed7aa" stroke-width="14" stroke-linecap="round"/>

        <!-- Right: Confused white cat at salad table -->
        <!-- Dinner table -->
        <rect x="300" y="200" width="300" height="100" fill="#854d0e"/>
        <ellipse cx="450" cy="210" rx="70" ry="20" fill="#e2e8f0"/>
        <!-- Green salad on plate -->
        <circle cx="430" cy="208" r="8" fill="#22c55e"/>
        <circle cx="450" cy="205" r="10" fill="#16a34a"/>
        <circle cx="470" cy="209" r="8" fill="#15803d"/>
        <!-- White cat head & ears -->
        <polygon points="390,90 410,130 380,120" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <polygon points="490,90 470,130 500,120" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="440" cy="140" r="50" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <!-- Confused squinting eyes & pink nose -->
        <ellipse cx="425" cy="135" rx="8" ry="5" fill="#facc15"/>
        <circle cx="425" cy="135" r="3" fill="#000"/>
        <ellipse cx="455" cy="135" rx="8" ry="5" fill="#facc15"/>
        <circle cx="455" cy="135" r="3" fill="#000"/>
        <polygon points="440,145 435,150 445,150" fill="#f43f5e"/>
        <path d="M 435 155 Q 440 160 445 155" stroke="#475569" stroke-width="2" fill="none"/>
      </svg>
    `)}`,
  },
  {
    id: 'roll-safe-thinking',
    name: 'Roll Safe (Tap Forehead IQ)',
    category: 'Classic',
    defaultTopText: 'YOU CANNOT LOSE YOUR PHONE',
    defaultBottomText: 'IF YOU NEVER LEAVE THE HOUSE',
    suggestedTags: ['iq', 'smart', 'lifehack'],
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
        <rect width="600" height="450" fill="#0f172a"/>
        <!-- Guy silhouette with leather jacket -->
        <ellipse cx="300" cy="200" rx="95" ry="110" fill="#854d0e"/>
        <!-- Hair & beard fade -->
        <path d="M 220 180 Q 250 110 350 120 Q 380 150 375 220 Q 350 200 240 200 Z" fill="#1c1917"/>
        <path d="M 235 250 Q 290 310 345 250 Q 320 280 260 280 Z" fill="#1c1917"/>
        <!-- Smug knowing eyes looking at viewer -->
        <ellipse cx="275" cy="190" rx="10" ry="7" fill="#ffffff"/>
        <circle cx="277" cy="190" r="4" fill="#000"/>
        <ellipse cx="325" cy="190" rx="10" ry="7" fill="#ffffff"/>
        <circle cx="327" cy="190" r="4" fill="#000"/>
        <!-- Knowing grin smile -->
        <path d="M 270 235 Q 305 260 340 235" stroke="#451a03" stroke-width="4" fill="none"/>
        <!-- Hand tapping temple -->
        <line x1="390" y1="360" x2="350" y2="210" stroke="#854d0e" stroke-width="22" stroke-linecap="round"/>
        <circle cx="350" cy="200" r="16" fill="#854d0e"/>
        <line x1="350" y1="200" x2="335" y2="175" stroke="#854d0e" stroke-width="10" stroke-linecap="round"/>
        <!-- Leather jacket -->
        <path d="M 160 330 Q 300 290 440 330 L 460 450 L 140 450 Z" fill="#1e293b"/>
      </svg>
    `)}`,
  },
  {
    id: 'this-is-fine-fire',
    name: 'This Is Fine (Everything is on Fire)',
    category: 'Work & Tech',
    defaultTopText: 'ALL TESTS ARE FAILING IN PRODUCTION',
    defaultBottomText: 'THIS IS FINE.',
    suggestedTags: ['fire', 'chaos', 'calm'],
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
        <!-- Room burning background -->
        <rect width="600" height="450" fill="#fef08a"/>
        <!-- Giant flames all around -->
        <path d="M 0 450 L 50 150 L 100 350 L 170 100 L 220 300 L 300 50 L 380 320 L 450 80 L 520 280 L 600 120 L 600 450 Z" fill="#f97316"/>
        <path d="M 0 450 L 40 220 L 90 380 L 150 160 L 200 330 L 280 110 L 360 360 L 430 140 L 500 310 L 600 180 L 600 450 Z" fill="#ef4444"/>

        <!-- Table & Coffee Mug -->
        <rect x="180" y="320" width="240" height="20" fill="#78350f"/>
        <rect x="220" y="340" width="15" height="110" fill="#78350f"/>
        <rect x="365" y="340" width="15" height="110" fill="#78350f"/>
        <rect x="320" y="280" width="35" height="40" fill="#ffffff" rx="4"/>
        <path d="M 355 290 Q 370 300 355 310" stroke="#ffffff" stroke-width="4" fill="none"/>

        <!-- Dog in Bowler Hat -->
        <ellipse cx="260" cy="260" rx="50" ry="55" fill="#f59e0b"/>
        <!-- Snout -->
        <ellipse cx="280" cy="280" rx="30" ry="22" fill="#fed7aa"/>
        <circle cx="300" cy="275" r="6" fill="#000"/>
        <!-- Completely calm empty eyes -->
        <circle cx="250" cy="250" r="10" fill="#ffffff" stroke="#000" stroke-width="2"/>
        <circle cx="250" cy="250" r="4" fill="#000"/>
        <circle cx="278" cy="250" r="10" fill="#ffffff" stroke="#000" stroke-width="2"/>
        <circle cx="278" cy="250" r="4" fill="#000"/>
        <!-- Gentle calm smile -->
        <path d="M 270 290 Q 285 298 300 290" stroke="#78350f" stroke-width="3" fill="none"/>
        <!-- Bowler Hat -->
        <ellipse cx="260" cy="210" rx="42" ry="12" fill="#1e293b"/>
        <path d="M 235 210 Q 260 160 285 210 Z" fill="#1e293b"/>
      </svg>
    `)}`,
  },
  {
    id: 'expanding-brain',
    name: 'Expanding Cosmic Brain (4 Panels)',
    category: 'Work & Tech',
    defaultTopText: 'NORMAL SOLUTION',
    defaultBottomText: 'OVERENGINEERED 5000 IQ COSMIC SOLUTION',
    suggestedTags: ['iq', 'brain', 'tiers', 'levels'],
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" fill="#030712"/>
        <!-- 4 Grid lines -->
        <line x1="0" y1="150" x2="600" y2="150" stroke="#374151" stroke-width="3"/>
        <line x1="0" y1="300" x2="600" y2="300" stroke="#374151" stroke-width="3"/>
        <line x1="0" y1="450" x2="600" y2="450" stroke="#374151" stroke-width="3"/>
        <line x1="280" y1="0" x2="280" y2="600" stroke="#374151" stroke-width="3"/>

        <!-- Tier 1: Small regular brain -->
        <circle cx="140" cy="75" r="40" fill="#9ca3af"/>
        <text x="320" y="80" font-family="sans-serif" font-weight="bold" font-size="20" fill="#9ca3af">TIER 1</text>

        <!-- Tier 2: Glowing light brain -->
        <circle cx="140" cy="225" r="45" fill="#38bdf8"/>
        <circle cx="140" cy="225" r="55" fill="none" stroke="#7dd3fc" stroke-width="4" stroke-dasharray="8,6"/>
        <text x="320" y="230" font-family="sans-serif" font-weight="bold" font-size="20" fill="#38bdf8">TIER 2</text>

        <!-- Tier 3: Cosmic galaxy beams -->
        <circle cx="140" cy="375" r="48" fill="#a855f7"/>
        <path d="M 80 375 L 200 375 M 140 315 L 140 435 M 100 335 L 180 415" stroke="#f472b6" stroke-width="5"/>
        <text x="320" y="380" font-family="sans-serif" font-weight="bold" font-size="20" fill="#a855f7">TIER 3</text>

        <!-- Tier 4: Godmode Transcendent Brain -->
        <circle cx="140" cy="525" r="50" fill="#fbbf24"/>
        <circle cx="140" cy="525" r="65" fill="none" stroke="#f59e0b" stroke-width="6"/>
        <path d="M 60 525 L 220 525 M 140 445 L 140 605 M 80 465 L 200 585 M 200 465 L 80 585" stroke="#fef08a" stroke-width="4"/>
        <text x="320" y="530" font-family="sans-serif" font-weight="bold" font-size="20" fill="#fbbf24">TIER 4 (GALAXY)</text>
      </svg>
    `)}`,
  },
  {
    id: 'panik-kalm-panik',
    name: 'Panik / Kalm / Panik (Meme Man)',
    category: 'Reactions',
    defaultTopText: 'YOU FOUND A CRITICAL BUG',
    defaultBottomText: 'IT IS ALREADY MERGED TO MAIN',
    suggestedTags: ['stress', 'panic', '3panel'],
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
        <rect width="600" height="600" fill="#ffffff"/>
        <line x1="0" y1="200" x2="600" y2="200" stroke="#cbd5e1" stroke-width="4"/>
        <line x1="0" y1="400" x2="600" y2="400" stroke="#cbd5e1" stroke-width="4"/>
        <line x1="250" y1="0" x2="250" y2="600" stroke="#cbd5e1" stroke-width="4"/>

        <!-- Top Panel: PANIK -->
        <rect x="0" y="0" width="250" height="200" fill="#fef2f2"/>
        <circle cx="125" cy="100" r="50" fill="#e2e8f0"/>
        <ellipse cx="110" cy="90" rx="12" ry="8" fill="#ef4444"/>
        <ellipse cx="140" cy="90" rx="12" ry="8" fill="#ef4444"/>
        <ellipse cx="125" cy="125" rx="14" ry="10" fill="#000000"/>
        <text x="125" y="185" text-anchor="middle" font-family="Impact, sans-serif" font-size="24" fill="#dc2626">PANIK</text>

        <!-- Middle Panel: KALM -->
        <rect x="0" y="200" width="250" height="200" fill="#f0fdf4"/>
        <circle cx="125" cy="300" r="50" fill="#e2e8f0"/>
        <path d="M 105 295 Q 115 285 125 295" stroke="#15803d" stroke-width="3" fill="none"/>
        <path d="M 125 295 Q 135 285 145 295" stroke="#15803d" stroke-width="3" fill="none"/>
        <path d="M 115 320 Q 125 330 135 320" stroke="#15803d" stroke-width="3" fill="none"/>
        <text x="125" y="385" text-anchor="middle" font-family="Impact, sans-serif" font-size="24" fill="#16a34a">KALM</text>

        <!-- Bottom Panel: PANIK -->
        <rect x="0" y="400" width="250" height="200" fill="#fef2f2"/>
        <circle cx="125" cy="500" r="50" fill="#e2e8f0"/>
        <ellipse cx="110" cy="490" rx="14" ry="10" fill="#dc2626"/>
        <ellipse cx="140" cy="490" rx="14" ry="10" fill="#dc2626"/>
        <ellipse cx="125" cy="530" rx="18" ry="14" fill="#000000"/>
        <text x="125" y="585" text-anchor="middle" font-family="Impact, sans-serif" font-size="26" fill="#b91c1c">PANIK!!</text>
      </svg>
    `)}`,
  },
  {
    id: 'doge-much-wow',
    name: 'Doge / Much Wow',
    category: 'Animals',
    defaultTopText: 'SUCH MEME',
    defaultBottomText: 'VERY ARTIFICIAL INTELLIGENCE. MUCH WOW.',
    suggestedTags: ['doge', 'shiba', 'wholesome', 'classic'],
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="600" height="500">
        <rect width="600" height="500" fill="#fef3c7"/>
        <!-- Shiba Inu face -->
        <ellipse cx="300" cy="270" rx="160" ry="140" fill="#d97706"/>
        <!-- White cheeks & muzzle -->
        <ellipse cx="300" cy="300" rx="110" ry="85" fill="#fef9c3"/>
        <polygon points="170,160 210,90 260,150" fill="#b45309"/>
        <polygon points="430,160 390,90 340,150" fill="#b45309"/>
        <!-- Inquisitive eyebrow look -->
        <ellipse cx="230" cy="230" rx="18" ry="14" fill="#000000"/>
        <circle cx="235" cy="225" r="5" fill="#ffffff"/>
        <ellipse cx="370" cy="230" rx="18" ry="14" fill="#000000"/>
        <circle cx="375" cy="225" r="5" fill="#ffffff"/>
        <!-- Cute black nose and mouth -->
        <polygon points="300,270 285,290 315,290" fill="#000000"/>
        <path d="M 285 295 Q 300 305 315 295" stroke="#000000" stroke-width="3" fill="none"/>
        <circle cx="210" cy="180" r="10" fill="#fef08a"/>
        <circle cx="390" cy="180" r="10" fill="#fef08a"/>
      </svg>
    `)}`,
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind (Outdoor Desk)',
    category: 'Trending',
    defaultTopText: 'AI MEMES ARE BETTER THAN HUMAN MEMES',
    defaultBottomText: 'CHANGE MY MIND.',
    suggestedTags: ['opinion', 'debate', 'bold'],
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
        <!-- Campus park lawn background -->
        <rect width="600" height="240" fill="#bfdbfe"/>
        <rect y="240" width="600" height="210" fill="#15803d"/>
        <!-- Trees -->
        <circle cx="100" cy="180" r="70" fill="#166534"/>
        <circle cx="520" cy="180" r="80" fill="#166534"/>

        <!-- Guy sitting in jacket -->
        <circle cx="300" cy="140" r="30" fill="#fed7aa"/>
        <rect x="260" y="170" width="80" height="90" fill="#1e3a8a" rx="10"/>

        <!-- White Table Banner -->
        <polygon points="120,240 480,240 520,380 80,380" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>
        <!-- Coffee Mug on desk -->
        <rect x="180" y="215" width="25" height="30" fill="#ffffff" stroke="#64748b" stroke-width="2"/>
        <text x="300" y="320" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="28" fill="#1e293b">CHANGE MY MIND</text>
      </svg>
    `)}`,
  },
];

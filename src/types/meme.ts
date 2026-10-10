export interface TextLayer {
  id: string;
  text: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  fontSize: number;
  fontFamily: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  isUppercase: boolean;
  textAlign: 'center' | 'left' | 'right';
  rotation: number;
  hasBackgroundBox: boolean;
  backgroundColor: string;
}

export interface StickerLayer {
  id: string;
  stickerId: string;
  emoji?: string;
  svgDataUrl?: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  scale: number;
  rotation: number;
}

export type MemeLayout = 'classic' | 'modern-header' | 'demotivational';

export interface FilterSettings {
  brightness: number; // 0 - 200
  contrast: number; // 0 - 200
  saturation: number; // 0 - 200
  deepFried: boolean;
  grayscale: boolean;
  sepia: boolean;
}

export interface MagicCaptionItem {
  id: string;
  tag: string;
  text: string;
  topText?: string;
  bottomText?: string;
  explanation?: string;
}

export interface ImageAnalysisData {
  visualSubject: string;
  memePotentialScore: number;
  roast: string;
  vibeCategory: string;
  suggestedAngles: string[];
}

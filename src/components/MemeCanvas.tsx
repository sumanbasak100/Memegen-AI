import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TextLayer, StickerLayer, MemeLayout, FilterSettings } from '../types/meme';

interface MemeCanvasProps {
  imageSrc: string;
  layout: MemeLayout;
  headerText: string;
  headerBgColor: string;
  headerTextColor: string;
  textLayers: TextLayer[];
  stickerLayers: StickerLayer[];
  filterSettings: FilterSettings;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  onUpdateStickerLayer: (id: string, updates: Partial<StickerLayer>) => void;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const MemeCanvas: React.FC<MemeCanvasProps> = ({
  imageSrc,
  layout,
  headerText,
  headerBgColor,
  headerTextColor,
  textLayers,
  stickerLayers,
  filterSettings,
  selectedLayerId,
  onSelectLayer,
  onUpdateTextLayer,
  onUpdateStickerLayer,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  // Dragging state
  const [dragItem, setDragItem] = useState<{
    id: string;
    type: 'text' | 'sticker';
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  // Load image when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      setLoadedImage(img);
    };
  }, [imageSrc]);

  // Helper to wrap text
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Base dimensions from natural image
    const imgWidth = loadedImage.naturalWidth || 600;
    const imgHeight = loadedImage.naturalHeight || 600;

    let targetWidth = Math.max(500, Math.min(imgWidth, 1200));
    const scale = targetWidth / imgWidth;
    let targetHeight = Math.round(imgHeight * scale);

    // Calculate layout adjustments
    let headerHeight = 0;
    let bottomPadding = 0;

    if (layout === 'modern-header' && headerText) {
      // White/dark banner box above image
      ctx.font = `bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const headerLines = wrapText(ctx, headerText, targetWidth - 60);
      headerHeight = Math.max(80, headerLines.length * 36 + 40);
    } else if (layout === 'demotivational') {
      headerHeight = 40;
      bottomPadding = 120;
      targetWidth += 80;
      targetHeight += 80;
    }

    const totalCanvasWidth = targetWidth;
    const totalCanvasHeight = (layout === 'demotivational' ? targetHeight + bottomPadding : targetHeight + headerHeight);

    canvas.width = totalCanvasWidth;
    canvas.height = totalCanvasHeight;

    // Clear background
    ctx.clearRect(0, 0, totalCanvasWidth, totalCanvasHeight);

    // 1. Draw layout background
    if (layout === 'modern-header') {
      ctx.fillStyle = headerBgColor || '#FFFFFF';
      ctx.fillRect(0, 0, totalCanvasWidth, headerHeight);

      // Draw header text
      if (headerText) {
        ctx.fillStyle = headerTextColor || '#111827';
        ctx.font = `bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const lines = wrapText(ctx, headerText, totalCanvasWidth - 60);
        const startY = headerHeight / 2 - ((lines.length - 1) * 36) / 2;
        lines.forEach((line, idx) => {
          ctx.fillText(line, 30, startY + idx * 36);
        });
      }
    } else if (layout === 'demotivational') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, totalCanvasWidth, totalCanvasHeight);
    }

    // 2. Apply Filters and Draw Main Image
    ctx.save();
    let filterString = `brightness(${filterSettings.brightness}%) contrast(${filterSettings.contrast}%) saturate(${filterSettings.saturation}%)`;
    if (filterSettings.grayscale) filterString += ' grayscale(100%)';
    if (filterSettings.sepia) filterString += ' sepia(100%)';
    if (filterSettings.deepFried) {
      filterString = `contrast(240%) saturate(280%) brightness(110%)`;
    }
    ctx.filter = filterString;

    const imgDrawX = layout === 'demotivational' ? 40 : 0;
    const imgDrawY = layout === 'modern-header' ? headerHeight : (layout === 'demotivational' ? 40 : 0);
    const imgDrawW = layout === 'demotivational' ? targetWidth - 80 : targetWidth;
    const imgDrawH = layout === 'demotivational' ? targetHeight - 80 : targetHeight;

    ctx.drawImage(loadedImage, imgDrawX, imgDrawY, imgDrawW, imgDrawH);

    // Demotivational inner white border
    if (layout === 'demotivational') {
      ctx.filter = 'none';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(imgDrawX - 6, imgDrawY - 6, imgDrawW + 12, imgDrawH + 12);
    }
    ctx.restore();

    // 3. Draw Demotivational bottom text if in demotivational mode
    if (layout === 'demotivational' && headerText) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px "Times New Roman", Times, serif';
      ctx.textAlign = 'center';
      ctx.fillText(headerText.toUpperCase(), totalCanvasWidth / 2, targetHeight + 50);
      ctx.restore();
    }

    // 4. Draw Custom Text Layers
    textLayers.forEach((layer) => {
      if (!layer.text) return;
      ctx.save();

      const posX = (layer.x / 100) * totalCanvasWidth;
      const posY = (layer.y / 100) * totalCanvasHeight;

      ctx.translate(posX, posY);
      if (layer.rotation) {
        ctx.rotate((layer.rotation * Math.PI) / 180);
      }

      const displayText = layer.isUppercase ? layer.text.toUpperCase() : layer.text;
      const computedFontSize = Math.round((layer.fontSize / 500) * totalCanvasWidth);
      ctx.font = `900 ${computedFontSize}px ${layer.fontFamily}, Impact, sans-serif`;
      ctx.textAlign = layer.textAlign;
      ctx.textBaseline = 'middle';

      const maxTextWidth = totalCanvasWidth * 0.9;
      const lines = wrapText(ctx, displayText, maxTextWidth);
      const lineHeight = computedFontSize * 1.15;
      const totalTextHeight = lines.length * lineHeight;

      // Draw background box if enabled
      if (layer.hasBackgroundBox) {
        lines.forEach((line, i) => {
          const lineWidth = ctx.measureText(line).width;
          const lineY = (i - (lines.length - 1) / 2) * lineHeight;
          let boxX = -lineWidth / 2 - 12;
          if (layer.textAlign === 'left') boxX = -12;
          if (layer.textAlign === 'right') boxX = -lineWidth - 12;

          ctx.fillStyle = layer.backgroundColor || 'rgba(0,0,0,0.7)';
          ctx.fillRect(boxX, lineY - computedFontSize / 2 - 4, lineWidth + 24, computedFontSize + 8);
        });
      }

      // Draw stroke & text fill
      lines.forEach((line, i) => {
        const lineY = (i - (lines.length - 1) / 2) * lineHeight;

        if (layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.strokeColor;
          ctx.lineWidth = Math.max(2, (layer.strokeWidth / 500) * totalCanvasWidth);
          ctx.lineJoin = 'miter';
          ctx.miterLimit = 2;
          ctx.strokeText(line, 0, lineY);
        }

        ctx.fillStyle = layer.color;
        ctx.fillText(line, 0, lineY);
      });

      // Highlight selected layer with dashed border
      if (selectedLayerId === layer.id) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        const longestLineWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));
        let selX = -longestLineWidth / 2 - 16;
        if (layer.textAlign === 'left') selX = -16;
        if (layer.textAlign === 'right') selX = -longestLineWidth - 16;
        ctx.strokeRect(selX, -totalTextHeight / 2 - 12, longestLineWidth + 32, totalTextHeight + 24);
      }

      ctx.restore();
    });

    // 5. Draw Stickers
    stickerLayers.forEach((sticker) => {
      ctx.save();
      const posX = (sticker.x / 100) * totalCanvasWidth;
      const posY = (sticker.y / 100) * totalCanvasHeight;

      ctx.translate(posX, posY);
      if (sticker.rotation) {
        ctx.rotate((sticker.rotation * Math.PI) / 180);
      }

      if (sticker.emoji) {
        const stickerSize = 56 * sticker.scale;
        ctx.font = `${stickerSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.emoji, 0, 0);

        if (selectedLayerId === sticker.id) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(-stickerSize / 2 - 4, -stickerSize / 2 - 4, stickerSize + 8, stickerSize + 8);
        }
      } else if (sticker.svgDataUrl) {
        const img = new Image();
        img.src = sticker.svgDataUrl;
        const sWidth = 100 * sticker.scale;
        const sHeight = 40 * sticker.scale;
        ctx.drawImage(img, -sWidth / 2, -sHeight / 2, sWidth, sHeight);

        if (selectedLayerId === sticker.id) {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(-sWidth / 2 - 4, -sHeight / 2 - 4, sWidth + 8, sHeight + 8);
        }
      }

      ctx.restore();
    });

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [
    loadedImage,
    layout,
    headerText,
    headerBgColor,
    headerTextColor,
    textLayers,
    stickerLayers,
    filterSettings,
    selectedLayerId,
    onCanvasReady,
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle Canvas Pointer interactions (drag & drop layer positioning)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check sticker layers first (they are usually smaller)
    for (const sticker of [...stickerLayers].reverse()) {
      const dist = Math.hypot(clickX - sticker.x, clickY - sticker.y);
      if (dist < 10 * sticker.scale) {
        onSelectLayer(sticker.id);
        setDragItem({
          id: sticker.id,
          type: 'sticker',
          startX: e.clientX,
          startY: e.clientY,
          origX: sticker.x,
          origY: sticker.y,
        });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        return;
      }
    }

    // Check text layers
    for (const layer of [...textLayers].reverse()) {
      const dist = Math.hypot(clickX - layer.x, clickY - layer.y);
      if (dist < 18) {
        onSelectLayer(layer.id);
        setDragItem({
          id: layer.id,
          type: 'text',
          startX: e.clientX,
          startY: e.clientY,
          origX: layer.x,
          origY: layer.y,
        });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        return;
      }
    }

    // Clicked empty space
    onSelectLayer(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragItem || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragItem.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragItem.startY) / rect.height) * 100;

    const newX = Math.max(5, Math.min(95, dragItem.origX + deltaX));
    const newY = Math.max(5, Math.min(95, dragItem.origY + deltaY));

    if (dragItem.type === 'text') {
      onUpdateTextLayer(dragItem.id, { x: Math.round(newX), y: Math.round(newY) });
    } else {
      onUpdateStickerLayer(dragItem.id, { x: Math.round(newX), y: Math.round(newY) });
    }
  };

  const handlePointerUp = () => {
    setDragItem(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-h-[72vh] flex items-center justify-center bg-slate-950/70 rounded-2xl p-2 sm:p-4 border border-slate-800 shadow-2xl overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="max-h-[68vh] max-w-full w-auto object-contain rounded-xl shadow-lg cursor-move transition-transform duration-75"
      />
    </div>
  );
};

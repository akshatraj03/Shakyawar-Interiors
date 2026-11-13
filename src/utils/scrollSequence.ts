export const TOTAL_HERO_FRAMES = 120;

export interface HeroStage {
  id: string;
  index: string;
  startProgress: number;
  endProgress: number;
  headline: string;
  supporting: string;
  architecturalNote: string;
}

export const HERO_STAGES: HeroStage[] = [
  {
    id: 'raw-shell',
    index: '01',
    startProgress: 0,
    endProgress: 0.16,
    headline: 'Every space has a story waiting to unfold.',
    supporting: 'Thoughtfully designed. Beautifully transformed.',
    architecturalNote: 'Architectural Shell · Bare Walls & Exposed Points',
  },
  {
    id: 'millwork-ceiling',
    index: '02',
    startProgress: 0.16,
    endProgress: 0.36,
    headline: 'From vision to reality.',
    supporting: 'Architectural panelling, false ceilings, and concealed cove lighting establish proportion.',
    architecturalNote: 'Structure & Envelope · Timber Framing & Lighting Coves',
  },
  {
    id: 'surfaces-joinery',
    index: '03',
    startProgress: 0.36,
    endProgress: 0.58,
    headline: 'Where every detail matters.',
    supporting: 'Warm oak flooring, vein-cut stone, and custom fluted wardrobes anchor the room.',
    architecturalNote: 'Materiality · Hardwood Planks, Natural Stone & Joinery',
  },
  {
    id: 'furnishing-light',
    index: '04',
    startProgress: 0.58,
    endProgress: 0.80,
    headline: 'Designed around the way you live.',
    supporting: 'Layered drapery, tactile textiles, and bespoke furniture bring warmth and calm.',
    architecturalNote: 'Living Layer · Soft Furnishings, Drapery & Ambient Glow',
  },
  {
    id: 'final-reveal',
    index: '05',
    startProgress: 0.80,
    endProgress: 1.0,
    headline: "Imagine it. We'll transform it.",
    supporting: 'Discover the possibilities of thoughtfully designed spaces with Shakyawar Design Studio.',
    architecturalNote: 'Completed Suite · Shakyawar Design Studio, Indore',
  },
];

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function progressToFrameIndex(progress: number, totalFrames = TOTAL_HERO_FRAMES): number {
  const clamped = clampProgress(progress);
  if (totalFrames <= 1) return 0;
  return Math.round(clamped * (totalFrames - 1));
}

export function buildFrameUrl(frameIndexZeroBased: number, totalFrames = TOTAL_HERO_FRAMES): string {
  const bounded = Math.min(Math.max(0, Math.round(frameIndexZeroBased)), totalFrames - 1);
  const oneBased = String(bounded + 1).padStart(3, '0');
  return `/hero-frames/frame_${oneBased}.webp`;
}

export function getTransformationStage(progress: number): HeroStage {
  const clamped = clampProgress(progress);
  for (let i = HERO_STAGES.length - 1; i >= 0; i--) {
    if (clamped >= HERO_STAGES[i].startProgress) {
      return HERO_STAGES[i];
    }
  }
  return HERO_STAGES[0];
}

export interface CoverRect {
  drawX: number;
  drawY: number;
  drawWidth: number;
  drawHeight: number;
}

export function computeCoverRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): CoverRect {
  if (sourceWidth <= 0 || sourceHeight <= 0 || targetWidth <= 0 || targetHeight <= 0) {
    return { drawX: 0, drawY: 0, drawWidth: targetWidth, drawHeight: targetHeight };
  }
  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = targetWidth / targetHeight;

  if (targetAspect > sourceAspect) {
    const drawWidth = targetWidth;
    const drawHeight = targetWidth / sourceAspect;
    return {
      drawX: 0,
      drawY: (targetHeight - drawHeight) / 2,
      drawWidth,
      drawHeight,
    };
  }

  const drawHeight = targetHeight;
  const drawWidth = targetHeight * sourceAspect;
  return {
    drawX: (targetWidth - drawWidth) / 2,
    drawY: 0,
    drawWidth,
    drawHeight,
  };
}

export function findNearestLoadedFrame(
  targetIndex: number,
  loadedFlags: boolean[],
): number {
  if (loadedFlags[targetIndex]) return targetIndex;
  const len = loadedFlags.length;
  for (let offset = 1; offset < len; offset++) {
    if (targetIndex - offset >= 0 && loadedFlags[targetIndex - offset]) {
      return targetIndex - offset;
    }
    if (targetIndex + offset < len && loadedFlags[targetIndex + offset]) {
      return targetIndex + offset;
    }
  }
  return 0;
}

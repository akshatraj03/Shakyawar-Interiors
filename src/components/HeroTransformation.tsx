import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import {
  buildFrameUrl,
  clampProgress,
  computeCoverRect,
  findNearestLoadedFrame,
  getTransformationStage,
  HERO_STAGES,
  progressToFrameIndex,
  TOTAL_HERO_FRAMES,
} from '../utils/scrollSequence';

interface HeroTransformationProps {
  onExploreWork: () => void;
  onStartConversation: () => void;
}

const STAGE_SHORT_LABELS: Record<string, string> = {
  'raw-shell': 'Shell',
  'millwork-ceiling': 'Envelope',
  'surfaces-joinery': 'Materiality',
  'furnishing-light': 'Living',
  'final-reveal': 'Reveal',
};

export function HeroTransformation({
  onExploreWork,
  onStartConversation,
}: HeroTransformationProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_HERO_FRAMES).fill(null),
  );
  const loadedFlagsRef = useRef<boolean[]>(
    new Array(TOTAL_HERO_FRAMES).fill(false),
  );

  const targetProgressRef = useRef<number>(0);
  const renderedProgressRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  const [uiProgress, setUiProgress] = useState<number>(0);
  const [framesLoadedCount, setFramesLoadedCount] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [reducedShowFinal, setReducedShowFinal] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const drawFrameToCanvas = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resolvedIdx = findNearestLoadedFrame(frameIndex, loadedFlagsRef.current);
    const img = imagesRef.current[resolvedIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    if (cssWidth === 0 || cssHeight === 0) return;

    const targetW = Math.round(cssWidth * dpr);
    const targetH = Math.round(cssHeight * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const rect = computeCoverRect(img.naturalWidth, img.naturalHeight, targetW, targetH);
    ctx.clearRect(0, 0, targetW, targetH);
    ctx.drawImage(img, rect.drawX, rect.drawY, rect.drawWidth, rect.drawHeight);
    lastDrawnFrameRef.current = resolvedIdx;
  };

  // Progressive frame preloading: initial frame, final frame, keyframes, then full 120-frame sequence
  useEffect(() => {
    let cancelled = false;
    const priorityIndices: number[] = [0, TOTAL_HERO_FRAMES - 1];
    for (let i = 6; i < TOTAL_HERO_FRAMES - 1; i += 6) priorityIndices.push(i);
    for (let i = 0; i < TOTAL_HERO_FRAMES; i++) {
      if (!priorityIndices.includes(i)) priorityIndices.push(i);
    }

    let cursor = 0;
    const CONCURRENCY = 6;

    const loadNext = () => {
      if (cancelled || cursor >= priorityIndices.length) return;
      const idx = priorityIndices[cursor++];
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (cancelled) return;
        imagesRef.current[idx] = img;
        loadedFlagsRef.current[idx] = true;
        setFramesLoadedCount((c) => c + 1);

        const activeTargetFrame = progressToFrameIndex(renderedProgressRef.current);
        if (idx === 0 || Math.abs(idx - activeTargetFrame) <= 2 || lastDrawnFrameRef.current === -1) {
          drawFrameToCanvas(activeTargetFrame);
        }
        loadNext();
      };
      img.onerror = () => {
        if (!cancelled) loadNext();
      };
      img.src = buildFrameUrl(idx);
    };

    for (let c = 0; c < CONCURRENCY; c++) {
      loadNext();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll listener + smooth frame interpolation loop
  useEffect(() => {
    const tick = () => {
      const target = targetProgressRef.current;
      const current = renderedProgressRef.current;
      const diff = target - current;

      const next = Math.abs(diff) < 0.0008 ? target : current + diff * 0.16;
      renderedProgressRef.current = next;

      const frameIdx = progressToFrameIndex(next);
      if (frameIdx !== lastDrawnFrameRef.current) {
        drawFrameToCanvas(frameIdx);
      }

      setUiProgress((prev) => (Math.abs(prev - next) > 0.004 ? next : prev));

      if (Math.abs(target - next) >= 0.0008) {
        rafIdRef.current = window.requestAnimationFrame(tick);
      } else {
        rafIdRef.current = null;
      }
    };

    const scheduleTick = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = window.requestAnimationFrame(tick);
      }
    };

    const handleScroll = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const raw = -rect.top / scrollableDistance;
      targetProgressRef.current = clampProgress(raw);
      scheduleTick();
    };

    const handleResize = () => {
      drawFrameToCanvas(progressToFrameIndex(renderedProgressRef.current));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Reduced-motion mode sync
  useEffect(() => {
    if (!reducedMotion) return;
    const target = reducedShowFinal ? 1 : 0;
    targetProgressRef.current = target;
    renderedProgressRef.current = target;
    setUiProgress(target);
    drawFrameToCanvas(progressToFrameIndex(target));
  }, [reducedMotion, reducedShowFinal]);

  const jumpToStageProgress = (targetProgress: number) => {
    if (reducedMotion) {
      setReducedShowFinal(targetProgress >= 0.5);
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    const scrollableDistance = track.offsetHeight - window.innerHeight;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: trackTop + scrollableDistance * clampProgress(targetProgress),
      behavior: 'smooth',
    });
  };

  const activeStage = getTransformationStage(uiProgress);
  const currentFrame = progressToFrameIndex(uiProgress) + 1;
  const isFinalReveal = uiProgress >= 0.78;

  return (
    <section
      id="home"
      aria-label="Architectural Space Transformation"
      ref={trackRef}
      className={reducedMotion ? 'relative min-h-screen bg-[#1E1A16]' : 'relative h-[440vh] bg-[#1E1A16]'}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#1E1A16]">
        {/* Crisp Initial Fallback Image while canvas warms up */}
        <img
          src="/hero-frames/frame_001.webp"
          alt="Unfinished residential shell before interior architecture"
          className="absolute inset-0 h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* 120-Frame Sequence HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          data-testid="hero-transformation-canvas"
          data-frame={currentFrame}
          data-stage={activeStage.id}
          aria-label={`Architectural transformation sequence frame ${currentFrame} of ${TOTAL_HERO_FRAMES}`}
          className="relative z-10 block h-full w-full"
        />

        {/* Dual-axis Editorial Contrast Scrims for Uncompromised Legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#181411]/92 via-[#181411]/25 to-[#181411]/55"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-[#181411]/65 via-transparent to-transparent"
        />

        {/* Refined Editorial Copy & Stage Indicators */}
        <div className="pointer-events-none absolute inset-0 z-30 mx-auto flex max-w-[1440px] flex-col justify-end px-6 pb-8 pt-24 md:px-12 md:pb-14">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            {/* Left Editorial Beat with Smooth Stage Crossfade */}
            <div key={activeStage.id} className="animate-hero-stage pointer-events-auto max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] font-medium tracking-[0.2em] uppercase text-[#D9D1C5]">
                <span className="tabular-nums text-[#F2EFE9]">
                  {activeStage.index} / 05
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeStage.architecturalNote}</span>
              </div>

              <h1 className="font-serif text-[2.25rem] font-medium leading-[1.06] tracking-[-0.015em] text-[#F2EFE9] sm:text-5xl lg:text-6xl">
                {activeStage.headline}
              </h1>

              <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[#E3DDD2] sm:text-base">
                {activeStage.supporting}
              </p>

              {/* Final Reveal CTAs or Scroll Cue */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {isFinalReveal ? (
                  <>
                    <button
                      type="button"
                      onClick={onExploreWork}
                      className="inline-flex min-h-[44px] items-center gap-2.5 bg-[#F2EFE9] px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#29241F] transition-colors duration-200 hover:bg-[#D9D1C5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2EFE9]"
                    >
                      Explore Our Work
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={onStartConversation}
                      className="inline-flex min-h-[44px] items-center gap-2 border border-[#F2EFE9]/55 bg-[#181411]/65 px-6 py-3 text-xs font-medium tracking-[0.14em] uppercase text-[#F2EFE9] transition-colors duration-200 hover:border-[#F2EFE9] hover:bg-[#181411]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2EFE9]"
                    >
                      Start a Conversation
                    </button>
                  </>
                ) : reducedMotion ? (
                  <button
                    type="button"
                    onClick={() => setReducedShowFinal(true)}
                    className="inline-flex min-h-[44px] items-center gap-2 bg-[#F2EFE9] px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#29241F] transition-colors hover:bg-[#D9D1C5]"
                  >
                    Reveal Completed Interior
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase whitespace-nowrap text-[#F2EFE9]/90">
                      <ArrowDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      Scroll to transform space
                    </span>
                    <button
                      type="button"
                      onClick={() => jumpToStageProgress(0.95)}
                      className="min-h-[40px] text-xs font-medium tracking-[0.14em] uppercase whitespace-nowrap text-[#D9D1C5] underline decoration-[#92795F] underline-offset-4 transition-colors hover:text-[#F2EFE9]"
                    >
                      Jump to Final Reveal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Architectural Phase Rail */}
            <div className="pointer-events-auto flex flex-col gap-3 lg:items-end">
              <div
                className="flex flex-wrap items-center border border-[#F2EFE9]/20 bg-[#181411]/75 p-1"
                role="group"
                aria-label="Transformation stages"
              >
                {HERO_STAGES.map((stage) => {
                  const isCurrent = activeStage.id === stage.id;
                  const target =
                    stage.id === 'final-reveal'
                      ? 0.96
                      : (stage.startProgress + stage.endProgress) / 2;
                  const shortLabel = STAGE_SHORT_LABELS[stage.id] ?? stage.index;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => jumpToStageProgress(target)}
                      aria-label={`Stage ${stage.index}: ${shortLabel}`}
                      className={`inline-flex min-h-[38px] items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-[0.12em] uppercase tabular-nums transition-colors ${
                        isCurrent
                          ? 'bg-[#F2EFE9] text-[#29241F]'
                          : 'text-[#D9D1C5] hover:text-[#F2EFE9]'
                      }`}
                    >
                      <span>{stage.index}</span>
                      <span className="hidden sm:inline opacity-75">{shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Clean Architectural Progress Bar */}
              <div className="flex w-full max-w-xs items-center gap-3 lg:w-72">
                <div className="h-[2px] flex-1 bg-[#F2EFE9]/25">
                  <div
                    className="h-full bg-[#F2EFE9] transition-transform duration-75 origin-left"
                    style={{ transform: `scaleX(${Math.max(0.02, uiProgress)})` }}
                  />
                </div>
                <span className="text-[11px] font-medium tabular-nums tracking-[0.14em] text-[#D9D1C5]">
                  {String(Math.round(uiProgress * 100)).padStart(2, '0')}%
                </span>
              </div>

              {framesLoadedCount < TOTAL_HERO_FRAMES && (
                <span className="sr-only">
                  Loading architectural sequence frames {framesLoadedCount} of {TOTAL_HERO_FRAMES}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

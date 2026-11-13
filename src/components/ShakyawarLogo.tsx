interface ShakyawarLogoProps {
  variant?: 'wordmark' | 'full';
  className?: string;
  showSince?: boolean;
}

/**
 * Crisp vector mark faithful to Shakyawar Design Studio's iconic SD monogram
 * (flowing S-into-D stem, stepped architectural cornice notch, circular lower bowl).
 */
export function ShakyawarMonogram({ className = 'h-9 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Flowing S ribbon & right D stem with architectural stepped cornice */}
      <path
        d="M44 4 H68 C71.5 4 74 6.5 74 10 V84 C74 88.5 70.5 92 66 92 H12 C7.5 92 4 88.5 4 84 V66 C4 74.5 11.5 84 26 84 C43 84 55 72 55 56 C55 43 45 36 30 34 L20 32.5 C12 31.2 8 27 8 20 C8 11 16 4 27 4 H36 V16 H44 V24 H52 V14 H48 V4 Z"
        fill="currentColor"
      />
      {/* Concentric circular lower D bowl */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 40 C15.85 40 6 49.85 6 62 C6 74.15 15.85 84 28 84 C40.15 84 50 74.15 50 62 C50 49.85 40.15 40 28 40 Z M28 52 C22.48 52 18 56.48 18 62 C18 67.52 22.48 72 28 72 C33.52 72 38 67.52 38 62 C38 56.48 33.52 52 28 52 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ShakyawarLogo({
  variant = 'wordmark',
  className = '',
  showSince = false,
}: ShakyawarLogoProps) {
  if (variant === 'full') {
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <div className="relative">
          {showSince && (
            <span className="absolute -top-4 right-0 text-[9px] font-semibold tracking-[0.16em] uppercase opacity-75">
              Since 1989
            </span>
          )}
          <ShakyawarMonogram className="h-16 w-14" />
        </div>
        <span className="mt-2.5 text-[11px] font-semibold tracking-[0.22em] uppercase">
          Shakyawar Design
        </span>
        <span className="font-serif text-xl font-semibold tracking-[0.26em] uppercase leading-none">
          Studio
        </span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 whitespace-nowrap shrink-0 ${className}`}>
      <ShakyawarMonogram className="h-8 w-7 shrink-0" />
      <span className="font-serif text-base font-semibold tracking-[0.14em] uppercase md:text-lg">
        SHAKYAWAR DESIGN STUDIO
      </span>
    </span>
  );
}

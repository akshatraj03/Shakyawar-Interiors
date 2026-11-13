import { STUDIO_INFO, STUDIO_MEDIA } from '../data/studioData';
import { Reveal } from './RevealSection';

const PRACTICE_PILLARS = [
  {
    code: '01',
    title: 'Space & Proportion',
    body: 'Every project opens with a careful reading of daylight, structural span, and how movement unfolds across rooms.',
  },
  {
    code: '02',
    title: 'Material Honesty',
    body: 'Warm walnut, natural vein-cut stone, textured brick, and plaster surfaces are paired so spaces age with quiet dignity.',
  },
  {
    code: '03',
    title: 'Calibrated Light & Detail',
    body: 'Concealed ceiling coves, bespoke joinery tolerances, and exterior sun-breakers resolve comfort before decoration begins.',
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Shakyawar Design Studio"
      className="scroll-mt-20 border-t border-[#D9D1C5] bg-[#F2EFE9] text-[#29241F]"
    >
      {/* Band 1: Strong Editorial Opening Statement & Overlapping Architectural Composition */}
      <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-20 md:px-12 md:pb-24 md:pt-28">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 border-b border-[#D9D1C5] pb-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#92795F]">
                The Studio · {STUDIO_INFO.locationShort} · {STUDIO_INFO.establishedNote}
              </p>
              <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.04] tracking-[-0.015em] text-[#29241F] sm:text-5xl lg:text-6xl">
                Designing spaces. Creating experiences.
              </h2>
            </div>

            <div className="lg:col-span-4 lg:pb-1">
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#6B6257]">
                Principal &amp; Associated Architect
              </p>
              <p className="mt-1 font-serif text-2xl font-medium text-[#29241F]">
                {STUDIO_INFO.principalArchitect}
              </p>
              <p className="mt-1 text-xs text-[#6B6257]">
                {STUDIO_INFO.tagline}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Asymmetrical Overlapping Photography + Practice Statement */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-7">
            <div className="relative pb-10 sm:pb-14 sm:pr-10">
              {/* Primary Studio Interior Photograph */}
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#D9D1C5]">
                <img
                  src={STUDIO_MEDIA.officeInterior}
                  alt={STUDIO_MEDIA.officeInteriorAlt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>

              {/* Overlapping Studio Stationery Detail Frame */}
              <div className="mt-4 w-full border border-[#D9D1C5] bg-[#F2EFE9] p-2 sm:absolute sm:bottom-0 sm:right-0 sm:mt-0 sm:w-[44%] sm:shadow-xl">
                <div className="aspect-[4/3] overflow-hidden bg-[#D9D1C5]">
                  <img
                    src={STUDIO_MEDIA.brandCard}
                    alt={STUDIO_MEDIA.brandCardAlt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="px-2 pb-1 pt-2 text-[11px] font-medium tracking-[0.12em] uppercase text-[#6B6257]">
                  Bicholi Hapsi Studio · Indore
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={120} className="lg:col-span-5">
            <div className="space-y-6">
              <p className="font-serif text-2xl font-medium leading-[1.32] text-[#29241F] sm:text-3xl">
                An Indore-based architecture and interior design practice turning raw shells and existing homes into purposeful living environments.
              </p>
              <p className="text-[15px] leading-[1.75] text-[#34302B]">
                Working across residential, commercial, and landscape commissions, the studio pairs creative spatial planning with functional clarity—approaching structure, interior joinery, and natural light as one unified architectural discipline.
              </p>

              {/* Authentic Studio Mark Presentation */}
              <div className="flex items-center gap-5 border-t border-[#D9D1C5] pt-6">
                <div className="h-24 w-24 shrink-0 overflow-hidden border border-[#D9D1C5] bg-[#F4F1EC] p-1.5">
                  <img
                    src={STUDIO_MEDIA.officialEmblem}
                    alt={STUDIO_MEDIA.officialEmblemAlt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#92795F]">
                    Studio Emblem
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#4E473F]">
                    Creativity, cost-conscious planning, and close attention to architectural detail across Indore and Madhya Pradesh.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Band 2: Three-Pillar Design Philosophy Strip */}
        <Reveal delayMs={160}>
          <div className="mt-20 grid grid-cols-1 gap-8 border-t border-[#D9D1C5] pt-12 md:grid-cols-3 md:gap-10">
            {PRACTICE_PILLARS.map((pillar) => (
              <div key={pillar.code} className="space-y-3">
                <span className="block font-serif text-2xl font-medium tabular-nums text-[#92795F]">
                  {pillar.code}
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#29241F]">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#4E473F]">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Band 3: Editorial Visual Transition into 3D Spatial Model */}
      <div className="border-t border-[#3E3832] bg-[#34302B] text-[#F2EFE9]">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-4 px-6 py-8 md:flex-row md:items-center md:px-12">
          <p className="font-serif text-xl italic text-[#E3DDD2] sm:text-2xl">
            &ldquo;Architecture begins where structure meets the way a space is lived in.&rdquo;
          </p>
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#A99F91] whitespace-nowrap">
            Spatial Study Below
          </span>
        </div>
      </div>
    </section>
  );
}

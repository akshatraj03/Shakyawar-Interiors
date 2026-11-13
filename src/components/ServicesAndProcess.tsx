import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  PROCESS_STAGES,
  ProjectItem,
  SELECTED_PROJECTS,
  SERVICES_LIST,
} from '../data/studioData';
import { Reveal } from './RevealSection';

interface ServicesAndProcessProps {
  onSelectProject: (project: ProjectItem) => void;
  onStartProjectForService: (serviceTitle: string) => void;
}

export function ServicesAndProcess({
  onSelectProject,
  onStartProjectForService,
}: ServicesAndProcessProps) {
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES_LIST[0].id);
  const [activeProcessIndex, setActiveProcessIndex] = useState<number>(0);

  const activeService =
    SERVICES_LIST.find((s) => s.id === activeServiceId) ?? SERVICES_LIST[0];
  const featuredProject =
    SELECTED_PROJECTS.find((p) => p.id === activeService.featuredProjectId) ??
    SELECTED_PROJECTS[0];

  return (
    <>
      {/* Editorial Services Section (Deep Espresso Surface Contrast) */}
      <section
        id="services"
        aria-label="Studio Services"
        className="scroll-mt-20 bg-[#29241F] text-[#F2EFE9]"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
          <Reveal>
            <div className="flex flex-col gap-6 border-b border-[#3E3832] pb-12 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#A99F91]">
                  Practice &amp; Capabilities · Six Disciplines
                </p>
                <h2 className="mt-3 font-serif text-4xl font-medium leading-[1.06] text-[#F2EFE9] sm:text-5xl">
                  Disciplines built around spatial clarity.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[#D9D1C5]">
                From structural planning and turnkey interiors to courtyard landscapes and bespoke 3D joinery, select a discipline to explore our architectural approach.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            {/* Editorial Interactive Service Index List */}
            <div className="divide-y divide-[#3E3832] border-b border-[#3E3832] lg:col-span-7">
              {SERVICES_LIST.map((service) => {
                const isSelected = service.id === activeService.id;
                return (
                  <div key={service.id} className="py-7 first:pt-0">
                    <button
                      type="button"
                      onClick={() => setActiveServiceId(service.id)}
                      aria-expanded={isSelected}
                      className="group flex min-h-[44px] w-full items-baseline justify-between gap-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#92795F]"
                    >
                      <div className="flex items-baseline gap-5">
                        <span
                          className={`text-xs font-medium tabular-nums tracking-[0.16em] transition-colors ${
                            isSelected ? 'text-[#92795F]' : 'text-[#A99F91]'
                          }`}
                        >
                          {service.index}
                        </span>
                        <div>
                          <h3
                            className={`font-serif text-2xl font-medium transition-colors sm:text-3xl ${
                              isSelected
                                ? 'text-[#F2EFE9]'
                                : 'text-[#D9D1C5] group-hover:text-[#F2EFE9]'
                            }`}
                          >
                            {service.title}
                          </h3>
                          <p className="mt-1 text-xs tracking-[0.1em] uppercase text-[#A99F91]">
                            {service.subtitle}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 text-xs font-medium tracking-[0.14em] uppercase transition-colors ${
                          isSelected ? 'text-[#92795F]' : 'text-[#A99F91] group-hover:text-[#F2EFE9]'
                        }`}
                      >
                        {isSelected ? 'Active' : 'Explore'}
                      </span>
                    </button>

                    {isSelected && (
                      <div className="mt-5 space-y-5 pl-9 pr-2">
                        <p className="max-w-xl text-sm leading-relaxed text-[#D9D1C5]">
                          {service.description}
                        </p>

                        <div className="border-t border-[#3E3832] pt-4">
                          <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#92795F]">
                            Why This Approach Matters
                          </p>
                          <p className="mt-1.5 max-w-xl font-serif text-lg italic leading-relaxed text-[#E3DDD2]">
                            {service.whyItMatters}
                          </p>
                        </div>

                        <ul className="space-y-2 text-xs text-[#A99F91]">
                          {service.deliverables.map((item) => (
                            <li key={item} className="flex items-start gap-2.5">
                              <span
                                aria-hidden="true"
                                className="mt-1.5 h-1 w-1 shrink-0 bg-[#92795F]"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => onStartProjectForService(service.title)}
                            className="inline-flex min-h-[44px] items-center gap-2 bg-[#F2EFE9] px-5 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#29241F] transition-colors hover:bg-[#D9D1C5]"
                          >
                            Enquire About {service.title}
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sticky Synchronized Reference Commission */}
            <div className="lg:sticky lg:top-28 lg:col-span-5">
              <div className="border border-[#3E3832] bg-[#231F1B] p-4 sm:p-5">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#1A1612]">
                  <img
                    src={featuredProject.image}
                    alt={featuredProject.imageAlt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700"
                  />
                </div>
                <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#3E3832] pt-4">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#92795F]">
                      Reference Commission · {featuredProject.index}
                    </p>
                    <p className="mt-1 font-serif text-2xl text-[#F2EFE9]">
                      {featuredProject.title}
                    </p>
                    <p className="mt-1 text-xs text-[#A99F91]">
                      {featuredProject.scope} · {featuredProject.location}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectProject(featuredProject)}
                    className="shrink-0 text-xs font-medium tracking-[0.12em] uppercase text-[#D9D1C5] underline decoration-[#92795F] underline-offset-4 hover:text-[#F2EFE9]"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Design Process Section (Warm Limestone / Ivory Contrast) */}
      <section
        id="process"
        aria-label="Design Process"
        className="border-t border-[#D9D1C5] bg-[#EAE4DA] text-[#29241F]"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#92795F]">
                  Methodology · Four Stages
                </p>
                <h2 className="mt-3 font-serif text-4xl font-medium leading-[1.06] text-[#29241F] sm:text-5xl">
                  How an idea becomes an environment.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[#4E473F]">
                A disciplined progression from initial spatial study to detail-resolved execution across residential and commercial sites.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STAGES.map((stage, idx) => {
                const isSelected = idx === activeProcessIndex;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => setActiveProcessIndex(idx)}
                    aria-pressed={isSelected}
                    className={`flex flex-col justify-between border p-7 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#92795F] ${
                      isSelected
                        ? 'border-[#29241F] bg-[#29241F] text-[#F2EFE9]'
                        : 'border-[#CFC6B8] bg-[#F2EFE9] text-[#29241F] hover:border-[#92795F]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-3xl font-medium tabular-nums text-[#92795F]">
                          {stage.step}
                        </span>
                        <span
                          className={`text-[11px] font-medium tracking-[0.16em] uppercase ${
                            isSelected ? 'text-[#D9D1C5]' : 'text-[#6B6257]'
                          }`}
                        >
                          Stage {stage.step}
                        </span>
                      </div>

                      <h3 className="mt-6 font-serif text-2xl font-medium leading-snug">
                        {stage.title}
                      </h3>
                      <p
                        className={`mt-2 text-xs font-medium tracking-[0.06em] ${
                          isSelected ? 'text-[#D9D1C5]' : 'text-[#6B6257]'
                        }`}
                      >
                        {stage.summary}
                      </p>
                    </div>

                    <p
                      className={`mt-6 border-t pt-5 text-sm leading-relaxed ${
                        isSelected
                          ? 'border-[#3E3832] text-[#D9D1C5]'
                          : 'border-[#D9D1C5] text-[#4E473F]'
                      }`}
                    >
                      {stage.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

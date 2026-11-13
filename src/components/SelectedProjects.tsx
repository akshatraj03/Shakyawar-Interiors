import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ProjectItem, SELECTED_PROJECTS } from '../data/studioData';
import { Reveal } from './RevealSection';

interface SelectedProjectsProps {
  activeModalProject: ProjectItem | null;
  onOpenProject: (project: ProjectItem) => void;
  onCloseProject: () => void;
  onEnquireAboutCategory: (category: string) => void;
}

const FILTER_TABS = [
  { id: 'all', label: 'All Works' },
  { id: 'Architecture & Planning', label: 'Architecture & Planning' },
  { id: 'Residential Interior Design', label: 'Residential Interiors' },
  { id: 'Commercial & Renovations', label: 'Commercial & Renovations' },
  { id: 'Landscape Planning & Courtyards', label: 'Landscape' },
] as const;

export function SelectedProjects({
  activeModalProject,
  onOpenProject,
  onCloseProject,
  onEnquireAboutCategory,
}: SelectedProjectsProps) {
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = SELECTED_PROJECTS.filter((project) => {
    if (filter === 'all') return true;
    if (filter === 'Commercial & Renovations') {
      return (
        project.category === 'Commercial & Office Interiors' ||
        project.category === 'Home Renovations & Space Planning'
      );
    }
    return project.category === filter;
  });

  useEffect(() => {
    if (!activeModalProject) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseProject();
      } else if (e.key === 'ArrowRight') {
        const idx = SELECTED_PROJECTS.findIndex((p) => p.id === activeModalProject.id);
        const next = SELECTED_PROJECTS[(idx + 1) % SELECTED_PROJECTS.length];
        onOpenProject(next);
      } else if (e.key === 'ArrowLeft') {
        const idx = SELECTED_PROJECTS.findIndex((p) => p.id === activeModalProject.id);
        const prev =
          SELECTED_PROJECTS[(idx - 1 + SELECTED_PROJECTS.length) % SELECTED_PROJECTS.length];
        onOpenProject(prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeModalProject, onCloseProject, onOpenProject]);

  const navigateModal = (dir: 1 | -1) => {
    if (!activeModalProject) return;
    const idx = SELECTED_PROJECTS.findIndex((p) => p.id === activeModalProject.id);
    const nextIdx = (idx + dir + SELECTED_PROJECTS.length) % SELECTED_PROJECTS.length;
    onOpenProject(SELECTED_PROJECTS[nextIdx]);
  };

  const isUnfiltered = filter === 'all';
  const leadProject = isUnfiltered ? filteredProjects[0] : null;
  const gridProjects = isUnfiltered ? filteredProjects.slice(1, 5) : filteredProjects;
  const closingProject = isUnfiltered && filteredProjects.length > 5 ? filteredProjects[5] : null;

  return (
    <section
      id="projects"
      aria-label="Selected Works Portfolio"
      className="scroll-mt-20 border-t border-[#D9D1C5] bg-[#F2EFE9] text-[#29241F]"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        {/* Editorial Monograph Header & Discipline Filter */}
        <Reveal>
          <div className="flex flex-col gap-8 border-b border-[#D9D1C5] pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#92795F]">
                Selected Works · Indore &amp; Madhya Pradesh
              </p>
              <h2 className="mt-3 font-serif text-4xl font-medium leading-[1.06] tracking-[-0.015em] text-[#29241F] sm:text-5xl">
                Spaces shaped with proportion and craft.
              </h2>
            </div>

            <div
              role="group"
              aria-label="Filter portfolio by discipline"
              className="flex flex-wrap items-center gap-1 bg-[#E7E1D6] p-1 lg:flex-nowrap lg:shrink-0"
            >
              {FILTER_TABS.map((tab) => {
                const active = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`min-h-[38px] px-3.5 py-2 text-xs font-medium tracking-[0.05em] whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-[#29241F] text-[#F2EFE9]'
                        : 'text-[#34302B] hover:text-[#29241F]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Featured Lead Monograph Spread (Unfiltered View) */}
        {leadProject && (
          <Reveal delayMs={80}>
            <article className="group mt-14 border-b border-[#D9D1C5] pb-16">
              <button
                type="button"
                onClick={() => onOpenProject(leadProject)}
                aria-label={`Inspect featured project ${leadProject.title}`}
                className="grid w-full grid-cols-1 gap-8 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#92795F] lg:grid-cols-12 lg:items-center lg:gap-12"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#D9D1C5] lg:col-span-7 lg:aspect-[16/11]">
                  <img
                    src={leadProject.image}
                    alt={leadProject.imageAlt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[#29241F]/0 transition-colors duration-300 group-hover:bg-[#29241F]/10"
                  />
                </div>

                <div className="flex flex-col justify-between lg:col-span-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase text-[#92795F]">
                      <span className="tabular-nums">{leadProject.index}</span>
                      <span aria-hidden="true">·</span>
                      <span>Featured Commission</span>
                    </div>

                    <h3 className="mt-4 font-serif text-3xl font-medium leading-[1.08] text-[#29241F] transition-colors group-hover:text-[#92795F] sm:text-4xl lg:text-5xl">
                      {leadProject.title}
                    </h3>

                    <p className="mt-3 text-xs font-medium tracking-[0.12em] uppercase text-[#6B6257]">
                      {leadProject.category} · {leadProject.scope}
                    </p>

                    <p className="mt-5 text-[15px] leading-relaxed text-[#34302B]">
                      {leadProject.description}
                    </p>

                    <ul className="mt-6 space-y-2 border-t border-[#D9D1C5] pt-5 text-xs text-[#4E473F]">
                      {leadProject.architecturalNotes.map((note) => (
                        <li key={note} className="flex items-start gap-2.5">
                          <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 bg-[#92795F]" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-[#D9D1C5] pt-4">
                    <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[#29241F] group-hover:text-[#92795F]">
                      Inspect Architectural Monograph
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center border border-[#D9D1C5] text-[#29241F] transition-colors group-hover:border-[#29241F] group-hover:bg-[#29241F] group-hover:text-[#F2EFE9]">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </button>
            </article>
          </Reveal>
        )}

        {/* Asymmetrical Editorial Project Pairings */}
        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-12">
          {gridProjects.map((project, idx) => {
            const layoutClass = isUnfiltered
              ? idx === 0
                ? 'md:col-span-7'
                : idx === 1
                  ? 'md:col-span-5'
                  : idx === 2
                    ? 'md:col-span-5'
                    : 'md:col-span-7'
              : 'md:col-span-6';

            const imageAspectClass = isUnfiltered
              ? idx === 0 || idx === 3
                ? 'aspect-[16/10]'
                : 'aspect-[4/4]'
              : 'aspect-[4/3]';

            return (
              <Reveal key={project.id} delayMs={idx * 70} className={layoutClass}>
                <article className="group flex h-full flex-col">
                  <button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    aria-label={`Inspect project ${project.title}`}
                    className="flex h-full w-full flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#92795F]"
                  >
                    <div className={`relative w-full overflow-hidden bg-[#D9D1C5] ${imageAspectClass}`}>
                      <img
                        src={project.image}
                        alt={project.imageAlt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[#29241F]/0 transition-colors duration-300 group-hover:bg-[#29241F]/10"
                      />
                    </div>

                    <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-[#D9D1C5] pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B6257]">
                          <span className="font-medium tabular-nums text-[#92795F]">
                            {project.index}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{project.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{project.location}</span>
                        </div>
                        <h3 className="mt-1.5 font-serif text-2xl font-medium text-[#29241F] transition-colors group-hover:text-[#92795F] sm:text-3xl">
                          {project.title}
                        </h3>
                      </div>

                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#D9D1C5] text-[#29241F] transition-colors group-hover:border-[#29241F] group-hover:bg-[#29241F] group-hover:text-[#F2EFE9]">
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#4E473F]">
                      {project.description}
                    </p>
                    <p className="mt-2 text-[11px] font-medium tracking-[0.14em] uppercase text-[#92795F]">
                      {project.scope}
                    </p>
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Closing Wide Institutional Monograph Spread (Unfiltered View) */}
        {closingProject && (
          <Reveal delayMs={100}>
            <article className="group mt-16 border-t border-[#D9D1C5] pt-14">
              <button
                type="button"
                onClick={() => onOpenProject(closingProject)}
                aria-label={`Inspect project ${closingProject.title}`}
                className="grid w-full grid-cols-1 gap-8 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#92795F] lg:grid-cols-12 lg:items-center lg:gap-12"
              >
                <div className="order-2 flex flex-col justify-between lg:order-1 lg:col-span-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6B6257]">
                      <span className="font-medium tabular-nums text-[#92795F]">
                        {closingProject.index}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{closingProject.category}</span>
                    </div>
                    <h3 className="mt-3 font-serif text-3xl font-medium text-[#29241F] transition-colors group-hover:text-[#92795F] sm:text-4xl">
                      {closingProject.title}
                    </h3>
                    <p className="mt-2 text-xs font-medium tracking-[0.12em] uppercase text-[#6B6257]">
                      {closingProject.scope} · {closingProject.location}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-[#4E473F]">
                      {closingProject.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#D9D1C5] pt-4">
                    <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[#29241F] group-hover:text-[#92795F]">
                      View Project Details
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center border border-[#D9D1C5] text-[#29241F] transition-colors group-hover:border-[#29241F] group-hover:bg-[#29241F] group-hover:text-[#F2EFE9]">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>

                <div className="order-1 relative aspect-[16/9] w-full overflow-hidden bg-[#D9D1C5] lg:order-2 lg:col-span-8 lg:aspect-[21/10]">
                  <img
                    src={closingProject.image}
                    alt={closingProject.imageAlt}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[#29241F]/0 transition-colors duration-300 group-hover:bg-[#29241F]/10"
                  />
                </div>
              </button>
            </article>
          </Reveal>
        )}
      </div>

      {/* Fullscreen Architectural Project Lightbox */}
      {activeModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeModalProject.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1612]/90 p-4 md:p-8"
          onClick={onCloseProject}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-y-auto border border-[#3E3832] bg-[#F2EFE9] text-[#29241F] lg:grid lg:grid-cols-12 lg:overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Pane */}
            <div className="relative bg-[#1E1A16] lg:col-span-7">
              <img
                src={activeModalProject.image}
                alt={activeModalProject.imageAlt}
                referrerPolicy="no-referrer"
                className="h-full max-h-[55vh] w-full object-contain lg:max-h-[85vh] lg:object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateModal(-1)}
                  aria-label="Previous project"
                  className="inline-flex h-11 w-11 items-center justify-center bg-[#1E1A16]/85 text-[#F2EFE9] transition-colors hover:bg-[#92795F]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateModal(1)}
                  aria-label="Next project"
                  className="inline-flex h-11 w-11 items-center justify-center bg-[#1E1A16]/85 text-[#F2EFE9] transition-colors hover:bg-[#92795F]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Architectural Details Pane */}
            <div className="flex flex-col justify-between p-6 md:p-10 lg:col-span-5">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase text-[#92795F]">
                    <span className="tabular-nums">{activeModalProject.index}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeModalProject.scope}</span>
                  </div>
                  <button
                    type="button"
                    onClick={onCloseProject}
                    aria-label="Close project viewer"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[#D9D1C5] text-[#29241F] transition-colors hover:bg-[#29241F] hover:text-[#F2EFE9]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="mt-4 font-serif text-3xl font-medium leading-tight text-[#29241F] sm:text-4xl">
                  {activeModalProject.title}
                </h3>

                <p className="mt-2 text-xs font-medium tracking-[0.12em] uppercase text-[#6B6257]">
                  {activeModalProject.category} · {activeModalProject.location}
                </p>

                <p className="mt-6 text-sm leading-relaxed text-[#34302B]">
                  {activeModalProject.description}
                </p>

                <div className="mt-8 border-t border-[#D9D1C5] pt-6">
                  <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#92795F]">
                    Architectural Elements
                  </p>
                  <ul className="mt-4 space-y-2.5 text-sm text-[#34302B]">
                    {activeModalProject.architecturalNotes.map((note) => (
                      <li key={note} className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-[#92795F]" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#D9D1C5] pt-6">
                <button
                  type="button"
                  onClick={() => {
                    const cat = activeModalProject.category;
                    onCloseProject();
                    onEnquireAboutCategory(cat);
                  }}
                  className="bg-[#29241F] px-5 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#F2EFE9] transition-colors hover:bg-[#34302B]"
                >
                  Discuss a Similar Space
                </button>
                <span className="text-xs tabular-nums text-[#6B6257]">
                  {activeModalProject.index} / {String(SELECTED_PROJECTS.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

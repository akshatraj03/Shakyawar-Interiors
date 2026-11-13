import { STUDIO_INFO } from '../data/studioData';
import { ShakyawarLogo } from './ShakyawarLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

const FOOTER_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Studio' },
  { id: 'architecture-3d', label: '3D Model' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-[#34302B] bg-[#1E1A16] text-[#D9D1C5]">
      <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-12 md:py-16">
        <div className="flex flex-col justify-between gap-10 border-b border-[#34302B] pb-12 lg:flex-row lg:items-end">
          <div className="space-y-4">
            <ShakyawarLogo variant="wordmark" className="text-[#F2EFE9]" />
            <p className="text-xs tracking-[0.16em] uppercase text-[#92795F]">
              {STUDIO_INFO.tagline}
            </p>
            <div className="space-y-1 text-xs leading-relaxed text-[#A99F91]">
              <p>
                Principal Architect: {STUDIO_INFO.principalArchitect} · {STUDIO_INFO.establishedNote}
              </p>
              <p className="max-w-md">{STUDIO_INFO.address}</p>
              <p className="tabular-nums">
                {STUDIO_INFO.phoneDisplay} · {STUDIO_INFO.secondaryPhones.join(' · ')} ·{' '}
                <a
                  href={`mailto:${STUDIO_INFO.email}`}
                  className="text-[#D9D1C5] hover:text-[#F2EFE9]"
                >
                  {STUDIO_INFO.email}
                </a>
              </p>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-7 gap-y-3 text-xs tracking-[0.14em] uppercase"
          >
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.id);
                }}
                className="text-[#D9D1C5] transition-colors hover:text-[#F2EFE9]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 text-xs text-[#A99F91] sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {STUDIO_INFO.name}. Indore, Madhya Pradesh.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href={STUDIO_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D9D1C5] transition-colors hover:text-[#F2EFE9]"
            >
              WhatsApp Consultation
            </a>
            <a
              href={STUDIO_INFO.mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D9D1C5] transition-colors hover:text-[#F2EFE9]"
            >
              Google Maps
            </a>
            <a
              href={STUDIO_INFO.instagramSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#F2EFE9]"
            >
              Instagram Tag
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

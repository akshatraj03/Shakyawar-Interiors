import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ShakyawarLogo } from './ShakyawarLogo';

export interface NavSection {
  id: string;
  label: string;
}

const NAV_LINKS: NavSection[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Studio' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen]);

  const handleLinkClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  const solidHeader = isScrolled || mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        solidHeader
          ? 'bg-[#F2EFE9] text-[#29241F] border-b border-[#D9D1C5]'
          : 'bg-gradient-to-b from-[#1A1612]/80 via-[#1A1612]/40 to-transparent text-[#F2EFE9]'
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-5 py-3.5 md:px-12">
        {/* Zone 1: Integrated SD Monogram + Studio Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          aria-label="Shakyawar Design Studio Home"
          className="inline-flex items-center whitespace-nowrap shrink-0 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#92795F]"
        >
          <ShakyawarLogo variant="wordmark" />
        </a>

        {/* Zone 2: Clean Editorial Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 text-xs font-medium tracking-[0.16em] uppercase whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#92795F] ${
                  isActive
                    ? solidHeader
                      ? 'text-[#29241F]'
                      : 'text-[#F2EFE9]'
                    : solidHeader
                      ? 'text-[#29241F]/65 hover:text-[#29241F]'
                      : 'text-[#F2EFE9]/75 hover:text-[#F2EFE9]'
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[1px] transition-transform duration-200 origin-left ${
                    solidHeader ? 'bg-[#92795F]' : 'bg-[#F2EFE9]'
                  } ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className={`hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-medium tracking-[0.14em] uppercase whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#92795F] ${
              solidHeader
                ? 'bg-[#29241F] text-[#F2EFE9] hover:bg-[#34302B]'
                : 'bg-[#F2EFE9] text-[#29241F] hover:bg-[#D9D1C5]'
            }`}
          >
            Start a Project
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`inline-flex h-11 w-11 items-center justify-center lg:hidden transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#92795F] ${
              solidHeader
                ? 'text-[#29241F] hover:bg-[#D9D1C5]/50'
                : 'text-[#F2EFE9] hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <div
        className={`overflow-hidden border-t border-[#D9D1C5] bg-[#F2EFE9] transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0 border-t-0 pointer-events-none'
        }`}
      >
        <div className="px-6 pb-6 pt-3">
          <nav aria-label="Mobile navigation" className="flex flex-col divide-y divide-[#D9D1C5]/70">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id);
                  }}
                  className={`flex min-h-[44px] items-center justify-between py-3 text-sm font-medium tracking-[0.14em] uppercase transition-colors ${
                    isActive ? 'text-[#92795F]' : 'text-[#29241F]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="text-[11px] tracking-[0.12em]">Active</span>}
                </a>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="mt-4 w-full min-h-[44px] bg-[#29241F] px-5 py-3 text-xs font-medium tracking-[0.14em] uppercase text-[#F2EFE9] transition-colors hover:bg-[#34302B]"
          >
            Start a Project
          </button>
        </div>
      </div>
    </header>
  );
}

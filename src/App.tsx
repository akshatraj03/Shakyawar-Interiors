import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroTransformation } from './components/HeroTransformation';
import { AboutSection } from './components/AboutSection';
import { InteractiveBuilding3D } from './components/InteractiveBuilding3D';
import { SelectedProjects } from './components/SelectedProjects';
import { ServicesAndProcess } from './components/ServicesAndProcess';
import { TrustAndContact } from './components/TrustAndContact';
import { Footer } from './components/Footer';
import { ProjectItem } from './data/studioData';

const TRACKED_SECTIONS = ['home', 'about', 'architecture-3d', 'projects', 'services', 'contact'];

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);
  const [enquiryDiscipline, setEnquiryDiscipline] = useState<string | undefined>(undefined);

  const navigateTo = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibilityMap = new Map<string, number>();

    TRACKED_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibilityMap.set(id, entry.intersectionRatio);
          });
          let bestId = 'home';
          let bestRatio = -1;
          visibilityMap.forEach((ratio, secId) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = secId;
            }
          });
          if (bestRatio > 0) {
            const normalized = bestId === 'architecture-3d' ? 'projects' : bestId;
            setActiveSection(normalized);
          }
        },
        { threshold: [0.1, 0.35, 0.6] },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleEnquireForDiscipline = useCallback(
    (discipline: string) => {
      setEnquiryDiscipline(discipline);
      navigateTo('contact');
    },
    [navigateTo],
  );

  return (
    <div className="min-h-screen bg-[#F2EFE9] text-[#29241F]">
      <Navbar activeSection={activeSection} onNavigate={navigateTo} />

      <main>
        <HeroTransformation
          onExploreWork={() => navigateTo('architecture-3d')}
          onStartConversation={() => navigateTo('contact')}
        />

        <AboutSection />

        <InteractiveBuilding3D onSelectProject={(project) => setModalProject(project)} />

        <SelectedProjects
          activeModalProject={modalProject}
          onOpenProject={(project) => setModalProject(project)}
          onCloseProject={() => setModalProject(null)}
          onEnquireAboutCategory={handleEnquireForDiscipline}
        />

        <ServicesAndProcess
          onSelectProject={(project) => setModalProject(project)}
          onStartProjectForService={handleEnquireForDiscipline}
        />

        <TrustAndContact preselectedDiscipline={enquiryDiscipline} />
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

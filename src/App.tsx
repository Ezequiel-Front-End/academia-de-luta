import { useState } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProgramsSection } from './components/ProgramsSection';
import { FightersSection } from './components/FightersSection';
import { ScheduledFightsSection } from './components/ScheduledFightsSection';
import { AboutSection } from './components/AboutSection';
import { ScheduleSection } from './components/ScheduleSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FighterDetailModal } from './components/FighterDetailModal';
import { FightDetailModal } from './components/FightDetailModal';
import { VideoModal } from './components/VideoModal';
import { RevealOnScroll } from './components/RevealOnScroll';

import {
  FIGHTERS_DATA,
  SCHEDULED_FIGHTS_DATA,
  PROGRAMS_DATA,
  WEEKLY_SCHEDULE,
  TESTIMONIALS_DATA,
  GYM_INFO,
} from './data/gymData';
import { Fighter, ScheduledFight } from './types';
import { MessageSquare, ArrowUp } from 'lucide-react';

export default function App() {
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [selectedFight, setSelectedFight] = useState<ScheduledFight | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('inicio');

  // Contact form pre-fill state
  const [contactProgram, setContactProgram] = useState<string>('');
  const [contactTime, setContactTime] = useState<string>('');
  const [cheerFighterName, setCheerFighterName] = useState<string>('');
  const [showCheerToast, setShowCheerToast] = useState(false);

  const scrollToContact = () => {
    const el = document.getElementById('contato');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClaimOffer = () => {
    scrollToContact();
  };

  const handleStartJourney = () => {
    scrollToContact();
  };

  const handleBookClass = (programTitle: string) => {
    setContactProgram(programTitle);
    scrollToContact();
  };

  const handleBookClassForTime = (programName: string, time: string) => {
    setContactProgram(programName);
    setContactTime(time);
    scrollToContact();
  };

  const handleViewScheduledFight = (fightId: string) => {
    const fight = SCHEDULED_FIGHTS_DATA.find((f) => f.id === fightId);
    if (fight) {
      setSelectedFight(fight);
    } else {
      const el = document.getElementById('lutas-agendadas');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheerFighter = (fighterName: string) => {
    setCheerFighterName(fighterName);
    setShowCheerToast(true);
    setTimeout(() => setShowCheerToast(false), 5000);
    scrollToContact();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">

      {/* Main Top Navigation Header */}
      <Navbar
        activeSection={activeNav}
        onOpenBooking={scrollToContact}
      />

      <main className="flex-1">
        {/* Hero Section matching the user's reference design */}
        <HeroSection
          onStartJourney={handleStartJourney}
          onWatchVideo={() => setIsVideoModalOpen(true)}
        />

        {/* Core Requirement 2: Scheduled Fights with Live Countdown & Matchup Showcase */}
        <RevealOnScroll>
          <ScheduledFightsSection
            fights={SCHEDULED_FIGHTS_DATA}
            onSelectFight={(fight) => setSelectedFight(fight)}
            onCheerFighter={handleCheerFighter}
          />
        </RevealOnScroll>

        {/* Core Requirement 1: Official Fighters Roster Presentation */}
        <RevealOnScroll>
          <FightersSection
            fighters={FIGHTERS_DATA}
            onSelectFighter={(fighter) => setSelectedFighter(fighter)}
            onViewScheduledFight={handleViewScheduledFight}
          />
        </RevealOnScroll>

        {/* Programs / Martial Arts Disciplines Section */}
        <RevealOnScroll>
          <ProgramsSection
            programs={PROGRAMS_DATA}
            onBookClass={handleBookClass}
          />
        </RevealOnScroll>

        {/* About Section with 4 Key Counters */}
        <RevealOnScroll>
          <AboutSection
            onTourGym={() => setIsVideoModalOpen(true)}
          />
        </RevealOnScroll>

        {/* Interactive Weekly Class Schedule */}
        <RevealOnScroll>
          <ScheduleSection
            schedule={WEEKLY_SCHEDULE}
            onBookClassForTime={handleBookClassForTime}
          />
        </RevealOnScroll>

        {/* Testimonials & Transformations */}
        <RevealOnScroll>
          <TestimonialsSection
            testimonials={TESTIMONIALS_DATA}
          />
        </RevealOnScroll>

        {/* Core Requirement 3: Contact Channels & Free Trial Booking Form */}
        <RevealOnScroll>
          <ContactSection
            initialProgram={contactProgram}
            initialTime={contactTime}
            cheerFighterName={cheerFighterName}
          />
        </RevealOnScroll>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <FighterDetailModal
        fighter={selectedFighter}
        onClose={() => setSelectedFighter(null)}
        onViewScheduledFight={handleViewScheduledFight}
      />

      <FightDetailModal
        fight={selectedFight}
        onClose={() => setSelectedFight(null)}
        onCheerFighter={handleCheerFighter}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onBookTrial={() => {
          setIsVideoModalOpen(false);
          scrollToContact();
        }}
      />

      {/* Cheer Notification Toast */}
      {showCheerToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#161622] border border-red-500/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-semibold">
            Mensagem de apoio iniciada para <strong className="text-red-400">{cheerFighterName}</strong>! Conclua o contato abaixo para enviarmos ao atleta.
          </span>
        </aside>
      )}

      {/* Floating Action Button: Quick WhatsApp Direct Access */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        <a
          href={`https://wa.me/${GYM_INFO.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre as aulas e planos da Knockout Fight Gym!')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-emerald-950/60 transition-all hover:scale-105 group"
          aria-label="Abrir WhatsApp da Academia"
          title="Falar no WhatsApp da Academia"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>

        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-[#181822] hover:bg-[#222230] border border-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center shadow-lg transition-colors mx-auto"
          aria-label="Voltar ao topo"
          title="Voltar ao topo"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

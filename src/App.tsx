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
      {/* Top Promotional Announcement Banner */}
      <AnnouncementBar onClaimOffer={handleClaimOffer} />

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
        <ScheduledFightsSection
          fights={SCHEDULED_FIGHTS_DATA}
          onSelectFight={(fight) => setSelectedFight(fight)}
          onCheerFighter={handleCheerFighter}
        />

        {/* Core Requirement 1: Official Fighters Roster Presentation */}
        <FightersSection
          fighters={FIGHTERS_DATA}
          onSelectFighter={(fighter) => setSelectedFighter(fighter)}
          onViewScheduledFight={handleViewScheduledFight}
        />

        {/* Programs / Martial Arts Disciplines Section */}
        <ProgramsSection
          programs={PROGRAMS_DATA}
          onBookClass={handleBookClass}
        />

        {/* About Section with 4 Key Counters */}
        <AboutSection
          onTourGym={() => setIsVideoModalOpen(true)}
        />

        {/* Interactive Weekly Class Schedule */}
        <ScheduleSection
          schedule={WEEKLY_SCHEDULE}
          onBookClassForTime={handleBookClassForTime}
        />

        {/* Testimonials & Transformations */}
        <TestimonialsSection
          testimonials={TESTIMONIALS_DATA}
        />

        {/* Core Requirement 3: Contact Channels & Free Trial Booking Form */}
        <ContactSection
          initialProgram={contactProgram}
          initialTime={contactTime}
          cheerFighterName={cheerFighterName}
        />
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
          <MessageSquare className="w-6 h-6 fill-white/20" />
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

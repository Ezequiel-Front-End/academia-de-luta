import { useState, useEffect } from 'react';
import { Menu, X, Flame, ShieldAlert, Lock } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  activeSection: string;
  onOpenAdmin?: () => void;
}

export function Navbar({ onOpenBooking, onOpenAdmin }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Modalidades', href: '#programas' },
    { label: 'Lutadores', href: '#lutadores' },
    { label: 'Próximas Lutas', href: '#lutas-agendadas' },
    { label: 'Horários', href: '#horarios' },
    { label: 'A Academia', href: '#sobre' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-[#0a0a0d]/90 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/50 py-0'
          : 'bg-transparent border-b border-transparent py-2 sm:py-3'
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ease-in-out ${
          isScrolled ? 'h-16' : 'h-24'
        }`}
      >
        {/* Zone 1: Brand Wordmark */}
        <a 
          href="#inicio" 
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-wider text-white leading-none">
              BBT
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-red-500 leading-tight">
              BRAZILIAN BLACK THAI
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-red-500 transition-colors focus:outline-none focus-visible:text-red-500"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Admin */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 hover:border-red-500/50 rounded transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 group cursor-pointer"
            title="Acesso Administrativo"
          >
            <Lock className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
            <span>Admin</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
          >
            TREINE CONOSCO
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d12] border-b border-neutral-800 px-5 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleLinkClick}
                className="text-sm font-semibold uppercase tracking-wider text-neutral-200 hover:text-red-500 py-1.5 transition-colors border-b border-neutral-800/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin?.();
              }}
              className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-200 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors"
            >
              <Lock className="w-4 h-4 text-red-500" />
              <span>Painel Admin</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded shadow-md"
            >
              AGENDAR AULA EXPERIMENTAL
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

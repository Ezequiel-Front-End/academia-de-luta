import { useState } from 'react';
import { Menu, X, Flame } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
  activeSection: string;
}

export function Navbar({ onOpenBooking }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-[#0a0a0d]/90 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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
              KNOCKOUT
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-red-500 leading-tight">
              FIGHT GYM
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

        {/* Zone 3: Primary Action */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
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

          <div className="pt-2">
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

import { X, Play, Volume2, Shield } from 'lucide-react';
import { GymImage } from './GymImage';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTrial: () => void;
}

export function VideoModal({ isOpen, onClose, onBookTrial }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl bg-[#101015] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#14141c]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs uppercase tracking-widest text-white font-bold font-heading">
              KNOCKOUT GYM · HIGHLIGHT REEL & CAMP 2026
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Display Container */}
        <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
          <GymImage
            src="https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=1200&q=80"
            alt="Highlights de treino na Knockout Gym"
            className="w-full h-full object-cover opacity-80"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

          {/* Central Play Badge */}
          <div className="relative z-10 text-center space-y-3 p-6 max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-600/90 border-2 border-white/40 flex items-center justify-center mx-auto text-white shadow-2xl shadow-red-600/60 animate-pulse">
              <Play className="w-7 h-7 fill-white ml-1" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 block font-heading">
                TOUR VIRTUAL & BASTIDORES DE COMPETIÇÃO
              </span>
              <h3 className="text-xl sm:text-2xl font-bold uppercase text-white font-heading mt-1">
                A Energia do Tatame Knockout
              </h3>
              <p className="text-xs text-neutral-300 mt-1">
                Conheça nossos 1.200m² de estrutura, octógono com medidas do UFC, ringue profissional e a preparação dos atletas.
              </p>
            </div>
          </div>

          {/* Simulated Controls Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-xs text-white/80 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-mono text-[11px]">02:45 / 03:12 · 4K UHD</span>
            </div>
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-neutral-300" />
              <span className="text-[10px] uppercase font-bold text-neutral-300">Som Ligado</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#14141c] border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <Shield className="w-4 h-4 text-red-500" />
            <span>Quer sentir essa adrenalina na pele? Venha fazer uma aula prática.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onBookTrial();
              }}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
            >
              Agendar Minha Aula Agora
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

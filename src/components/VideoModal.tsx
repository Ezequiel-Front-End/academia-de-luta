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
        <div className="relative aspect-video bg-black overflow-hidden">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/C4A7HbZYmz0?autoplay=1"
            title="A Energia do Tatame Knockout"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
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

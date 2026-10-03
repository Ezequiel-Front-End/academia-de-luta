import { X, Calendar, MapPin, Tv, Ticket, Swords, Trophy, Shield, Share2 } from 'lucide-react';
import { ScheduledFight } from '../types';
import { GymImage } from './GymImage';
import { useState } from 'react';

interface FightDetailModalProps {
  fight: ScheduledFight | null;
  onClose: () => void;
  onCheerFighter?: (fighterName: string) => void;
}

export function FightDetailModal({ fight, onClose, onCheerFighter }: FightDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!fight) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Acompanhe a luta de ${fight.fighterName} (${fight.fighterNickname}) no ${fight.event} em ${fight.date} às ${fight.time}!`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-3xl bg-[#101015] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#14141c]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-neutral-300 font-bold font-heading">
              {fight.promotion} · CARD OFICIAL
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Title Fight Alert */}
          {fight.isTitleFight && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                  DISPUTA OFICIAL DE CINTURÃO
                </span>
                <span className="text-xs sm:text-sm font-bold text-white">
                  {fight.titleName || 'Cinturão em Jogo'}
                </span>
              </div>
            </div>
          )}

          {/* Event & Match Title */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-500">
              {fight.status}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide mt-1">
              {fight.event}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {fight.weightClass} · {fight.rounds} Rounds regulamentares
            </p>
          </div>

          {/* Face-off / Matchup Comparison */}
          <div className="bg-[#15151e] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-red-600 border-2 border-white/20 flex items-center justify-center font-heading text-white font-black text-lg shadow-xl shadow-red-600/40">
              VS
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-8 items-center text-center">
              
              {/* Knockout Gym Fighter (Left / Red Corner) */}
              <div className="space-y-3">
                <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-red-600 shadow-lg shadow-red-600/20">
                  <GymImage
                    src={fight.fighterPhoto}
                    alt={fight.fighterName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-red-600 text-white rounded">
                    KNOCKOUT FIGHT GYM
                  </span>
                  <h4 className="text-sm sm:text-lg font-bold uppercase text-white font-heading mt-1">
                    {fight.fighterName}
                  </h4>
                  <p className="text-xs text-red-400 font-medium">"{fight.fighterNickname}"</p>
                  <p className="text-xs text-neutral-400 mt-0.5 tabular-nums">Cartel: {fight.fighterRecord}</p>
                </div>
              </div>

              {/* Opponent (Right / Blue Corner) */}
              <div className="space-y-3">
                <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg shadow-blue-500/20">
                  <GymImage
                    src={fight.opponentPhoto}
                    alt={fight.opponentName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-blue-600/80 text-white rounded">
                    {fight.opponentTeam}
                  </span>
                  <h4 className="text-sm sm:text-lg font-bold uppercase text-white font-heading mt-1">
                    {fight.opponentName}
                  </h4>
                  {fight.opponentNickname && (
                    <p className="text-xs text-blue-400 font-medium">"{fight.opponentNickname}"</p>
                  )}
                  <p className="text-xs text-neutral-400 mt-0.5 tabular-nums">Cartel: {fight.opponentRecord}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Key Fight Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="bg-[#14141c] p-3.5 rounded-xl border border-neutral-800 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Data & Horário</span>
                <span className="text-white font-semibold text-sm">
                  {new Date(fight.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <p className="text-neutral-400">Início das lutas às {fight.time}</p>
              </div>
            </div>

            <div className="bg-[#14141c] p-3.5 rounded-xl border border-neutral-800 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Localização / Arena</span>
                <span className="text-white font-semibold text-sm">{fight.venue}</span>
                <p className="text-neutral-400">{fight.city}, {fight.country}</p>
              </div>
            </div>

            <div className="bg-[#14141c] p-3.5 rounded-xl border border-neutral-800 flex items-start gap-3 sm:col-span-2">
              <Tv className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Transmissão Oficial</span>
                <span className="text-white font-semibold text-sm">{fight.broadcast}</span>
                <p className="text-neutral-400">Transmissão ao vivo para todo o território nacional.</p>
              </div>
            </div>
          </div>

          {/* Tactical Notes & Camp Info */}
          <div className="bg-[#14141c] p-4 rounded-xl border border-neutral-800 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-red-500" />
              Notas do Camp & Contexto
            </span>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {fight.notes}
            </p>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 bg-[#14141c] border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copiado!' : 'Compartilhar Luta'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {onCheerFighter && (
              <button
                onClick={() => {
                  onCheerFighter(fight.fighterName);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                Enviar Torcida ao Atleta
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

import { X, Trophy, Swords, Calendar, MapPin, Instagram, ShieldCheck, Flame } from 'lucide-react';
import { Fighter } from '../types';
import { GymImage } from './GymImage';

interface FighterDetailModalProps {
  fighter: Fighter | null;
  onClose: () => void;
  onViewScheduledFight?: (fightId: string) => void;
}

export function FighterDetailModal({ fighter, onClose, onViewScheduledFight }: FighterDetailModalProps) {
  if (!fighter) return null;

  const totalFights = fighter.record.wins + fighter.record.losses + fighter.record.draws;
  const winRate = totalFights > 0 ? Math.round((fighter.record.wins / totalFights) * 100) : 100;
  const finishRate = fighter.record.wins > 0 
    ? Math.round(((fighter.record.kos + fighter.record.submissions) / fighter.record.wins) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl bg-[#101015] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#14141c]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
              PLANTEL OFICIAL · KNOCKOUT FIGHT TEAM
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Top Hero Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Fighter Photo */}
            <div className="md:col-span-5 relative rounded-xl overflow-hidden border border-neutral-800 aspect-[3/4]">
              <GymImage
                src={fighter.photo}
                alt={fighter.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 bg-red-600 text-white font-bold uppercase tracking-wider rounded">
                  {fighter.category}
                </span>
                <span className="text-neutral-300 font-mono">
                  {fighter.weightClass}
                </span>
              </div>
            </div>

            {/* Profile Header */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-red-500 text-sm font-extrabold uppercase tracking-widest font-heading">
                  "{fighter.nickname}"
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-wide mt-0.5">
                  {fighter.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {fighter.hometown}
                  </span>
                  <span>·</span>
                  <span>Treinador: {fighter.coach}</span>
                  {fighter.instagram && (
                    <>
                      <span>·</span>
                      <span className="text-red-400 flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5" />
                        {fighter.instagram}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Fight Record Scoreboard */}
              <div className="p-4 bg-[#161620] border border-neutral-800 rounded-xl">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Cartel Profissional Oficial
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#0e0e13] p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-2xl font-black text-emerald-400 font-heading tabular-nums">
                      {fighter.record.wins}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-neutral-400">Vitórias</div>
                  </div>
                  <div className="bg-[#0e0e13] p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-2xl font-black text-rose-500 font-heading tabular-nums">
                      {fighter.record.losses}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-neutral-400">Derrotas</div>
                  </div>
                  <div className="bg-[#0e0e13] p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-2xl font-black text-amber-400 font-heading tabular-nums">
                      {fighter.record.kos}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-neutral-400">Nocautes</div>
                  </div>
                  <div className="bg-[#0e0e13] p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-2xl font-black text-cyan-400 font-heading tabular-nums">
                      {fighter.record.submissions}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-neutral-400">Finalizações</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
                  <span>Aproveitamento: <strong className="text-white tabular-nums">{winRate}%</strong></span>
                  <span>Taxa de Interrupção/Nocaute: <strong className="text-white tabular-nums">{finishRate}%</strong></span>
                </div>
              </div>

              {/* Physical Metrics */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-[#14141c] p-2.5 rounded-lg border border-neutral-800/80">
                  <span className="text-neutral-400 block text-[10px] uppercase">Peso Oficial</span>
                  <span className="text-white font-bold text-sm tabular-nums">{fighter.weightKg} kg</span>
                </div>
                <div className="bg-[#14141c] p-2.5 rounded-lg border border-neutral-800/80">
                  <span className="text-neutral-400 block text-[10px] uppercase">Estatura</span>
                  <span className="text-white font-bold text-sm tabular-nums">{fighter.heightCm} cm</span>
                </div>
                <div className="bg-[#14141c] p-2.5 rounded-lg border border-neutral-800/80">
                  <span className="text-neutral-400 block text-[10px] uppercase">Envergadura</span>
                  <span className="text-white font-bold text-sm tabular-nums">{fighter.reachCm} cm</span>
                </div>
              </div>

              {/* Scheduled Fight Alert if any */}
              {fighter.hasUpcomingFight && fighter.upcomingFightId && (
                <div className="p-3.5 bg-red-950/30 border border-red-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold uppercase text-red-400">
                        LUTA AGENDADA PELA ACADEMIA
                      </div>
                      <div className="text-xs text-neutral-300">
                        Este atleta está em camp oficial de combate.
                      </div>
                    </div>
                  </div>
                  {onViewScheduledFight && (
                    <button
                      onClick={() => {
                        onClose();
                        onViewScheduledFight(fighter.upcomingFightId!);
                      }}
                      className="px-3 py-1.5 text-xs font-bold uppercase bg-red-600 hover:bg-red-700 text-white rounded transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Ver Combate
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Biography */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              Trajetória & Filosofia no Tatame
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed bg-[#14141c] p-4 rounded-xl border border-neutral-800">
              {fighter.bio}
            </p>
          </div>

          {/* Titles & Achievements */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Títulos e Conquistas pela Knockout Gym
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {fighter.achievements.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-[#14141c] border border-neutral-800 text-xs text-neutral-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Fights History */}
          {fighter.recentFights && fighter.recentFights.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <Swords className="w-4 h-4 text-red-500" />
                Histórico Recente de Combates
              </h3>
              <div className="border border-neutral-800 rounded-xl overflow-hidden bg-[#14141c]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#1a1a24] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-4">Resultado</th>
                      <th className="py-2.5 px-4">Oponente</th>
                      <th className="py-2.5 px-4">Evento</th>
                      <th className="py-2.5 px-4">Método</th>
                      <th className="py-2.5 px-4">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {fighter.recentFights.map((f, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4 font-bold text-emerald-400">
                          {f.result}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-white">
                          {f.opponent}
                        </td>
                        <td className="py-2.5 px-4 text-neutral-300">
                          {f.event}
                        </td>
                        <td className="py-2.5 px-4 text-neutral-300">
                          {f.method} (R{f.round})
                        </td>
                        <td className="py-2.5 px-4 text-neutral-400 tabular-nums">
                          {f.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#14141c] border-t border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            Representando a equipe em competições nacionais e internacionais.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}

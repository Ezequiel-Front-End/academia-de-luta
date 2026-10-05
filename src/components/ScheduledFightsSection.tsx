import { useState, useEffect } from 'react';
import { Calendar, MapPin, Tv, Flame, Trophy, Swords, ArrowRight, Clock, ExternalLink } from 'lucide-react';
import { ScheduledFight } from '../types';
import { GymImage } from './GymImage';

interface ScheduledFightsSectionProps {
  fights: ScheduledFight[];
  onSelectFight: (fight: ScheduledFight) => void;
  onCheerFighter: (fighterName: string) => void;
}

export function ScheduledFightsSection({ fights, onSelectFight, onCheerFighter }: ScheduledFightsSectionProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recent'>('upcoming');

  // Next marquee fight (first one)
  const nextFight = fights[0];

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!nextFight) return;

    const targetDate = new Date(nextFight.date + 'T' + nextFight.time + ':00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextFight]);

  // Recent gym victories data
  const recentVictories = [
    {
      fighter: 'Lucas "O Tubarão" Silva',
      event: 'Jungle Fight 129',
      opponent: 'Carlos "Predador" Mendez',
      result: 'Vitória por Nocaute (R1, 2:14)',
      date: '15 de Junho de 2026',
      badge: 'Defesa de Ranking',
    },
    {
      fighter: 'Amanda "Furacão" Rocha',
      event: 'Latino Boxing Night',
      opponent: 'Valeria Gomez (ARG)',
      result: 'Vitória por TKO (R4)',
      date: '20 de Julho de 2026',
      badge: 'Cinturão CNB',
    },
    {
      fighter: 'Bruno "O Martelo" Oliveira',
      event: 'International Fight Day Thailand',
      opponent: 'Somchai Thani (THA)',
      result: 'Vitória por KO (Cotovelada R2)',
      date: '08 de Agosto de 2026',
      badge: 'Nocaute Internacional',
    },
    {
      fighter: 'Renata "Samurai" Mendes',
      event: 'BJJ Stars Super Fight',
      opponent: 'Elena Rostova (USA)',
      result: 'Vitória por Finalização (Armlock)',
      date: '04 de Setembro de 2026',
      badge: 'Superluta Faixa Preta',
    },
  ];

  return (
    <section id="lutas-agendadas" className="py-20 bg-[#08080b] border-b border-white/5 relative overflow-hidden">
      {/* Red Ambient Glow behind marquee fight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
              CALENDÁRIO OFICIAL DE GUERRA
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            LUTAS AGENDADAS DA ACADEMIA
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Confira as datas, cards e transmissões oficiais dos nossos atletas que sobem ao ringue e ao octógono em nome da Knockout Fight Gym.
          </p>
        </div>

        {/* Tab switcher: Upcoming vs Recent */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-[#121218] rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Próximos Combates ({fights.length})
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === 'recent'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Últimas Vitórias & Resultados ({recentVictories.length})
            </button>
          </div>
        </div>

        {activeTab === 'upcoming' ? (
          <div className="space-y-12">
            
            {/* NEXT MAIN EVENT HIGHLIGHT BANNER */}
            {nextFight && (
              <div className="relative rounded-3xl bg-gradient-to-br from-[#15151e] via-[#111116] to-[#0d0d12] border-2 border-red-600/40 p-6 sm:p-10 shadow-2xl overflow-hidden">
                
                {/* Top Badge Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-extrabold uppercase tracking-widest rounded shadow-md flex items-center gap-1.5 animate-pulse">
                      <Flame className="w-4 h-4 fill-white" />
                      PRÓXIMO COMBATE PRINCIPAL
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                      {nextFight.promotion}
                    </span>
                  </div>

                  {nextFight.isTitleFight && (
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>{nextFight.titleName}</span>
                    </div>
                  )}
                </div>

                {/* Matchup Center Stage */}
                <div className="pt-12 lg:pt-20 pb-6 flex flex-col lg:flex-row items-center lg:items-end justify-center gap-8 lg:gap-16">
                  
                  {/* Left: Knockout Gym Athlete */}
                  <div className="flex flex-col items-center text-center flex-1 min-w-0 px-2">
                    <div className="relative w-48 h-64 sm:w-64 sm:h-80 lg:w-[24rem] lg:h-[25rem] shrink-0 -mb-6 lg:-mb-12 max-w-full z-10">
                      <img
                        src="/modelo_lutador_kaah.png"
                        alt={nextFight.fighterName}
                        className="w-full h-full object-contain object-bottom drop-shadow-2xl [mask-image:linear-gradient(to_top,transparent_3%,black_35%)] scale-x-[-1.5] scale-y-[1.5] sm:scale-x-[-1.7] sm:scale-y-[1.7] lg:scale-x-[-1.95] lg:scale-y-[1.95] translate-y-6 lg:translate-y-10 origin-bottom"
                      />
                    </div>
                    <div className="z-10 relative w-full break-words">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-500 font-heading block drop-shadow-lg">
                        ATLETA DA CASA · KNOCKOUT
                      </span>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase text-white font-heading mt-1 drop-shadow-lg leading-tight break-words">
                        {nextFight.fighterName}
                      </h3>
                      <p className="text-xs sm:text-sm text-red-400 font-semibold drop-shadow-md mt-0.5 break-words">"{nextFight.fighterNickname}"</p>
                      <div className="inline-block mt-2 bg-black/40 px-3 py-1 rounded-full border border-neutral-800">
                        <p className="text-xs text-neutral-300 font-mono">Cartel: {nextFight.fighterRecord}</p>
                      </div>
                    </div>
                  </div>

                  {/* Center: VS & Event Data & Live Countdown */}
                  <div className="flex flex-col items-center justify-center space-y-6 z-20 shrink-0 lg:mb-12">
                    <div className="text-center">
                      <h4 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide font-heading">
                        {nextFight.event}
                      </h4>
                      <p className="text-sm text-neutral-400 mt-1">
                        {nextFight.weightClass} · {nextFight.rounds} Rounds
                      </p>
                    </div>

                    <div className="w-16 h-16 rounded-full bg-red-600 border-4 border-[#0b0b0e] flex items-center justify-center font-heading text-white font-black text-2xl shadow-xl shadow-red-600/40">
                      VS
                    </div>

                    {/* Live Ticking Countdown Box */}
                    <div className="bg-[#0b0b0e] p-4 rounded-3xl border border-neutral-800 w-full min-w-[280px] shadow-2xl">
                      <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-3 flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-red-500" />
                        CONTAGEM PARA O COMBATE
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center font-heading">
                        <div className="bg-[#14141c] py-2 rounded-xl border border-neutral-800/80">
                          <span className="text-2xl font-black text-white tabular-nums block">{timeLeft.days}</span>
                          <span className="block text-[9px] uppercase text-neutral-500 font-sans mt-0.5 font-bold">Dias</span>
                        </div>
                        <div className="bg-[#14141c] py-2 rounded-xl border border-neutral-800/80">
                          <span className="text-2xl font-black text-white tabular-nums block">{timeLeft.hours}</span>
                          <span className="block text-[9px] uppercase text-neutral-500 font-sans mt-0.5 font-bold">Horas</span>
                        </div>
                        <div className="bg-[#14141c] py-2 rounded-xl border border-neutral-800/80">
                          <span className="text-2xl font-black text-white tabular-nums block">{timeLeft.minutes}</span>
                          <span className="block text-[9px] uppercase text-neutral-500 font-sans mt-0.5 font-bold">Min</span>
                        </div>
                        <div className="bg-[#14141c] py-2 rounded-xl border border-neutral-800/80">
                          <span className="text-2xl font-black text-red-500 tabular-nums block">{timeLeft.seconds}</span>
                          <span className="block text-[9px] uppercase text-red-500/70 font-sans mt-0.5 font-bold">Seg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Opponent */}
                  <div className="flex flex-col items-center text-center flex-1 min-w-0 px-2">
                    <div className="relative w-48 h-64 sm:w-64 sm:h-80 lg:w-[22rem] lg:h-[25rem] shrink-0 -mb-6 lg:-mb-12 max-w-full z-10">
                      <img
                        src={nextFight.opponentPhoto}
                        alt={nextFight.opponentName}
                        className="w-full h-full object-contain object-bottom drop-shadow-2xl [mask-image:linear-gradient(to_top,transparent_3%,black_35%)] -scale-x-100 scale-[1.2] sm:scale-[1.3] lg:scale-[1.4] translate-y-6 lg:translate-y-10 origin-bottom"
                      />
                    </div>
                    <div className="z-10 relative w-full break-words">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block drop-shadow-lg">
                        OPONENTE DESAFIANTE
                      </span>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase text-white font-heading mt-1 drop-shadow-lg leading-tight break-words">
                        {nextFight.opponentName}
                      </h3>
                      {nextFight.opponentNickname && (
                        <p className="text-xs sm:text-sm text-neutral-400 font-semibold drop-shadow-md mt-0.5 break-words">"{nextFight.opponentNickname}"</p>
                      )}
                      <div className="inline-block mt-2 bg-black/40 px-3 py-1 rounded-full border border-neutral-800">
                        <p className="text-xs text-neutral-300 font-mono">Cartel: {nextFight.opponentRecord}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Bar: Date, Venue, Stream & Buttons */}
                <div className="mt-4 pt-6 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <strong>
                        {new Date(nextFight.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })} · às {nextFight.time}
                      </strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-red-500" />
                      {nextFight.venue} ({nextFight.city})
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                      <Tv className="w-4 h-4" />
                      {nextFight.broadcast}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onCheerFighter(nextFight.fighterName)}
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-md shadow-red-600/30 cursor-pointer"
                    >
                      Mandar Mensagem de Torcida
                    </button>
                    <button
                      onClick={() => onSelectFight(nextFight)}
                      className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Ver Detalhes do Card
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Other Scheduled Fights Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold uppercase text-white font-heading flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-500" />
                Mais Combates Agendados no Calendário
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fights.slice(1).map((fight) => (
                  <div
                    key={fight.id}
                    className="bg-[#121218] border border-neutral-800 hover:border-red-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl group"
                  >
                    <div>
                      {/* Top Meta */}
                      <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-800">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-500">
                          {fight.status}
                        </span>
                        <span className="text-neutral-400 font-medium">
                          {new Date(fight.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h4 className="text-base font-bold uppercase text-white font-heading mt-3 group-hover:text-red-400 transition-colors">
                        {fight.event}
                      </h4>
                      <p className="text-xs text-neutral-400">
                        {fight.weightClass} · {fight.rounds} Rounds
                      </p>

                      {/* Matchup Duel */}
                      <div className="mt-4 flex items-center justify-between gap-3 bg-[#0d0d12] p-3 rounded-xl border border-neutral-800/80">
                        {/* Knockout Fighter */}
                        <div className="flex items-center gap-2.5">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-red-500/60 shrink-0">
                            <GymImage
                              src={fight.fighterPhoto}
                              alt={fight.fighterName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-red-500 block">KNOCKOUT</span>
                            <span className="text-xs font-bold text-white block leading-tight">{fight.fighterName}</span>
                            <span className="text-[10px] text-neutral-400">"{fight.fighterNickname}"</span>
                          </div>
                        </div>

                        <span className="text-xs font-black text-red-500 font-heading">VS</span>

                        {/* Opponent */}
                        <div className="flex items-center gap-2.5 text-right">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-neutral-500 block">DESAFIANTE</span>
                            <span className="text-xs font-bold text-neutral-200 block leading-tight">{fight.opponentName}</span>
                            <span className="text-[10px] text-neutral-400">{fight.opponentTeam}</span>
                          </div>
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-700 shrink-0">
                            <GymImage
                              src={fight.opponentPhoto}
                              alt={fight.opponentName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Location & Broadcast */}
                      <div className="mt-3 space-y-1 text-xs text-neutral-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="truncate">{fight.venue}, {fight.city}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Tv className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="truncate">{fight.broadcast}</span>
                        </div>
                      </div>

                    </div>

                    {/* Action button */}
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectFight(fight)}
                        className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-neutral-800 hover:bg-red-600 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Ver Card Completo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Recent Victories Tab */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentVictories.map((v, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#121217] border border-neutral-800 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 rounded">
                      {v.badge}
                    </span>
                    <span className="text-xs text-neutral-400">{v.date}</span>
                  </div>
                  <h4 className="text-lg font-bold uppercase text-white font-heading">
                    {v.fighter}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-400">
                    {v.result} contra {v.opponent}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Evento: {v.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

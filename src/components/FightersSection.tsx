import { useState } from 'react';
import { Search, Flame, Award, ChevronRight, Swords } from 'lucide-react';
import { Fighter } from '../types';
import { GymImage } from './GymImage';

interface FightersSectionProps {
  fighters: Fighter[];
  onSelectFighter: (fighter: Fighter) => void;
  onViewScheduledFight: (fightId: string) => void;
}

export function FightersSection({ fighters, onSelectFighter, onViewScheduledFight }: FightersSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Todos', 'MMA', 'Boxe', 'Muay Thai', 'Jiu-Jitsu'];

  const filteredFighters = fighters.filter((fighter) => {
    const matchesCategory = selectedCategory === 'Todos' || fighter.category === selectedCategory;
    const matchesSearch = 
      fighter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fighter.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fighter.weightClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="lutadores" className="py-20 bg-[#0c0c10] border-b border-white/5 relative">
      {/* Background glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-red-600/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
              PLANTEL DE ATLETAS PROFISSIONAIS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            LUTADORES DA ACADEMIA
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Atletas forjados em nosso tatame e ringue. Conheça seus cartéis oficiais, títulos conquistados e as batalhas que eles travam em nome da Knockout Fight Gym.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-800">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#14141a] rounded-xl border border-neutral-800 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou apelido..."
              className="w-full bg-[#14141a] border border-neutral-800 focus:border-red-500 focus:outline-none text-xs text-white pl-10 pr-4 py-2.5 rounded-xl transition-colors placeholder:text-neutral-500"
            />
          </div>

        </div>

        {/* Fighters Grid */}
        {filteredFighters.length === 0 ? (
          <div className="text-center py-16 bg-[#14141a] rounded-2xl border border-neutral-800">
            <p className="text-neutral-400 text-sm">Nenhum lutador encontrado para este filtro.</p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold uppercase text-red-500 hover:text-red-400 underline underline-offset-4 cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFighters.map((fighter) => (
              <div
                key={fighter.id}
                className="group relative bg-[#121217] rounded-2xl border border-neutral-800/90 hover:border-red-500/50 transition-all duration-300 overflow-hidden flex flex-col shadow-xl hover:shadow-red-950/20"
              >
                {/* Photo & Badge Area */}
                <div className="relative aspect-[4/4.5] overflow-hidden bg-transparent">
                  <GymImage
                    src={fighter.photo}
                    alt={fighter.name}
                    className="w-full h-full"
                    imgClassName="object-contain object-bottom scale-110 translate-y-2 group-hover:scale-[1.15] transition-transform duration-500 [mask-image:linear-gradient(to_top,transparent_2%,black_35%)]"
                  />

                  {/* Category Pill Tag in Top Corner */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-red-400 border border-neutral-700 rounded-md">
                      {fighter.category}
                    </span>
                  </div>

                  {/* Scheduled Fight Badge */}
                  {fighter.hasUpcomingFight && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white rounded-md shadow-md flex items-center gap-1 animate-pulse">
                        <Flame className="w-3 h-3 fill-white" />
                        LUTA MARCADA
                      </span>
                    </div>
                  )}

                  {/* Fighter Name Overlay at bottom of photo */}
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <span className="text-red-500 text-xs font-extrabold uppercase tracking-widest font-heading drop-shadow">
                      "{fighter.nickname}"
                    </span>
                    <h3 className="text-2xl font-bold uppercase text-white tracking-wide leading-tight">
                      {fighter.name}
                    </h3>
                    <p className="text-xs text-neutral-300 font-medium">
                      {fighter.weightClass}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Fight Stats Strip */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-[#0d0d12] p-2.5 rounded-xl border border-neutral-800/80">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Cartel</span>
                      <span className="text-white font-heading text-base font-bold tabular-nums">
                        {fighter.record.wins}-{fighter.record.losses}-{fighter.record.draws}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Nocautes</span>
                      <span className="text-amber-400 font-heading text-base font-bold tabular-nums">
                        {fighter.record.kos} KOs
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Envergadura</span>
                      <span className="text-neutral-300 font-heading text-base font-bold tabular-nums">
                        {fighter.reachCm} cm
                      </span>
                    </div>
                  </div>

                  {/* Main Achievement Preview */}
                  <div className="text-xs text-neutral-300 flex items-start gap-2 bg-[#171720]/60 p-2.5 rounded-lg border border-neutral-800">
                    <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {fighter.achievements[0] || 'Atleta titular da equipe principal'}
                    </span>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectFighter(fighter)}
                      className="flex-1 py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Ver Perfil & Cartel</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {fighter.hasUpcomingFight && fighter.upcomingFightId && (
                      <button
                        onClick={() => onViewScheduledFight(fighter.upcomingFightId!)}
                        title="Ver detalhes da luta agendada"
                        className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>Luta</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

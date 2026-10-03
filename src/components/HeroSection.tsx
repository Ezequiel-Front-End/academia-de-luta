import { Play, ArrowRight, Star, Dumbbell, Calendar, HeartHandshake, Award, ShieldAlert } from 'lucide-react';
import { GymImage } from './GymImage';

interface HeroSectionProps {
  onStartJourney: () => void;
  onWatchVideo: () => void;
}

export function HeroSection({ onStartJourney, onWatchVideo }: HeroSectionProps) {
  const quickBenefits = [
    {
      icon: Award,
      title: 'Treinadores de Elite',
      desc: 'Faixas-pretas e ex-lutadores profissionais focados na sua evolução.',
    },
    {
      icon: Dumbbell,
      title: 'Todos os Níveis',
      desc: 'Do iniciante sem experiência ao atleta profissional de competição.',
    },
    {
      icon: Calendar,
      title: 'Horários Flexíveis',
      desc: 'Grade completa com turmas matinais, no almoço e no período noturno.',
    },
    {
      icon: HeartHandshake,
      title: 'Comunidade Forte',
      desc: 'Ambiente de respeito, motivação coletiva e disciplina constante.',
    },
    {
      icon: ShieldAlert,
      title: 'Resultados Reais',
      desc: 'Aumento expressivo de resistência, perda calórica e autodefesa.',
    },
  ];

  return (
    <section id="inicio" className="relative pt-8 pb-16 lg:pt-14 lg:pb-20 overflow-hidden border-b border-white/5">
      {/* Background glow and subtle grid texture */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Tagline Kicker */}
            <div className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
                TREINE FORTE. BATA MAIS FORTE.
              </span>
            </div>

            {/* Massive Typography */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] text-white">
              DISCIPLINA.<br />
              FOCO.<br />
              <span className="text-red-600 drop-shadow-[0_0_25px_rgba(225,29,72,0.4)]">
                DOMÍNIO.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-xl leading-relaxed">
              Construa força física real, confiança inabalável e mentalidade indestrutível na Knockout Fight Gym. Forjamos guerreiros para a vida e campeões para o ringue e o octógono.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartJourney}
                className="px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded transition-all shadow-xl shadow-red-600/30 hover:shadow-red-600/50 flex items-center gap-2 group cursor-pointer"
              >
                <span>COMEÇAR MINHA JORNADA</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onWatchVideo}
                className="px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 hover:text-white bg-[#14141a] hover:bg-[#1c1c24] border border-neutral-700 hover:border-neutral-500 rounded transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                  <Play className="w-3 h-3 fill-red-500 ml-0.5" />
                </div>
                <span>ASSISTIR VÍDEO</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex items-center gap-4">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0a0a0d] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Aluno Knockout"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0a0a0d] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Aluno Knockout"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0a0a0d] object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Aluno Knockout"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0a0a0d] object-cover"
                  src="https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=120&q=80"
                  alt="Aluno Knockout"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-xs text-neutral-300 font-medium">
                  <strong className="text-white font-bold">4.9</strong> (+210 Avaliações de Alunos e Atletas)
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card Container with subtle frame & glow */}
              <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#121217] shadow-2xl shadow-black/80">
                <GymImage
                  src="https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=1000&q=80"
                  alt="Atleta em guarda com luvas de boxe na academia"
                  className="w-full h-[460px] sm:h-[520px] object-cover"
                />

                {/* Dark vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Gym Crest Watermark in corner */}
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md border border-neutral-700/60 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-200">
                    CAMP ABERTO · 2026
                  </span>
                </div>

                {/* Floating Mission Badge (as in the reference image) */}
                <div className="absolute bottom-6 right-6 z-10 bg-[#181820]/95 backdrop-blur-md border border-red-500/30 p-3.5 rounded-xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                      FILOSOFIA
                    </div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-white">
                      SUA LUTA, NOSSA MISSÃO.
                    </div>
                  </div>
                </div>

                {/* Bottom Left Punch Indicator */}
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">
                    SEDE OFICIAL
                  </span>
                  <p className="text-sm font-bold text-white font-heading tracking-wide">
                    SÃO PAULO · JARDINS / PAULISTA
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 5-Item Quick Benefits Strip */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {quickBenefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-3 group">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-[#16161d] border border-neutral-800 flex items-center justify-center text-red-500 group-hover:border-red-500/50 group-hover:bg-red-950/20 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

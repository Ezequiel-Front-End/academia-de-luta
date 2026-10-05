import { Play, ArrowRight, Star, Dumbbell, Calendar, HeartHandshake, Award, ShieldAlert } from 'lucide-react';
import { GymImage } from './GymImage';
import { RevealOnScroll } from './RevealOnScroll';

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
    <section id="inicio" className="relative pt-16 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-white/5">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/banner_hero_academia_box.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/90 to-transparent" />
      <div className="absolute inset-0 z-0 bg-black/40" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          
          <div className="flex flex-col justify-center space-y-6">
            
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

        </div>

        {/* 5-Item Quick Benefits Strip */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {quickBenefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll key={index} delay={index * 150}>
                <div className="flex items-start gap-3 group">
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
              </RevealOnScroll>
            );
          })}
        </div>

      </div>
    </section>
  );
}

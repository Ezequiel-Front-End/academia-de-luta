import { useState } from 'react';
import { Award, Users, Trophy, Shield, ArrowRight, X, HeartHandshake } from 'lucide-react';
import { GymImage } from './GymImage';
import { AnimatedCounter } from './AnimatedCounter';

interface AboutSectionProps {
  onTourGym: () => void;
  onViewHistory?: () => void;
}

export function AboutSection({ onTourGym, onViewHistory }: AboutSectionProps) {
  const stats = [
    {
      icon: Award,
      value: '12+',
      label: 'Anos de Tradição',
      desc: 'Formando atletas desde 2014',
    },
    {
      icon: Users,
      value: '850+',
      label: 'Alunos Ativos',
      desc: 'Comunidade forte e unida',
    },
    {
      icon: Shield,
      value: '16+',
      label: 'Mestres & Coaches',
      desc: 'Faixas-pretas e campeões',
    },
    {
      icon: Trophy,
      value: '23',
      label: 'Cinturões Ganhos',
      desc: 'No MMA, Boxe e Muay Thai',
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-[#0c0c10] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main About Card Container (styled as in reference image) */}
        <div className="bg-[#121218] border border-neutral-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Gritty Boxing Ring Photography */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-neutral-800 aspect-[16/11] shadow-2xl">
              <GymImage
                src="/alunos.jpeg"
                alt="Alunos da BBT em treinamento"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            </div>

            {/* Right: Narrative & Stats */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-xs uppercase tracking-[0.2em] text-red-500 font-bold font-heading">
                    SOBRE A ACADEMIA
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white font-heading tracking-wide leading-tight">
                  Mais que uma Academia.<br />
                  Somos uma Família.
                </h2>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Na BBT, não apenas ensinamos você a socar, chutar ou finalizar. Nós forjamos caráter, disciplina inquebrável e companheirismo verdadeiro. Nossa missão é desbloquear a sua melhor e mais forte versão.
              </p>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Fundada por mestres com experiência nos maiores eventos do mundo, mantemos as portas abertas para quem quer apenas qualidade de vida e perda de peso, até atletas que vivem do esporte no topo dos rankings internacionais.
              </p>

              {/* 4 Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-[#181822] p-3 rounded-xl border border-neutral-800 text-center">
                      <div className="w-8 h-8 mx-auto rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-1.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white font-heading tabular-nums">
                        <AnimatedCounter value={stat.value} />
                      </div>
                      <div className="text-[10px] uppercase font-bold text-neutral-400 leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onViewHistory}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>CONHECER NOSSA HISTÓRIA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onTourGym}
                  className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white bg-[#181822] hover:bg-[#20202c] border border-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  Conhecer Instalações
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

    </section>
  );
}

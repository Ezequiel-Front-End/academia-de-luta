import { useState } from 'react';
import { ArrowRight, Flame, Shield, X, CheckCircle, Clock, Zap } from 'lucide-react';
import { Program } from '../types';
import { GymImage } from './GymImage';

interface ProgramsSectionProps {
  programs: Program[];
  onBookClass: (programTitle: string) => void;
}

export function ProgramsSection({ programs, onBookClass }: ProgramsSectionProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  return (
    <section id="programas" className="py-20 bg-[#0a0a0d] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
              NOSSAS MODALIDADES
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            DESPERTE O LUTADOR EM VOCÊ
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Metodologias comprovadas que unem técnica marcial autêntica, condicionamento físico de altíssimo nível e segurança total para iniciantes e avançados.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="group bg-[#121217] rounded-2xl border border-neutral-800/90 hover:border-red-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-red-950/20"
            >
              {/* Image with vignette */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                <GymImage
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent pointer-events-none" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-red-400 border border-neutral-700 rounded">
                    {program.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold uppercase text-white font-heading group-hover:text-red-500 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-xs text-red-400 font-medium">
                    {program.subtitle}
                  </p>
                  <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Footer of card */}
                <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80">
                  <button
                    onClick={() => setSelectedProgram(program)}
                    className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Saber Mais</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onBookClass(program.title)}
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#1c1c25] hover:bg-red-600 text-white rounded transition-colors cursor-pointer"
                  >
                    Aula Grátis
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
          <div 
            className="relative w-full max-w-2xl bg-[#101015] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#14141c]">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                <span className="text-xs uppercase tracking-widest text-neutral-300 font-bold font-heading">
                  {selectedProgram.category} · KNOCKOUT GYM
                </span>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white font-heading">
                  {selectedProgram.title}
                </h2>
                <p className="text-xs sm:text-sm text-red-400 font-medium mt-1">
                  {selectedProgram.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-3">
                  {selectedProgram.description}
                </p>
              </div>

              {/* Info Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#151520] p-3 rounded-xl border border-neutral-800 flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 block font-bold">Intensidade</span>
                    <span className="text-white font-bold">{selectedProgram.intensity}</span>
                  </div>
                </div>
                <div className="bg-[#151520] p-3 rounded-xl border border-neutral-800 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-red-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 block font-bold">Horários</span>
                    <span className="text-white font-bold truncate block">{selectedProgram.scheduleOverview}</span>
                  </div>
                </div>
              </div>

              {/* Benefits list */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Benefícios Desta Modalidade:
                </h4>
                <div className="space-y-2">
                  {selectedProgram.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment Required */}
              <div className="p-4 bg-[#14141c] rounded-xl border border-neutral-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-500" />
                  Equipamentos Necessários:
                </h4>
                <ul className="text-xs text-neutral-400 list-disc list-inside space-y-1">
                  {selectedProgram.equipmentRequired.map((eq, idx) => (
                    <li key={idx}>{eq}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-neutral-500 italic pt-1">
                  *Na primeira aula experimental gratuita, fornecemos luvas e equipamentos higienizados para teste.
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-[#14141c] border-t border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 text-xs font-bold uppercase text-neutral-400 hover:text-white cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  const title = selectedProgram.title;
                  setSelectedProgram(null);
                  onBookClass(title);
                }}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                Agendar Aula Experimental Desta Modalidade
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Trophy } from 'lucide-react';
import { FederacaoEntidade } from '../types/database';

interface FederationsSectionProps {
  federations?: FederacaoEntidade[];
}

function getThemeStyles(cor_tema?: string) {
  switch (cor_tema) {
    case 'azul':
      return {
        glow: 'drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]',
        color: 'text-blue-500',
        bgColor: 'bg-blue-600',
        hoverColor: 'hover:bg-blue-700'
      };
    case 'verde':
      return {
        glow: 'drop-shadow-[0_0_25px_rgba(34,197,94,0.5)]',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-600',
        hoverColor: 'hover:bg-emerald-700'
      };
    case 'dourado':
      return {
        glow: 'drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]',
        color: 'text-amber-500',
        bgColor: 'bg-amber-600',
        hoverColor: 'hover:bg-amber-700'
      };
    case 'neutro':
      return {
        glow: 'drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]',
        color: 'text-neutral-300',
        bgColor: 'bg-neutral-800',
        hoverColor: 'hover:bg-neutral-700'
      };
    case 'vermelho':
    default:
      return {
        glow: 'drop-shadow-[0_0_25px_rgba(220,38,38,0.5)]',
        color: 'text-red-500',
        bgColor: 'bg-red-600',
        hoverColor: 'hover:bg-red-700'
      };
  }
}

export function FederationsSection({ federations = [] }: FederationsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Se não houver federações cadastradas ainda
  if (federations.length === 0) {
    return null;
  }

  const safeIndex = activeIndex < federations.length ? activeIndex : 0;
  const activeFed = federations[safeIndex];
  const theme = getThemeStyles(activeFed.cor_tema);

  return (
    <section className="py-24 bg-[#0a0a0e] relative overflow-hidden border-t border-neutral-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-[0.02]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
            Federações e Confederações
          </h2>
          <div className="w-24 h-1.5 bg-red-600 mx-auto mt-4" />
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24">
          
          {/* Lado Esquerdo: Imagem Gigante da Federação Ativa */}
          <div className="w-full lg:w-1/2 flex justify-center items-center min-h-[400px]">
            <div 
              key={safeIndex}
              className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] rounded-full flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500"
            >
              <img 
                src={activeFed.logo} 
                alt={activeFed.nome} 
                className={`w-full h-full object-contain filter ${theme.glow} transition-all duration-700 scale-100 hover:scale-105`}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${activeFed.nome}&background=101015&color=fff&size=400&font-size=0.3&bold=true`;
                }}
              />
            </div>
          </div>

          {/* Lado Direito: Contexto e Carrossel */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center min-h-[400px]">
            
            {/* Contexto da Federação Ativa com Altura Mínima para Evitar Quebras */}
            <div key={`text-${safeIndex}`} className="animate-in fade-in slide-in-from-right-8 duration-500 min-h-[420px] lg:min-h-[380px] flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className={`w-6 h-6 ${theme.color}`} />
                <span className={`text-sm font-bold uppercase tracking-widest ${theme.color}`}>
                  Chancela Oficial
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase leading-tight">
                {activeFed.nome}
              </h3>
              <h4 className="text-xl md:text-2xl font-bold text-neutral-400 mb-6 min-h-[56px] md:min-h-[64px]">
                {activeFed.nome_completo}
              </h4>
              <p className="text-neutral-300 text-base md:text-lg leading-relaxed mb-8">
                {activeFed.descricao}
              </p>
              
              <div className="mt-auto pb-4">
                <a 
                  href={activeFed.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-8 py-4 ${theme.bgColor} ${theme.hoverColor} text-white font-bold uppercase tracking-wider rounded-lg transition-colors group shadow-lg shadow-black/40`}
                >
                  Saiba Mais
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Carrossel de Navegação */}
            {federations.length > 1 && (
              <div className="mt-8 lg:mt-12 pt-8 border-t border-neutral-900/50">
                <h5 className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-6 flex items-center gap-2">
                  Outras Federações <ChevronRight className="w-4 h-4" />
                </h5>
                
                {/* Contêiner com scroll horizontal nativo para celular */}
                <div className="flex items-center gap-4 overflow-x-auto snap-x py-4 px-2 -mx-2 scrollbar-thin scrollbar-track-[#111] scrollbar-thumb-neutral-700">
                  {federations.map((fed, index) => {
                    const isActive = index === safeIndex;
                    const fedTheme = getThemeStyles(fed.cor_tema);
                    return (
                      <div key={fed.id || fed.nome} className="w-24 h-24 flex items-center justify-center flex-shrink-0 snap-center">
                        <button
                          onClick={() => setActiveIndex(index)}
                          className={`relative w-full h-full transition-all duration-300 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500
                            ${isActive 
                              ? 'border-2 border-neutral-600 bg-[#161622] p-2 scale-100 shadow-xl' 
                              : 'opacity-40 hover:opacity-100 hover:scale-105 border border-transparent bg-[#0e0e14] p-3 scale-90'
                            }
                          `}
                        >
                          <img 
                            src={fed.logo} 
                            alt={fed.nome} 
                            className={`w-full h-full object-contain filter transition-all rounded-md ${isActive ? fedTheme.glow : 'grayscale group-hover:grayscale-0'}`}
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${fed.nome}&background=101015&color=fff&size=200&bold=true`;
                            }}
                          />
                          {isActive && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

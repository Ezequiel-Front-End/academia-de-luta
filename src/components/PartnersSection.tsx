import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Handshake } from 'lucide-react';
import { ParceiroPatrocinador } from '../types/database';

interface PartnersSectionProps {
  partners?: ParceiroPatrocinador[];
}

function getThemeStyles(cor_tema?: string) {
  switch (cor_tema) {
    case 'vermelho':
      return {
        glow: 'drop-shadow-[0_0_25px_rgba(220,38,38,0.5)]',
        color: 'text-red-500',
        bgColor: 'bg-red-600',
        hoverColor: 'hover:bg-red-700'
      };
    case 'azul':
      return {
        glow: 'drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]',
        color: 'text-blue-500',
        bgColor: 'bg-blue-600',
        hoverColor: 'hover:bg-blue-700'
      };
    case 'dourado':
      return {
        glow: 'drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]',
        color: 'text-amber-500',
        bgColor: 'bg-amber-600',
        hoverColor: 'hover:bg-amber-700'
      };
    case 'neutro':
    default:
      return {
        glow: 'drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]',
        color: 'text-neutral-300',
        bgColor: 'bg-neutral-800',
        hoverColor: 'hover:bg-neutral-700'
      };
  }
}

export function PartnersSection({ partners = [] }: PartnersSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (partners.length === 0) {
    return null;
  }

  const safeIndex = activeIndex < partners.length ? activeIndex : 0;
  const activePartner = partners[safeIndex];
  const theme = getThemeStyles(activePartner.cor_tema);

  return (
    <section className="py-24 bg-[#050508] relative overflow-hidden border-t border-neutral-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-[0.05] mix-blend-luminosity" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
            Parceiros & Patrocinadores
          </h2>
          <div className="w-24 h-1.5 bg-red-600 mx-auto mt-4" />
        </div>

        {/* Imagem na direita, Texto na Esquerda no Desktop. No mobile, imagem em cima */}
        <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-12 lg:gap-24">
          
          {/* Lado Direito no Desktop / Topo no Mobile: Imagem Gigante */}
          <div className="w-full lg:w-1/2 flex justify-center items-center min-h-[400px]">
            <div 
              key={safeIndex} 
              className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] rounded-full flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500"
            >
              <img 
                src={activePartner.logo} 
                alt={activePartner.nome} 
                className={`w-full h-full object-contain filter ${theme.glow} transition-all duration-700 scale-100 hover:scale-105 mix-blend-lighten`}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${activePartner.nome}&background=101015&color=fff&size=400&bold=true`;
                }}
              />
            </div>
          </div>

          {/* Lado Esquerdo no Desktop / Base no Mobile: Contexto e Carrossel */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center min-h-[400px]">
            
            {/* Contexto do Parceiro Ativo */}
            <div key={`text-${safeIndex}`} className={`animate-in fade-in slide-in-from-left-8 duration-500 flex flex-col justify-start ${partners.length > 1 ? 'min-h-[420px] lg:min-h-[380px]' : ''}`}>
              <div className="flex items-center gap-3 mb-3">
                <Handshake className={`w-6 h-6 ${theme.color}`} />
                <span className={`text-sm font-bold uppercase tracking-widest ${theme.color}`}>
                  Parceria Oficial
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase leading-tight">
                {activePartner.nome}
              </h3>
              <h4 className="text-xl md:text-2xl font-bold text-neutral-400 mb-6 min-h-[56px] md:min-h-[64px]">
                {activePartner.nome_completo}
              </h4>
              <p className="text-neutral-300 text-base md:text-lg leading-relaxed mb-8">
                {activePartner.descricao}
              </p>
              
              <div className="pb-4 mt-auto">
                <a 
                  href={activePartner.link}
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
            {partners.length > 1 && (
              <div className="mt-8 lg:mt-12 pt-8 border-t border-neutral-900/50">
                <h5 className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-6 flex items-center gap-2">
                  Parceiros <ChevronRight className="w-4 h-4" />
                </h5>
                
                {/* Contêiner com scroll horizontal nativo para celular */}
                <div className="flex items-center gap-4 overflow-x-auto snap-x py-4 px-2 -mx-2 scrollbar-thin scrollbar-track-[#111] scrollbar-thumb-neutral-700">
                  {partners.map((partner, index) => {
                    const isActive = index === safeIndex;
                    const pTheme = getThemeStyles(partner.cor_tema);
                    return (
                      <div key={partner.id || partner.nome} className="w-24 h-24 flex items-center justify-center flex-shrink-0 snap-center">
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
                            src={partner.logo} 
                            alt={partner.nome} 
                            className={`w-full h-full object-contain filter transition-all rounded-md mix-blend-lighten ${isActive ? pTheme.glow : 'grayscale group-hover:grayscale-0'}`}
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${partner.nome}&background=101015&color=fff&size=200&bold=true`;
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

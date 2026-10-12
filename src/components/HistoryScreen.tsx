import React, { useEffect } from 'react';
import { ArrowLeft, Users, Shield, Target, Trophy } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface HistoryScreenProps {
  onBack: () => void;
}

export function HistoryScreen({ onBack }: HistoryScreenProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-200">
      
      {/* Header and Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors uppercase tracking-wider text-sm font-bold mb-12"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para a página principal
        </button>
      </div>

      {/* Hero Title */}
      <RevealOnScroll>
        <section className="max-w-7xl mx-auto px-4 pb-16 text-center">
          <div className="inline-flex items-center gap-3 mb-6 justify-center">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-red-500 font-bold uppercase tracking-widest text-sm">Nossas Raízes</span>
            <span className="w-2 h-2 rounded-full bg-red-600" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-[1.1] mb-8">
            A Origem da <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">BBT</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            O que começou como um sonho em um modesto tatame de garagem, tornou-se o maior centro de excelência em artes marciais de contato da América Latina.
          </p>
        </section>
      </RevealOnScroll>

      {/* Image Gallery / Hero Image */}
      <RevealOnScroll>
        <section className="max-w-7xl mx-auto px-4 pb-24">
          <div className="relative rounded-3xl overflow-hidden aspect-video border border-neutral-800 group">
            <img 
              src="/alunos.jpeg" 
              alt="Nossa família BBT no tatame"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 sm:p-12 w-full">
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase mb-4 shadow-black drop-shadow-lg">
                Mais que um time, uma família
              </h2>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* The Story Grid */}
      <RevealOnScroll>
        <section className="max-w-7xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 text-lg text-neutral-300 leading-relaxed">
              <h3 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-3">
                <Target className="w-8 h-8 text-red-600" />
                Nossa Trajetória
              </h3>
              <p>
                Jean e Kris Kay, casados há mais de 20 anos, levam uma paixão em comum para toda vida, o ramo da LUTA. Ambos tem uma vasta experiência. Graduados faixa preta em Kickboxing pela CBKB (Confederação Brasileira de Kickboxing) e grau preto em Muay Thai pela CBMT – BT (Confederação Brasileira de Muay Thai – Boxe Tailandês).
              </p>
              <p>
                Jean e Kris já passaram por duas equipes bem estruturadas (GIBI THAI, 5 anos e INSIDE, 6 anos) adquirindo experiências em lutas, parcerias, amizades, fidelidade, conquistas, treinos e o mais importante, um sonho. Por mais que ambos estivessem em outra equipe, sempre tiveram um sonho em ter a sua própria equipe, com isso, depois de anos e anos de luta, foco, objetivo e determinação, esse sonho se concretizou.
              </p>
              <p>
                Hoje, somos <strong>BBT (Brazilian Black Thai)</strong>, filiados a ISCA (Federação Internacional de artes marciais), e viemos para fazer história. Com cinturões no Muay Thai e no Kickboxing e nos dias de hoje, começamos a migrar para o MMA. Onde em menos de dois anos já temos os dois Cinturões das duas principais organizações do País.
              </p>
              <p>
                Temos a sensação de dever cumprido, liberdade, superação, desejo, trabalho, autonomia, amor, respeito, adrenalina, disciplina, união e o mais importante <strong>FAMÍLIA</strong>. A BBT pra nós se tornou mais que um sonho, é uma realização que tá na carne, marcada na alma.
              </p>
              <p className="border-l-4 border-red-600 pl-4 italic text-neutral-400 mt-8">
                "Nós. Mestres, amigos, orientadores e professores só temos a agradecer aqueles que estavam conosco no passado e que estão conosco agora. O nosso MUITO OBRIGADO por tudo, pela experiência, respeito e trabalho em equipe. Daqui pra frente, VIDA NOVA todos os dias!"
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sticky top-8">
              <div className="bg-[#101015] border border-neutral-800 rounded-2xl p-6 aspect-square flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black text-red-600 mb-2">500+</span>
                <span className="text-sm uppercase tracking-wider font-bold text-neutral-400">Alunos Ativos</span>
              </div>
              <div className="bg-[#101015] border border-neutral-800 rounded-2xl p-6 aspect-square flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black text-red-600 mb-2">10</span>
                <span className="text-sm uppercase tracking-wider font-bold text-neutral-400">Unidades na Região</span>
              </div>
              <div className="bg-[#101015] border border-neutral-800 rounded-2xl p-6 aspect-square flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black text-red-600 mb-2">20+</span>
                <span className="text-sm uppercase tracking-wider font-bold text-neutral-400">Anos de União e Luta</span>
              </div>
              <div className="bg-[#101015] border border-neutral-800 rounded-2xl p-6 aspect-square flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black text-red-600 mb-2">2</span>
                <span className="text-sm uppercase tracking-wider font-bold text-neutral-400">Cinturões Nacionais MMA</span>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Founders and Masters */}
      <RevealOnScroll>
        <section className="bg-[#0c0c11] py-24 border-t border-neutral-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white uppercase tracking-wider mb-4 flex items-center justify-center gap-4">
                <Shield className="w-8 h-8 text-red-600" />
                Os Fundadores
                <Shield className="w-8 h-8 text-red-600" />
              </h2>
              <div className="w-24 h-1.5 bg-red-600 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Master 1 */}
              <div className="bg-[#14141c] rounded-2xl border border-neutral-800 overflow-hidden group">
                <div className="aspect-[3/4] overflow-hidden bg-neutral-900 relative">
                  <img 
                    src="/modelo_lutador_masculino.png" 
                    alt="Mestre Jean Kay" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14141c] via-transparent to-transparent" />
                </div>
                <div className="p-8 relative">
                  <h3 className="text-3xl font-black text-white uppercase mb-1">Mestre Jean Kay</h3>
                  <p className="text-red-500 font-bold uppercase tracking-wider text-sm mb-4">Fundador & Grão Mestre</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Grau preto em Muay Thai pela CBMT-BT e faixa preta em Kickboxing pela CBKB. Com vasta experiência nas maiores equipes do país (GIBI THAI e INSIDE), Jean transformou a BBT em uma potência reveladora de campeões no MMA nacional.
                  </p>
                </div>
              </div>

              {/* Master 2 */}
              <div className="bg-[#14141c] rounded-2xl border border-neutral-800 overflow-hidden group">
                <div className="aspect-[3/4] overflow-hidden bg-neutral-900 relative">
                  <img 
                    src="/modelo_lutador_kaah.png" 
                    alt="Mestra Kris Kay" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14141c] via-transparent to-transparent" />
                </div>
                <div className="p-8 relative">
                  <h3 className="text-3xl font-black text-white uppercase mb-1">Mestra Kris Kay</h3>
                  <p className="text-red-500 font-bold uppercase tracking-wider text-sm mb-4">Fundadora & Mestra</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Também graduada grau preto em Muay Thai e faixa preta em Kickboxing. Kris é o pilar da família BBT, unindo técnica apurada e a missão de transformar vidas através do esporte nas mais de 10 unidades da equipe.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Philosophy */}
      <RevealOnScroll>
        <section className="py-24 text-center px-4 relative">
          <Trophy className="w-16 h-16 text-neutral-800 mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-black text-neutral-400 uppercase leading-tight max-w-4xl mx-auto">
            "Venha fazer parte da nossa equipe, venha até uma de nossas unidades e <span className="text-white">faça um treino experimental.</span>"
          </h2>
          <div className="mt-12 text-neutral-500 font-bold uppercase tracking-widest">
            Kris Kay & Jean Kay <br/>
            <span className="text-red-600 mt-2 inline-block">Família BBT</span>
          </div>

          <button
            onClick={onBack}
            className="mt-16 bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-lg font-bold uppercase tracking-wide transition-all shadow-lg shadow-red-600/20 active:scale-95 inline-flex items-center gap-3"
          >
            <ArrowLeft className="w-5 h-5" /> Retornar à página principal
          </button>
        </section>
      </RevealOnScroll>

    </div>
  );
}

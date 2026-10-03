import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2, Send, ShieldAlert, Sparkles } from 'lucide-react';
import { GYM_INFO } from '../data/gymData';

interface ContactSectionProps {
  initialProgram?: string;
  initialTime?: string;
  cheerFighterName?: string;
}

export function ContactSection({ initialProgram, initialTime, cheerFighterName }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    program: initialProgram || 'Boxe Olímpico & Profissional',
    level: 'Iniciante (Nunca treinei)',
    timeSlot: initialTime ? `Horário específico: ${initialTime}` : 'Período da Noite (18h às 21h)',
    message: cheerFighterName ? `Quero mandar um recado de torcida para o atleta ${cheerFighterName} e agendar um treino experimental!` : '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const programsList = [
    'Boxe Olímpico & Profissional',
    'Muay Thai Tradicional',
    'MMA (Artes Marciais Mistas)',
    'Brazilian Jiu-Jitsu (BJJ)',
    'Preparação Física & Conditioning',
    'Boxe Feminino & Iniciantes',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate reliable booking submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá equipe Knockout Gym! Tenho interesse em agendar uma aula experimental gratuita na modalidade ${formData.program}. Meu nome é ${formData.name || 'um novo aluno'}.`
  );

  return (
    <section id="contato" className="py-20 bg-[#0a0a0e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
              CANAIS DE CONTATO & ATENDIMENTO
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            AGENDE SUA AULA EXPERIMENTAL
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Faça sua primeira aula grátis, conheça nossa estrutura profissional e converse diretamente com nossos professores e atletas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact Details & WhatsApp Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Quick Card */}
            <div className="bg-gradient-to-br from-[#121c14] to-[#0c140d] border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                    ATENDIMENTO INSTANTÂNEO
                  </span>
                  <h3 className="text-lg font-bold text-white font-heading uppercase">
                    Fale Direto no WhatsApp
                  </h3>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                Dúvidas sobre planos, turmas, valores ou quer visitar agora? Nossa equipe de recepção responde em poucos minutos.
              </p>

              <a
                href={`https://wa.me/${GYM_INFO.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 font-heading"
              >
                <span>CHAMAR NO WHATSAPP: {GYM_INFO.phone}</span>
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Information List Card */}
            <div className="bg-[#121218] border border-neutral-800 rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Informações da Sede Knockout
              </h3>

              <div className="space-y-4 text-xs">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#181822] border border-neutral-700 flex items-center justify-center text-red-500 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-heading text-sm">Endereço Principal</strong>
                    <p className="text-neutral-300">{GYM_INFO.address}</p>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">
                      Estacionamento conveniado com manobrista no local.
                    </span>
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#181822] border border-neutral-700 flex items-center justify-center text-red-500 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-heading text-sm">Telefone & E-mail</strong>
                    <p className="text-neutral-300">Tel: {GYM_INFO.phone}</p>
                    <p className="text-neutral-400">{GYM_INFO.email}</p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#181822] border border-neutral-700 flex items-center justify-center text-red-500 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-heading text-sm">Horário de Funcionamento</strong>
                    <p className="text-neutral-300">{GYM_INFO.hoursWeekday}</p>
                    <p className="text-neutral-400">{GYM_INFO.hoursSaturday}</p>
                    <p className="text-neutral-400">{GYM_INFO.hoursSunday}</p>
                  </div>
                </div>
              </div>

              {/* Map Direction Visual */}
              <div className="p-3 bg-[#0e0e14] rounded-xl border border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold block">Próximo ao Metrô Trianon-Masp</span>
                  <span>Linha 2-Verde (a apenas 300 metros da estação)</span>
                </div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[11px] font-bold uppercase transition-colors shrink-0 ml-2"
                >
                  Abrir Mapa
                </a>
              </div>

            </div>

          </div>

          {/* Right Column: Free Trial Class Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#121218] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase text-white font-heading">
                    Agendamento Confirmado!
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Muito obrigado, <strong className="text-white">{formData.name}</strong>. Recebemos seu pedido para a aula de <strong className="text-red-400">{formData.program}</strong>.
                  </p>
                  <p className="text-xs text-neutral-400">
                    Nossa equipe já separou seus equipamentos higienizados para o teste e enviará a confirmação formal no seu WhatsApp em instantes.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                    >
                      Fazer Novo Agendamento
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1 pb-2 border-b border-neutral-800">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-red-500 font-heading">
                      <Sparkles className="w-3.5 h-3.5" />
                      1ª AULA TOTALMENTE GRATUITA
                    </div>
                    <h3 className="text-2xl font-bold uppercase text-white font-heading">
                      Reserve Sua Vaga no Tatame / Ringue
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Preencha os dados abaixo. Nós entramos em contato para reservar seus equipamentos e confirmar seu horário.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Gabriel Alves"
                        className="w-full bg-[#181822] border border-neutral-700 focus:border-red-500 focus:outline-none text-xs text-white px-3.5 py-3 rounded-xl transition-colors placeholder:text-neutral-500"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                        WhatsApp / Celular *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-[#181822] border border-neutral-700 focus:border-red-500 focus:outline-none text-xs text-white px-3.5 py-3 rounded-xl transition-colors placeholder:text-neutral-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                      Seu Melhor E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-[#181822] border border-neutral-700 focus:border-red-500 focus:outline-none text-xs text-white px-3.5 py-3 rounded-xl transition-colors placeholder:text-neutral-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Program Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                        Modalidade de Interesse *
                      </label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full bg-[#181822] border border-neutral-700 focus:border-red-500 focus:outline-none text-xs text-white px-3.5 py-3 rounded-xl transition-colors"
                      >
                        {programsList.map((prog) => (
                          <option key={prog} value={prog} className="bg-[#121218]">
                            {prog}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Previous Experience */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                        Nível de Experiência
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className="w-full bg-[#181822] border border-neutral-700 focus:border-red-500 focus:outline-none text-xs text-white px-3.5 py-3 rounded-xl transition-colors"
                      >
                        <option value="Iniciante (Nunca treinei)">Iniciante (Nunca treinei)</option>
                        <option value="Básico (Já treinei um pouco)">Básico (Já treinei um pouco)</option>
                        <option value="Intermediário (Pratico regularmente)">Intermediário (Pratico regularmente)</option>
                        <option value="Avançado / Competição">Avançado / Competição</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Time Slot */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                      Melhor Período para o Treino
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className="w-full bg-[#181822] border border-neutral-700 focus:border-red-500 focus:outline-none text-xs text-white px-3.5 py-3 rounded-xl transition-colors"
                    >
                      <option value="Manhã (06h às 10h)">Manhã (06h às 10h)</option>
                      <option value="Almoço (11h30 às 13h30)">Horário de Almoço (11h30 às 13h30)</option>
                      <option value="Tarde (15h às 18h)">Tarde (15h às 18h)</option>
                      <option value="Noite (18h às 21h30)">Noite (18h às 21h30)</option>
                      <option value="Sábado (08h às 13h)">Sábado (08h às 13h)</option>
                    </select>
                  </div>

                  {/* Optional Message or Cheer notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                      Mensagem / Observação (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Alguma restrição física, objetivo específico ou mensagem aos atletas?"
                      className="w-full bg-[#181822] border border-neutral-700 focus:border-red-500 focus:outline-none text-xs text-white px-3.5 py-2.5 rounded-xl transition-colors placeholder:text-neutral-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 rounded-xl transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer font-heading"
                  >
                    <span>{isSubmitting ? 'ENVIANDO AGENDAMENTO...' : 'CONFIRMAR MINHA AULA EXPERIMENTAL GRÁTIS'}</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sem taxa de adesão, sem cartão de crédito exigido para a aula de teste.</span>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

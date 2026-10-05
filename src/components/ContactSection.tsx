import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { GYM_INFO } from '../data/gymData';

interface ContactSectionProps {
  initialProgram?: string;
  initialTime?: string;
  cheerFighterName?: string;
}

function CustomSelect({ value, options, onChange, placeholder }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className="w-full bg-transparent border border-neutral-800 text-white px-4 py-4 rounded-xl cursor-pointer flex justify-between items-center shadow-sm hover:border-neutral-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-white" : "text-neutral-500"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#121218] border border-neutral-800 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {options.map((opt: string) => (
            <div 
              key={opt} 
              className="px-4 py-3 hover:bg-neutral-800 cursor-pointer text-neutral-300 hover:text-white transition-colors border-b last:border-0 border-neutral-800/50"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ContactSection({ initialProgram, initialTime, cheerFighterName }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    program: initialProgram || '',
    level: '',
    timeSlot: initialTime ? `Horário específico: ${initialTime}` : '',
    message: cheerFighterName ? `Quero mandar um recado de torcida para o atleta ${cheerFighterName} e agendar um treino experimental!` : '',
    agree: false
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

  const levelsList = [
    'Iniciante (Nunca treinei)',
    'Básico (Já treinei um pouco)',
    'Intermediário (Pratico regularmente)',
    'Avançado / Competição'
  ];

  const timesList = [
    'Manhã (06h às 10h)',
    'Horário de Almoço (11h30 às 13h30)',
    'Tarde (15h às 18h)',
    'Noite (18h às 21h30)',
    'Sábado (08h às 13h)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.program || !formData.level || !formData.timeSlot) {
      alert("Por favor, preencha todos os campos do formulário.");
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="contato" className="py-24 bg-[#0a0a0e] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
              1ª AULA TOTALMENTE GRATUITA
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Reserve Sua Vaga no Tatame
          </h2>
          <p className="text-base text-neutral-300 leading-relaxed max-w-xl mx-auto">
            Dê o primeiro passo para a sua evolução. Preencha os dados abaixo de forma rápida e nossa equipe entrará em contato em minutos via WhatsApp para confirmar seu horário e equipamentos.
          </p>
        </div>

        <div className="w-full">
          {submitted ? (
            <div className="py-16 text-center space-y-4 bg-neutral-50 rounded-3xl border border-neutral-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 font-heading">
                Agendamento Recebido!
              </h3>
              <p className="text-neutral-600 max-w-md mx-auto leading-relaxed">
                Muito obrigado, <strong>{formData.name}</strong>. Nossa equipe entrará em contato em breve pelo WhatsApp.
              </p>
              <div className="pt-6">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 font-bold tracking-wider text-black bg-[#ffde00] hover:bg-[#e6c800] rounded-full cursor-pointer transition-colors shadow-md"
                >
                  Fazer Novo Agendamento
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <CustomSelect 
                placeholder="Modalidade de Interesse*" 
                options={programsList} 
                value={formData.program} 
                onChange={(val: string) => setFormData({...formData, program: val})} 
              />
              
              <CustomSelect 
                placeholder="Nível de Experiência*" 
                options={levelsList} 
                value={formData.level} 
                onChange={(val: string) => setFormData({...formData, level: val})} 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome Completo*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-4 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm"
                />

                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="WhatsApp / Celular*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-4 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Seu Melhor E-mail*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-4 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm"
                />

                <CustomSelect 
                  placeholder="Melhor Período para o Treino*" 
                  options={timesList} 
                  value={formData.timeSlot} 
                  onChange={(val: string) => setFormData({...formData, timeSlot: val})} 
                />
              </div>

              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mensagem (Opcional)"
                className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-4 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm resize-none"
              />

              <div className="flex items-start gap-3 pt-2 pb-4">
                <input 
                  type="checkbox" 
                  id="agree" 
                  required
                  checked={formData.agree}
                  onChange={(e) => setFormData({...formData, agree: e.target.checked})}
                  className="mt-1 w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                />
                <label htmlFor="agree" className="text-sm text-neutral-300 cursor-pointer">
                  Gostaria de receber atualizações sobre aulas, eventos e serviços (veja nossa Política de Privacidade).<br/>
                  <span className="text-xs text-neutral-400 mt-1 block">
                    Ao enviar este formulário, você concorda com o processamento dos seus dados para agendamento.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-10 py-4 font-bold tracking-wider uppercase text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-base shadow-lg shadow-red-600/20"
              >
                <span>{isSubmitting ? 'Enviando Agendamento...' : 'Confirmar Minha Aula Experimental'}</span>
                <Send className="w-5 h-5" />
              </button>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}

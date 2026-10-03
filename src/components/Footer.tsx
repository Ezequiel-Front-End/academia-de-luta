import { Flame, Instagram, Youtube, Facebook, MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { GYM_INFO } from '../data/gymData';
import { useState } from 'react';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#060608] text-neutral-400 border-t border-neutral-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-600/30">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold tracking-wider text-white leading-none">
                  KNOCKOUT
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-red-500 leading-tight">
                  FIGHT GYM
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed pr-6">
              Train hard. Hit harder. Be your best. A academia que une a essência das artes de combate de alta performance com um ambiente acolhedor para todas as idades.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#14141c] hover:bg-red-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#14141c] hover:bg-red-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#14141c] hover:bg-red-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#inicio" className="hover:text-red-500 transition-colors">Início</a>
              </li>
              <li>
                <a href="#programas" className="hover:text-red-500 transition-colors">Modalidades</a>
              </li>
              <li>
                <a href="#lutadores" className="hover:text-red-500 transition-colors">Plantel de Lutadores</a>
              </li>
              <li>
                <a href="#lutas-agendadas" className="hover:text-red-500 transition-colors">Lutas Agendadas</a>
              </li>
              <li>
                <a href="#horarios" className="hover:text-red-500 transition-colors">Grade de Horários</a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-red-500 transition-colors">A Academia</a>
              </li>
              <li>
                <a href="#contato" className="hover:text-red-500 transition-colors">Contato & Localização</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Atendimento & Endereço
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>{GYM_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{GYM_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{GYM_INFO.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block">{GYM_INFO.hoursWeekday}</span>
                  <span className="block">{GYM_INFO.hoursSaturday}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter / Fight Alerts */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
              Fique Conectado
            </h4>
            <p className="text-xs text-neutral-400">
              Receba comunicados oficiais das próximas lutas da equipe e promoções exclusivas.
            </p>

            {newsletterSubscribed ? (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
                Obrigado por se inscrever! Você receberá as novidades dos combates.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Seu e-mail..."
                    className="w-full bg-[#121218] border border-neutral-800 text-xs text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 placeholder:text-neutral-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-heading"
                >
                  <span>INSCREVER-SE</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 Knockout Fight Gym. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6 text-neutral-400">
            <a href="#contato" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#contato" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#contato" className="hover:text-white transition-colors">Normas de Conduta no Tatame</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Minus,
  Send,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  Calendar,
  MessageCircle,
  Phone,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { GYM_INFO, PROGRAMS_DATA } from '../data/gymData';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
    primary?: boolean;
  }[];
}

interface LeeChatbotProps {
  onOpenBooking?: (program?: string) => void;
}

export function LeeChatbot({ onOpenBooking }: LeeChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(true);

  // Video state inside modal
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Chat message state
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Initial greeting sound or tooltip timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      // Gentle tooltip appears if chat hasn't been opened
      if (!isOpen) {
        setShowWelcomeTooltip(true);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // When opening modal, play video and reset unread
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setShowWelcomeTooltip(false);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Autoplay policy handled gracefully
        });
      }
    }
  }, [isOpen]);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const handleRestartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleQuickOption = (option: string) => {
    // Add user selection as a message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: option,
      timestamp: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse: Message;

      switch (option) {
        case 'Conhecer as modalidades':
        case '🥋 Conhecer as modalidades':
          botResponse = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: `Aqui na **BBT**, nós respiramos artes marciais de elite! Nossas modalidades contam com professores graduados e estrutura profissional:\n\n` +
              `🥊 **Boxe Olímpico & Profissional**: Jogo de pernas impecável, esquiva e potência máxima de socos.\n\n` +
              `🥋 **Muay Thai Tradicional**: A arte das 8 armas (punhos, cotovelos, joelhos e chutes na canela).\n\n` +
              `🤼 **Jiu-Jitsu Brasileiro (BJJ)**: A arte suave para dominar e finalizar qualquer oponente no solo com alavancas.\n\n` +
              `⚡ **MMA (Artes Marciais Mistas)**: A integração total de striking, wrestling e solo no octógono.\n\n` +
              `🏋️ **Preparação Física & Conditioning**: Circuito com cordas navais, pneus e kettlebells para você ter gás de sobra no tatame!`,
            timestamp: getCurrentTime(),
            actionButtons: [
              {
                label: '🔥 Agendar aula experimental gratuita',
                action: () => handleQuickOption('Agendar aula experimental'),
                primary: true,
              },
              {
                label: '🕒 Ver horários de treino',
                action: () => handleQuickOption('Consultar horários'),
              },
              {
                label: '↩️ Voltar ao menu',
                action: () => handleResetToMenu(),
              },
            ],
          };
          break;

        case 'Consultar horários':
        case '🕒 Consultar horários':
          botResponse = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: `Nossos horários foram pensados para encaixar na sua rotina, do amanhecer até a noite:\n\n` +
              `⏰ **Segunda a Sexta**: 06:00 às 22:30\n` +
              `⏰ **Sábado**: 08:00 às 17:00\n` +
              `⏰ **Domingo**: 09:00 às 13:00 (Open Mat e Aulões Especiais)\n\n` +
              `Temos turmas pela manhã (06h30, 07h, 08h30), tarde (12h, 16h) e noite (18h, 19h30, 20h30).`,
            timestamp: getCurrentTime(),
            actionButtons: [
              {
                label: '📅 Ver grade completa no site',
                action: () => {
                  const el = document.getElementById('horarios');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                },
                primary: true,
              },
              {
                label: '🔥 Agendar experimental no meu horário',
                action: () => handleQuickOption('Agendar aula experimental'),
              },
              {
                label: '↩️ Voltar ao menu',
                action: () => handleResetToMenu(),
              },
            ],
          };
          break;

        case 'Agendar aula experimental':
        case '🔥 Agendar aula experimental':
          botResponse = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: `Excelente escolha! A sua **1ª aula experimental na BBT é 100% gratuita** e sem qualquer compromisso!\n\n` +
              `Você não precisa ter experiência anterior nem equipamento próprio para a primeira aula — nossa equipe disponibiliza luvas e caneleiras para você experimentar com total segurança.\n\n` +
              `Como prefere agendar seu treino?`,
            timestamp: getCurrentTime(),
            actionButtons: [
              {
                label: '📝 Preencher agendamento no site',
                action: () => {
                  if (onOpenBooking) {
                    onOpenBooking();
                  } else {
                    const el = document.getElementById('contato');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                },
                primary: true,
              },
              {
                label: '📲 Agendar direto pelo WhatsApp',
                action: () => {
                  window.open(
                    `https://wa.me/${GYM_INFO.whatsapp}?text=${encodeURIComponent(
                      'Olá! O Lee me atendeu no site e quero agendar minha aula experimental gratuita na BBT!'
                    )}`,
                    '_blank'
                  );
                },
              },
              {
                label: '↩️ Voltar ao menu',
                action: () => handleResetToMenu(),
              },
            ],
          };
          break;

        case 'Localização da academia':
        case '📍 Localização da academia':
          botResponse = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: `Estamos muito bem localizados no coração de São Paulo!\n\n` +
              `📍 **Endereço**: ${GYM_INFO.address}\n` +
              `🚇 **Ponto de Referência**: A poucos metros das estações de Metrô Consolação e Trianon-Masp.\n` +
              `🚗 **Estacionamento**: Convênio no local com manobrista para sua comodidade.`,
            timestamp: getCurrentTime(),
            actionButtons: [
              {
                label: '🗺️ Abrir no Google Maps',
                action: () => {
                  window.open(
                    `https://maps.google.com/?q=${encodeURIComponent(GYM_INFO.name + ' ' + GYM_INFO.address)}`,
                    '_blank'
                  );
                },
                primary: true,
              },
              {
                label: '🔥 Agendar visita experimental',
                action: () => handleQuickOption('Agendar aula experimental'),
              },
              {
                label: '↩️ Voltar ao menu',
                action: () => handleResetToMenu(),
              },
            ],
          };
          break;

        case 'Falar com a equipe':
        case '💬 Falar com a equipe':
          botResponse = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: `Nossa recepção e coordenadores técnicos estão a postos para tirar qualquer dúvida sobre planos, graduações e valores!\n\n` +
              `📱 **WhatsApp**: ${GYM_INFO.phone}\n` +
              `✉️ **E-mail**: ${GYM_INFO.email}\n` +
              `🕒 **Atendimento imediato**: Segunda a Sexta das 06h às 22h30.`,
            timestamp: getCurrentTime(),
            actionButtons: [
              {
                label: '💬 Iniciar conversa no WhatsApp',
                action: () => {
                  window.open(
                    `https://wa.me/${GYM_INFO.whatsapp}?text=${encodeURIComponent(
                      'Olá! Estava conversando com o Lee no site e gostaria de falar com a equipe da BBT.'
                    )}`,
                    '_blank'
                  );
                },
                primary: true,
              },
              {
                label: '📞 Ligar para a academia',
                action: () => {
                  window.open(`tel:${GYM_INFO.phone.replace(/\D/g, '')}`, '_self');
                },
              },
              {
                label: '↩️ Voltar ao menu',
                action: () => handleResetToMenu(),
              },
            ],
          };
          break;

        default:
          botResponse = handleFreeTextQuery(option);
          break;
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  const handleResetToMenu = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Beleza! O que mais você gostaria de saber sobre a **BBT**?`,
        timestamp: getCurrentTime(),
      },
    ]);
  };

  const handleFreeTextQuery = (text: string): Message => {
    const q = text.toLowerCase().trim();

    if (q.includes('preço') || q.includes('valor') || q.includes('plano') || q.includes('mensalidade') || q.includes('quanto custa')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Temos planos flexíveis que se ajustam ao seu objetivo (Plano Mensal, Trimestral, Semestral e Anual VIP Black com livre acesso a todas as modalidades)!\n\n` +
          `Além disso, estamos com **isenção na taxa de matrícula** para novos alunos que agendam a aula experimental esta semana.\n\n` +
          `Gostaria de agendar sua aula gratuita para conhecer a estrutura e conferir a tabela completa de valores?`,
        timestamp: getCurrentTime(),
        actionButtons: [
          {
            label: '🔥 Agendar aula experimental gratuita',
            action: () => handleQuickOption('Agendar aula experimental'),
            primary: true,
          },
          {
            label: '💬 Consultar tabela no WhatsApp',
            action: () => {
              window.open(
                `https://wa.me/${GYM_INFO.whatsapp}?text=${encodeURIComponent(
                  'Olá! Quero consultar os valores e planos disponíveis da BBT!'
                )}`,
                '_blank'
              );
            },
          },
          {
            label: '↩️ Voltar ao menu',
            action: () => handleResetToMenu(),
          },
        ],
      };
    }

    if (q.includes('iniciante') || q.includes('nunca treinei') || q.includes('zero') || q.includes('mulher') || q.includes('idade')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Você é super bem-vindo(a)! Mais de **60% dos nossos alunos começaram do absoluto zero**, sem nunca ter colocado uma luva ou pisado no tatame.\n\n` +
          `Aqui na BBT temos ambiente acolhedor, turmas fundamentais, respeito mútuo e instrutores focados na sua evolução no seu próprio ritmo, sem riscos de lesão!`,
        timestamp: getCurrentTime(),
        actionButtons: [
          {
            label: '🔥 Fazer uma aula de teste sem compromisso',
            action: () => handleQuickOption('Agendar aula experimental'),
            primary: true,
          },
          {
            label: '🥋 Conhecer as modalidades',
            action: () => handleQuickOption('Conhecer as modalidades'),
          },
        ],
      };
    }

    if (q.includes('roupa') || q.includes('equipamento') || q.includes('luva') || q.includes('levar')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Para a sua **primeira aula experimental**, basta vir com uma roupa de treino confortável (bermuda/shorts e camiseta esportiva) e trazer uma garrafinha de água!\n\n` +
          `Nós emprestamos as luvas higienizadas e caneleiras para o seu primeiro contato. Depois, caso decida treinar conosco, nossa loja interna possui todo o kit oficial BBT.`,
        timestamp: getCurrentTime(),
        actionButtons: [
          {
            label: '🔥 Agendar minha aula agora',
            action: () => handleQuickOption('Agendar aula experimental'),
            primary: true,
          },
          {
            label: '↩️ Voltar ao menu',
            action: () => handleResetToMenu(),
          },
        ],
      };
    }

    if (q.includes('lutador') || q.includes('atleta') || q.includes('kaah') || q.includes('ricardo') || q.includes('kauany') || q.includes('campeonato')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `O esquadrão da BBT é pesado! 🔥 Temos atletas de elite no cenário nacional e internacional, como **Kauany "Kaah" Oliveira** (disputando o cinturão do Jungle Fight), **Ricardo "Ricardinho"**, **Gabriel "Gaah"** e vários campeões no Muay Thai e Jiu-Jitsu.\n\n` +
          `Você pode acompanhar as lutas agendadas e torcer pelos nossos guerreiros direto aqui no site!`,
        timestamp: getCurrentTime(),
        actionButtons: [
          {
            label: '🥊 Ver lutas agendadas no site',
            action: () => {
              const el = document.getElementById('lutas-agendadas');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            },
            primary: true,
          },
          {
            label: '↩️ Voltar ao menu',
            action: () => handleResetToMenu(),
          },
        ],
      };
    }

    // Generic friendly answer
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: `Entendi perfeitamente! Como seu assistente virtual da BBT, posso te ajudar a agendar treinos, tirar dúvidas sobre turmas ou te conectar direto com os professores.\n\n` +
        `O que você prefere fazer agora?`,
      timestamp: getCurrentTime(),
      actionButtons: [
        {
          label: '🔥 Agendar aula experimental gratuita',
          action: () => handleQuickOption('Agendar aula experimental'),
          primary: true,
        },
        {
          label: '💬 Falar com um atendente humano no WhatsApp',
          action: () => {
            window.open(
              `https://wa.me/${GYM_INFO.whatsapp}?text=${encodeURIComponent(
                `Olá! Estava conversando com o Lee no site sobre: "${text}" e gostaria de mais informações.`
              )}`,
              '_blank'
            );
          },
        },
        {
          label: '↩️ Menu de opções',
          action: () => handleResetToMenu(),
        },
      ],
    };
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = handleFreeTextQuery(userText);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Action Button for Chatbot — Placed right above WhatsApp button */}
      <div className="relative group">
        {/* Floating Greeting Tooltip */}
        {showWelcomeTooltip && !isOpen && (
          <div
            onClick={() => {
              setIsOpen(true);
              setShowWelcomeTooltip(false);
            }}
            className="absolute right-16 bottom-1 w-64 bg-[#14151c] text-white p-3 rounded-2xl border border-orange-500/40 shadow-2xl shadow-orange-950/60 cursor-pointer animate-fade-in transition-all hover:scale-105 z-50"
            role="alert"
          >
            <div className="flex items-start gap-2.5">
              <div className="relative shrink-0">
                <img
                  src="/lee-robot.png"
                  alt="Lee Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-orange-500"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#14151c]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white tracking-wide">Lee — BBT</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWelcomeTooltip(false);
                    }}
                    className="text-neutral-400 hover:text-white p-0.5"
                    aria-label="Fechar dica"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
                  Fala guerreiro! 🥊 Tem dúvidas sobre treinos ou quer agendar sua aula grátis? Fale comigo!
                </p>
              </div>
            </div>
            {/* Arrow pointer */}
            <div className="absolute right-[-6px] bottom-4 w-3 h-3 bg-[#14151c] border-t border-r border-orange-500/40 rotate-45" />
          </div>
        )}

        {/* The Main Launcher Button */}
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            setIsMinimized(false);
            setShowWelcomeTooltip(false);
          }}
          className={`w-13 h-13 rounded-full relative flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer active:scale-95 group ${
            isOpen
              ? 'bg-[#181824] border-2 border-orange-500 text-white shadow-orange-950/70 scale-105'
              : 'bg-[#121218] hover:bg-[#1a1a24] border-2 border-orange-500/80 hover:border-orange-500 shadow-orange-950/50 hover:scale-108'
          }`}
          aria-label={isOpen ? 'Fechar chat com Lee' : 'Abrir chat com Lee - Assistente BBT'}
          title="Falar com Lee — Assistente Virtual BBT"
        >
          {/* Avatar image of the robot */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="/lee-robot.png"
              alt="Lee - Robô BBT"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Active online green dot */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#121218] rounded-full animate-pulse" />

          {/* Glowing pulse ring */}
          <span className="absolute -inset-1 rounded-full border border-orange-500/30 animate-ping pointer-events-none" />
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <aside
          role="dialog"
          aria-label="Chat com Lee BBT"
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-neutral-300/80 ${
            isMinimized
              ? 'bottom-24 right-4 sm:right-6 w-80 bg-[#14151d] border-orange-500/40'
              : 'bottom-20 sm:bottom-24 right-2 sm:right-6 w-[calc(100vw-16px)] sm:w-[410px] md:w-[430px] h-[610px] max-h-[85vh] bg-[#F8F8F8]'
          }`}
        >
          {/* Header (Dark, exactly matching user mockup) */}
          <div className="bg-[#14151a] text-white px-4 py-3 flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/lee-robot.png"
                  alt="Lee Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-neutral-600 bg-neutral-900"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#14151a] rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base leading-tight">Lee — BBT</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-neutral-400 font-normal">Assistente virtual</span>
                </div>
              </div>
            </div>

            {/* Window action buttons (Minimize and Close) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized((prev) => !prev)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800/80 rounded-lg transition-colors cursor-pointer"
                aria-label={isMinimized ? 'Expandir conversa' : 'Minimizar conversa'}
                title={isMinimized ? 'Expandir' : 'Minimizar'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800/80 rounded-lg transition-colors cursor-pointer"
                aria-label="Fechar conversa"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Minimized Dock Bar */}
          {isMinimized ? (
            <div
              onClick={() => setIsMinimized(false)}
              className="p-3 bg-[#181922] text-neutral-200 text-xs flex items-center justify-between cursor-pointer hover:bg-[#1f202c] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" />
                Clique para continuar a conversa com o Lee
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          ) : (
            <>
              {/* Chat Scrollable Area - #F8F8F8 background matching the video */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F8F8]">
                {/* 1. Presentation Video from Lee - Seamlessly on #F8F8F8 without box or cutoff line */}
                {showVideo && (
                  <div className="flex flex-col items-center justify-center pt-0 pb-0 relative">
                    <div className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-video flex items-center justify-center bg-[#F8F8F8] overflow-hidden">
                      <video
                        ref={videoRef}
                        src="/apresentacao_lee_robo.mp4?v=4"
                        poster="/lee-robot.png"
                        playsInline
                        muted
                        autoPlay
                        loop
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                        className="w-full h-full object-cover cursor-pointer bg-[#F8F8F8]"
                        onClick={handleTogglePlay}
                        title="Clique para reproduzir / pausar"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Welcome Card (Matching user mockup layout) */}
                <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/50 text-neutral-800 animate-fade-in mt-1">
                  <h4 className="font-bold text-neutral-900 text-base leading-snug">
                    Fala! 🥊 Eu sou o Lee!
                  </h4>
                  <p className="text-neutral-700 text-sm mt-2 leading-relaxed">
                    Seja muito bem-vindo à BBT! Estou aqui para te ajudar a conhecer nossa academia e encontrar o treino ideal para você.
                  </p>
                  <p className="font-semibold text-neutral-900 text-sm mt-3">
                    O que você gostaria de saber?
                  </p>
                </div>

                {/* 3. Quick Option Pills (The 5 items from user screenshot) */}
                <div className="flex flex-col gap-2 pt-1">
                  {[
                    { label: '🥋 Conhecer as modalidades', value: 'Conhecer as modalidades' },
                    { label: '🕒 Consultar horários', value: 'Consultar horários' },
                    { label: '🔥 Agendar aula experimental', value: 'Agendar aula experimental' },
                    { label: '📍 Localização da academia', value: 'Localização da academia' },
                    { label: '💬 Falar com a equipe', value: 'Falar com a equipe' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleQuickOption(opt.value)}
                      className="w-full bg-white hover:bg-neutral-50 active:bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-full px-5 py-3 text-sm font-medium text-left shadow-xs hover:shadow-sm hover:border-orange-500/40 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span>{opt.label}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>

                {/* 4. Dynamic conversation messages */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    } animate-fade-in space-y-1.5`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#14151a] text-white rounded-br-xs'
                          : 'bg-white text-neutral-800 border border-neutral-200/90 rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed">
                        {msg.text.split('**').map((part, index) =>
                          index % 2 === 1 ? (
                            <strong key={index} className="font-bold text-neutral-950">
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </div>

                      {/* Interactive Action Buttons attached to the bot response */}
                      {msg.actionButtons && msg.actionButtons.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-neutral-100 flex flex-col gap-1.5">
                          {msg.actionButtons.map((btn, bIndex) => (
                            <button
                              key={bIndex}
                              onClick={btn.action}
                              className={`text-xs px-3 py-2 rounded-xl font-medium text-left transition-all flex items-center gap-2 cursor-pointer ${
                                btn.primary
                                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs font-semibold'
                                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                              }`}
                            >
                              {btn.icon}
                              <span>{btn.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 bg-white border border-neutral-200 px-3.5 py-2.5 rounded-2xl rounded-bl-xs w-fit shadow-xs">
                    <img
                      src="/lee-robot.png"
                      alt="Lee"
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="text-xs text-neutral-500 font-medium">Lee está digitando</span>
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* 5. Bottom Input Area (White pill with orange send icon from mockup) */}
              <div className="p-3 bg-[#F8F8F8] border-t border-neutral-200/50 shrink-0">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="w-full bg-white text-neutral-800 placeholder-neutral-400 text-sm rounded-full pl-4 pr-12 py-3 border border-neutral-300 focus:outline-none focus:border-orange-500 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className={`absolute right-2.5 p-2 rounded-full transition-all cursor-pointer ${
                      inputValue.trim()
                        ? 'text-orange-500 hover:text-orange-600 hover:scale-110 active:scale-95'
                        : 'text-neutral-300 cursor-not-allowed'
                    }`}
                    aria-label="Enviar mensagem"
                  >
                    <Send className="w-5 h-5 text-orange-500 transform rotate-0" />
                  </button>
                </form>
              </div>
            </>
          )}
        </aside>
      )}
    </>
  );
}

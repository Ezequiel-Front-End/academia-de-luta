import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Database,
  LogOut,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronDown,
  TrendingUp,
  Clock,
  MapPin,
  Trophy,
  Flame,
  ArrowUpRight,
  RefreshCw,
  X,
  Save,
  AlertCircle,
  Users,
  Quote,
  Star,
  Handshake,
  Dumbbell,
  Layers,
  Swords,
  Tv,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  GradeHorarioTreino,
  DepoimentoAluno,
  FederacaoEntidade,
  ParceiroPatrocinador,
  ModalidadeTreino,
  LutaAgendada,
} from '../../types/database';
import {
  subscribeToSchedules,
  saveScheduleToFirestore,
  deleteScheduleFromFirestore,
} from '../../services/scheduleService';
import {
  subscribeToTestimonials,
  saveTestimonialToFirestore,
  deleteTestimonialFromFirestore,
} from '../../services/testimonialService';
import {
  subscribeToFederations,
  saveFederationToFirestore,
  deleteFederationFromFirestore,
} from '../../services/federationService';
import {
  subscribeToPartners,
  savePartnerToFirestore,
  deletePartnerFromFirestore,
} from '../../services/partnerService';
import {
  subscribeToModalities,
  saveModalityToFirestore,
  deleteModalityFromFirestore,
} from '../../services/modalityService';
import {
  subscribeToScheduledFights,
  saveScheduledFightToFirestore,
  deleteScheduledFightFromFirestore,
} from '../../services/fightService';

// Opções padronizadas de Lutas
const FIGHT_STATUS_OPTIONS = [
  'Card Principal',
  'Disputa de Título',
  'Confirmada',
  'Card Preliminar',
];

const WEIGHT_CLASSES_OPTIONS = [
  'Peso Palha Feminino (52.2 kg)',
  'Peso Mosca (56.7 kg)',
  'Peso Galo (61.2 kg)',
  'Peso Pena Feminino (57 kg)',
  'Peso Pena (65.8 kg)',
  'Peso Leve (70.3 kg)',
  'Peso Meio-Médio (77.1 kg)',
  'Peso Médio (83.9 kg)',
  'Peso Médio Muay Thai (75 kg)',
  'Peso Meio-Pesado (93.0 kg)',
  'Peso Pesado (120.2 kg)',
];

// Opções padronizadas no ecossistema BBT
const MODALITY_CATEGORIES_OPTIONS = [
  'Striking',
  'Grappling',
  'Mixed Martial Arts',
  'Fitness',
  'Iniciantes / Feminino',
  'Defesa Pessoal',
];

const MODALITY_INTENSITIES_OPTIONS = [
  'Moderada',
  'Alta',
  'Extrema',
];

// Opções padronizadas no ecossistema BBT
const RATING_OPTIONS = [
  '⭐⭐⭐⭐⭐ (5 Estrelas - Excelente)',
  '⭐⭐⭐⭐ (4 Estrelas - Muito Bom)',
  '⭐⭐⭐ (3 Estrelas - Bom)',
];

const THEME_COLOR_OPTIONS = [
  'Vermelho (Padrão BBT)',
  'Azul (Oficial WAKO)',
  'Verde (Oficial CBKB)',
  'Dourado (Campeão)',
  'Neutro (Minimalista)',
];

const DAYS_OPTIONS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

const MODALITIES_OPTIONS = [
  'Boxe Olímpico & Condicionamento',
  'Boxe Feminino & Iniciantes',
  'Muay Thai Tradicional',
  'Muay Thai (Striking & Clinch)',
  'Brazilian Jiu-Jitsu (BJJ)',
  'Jiu-Jitsu No-Gi (Submission)',
  'MMA (Artes Marciais Mistas)',
  'MMA Profissional & Sparring Técnico',
  'Wrestling Aplicado ao MMA',
  'Preparação Física do Lutador',
  'Circuito Queima Intensa & Boxe',
  'Sexta do Combate (Sessão Aberta de Luvas)',
  'Aulão de Boxe Comunitário BBT',
  'Open Mat de Jiu-Jitsu (Gi & No-Gi)',
  'Camp de Luta: Atletas com Luta Marcada',
];

const LEVELS_OPTIONS = [
  'Todos os Níveis',
  'Iniciante (Nunca treinei)',
  'Básico (Já treinei um pouco)',
  'Intermediário (Pratico regularmente)',
  'Avançado / Competição'
];

const ROOMS_OPTIONS = [
  'Ringue Principal',
  'Tatame 1',
  'Área de Sacos',
  'Octógono Oficial',
  'Studio Funcional'
];

const TIMES_OPTIONS = [
  '06:00 - 07:00',
  '06:30 - 07:30',
  '07:00 - 08:00',
  '07:00 - 08:15',
  '07:00 - 08:30',
  '07:30 - 08:45',
  '08:00 - 09:00',
  '08:30 - 09:30',
  '09:00 - 10:00',
  '09:00 - 10:15',
  '10:00 - 11:00',
  '10:30 - 12:00',
  '11:30 - 12:30',
  '12:00 - 13:00',
  '12:15 - 13:45',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '18:00 - 19:15',
  '18:00 - 19:30',
  '18:30 - 19:30',
  '18:30 - 19:45',
  '19:00 - 20:00',
  '19:00 - 20:15',
  '19:30 - 20:45',
  '19:30 - 21:00',
  '20:00 - 21:00',
  '20:00 - 21:15',
  '20:30 - 21:45',
  '20:30 - 22:00',
  'Outro horário (personalizado)'
];

// Componente CustomSelect com a mesma estilização do formulário de contato do site
interface CustomSelectProps {
  value?: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
}

function CustomSelect({ value, options, onChange, placeholder, label }: CustomSelectProps) {
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
      {label && (
        <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
          {label}
        </label>
      )}
      <div 
        className={`w-full bg-transparent border ${
          isOpen ? 'border-red-500 ring-1 ring-red-500/30' : 'border-neutral-800'
        } text-white px-4 py-3.5 rounded-xl cursor-pointer flex justify-between items-center shadow-sm hover:border-neutral-700 transition-colors text-sm`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-white font-medium" : "text-neutral-500"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-500' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#121218] border border-neutral-800 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
          {options.map((opt: string) => (
            <div 
              key={opt} 
              className={`px-4 py-3 hover:bg-neutral-800 cursor-pointer text-sm transition-colors border-b last:border-0 border-neutral-800/50 flex items-center justify-between ${
                value === opt ? 'text-white bg-neutral-800/60 font-semibold' : 'text-neutral-300 hover:text-white'
              }`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              <span>{opt}</span>
              {value === opt && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export function AdminDashboard({ onBackToSite }: AdminDashboardProps) {
  const { user, logout } = useAuth();

  // Abas do Portal Admin: Painel Geral, Grade de Horários, Depoimentos, Federações, Parceiros, Modalidades e Lutas Agendadas
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedules' | 'testimonials' | 'federations' | 'partners' | 'modalities' | 'fights'>('dashboard');

  // Estado dos horários sincronizado em tempo real com o Cloud Firestore
  const [horarios, setHorarios] = useState<GradeHorarioTreino[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<GradeHorarioTreino | null>(null);
  const [scheduleDayFilter, setScheduleDayFilter] = useState<string>('Todas');
  const [scheduleProgramFilter, setScheduleProgramFilter] = useState<string>('Todas');
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [scheduleToast, setScheduleToast] = useState<string | null>(null);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);
  const [isCustomTime, setIsCustomTime] = useState(false);

  const [scheduleForm, setScheduleForm] = useState<Partial<GradeHorarioTreino>>({
    dia_semana: 'Segunda',
    horario: '07:00 - 08:30',
    modalidade: 'Boxe',
    nivel: 'Todos os Níveis',
    treinador: 'Mestre Rogério Caveira',
    sala: 'Ringue Principal',
  });

  // Estado dos depoimentos sincronizado em tempo real com o Cloud Firestore
  const [depoimentos, setDepoimentos] = useState<DepoimentoAluno[]>([]);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<DepoimentoAluno | null>(null);
  const [testimonialSearch, setTestimonialSearch] = useState('');
  const [testimonialToast, setTestimonialToast] = useState<string | null>(null);

  const [testimonialForm, setTestimonialForm] = useState<Partial<DepoimentoAluno>>({
    nome: '',
    cargo_modalidade: '',
    destaque: '',
    depoimento: '',
    avaliacao: 5,
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    ativo: true,
  });

  // Estado das Federações & Confederações
  const [federacoes, setFederacoes] = useState<FederacaoEntidade[]>([]);
  const [isFederationModalOpen, setIsFederationModalOpen] = useState(false);
  const [editingFederation, setEditingFederation] = useState<FederacaoEntidade | null>(null);
  const [federationSearch, setFederationSearch] = useState('');
  const [federationToast, setFederationToast] = useState<string | null>(null);

  const [federationForm, setFederationForm] = useState<Partial<FederacaoEntidade>>({
    nome: '',
    nome_completo: '',
    logo: '/FMTSP-oficial.png',
    descricao: '',
    link: '#',
    cor_tema: 'vermelho',
    ativo: true,
  });

  // Estado dos Parceiros & Patrocinadores
  const [parceiros, setParceiros] = useState<ParceiroPatrocinador[]>([]);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<ParceiroPatrocinador | null>(null);
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerToast, setPartnerToast] = useState<string | null>(null);

  const [partnerForm, setPartnerForm] = useState<Partial<ParceiroPatrocinador>>({
    nome: '',
    nome_completo: '',
    logo: '/JS-Bucais.jpeg',
    descricao: '',
    link: '#',
    cor_tema: 'neutro',
    ativo: true,
  });

  // Estado das Modalidades de Treino sincronizado em tempo real com o Cloud Firestore
  const [modalidades, setModalidades] = useState<ModalidadeTreino[]>([]);
  const [isModalityModalOpen, setIsModalityModalOpen] = useState(false);
  const [editingModality, setEditingModality] = useState<ModalidadeTreino | null>(null);
  const [modalitySearch, setModalitySearch] = useState('');
  const [modalityToast, setModalityToast] = useState<string | null>(null);

  const [modalityForm, setModalityForm] = useState<{
    titulo: string;
    subtitulo: string;
    categoria: string;
    descricao: string;
    resumo_horarios: string;
    intensidade: string;
    treinador: string;
    imagem: string;
    beneficiosStr: string;
    equipamentosStr: string;
    ativo: boolean;
  }>({
    titulo: '',
    subtitulo: '',
    categoria: 'Striking',
    descricao: '',
    resumo_horarios: 'Segunda a Sexta · Turmas manhã, tarde e noite',
    intensidade: 'Alta',
    treinador: 'Prof. Treinador BBT',
    imagem: 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80',
    beneficiosStr: 'Coordenação motora e reflexos rápidos\nQueima calórica intensa (~800 kcal/aula)\nFortalecimento de ombros, abdômen e pernas\nAutoconfiança e alívio do estresse',
    equipamentosStr: 'Bandagens elásticas 4m\nLuvas de treino\nProtetor bucal',
    ativo: true,
  });

  // Estado das Lutas Agendadas sincronizado em tempo real com o Cloud Firestore
  const [lutas, setLutas] = useState<LutaAgendada[]>([]);
  const [isFightModalOpen, setIsFightModalOpen] = useState(false);
  const [editingFight, setEditingFight] = useState<LutaAgendada | null>(null);
  const [fightSearch, setFightSearch] = useState('');
  const [fightStatusFilter, setFightStatusFilter] = useState('Todas');
  const [fightToast, setFightToast] = useState<string | null>(null);

  const [fightForm, setFightForm] = useState<Partial<LutaAgendada>>({
    evento: '',
    organizacao: 'Jungle Fight Championship',
    data: '',
    horario: '20:30',
    local: 'Ginásio do Ibirapuera',
    cidade: 'São Paulo, SP',
    pais: 'Brasil',
    nome_lutador: 'Gabriel',
    apelido_lutador: 'Gaah',
    cartel_lutador: '11-1-0 (5 KOs)',
    foto_lutador: '/gabriel_lutador.png',
    nome_oponente: '',
    apelido_oponente: '',
    cartel_oponente: '',
    equipe_oponente: '',
    foto_oponente: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=800&q=80',
    categoria_peso: 'Peso Leve (70.3 kg)',
    rounds: 3,
    luta_principal: false,
    disputa_titulo: false,
    nome_titulo: '',
    transmissao: 'UFC Fight Pass e Band',
    link_ingressos: '#',
    status: 'Card Principal',
    observacoes: '',
    ativo: true,
  });

  // Listener em tempo real da coleção 'grade_horarios' do Firebase
  useEffect(() => {
    const unsubscribe = subscribeToSchedules(
      (items) => {
        setHorarios(items || []);
      },
      (error) => {
        console.warn('Listener Firebase:', error);
        if (error.message?.includes('PERMISSION_DENIED') || error.message?.includes('has not been used')) {
          setFirestoreError('Ative o Cloud Firestore no console do Firebase: https://console.firebase.google.com/project/bbt-academia/firestore');
        }
      }
    );
    return () => unsubscribe();
  }, []);

  // Listener em tempo real da coleção 'depoimentos' do Firebase
  useEffect(() => {
    const unsubscribe = subscribeToTestimonials(
      (items) => {
        setDepoimentos(items || []);
      },
      (error) => {
        console.warn('Listener Firebase Depoimentos:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Listener em tempo real da coleção 'federacoes' do Firebase
  useEffect(() => {
    const unsubscribe = subscribeToFederations(
      (items) => {
        setFederacoes(items || []);
      },
      (error) => {
        console.warn('Listener Firebase Federações:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Listener em tempo real da coleção 'parceiros' do Firebase
  useEffect(() => {
    const unsubscribe = subscribeToPartners(
      (items) => {
        setParceiros(items || []);
      },
      (error) => {
        console.warn('Listener Firebase Parceiros:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Listener em tempo real da coleção 'modalidades' do Firebase
  useEffect(() => {
    const unsubscribe = subscribeToModalities(
      (items) => {
        setModalidades(items || []);
      },
      (error) => {
        console.warn('Listener Firebase Modalidades:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Listener em tempo real da coleção 'lutas_agendadas' do Firebase
  useEffect(() => {
    const unsubscribe = subscribeToScheduledFights(
      (items) => {
        setLutas(items || []);
      },
      (error) => {
        console.warn('Listener Firebase Lutas Agendadas:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // ================= HANDLERS: DEPOIMENTOS =================
  const handleOpenNewTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialForm({
      nome: '',
      cargo_modalidade: '',
      destaque: '',
      depoimento: '',
      avaliacao: 5,
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      ativo: true,
    });
    setIsTestimonialModalOpen(true);
  };

  const handleEditTestimonial = (item: DepoimentoAluno) => {
    setEditingTestimonial(item);
    setTestimonialForm({ ...item });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.nome || !testimonialForm.depoimento || !testimonialForm.destaque) {
      alert('Por favor, preencha o Nome do Aluno, a Frase de Destaque e o Depoimento.');
      return;
    }

    const itemToSave: DepoimentoAluno = {
      id: editingTestimonial ? editingTestimonial.id : `depoimento-${Date.now()}`,
      nome: testimonialForm.nome.trim(),
      cargo_modalidade: (testimonialForm.cargo_modalidade || 'Aluno BBT').trim(),
      destaque: testimonialForm.destaque.trim(),
      depoimento: testimonialForm.depoimento.trim(),
      avaliacao: Number(testimonialForm.avaliacao) || 5,
      foto: testimonialForm.foto?.trim() || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      ativo: true,
      ordem: editingTestimonial?.ordem || depoimentos.length + 1,
    };

    try {
      await saveTestimonialToFirestore(itemToSave);
      setTestimonialToast(editingTestimonial ? 'Depoimento atualizado com sucesso no Firebase!' : 'Novo depoimento gravado no Firebase!');
      setTimeout(() => setTestimonialToast(null), 4000);
      setIsTestimonialModalOpen(false);
    } catch (err: any) {
      alert('Erro ao salvar depoimento no Firestore: ' + (err.message || err));
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este depoimento da página inicial?')) {
      try {
        await deleteTestimonialFromFirestore(id);
        setTestimonialToast('Depoimento removido com sucesso!');
        setTimeout(() => setTestimonialToast(null), 4000);
      } catch (err: any) {
        alert('Erro ao excluir depoimento: ' + (err.message || err));
      }
    }
  };

  // ================= HANDLERS: FEDERAÇÕES =================
  const handleOpenNewFederation = () => {
    setEditingFederation(null);
    setFederationForm({
      nome: '',
      nome_completo: '',
      logo: '/FMTSP-oficial.png',
      descricao: '',
      link: '#',
      cor_tema: 'vermelho',
      ativo: true,
    });
    setIsFederationModalOpen(true);
  };

  const handleEditFederation = (item: FederacaoEntidade) => {
    setEditingFederation(item);
    setFederationForm({ ...item });
    setIsFederationModalOpen(true);
  };

  const handleSaveFederation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!federationForm.nome || !federationForm.nome_completo || !federationForm.descricao) {
      alert('Por favor, preencha a Sigla, Nome Completo e a Descrição da Federação.');
      return;
    }

    const itemToSave: FederacaoEntidade = {
      id: editingFederation ? editingFederation.id : `fed-${Date.now()}`,
      nome: federationForm.nome.trim(),
      nome_completo: federationForm.nome_completo.trim(),
      logo: federationForm.logo?.trim() || '/FMTSP-oficial.png',
      descricao: federationForm.descricao.trim(),
      link: federationForm.link?.trim() || '#',
      cor_tema: federationForm.cor_tema || 'vermelho',
      ativo: true,
      ordem: editingFederation?.ordem || federacoes.length + 1,
    };

    try {
      await saveFederationToFirestore(itemToSave);
      setFederationToast(editingFederation ? 'Federação atualizada no Firebase!' : 'Nova Federação gravada no Firebase!');
      setTimeout(() => setFederationToast(null), 4000);
      setIsFederationModalOpen(false);
    } catch (err: any) {
      alert('Erro ao salvar federação: ' + (err.message || err));
    }
  };

  const handleDeleteFederation = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta federação do site?')) {
      try {
        await deleteFederationFromFirestore(id);
        setFederationToast('Federação removida com sucesso!');
        setTimeout(() => setFederationToast(null), 4000);
      } catch (err: any) {
        alert('Erro ao excluir federação: ' + (err.message || err));
      }
    }
  };

  // ================= HANDLERS: PARCEIROS =================
  const handleOpenNewPartner = () => {
    setEditingPartner(null);
    setPartnerForm({
      nome: '',
      nome_completo: '',
      logo: '/JS-Bucais.jpeg',
      descricao: '',
      link: '#',
      cor_tema: 'neutro',
      ativo: true,
    });
    setIsPartnerModalOpen(true);
  };

  const handleEditPartner = (item: ParceiroPatrocinador) => {
    setEditingPartner(item);
    setPartnerForm({ ...item });
    setIsPartnerModalOpen(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.nome || !partnerForm.nome_completo || !partnerForm.descricao) {
      alert('Por favor, preencha o Nome, Razão e Descrição do Parceiro.');
      return;
    }

    const itemToSave: ParceiroPatrocinador = {
      id: editingPartner ? editingPartner.id : `parceiro-${Date.now()}`,
      nome: partnerForm.nome.trim(),
      nome_completo: partnerForm.nome_completo.trim(),
      logo: partnerForm.logo?.trim() || '/JS-Bucais.jpeg',
      descricao: partnerForm.descricao.trim(),
      link: partnerForm.link?.trim() || '#',
      cor_tema: partnerForm.cor_tema || 'neutro',
      ativo: true,
      ordem: editingPartner?.ordem || parceiros.length + 1,
    };

    try {
      await savePartnerToFirestore(itemToSave);
      setPartnerToast(editingPartner ? 'Parceiro atualizado no Firebase!' : 'Novo Parceiro gravado no Firebase!');
      setTimeout(() => setPartnerToast(null), 4000);
      setIsPartnerModalOpen(false);
    } catch (err: any) {
      alert('Erro ao salvar parceiro: ' + (err.message || err));
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este parceiro do site?')) {
      try {
        await deletePartnerFromFirestore(id);
        setPartnerToast('Parceiro removido com sucesso!');
        setTimeout(() => setPartnerToast(null), 4000);
      } catch (err: any) {
        alert('Erro ao excluir parceiro: ' + (err.message || err));
      }
    }
  };

  // ================= HANDLERS: MODALIDADES =================
  const handleOpenNewModality = () => {
    setEditingModality(null);
    setModalityForm({
      titulo: '',
      subtitulo: '',
      categoria: 'Striking',
      descricao: '',
      resumo_horarios: 'Segunda a Sexta · Turmas manhã, tarde e noite',
      intensidade: 'Alta',
      treinador: 'Prof. Treinador BBT',
      imagem: 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80',
      beneficiosStr: 'Coordenação motora e reflexos rápidos\nQueima calórica intensa (~800 kcal/aula)\nFortalecimento de ombros, abdômen e pernas\nAutoconfiança e alívio do estresse',
      equipamentosStr: 'Bandagens elásticas 4m\nLuvas de treino\nProtetor bucal',
      ativo: true,
    });
    setIsModalityModalOpen(true);
  };

  const handleEditModality = (item: ModalidadeTreino) => {
    setEditingModality(item);
    setModalityForm({
      titulo: item.titulo,
      subtitulo: item.subtitulo || '',
      categoria: item.categoria || 'Striking',
      descricao: item.descricao || '',
      resumo_horarios: item.resumo_horarios || '',
      intensidade: item.intensidade || 'Alta',
      treinador: item.treinador || '',
      imagem: item.imagem || 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80',
      beneficiosStr: (item.beneficios || []).join('\n'),
      equipamentosStr: (item.equipamentos_necessarios || []).join('\n'),
      ativo: item.ativo !== false,
    });
    setIsModalityModalOpen(true);
  };

  const handleSaveModality = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalityForm.titulo || !modalityForm.descricao) {
      alert('Por favor, preencha o Nome da Modalidade e a Descrição.');
      return;
    }

    const beneficiosArray = modalityForm.beneficiosStr
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const equipamentosArray = modalityForm.equipamentosStr
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const slugId = editingModality
      ? editingModality.id
      : modalityForm.titulo
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || `mod-${Date.now()}`;

    const itemToSave: ModalidadeTreino = {
      id: slugId,
      titulo: modalityForm.titulo.trim(),
      subtitulo: modalityForm.subtitulo.trim(),
      categoria: modalityForm.categoria.trim(),
      descricao: modalityForm.descricao.trim(),
      resumo_horarios: modalityForm.resumo_horarios.trim(),
      intensidade: (modalityForm.intensidade.trim() as 'Moderada' | 'Alta' | 'Extrema') || 'Alta',
      treinador: modalityForm.treinador.trim(),
      imagem: modalityForm.imagem.trim(),
      beneficios: beneficiosArray,
      equipamentos_necessarios: equipamentosArray,
      ativo: modalityForm.ativo,
      ordem: editingModality?.ordem || modalidades.length + 1,
    };

    try {
      await saveModalityToFirestore(itemToSave);
      setModalityToast(
        editingModality
          ? 'Modalidade atualizada com sucesso no Firebase!'
          : 'Nova modalidade gravada no Firebase com sucesso!'
      );
      setTimeout(() => setModalityToast(null), 4000);
      setIsModalityModalOpen(false);
    } catch (err: any) {
      alert('Erro ao salvar modalidade no Firestore: ' + (err.message || err));
    }
  };

  const handleDeleteModality = async (id: string, titulo: string) => {
    if (
      confirm(
        `Tem certeza que deseja excluir a modalidade "${titulo}" do Cloud Firestore?\nEla deixará de aparecer no site e nas opções de horários.`
      )
    ) {
      try {
        await deleteModalityFromFirestore(id);
        setModalityToast(`Modalidade "${titulo}" removida do Firebase!`);
        setTimeout(() => setModalityToast(null), 4000);
      } catch (err: any) {
        alert('Erro ao remover modalidade: ' + (err.message || err));
      }
    }
  };

  // ================= HANDLERS: LUTAS AGENDADAS =================
  const handleOpenNewFight = () => {
    setEditingFight(null);
    setFightForm({
      evento: '',
      organizacao: 'Jungle Fight Championship',
      data: new Date().toISOString().split('T')[0],
      horario: '20:30',
      local: 'Ginásio do Ibirapuera',
      cidade: 'São Paulo, SP',
      pais: 'Brasil',
      nome_lutador: 'Gabriel',
      apelido_lutador: 'Gaah',
      cartel_lutador: '11-1-0 (5 KOs)',
      foto_lutador: '/gabriel_lutador.png',
      nome_oponente: '',
      apelido_oponente: '',
      cartel_oponente: '',
      equipe_oponente: '',
      foto_oponente: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=800&q=80',
      categoria_peso: 'Peso Leve (70.3 kg)',
      rounds: 3,
      luta_principal: false,
      disputa_titulo: false,
      nome_titulo: '',
      transmissao: 'UFC Fight Pass e Band',
      link_ingressos: '#',
      status: 'Card Principal',
      observacoes: '',
      ativo: true,
    });
    setIsFightModalOpen(true);
  };

  const handleEditFight = (item: LutaAgendada) => {
    setEditingFight(item);
    setFightForm({ ...item });
    setIsFightModalOpen(true);
  };

  const handleSaveFight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fightForm.evento || !fightForm.nome_lutador || !fightForm.nome_oponente || !fightForm.data) {
      alert('Por favor, preencha o Nome do Evento, Atleta BBT, Desafiante e Data.');
      return;
    }

    const dateTimeStr = `${fightForm.data}T${fightForm.horario || '20:00'}:00-03:00`;
    const timestampCalc = new Date(dateTimeStr).getTime() || Date.now();

    const slugId = editingFight
      ? editingFight.id
      : `fight-${fightForm.evento
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 30)}-${Date.now().toString().slice(-4)}`;

    const itemToSave: LutaAgendada = {
      id: slugId,
      evento: fightForm.evento.trim(),
      organizacao: (fightForm.organizacao || 'Liga Oficial').trim(),
      data: fightForm.data.trim(),
      horario: (fightForm.horario || '20:00').trim(),
      timestamp_contagem: timestampCalc,
      local: (fightForm.local || 'Arena Oficial').trim(),
      cidade: (fightForm.cidade || 'São Paulo, SP').trim(),
      pais: (fightForm.pais || 'Brasil').trim(),
      id_lutador: editingFight?.id_lutador || `fighter-${Date.now()}`,
      nome_lutador: fightForm.nome_lutador.trim(),
      apelido_lutador: (fightForm.apelido_lutador || '').trim(),
      foto_lutador: fightForm.foto_lutador?.trim() || '/gabriel_lutador.png',
      cartel_lutador: (fightForm.cartel_lutador || '0-0-0').trim(),
      nome_oponente: fightForm.nome_oponente.trim(),
      apelido_oponente: (fightForm.apelido_oponente || '').trim(),
      foto_oponente: fightForm.foto_oponente?.trim() || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      cartel_oponente: (fightForm.cartel_oponente || '0-0-0').trim(),
      equipe_oponente: (fightForm.equipe_oponente || 'Equipe Adversária').trim(),
      categoria_peso: (fightForm.categoria_peso || 'Peso Casado').trim(),
      rounds: Number(fightForm.rounds) || 3,
      luta_principal: Boolean(fightForm.luta_principal),
      disputa_titulo: Boolean(fightForm.disputa_titulo),
      nome_titulo: fightForm.nome_titulo?.trim() || '',
      transmissao: (fightForm.transmissao || 'Transmissão Ao Vivo').trim(),
      link_ingressos: fightForm.link_ingressos?.trim() || '#',
      status: (fightForm.status as any) || 'Card Principal',
      observacoes: (fightForm.observacoes || '').trim(),
      ativo: fightForm.ativo !== false,
      ordem: editingFight?.ordem || lutas.length + 1,
    };

    try {
      await saveScheduledFightToFirestore(itemToSave);
      setFightToast(editingFight ? 'Combate atualizado com sucesso no Firebase!' : 'Novo combate agendado gravado no Firebase!');
      setTimeout(() => setFightToast(null), 4000);
      setIsFightModalOpen(false);
    } catch (err: any) {
      alert('Erro ao salvar combate no Firestore: ' + (err.message || err));
    }
  };

  const handleDeleteFight = async (id: string, evento: string) => {
    if (confirm(`Tem certeza que deseja excluir o combate do evento "${evento}" do Cloud Firestore?`)) {
      try {
        await deleteScheduledFightFromFirestore(id);
        setFightToast(`Combate do "${evento}" removido com sucesso!`);
        setTimeout(() => setFightToast(null), 4000);
      } catch (err: any) {
        alert('Erro ao excluir combate: ' + (err.message || err));
      }
    }
  };

  // ================= HANDLERS: HORÁRIOS =================
  const handleOpenNewSchedule = () => {
    setEditingSchedule(null);
    setIsCustomTime(false);
    const initialDay = scheduleDayFilter !== 'Todas'
      ? (scheduleDayFilter === 'Sábado' ? 'Sábado' : `${scheduleDayFilter}-feira`)
      : 'Segunda-feira';
    setScheduleForm({
      dia_semana: initialDay as any,
      horario: '07:00 - 08:30',
      modalidade: 'Boxe Olímpico & Condicionamento',
      nivel: 'Todos os Níveis',
      treinador: 'Prof. Marcos Valente',
      sala: 'Ringue Principal',
    });
    setIsScheduleModalOpen(true);
  };

  const handleEditSchedule = (item: GradeHorarioTreino) => {
    setEditingSchedule(item);
    const isStandard = TIMES_OPTIONS.includes(item.horario);
    setIsCustomTime(!isStandard);
    const displayDay = item.dia_semana.includes('-feira')
      ? item.dia_semana
      : (item.dia_semana === 'Sábado' ? 'Sábado' : `${item.dia_semana}-feira`);
    setScheduleForm({
      ...item,
      dia_semana: displayDay as any,
    });
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.horario || !scheduleForm.modalidade || !scheduleForm.dia_semana) {
      alert('Por favor, preencha todos os campos obrigatórios do formulário.');
      return;
    }

    const rawDay = String(scheduleForm.dia_semana || 'Segunda');
    const cleanDay: GradeHorarioTreino['dia_semana'] = rawDay.startsWith('Segunda')
      ? 'Segunda'
      : rawDay.startsWith('Terça')
      ? 'Terça'
      : rawDay.startsWith('Quarta')
      ? 'Quarta'
      : rawDay.startsWith('Quinta')
      ? 'Quinta'
      : rawDay.startsWith('Sexta')
      ? 'Sexta'
      : 'Sábado';

    const rawLevel = String(scheduleForm.nivel || 'Todos os Níveis');
    const cleanLevel: GradeHorarioTreino['nivel'] = rawLevel.includes('Iniciante (Nunca treinei)')
      ? 'Iniciante'
      : rawLevel.includes('Básico')
      ? 'Iniciante / Intermediário'
      : rawLevel.includes('Intermediário')
      ? 'Intermediário'
      : rawLevel.includes('Avançado')
      ? 'Avançado / Competição'
      : 'Todos os Níveis';

    const itemToSave: GradeHorarioTreino = {
      id: editingSchedule ? editingSchedule.id : `horario-${Date.now()}`,
      dia_semana: cleanDay,
      horario: scheduleForm.horario.trim(),
      modalidade: scheduleForm.modalidade.trim(),
      nivel: cleanLevel,
      treinador: (scheduleForm.treinador || 'Prof. Marcos Valente').trim(),
      sala: (scheduleForm.sala || 'Tatame Principal').trim(),
    };

    try {
      await saveScheduleToFirestore(itemToSave);
      setScheduleToast(editingSchedule ? 'Horário atualizado com sucesso no Firebase!' : 'Novo horário cadastrado com sucesso no Firebase!');
      setTimeout(() => setScheduleToast(null), 4000);
      setIsScheduleModalOpen(false);
    } catch (err: any) {
      const msg = err.message || String(err);
      if (err.code === 'permission-denied' || msg.includes('permission-denied') || msg.includes('PERMISSION_DENIED')) {
        setFirestoreError('Permissão negada: No Firebase Console (Aba Regras), publique: allow read, write: if true;');
        alert('Permissão negada no Firestore! Acesse o Firebase Console > Cloud Firestore > Regras e altere para: allow read, write: if true;');
      } else {
        alert('Erro ao salvar no Firestore: ' + msg);
      }
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este horário da grade oficial?')) {
      try {
        await deleteScheduleFromFirestore(id);
        setScheduleToast('Horário removido com sucesso!');
        setTimeout(() => setScheduleToast(null), 4000);
      } catch (err: any) {
        const msg = err.message || String(err);
        if (err.code === 'permission-denied' || msg.includes('permission-denied') || msg.includes('PERMISSION_DENIED')) {
          setFirestoreError('Permissão negada: No Firebase Console (Aba Regras), publique: allow read, write: if true;');
          alert('Permissão negada no Firestore! Acesse o Firebase Console > Cloud Firestore > Regras e altere para: allow read, write: if true;');
        } else {
          alert('Erro ao excluir: ' + msg);
        }
      }
    }
  };

  // Filtros
  const filteredHorarios = horarios.filter((h) => {
    const matchesDay = scheduleDayFilter === 'Todas' || h.dia_semana === scheduleDayFilter;
    const matchesModality = scheduleProgramFilter === 'Todas' || h.modalidade.toLowerCase().includes(scheduleProgramFilter.toLowerCase());
    const matchesSearch =
      h.modalidade.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
      h.treinador.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
      h.sala.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
      h.horario.toLowerCase().includes(scheduleSearch.toLowerCase());
    return matchesDay && matchesModality && matchesSearch;
  });

  const filteredDepoimentos = depoimentos.filter((d) => {
    const s = testimonialSearch.toLowerCase();
    return (
      d.nome.toLowerCase().includes(s) ||
      d.cargo_modalidade.toLowerCase().includes(s) ||
      d.destaque.toLowerCase().includes(s) ||
      d.depoimento.toLowerCase().includes(s)
    );
  });

  const filteredFederacoes = federacoes.filter((f) => {
    const s = federationSearch.toLowerCase();
    return (
      f.nome.toLowerCase().includes(s) ||
      f.nome_completo.toLowerCase().includes(s) ||
      f.descricao.toLowerCase().includes(s)
    );
  });

  const filteredParceiros = parceiros.filter((p) => {
    const s = partnerSearch.toLowerCase();
    return (
      p.nome.toLowerCase().includes(s) ||
      p.nome_completo.toLowerCase().includes(s) ||
      p.descricao.toLowerCase().includes(s)
    );
  });

  const filteredModalidades = modalidades.filter((m) => {
    const s = modalitySearch.toLowerCase();
    return (
      m.titulo.toLowerCase().includes(s) ||
      m.categoria.toLowerCase().includes(s) ||
      (m.descricao && m.descricao.toLowerCase().includes(s)) ||
      (m.treinador && m.treinador.toLowerCase().includes(s))
    );
  });

  const filteredLutas = lutas.filter((f) => {
    const s = fightSearch.toLowerCase();
    const matchesSearch =
      f.evento.toLowerCase().includes(s) ||
      f.nome_lutador.toLowerCase().includes(s) ||
      f.nome_oponente.toLowerCase().includes(s) ||
      f.organizacao.toLowerCase().includes(s) ||
      f.cidade.toLowerCase().includes(s) ||
      f.categoria_peso.toLowerCase().includes(s);

    const matchesStatus =
      fightStatusFilter === 'Todas' || f.status === fightStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col lg:flex-row font-sans selection:bg-red-600 selection:text-white">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-full lg:w-64 bg-[#0c0c11] border-r border-neutral-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Organization Switcher */}
          <div className="p-4 border-b border-neutral-800/80">
            <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-md shadow-red-600/20">
                  <Flame className="w-4 h-4 fill-white text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white tracking-wide leading-tight">BBT ACADEMY</div>
                  <div className="text-[10px] text-neutral-400 font-medium">Sede Principal SP</div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </div>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-4">
            <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 px-3 mb-2">
              Plataforma
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-red-500" />
                <span>Painel Geral</span>
              </button>

              <button
                onClick={() => setActiveTab('schedules')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'schedules'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <CalendarDays className="w-4 h-4 text-red-500" />
                <span>Grade de Horários</span>
                <span className="ml-auto text-[10px] bg-red-600/30 text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-500/20">
                  {horarios.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'testimonials'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <Quote className="w-4 h-4 text-red-500" />
                <span>Depoimentos</span>
                <span className="ml-auto text-[10px] bg-red-600/30 text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-500/20">
                  {depoimentos.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('federations')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'federations'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <Trophy className="w-4 h-4 text-red-500" />
                <span>Federações</span>
                <span className="ml-auto text-[10px] bg-red-600/30 text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-500/20">
                  {federacoes.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('partners')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'partners'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <Handshake className="w-4 h-4 text-red-500" />
                <span>Parceiros</span>
                <span className="ml-auto text-[10px] bg-red-600/30 text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-500/20">
                  {parceiros.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('modalities')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'modalities'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-red-500" />
                <span>Modalidades</span>
                <span className="ml-auto text-[10px] bg-red-600/30 text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-500/20">
                  {modalidades.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('fights')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'fights'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <Swords className="w-4 h-4 text-red-500" />
                <span>Lutas Agendadas</span>
                <span className="ml-auto text-[10px] bg-red-600/30 text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-500/20">
                  {lutas.length}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Sidebar Bottom: Status Firebase e Perfil */}
        <div className="p-3 border-t border-neutral-800/80 space-y-3">
          {/* Card de Conexão com Firebase Firestore com todas as 6 coleções */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-900/60 border border-neutral-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-white font-semibold">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cloud Firestore</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-neutral-400 space-y-0.5">
              <div>Coleções ativas:</div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pl-1 font-mono text-[10px] text-emerald-400 font-bold">
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  <span>grade_horarios</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  <span>depoimentos</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  <span>federacoes</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  <span>parceiros</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  <span>modalidades</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  <span>lutas_agendadas</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              Projeto: bbt-academia
            </div>
          </div>

          {/* User profile row */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-xs shrink-0">
                A
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.displayName || 'Administrador BBT'}
                </div>
                <div className="text-[10px] text-neutral-500 truncate">
                  {user?.email || 'admin@bbt.com.br'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Encerrar Sessão"
              className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Voltar ao site público */}
          <button
            onClick={onBackToSite}
            className="w-full py-2 px-3 text-center text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Voltar ao Site Público</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="p-6 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeTab === 'dashboard'
                ? 'Painel Geral BBT'
                : activeTab === 'schedules'
                ? 'Gestão da Grade de Horários'
                : activeTab === 'testimonials'
                ? 'Gestão de Depoimentos'
                : activeTab === 'federations'
                ? 'Gestão de Federações & Confederações'
                : activeTab === 'partners'
                ? 'Gestão de Parceiros & Patrocinadores'
                : activeTab === 'modalities'
                ? 'Gestão de Modalidades de Treino'
                : 'Gestão de Lutas Agendadas'}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              {activeTab === 'dashboard'
                ? 'Visão estratégica e indicadores de frequência e turmas.'
                : activeTab === 'schedules'
                ? 'Horários sincronizados em tempo real com a coleção grade_horarios.'
                : activeTab === 'testimonials'
                ? 'Histórias reais de superação sincronizadas com a coleção depoimentos.'
                : activeTab === 'federations'
                ? 'Chancelas oficiais e entidades reguladoras sincronizadas com a coleção federacoes.'
                : activeTab === 'partners'
                ? 'Marcas e parceiros oficiais sincronizados com a coleção parceiros.'
                : activeTab === 'modalities'
                ? 'Disciplinas e programas oficiais sincronizados com a coleção modalidades.'
                : 'Combates oficiais no calendário sincronizados com a coleção lutas_agendadas.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5 text-neutral-500" />
              <span>Temporada 2026</span>
            </div>

            {activeTab === 'schedules' ? (
              <button
                onClick={handleOpenNewSchedule}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Horário</span>
              </button>
            ) : activeTab === 'testimonials' ? (
              <button
                onClick={handleOpenNewTestimonial}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Depoimento</span>
              </button>
            ) : activeTab === 'federations' ? (
              <button
                onClick={handleOpenNewFederation}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Federação</span>
              </button>
            ) : activeTab === 'partners' ? (
              <button
                onClick={handleOpenNewPartner}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Parceiro</span>
              </button>
            ) : activeTab === 'modalities' ? (
              <button
                onClick={handleOpenNewModality}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Modalidade</span>
              </button>
            ) : activeTab === 'fights' ? (
              <button
                onClick={handleOpenNewFight}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Combate</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('schedules')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Gerenciar Horários</span>
              </button>
            )}
          </div>
        </header>

        {/* Notificações e Alertas */}
        {firestoreError && (
          <div className="m-6 mb-0 p-4 bg-amber-950/60 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Aviso do Cloud Firestore</div>
              <p className="mt-0.5 text-amber-200/90 leading-relaxed">{firestoreError}</p>
            </div>
          </div>
        )}

        {scheduleToast && (
          <div className="m-6 mb-0 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-3 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{scheduleToast}</span>
          </div>
        )}

        {testimonialToast && (
          <div className="m-6 mb-0 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-3 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{testimonialToast}</span>
          </div>
        )}

        {federationToast && (
          <div className="m-6 mb-0 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-3 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{federationToast}</span>
          </div>
        )}

        {partnerToast && (
          <div className="m-6 mb-0 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-3 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{partnerToast}</span>
          </div>
        )}

        {modalityToast && (
          <div className="m-6 mb-0 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-3 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{modalityToast}</span>
          </div>
        )}

        {fightToast && (
          <div className="m-6 mb-0 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-3 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{fightToast}</span>
          </div>
        )}

        {/* ================= ABA 1: PAINEL GERAL ================= */}
        {activeTab === 'dashboard' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <div className="text-xs text-neutral-400 font-medium mb-1">Grade Semanal</div>
                <div className="text-2xl font-bold text-white mb-2">{horarios.length} Aulas</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Segunda a Sábado</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <div className="text-xs text-neutral-400 font-medium mb-1">Depoimentos</div>
                <div className="text-2xl font-bold text-white mb-2">{depoimentos.length} Histórias</div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>5.0 Avaliação Média</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <div className="text-xs text-neutral-400 font-medium mb-1">Federações & Parceiros</div>
                <div className="text-2xl font-bold text-white mb-2">{federacoes.length + parceiros.length} Entidades</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Chancelas Oficiais</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <div className="text-xs text-neutral-400 font-medium mb-1">Eficiência Geral</div>
                <div className="text-2xl font-bold text-white mb-2">94%</div>
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Capacidade máxima nos picos</span>
                </div>
              </div>
            </div>

            {/* Central Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-3xl font-bold text-white">{horarios.length} Turmas Oficiais</div>
                    <div className="text-xs text-neutral-400 mt-1">Frequência e ocupação das salas de treino</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('schedules')}
                    className="flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-950/40 border border-red-800/60 px-3 py-1.5 rounded-lg hover:bg-red-900/60 transition-colors cursor-pointer"
                  >
                    <span>Editar Horários</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative h-48 w-full flex items-end justify-between gap-2 pt-6">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-b border-white" />
                  </div>

                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,80 Q 80,70 150,55 T 300,45 T 420,25 T 500,20 L 500,120 L 0,120 Z"
                      fill="url(#gradientLine)"
                    />
                    <path
                      d="M 0,80 Q 80,70 150,55 T 300,45 T 420,25 T 500,20"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                    />
                    <circle cx="420" cy="25" r="5" fill="#ffffff" stroke="#ef4444" strokeWidth="3" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-4 border-t border-neutral-800/80 mt-4">
                  <span>Segunda</span>
                  <span>Terça</span>
                  <span>Quarta</span>
                  <span>Quinta</span>
                  <span>Sexta</span>
                  <span className="px-2 py-0.5 rounded-md bg-white text-neutral-950 font-bold">Sábado</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                    Atalhos Rápidos
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('schedules')}
                      className="w-full py-2.5 px-3 bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-red-500" />
                        Grade de Horários
                      </span>
                      <span className="text-[10px] bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">{horarios.length}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('testimonials')}
                      className="w-full py-2.5 px-3 bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Quote className="w-4 h-4 text-red-500" />
                        Depoimentos de Alunos
                      </span>
                      <span className="text-[10px] bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">{depoimentos.length}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('federations')}
                      className="w-full py-2.5 px-3 bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-red-500" />
                        Federações e Confederações
                      </span>
                      <span className="text-[10px] bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">{federacoes.length}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('partners')}
                      className="w-full py-2.5 px-3 bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-red-500" />
                        Parceiros e Patrocinadores
                      </span>
                      <span className="text-[10px] bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">{parceiros.length}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('modalities')}
                      className="w-full py-2.5 px-3 bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-red-500" />
                        Modalidades de Treino
                      </span>
                      <span className="text-[10px] bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">{modalidades.length}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('fights')}
                      className="w-full py-2.5 px-3 bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Swords className="w-4 h-4 text-red-500" />
                        Lutas Agendadas
                      </span>
                      <span className="text-[10px] bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">{lutas.length}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500">
                  Base Firestore sincronizada em tempo real com o site principal.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 2: GRADE DE HORÁRIOS ================= */}
        {activeTab === 'schedules' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Horários na Grade</div>
                  <div className="text-xl font-bold text-white mt-0.5">{horarios.length} aulas</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Dias Ativos</div>
                  <div className="text-xl font-bold text-white mt-0.5">Seg - Sáb</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <CalendarDays className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Coleção Firebase</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-1">grade_horarios</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Sincronização</div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Tempo Real (Live)
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 space-y-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {['Todas', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => {
                  const count = day === 'Todas' ? horarios.length : horarios.filter((h) => h.dia_semana === day).length;
                  const isActive = scheduleDayFilter === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setScheduleDayFilter(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                      }`}
                    >
                      <span>{day}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-black/30 text-white' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2 border-t border-neutral-800/60">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar modalidade, treinador, sala..."
                    value={scheduleSearch}
                    onChange={(e) => setScheduleSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <select
                    value={scheduleProgramFilter}
                    onChange={(e) => setScheduleProgramFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="Todas">Todas as Modalidades</option>
                    {modalidades.length > 0 ? (
                      modalidades.map((m) => (
                        <option key={m.id} value={m.titulo}>
                          {m.titulo}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Boxe">Boxe</option>
                        <option value="Muay Thai">Muay Thai</option>
                        <option value="Jiu-Jitsu">Jiu-Jitsu</option>
                        <option value="MMA">MMA</option>
                        <option value="Wrestling">Wrestling</option>
                        <option value="Preparação">Preparação Física</option>
                      </>
                    )}
                  </select>

                  <button
                    onClick={handleOpenNewSchedule}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Schedules Grid */}
            {filteredHorarios.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">Nenhum horário encontrado</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                  Não foram encontradas aulas com os filtros selecionados ou ainda não há horários salvos nesta categoria.
                </p>
                <button
                  onClick={handleOpenNewSchedule}
                  className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Criar Novo Horário
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHorarios.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                          {item.dia_semana}
                        </span>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                          {item.nivel}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors mb-2">
                        {item.modalidade}
                      </h4>

                      <div className="space-y-1.5 text-xs text-neutral-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span className="text-white font-medium">{item.horario}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span>{item.treinador}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span>{item.sala}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[120px]">
                        ID: {item.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditSchedule(item)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Editar Horário"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Horário"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 3: DEPOIMENTOS ================= */}
        {activeTab === 'testimonials' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Histórias Cadastradas</div>
                  <div className="text-xl font-bold text-white mt-0.5">{depoimentos.length} depoimentos</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Quote className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Avaliação Média</div>
                  <div className="text-xl font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                    <span>5.0</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
                  <Star className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Coleção Firebase</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-1">depoimentos</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Sincronização</div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Tempo Real (Live)
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por aluno, modalidade ou frase..."
                  value={testimonialSearch}
                  onChange={(e) => setTestimonialSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <button
                onClick={handleOpenNewTestimonial}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Depoimento</span>
              </button>
            </div>

            {filteredDepoimentos.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">Nenhum depoimento encontrado</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                  Não foram encontrados depoimentos com o termo de busca ou ainda não há depoimentos cadastrados.
                </p>
                <button
                  onClick={handleOpenNewTestimonial}
                  className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cadastrar Novo Depoimento
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepoimentos.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#121217] rounded-2xl border border-neutral-800 hover:border-neutral-700 p-6 flex flex-col justify-between space-y-5 transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Quote className="w-7 h-7 text-red-600/40" />
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(item.avaliacao || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <div className="text-[11px] font-bold uppercase text-red-400 tracking-wider">
                        "{item.destaque}"
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                        "{item.depoimento}"
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-neutral-800/80">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.foto}
                          alt={item.nome}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
                          }}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-red-600/30"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white font-heading uppercase truncate">
                            {item.nome}
                          </h4>
                          <p className="text-[11px] text-neutral-400 leading-tight truncate">
                            {item.cargo_modalidade}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/40 text-xs">
                        <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[120px]">
                          ID: {item.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditTestimonial(item)}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                            title="Editar Depoimento"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(item.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                            title="Excluir Depoimento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 4: FEDERAÇÕES ================= */}
        {activeTab === 'federations' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Chancelas Oficiais</div>
                  <div className="text-xl font-bold text-white mt-0.5">{federacoes.length} entidades</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Reconhecimento</div>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">Estadual & Mundial</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Coleção Firebase</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-1">federacoes</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Sincronização</div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Tempo Real (Live)
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por sigla ou nome da entidade..."
                  value={federationSearch}
                  onChange={(e) => setFederationSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <button
                onClick={handleOpenNewFederation}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Federação</span>
              </button>
            </div>

            {filteredFederacoes.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">Nenhuma federação encontrada</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                  Não foram encontradas federações ou ainda não há cadastros nesta coleção.
                </p>
                <button
                  onClick={handleOpenNewFederation}
                  className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cadastrar Nova Federação
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFederacoes.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#121217] rounded-2xl border border-neutral-800 hover:border-neutral-700 p-6 flex flex-col justify-between space-y-5 transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-neutral-900/80 border border-neutral-800 p-2 flex items-center justify-center">
                          <img
                            src={item.logo}
                            alt={item.nome}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.nome}&background=101015&color=fff&size=200&bold=true`;
                            }}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                          {item.cor_tema || 'Padrão'}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-white font-heading uppercase group-hover:text-red-400 transition-colors">
                          {item.nome}
                        </h4>
                        <div className="text-xs text-neutral-400 font-medium">
                          {item.nome_completo}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                        {item.descricao}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[120px]">
                        ID: {item.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditFederation(item)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Editar Federação"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFederation(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Federação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 5: PARCEIROS ================= */}
        {activeTab === 'partners' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Parceiros Oficiais</div>
                  <div className="text-xl font-bold text-white mt-0.5">{parceiros.length} marcas</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Handshake className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Fornecedores</div>
                  <div className="text-xl font-bold text-white mt-0.5">Equipamentos & Saúde</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Coleção Firebase</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-1">parceiros</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Sincronização</div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Tempo Real (Live)
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por marca ou razão social..."
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <button
                onClick={handleOpenNewPartner}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Parceiro</span>
              </button>
            </div>

            {filteredParceiros.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">Nenhum parceiro encontrado</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                  Não foram encontrados parceiros ou ainda não há cadastros nesta coleção.
                </p>
                <button
                  onClick={handleOpenNewPartner}
                  className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cadastrar Novo Parceiro
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredParceiros.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#121217] rounded-2xl border border-neutral-800 hover:border-neutral-700 p-6 flex flex-col justify-between space-y-5 transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-neutral-900/80 border border-neutral-800 p-2 flex items-center justify-center">
                          <img
                            src={item.logo}
                            alt={item.nome}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.nome}&background=101015&color=fff&size=200&bold=true`;
                            }}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                          Parceiro Oficial
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-white font-heading uppercase group-hover:text-red-400 transition-colors">
                          {item.nome}
                        </h4>
                        <div className="text-xs text-neutral-400 font-medium">
                          {item.nome_completo}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                        {item.descricao}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[120px]">
                        ID: {item.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditPartner(item)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Editar Parceiro"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePartner(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Parceiro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 6: MODALIDADES DE TREINO ================= */}
        {activeTab === 'modalities' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Modalidades de Treino</div>
                  <div className="text-xl font-bold text-white mt-0.5">{modalidades.length} ativas</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Dumbbell className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Categorias</div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    {Array.from(new Set(modalidades.map((m) => m.categoria))).length} estilos
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <Layers className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Coleção Firebase</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-1">modalidades</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Sincronização</div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Tempo Real (Live)
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar modalidade, categoria ou treinador..."
                  value={modalitySearch}
                  onChange={(e) => setModalitySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <button
                onClick={handleOpenNewModality}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Modalidade</span>
              </button>
            </div>

            {filteredModalidades.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">Nenhuma modalidade encontrada</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                  Não foram encontradas modalidades correspondentes ou ainda não há cadastros.
                </p>
                <button
                  onClick={handleOpenNewModality}
                  className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cadastrar Nova Modalidade
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModalidades.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#121217] rounded-2xl border border-neutral-800 hover:border-neutral-700 overflow-hidden flex flex-col justify-between transition-all shadow-sm hover:shadow-xl group"
                  >
                    <div>
                      {/* Imagem com badges sobrepostas */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                        <img
                          src={item.imagem}
                          alt={item.titulo}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-black/30 pointer-events-none" />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-red-400 border border-red-500/30">
                            {item.categoria}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                            item.intensidade === 'Extrema'
                              ? 'bg-red-950/80 text-red-400 border-red-600/40'
                              : item.intensidade === 'Alta'
                              ? 'bg-amber-950/80 text-amber-400 border-amber-600/40'
                              : 'bg-emerald-950/80 text-emerald-400 border-emerald-600/40'
                          }`}>
                            {item.intensidade}
                          </span>
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h4 className="text-lg font-black text-white font-heading uppercase group-hover:text-red-400 transition-colors">
                            {item.titulo}
                          </h4>
                          {item.subtitulo && (
                            <div className="text-xs text-neutral-400 font-medium italic mt-0.5">
                              "{item.subtitulo}"
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                          {item.descricao}
                        </p>

                        <div className="pt-2 border-t border-neutral-800/60 space-y-2 text-xs">
                          {item.treinador && (
                            <div className="flex items-center gap-2 text-neutral-400">
                              <Users className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <span className="truncate">{item.treinador}</span>
                            </div>
                          )}

                          {item.resumo_horarios && (
                            <div className="flex items-center gap-2 text-neutral-400">
                              <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                              <span className="truncate">{item.resumo_horarios}</span>
                            </div>
                          )}

                          {item.beneficios && item.beneficios.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {item.beneficios.slice(0, 2).map((b, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">
                                  ✓ {b}
                                </span>
                              ))}
                              {item.beneficios.length > 2 && (
                                <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-500">
                                  +{item.beneficios.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rodapé do Card com Ações */}
                    <div className="px-6 py-4 border-t border-neutral-800/80 bg-neutral-900/30 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[130px]">
                        ID: {item.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditModality(item)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Editar Modalidade"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteModality(item.id, item.titulo)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Modalidade"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 7: LUTAS AGENDADAS ================= */}
        {activeTab === 'fights' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Combates Agendados</div>
                  <div className="text-xl font-bold text-white mt-0.5">{lutas.length} no calendário</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Swords className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Disputas de Título</div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    {lutas.filter((l) => l.disputa_titulo || l.status === 'Disputa de Título').length} cinturões
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Coleção Firebase</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-1">lutas_agendadas</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0f0f14] border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Sincronização</div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Tempo Real (Live)
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar combate por evento, atleta ou local..."
                  value={fightSearch}
                  onChange={(e) => setFightSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <select
                  value={fightStatusFilter}
                  onChange={(e) => setFightStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="Todas">Todos os Status</option>
                  <option value="Card Principal">Card Principal</option>
                  <option value="Disputa de Título">Disputa de Título</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Card Preliminar">Card Preliminar</option>
                </select>

                <button
                  onClick={handleOpenNewFight}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Combate</span>
                </button>
              </div>
            </div>

            {filteredLutas.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">Nenhum combate agendado encontrado</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                  Não foram encontradas lutas com os filtros selecionados ou a coleção está vazia.
                </p>
                <button
                  onClick={handleOpenNewFight}
                  className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cadastrar Novo Combate
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLutas.map((fight) => (
                  <div
                    key={fight.id}
                    className="bg-[#121218] border border-neutral-800 hover:border-red-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl group"
                  >
                    <div>
                      {/* Top Meta */}
                      <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-800">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-500">
                          {fight.status}
                        </span>
                        <span className="text-neutral-400 font-medium">
                          {fight.data
                            ? new Date(fight.data + 'T12:00:00').toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                              })
                            : ''}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h4 className="text-base font-bold uppercase text-white font-heading mt-3 group-hover:text-red-400 transition-colors">
                        {fight.evento}
                      </h4>
                      <p className="text-xs text-neutral-400">
                        {fight.categoria_peso} · {fight.rounds} Rounds
                      </p>

                      {/* Matchup Duel */}
                      <div className="mt-4 flex items-center justify-between gap-3 bg-[#0d0d12] p-3 rounded-xl border border-neutral-800/80">
                        {/* BBT Fighter */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-red-500/60 shrink-0 bg-neutral-900">
                            <img
                              src={fight.foto_lutador}
                              alt={fight.nome_lutador}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${fight.nome_lutador}&background=101015&color=fff&size=200&bold=true`;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="truncate">
                            <span className="text-[9px] uppercase font-bold text-red-500 block">BBT</span>
                            <span className="text-xs font-bold text-white block leading-tight truncate">{fight.nome_lutador}</span>
                            {fight.apelido_lutador && (
                              <span className="text-[10px] text-neutral-400 truncate block">"{fight.apelido_lutador}"</span>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-black text-red-500 font-heading shrink-0 px-1">VS</span>

                        {/* Opponent */}
                        <div className="flex items-center gap-2.5 text-right min-w-0">
                          <div className="truncate">
                            <span className="text-[9px] uppercase font-bold text-neutral-500 block">DESAFIANTE</span>
                            <span className="text-xs font-bold text-neutral-200 block leading-tight truncate">{fight.nome_oponente}</span>
                            <span className="text-[10px] text-neutral-400 truncate block">{fight.equipe_oponente}</span>
                          </div>
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-700 shrink-0 bg-neutral-900">
                            <img
                              src={fight.foto_oponente}
                              alt={fight.nome_oponente}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${fight.nome_oponente}&background=101015&color=fff&size=200&bold=true`;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Location & Broadcast */}
                      <div className="mt-3 space-y-1 text-xs text-neutral-400">
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="truncate">{fight.local}, {fight.cidade}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-300 truncate">
                          <Tv className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span className="truncate">{fight.transmissao}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rodapé do Card com Ações */}
                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[130px]">
                        ID: {fight.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditFight(fight)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Editar Combate"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFight(fight.id, fight.evento)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Combate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= MODAL: HORÁRIO ================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#0a0a0e] border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-8 pb-5 border-b border-neutral-800/80">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
                    {editingSchedule ? 'ATUALIZAÇÃO DE TURMA' : 'NOVA TURMA NA GRADE'}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
                  {editingSchedule ? 'Editar Horário de Treino' : 'Cadastrar Horário no Tatame'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Os dados preenchidos serão gravados diretamente na coleção <span className="font-mono text-emerald-400 font-semibold">grade_horarios</span> do Firestore.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors cursor-pointer shrink-0 ml-3"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <CustomSelect
                label="Dia da Semana*"
                placeholder="Selecione o Dia da Semana*"
                options={DAYS_OPTIONS}
                value={scheduleForm.dia_semana}
                onChange={(val: string) => setScheduleForm({ ...scheduleForm, dia_semana: val as any })}
              />

              <CustomSelect
                label="Modalidade de Treino*"
                placeholder="Selecione a Modalidade de Treino*"
                options={
                  modalidades.length > 0
                    ? modalidades.map((m) => m.titulo)
                    : MODALITIES_OPTIONS
                }
                value={scheduleForm.modalidade}
                onChange={(val: string) => setScheduleForm({ ...scheduleForm, modalidade: val })}
              />

              <CustomSelect
                label="Nível de Experiência*"
                placeholder="Nível de Experiência*"
                options={LEVELS_OPTIONS}
                value={scheduleForm.nivel}
                onChange={(val: string) => setScheduleForm({ ...scheduleForm, nivel: val as any })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                    Faixa de Horário*
                  </label>
                  <CustomSelect
                    placeholder="Selecione o Horário*"
                    options={TIMES_OPTIONS}
                    value={isCustomTime ? 'Outro horário (personalizado)' : scheduleForm.horario}
                    onChange={(val: string) => {
                      if (val === 'Outro horário (personalizado)') {
                        setIsCustomTime(true);
                        setScheduleForm({ ...scheduleForm, horario: '' });
                      } else {
                        setIsCustomTime(false);
                        setScheduleForm({ ...scheduleForm, horario: val });
                      }
                    }}
                  />
                  {isCustomTime && (
                    <input
                      type="text"
                      required
                      autoFocus
                      value={scheduleForm.horario || ''}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, horario: e.target.value })}
                      placeholder="Digite o horário (Ex: 06:15 - 07:15)*"
                      className="w-full mt-2 bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                    Sala ou Dojô*
                  </label>
                  <CustomSelect
                    placeholder="Selecione o Dojô / Tatame*"
                    options={ROOMS_OPTIONS}
                    value={scheduleForm.sala}
                    onChange={(val: string) => setScheduleForm({ ...scheduleForm, sala: val })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Treinador / Sensei Responsável*
                </label>
                <input
                  type="text"
                  required
                  value={scheduleForm.treinador || ''}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, treinador: e.target.value })}
                  placeholder="Nome do Treinador ou Mestre (Ex: Prof. Marcos Valente)*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div className="pt-6 border-t border-neutral-800/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-neutral-500 font-mono">
                  {editingSchedule ? `ID: ${editingSchedule.id}` : 'Coleção: grade_horarios'}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-4 font-semibold text-neutral-400 hover:text-white bg-transparent hover:bg-neutral-800/60 border border-neutral-800 rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 font-bold tracking-wider uppercase text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-red-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingSchedule ? 'Atualizar Horário' : 'Salvar no Firebase'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DEPOIMENTO ================= */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#0a0a0e] border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-8 pb-5 border-b border-neutral-800/80">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
                    HISTÓRIAS DE SUPERAÇÃO
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
                  {editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento de Aluno'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Os dados preenchidos abaixo serão gravados na coleção <span className="font-mono text-emerald-400 font-semibold">depoimentos</span> do Cloud Firestore.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors cursor-pointer shrink-0 ml-3"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Nome Completo do Aluno*
                </label>
                <input
                  type="text"
                  required
                  value={testimonialForm.nome || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, nome: e.target.value })}
                  placeholder="Ex: Carlos Eduardo Santos*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Modalidade / Tempo de Treino / Profissão*
                </label>
                <input
                  type="text"
                  required
                  value={testimonialForm.cargo_modalidade || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, cargo_modalidade: e.target.value })}
                  placeholder="Ex: Aluno de Boxe há 2 anos · Empresário*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Frase de Destaque (Título)*
                </label>
                <input
                  type="text"
                  required
                  value={testimonialForm.destaque || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, destaque: e.target.value })}
                  placeholder="Ex: -18KG EM 9 MESES E FOCO INABALÁVEL*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <CustomSelect
                label="Avaliação (Estrelas)*"
                placeholder="Selecione a Avaliação*"
                options={RATING_OPTIONS}
                value={
                  testimonialForm.avaliacao === 4
                    ? RATING_OPTIONS[1]
                    : testimonialForm.avaliacao === 3
                    ? RATING_OPTIONS[2]
                    : RATING_OPTIONS[0]
                }
                onChange={(val: string) => {
                  const rating = val.includes('4 Estrelas') ? 4 : val.includes('3 Estrelas') ? 3 : 5;
                  setTestimonialForm({ ...testimonialForm, avaliacao: rating });
                }}
              />

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  URL da Foto do Aluno
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonialForm.foto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                    alt="Preview"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
                    }}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-red-600/40 shrink-0"
                  />
                  <input
                    type="url"
                    value={testimonialForm.foto || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, foto: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Depoimento do Aluno (História de Superação)*
                </label>
                <textarea
                  rows={4}
                  required
                  value={testimonialForm.depoimento || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, depoimento: e.target.value })}
                  placeholder="Conte em detalhes como o treino transformou sua vida..."
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm resize-none"
                />
              </div>

              <div className="pt-6 border-t border-neutral-800/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-neutral-500 font-mono">
                  {editingTestimonial ? `ID: ${editingTestimonial.id}` : 'Coleção: depoimentos'}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsTestimonialModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-4 font-semibold text-neutral-400 hover:text-white bg-transparent hover:bg-neutral-800/60 border border-neutral-800 rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 font-bold tracking-wider uppercase text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-red-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingTestimonial ? 'Atualizar Depoimento' : 'Salvar no Firebase'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: FEDERAÇÃO ================= */}
      {isFederationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#0a0a0e] border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-8 pb-5 border-b border-neutral-800/80">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
                    CHANCELA OFICIAL
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
                  {editingFederation ? 'Editar Federação' : 'Nova Federação / Confederação'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Os dados serão gravados na coleção <span className="font-mono text-emerald-400 font-semibold">federacoes</span> do Cloud Firestore.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFederationModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors cursor-pointer shrink-0 ml-3"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFederation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Sigla da Entidade (Ex: FMT-SP, WAKO, C.B.K.B)*
                </label>
                <input
                  type="text"
                  required
                  value={federationForm.nome || ''}
                  onChange={(e) => setFederationForm({ ...federationForm, nome: e.target.value })}
                  placeholder="Ex: FMT-SP*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Nome Completo da Federação / Confederação*
                </label>
                <input
                  type="text"
                  required
                  value={federationForm.nome_completo || ''}
                  onChange={(e) => setFederationForm({ ...federationForm, nome_completo: e.target.value })}
                  placeholder="Ex: Federação de Muaythai Tradicional*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                    Caminho ou URL da Logo*
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={federationForm.logo || '/FMTSP-oficial.png'}
                        alt="Preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${federationForm.nome || 'FED'}&background=101015&color=fff&size=200&bold=true`;
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      value={federationForm.logo || ''}
                      onChange={(e) => setFederationForm({ ...federationForm, logo: e.target.value })}
                      placeholder="/FMTSP-oficial.png ou URL*"
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-3 py-3 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-xs"
                    />
                  </div>
                </div>

                <div>
                  <CustomSelect
                    label="Cor do Tema / Glow*"
                    placeholder="Selecione o Tema*"
                    options={THEME_COLOR_OPTIONS}
                    value={
                      federationForm.cor_tema === 'azul'
                        ? THEME_COLOR_OPTIONS[1]
                        : federationForm.cor_tema === 'verde'
                        ? THEME_COLOR_OPTIONS[2]
                        : federationForm.cor_tema === 'dourado'
                        ? THEME_COLOR_OPTIONS[3]
                        : federationForm.cor_tema === 'neutro'
                        ? THEME_COLOR_OPTIONS[4]
                        : THEME_COLOR_OPTIONS[0]
                    }
                    onChange={(val: string) => {
                      const color = val.includes('Azul')
                        ? 'azul'
                        : val.includes('Verde')
                        ? 'verde'
                        : val.includes('Dourado')
                        ? 'dourado'
                        : val.includes('Neutro')
                        ? 'neutro'
                        : 'vermelho';
                      setFederationForm({ ...federationForm, cor_tema: color });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Link Oficial do Site
                </label>
                <input
                  type="text"
                  value={federationForm.link || ''}
                  onChange={(e) => setFederationForm({ ...federationForm, link: e.target.value })}
                  placeholder="https://... ou #"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Descrição da Chancela & Importância para os Alunos*
                </label>
                <textarea
                  rows={4}
                  required
                  value={federationForm.descricao || ''}
                  onChange={(e) => setFederationForm({ ...federationForm, descricao: e.target.value })}
                  placeholder="Explique os benefícios que essa chancela oficial traz para as graduações e campeonatos dos alunos..."
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm resize-none"
                />
              </div>

              <div className="pt-6 border-t border-neutral-800/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-neutral-500 font-mono">
                  {editingFederation ? `ID: ${editingFederation.id}` : 'Coleção: federacoes'}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsFederationModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-4 font-semibold text-neutral-400 hover:text-white bg-transparent hover:bg-neutral-800/60 border border-neutral-800 rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 font-bold tracking-wider uppercase text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-red-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingFederation ? 'Atualizar Federação' : 'Salvar no Firebase'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PARCEIRO ================= */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#0a0a0e] border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-8 pb-5 border-b border-neutral-800/80">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
                    PARCERIA OFICIAL
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
                  {editingPartner ? 'Editar Parceiro' : 'Novo Parceiro / Patrocinador'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Os dados serão gravados na coleção <span className="font-mono text-emerald-400 font-semibold">parceiros</span> do Cloud Firestore.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors cursor-pointer shrink-0 ml-3"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Nome da Marca (Ex: JS Bucais)*
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.nome || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, nome: e.target.value })}
                  placeholder="Ex: JS Bucais*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Razão Social / Descrição Curta (Ex: JS Protetores Bucais)*
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.nome_completo || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, nome_completo: e.target.value })}
                  placeholder="Ex: JS Protetores Bucais*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                    Caminho ou URL da Logo*
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={partnerForm.logo || '/JS-Bucais.jpeg'}
                        alt="Preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${partnerForm.nome || 'PAR'}&background=101015&color=fff&size=200&bold=true`;
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      value={partnerForm.logo || ''}
                      onChange={(e) => setPartnerForm({ ...partnerForm, logo: e.target.value })}
                      placeholder="/JS-Bucais.jpeg ou URL*"
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-3 py-3 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-xs"
                    />
                  </div>
                </div>

                <div>
                  <CustomSelect
                    label="Cor do Tema / Glow*"
                    placeholder="Selecione o Tema*"
                    options={THEME_COLOR_OPTIONS}
                    value={
                      partnerForm.cor_tema === 'vermelho'
                        ? THEME_COLOR_OPTIONS[0]
                        : partnerForm.cor_tema === 'azul'
                        ? THEME_COLOR_OPTIONS[1]
                        : partnerForm.cor_tema === 'dourado'
                        ? THEME_COLOR_OPTIONS[3]
                        : THEME_COLOR_OPTIONS[4]
                    }
                    onChange={(val: string) => {
                      const color = val.includes('Vermelho')
                        ? 'vermelho'
                        : val.includes('Azul')
                        ? 'azul'
                        : val.includes('Dourado')
                        ? 'dourado'
                        : 'neutro';
                      setPartnerForm({ ...partnerForm, cor_tema: color });
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Link Oficial do Parceiro
                </label>
                <input
                  type="text"
                  value={partnerForm.link || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, link: e.target.value })}
                  placeholder="https://... ou #"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Descrição da Parceria & Benefícios aos Atletas*
                </label>
                <textarea
                  rows={4}
                  required
                  value={partnerForm.descricao || ''}
                  onChange={(e) => setPartnerForm({ ...partnerForm, descricao: e.target.value })}
                  placeholder="Apresente a marca parceira e quais equipamentos ou vantagens ela traz..."
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm resize-none"
                />
              </div>

              <div className="pt-6 border-t border-neutral-800/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-neutral-500 font-mono">
                  {editingPartner ? `ID: ${editingPartner.id}` : 'Coleção: parceiros'}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsPartnerModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-4 font-semibold text-neutral-400 hover:text-white bg-transparent hover:bg-neutral-800/60 border border-neutral-800 rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 font-bold tracking-wider uppercase text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-red-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingPartner ? 'Atualizar Parceiro' : 'Salvar no Firebase'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MODALIDADE DE TREINO ================= */}
      {isModalityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0a0a0e] border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-8 pb-5 border-b border-neutral-800/80">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
                    PROGRAMA DE TREINAMENTO
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
                  {editingModality ? 'Editar Modalidade' : 'Nova Modalidade de Treino'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Os dados serão gravados na coleção <span className="font-mono text-emerald-400 font-semibold">modalidades</span> do Cloud Firestore e sincronizados em todos os dropdowns do site.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalityModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors cursor-pointer shrink-0 ml-3"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModality} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Nome da Modalidade (Ex: Boxe Olímpico & Profissional)*
                </label>
                <input
                  type="text"
                  required
                  value={modalityForm.titulo}
                  onChange={(e) => setModalityForm({ ...modalityForm, titulo: e.target.value })}
                  placeholder="Ex: Boxe Olímpico & Profissional*"
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Frase de Efeito / Subtítulo
                </label>
                <input
                  type="text"
                  value={modalityForm.subtitulo}
                  onChange={(e) => setModalityForm({ ...modalityForm, subtitulo: e.target.value })}
                  placeholder="Ex: A nobre arte da esquiva, ritmo e potência."
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomSelect
                  label="Categoria da Luta*"
                  placeholder="Selecione a Categoria*"
                  options={MODALITY_CATEGORIES_OPTIONS}
                  value={modalityForm.categoria}
                  onChange={(val: string) => setModalityForm({ ...modalityForm, categoria: val })}
                />

                <CustomSelect
                  label="Intensidade do Treino*"
                  placeholder="Selecione a Intensidade*"
                  options={MODALITY_INTENSITIES_OPTIONS}
                  value={modalityForm.intensidade}
                  onChange={(val: string) => setModalityForm({ ...modalityForm, intensidade: val })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                    Treinador Responsável
                  </label>
                  <input
                    type="text"
                    value={modalityForm.treinador}
                    onChange={(e) => setModalityForm({ ...modalityForm, treinador: e.target.value })}
                    placeholder="Ex: Prof. Marcos Valente"
                    className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                    Resumo dos Horários
                  </label>
                  <input
                    type="text"
                    value={modalityForm.resumo_horarios}
                    onChange={(e) => setModalityForm({ ...modalityForm, resumo_horarios: e.target.value })}
                    placeholder="Ex: Seg a Sex · Turmas manhã, tarde e noite"
                    className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  URL da Imagem de Capa*
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-12 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                    <img
                      src={modalityForm.imagem || 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={modalityForm.imagem}
                    onChange={(e) => setModalityForm({ ...modalityForm, imagem: e.target.value })}
                    placeholder="https://images.unsplash.com/...*"
                    className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                  Descrição Completa da Modalidade*
                </label>
                <textarea
                  rows={3}
                  required
                  value={modalityForm.descricao}
                  onChange={(e) => setModalityForm({ ...modalityForm, descricao: e.target.value })}
                  placeholder="Descreva os fundamentos, técnicas ensinadas e benefícios para o praticante..."
                  className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                    Benefícios Principais (1 por linha)
                  </label>
                  <textarea
                    rows={4}
                    value={modalityForm.beneficiosStr}
                    onChange={(e) => setModalityForm({ ...modalityForm, beneficiosStr: e.target.value })}
                    placeholder="Coordenação motora e reflexos rápidos&#10;Queima calórica intensa&#10;Fortalecimento muscular"
                    className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                    Equipamentos Recomendados (1 por linha)
                  </label>
                  <textarea
                    rows={4}
                    value={modalityForm.equipamentosStr}
                    onChange={(e) => setModalityForm({ ...modalityForm, equipamentosStr: e.target.value })}
                    placeholder="Bandagens elásticas 4m&#10;Luvas de boxe&#10;Protetor bucal"
                    className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-xs resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-neutral-500 font-mono">
                  {editingModality ? `ID: ${editingModality.id}` : 'Coleção: modalidades'}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalityModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-4 font-semibold text-neutral-400 hover:text-white bg-transparent hover:bg-neutral-800/60 border border-neutral-800 rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 font-bold tracking-wider uppercase text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-red-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingModality ? 'Atualizar Modalidade' : 'Salvar no Firebase'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: LUTA AGENDADA ================= */}
      {isFightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#0a0a0e] border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-8 pb-5 border-b border-neutral-800/80">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
                    COMBATE OFICIAL NO CALENDÁRIO
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
                  {editingFight ? 'Editar Combate Agendado' : 'Novo Combate Agendado'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Os dados serão gravados na coleção <span className="font-mono text-emerald-400 font-semibold">lutas_agendadas</span> do Cloud Firestore e sincronizados em tempo real no site principal.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsFightModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors cursor-pointer shrink-0 ml-3"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFight} className="space-y-6">
              {/* Seção 1: Evento e Local */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-red-500 font-heading">
                  1. Informações do Evento
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                      Nome do Evento (Ex: LFA 195: Brasil vs Resto do Mundo)*
                    </label>
                    <input
                      type="text"
                      required
                      value={fightForm.evento || ''}
                      onChange={(e) => setFightForm({ ...fightForm, evento: e.target.value })}
                      placeholder="Ex: LFA 195: Brasil vs Resto do Mundo*"
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                      Organização / Promotora*
                    </label>
                    <input
                      type="text"
                      required
                      value={fightForm.organizacao || ''}
                      onChange={(e) => setFightForm({ ...fightForm, organizacao: e.target.value })}
                      placeholder="Ex: Legacy Fighting Alliance / Jungle Fight*"
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                      Data da Luta*
                    </label>
                    <input
                      type="date"
                      required
                      value={fightForm.data || ''}
                      onChange={(e) => setFightForm({ ...fightForm, data: e.target.value })}
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors text-sm [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                      Horário Previsto*
                    </label>
                    <input
                      type="text"
                      required
                      value={fightForm.horario || ''}
                      onChange={(e) => setFightForm({ ...fightForm, horario: e.target.value })}
                      placeholder="Ex: 21:00*"
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                      Arena / Local*
                    </label>
                    <input
                      type="text"
                      required
                      value={fightForm.local || ''}
                      onChange={(e) => setFightForm({ ...fightForm, local: e.target.value })}
                      placeholder="Ex: Arena Pacaembu*"
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                      Cidade / UF*
                    </label>
                    <input
                      type="text"
                      required
                      value={fightForm.cidade || ''}
                      onChange={(e) => setFightForm({ ...fightForm, cidade: e.target.value })}
                      placeholder="Ex: São Paulo, SP*"
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl transition-colors placeholder:text-neutral-500 shadow-sm text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Atleta BBT vs Desafiante */}
              <div className="space-y-4 pt-4 border-t border-neutral-800/60">
                <div className="text-xs font-bold uppercase tracking-wider text-red-500 font-heading">
                  2. Atletas no Combate
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Atleta BBT */}
                  <div className="p-4 rounded-2xl bg-[#0c0c11] border border-neutral-800/80 space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 block">
                      Lutador da BBT Academy
                    </span>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                        Nome Completo*
                      </label>
                      <input
                        type="text"
                        required
                        value={fightForm.nome_lutador || ''}
                        onChange={(e) => setFightForm({ ...fightForm, nome_lutador: e.target.value })}
                        placeholder="Ex: Gabriel ou Amanda Rocha*"
                        className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                          Apelido
                        </label>
                        <input
                          type="text"
                          value={fightForm.apelido_lutador || ''}
                          onChange={(e) => setFightForm({ ...fightForm, apelido_lutador: e.target.value })}
                          placeholder="Ex: Gaah"
                          className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                          Cartel
                        </label>
                        <input
                          type="text"
                          value={fightForm.cartel_lutador || ''}
                          onChange={(e) => setFightForm({ ...fightForm, cartel_lutador: e.target.value })}
                          placeholder="Ex: 11-1-0 (5 KOs)"
                          className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                        URL da Foto do Lutador BBT
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-red-500/60 shrink-0 bg-neutral-900">
                          <img
                            src={fightForm.foto_lutador || '/gabriel_lutador.png'}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          type="text"
                          value={fightForm.foto_lutador || ''}
                          onChange={(e) => setFightForm({ ...fightForm, foto_lutador: e.target.value })}
                          placeholder="/gabriel_lutador.png ou URL"
                          className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desafiante */}
                  <div className="p-4 rounded-2xl bg-[#0c0c11] border border-neutral-800/80 space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block">
                      Desafiante / Oponente
                    </span>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                        Nome do Oponente*
                      </label>
                      <input
                        type="text"
                        required
                        value={fightForm.nome_oponente || ''}
                        onChange={(e) => setFightForm({ ...fightForm, nome_oponente: e.target.value })}
                        placeholder="Ex: Brandon 'Viper' Vance*"
                        className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                          Equipe / País*
                        </label>
                        <input
                          type="text"
                          required
                          value={fightForm.equipe_oponente || ''}
                          onChange={(e) => setFightForm({ ...fightForm, equipe_oponente: e.target.value })}
                          placeholder="Ex: American Top Team (USA)*"
                          className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                          Cartel
                        </label>
                        <input
                          type="text"
                          value={fightForm.cartel_oponente || ''}
                          onChange={(e) => setFightForm({ ...fightForm, cartel_oponente: e.target.value })}
                          placeholder="Ex: 10-2-0 (6 KOs)"
                          className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 uppercase mb-1">
                        URL da Foto do Oponente
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-neutral-700 shrink-0 bg-neutral-900">
                          <img
                            src={fightForm.foto_oponente || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          type="text"
                          value={fightForm.foto_oponente || ''}
                          onChange={(e) => setFightForm({ ...fightForm, foto_oponente: e.target.value })}
                          placeholder="https://... URL da foto"
                          className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 3: Detalhes do Combate e Transmissão */}
              <div className="space-y-4 pt-4 border-t border-neutral-800/60">
                <div className="text-xs font-bold uppercase tracking-wider text-red-500 font-heading">
                  3. Detalhes do Combate & Transmissão
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CustomSelect
                    label="Categoria de Peso*"
                    placeholder="Selecione a Categoria*"
                    options={WEIGHT_CLASSES_OPTIONS}
                    value={fightForm.categoria_peso || WEIGHT_CLASSES_OPTIONS[5]}
                    onChange={(val: string) => setFightForm({ ...fightForm, categoria_peso: val })}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                      Número de Rounds*
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      required
                      value={fightForm.rounds || 3}
                      onChange={(e) => setFightForm({ ...fightForm, rounds: Number(e.target.value) })}
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl text-sm"
                    />
                  </div>

                  <CustomSelect
                    label="Status do Card*"
                    placeholder="Selecione o Status*"
                    options={FIGHT_STATUS_OPTIONS}
                    value={fightForm.status || FIGHT_STATUS_OPTIONS[0]}
                    onChange={(val: string) => setFightForm({ ...fightForm, status: val as any })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                      Canais de Transmissão (Ex: UFC Fight Pass e Band)*
                    </label>
                    <input
                      type="text"
                      required
                      value={fightForm.transmissao || ''}
                      onChange={(e) => setFightForm({ ...fightForm, transmissao: e.target.value })}
                      placeholder="Ex: Canal Combate, ESPN 4 ou Band*"
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                      Link Oficial de Ingressos
                    </label>
                    <input
                      type="text"
                      value={fightForm.link_ingressos || ''}
                      onChange={(e) => setFightForm({ ...fightForm, link_ingressos: e.target.value })}
                      placeholder="https://sympla.com.br ou #"
                      className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Toggles de Destaque */}
                <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3">
                  <div className="flex items-center gap-6 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                      <input
                        type="checkbox"
                        checked={Boolean(fightForm.luta_principal)}
                        onChange={(e) => setFightForm({ ...fightForm, luta_principal: e.target.checked })}
                        className="rounded border-neutral-800 text-red-600 focus:ring-red-500 h-4 w-4 bg-neutral-900"
                      />
                      <span className="font-semibold">Luta Principal (Main Event da Noite)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                      <input
                        type="checkbox"
                        checked={Boolean(fightForm.disputa_titulo)}
                        onChange={(e) => setFightForm({ ...fightForm, disputa_titulo: e.target.checked })}
                        className="rounded border-neutral-800 text-red-600 focus:ring-red-500 h-4 w-4 bg-neutral-900"
                      />
                      <span className="font-semibold">Disputa de Título / Cinturão</span>
                    </label>
                  </div>

                  {fightForm.disputa_titulo && (
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 font-heading">
                        Nome do Cinturão ou Título em Jogo
                      </label>
                      <input
                        type="text"
                        value={fightForm.nome_titulo || ''}
                        onChange={(e) => setFightForm({ ...fightForm, nome_titulo: e.target.value })}
                        placeholder="Ex: Título Sul-Americano WBA Fedelatin"
                        className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3 rounded-xl text-xs"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-heading">
                    Observações e Análise Técnica do Confronto
                  </label>
                  <textarea
                    rows={3}
                    value={fightForm.observacoes || ''}
                    onChange={(e) => setFightForm({ ...fightForm, observacoes: e.target.value })}
                    placeholder="Contexto da luta, rivalidade, caminho rumo ao cinturão ou seletiva internacional..."
                    className="w-full bg-transparent border border-neutral-800 focus:border-red-500 focus:outline-none text-white px-4 py-3.5 rounded-xl text-sm resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-neutral-500 font-mono">
                  {editingFight ? `ID: ${editingFight.id}` : 'Coleção: lutas_agendadas'}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsFightModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-4 font-semibold text-neutral-400 hover:text-white bg-transparent hover:bg-neutral-800/60 border border-neutral-800 rounded-xl transition-colors cursor-pointer text-sm"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 font-bold tracking-wider uppercase text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-red-600/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingFight ? 'Atualizar Combate' : 'Salvar no Firebase'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

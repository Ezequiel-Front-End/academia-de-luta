import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Swords,
  CalendarDays,
  Dumbbell,
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
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  Trophy,
  Flame,
  ArrowUpRight,
  Shield,
  RefreshCw,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FIGHTERS_DATA, SCHEDULED_FIGHTS_DATA, PROGRAMS_DATA, WEEKLY_SCHEDULE } from '../../data/gymData';
import { Lutador, LutaAgendada } from '../../types/database';
import { mapFighterToLutador, mapScheduledFightToLutaAgendada } from '../../services/mappers';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export function AdminDashboard({ onBackToSite }: AdminDashboardProps) {
  const { user, logout, isDemo } = useAuth();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fighters' | 'fights' | 'programs' | 'sync'>('dashboard');

  // In-memory editable data initialized with current gym data mapped to Portuguese
  const [lutadores, setLutadores] = useState<Lutador[]>(() =>
    FIGHTERS_DATA.map(mapFighterToLutador)
  );

  const [lutasAgendadas, setLutasAgendadas] = useState<LutaAgendada[]>(() =>
    SCHEDULED_FIGHTS_DATA.map(mapScheduledFightToLutaAgendada)
  );

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  // Modal states for creating / editing
  const [isFighterModalOpen, setIsFighterModalOpen] = useState(false);
  const [editingFighter, setEditingFighter] = useState<Lutador | null>(null);

  const [isFightModalOpen, setIsFightModalOpen] = useState(false);
  const [editingFight, setEditingFight] = useState<LutaAgendada | null>(null);

  // Sync state
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');

  // Form states for Lutador
  const [fighterForm, setFighterForm] = useState<Partial<Lutador>>({
    nome: '',
    apelido: '',
    categoria: 'MMA',
    categoria_peso: 'Peso Médio (84 kg)',
    peso_kg: 84,
    altura_cm: 180,
    envergadura_cm: 185,
    foto: '/modelo_lutador_masculino.png',
    biografia: '',
    conquistas: ['Atleta BBT'],
    cidade_origem: 'São Paulo, SP',
    treinador: 'Mestre Rogério Caveira',
    postura: 'Destro',
    tem_proxima_luta: false,
    cartel: { vitorias: 10, derrotas: 1, empates: 0, nocautes: 7, finalizacoes: 2 },
    lutas_recentes: [],
  });

  // Form states for Luta Agendada
  const [fightForm, setFightForm] = useState<Partial<LutaAgendada>>({
    evento: '',
    organizacao: 'Jungle Fight',
    data: '2026-11-20',
    horario: '21:00',
    timestamp_contagem: Date.now() + 1000 * 60 * 60 * 24 * 30,
    local: 'Ginásio do Ibirapuera',
    cidade: 'São Paulo',
    pais: 'Brasil',
    id_lutador: 'kauany-kaah',
    nome_lutador: 'Kauany Oliveira',
    apelido_lutador: 'Kaah',
    foto_lutador: '/modelo_lutador_kaah.png',
    cartel_lutador: '15-2-0',
    nome_oponente: '',
    foto_oponente: '/modelo_lutador_feminino.png',
    cartel_oponente: '11-3-0',
    equipe_oponente: 'Team Alpha',
    categoria_peso: 'Peso Palha (52.2 kg)',
    rounds: 3,
    luta_principal: false,
    disputa_titulo: false,
    transmissao: 'Combate / SporTV',
    status: 'Confirmada',
    observacoes: '',
  });

  // Handle open modal for new fighter
  const handleOpenNewFighter = () => {
    setEditingFighter(null);
    setFighterForm({
      nome: '',
      apelido: '',
      categoria: 'MMA',
      categoria_peso: 'Peso Palha Feminino (52.2 kg)',
      peso_kg: 52.2,
      altura_cm: 168,
      envergadura_cm: 172,
      foto: '/modelo_lutador_kaah.png',
      biografia: 'Nova promessa da equipe brasileira.',
      conquistas: ['Campeão Estadual'],
      cidade_origem: 'São Paulo, SP',
      treinador: 'Mestre Rogério Caveira',
      postura: 'Destro',
      tem_proxima_luta: false,
      cartel: { vitorias: 8, derrotas: 0, empates: 0, nocautes: 5, finalizacoes: 2 },
      lutas_recentes: [],
    });
    setIsFighterModalOpen(true);
  };

  // Handle open edit fighter
  const handleEditFighter = (fighter: Lutador) => {
    setEditingFighter(fighter);
    setFighterForm(fighter);
    setIsFighterModalOpen(true);
  };

  // Handle save fighter
  const handleSaveFighter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fighterForm.nome || !fighterForm.apelido) return;

    if (editingFighter) {
      setLutadores((prev) =>
        prev.map((f) => (f.id === editingFighter.id ? ({ ...f, ...fighterForm } as Lutador) : f))
      );
    } else {
      const newId = (fighterForm.nome || 'lutador')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const newFighter: Lutador = {
        ...fighterForm,
        id: newId,
        conquistas: fighterForm.conquistas || [],
        cartel: fighterForm.cartel || { vitorias: 0, derrotas: 0, empates: 0, nocautes: 0, finalizacoes: 0 },
        lutas_recentes: fighterForm.lutas_recentes || [],
      } as Lutador;
      setLutadores((prev) => [newFighter, ...prev]);
    }
    setIsFighterModalOpen(false);
  };

  // Handle delete fighter
  const handleDeleteFighter = (id: string) => {
    if (confirm('Tem certeza que deseja remover este atleta do plantel?')) {
      setLutadores((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // Handle save fight
  const handleSaveFight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fightForm.evento || !fightForm.nome_oponente) return;

    if (editingFight) {
      setLutasAgendadas((prev) =>
        prev.map((f) => (f.id === editingFight.id ? ({ ...f, ...fightForm } as LutaAgendada) : f))
      );
    } else {
      const newFight: LutaAgendada = {
        ...fightForm,
        id: `luta-${Date.now()}`,
      } as LutaAgendada;
      setLutasAgendadas((prev) => [newFight, ...prev]);
    }
    setIsFightModalOpen(false);
  };

  const handleDeleteFight = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta luta da programação?')) {
      setLutasAgendadas((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // Simulate Firebase synchronization
  const handleSyncFirebase = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 4000);
    }, 1200);
  };

  // Filtered fighters
  const filteredFighters = lutadores.filter((f) => {
    const matchesSearch =
      f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.apelido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'Todas' || f.categoria === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col lg:flex-row font-sans selection:bg-red-600 selection:text-white">
      {/* ================= SIDEBAR (Reference Image 2 Left Side) ================= */}
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
                onClick={() => setActiveTab('fighters')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'fighters'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <Users className="w-4 h-4 text-red-500" />
                <span>Plantel de Lutadores</span>
                <span className="ml-auto text-[10px] bg-neutral-700/60 text-neutral-300 px-2 py-0.5 rounded-full font-bold">
                  {lutadores.length}
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
                  {lutasAgendadas.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('programs')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'programs'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <Dumbbell className="w-4 h-4 text-red-500" />
                <span>Modalidades & Horários</span>
              </button>

              <button
                onClick={() => setActiveTab('sync')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'sync'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <Database className="w-4 h-4 text-red-500" />
                <span>Conexão Firebase</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Sidebar Bottom: Firebase status and user profile matching reference */}
        <div className="p-3 border-t border-neutral-800/80 space-y-3">
          {/* Quick Notice Card */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-900/60 border border-neutral-800 text-xs">
            <div className="flex items-center gap-2 text-white font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Banco em Português</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed mb-2">
              Campos modelados em PT-BR para Firestore.
            </p>
            <button
              onClick={handleSyncFirebase}
              disabled={syncStatus === 'syncing'}
              className="text-[10px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>{syncStatus === 'syncing' ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
            </button>
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

          {/* Back to site action */}
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
        {/* Top Header matching reference (Greeting, Filter, Customize, Action) */}
        <header className="p-6 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Bom dia, {user?.displayName ? user.displayName.split(' ')[0] : 'Administrador'}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Gestão de conteúdo e sincronização do ecossistema BBT em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5 text-neutral-500" />
              <span>Temporada 2026</span>
            </div>

            {activeTab === 'fighters' && (
              <button
                onClick={handleOpenNewFighter}
                className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Lutador</span>
              </button>
            )}

            {activeTab === 'fights' && (
              <button
                onClick={() => setIsFightModalOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agendar Luta</span>
              </button>
            )}

            {activeTab === 'dashboard' && (
              <button
                onClick={handleOpenNewFighter}
                className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Conteúdo</span>
              </button>
            )}
          </div>
        </header>

        {/* Sync feedback toast */}
        {syncStatus === 'success' && (
          <div className="m-6 mb-0 p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Coleções no Firebase Firestore sincronizadas com sucesso com os campos em Português!</span>
          </div>
        )}

        {/* ================= TAB 1: DASHBOARD (Reference Image 2 Exact Look) ================= */}
        {activeTab === 'dashboard' && (
          <div className="p-6 space-y-6">
            {/* Top KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <div className="text-xs text-neutral-400 font-medium mb-1">Taxa de Vitórias BBT</div>
                <div className="text-2xl font-bold text-white mb-2">88.4%</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+4.2% vs temporada anterior</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <div className="text-xs text-neutral-400 font-medium mb-1">Lutadores no Plantel</div>
                <div className="text-2xl font-bold text-white mb-2">{lutadores.length} Atletas</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% com peso e exame em dia</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <div className="text-xs text-neutral-400 font-medium mb-1">Próximos Confrontos</div>
                <div className="text-2xl font-bold text-white mb-2">{lutasAgendadas.length} Lutas Marcadas</div>
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold">
                  <Swords className="w-3.5 h-3.5" />
                  <span>1 Disputa de Cinturão Mundial</span>
                </div>
              </div>
            </div>

            {/* Central Chart + Radial Gauge Section from Reference Image 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Main Graph / Performance & Readiness */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-3xl font-bold text-white">850 Alunos</div>
                    <div className="text-xs text-neutral-400 mt-1">Matrículas ativas e camp de competição</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+27.4% no trimestre</span>
                  </div>
                </div>

                {/* Simulated clean line chart graph resembling Image 2 */}
                <div className="relative h-48 w-full flex items-end justify-between gap-2 pt-6">
                  {/* Background grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-b border-white" />
                  </div>

                  {/* SVG Wave Line */}
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

                  {/* Floating tooltip badge like reference photo */}
                  <div className="absolute top-2 right-16 bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 rounded-lg shadow-xl text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="font-semibold text-white">Kaah vs Mendez</span>
                    <span className="text-[10px] text-neutral-400">KO R1</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-4 border-t border-neutral-800/80 mt-4">
                  <span>Abr 11</span>
                  <span>Abr 17</span>
                  <span>Abr 22</span>
                  <span>Abr 28</span>
                  <span>Mai 4</span>
                  <span className="px-2 py-0.5 rounded-md bg-white text-neutral-950 font-bold">Hoje</span>
                </div>
              </div>

              {/* Right Col: Radial Speedometer / Gauge Meter from Reference Image 2 */}
              <div className="p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                    Capacidade & Rendimento do Dojô
                  </div>

                  {/* Dial Gauge SVG replicating the radial tick marks in image 2 */}
                  <div className="flex flex-col items-center justify-center my-4 relative">
                    <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
                      {/* Background tick circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#222"
                        strokeWidth="8"
                        strokeDasharray="2 3"
                      />
                      {/* Active progress */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="8"
                        strokeDasharray="2 3"
                        strokeDashoffset="60"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <Trophy className="w-5 h-5 text-red-500 mb-1" />
                      <div className="text-xl font-bold text-white">94%</div>
                      <div className="text-[10px] text-neutral-400">Eficiência Geral</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-800/80 text-xs">
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>Lutadores Ativos</span>
                    <strong className="text-white font-semibold">{lutadores.length} atletas</strong>
                  </div>
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>Aulas Semanais</span>
                    <strong className="text-white font-semibold">{WEEKLY_SCHEDULE.length} turmas</strong>
                  </div>
                  <button
                    onClick={() => setActiveTab('fighters')}
                    className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 rounded-xl text-neutral-200 text-xs font-medium transition-colors cursor-pointer text-center"
                  >
                    Ver Detalhes do Plantel →
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: AI Insights Card + Quick Management from Image 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <span>Inteligência de Treinamento BBT</span>
                </div>
                <p className="text-sm text-neutral-200 leading-relaxed mb-4">
                  O camp de preparação para a luta de <strong>Kauany "Kaah" Oliveira</strong> no Jungle Fight 132 atingiu <strong>100% de presença</strong> e peso estabilizado em 52.2 kg. 3 novos atletas foram incluídos na pré-seleção estadual.
                </p>

                {/* Progress bars like Image 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Distribuição de Disciplinas</span>
                    <span>MMA 50% • Muay Thai 25% • Jiu-Jitsu 25%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full flex overflow-hidden">
                    <div className="h-full bg-red-600 w-1/2" />
                    <div className="h-full bg-red-400 w-1/4" />
                    <div className="h-full bg-neutral-400 w-1/4" />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-neutral-400 font-medium mb-1">Status do Firebase</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Pronto para Gravação</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {lutadores.length} lutadores e {lutasAgendadas.length} lutas em memória prontos para escrita nas coleções em Português.
                  </p>
                </div>

                <button
                  onClick={handleSyncFirebase}
                  className="w-full mt-4 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>Gravar no Firestore</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LUTADORES (CRUD Completo em Português) ================= */}
        {activeTab === 'fighters' && (
          <div className="p-6 space-y-6">
            {/* Action & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome, apelido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl p-1 text-xs text-neutral-400">
                  {['Todas', 'MMA', 'Boxe', 'Muay Thai', 'Jiu-Jitsu'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-red-600 text-white font-bold'
                          : 'hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleOpenNewFighter}
                  className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Lutador</span>
                </button>
              </div>
            </div>

            {/* Fighters Grid / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFighters.map((lutador) => (
                <div
                  key={lutador.id}
                  className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 hover:border-neutral-700 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3.5 mb-4">
                      <img
                        src={lutador.foto}
                        alt={lutador.nome}
                        className="w-14 h-14 rounded-xl object-cover bg-neutral-800 border border-neutral-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white truncate">{lutador.nome}</span>
                          <span className="text-[10px] uppercase font-bold text-red-500 bg-red-950/60 border border-red-900/60 px-1.5 py-0.5 rounded">
                            {lutador.categoria}
                          </span>
                        </div>
                        <div className="text-xs text-red-400 font-semibold italic">"{lutador.apelido}"</div>
                        <div className="text-[11px] text-neutral-400 mt-0.5 truncate">{lutador.categoria_peso}</div>
                      </div>
                    </div>

                    {/* Cartel badge */}
                    <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800/60 grid grid-cols-3 gap-2 text-center text-xs mb-3">
                      <div>
                        <div className="text-[10px] text-neutral-400">Vitórias</div>
                        <div className="font-bold text-white">{lutador.cartel.vitorias}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-400">Nocautes</div>
                        <div className="font-bold text-red-400">{lutador.cartel.nocautes}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-400">Derrotas</div>
                        <div className="font-bold text-neutral-400">{lutador.cartel.derrotas}</div>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                      {lutador.biografia}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-500">
                      {lutador.tem_proxima_luta ? (
                        <span className="text-emerald-400 font-semibold">● Luta Marcada</span>
                      ) : (
                        <span>● Sem luta ativa</span>
                      )}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditFighter(lutador)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFighter(lutador.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: LUTAS AGENDADAS (Cards de Lutas) ================= */}
        {activeTab === 'fights' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Próximos Cards e Confrontos</h2>
                <p className="text-xs text-neutral-400">Gerencie eventos que aparecem na contagem regressiva do site.</p>
              </div>

              <button
                onClick={() => setIsFightModalOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agendar Nova Luta</span>
              </button>
            </div>

            <div className="space-y-4">
              {lutasAgendadas.map((luta) => (
                <div
                  key={luta.id}
                  className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center md:text-left min-w-[120px]">
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-red-600/20 text-red-400 border border-red-500/30 rounded-full">
                        {luta.organizacao}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">{luta.evento}</h3>
                      <div className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{luta.data} às {luta.horario}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{luta.local} ({luta.cidade})</span>
                      </div>
                    </div>
                  </div>

                  {/* Face-off mini matchup */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{luta.nome_lutador}</div>
                      <div className="text-xs text-red-400 font-semibold">{luta.cartel_lutador}</div>
                      <div className="text-[10px] text-neutral-500">BBT Fighter</div>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-xs font-black text-red-500 italic">
                      VS
                    </div>

                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{luta.nome_oponente}</div>
                      <div className="text-xs text-neutral-400 font-semibold">{luta.cartel_oponente}</div>
                      <div className="text-[10px] text-neutral-500">{luta.equipe_oponente}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteFight(luta.id)}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                      title="Excluir Luta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: MODALIDADES & HORÁRIOS ================= */}
        {activeTab === 'programs' && (
          <div className="p-6 space-y-6">
            <h2 className="text-lg font-bold text-white">Modalidades Oferecidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROGRAMS_DATA.map((prog) => (
                <div key={prog.id} className="p-5 rounded-2xl bg-[#0f0f14] border border-neutral-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-base">{prog.title}</h3>
                    <span className="text-xs text-red-400 font-semibold">{prog.intensity}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-3">{prog.description}</p>
                  <div className="text-[11px] text-neutral-500">
                    Treinador Responsável: <strong className="text-neutral-300">{prog.coach}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: SINCRONIZAÇÃO FIREBASE ================= */}
        {activeTab === 'sync' && (
          <div className="p-6 max-w-2xl space-y-6">
            <div className="p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Sincronização com Cloud Firestore</h3>
                  <p className="text-xs text-neutral-400">Coleções estruturadas 100% em Português.</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-neutral-300">
                <p>Coleções que serão alimentadas:</p>
                <div className="grid grid-cols-2 gap-2 text-neutral-400 pl-4">
                  <div>• `lutadores` ({lutadores.length} itens)</div>
                  <div>• `lutas_agendadas` ({lutasAgendadas.length} itens)</div>
                  <div>• `modalidades` (4 itens)</div>
                  <div>• `grade_horarios` (16 itens)</div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSyncFirebase}
                  disabled={syncStatus === 'syncing'}
                  className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  <span>{syncStatus === 'syncing' ? 'Gravando no Firestore...' : 'Sincronizar Todas as Coleções'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: NOVO / EDITAR LUTADOR (Campos em PT-BR) ================= */}
      {isFighterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0e0e14] border border-neutral-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">
                {editingFighter ? 'Editar Lutador' : 'Cadastrar Novo Lutador'}
              </h3>
              <button
                onClick={() => setIsFighterModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFighter} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={fighterForm.nome}
                    onChange={(e) => setFighterForm({ ...fighterForm, nome: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="Ex: Carlos Silva"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Apelido no Ringue</label>
                  <input
                    type="text"
                    required
                    value={fighterForm.apelido}
                    onChange={(e) => setFighterForm({ ...fighterForm, apelido: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="Ex: Predador"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Modalidade Principal</label>
                  <select
                    value={fighterForm.categoria}
                    onChange={(e) => setFighterForm({ ...fighterForm, categoria: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="MMA">MMA</option>
                    <option value="Muay Thai">Muay Thai</option>
                    <option value="Boxe">Boxe</option>
                    <option value="Jiu-Jitsu">Jiu-Jitsu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Categoria de Peso</label>
                  <input
                    type="text"
                    value={fighterForm.categoria_peso}
                    onChange={(e) => setFighterForm({ ...fighterForm, categoria_peso: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="Ex: Peso Meio-Médio (77.1 kg)"
                  />
                </div>
              </div>

              {/* Cartel */}
              <div>
                <label className="block text-neutral-400 mb-1">Cartel Oficial (Vitórias / Nocautes / Derrotas)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Vitórias"
                    value={fighterForm.cartel?.vitorias}
                    onChange={(e) =>
                      setFighterForm({
                        ...fighterForm,
                        cartel: { ...fighterForm.cartel!, vitorias: Number(e.target.value) },
                      })
                    }
                    className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Nocautes"
                    value={fighterForm.cartel?.nocautes}
                    onChange={(e) =>
                      setFighterForm({
                        ...fighterForm,
                        cartel: { ...fighterForm.cartel!, nocautes: Number(e.target.value) },
                      })
                    }
                    className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Derrotas"
                    value={fighterForm.cartel?.derrotas}
                    onChange={(e) =>
                      setFighterForm({
                        ...fighterForm,
                        cartel: { ...fighterForm.cartel!, derrotas: Number(e.target.value) },
                      })
                    }
                    className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Biografia Resumida</label>
                <textarea
                  rows={3}
                  value={fighterForm.biografia}
                  onChange={(e) => setFighterForm({ ...fighterForm, biografia: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  placeholder="Trajetória marcial do atleta..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="proximaLutaCheck"
                  checked={fighterForm.tem_proxima_luta}
                  onChange={(e) => setFighterForm({ ...fighterForm, tem_proxima_luta: e.target.checked })}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="proximaLutaCheck" className="text-neutral-300 cursor-pointer">
                  Atleta com luta agendada ativa
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFighterModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Lutador</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: AGENDAR NOVA LUTA (Campos em PT-BR) ================= */}
      {isFightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0e0e14] border border-neutral-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">Agendar Nova Luta Oficial</h3>
              <button onClick={() => setIsFightModalOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFight} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Evento</label>
                  <input
                    type="text"
                    required
                    value={fightForm.evento}
                    onChange={(e) => setFightForm({ ...fightForm, evento: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    placeholder="Ex: Jungle Fight 133"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Organização</label>
                  <input
                    type="text"
                    value={fightForm.organizacao}
                    onChange={(e) => setFightForm({ ...fightForm, organizacao: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    placeholder="Ex: Jungle Fight"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={fightForm.data}
                    onChange={(e) => setFightForm({ ...fightForm, data: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Horário</label>
                  <input
                    type="text"
                    value={fightForm.horario}
                    onChange={(e) => setFightForm({ ...fightForm, horario: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    placeholder="20:30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Lutador da Casa</label>
                  <select
                    value={fightForm.nome_lutador}
                    onChange={(e) => {
                      const selected = lutadores.find((l) => l.nome === e.target.value);
                      if (selected) {
                        setFightForm({
                          ...fightForm,
                          nome_lutador: selected.nome,
                          apelido_lutador: selected.apelido,
                          id_lutador: selected.id,
                          cartel_lutador: `${selected.cartel.vitorias}-${selected.cartel.derrotas}-${selected.cartel.empates}`,
                        });
                      }
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                  >
                    {lutadores.map((l) => (
                      <option key={l.id} value={l.nome}>
                        {l.nome} ({l.apelido})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Nome do Oponente</label>
                  <input
                    type="text"
                    required
                    value={fightForm.nome_oponente}
                    onChange={(e) => setFightForm({ ...fightForm, nome_oponente: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    placeholder="Ex: Diego Alcantara"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Local / Ginásio</label>
                  <input
                    type="text"
                    value={fightForm.local}
                    onChange={(e) => setFightForm({ ...fightForm, local: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    placeholder="Ginásio do Ibirapuera"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Transmissão</label>
                  <input
                    type="text"
                    value={fightForm.transmissao}
                    onChange={(e) => setFightForm({ ...fightForm, transmissao: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    placeholder="Ao vivo no Combate"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFightModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Luta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

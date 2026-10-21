// Definições de Tipos 100% em Português para o Banco de Dados Firebase

export interface CartelLutador {
  vitorias: number;
  derrotas: number;
  empates: number;
  nocautes: number;
  finalizacoes: number;
}

export interface LutaHistorico {
  oponente: string;
  evento: string;
  resultado: 'Vitória' | 'Derrota' | 'Empate';
  metodo: string;
  round: number;
  data: string;
}

export interface Lutador {
  id: string;
  nome: string;
  apelido: string;
  categoria: 'MMA' | 'Boxe' | 'Muay Thai' | 'Jiu-Jitsu';
  categoria_peso: string;
  peso_kg: number;
  altura_cm: number;
  envergadura_cm: number;
  cartel: CartelLutador;
  foto: string;
  biografia: string;
  conquistas: string[];
  cidade_origem: string;
  instagram?: string;
  treinador: string;
  postura: 'Destro' | 'Canhoto' | 'Switch';
  tem_proxima_luta: boolean;
  id_proxima_luta?: string;
  lutas_recentes: LutaHistorico[];
}

export interface LutaAgendada {
  id: string;
  evento: string;
  organizacao: string;
  data: string; // "AAAA-MM-DD"
  horario: string; // "HH:MM"
  timestamp_contagem: number;
  local: string;
  cidade: string;
  pais: string;
  id_lutador: string;
  nome_lutador: string;
  apelido_lutador: string;
  foto_lutador: string;
  cartel_lutador: string;
  nome_oponente: string;
  apelido_oponente?: string;
  foto_oponente: string;
  cartel_oponente: string;
  equipe_oponente: string;
  categoria_peso: string;
  rounds: number;
  luta_principal: boolean;
  disputa_titulo: boolean;
  nome_titulo?: string;
  transmissao: string;
  link_ingressos?: string;
  status: 'Confirmada' | 'Card Principal' | 'Disputa de Título' | 'Card Preliminar';
  observacoes: string;
}

export interface ModalidadeTreino {
  id: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  descricao: string;
  beneficios: string[];
  resumo_horarios: string;
  intensidade: 'Moderada' | 'Alta' | 'Extrema';
  equipamentos_necessarios: string[];
  imagem: string;
  treinador: string;
}

export interface GradeHorarioTreino {
  id: string;
  dia_semana: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
  horario: string;
  modalidade: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado / Competição' | 'Todos os Níveis' | 'Iniciante / Intermediário' | 'Intermediário / Avançado';
  treinador: string;
  sala: string;
}

export interface InformacoesAcademia {
  nome: string;
  nome_curto: string;
  slogan: string;
  subtitulo: string;
  descricao: string;
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: string;
  horarios_semana: string;
  horarios_sabado: string;
  horarios_domingo: string;
}

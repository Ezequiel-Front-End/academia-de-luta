export interface Fighter {
  id: string;
  name: string;
  nickname: string;
  category: 'MMA' | 'Boxe' | 'Muay Thai' | 'Jiu-Jitsu';
  weightClass: string;
  weightKg: number;
  heightCm: number;
  reachCm: number;
  record: {
    wins: number;
    losses: number;
    draws: number;
    kos: number;
    submissions: number;
  };
  photo: string;
  bio: string;
  achievements: string[];
  hometown: string;
  instagram?: string;
  coach: string;
  stance: 'Destro' | 'Canhoto' | 'Switch';
  hasUpcomingFight: boolean;
  upcomingFightId?: string;
  recentFights: {
    opponent: string;
    event: string;
    result: 'Vitória' | 'Derrota' | 'Empate';
    method: string;
    round: number;
    date: string;
  }[];
}

export interface ScheduledFight {
  id: string;
  event: string;
  promotion: string;
  date: string; // ISO date string e.g. "2026-10-25"
  time: string; // e.g. "20:30"
  timestamp: number; // for countdown
  venue: string;
  city: string;
  country: string;
  fighterId: string;
  fighterName: string;
  fighterNickname: string;
  fighterPhoto: string;
  fighterRecord: string;
  opponentName: string;
  opponentNickname?: string;
  opponentPhoto: string;
  opponentRecord: string;
  opponentTeam: string;
  weightClass: string;
  rounds: number;
  isMainEvent: boolean;
  isTitleFight: boolean;
  titleName?: string;
  broadcast: string;
  ticketsUrl?: string;
  status: 'Confirmada' | 'Card Principal' | 'Disputa de Título' | 'Card Preliminar';
  notes: string;
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  benefits: string[];
  scheduleOverview: string;
  intensity: 'Moderada' | 'Alta' | 'Extrema';
  equipmentRequired: string[];
  image: string;
  coach: string;
}

export interface ClassScheduleItem {
  id: string;
  day: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';
  time: string;
  program: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado / Competição' | 'Todos os Níveis' | 'Iniciante / Intermediário' | 'Intermediário / Avançado';
  coach: string;
  room: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  highlight: string;
}

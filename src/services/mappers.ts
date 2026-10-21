import { Fighter, ScheduledFight, Program, ClassScheduleItem } from '../types';
import { Lutador, LutaAgendada, ModalidadeTreino, GradeHorarioTreino } from '../types/database';

// Converte Fighter para o modelo Lutador em Português
export function mapFighterToLutador(f: Fighter): Lutador {
  return {
    id: f.id,
    nome: f.name,
    apelido: f.nickname,
    categoria: f.category,
    categoria_peso: f.weightClass,
    peso_kg: f.weightKg,
    altura_cm: f.heightCm,
    envergadura_cm: f.reachCm,
    cartel: {
      vitorias: f.record.wins,
      derrotas: f.record.losses,
      empates: f.record.draws,
      nocautes: f.record.kos,
      finalizacoes: f.record.submissions,
    },
    foto: f.photo,
    biografia: f.bio,
    conquistas: f.achievements,
    cidade_origem: f.hometown,
    instagram: f.instagram,
    treinador: f.coach,
    postura: f.stance,
    tem_proxima_luta: f.hasUpcomingFight,
    id_proxima_luta: f.upcomingFightId,
    lutas_recentes: f.recentFights.map((rf) => ({
      oponente: rf.opponent,
      evento: rf.event,
      resultado: rf.result,
      metodo: rf.method,
      round: rf.round,
      data: rf.date,
    })),
  };
}

// Converte Lutador do banco de volta para Fighter da interface visual
export function mapLutadorToFighter(l: Lutador): Fighter {
  return {
    id: l.id,
    name: l.nome,
    nickname: l.apelido,
    category: l.categoria,
    weightClass: l.categoria_peso,
    weightKg: l.peso_kg,
    heightCm: l.altura_cm,
    reachCm: l.envergadura_cm,
    record: {
      wins: l.cartel.vitorias,
      losses: l.cartel.derrotas,
      draws: l.cartel.empates,
      kos: l.cartel.nocautes,
      submissions: l.cartel.finalizacoes,
    },
    photo: l.foto,
    bio: l.biografia,
    achievements: l.conquistas,
    hometown: l.cidade_origem,
    instagram: l.instagram,
    coach: l.treinador,
    stance: l.postura,
    hasUpcomingFight: l.tem_proxima_luta,
    upcomingFightId: l.id_proxima_luta,
    recentFights: l.lutas_recentes.map((rf) => ({
      opponent: rf.oponente,
      event: rf.evento,
      result: rf.resultado,
      method: rf.metodo,
      round: rf.round,
      date: rf.data,
    })),
  };
}

// Converte ScheduledFight para LutaAgendada em Português
export function mapScheduledFightToLutaAgendada(sf: ScheduledFight): LutaAgendada {
  return {
    id: sf.id,
    evento: sf.event,
    organizacao: sf.promotion,
    data: sf.date,
    horario: sf.time,
    timestamp_contagem: sf.timestamp,
    local: sf.venue,
    cidade: sf.city,
    pais: sf.country,
    id_lutador: sf.fighterId,
    nome_lutador: sf.fighterName,
    apelido_lutador: sf.fighterNickname,
    foto_lutador: sf.fighterPhoto,
    cartel_lutador: sf.fighterRecord,
    nome_oponente: sf.opponentName,
    apelido_oponente: sf.opponentNickname,
    foto_oponente: sf.opponentPhoto,
    cartel_oponente: sf.opponentRecord,
    equipe_oponente: sf.opponentTeam,
    categoria_peso: sf.weightClass,
    rounds: sf.rounds,
    luta_principal: sf.isMainEvent,
    disputa_titulo: sf.isTitleFight,
    nome_titulo: sf.titleName,
    transmissao: sf.broadcast,
    link_ingressos: sf.ticketsUrl,
    status: sf.status,
    observacoes: sf.notes,
  };
}

// Converte LutaAgendada do banco de volta para ScheduledFight
export function mapLutaAgendadaToScheduledFight(la: LutaAgendada): ScheduledFight {
  return {
    id: la.id,
    event: la.evento,
    promotion: la.organizacao,
    date: la.data,
    time: la.horario,
    timestamp: la.timestamp_contagem,
    venue: la.local,
    city: la.cidade,
    country: la.pais,
    fighterId: la.id_lutador,
    fighterName: la.nome_lutador,
    fighterNickname: la.apelido_lutador,
    fighterPhoto: la.foto_lutador,
    fighterRecord: la.cartel_lutador,
    opponentName: la.nome_oponente,
    opponentNickname: la.apelido_oponente,
    opponentPhoto: la.foto_oponente,
    opponentRecord: la.cartel_oponente,
    opponentTeam: la.equipe_oponente,
    weightClass: la.categoria_peso,
    rounds: la.rounds,
    isMainEvent: la.luta_principal,
    isTitleFight: la.disputa_titulo,
    titleName: la.nome_titulo,
    broadcast: la.transmissao,
    ticketsUrl: la.link_ingressos,
    status: la.status,
    notes: la.observacoes,
  };
}

// Converte Program para ModalidadeTreino
export function mapProgramToModalidade(p: Program): ModalidadeTreino {
  return {
    id: p.id,
    titulo: p.title,
    subtitulo: p.subtitle,
    categoria: p.category,
    descricao: p.description,
    beneficios: p.benefits,
    resumo_horarios: p.scheduleOverview,
    intensidade: p.intensity,
    equipamentos_necessarios: p.equipmentRequired,
    imagem: p.image,
    treinador: p.coach,
  };
}

// Converte ClassScheduleItem para GradeHorarioTreino
export function mapScheduleItemToGrade(cs: ClassScheduleItem): GradeHorarioTreino {
  return {
    id: cs.id,
    dia_semana: cs.day,
    horario: cs.time,
    modalidade: cs.program,
    nivel: cs.level,
    treinador: cs.coach,
    sala: cs.room,
  };
}

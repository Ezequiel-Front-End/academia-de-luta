import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { LutaAgendada } from '../types/database';

const COLLECTION_NAME = 'lutas_agendadas';

export const INITIAL_FIGHTS: LutaAgendada[] = [
  {
    id: 'fight-jungle-132',
    evento: 'Jungle Fight 132: Disputa de Cinturão',
    organizacao: 'Jungle Fight Championship',
    data: '2026-10-24',
    horario: '21:00',
    timestamp_contagem: new Date('2026-10-24T21:00:00-03:00').getTime(),
    local: 'Ginásio do Ibirapuera',
    cidade: 'São Paulo, SP',
    pais: 'Brasil',
    id_lutador: 'kauany-kaah',
    nome_lutador: 'Kauany Oliveira',
    apelido_lutador: 'Kaah',
    foto_lutador: '/modelo_lutador_kaah.png',
    cartel_lutador: '15-2-0 (10 KOs)',
    nome_oponente: 'Amanda Rocha',
    apelido_oponente: 'Furacão',
    foto_oponente: '/modelo_lutador_feminino.png',
    cartel_oponente: '12-1-0 (7 KOs)',
    equipe_oponente: 'Team Cordoba Boxeo',
    categoria_peso: 'Peso Palha Feminino (52.2 kg)',
    rounds: 5,
    luta_principal: true,
    disputa_titulo: true,
    nome_titulo: 'Cinturão Peso Meio-Médio Jungle Fight',
    transmissao: 'Canal Combate, Sportv 3 e YouTube Oficial',
    link_ingressos: 'https://bileto.sympla.com.br',
    status: 'Disputa de Título',
    observacoes: 'Luta principal da noite. Kauany defenderá o nome da BBT em uma batalha de 5 rounds pelo cinturão vago da categoria.',
    ativo: true,
    ordem: 1,
  },
  {
    id: 'fight-boxing-gp',
    evento: 'São Paulo Boxing Grand Prix 2026',
    organizacao: 'Conselho Nacional de Boxe (CNB)',
    data: '2026-11-07',
    horario: '20:30',
    timestamp_contagem: new Date('2026-11-07T20:30:00-03:00').getTime(),
    local: 'Arena Pacaembu',
    cidade: 'São Paulo, SP',
    pais: 'Brasil',
    id_lutador: 'amanda-furacão',
    nome_lutador: 'Amanda Rocha',
    apelido_lutador: 'Furacão',
    foto_lutador: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    cartel_lutador: '12-1-0 (7 KOs)',
    nome_oponente: 'Camila "La Fiera" Gomez',
    apelido_oponente: 'La Fiera',
    foto_oponente: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    cartel_oponente: '11-2-0 (5 KOs)',
    equipe_oponente: 'Team Cordoba Boxeo (Argentina)',
    categoria_peso: 'Peso Pena Feminino (57 kg)',
    rounds: 8,
    luta_principal: false,
    disputa_titulo: true,
    nome_titulo: 'Título Sul-Americano WBA Fedelatin',
    transmissao: 'ESPN 4 e Star+ Ao Vivo',
    link_ingressos: 'https://sympla.com.br',
    status: 'Card Principal',
    observacoes: 'Duelo internacional Brasil vs Argentina valendo vaga direta no top 5 do ranking mundial.',
    ativo: true,
    ordem: 2,
  },
  {
    id: 'fight-lfa-195',
    evento: 'LFA 195: Brasil vs Resto do Mundo',
    organizacao: 'Legacy Fighting Alliance',
    data: '2026-11-21',
    horario: '22:00',
    timestamp_contagem: new Date('2026-11-21T22:00:00-03:00').getTime(),
    local: 'Qualistage',
    cidade: 'Rio de Janeiro, RJ',
    pais: 'Brasil',
    id_lutador: 'gabriel-gaah',
    nome_lutador: 'Gabriel',
    apelido_lutador: 'Gaah',
    foto_lutador: '/gabriel_lutador.png',
    cartel_lutador: '11-1-0 (5 KOs)',
    nome_oponente: 'Brandon "Viper" Vance',
    apelido_oponente: 'Viper',
    foto_oponente: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=800&q=80',
    cartel_oponente: '10-2-0 (6 KOs)',
    equipe_oponente: 'American Top Team (USA)',
    categoria_peso: 'Peso Leve (70.3 kg)',
    rounds: 3,
    luta_principal: false,
    disputa_titulo: false,
    transmissao: 'UFC Fight Pass e Band',
    link_ingressos: 'https://eventim.com.br',
    status: 'Card Principal',
    observacoes: 'Passaporte rumo ao Contender Series do UFC. Gabriel busca mais uma vitória contundente.',
    ativo: true,
    ordem: 3,
  },
  {
    id: 'fight-muaythai-grandprix',
    evento: 'War Muay Thai Stadium Brasil 16',
    organizacao: 'Liga Brasileira de Muay Thai Tradicional',
    data: '2026-12-05',
    horario: '19:00',
    timestamp_contagem: new Date('2026-12-05T19:00:00-03:00').getTime(),
    local: 'Clube Atlético Juventus',
    cidade: 'São Paulo, SP',
    pais: 'Brasil',
    id_lutador: 'bruno-martelo',
    nome_lutador: 'Bruno Oliveira',
    apelido_lutador: 'O Martelo',
    foto_lutador: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    cartel_lutador: '22-3-1 (16 KOs)',
    nome_oponente: 'Alexandre "Trovão" Batista',
    apelido_oponente: 'Trovão',
    foto_oponente: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    cartel_oponente: '19-4-0 (13 KOs)',
    equipe_oponente: 'Koh Samui Team SP',
    categoria_peso: 'Peso Médio (75 kg)',
    rounds: 5,
    luta_principal: true,
    disputa_titulo: true,
    nome_titulo: 'Cinturão Nacional 5 Rounds com Regras de Bangkok',
    transmissao: 'YouTube Muay Thai Brasil & Live Stream Pay-per-view',
    link_ingressos: 'https://sympla.com.br',
    status: 'Disputa de Título',
    observacoes: 'Regras puras da Tailândia: cotoveladas liberadas sem proteção e clínica de clinch pesado.',
    ativo: true,
    ordem: 4,
  },
];

/**
 * Grava os 4 combates agendados oficiais no Cloud Firestore.
 */
export async function seedInitialFightsToFirestore(customDb = db): Promise<void> {
  const targetDb = customDb || db;
  if (!targetDb) {
    console.warn('Firebase não configurado para seed de lutas.');
    return;
  }

  const batch = writeBatch(targetDb);
  const now = new Date().toISOString();

  INITIAL_FIGHTS.forEach((fight) => {
    const docRef = doc(targetDb, COLLECTION_NAME, fight.id);
    batch.set(
      docRef,
      {
        ...fight,
        ativo: fight.ativo !== false,
        criado_em: fight.criado_em || now,
        atualizado_em: now,
      },
      { merge: true }
    );
  });

  await batch.commit();
}

/**
 * Escuta em tempo real os combates agendados cadastrados no Firestore.
 * Se a coleção estiver vazia, realiza o auto-seed das lutas oficiais.
 */
export function subscribeToScheduledFights(
  onData: (fights: LutaAgendada[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!isFirebaseConfigured || !db) {
    onData(INITIAL_FIGHTS);
    return () => {};
  }

  try {
    const q = query(collection(db, COLLECTION_NAME));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // Auto-seed se o banco estiver vazio
          seedInitialFightsToFirestore().catch((e) =>
            console.warn('Auto-seed de lutas agendadas:', e)
          );
          onData(INITIAL_FIGHTS);
          return;
        }

        const items: LutaAgendada[] = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<LutaAgendada, 'id'>),
          });
        });

        // Ordena por ordem ou data
        items.sort((a, b) => {
          if (a.ordem && b.ordem) return a.ordem - b.ordem;
          return (a.timestamp_contagem || 0) - (b.timestamp_contagem || 0);
        });

        onData(items);
      },
      (error) => {
        console.warn('Erro ao escutar lutas agendadas no Firebase:', error);
        if (onError) onError(error);
        onData(INITIAL_FIGHTS);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.warn('Falha ao inicializar listener de lutas agendadas:', err);
    onData(INITIAL_FIGHTS);
    return () => {};
  }
}

/**
 * Busca todas as lutas agendadas cadastradas no Firestore (leitura única).
 */
export async function getScheduledFightsFromFirestore(): Promise<LutaAgendada[]> {
  if (!isFirebaseConfigured || !db) {
    return INITIAL_FIGHTS;
  }

  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await seedInitialFightsToFirestore();
      return INITIAL_FIGHTS;
    }
    const items: LutaAgendada[] = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<LutaAgendada, 'id'>),
      });
    });
    items.sort((a, b) => {
      if (a.ordem && b.ordem) return a.ordem - b.ordem;
      return (a.timestamp_contagem || 0) - (b.timestamp_contagem || 0);
    });
    return items;
  } catch (error) {
    console.warn('Erro ao buscar lutas agendadas no Firestore:', error);
    return INITIAL_FIGHTS;
  }
}

/**
 * Cria ou atualiza uma luta agendada no Firestore.
 */
export async function saveScheduledFightToFirestore(
  fight: LutaAgendada
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado.');
    return;
  }

  const cleanId = fight.id || `fight-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, cleanId);

  // Calcula timestamp numérico se não estiver presente
  let timestamp = fight.timestamp_contagem;
  if (!timestamp && fight.data) {
    const dateTimeStr = `${fight.data}T${fight.horario || '20:00'}:00-03:00`;
    timestamp = new Date(dateTimeStr).getTime();
  }

  const payload: LutaAgendada = {
    ...fight,
    id: cleanId,
    timestamp_contagem: timestamp || Date.now(),
    atualizado_em: new Date().toISOString(),
  };

  await setDoc(docRef, payload, { merge: true });
}

/**
 * Remove uma luta agendada do Firestore.
 */
export async function deleteScheduledFightFromFirestore(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado.');
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

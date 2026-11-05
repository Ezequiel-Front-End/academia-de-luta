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
import { ModalidadeTreino } from '../types/database';

const COLLECTION_NAME = 'modalidades';

export const INITIAL_MODALITIES: ModalidadeTreino[] = [
  {
    id: 'boxe',
    titulo: 'Boxe Olímpico & Profissional',
    subtitulo: 'A nobre arte da esquiva, ritmo e potência.',
    categoria: 'Striking',
    descricao:
      'Aprenda os fundamentos legítimos do boxe: jogo de pernas, guarda fechada, combinações de golpes diretos, ganchos e cruzados. Desenvolva condicionamento cardiovascular de atleta e reflexos ultrarrápidos.',
    beneficios: [
      'Coordenação motora e reflexos rápidos',
      'Queima calórica intensa (~800 kcal/aula)',
      'Fortalecimento de ombros, abdômen e pernas',
      'Autoconfiança e alívio do estresse',
    ],
    resumo_horarios: 'Turmas manhã, tarde e noite · Seg a Sex',
    intensidade: 'Alta',
    equipamentos_necessarios: ['Bandagens elásticas 4m', 'Luvas de boxe (12oz a 16oz)', 'Protetor bucal'],
    imagem: 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=800&q=80',
    treinador: 'Prof. Marcos Valente',
    ativo: true,
    ordem: 1,
  },
  {
    id: 'muay-thai',
    titulo: 'Muay Thai Tradicional',
    subtitulo: 'A arte das oito armas: punhos, cotovelos, joelhos e canelas.',
    categoria: 'Striking',
    descricao:
      'Treinamento autêntico com a filosofia e intensidade dos campos tailandeses. Trabalhamos chutes potentes na coxa e costela, joelhadas duras, bloqueios e o domínio clássico do clinch.',
    beneficios: [
      'Agilidade e explosão muscular',
      'Endurecimento de canelas e postura',
      'Domínio de combate na média e curta distância',
      'Disciplina marcial e foco mental',
    ],
    resumo_horarios: 'Segundas, Quartas e Sextas · 07h, 12h, 19h e 20h30',
    intensidade: 'Extrema',
    equipamentos_necessarios: ['Luvas de 14oz/16oz', 'Caneleiras com proteção de peito de pé', 'Bandagens'],
    imagem: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    treinador: 'Kru Alex Ferreira',
    ativo: true,
    ordem: 2,
  },
  {
    id: 'mma',
    titulo: 'MMA (Artes Marciais Mistas)',
    subtitulo: 'A fusão completa de striking, quedas e solo.',
    categoria: 'Mixed Martial Arts',
    descricao:
      'Integração de boxe, kickboxing, wrestling e jiu-jitsu. Aprenda a transição perfeita da luta em pé para as grades do octógono e finalizações no chão.',
    beneficios: [
      'Adaptação total a qualquer situação de combate',
      'Força funcional isométrica e resistência',
      'Entendimento tático de distâncias',
      'Treinamento com atletas profissionais',
    ],
    resumo_horarios: 'Terças e Quintas (20h) · Sábados Sparring (10h)',
    intensidade: 'Extrema',
    equipamentos_necessarios: ['Luvas de MMA 7oz/sparring', 'Caneleiras', 'Protetor bucal duplo e coquilha'],
    imagem: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=800&q=80',
    treinador: 'Mestre Rogério Barros',
    ativo: true,
    ordem: 3,
  },
  {
    id: 'jiu-jitsu',
    titulo: 'Brazilian Jiu-Jitsu (BJJ)',
    subtitulo: 'A arte suave onde a técnica supera a força bruta.',
    categoria: 'Grappling',
    descricao:
      'Aulas com quimono (Gi) e sem quimono (No-Gi). Foco na biomecânica de alavancas, raspagens, passagens de guarda refinadas e submissões com segurança para todas as idades.',
    beneficios: [
      'Capacidade de defesa no chão contra oponentes mais pesados',
      'Mobilidade articular e flexibilidade',
      'Resolução de problemas sob pressão extrema',
      'Respeito e irmandade no tatame',
    ],
    resumo_horarios: 'Diariamente (06h30, 11h30, 18h e 19h30)',
    intensidade: 'Alta',
    equipamentos_necessarios: ['Quimono trançado (Aulas Gi)', 'Rashguard e bermuda de lycra (No-Gi)'],
    imagem: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
    treinador: 'Mestre Hélio Silveira & Renata Mendes',
    ativo: true,
    ordem: 4,
  },
  {
    id: 'conditioning',
    titulo: 'Preparação Física & Conditioning',
    subtitulo: 'Potência, cardio de alta octanagem e resistência.',
    categoria: 'Fitness',
    descricao:
      'Circuito funcional projetado especificamente para esportes de combate: marreta no pneu, kettlebells, cordas navais, sacos pesados e esteiras com inclinação.',
    beneficios: [
      'Aumento drástico do VO2 Max e gás no round',
      'Gordura corporal reduzida e massa magra',
      'Prevenção de lesões articulares e ligamentares',
    ],
    resumo_horarios: 'Segunda a Sexta · 08h, 17h e 18h30',
    intensidade: 'Alta',
    equipamentos_necessarios: ['Tênis de treino estável', 'Toalha e garrafa d’água'],
    imagem: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    treinador: 'Preparador Físico Felipe Diniz',
    ativo: true,
    ordem: 5,
  },
  {
    id: 'feminino-iniciantes',
    titulo: 'Boxe Feminino & Turmas Iniciantes',
    subtitulo: 'Ambiente acolhedor, técnica pura e empoderamento.',
    categoria: 'Iniciantes / Feminino',
    descricao:
      'Ambiente seguro e motivador para quem nunca calçou uma luva na vida. Sem sparring violento, com foco total no aprendizado pedagógico, postura e perda calórica.',
    beneficios: [
      'Ambiente 100% amigável e sem intimidação',
      'Aulas dinâmicas e energizantes',
      'Defesa pessoal prática e postura firme',
    ],
    resumo_horarios: 'Seg, Qua e Sex · 09h, 16h e 19h',
    intensidade: 'Moderada',
    equipamentos_necessarios: ['Luvas de 12oz/14oz e bandagens'],
    imagem: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    treinador: 'Amanda Rocha & Equipe Feminina',
    ativo: true,
    ordem: 6,
  },
];

/**
 * Semeia as modalidades iniciais no Firestore se a coleção estiver vazia.
 */
export async function seedInitialModalitiesToFirestore(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  for (const item of INITIAL_MODALITIES) {
    const docRef = doc(db, COLLECTION_NAME, item.id);
    batch.set(docRef, {
      ...item,
      criado_em: now,
      atualizado_em: now,
    });
  }

  await batch.commit();
}

/**
 * Escuta alterações em tempo real na coleção 'modalidades' do Firestore.
 * Se estiver vazia, auto-semeia as modalidades oficiais.
 */
export function subscribeToModalities(
  onData: (modalities: ModalidadeTreino[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!isFirebaseConfigured || !db) {
    onData([]);
    return () => {};
  }

  try {
    const q = query(collection(db, COLLECTION_NAME));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // Auto-seed se o banco estiver vazio
          seedInitialModalitiesToFirestore().catch((e) =>
            console.warn('Auto-seed de modalidades:', e)
          );
          onData(INITIAL_MODALITIES);
          return;
        }

        const items: ModalidadeTreino[] = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ModalidadeTreino, 'id'>),
          });
        });

        // Ordena por ordem ou título
        items.sort((a, b) => (a.ordem || 99) - (b.ordem || 99));
        onData(items);
      },
      (error) => {
        console.warn('Erro ao escutar modalidades no Firebase:', error);
        if (onError) onError(error);
        onData([]);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.warn('Falha ao inicializar listener de modalidades:', err);
    onData([]);
    return () => {};
  }
}

/**
 * Busca todas as modalidades cadastradas no Firestore (leitura única).
 */
export async function getModalitiesFromFirestore(): Promise<ModalidadeTreino[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await seedInitialModalitiesToFirestore();
      return INITIAL_MODALITIES;
    }
    const items: ModalidadeTreino[] = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ModalidadeTreino, 'id'>),
      });
    });
    items.sort((a, b) => (a.ordem || 99) - (b.ordem || 99));
    return items;
  } catch (error) {
    console.warn('Erro ao buscar modalidades no Firestore:', error);
    return [];
  }
}

/**
 * Cria ou atualiza uma modalidade no Firestore.
 */
export async function saveModalityToFirestore(
  modality: ModalidadeTreino
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado.');
    return;
  }

  const cleanId = modality.id || `mod-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, cleanId);

  const payload = {
    ...modality,
    id: cleanId,
    atualizado_em: new Date().toISOString(),
  };

  await setDoc(docRef, payload, { merge: true });
}

/**
 * Remove uma modalidade do Firestore.
 */
export async function deleteModalityFromFirestore(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado.');
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}


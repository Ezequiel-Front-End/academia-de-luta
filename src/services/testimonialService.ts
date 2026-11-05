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
import { DepoimentoAluno } from '../types/database';

const COLLECTION_NAME = 'depoimentos';

export const INITIAL_TESTIMONIALS: DepoimentoAluno[] = [
  {
    id: 'depoimento-carlos-eduardo',
    nome: 'Carlos Eduardo Santos',
    cargo_modalidade: 'Aluno de Boxe há 2 anos · Empresário',
    destaque: '-18KG EM 9 MESES E FOCO INABALÁVEL',
    depoimento: 'A BBT mudou completamente a minha rotina e saúde mental. Cheguei pesando 96kg, sem fôlego para subir escadas. Hoje perdi 18kg, tenho a disciplina de um atleta e a energia lá em cima. Os professores te tratam como família desde o primeiro minuto.',
    avaliacao: 5,
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    ativo: true,
    ordem: 1,
  },
  {
    id: 'depoimento-mariana-azevedo',
    nome: 'Mariana Azevedo',
    cargo_modalidade: 'Aluna de Muay Thai & BJJ · Arquiteta',
    destaque: 'AMBIENTE ACOLHEDOR E RESPEITO MÁXIMO',
    depoimento: 'Tinha medo de academias de luta porque achava o ambiente intimidador. Aqui na BBT é totalmente o oposto: respeito absoluto, espaço limpo e acolhedor para mulheres. Ver os atletas profissionais treinando no mesmo espaço é uma inspiração inacreditável.',
    avaliacao: 5,
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    ativo: true,
    ordem: 2,
  },
  {
    id: 'depoimento-rodrigo-medeiros',
    nome: 'Rodrigo Medeiros',
    cargo_modalidade: 'Atleta Amador de MMA · Estudante de Ed. Física',
    destaque: 'NÍVEL TÉCNICO DOS ATLETAS É ABSURDO',
    depoimento: 'Se você quer competir de verdade ou treinar no nível mais alto do estado, não existe outro lugar em São Paulo. O camp dos atletas é de nível internacional. O Mestre Rogério e o Marcos não ensinam só golpes, ensinam caráter de guerreiro.',
    avaliacao: 5,
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    ativo: true,
    ordem: 3,
  },
];

/**
 * Escuta alterações em tempo real na coleção de depoimentos do Firestore.
 * Consome EXCLUSIVAMENTE o Firebase Cloud Firestore.
 */
export function subscribeToTestimonials(
  onData: (testimonials: DepoimentoAluno[]) => void,
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
          onData([]);
          return;
        }

        const items: DepoimentoAluno[] = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<DepoimentoAluno, 'id'>),
          });
        });
        // Ordena por ordem crescente
        items.sort((a, b) => (a.ordem || 99) - (b.ordem || 99));
        onData(items);
      },
      (error) => {
        console.warn('Erro ao escutar depoimentos no Firebase:', error);
        if (onError) onError(error);
        onData([]);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.warn('Falha ao inicializar listener de depoimentos:', err);
    onData([]);
    return () => {};
  }
}

/**
 * Busca todos os depoimentos cadastrados no Firestore (leitura única).
 * Consome EXCLUSIVAMENTE o Firebase.
 */
export async function getTestimonialsFromFirestore(): Promise<DepoimentoAluno[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [];
    }
    const items: DepoimentoAluno[] = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<DepoimentoAluno, 'id'>),
      });
    });
    items.sort((a, b) => (a.ordem || 99) - (b.ordem || 99));
    return items;
  } catch (error) {
    console.warn('Erro ao buscar depoimentos no Firestore:', error);
    return [];
  }
}

/**
 * Cria ou atualiza um depoimento no Firestore.
 */
export async function saveTestimonialToFirestore(
  testimonial: DepoimentoAluno
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado para gravação.');
    return;
  }

  const cleanId = testimonial.id || `depoimento-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, cleanId);

  const payload = {
    ...testimonial,
    id: cleanId,
    atualizado_em: new Date().toISOString(),
  };

  await setDoc(docRef, payload, { merge: true });
}

/**
 * Exclui um depoimento do Firestore pelo ID.
 */
export async function deleteTestimonialFromFirestore(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado.');
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Semeia os 3 depoimentos oficiais da imagem de referência no Firestore.
 */
export async function seedInitialTestimonialsToFirestore(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  for (const item of INITIAL_TESTIMONIALS) {
    const docRef = doc(db, COLLECTION_NAME, item.id);
    batch.set(docRef, {
      ...item,
      criado_em: now,
      atualizado_em: now,
    });
  }

  await batch.commit();
}

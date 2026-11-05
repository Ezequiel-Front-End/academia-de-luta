import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { GradeHorarioTreino } from '../types/database';
import { WEEKLY_SCHEDULE } from '../data/gymData';
import { mapScheduleItemToGrade } from './mappers';

const COLLECTION_NAME = 'grade_horarios';

/**
 * Escuta alterações em tempo real na coleção de horários do Firestore.
 * Retorna a função de unsubscribe.
 */
export function subscribeToSchedules(
  onData: (schedules: GradeHorarioTreino[]) => void,
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

        const items: GradeHorarioTreino[] = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<GradeHorarioTreino, 'id'>),
          });
        });
        // Ordena cronologicamente por horário
        items.sort((a, b) => a.horario.localeCompare(b.horario));
        onData(items);
      },
      (error) => {
        console.warn('Erro ao escutar horários no Firebase:', error);
        if (onError) onError(error);
        onData([]);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.warn('Falha ao inicializar listener de horários:', err);
    onData([]);
    return () => {};
  }
}

/**
 * Busca todos os horários cadastrados no Firestore (uma única leitura).
 */
export async function getSchedulesFromFirestore(): Promise<GradeHorarioTreino[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [];
    }
    const items: GradeHorarioTreino[] = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<GradeHorarioTreino, 'id'>),
      });
    });
    items.sort((a, b) => a.horario.localeCompare(b.horario));
    return items;
  } catch (error) {
    console.warn('Erro ao buscar horários no Firestore:', error);
    return [];
  }
}

/**
 * Cria ou atualiza um horário de treino no Firestore.
 */
export async function saveScheduleToFirestore(
  schedule: GradeHorarioTreino
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado para gravação.');
    return;
  }

  const docId = schedule.id || `horario-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, docId);
  const dataToSave = {
    dia_semana: schedule.dia_semana,
    horario: schedule.horario,
    modalidade: schedule.modalidade,
    nivel: schedule.nivel,
    treinador: schedule.treinador,
    sala: schedule.sala,
    ativo: true,
    atualizado_em: new Date().toISOString(),
  };

  await setDoc(docRef, dataToSave, { merge: true });
}

/**
 * Remove um horário de treino do Firestore pelo ID.
 */
export async function deleteScheduleFromFirestore(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado para exclusão.');
    return;
  }
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Popula/Semeia os horários padrão da academia no Firebase caso a coleção esteja vazia.
 */
export async function seedDefaultSchedulesToFirestore(): Promise<number> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase não está configurado.');
  }

  const batch = writeBatch(db);
  const defaultItems = WEEKLY_SCHEDULE.map(mapScheduleItemToGrade);

  defaultItems.forEach((item) => {
    const docRef = doc(db, COLLECTION_NAME, item.id);
    const now = new Date().toISOString();
    batch.set(docRef, {
      dia_semana: item.dia_semana,
      horario: item.horario,
      modalidade: item.modalidade,
      nivel: item.nivel,
      treinador: item.treinador,
      sala: item.sala,
      ativo: true,
      criado_em: now,
      atualizado_em: now,
    });
  });

  await batch.commit();
  return defaultItems.length;
}


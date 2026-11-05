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
import { ParceiroPatrocinador } from '../types/database';

const COLLECTION_NAME = 'parceiros';

export const INITIAL_PARTNERS: ParceiroPatrocinador[] = [
  {
    id: 'parceiro-js-bucais',
    nome: 'JS Bucais',
    nome_completo: 'JS Protetores Bucais',
    logo: '/JS-Bucais.jpeg',
    descricao:
      'A JS Protetores Bucais é a nossa fornecedora oficial de equipamentos de proteção odontológica para esportes de contato. Qualidade inigualável e sob medida para garantir a segurança absoluta dos nossos atletas, do treino ao nocaute.',
    link: '#',
    cor_tema: 'neutro',
    ativo: true,
    ordem: 1,
  },
];

/**
 * Semeia os parceiros padrão se a coleção estiver vazia ou inexistente.
 */
export async function seedInitialPartnersToFirestore(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  for (const item of INITIAL_PARTNERS) {
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
 * Escuta alterações em tempo real na coleção 'parceiros' do Firestore.
 * Se a coleção estiver vazia, aciona a auto-criação com os registros padrão.
 */
export function subscribeToPartners(
  onData: (partners: ParceiroPatrocinador[]) => void,
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
          // Auto-seed se o banco ainda não tiver documentos
          seedInitialPartnersToFirestore().catch((e) =>
            console.warn('Auto-seed de parceiros:', e)
          );
          onData(INITIAL_PARTNERS);
          return;
        }

        const items: ParceiroPatrocinador[] = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ParceiroPatrocinador, 'id'>),
          });
        });

        // Ordena por ordem de exibição
        items.sort((a, b) => (a.ordem || 99) - (b.ordem || 99));
        onData(items);
      },
      (error) => {
        console.warn('Erro ao escutar parceiros no Firebase:', error);
        if (onError) onError(error);
        onData([]);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.warn('Falha ao inicializar listener de parceiros:', err);
    onData([]);
    return () => {};
  }
}

/**
 * Busca todos os parceiros no Firestore.
 */
export async function getPartnersFromFirestore(): Promise<ParceiroPatrocinador[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await seedInitialPartnersToFirestore();
      return INITIAL_PARTNERS;
    }
    const items: ParceiroPatrocinador[] = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ParceiroPatrocinador, 'id'>),
      });
    });
    items.sort((a, b) => (a.ordem || 99) - (b.ordem || 99));
    return items;
  } catch (error) {
    console.warn('Erro ao buscar parceiros no Firestore:', error);
    return [];
  }
}

/**
 * Cria ou atualiza um parceiro no Firestore.
 */
export async function savePartnerToFirestore(
  partner: ParceiroPatrocinador
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado.');
    return;
  }

  const cleanId = partner.id || `parceiro-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, cleanId);

  const payload = {
    ...partner,
    id: cleanId,
    atualizado_em: new Date().toISOString(),
  };

  await setDoc(docRef, payload, { merge: true });
}

/**
 * Remove um parceiro do Firestore.
 */
export async function deletePartnerFromFirestore(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado.');
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}


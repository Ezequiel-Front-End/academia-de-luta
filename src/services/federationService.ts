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
import { FederacaoEntidade } from '../types/database';

const COLLECTION_NAME = 'federacoes';

export const INITIAL_FEDERATIONS: FederacaoEntidade[] = [
  {
    id: 'fed-fmt-sp',
    nome: 'FMT-SP',
    nome_completo: 'Federação de Muaythai Tradicional',
    logo: '/FMTSP-oficial.png',
    descricao:
      'Entidade máxima de regulamentação do Muay Thai tradicional no estado de São Paulo. Nossa parceria de longa data garante que todas as nossas graduações (prajieds) sejam oficiais e reconhecidas. Nossos atletas têm acesso prioritário aos maiores campeonatos estaduais e seletivas nacionais chanceladas pela FMT-SP.',
    link: '#',
    cor_tema: 'vermelho',
    ativo: true,
    ordem: 1,
  },
  {
    id: 'fed-wako',
    nome: 'WAKO',
    nome_completo: 'World Association of Kickboxing Organizations',
    logo: '/WACO-PNG.png',
    descricao:
      'A maior e mais respeitada organização de Kickboxing do mundo, reconhecida pelo Comitê Olímpico Internacional (COI). Através dessa chancela de prestígio, nossos lutadores têm o caminho aberto para disputar títulos mundiais, pan-americanos e defender a seleção no exterior.',
    link: '#',
    cor_tema: 'azul',
    ativo: true,
    ordem: 2,
  },
  {
    id: 'fed-cbkb',
    nome: 'C.B.K.B',
    nome_completo: 'Confederação Brasileira de Kickboxing',
    logo: '/CBKB.png',
    descricao:
      'Órgão responsável pela organização, regulamentação e fomento do Kickboxing em todo o território nacional. Sendo uma academia filiada oficial, garantimos aos nossos alunos a participação integral no calendário esportivo brasileiro, do nível amador ao profissional absoluto.',
    link: '#',
    cor_tema: 'verde',
    ativo: true,
    ordem: 3,
  },
];

/**
 * Semeia as federações padrão se a coleção estiver vazia ou inexistente.
 */
export async function seedInitialFederationsToFirestore(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  for (const item of INITIAL_FEDERATIONS) {
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
 * Escuta alterações em tempo real na coleção 'federacoes' do Firestore.
 * Se a coleção estiver vazia, aciona a auto-criação com os registros padrão.
 */
export function subscribeToFederations(
  onData: (federations: FederacaoEntidade[]) => void,
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
          seedInitialFederationsToFirestore().catch((e) =>
            console.warn('Auto-seed de federações:', e)
          );
          onData(INITIAL_FEDERATIONS);
          return;
        }

        const items: FederacaoEntidade[] = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<FederacaoEntidade, 'id'>),
          });
        });

        // Ordena por ordem de exibição
        items.sort((a, b) => (a.ordem || 99) - (b.ordem || 99));
        onData(items);
      },
      (error) => {
        console.warn('Erro ao escutar federações no Firebase:', error);
        if (onError) onError(error);
        onData([]);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.warn('Falha ao inicializar listener de federações:', err);
    onData([]);
    return () => {};
  }
}

/**
 * Busca todas as federações no Firestore.
 */
export async function getFederationsFromFirestore(): Promise<FederacaoEntidade[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await seedInitialFederationsToFirestore();
      return INITIAL_FEDERATIONS;
    }
    const items: FederacaoEntidade[] = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<FederacaoEntidade, 'id'>),
      });
    });
    items.sort((a, b) => (a.ordem || 99) - (b.ordem || 99));
    return items;
  } catch (error) {
    console.warn('Erro ao buscar federações no Firestore:', error);
    return [];
  }
}

/**
 * Cria ou atualiza uma federação no Firestore.
 */
export async function saveFederationToFirestore(
  federation: FederacaoEntidade
): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado.');
    return;
  }

  const cleanId = federation.id || `fed-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, cleanId);

  const payload = {
    ...federation,
    id: cleanId,
    atualizado_em: new Date().toISOString(),
  };

  await setDoc(docRef, payload, { merge: true });
}

/**
 * Remove uma federação do Firestore.
 */
export async function deleteFederationFromFirestore(id: string): Promise<void> {
  if (!isFirebaseConfigured || !db) {
    console.warn('Firebase não configurado.');
    return;
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}


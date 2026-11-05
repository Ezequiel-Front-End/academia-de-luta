import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch, collection, getDocs } from 'firebase/firestore';
import { INITIAL_MODALITIES } from '../src/services/modalityService';

const firebaseConfig = {
  apiKey: "AIzaSyAgFTNOMKWbX8qFhxLaqzAg8K2Aw5fg2_k",
  authDomain: "bbt-academia.firebaseapp.com",
  projectId: "bbt-academia",
  storageBucket: "bbt-academia.firebasestorage.app",
  messagingSenderId: "349962831282",
  appId: "1:349962831282:web:412b960776c2e7e46610ab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('=== SEEDING FIRESTORE: MODALIDADES ===');
  
  const modalitiesCol = collection(db, 'modalidades');
  const existingSnap = await getDocs(modalitiesCol);
  console.log(`Documentos existentes em 'modalidades': ${existingSnap.size}`);

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  INITIAL_MODALITIES.forEach((mod) => {
    const docRef = doc(db, 'modalidades', mod.id);
    batch.set(docRef, {
      ...mod,
      ativo: mod.ativo !== false,
      criado_em: mod.criado_em || now,
      atualizado_em: now,
    }, { merge: true });
    console.log(`+ Adicionando modalidade: [${mod.id}] ${mod.titulo}`);
  });

  await batch.commit();
  console.log('✅ 6 Modalidades gravadas com sucesso no Cloud Firestore!');

  const finalSnap = await getDocs(modalitiesCol);
  console.log(`Total final de modalidades no Firestore: ${finalSnap.size}`);
}

seed().catch((err) => {
  console.error('Erro ao semear modalidades:', err);
  process.exit(1);
});


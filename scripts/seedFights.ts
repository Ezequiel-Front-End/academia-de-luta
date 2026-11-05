import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch, collection, getDocs } from 'firebase/firestore';
import { INITIAL_FIGHTS } from '../src/services/fightService';

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
  console.log('=== SEEDING FIRESTORE: LUTAS AGENDADAS ===');
  
  const fightsCol = collection(db, 'lutas_agendadas');
  const existingSnap = await getDocs(fightsCol);
  console.log(`Documentos existentes em 'lutas_agendadas': ${existingSnap.size}`);

  const batch = writeBatch(db);
  const now = new Date().toISOString();

  INITIAL_FIGHTS.forEach((fight) => {
    const docRef = doc(db, 'lutas_agendadas', fight.id);
    batch.set(docRef, {
      ...fight,
      ativo: fight.ativo !== false,
      criado_em: fight.criado_em || now,
      atualizado_em: now,
    }, { merge: true });
    console.log(`+ Adicionando combate: [${fight.id}] ${fight.evento} (${fight.nome_lutador} vs ${fight.nome_oponente})`);
  });

  await batch.commit();
  console.log('✅ 4 Combates agendados gravados com sucesso no Cloud Firestore!');

  const finalSnap = await getDocs(fightsCol);
  console.log(`Total final de combates agendados no Firestore: ${finalSnap.size}`);
}

seed().catch((err) => {
  console.error('Erro ao semear combates agendados:', err);
  process.exit(1);
});

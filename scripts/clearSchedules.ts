import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';

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

async function clearSchedules() {
  console.log('>>> Buscando documentos na coleção grade_horarios para zerar...');
  const snapshot = await getDocs(collection(db, 'grade_horarios'));

  if (snapshot.empty) {
    console.log('>>> A coleção grade_horarios já está completamente vazia (0 documentos).');
    process.exit(0);
  }

  console.log(`>>> Excluindo ${snapshot.size} documentos da coleção grade_horarios...`);
  const batch = writeBatch(db);
  snapshot.forEach((docSnap) => {
    batch.delete(doc(db, 'grade_horarios', docSnap.id));
  });

  await batch.commit();
  console.log('>>> Sucesso: Coleção grade_horarios foi totalmente zerada!');

  // Verificação final
  const verifySnap = await getDocs(collection(db, 'grade_horarios'));
  console.log(`>>> Confirmação: ${verifySnap.size} documentos restantes no Firestore.`);
  process.exit(0);
}

clearSchedules().catch((err) => {
  console.error('Erro ao zerar base de dados:', err);
  process.exit(1);
});


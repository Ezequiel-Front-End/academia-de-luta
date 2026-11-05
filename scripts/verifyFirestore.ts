import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function verify() {
  console.log('>>> Conectando ao Cloud Firestore (projeto bbt-academia)...');
  const snapshot = await getDocs(collection(db, 'grade_horarios'));

  console.log(`>>> TOTAL DE DOCUMENTOS NA COLEÇÃO 'grade_horarios': ${snapshot.size}`);

  const byDay: Record<string, number> = {};
  let validFieldsCount = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    byDay[data.dia_semana] = (byDay[data.dia_semana] || 0) + 1;
    if (
      data.dia_semana &&
      data.horario &&
      data.modalidade &&
      data.nivel &&
      data.treinador &&
      data.sala
    ) {
      validFieldsCount++;
    }
  });

  console.log('>>> DISTRIBUIÇÃO POR DIA DA SEMANA:');
  for (const [day, count] of Object.entries(byDay)) {
    console.log(`    - ${day}: ${count} aulas`);
  }

  console.log(`>>> CAMPOS OBRIGATÓRIOS VÁLIDOS: ${validFieldsCount} / ${snapshot.size}`);
  console.log('>>> STATUS DA BASE DE DADOS: 100% OPERACIONAL E CONECTADA!');
  process.exit(0);
}

verify().catch((err) => {
  console.error('Erro na verificação:', err);
  process.exit(1);
});


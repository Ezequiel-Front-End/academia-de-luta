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

async function check() {
  console.log('=== VERIFICANDO FIRESTORE: bbt-academia ===');
  
  // 1. Grade Horarios
  const schedSnap = await getDocs(collection(db, 'grade_horarios'));
  console.log(`\nColeção 'grade_horarios': ${schedSnap.size} documento(s)`);
  schedSnap.forEach((doc) => {
    const data = doc.data();
    console.log(`- [${doc.id}] ${data.dia_semana} | ${data.horario} | ${data.modalidade}`);
  });

  // 2. Depoimentos
  const depSnap = await getDocs(collection(db, 'depoimentos'));
  console.log(`\nColeção 'depoimentos': ${depSnap.size} documento(s)`);
  depSnap.forEach((doc) => {
    const data = doc.data();
    console.log(`- [${doc.id}] ${data.nome} | "${data.destaque}" | ⭐ ${data.avaliacao}`);
  });

  // 3. Federações
  const fedSnap = await getDocs(collection(db, 'federacoes'));
  console.log(`\nColeção 'federacoes': ${fedSnap.size} documento(s)`);
  fedSnap.forEach((doc) => {
    const data = doc.data();
    console.log(`- [${doc.id}] ${data.nome} (${data.nome_completo})`);
  });

  // 4. Parceiros
  const partSnap = await getDocs(collection(db, 'parceiros'));
  console.log(`\nColeção 'parceiros': ${partSnap.size} documento(s)`);
  partSnap.forEach((doc) => {
    const data = doc.data();
    console.log(`- [${doc.id}] ${data.nome} (${data.nome_completo})`);
  });

  // 5. Modalidades
  const modSnap = await getDocs(collection(db, 'modalidades'));
  console.log(`\nColeção 'modalidades': ${modSnap.size} documento(s)`);
  modSnap.forEach((doc) => {
    const data = doc.data();
    console.log(`- [${doc.id}] ${data.titulo} | Categoria: ${data.categoria} | Intensidade: ${data.intensidade}`);
  });

  // 6. Lutas Agendadas
  const fightSnap = await getDocs(collection(db, 'lutas_agendadas'));
  console.log(`\nColeção 'lutas_agendadas': ${fightSnap.size} documento(s)`);
  fightSnap.forEach((doc) => {
    const data = doc.data();
    console.log(`- [${doc.id}] ${data.evento} | ${data.nome_lutador} vs ${data.nome_oponente} | ${data.data} ${data.horario} (${data.status})`);
  });
}

check().then(() => {
  console.log('\n=== TODAS AS 6 COLEÇÕES VERIFICADAS COM SUCESSO ===');
  process.exit(0);
}).catch((err) => {
  console.error('Erro ao verificar Firestore:', err);
  process.exit(1);
});

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch, collection, getDocs } from 'firebase/firestore';

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

const INITIAL_FEDERATIONS = [
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

const INITIAL_PARTNERS = [
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

async function seed() {
  console.log('=== SEMEANDO FEDERAÇÕES E PARCEIROS NO FIRESTORE ===');
  const now = new Date().toISOString();
  const batch = writeBatch(db);

  // 1. Federações
  console.log(`> Preparando ${INITIAL_FEDERATIONS.length} federações...`);
  for (const item of INITIAL_FEDERATIONS) {
    const docRef = doc(db, 'federacoes', item.id);
    batch.set(docRef, {
      ...item,
      criado_em: now,
      atualizado_em: now,
    });
  }

  // 2. Parceiros
  console.log(`> Preparando ${INITIAL_PARTNERS.length} parceiros...`);
  for (const item of INITIAL_PARTNERS) {
    const docRef = doc(db, 'parceiros', item.id);
    batch.set(docRef, {
      ...item,
      criado_em: now,
      atualizado_em: now,
    });
  }

  console.log('> Gravando batch no Firestore...');
  await batch.commit();
  console.log('>>> Sucesso: Gravação finalizada!');

  // Verificação
  const fedSnap = await getDocs(collection(db, 'federacoes'));
  console.log(`\nColeção 'federacoes': ${fedSnap.size} documento(s)`);
  fedSnap.forEach((d) => console.log(`  - [${d.id}] ${d.data().nome} (${d.data().nome_completo})`));

  const partSnap = await getDocs(collection(db, 'parceiros'));
  console.log(`\nColeção 'parceiros': ${partSnap.size} documento(s)`);
  partSnap.forEach((d) => console.log(`  - [${d.id}] ${d.data().nome} (${d.data().nome_completo})`));

  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro ao semear:', err);
  process.exit(1);
});


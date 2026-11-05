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

const INITIAL_TESTIMONIALS = [
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

async function seed() {
  console.log('>>> Gravando depoimentos na coleção "depoimentos" do Firebase Cloud Firestore...');
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  for (const item of INITIAL_TESTIMONIALS) {
    const docRef = doc(db, 'depoimentos', item.id);
    batch.set(docRef, {
      ...item,
      criado_em: now,
      atualizado_em: now,
    });
  }

  await batch.commit();
  console.log(`>>> Sucesso: ${INITIAL_TESTIMONIALS.length} depoimentos cadastrados no Firebase!`);

  const snapshot = await getDocs(collection(db, 'depoimentos'));
  console.log(`>>> Verificação: ${snapshot.size} depoimentos encontrados na coleção.`);
  snapshot.forEach((doc) => {
    const d = doc.data();
    console.log(`  - [⭐ ${d.avaliacao}] ${d.nome} (${d.cargo_modalidade}): "${d.destaque}"`);
  });

  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro ao semear depoimentos:', err);
  process.exit(1);
});


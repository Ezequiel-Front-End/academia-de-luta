import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch, collection, getDocs } from 'firebase/firestore';

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

const INITIAL_SCHEDULES = [
  // Segunda-feira
  {
    id: 'seg-boxe-0630',
    dia_semana: 'Segunda',
    horario: '06:30 - 07:30',
    modalidade: 'Boxe Olímpico & Condicionamento',
    nivel: 'Todos os Níveis',
    treinador: 'Prof. Marcos Valente',
    sala: 'Ringue Principal',
    ativo: true,
  },
  {
    id: 'seg-bjj-0730',
    dia_semana: 'Segunda',
    horario: '07:30 - 08:45',
    modalidade: 'Jiu-Jitsu Brasileiro (Gi)',
    nivel: 'Iniciante / Intermediário',
    treinador: 'Renata Mendes',
    sala: 'Tatame 1',
    ativo: true,
  },
  {
    id: 'seg-muaythai-1200',
    dia_semana: 'Segunda',
    horario: '12:00 - 13:00',
    modalidade: 'Muay Thai Tradicional (Almoço)',
    nivel: 'Todos os Níveis',
    treinador: 'Kru Alex Ferreira',
    sala: 'Área de Sacos',
    ativo: true,
  },
  {
    id: 'seg-boxe-fem-1800',
    dia_semana: 'Segunda',
    horario: '18:00 - 19:15',
    modalidade: 'Boxe Feminino & Fitness',
    nivel: 'Iniciante',
    treinador: 'Amanda Rocha',
    sala: 'Ringue Principal',
    ativo: true,
  },
  {
    id: 'seg-mma-1930',
    dia_semana: 'Segunda',
    horario: '19:30 - 20:45',
    modalidade: 'MMA Profissional & Sparring Técnico',
    nivel: 'Avançado / Competição',
    treinador: 'Mestre Rogério Barros',
    sala: 'Octógono Oficial',
    ativo: true,
  },

  // Terça-feira
  {
    id: 'ter-muaythai-0700',
    dia_semana: 'Terça',
    horario: '07:00 - 08:15',
    modalidade: 'Muay Thai (Striking & Clinch)',
    nivel: 'Todos os Níveis',
    treinador: 'Bruno "Martelo"',
    sala: 'Área de Sacos',
    ativo: true,
  },
  {
    id: 'ter-bjj-1200',
    dia_semana: 'Terça',
    horario: '12:00 - 13:00',
    modalidade: 'Jiu-Jitsu No-Gi (Submission)',
    nivel: 'Intermediário / Avançado',
    treinador: 'Mestre Hélio Silveira',
    sala: 'Tatame 1',
    ativo: true,
  },
  {
    id: 'ter-prep-1830',
    dia_semana: 'Terça',
    horario: '18:30 - 19:30',
    modalidade: 'Preparação Física do Lutador',
    nivel: 'Todos os Níveis',
    treinador: 'Felipe Diniz',
    sala: 'Studio Funcional',
    ativo: true,
  },
  {
    id: 'ter-boxe-1930',
    dia_semana: 'Terça',
    horario: '19:30 - 21:00',
    modalidade: 'Boxe Avançado & Estratégia de Combate',
    nivel: 'Avançado / Competição',
    treinador: 'Prof. Marcos Valente',
    sala: 'Ringue Principal',
    ativo: true,
  },

  // Quarta-feira
  {
    id: 'qua-boxe-0630',
    dia_semana: 'Quarta',
    horario: '06:30 - 07:30',
    modalidade: 'Boxe Olímpico Matinal',
    nivel: 'Todos os Níveis',
    treinador: 'Prof. Marcos Valente',
    sala: 'Ringue Principal',
    ativo: true,
  },
  {
    id: 'qua-boxe-fem-0900',
    dia_semana: 'Quarta',
    horario: '09:00 - 10:15',
    modalidade: 'Boxe Feminino & Autodefesa',
    nivel: 'Iniciante',
    treinador: 'Amanda Rocha',
    sala: 'Ringue Principal',
    ativo: true,
  },
  {
    id: 'qua-muaythai-1200',
    dia_semana: 'Quarta',
    horario: '12:00 - 13:00',
    modalidade: 'Muay Thai - Combinações Tailandesas',
    nivel: 'Todos os Níveis',
    treinador: 'Kru Alex Ferreira',
    sala: 'Área de Sacos',
    ativo: true,
  },
  {
    id: 'qua-bjj-1900',
    dia_semana: 'Quarta',
    horario: '19:00 - 20:15',
    modalidade: 'Jiu-Jitsu Brasileiro (Gi)',
    nivel: 'Todos os Níveis',
    treinador: 'Renata Mendes',
    sala: 'Tatame 1',
    ativo: true,
  },
  {
    id: 'qua-tatico-2030',
    dia_semana: 'Quarta',
    horario: '20:30 - 22:00',
    modalidade: 'Treino Tático dos Atletas Oficiais',
    nivel: 'Avançado / Competição',
    treinador: 'Equipe de Mestres',
    sala: 'Octógono Oficial',
    ativo: true,
  },

  // Quinta-feira
  {
    id: 'qui-muaythai-0700',
    dia_semana: 'Quinta',
    horario: '07:00 - 08:15',
    modalidade: 'Muay Thai Potência & Esquivas',
    nivel: 'Todos os Níveis',
    treinador: 'Kru Alex Ferreira',
    sala: 'Área de Sacos',
    ativo: true,
  },
  {
    id: 'qui-boxe-1200',
    dia_semana: 'Quinta',
    horario: '12:00 - 13:00',
    modalidade: 'Boxe Funcional',
    nivel: 'Todos os Níveis',
    treinador: 'Prof. Marcos Valente',
    sala: 'Ringue Principal',
    ativo: true,
  },
  {
    id: 'qui-wrestling-1830',
    dia_semana: 'Quinta',
    horario: '18:30 - 19:45',
    modalidade: 'Wrestling Aplicado ao MMA',
    nivel: 'Intermediário / Avançado',
    treinador: 'Gabriel "Fênix"',
    sala: 'Tatame 1',
    ativo: true,
  },
  {
    id: 'qui-boxe-2000',
    dia_semana: 'Quinta',
    horario: '20:00 - 21:15',
    modalidade: 'Boxe Pro & Sparring Controlado',
    nivel: 'Avançado / Competição',
    treinador: 'Prof. Marcos Valente',
    sala: 'Ringue Principal',
    ativo: true,
  },

  // Sexta-feira
  {
    id: 'sex-circuito-0700',
    dia_semana: 'Sexta',
    horario: '07:00 - 08:00',
    modalidade: 'Circuito Queima Intensa & Boxe',
    nivel: 'Todos os Níveis',
    treinador: 'Felipe Diniz',
    sala: 'Studio Funcional',
    ativo: true,
  },
  {
    id: 'sex-bjj-1200',
    dia_semana: 'Sexta',
    horario: '12:00 - 13:00',
    modalidade: 'Jiu-Jitsu No-Gi Drills',
    nivel: 'Todos os Níveis',
    treinador: 'Mestre Hélio Silveira',
    sala: 'Tatame 1',
    ativo: true,
  },
  {
    id: 'sex-muaythai-1800',
    dia_semana: 'Sexta',
    horario: '18:00 - 19:30',
    modalidade: 'Muay Thai Sparring e Pad Work',
    nivel: 'Intermediário / Avançado',
    treinador: 'Bruno "Martelo"',
    sala: 'Área de Sacos',
    ativo: true,
  },
  {
    id: 'sex-combate-1930',
    dia_semana: 'Sexta',
    horario: '19:30 - 21:00',
    modalidade: 'Sexta do Combate (Sessão Aberta de Luvas)',
    nivel: 'Avançado / Competição',
    treinador: 'Todos os Mestres',
    sala: 'Ringue e Octógono',
    ativo: true,
  },

  // Sábado
  {
    id: 'sab-boxe-0900',
    dia_semana: 'Sábado',
    horario: '09:00 - 10:15',
    modalidade: 'Aulão de Boxe Comunitário BBT',
    nivel: 'Iniciante / Intermediário',
    treinador: 'Prof. Marcos Valente',
    sala: 'Ringue Principal',
    ativo: true,
  },
  {
    id: 'sab-bjj-1030',
    dia_semana: 'Sábado',
    horario: '10:30 - 12:00',
    modalidade: 'Open Mat de Jiu-Jitsu (Gi & No-Gi)',
    nivel: 'Todos os Níveis',
    treinador: 'Renata Mendes',
    sala: 'Tatame 1',
    ativo: true,
  },
  {
    id: 'sab-camp-1215',
    dia_semana: 'Sábado',
    horario: '12:15 - 13:45',
    modalidade: 'Camp de Luta: Atletas com Luta Marcada',
    nivel: 'Avançado / Competição',
    treinador: 'Mestre Rogério Barros',
    sala: 'Octógono Oficial',
    ativo: true,
  },
];

async function seed() {
  console.log('Iniciando cadastro dos horários no Cloud Firestore (projeto bbt-academia)...');
  const batch = writeBatch(db);
  const now = new Date().toISOString();

  for (const item of INITIAL_SCHEDULES) {
    const docRef = doc(db, 'grade_horarios', item.id);
    batch.set(docRef, {
      ...item,
      criado_em: now,
      atualizado_em: now,
    });
  }

  await batch.commit();
  console.log(`Sucesso na gravação! ${INITIAL_SCHEDULES.length} horários cadastrados na coleção 'grade_horarios'.`);

  console.log('Verificando leitura da base de dados...');
  const querySnapshot = await getDocs(collection(db, 'grade_horarios'));
  console.log(`Verificação confirmada: ${querySnapshot.size} documentos recuperados com sucesso do Firebase!`);
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(`- [${data.dia_semana}] ${data.horario} | ${data.modalidade} (${data.treinador} - ${data.sala})`);
  });

  console.log('Finalizado com sucesso total!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro ao semear horários no Firebase:', err);
  process.exit(1);
});


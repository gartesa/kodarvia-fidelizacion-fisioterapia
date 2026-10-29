import { generatePatientCode } from '../utils/id'

// ---------------------------------------------------------------------------
// Catálogo de premios: contenido real de kinesiología deportiva, sin relleno.
// ---------------------------------------------------------------------------
export const SEED_REWARDS = [
  {
    id: 'r1',
    name: 'Evaluación de pisada',
    description: 'Análisis biomecánico de pisada en cinta trotadora con informe personalizado.',
    category: 'Evaluación',
    pointsCost: 150,
  },
  {
    id: 'r2',
    name: 'Pack de bandas elásticas',
    description: 'Set de 3 bandas elásticas de resistencia progresiva para fortalecimiento en casa.',
    category: 'Equipamiento',
    pointsCost: 180,
  },
  {
    id: 'r3',
    name: 'Kinesiotape',
    description: 'Aplicación de vendaje neuromuscular más rollo de kinesiotape de uso personal.',
    category: 'Terapia manual',
    pointsCost: 140,
  },
  {
    id: 'r4',
    name: 'Sesión de presoterapia de 30 min',
    description: 'Drenaje linfático con botas de compresión neumática para acelerar la recuperación muscular.',
    category: 'Recuperación',
    pointsCost: 220,
  },
  {
    id: 'r5',
    name: 'Masaje descontracturante post-carrera',
    description: 'Masaje de tejido profundo enfocado en piernas y espalda baja después de competencias.',
    category: 'Terapia manual',
    pointsCost: 300,
  },
  {
    id: 'r6',
    name: 'Evaluación de rango de movimiento articular',
    description: 'Medición goniométrica completa de hombro, cadera y rodilla con informe de asimetrías.',
    category: 'Evaluación',
    pointsCost: 160,
  },
  {
    id: 'r7',
    name: 'Sesión de electroestimulación muscular',
    description: 'Sesión de EMS para activación y recuperación de grandes grupos musculares.',
    category: 'Recuperación',
    pointsCost: 260,
  },
  {
    id: 'r8',
    name: 'Botella térmica Kodarvia 750 ml',
    description: 'Botella térmica de acero inoxidable con logo del centro, mantiene temperatura 12 horas.',
    category: 'Equipamiento',
    pointsCost: 120,
  },
  {
    id: 'r9',
    name: 'Clase grupal de prevención de lesiones',
    description: 'Taller práctico de 45 min sobre activación y movilidad para evitar lesiones deportivas.',
    category: 'Prevención',
    pointsCost: 170,
  },
  {
    id: 'r10',
    name: 'Sesión de dry needling (punción seca)',
    description: 'Sesión de punción seca para liberar puntos gatillo miofasciales.',
    category: 'Terapia manual',
    pointsCost: 340,
  },
]

// ---------------------------------------------------------------------------
// Pacientes ficticios realistas, con contexto deportivo de Antofagasta.
// ---------------------------------------------------------------------------
export const SEED_PATIENTS_BASE = [
  {
    id: 'p1',
    name: 'Javiera Soto Pizarro',
    email: 'javiera.soto@gmail.com',
    phone: '+56 9 6123 4455',
    sport: 'Corredora de trail',
    joinedAt: '2026-06-02T10:00:00.000Z',
  },
  {
    id: 'p2',
    name: 'Matías Contreras Vega',
    email: 'matias.contreras@gmail.com',
    phone: '+56 9 7845 1122',
    sport: 'Futbolista amateur',
    joinedAt: '2026-09-15T15:30:00.000Z',
  },
  {
    id: 'p3',
    name: 'Francisca Muñoz Rojas',
    email: 'francisca.munoz@gmail.com',
    phone: '+56 9 5566 3344',
    sport: 'Triatleta',
    joinedAt: '2025-11-03T09:15:00.000Z',
  },
  {
    id: 'p4',
    name: 'Diego Araya Fernández',
    email: 'diego.araya@gmail.com',
    phone: '+56 9 3321 8890',
    sport: 'Ciclista de ruta',
    joinedAt: '2026-10-15T11:00:00.000Z',
  },
  {
    id: 'p5',
    name: 'Camila Vergara Espinoza',
    email: 'camila.vergara@gmail.com',
    phone: '+56 9 8899 2211',
    sport: 'Basquetbolista',
    joinedAt: '2026-04-20T16:45:00.000Z',
  },
]

// id -> código QR estable (no cambia aunque se reordenen pacientes)
export const SEED_PATIENT_CODES = {
  p1: generatePatientCode(1),
  p2: generatePatientCode(2),
  p3: generatePatientCode(3),
  p4: generatePatientCode(4),
  p5: generatePatientCode(5),
}

// ---------------------------------------------------------------------------
// Historial de puntos: cada paciente nace con movimientos reales de
// acreditación (sesión) y canje (premio). El saldo final del paciente se
// deriva de este historial, nunca se hardcodea, así siempre cuadra.
// ---------------------------------------------------------------------------
const h = (patientId, date, points, description, type = 'acreditacion', by = 'admin') => ({
  patientId,
  date,
  points,
  description,
  type,
  by,
})

export const SEED_HISTORY_RAW = [
  // --- Javiera Soto Pizarro (p1) ---
  h('p1', '2026-06-02T10:05:00.000Z', 50, 'Bono de bienvenida al programa de fidelización'),
  h('p1', '2026-06-16T14:00:00.000Z', 80, 'Sesión de kinesiología deportiva'),
  h('p1', '2026-07-02T14:00:00.000Z', 80, 'Sesión de kinesiología deportiva'),
  h('p1', '2026-07-18T11:30:00.000Z', -150, 'Canje: Evaluación de pisada', 'canje', 'paciente'),
  h('p1', '2026-08-04T14:00:00.000Z', 90, 'Sesión de recuperación post-trail 42K'),
  h('p1', '2026-09-12T14:00:00.000Z', 100, 'Sesión de kinesiología deportiva'),
  h('p1', '2026-10-03T14:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p1', '2026-10-21T14:00:00.000Z', 80, 'Sesión de kinesiología deportiva'),

  // --- Matías Contreras Vega (p2) ---
  h('p2', '2026-09-15T15:35:00.000Z', 50, 'Bono de bienvenida al programa de fidelización'),
  h('p2', '2026-09-29T17:00:00.000Z', 70, 'Sesión de kinesiología deportiva'),
  h('p2', '2026-10-13T17:00:00.000Z', 60, 'Sesión de kinesiología deportiva'),

  // --- Francisca Muñoz Rojas (p3) ---
  h('p3', '2025-11-03T09:20:00.000Z', 50, 'Bono de bienvenida al programa de fidelización'),
  h('p3', '2025-12-01T09:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p3', '2025-12-22T09:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p3', '2026-01-19T09:00:00.000Z', 100, 'Sesión de recuperación post-temporada'),
  h('p3', '2026-02-16T10:30:00.000Z', -300, 'Canje: Masaje descontracturante post-carrera', 'canje', 'paciente'),
  h('p3', '2026-03-16T09:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p3', '2026-04-13T09:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p3', '2026-05-04T09:00:00.000Z', 100, 'Sesión de recuperación post-Ironman 70.3'),
  h('p3', '2026-06-01T09:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p3', '2026-07-06T09:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p3', '2026-08-03T09:00:00.000Z', 100, 'Sesión de kinesiología deportiva'),
  h('p3', '2026-09-07T09:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p3', '2026-10-05T09:00:00.000Z', 100, 'Sesión de kinesiología deportiva'),
  h('p3', '2026-10-19T09:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p3', '2026-10-26T09:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),

  // --- Diego Araya Fernández (p4) ---
  h('p4', '2026-10-15T11:05:00.000Z', 50, 'Bono de bienvenida al programa de fidelización'),
  h('p4', '2026-10-24T12:00:00.000Z', 40, 'Sesión de evaluación inicial de pedaleo'),

  // --- Camila Vergara Espinoza (p5) ---
  h('p5', '2026-04-20T16:50:00.000Z', 50, 'Bono de bienvenida al programa de fidelización'),
  h('p5', '2026-05-04T18:00:00.000Z', 80, 'Sesión de kinesiología deportiva'),
  h('p5', '2026-05-25T18:00:00.000Z', 80, 'Sesión de kinesiología deportiva'),
  h('p5', '2026-06-15T18:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p5', '2026-07-06T10:00:00.000Z', -220, 'Canje: Sesión de presoterapia de 30 min', 'canje', 'paciente'),
  h('p5', '2026-07-27T18:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p5', '2026-08-17T18:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p5', '2026-09-07T18:00:00.000Z', 100, 'Sesión de kinesiología deportiva'),
  h('p5', '2026-09-28T18:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
  h('p5', '2026-10-19T18:00:00.000Z', 90, 'Sesión de kinesiología deportiva'),
]

// ---------------------------------------------------------------------------
// Muro de novedades y avisos (contenido real, sin lorem ipsum).
// ---------------------------------------------------------------------------
export const SEED_NEWS = [
  {
    id: 'n1',
    title: 'Taller gratuito: prevención de lesiones de rodilla en corredores',
    body: 'Este sábado 31 de octubre realizamos un taller práctico de 45 minutos sobre activación y movilidad para runners de arena y asfalto. Cupos limitados a 12 personas, inscríbete en recepción.',
    badge: 'Taller',
    date: '2026-10-24T09:00:00.000Z',
    readBy: [],
  },
  {
    id: 'n2',
    title: 'Doble de puntos en evaluaciones de pisada durante noviembre',
    body: 'Durante todo noviembre, cada evaluación de pisada que realices te otorga el doble de puntos de fidelización. Ideal para ajustar tu técnica antes de la temporada de trail.',
    badge: 'Promoción',
    date: '2026-10-20T09:00:00.000Z',
    readBy: [],
  },
  {
    id: 'n3',
    title: 'Nuevo horario de atención los sábados en box 3',
    body: 'A partir de este mes, el box 3 atiende también los sábados de 9:00 a 13:00 horas para sesiones de recuperación y evaluaciones.',
    badge: 'Novedad',
    date: '2026-10-12T09:00:00.000Z',
    readBy: [],
  },
  {
    id: 'n4',
    title: 'Consejo kinésico: hidratación y recuperación en clima desértico',
    body: 'El clima seco de Antofagasta acelera la pérdida de líquidos durante el entrenamiento. Hidrátate antes, durante y después de cada sesión, y prioriza el estiramiento guiado al finalizar.',
    badge: 'Consejo',
    date: '2026-10-05T09:00:00.000Z',
    readBy: ['p1'],
  },
  {
    id: 'n5',
    title: 'Llegaron nuevas bandas elásticas a nuestro catálogo de premios',
    body: 'Ya puedes canjear tus puntos por el nuevo pack de bandas elásticas de resistencia progresiva, ideal para continuar tu rehabilitación en casa.',
    badge: 'Catálogo',
    date: '2026-09-28T09:00:00.000Z',
    readBy: ['p1'],
  },
]

function buildPatientsAndHistory() {
  const history = SEED_HISTORY_RAW.map((entry, index) => ({
    id: `hist_seed_${index + 1}`,
    patientId: entry.patientId,
    patientName: SEED_PATIENTS_BASE.find((p) => p.id === entry.patientId)?.name ?? '',
    type: entry.type,
    description: entry.description,
    points: entry.points,
    date: entry.date,
    by: entry.by,
  }))

  const patients = SEED_PATIENTS_BASE.map((patient) => {
    const balance = history
      .filter((entry) => entry.patientId === patient.id)
      .reduce((sum, entry) => sum + entry.points, 0)

    return {
      ...patient,
      qrId: SEED_PATIENT_CODES[patient.id],
      points: balance,
      consentAccepted: true,
    }
  })

  return { patients, history }
}

export function buildSeedData() {
  const { patients, history } = buildPatientsAndHistory()
  return {
    patients,
    rewards: SEED_REWARDS,
    news: SEED_NEWS,
    history,
  }
}

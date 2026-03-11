import type { Equipment } from './types'

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  BARBELL: 'Barra',
  DUMBBELL: 'Mancuernas',
  CABLE: 'Cable',
  MACHINE: 'Máquina',
  BODYWEIGHT: 'Peso corporal',
  KETTLEBELL: 'Kettlebell',
  RESISTANCE: 'Banda elástica',
  SMITH: 'Multipower',
  PULLEY: 'Polea',
  NONE: 'Sin material',
}

// Grupos musculares del backend — hardcodeados porque no hay endpoint dedicado
export const MUSCLE_GROUPS = [
  { slug: 'chest', name: 'Pecho' },
  { slug: 'back', name: 'Espalda' },
  { slug: 'shoulders', name: 'Hombros' },
  { slug: 'biceps', name: 'Bíceps' },
  { slug: 'triceps', name: 'Tríceps' },
  { slug: 'quadriceps', name: 'Cuádriceps' },
  { slug: 'hamstrings', name: 'Isquiotibiales' },
  { slug: 'adductors', name: 'Aductores' },
  { slug: 'glutes', name: 'Glúteos' },
] as const

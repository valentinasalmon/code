// Sistema de Niveles Sorpresa y Recompensas

export interface SurpriseReward {
  id: string
  type: "medal" | "pet" | "title"
  name: string
  icon: string
  description: string
  unlocked: boolean
}

export interface SurpriseLevel {
  levelNumber: number
  name: string
  reward: SurpriseReward
  pointsMultiplier: number // Multiplicador de puntos (ej: 3x = 3 veces más puntos)
}

// Niveles sorpresa distribuidos a lo largo del juego
export const SURPRISE_LEVELS: SurpriseLevel[] = [
  {
    levelNumber: 5,
    name: "Tesoro Oculto",
    reward: {
      id: "medal_beginner",
      type: "medal",
      name: "Medalla del Iniciado",
      icon: "🥉",
      description: "Completaste tu primer nivel sorpresa",
      unlocked: false,
    },
    pointsMultiplier: 2.5,
  },
  {
    levelNumber: 10,
    name: "Cámara Secreta",
    reward: {
      id: "pet_dragon",
      type: "pet",
      name: "Dragón Pequeño",
      icon: "🐉",
      description: "Un compañero fiel para tu aventura",
      unlocked: false,
    },
    pointsMultiplier: 3.0,
  },
  {
    levelNumber: 15,
    name: "Sala del Maestro",
    reward: {
      id: "medal_master",
      type: "medal",
      name: "Medalla del Maestro",
      icon: "🥇",
      description: "Dominas los laberintos más complejos",
      unlocked: false,
    },
    pointsMultiplier: 3.5,
  },
  {
    levelNumber: 20,
    name: "Santuario Perdido",
    reward: {
      id: "pet_phoenix",
      type: "pet",
      name: "Fénix Resurgente",
      icon: "🔥",
      description: "El ave legendaria te acompaña",
      unlocked: false,
    },
    pointsMultiplier: 4.0,
  },
  {
    levelNumber: 25,
    name: "Trono Ancestral",
    reward: {
      id: "title_legend",
      type: "title",
      name: "Leyenda de NEXUS",
      icon: "👑",
      description: "Título otorgado a los verdaderos maestros",
      unlocked: false,
    },
    pointsMultiplier: 5.0,
  },
]

export const SURPRISE_LEVEL_NUMBERS = new Set(SURPRISE_LEVELS.map((sl) => sl.levelNumber))

export function isSurpriseLevel(levelNumber: number): boolean {
  return SURPRISE_LEVEL_NUMBERS.has(levelNumber)
}

export function getSurpriseLevel(levelNumber: number): SurpriseLevel | undefined {
  return SURPRISE_LEVELS.find((sl) => sl.levelNumber === levelNumber)
}

export function getSurpriseRewards(unlockedLevels: Set<number>): SurpriseReward[] {
  return SURPRISE_LEVELS.filter((sl) => unlockedLevels.has(sl.levelNumber)).map((sl) => ({
    ...sl.reward,
    unlocked: true,
  }))
}


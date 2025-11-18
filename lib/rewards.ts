// Sistema de Recompensas y Achievements

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
}

export interface Reward {
  id: string
  type: 'fragment' | 'orb' | 'secret_level' | 'achievement'
  name: string
  description: string
  unlocked: boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_complete',
    name: 'Primer Fragmento',
    description: 'Completa tu primer nivel',
    icon: '✨',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'speed_demon',
    name: 'Velocidad Cognitiva',
    description: 'Completa un nivel en menos de 30 segundos',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'minimal_moves',
    name: 'Eficiencia Máxima',
    description: 'Completa un nivel con menos de 10 movimientos',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'collector',
    name: 'Coleccionista',
    description: 'Recolecta 10 Fragmentos de Conocimiento',
    icon: '💎',
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'master',
    name: 'Maestro de NEXUS',
    description: 'Completa todos los niveles',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 25
  },
  {
    id: 'secret_finder',
    name: 'Explorador Secreto',
    description: 'Descubre un nivel secreto',
    icon: '🔮',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  }
]

export const SECRET_LEVELS = [26, 27, 28] // Niveles secretos que se desbloquean con fragmentos

export function checkAchievements(
  achievements: Achievement[],
  stats: {
    levelsCompleted: number
    fragmentsCollected: number
    bestTime?: number
    bestMoves?: number
    secretLevelsFound: number
  }
): Achievement[] {
  return achievements.map(achievement => {
    let progress = achievement.progress
    let unlocked = achievement.unlocked

    switch (achievement.id) {
      case 'first_complete':
        progress = Math.min(stats.levelsCompleted, 1)
        unlocked = stats.levelsCompleted >= 1
        break
      case 'speed_demon':
        if (stats.bestTime && stats.bestTime < 30000) {
          progress = 1
          unlocked = true
        }
        break
      case 'minimal_moves':
        if (stats.bestMoves && stats.bestMoves < 10) {
          progress = 1
          unlocked = true
        }
        break
      case 'collector':
        progress = Math.min(stats.fragmentsCollected, 10)
        unlocked = stats.fragmentsCollected >= 10
        break
      case 'master':
        progress = Math.min(stats.levelsCompleted, 25)
        unlocked = stats.levelsCompleted >= 25
        break
      case 'secret_finder':
        progress = Math.min(stats.secretLevelsFound, 1)
        unlocked = stats.secretLevelsFound >= 1
        break
    }

    return { ...achievement, progress, unlocked }
  })
}


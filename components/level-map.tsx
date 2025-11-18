"use client"

import { LEVELS } from "@/lib/game-logic"
import { Home, Trophy, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LevelMapProps {
  onSelectLevel: (level: number) => void
  completedLevels: Set<number>
  currentLevel: number
}

const NODE_POSITIONS = [
  // Top row - Starting paths (Easy) - DISPERSADOS
  { x: 5, y: 5 },     // Level 1 - Easy (Tutorial)
  { x: 25, y: 8 },    // Level 2 - Easy  
  { x: 45, y: 5 },    // Level 3 - Easy
  
  // Second row - Branching paths (Easy/Medium) - MÁS DISPERSIÓN
  { x: 10, y: 20 },   // Level 4 - Medium
  { x: 30, y: 18 },   // Level 5 - Medium
  { x: 50, y: 22 },   // Level 6 - Medium
  { x: 70, y: 20 },   // Level 7 - Medium
  
  // Third row - Multiple paths (Medium/Hard) - DISPERSIÓN HORIZONTAL
  { x: 8, y: 35 },    // Level 8 - Hard
  { x: 28, y: 38 },   // Level 9 - Hard
  { x: 48, y: 35 },   // Level 10 - Hard
  { x: 68, y: 38 },   // Level 11 - Hard
  
  // Fourth row - Advanced paths (Hard/Very Hard) - MÁS ESPACIADO
  { x: 12, y: 52 },   // Level 12 - Very Hard
  { x: 32, y: 55 },   // Level 13 - Very Hard
  { x: 52, y: 52 },   // Level 14 - Very Hard
  { x: 72, y: 55 },   // Level 15 - Very Hard
  
  // Fifth row - Extended paths (Mixed difficulties) - DISPERSIÓN AMPLIA
  { x: 6, y: 68 },    // Level 16 - Medium
  { x: 26, y: 70 },   // Level 17 - Medium
  { x: 46, y: 68 },   // Level 18 - Hard
  { x: 66, y: 72 },   // Level 19 - Hard
  
  // Sixth row - Final challenges - ESPACIADO FINAL
  { x: 15, y: 85 },   // Level 20 - Hard
  { x: 35, y: 88 },   // Level 21 - Very Hard
  { x: 55, y: 85 },   // Level 22 - Very Hard
  
  // Seventh row - Ultimate challenges - DISPERSIÓN FINAL
  { x: 20, y: 100 },  // Level 23 - Very Hard
  { x: 45, y: 103 },  // Level 24 - Very Hard
  { x: 70, y: 100 },  // Level 25 - Very Hard (Final)
]

const NODE_CONNECTIONS = [
  // Starting paths - MÚLTIPLES CAMINOS desde el inicio
  [0, 1], [0, 3], [0, 4],    // Level 1 -> Level 2, Level 4, Level 5 (3 opciones)
  [1, 2], [1, 4], [1, 5],    // Level 2 -> Level 3, Level 5, Level 6 (3 opciones)
  [2, 5], [2, 6], [2, 7],    // Level 3 -> Level 6, Level 7, Level 8 (3 opciones - mezclado)
  
  // Second row - Múltiples rutas con dificultades mezcladas
  [3, 6], [3, 7], [3, 8],    // Level 4 (fácil) -> Level 7, Level 8, Level 9
  [4, 7], [4, 8], [4, 9],    // Level 5 (medio) -> Level 8, Level 9, Level 10
  [5, 8], [5, 9], [5, 10],   // Level 6 (difícil) -> Level 9, Level 10, Level 11
  [6, 9], [6, 10], [6, 11],  // Level 7 (fácil) -> Level 10, Level 11, Level 12
  
  // Third row - Caminos divergentes
  [7, 11], [7, 12], [7, 13], // Level 8 (muy difícil) -> Level 12, Level 13, Level 14
  [8, 12], [8, 13], [8, 14], // Level 9 (medio) -> Level 13, Level 14, Level 15
  [9, 13], [9, 14], [9, 15], // Level 10 (difícil) -> Level 14, Level 15, Level 16
  [10, 14], [10, 15], [10, 16], // Level 11 (muy difícil) -> Level 15, Level 16, Level 17
  
  // Fourth row - Rutas avanzadas
  [11, 16], [11, 17], [11, 18], // Level 12 (fácil) -> Level 17, Level 18, Level 19
  [12, 17], [12, 18], [12, 19], // Level 13 (medio) -> Level 18, Level 19, Level 20
  [13, 18], [13, 19], [13, 20], // Level 14 (difícil) -> Level 19, Level 20, Level 21
  [14, 19], [14, 20], [14, 21], // Level 15 (muy difícil) -> Level 20, Level 21, Level 22
  [15, 20], [15, 21], [15, 22], // Level 16 (fácil) -> Level 21, Level 22, Level 23
  
  // Fifth row - Caminos finales
  [16, 21], [16, 22], [16, 23], // Level 17 (medio) -> Level 22, Level 23, Level 24
  [17, 22], [17, 23], [17, 24], // Level 18 (difícil) -> Level 23, Level 24, Level 25
  [18, 23], [18, 24],           // Level 19 (muy difícil) -> Level 24, Level 25
  [19, 24],                      // Level 20 (fácil) -> Level 25
  
  // Sixth row - Convergencia final
  [20, 23], [20, 24],            // Level 21 (medio) -> Level 24, Level 25
  [21, 24],                      // Level 22 (difícil) -> Level 25
  [22, 24],                      // Level 23 (fácil) -> Level 25
  
  // Final paths to level 25
  [23, 24],                      // Level 24 (medio) -> Level 25
]

export function LevelMap({ onSelectLevel, completedLevels, currentLevel }: LevelMapProps) {
  const router = useRouter()
  
  // Sistema de desbloqueo basado en múltiples caminos
  const getUnlockedLevels = () => {
    const unlocked = new Set<number>()
    unlocked.add(1)
    unlocked.add(2)
    unlocked.add(3)
    
    completedLevels.forEach((completedLevel) => {
      const levelIndex = completedLevel - 1
      NODE_CONNECTIONS.forEach(([from, to]) => {
        if (from === levelIndex) {
          unlocked.add(to + 1)
        }
      })
    })
    
    return unlocked
  }
  
  const unlockedLevels = getUnlockedLevels()
  
  const isConnectionActive = (from: number, to: number) => {
    const fromLevel = from + 1
    const toLevel = to + 1
    return completedLevels.has(fromLevel) && unlockedLevels.has(toLevel)
  }

  const getLevelDifficulty = (levelNumber: number) => {
    if ([1, 4, 7, 12, 16, 20, 23].includes(levelNumber)) return 'easy'
    if ([2, 5, 9, 13, 17, 21, 24].includes(levelNumber)) return 'medium'
    if ([3, 6, 10, 14, 18, 22].includes(levelNumber)) return 'hard'
    return 'very-hard'
  }

  const getDifficultyInfo = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          color: 'green',
          bgColor: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-400/50',
          textColor: 'text-green-400',
          glowColor: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]',
          nodeColor: 'bg-gradient-to-br from-green-400 via-emerald-500 to-green-600',
          nodeBorder: 'border-green-400'
        }
      case 'medium':
        return {
          color: 'yellow',
          bgColor: 'from-yellow-500/20 to-amber-500/20',
          borderColor: 'border-yellow-400/50',
          textColor: 'text-yellow-400',
          glowColor: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]',
          nodeColor: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600',
          nodeBorder: 'border-yellow-400'
        }
      case 'hard':
        return {
          color: 'orange',
          bgColor: 'from-orange-500/20 to-red-500/20',
          borderColor: 'border-orange-400/50',
          textColor: 'text-orange-400',
          glowColor: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]',
          nodeColor: 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500',
          nodeBorder: 'border-orange-400'
        }
      case 'very-hard':
        return {
          color: 'red',
          bgColor: 'from-red-500/20 to-rose-500/20',
          borderColor: 'border-red-400/50',
          textColor: 'text-red-400',
          glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
          nodeColor: 'bg-gradient-to-br from-red-500 via-rose-600 to-red-700',
          nodeBorder: 'border-red-500'
        }
      default:
        return {
          color: 'cyan',
          bgColor: 'from-cyan-500/20 to-blue-500/20',
          borderColor: 'border-cyan-400/50',
          textColor: 'text-cyan-400',
          glowColor: 'shadow-[0_0_20px_rgba(6,182,212,0.4)]',
          nodeColor: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600',
          nodeBorder: 'border-cyan-400'
        }
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0f1729] to-[#0a0f1a] flex flex-col items-center p-6" style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="max-w-7xl w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="w-12 h-12 bg-slate-900/40 hover:bg-slate-800/60 border border-cyan-500/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-cyan-400/60 backdrop-blur-sm"
            title="Volver al inicio"
          >
            <Home className="w-5 h-5 text-cyan-400/80" />
          </button>
          
          <div className="text-center">
            <h1 className="text-6xl font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 tracking-[0.3em] mb-1">
              NEXUS
            </h1>
            <p className="text-cyan-400/50 text-xs font-light tracking-wider">Mapa de Nodos</p>
          </div>
          
          <div className="w-12"></div>
        </div>


        {/* Mapa con scroll mejorado */}
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ minHeight: '1600px', maxHeight: '85vh' }}>
          <div className="relative w-full h-full" style={{ minHeight: '1600px' }}>
            {/* SVG de conexiones */}
            <svg className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1, height: '1600px' }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.8)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.6)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {NODE_CONNECTIONS.map(([from, to], index) => {
                const fromPos = NODE_POSITIONS[from]
                const toPos = NODE_POSITIONS[to]
                const fromLevel = from + 1
                const toLevel = to + 1
                const isUnlocked = unlockedLevels.has(fromLevel) && unlockedLevels.has(toLevel)
                const isActive = isConnectionActive(from, to)

                return (
                  <line
                    key={`line-${index}`}
                    x1={`${fromPos.x}%`}
                    y1={`${fromPos.y * 14}px`}
                    x2={`${toPos.x}%`}
                    y2={`${toPos.y * 14}px`}
                    stroke={isActive ? "url(#lineGradient)" : isUnlocked ? "rgba(6, 182, 212, 0.4)" : "rgba(60, 60, 60, 0.2)"}
                    strokeWidth={isActive ? "3" : isUnlocked ? "2" : "1"}
                    strokeLinecap="round"
                    filter={isActive ? "url(#glow)" : ""}
                    className={isActive ? "animate-pulse" : ""}
                    opacity={isActive ? 1 : isUnlocked ? 0.6 : 0.3}
                  />
                )
              })}
            </svg>


            {/* Nodos de niveles */}
            {LEVELS.map((level, index) => {
              const isCompleted = completedLevels.has(level.number)
              const isUnlocked = unlockedLevels.has(level.number)
              const isCurrent = level.number === currentLevel
              const position = NODE_POSITIONS[index]
              const difficulty = getLevelDifficulty(level.number)
              const difficultyInfo = getDifficultyInfo(difficulty)
              
              if (!position) return null

              return (
                <button
                  key={level.number}
                  onClick={() => isUnlocked && onSelectLevel(level.number)}
                  disabled={!isUnlocked}
                  className={`absolute z-20 transition-all duration-300 group ${
                    isUnlocked ? "hover:scale-125 cursor-pointer" : "cursor-not-allowed"
                  }`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y * 14}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="relative">
                    {/* Nodo principal */}
                    <div
                      className={`w-20 h-20 rounded-full ${isUnlocked ? difficultyInfo.nodeColor : 'bg-gradient-to-br from-gray-700 to-gray-900'} shadow-2xl border-2 ${
                        isCurrent 
                          ? `${difficultyInfo.nodeBorder} animate-pulse-glow ring-2 ring-cyan-400/50` 
                          : isUnlocked 
                            ? difficultyInfo.nodeBorder 
                            : 'border-gray-600/50'
                      } ${isUnlocked ? `hover:${difficultyInfo.glowColor}` : ""} transition-all duration-300`}
                    >
                    </div>

                    {/* Checkmark de completado */}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.9)] border-2 border-white/70 z-10 animate-scale-in">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Lock para niveles bloqueados */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                    )}

                    {/* Glow effect para niveles desbloqueados */}
                    {isUnlocked && (
                      <div
                        className={`absolute inset-0 rounded-full opacity-50 blur-xl animate-pulse ${
                          difficulty === 'easy' ? 'bg-green-400' :
                          difficulty === 'medium' ? 'bg-yellow-400' :
                          difficulty === 'hard' ? 'bg-orange-400' :
                          'bg-red-500'
                        }`}
                        style={{ zIndex: -1 }}
                      />
                    )}

                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel de Recompensas - Abajo del mapa */}
        <div className="mt-8 w-full">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
            <h3 className="text-cyan-400/80 font-light text-sm mb-4 uppercase tracking-wider text-center">Recompensas</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/50 rounded-lg p-4 text-center transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                  <span className="text-2xl">✨</span>
                </div>
                <p className="text-blue-400 font-light text-xs mb-1">Fragmentos</p>
                <p className="text-blue-400/60 text-[10px] font-light">Desbloquean secretos</p>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-lg p-4 text-center transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <span className="text-2xl">🔮</span>
                </div>
                <p className="text-purple-400 font-light text-xs mb-1">Niveles Secretos</p>
                <p className="text-purple-400/60 text-[10px] font-light">Con 5 fragmentos</p>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/50 rounded-lg p-4 text-center transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                  <span className="text-2xl">🏆</span>
                </div>
                <p className="text-yellow-400 font-light text-xs mb-1">Logros</p>
                <p className="text-yellow-400/60 text-[10px] font-light">Desafíos completados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Progreso - Fijo a la derecha */}
        <div className="absolute top-32 right-6 z-40">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6 shadow-2xl min-w-[200px]">
            <div className="text-center mb-6">
              <Trophy className="w-6 h-6 text-cyan-400/80 mx-auto mb-2" />
              <p className="text-cyan-400/60 text-xs font-light uppercase tracking-[0.2em] mb-2">Progreso</p>
              <p className="text-cyan-400 text-4xl font-light mb-3">
                {completedLevels.size}<span className="text-cyan-400/40 text-2xl">/25</span>
              </p>
              <div className="w-full bg-slate-800/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ width: `${(completedLevels.size / 25) * 100}%` }}
                />
              </div>
              <p className="text-cyan-400/50 text-xs mt-2 font-light">
                {Math.round((completedLevels.size / 25) * 100)}% completado
              </p>
            </div>

            {/* Referencia de Dificultades */}
            <div className="mt-6 pt-6 border-t border-cyan-500/20">
              <p className="text-cyan-400/60 text-xs font-light uppercase tracking-wider mb-3 text-center">
                Dificultades
              </p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-700"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

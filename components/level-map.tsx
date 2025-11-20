"use client"

import { LEVELS } from "@/lib/game-logic"
import { NODE_CONNECTIONS, NODE_POSITIONS } from "@/lib/map-data"
import { SECRET_LEVELS } from "@/lib/rewards"
import { getSurpriseRewards, isSurpriseLevel } from "@/lib/surprise-levels"
import { RewardsDisplay } from "@/components/rewards-display"
import { Home, Trophy, Lock, Sparkles, Trash2, X, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect, startTransition } from "react"

interface LevelMapProps {
  onSelectLevel: (level: number) => void
  completedLevels: Set<number>
  currentLevel: number
  secretLevelsUnlocked: number[]
  onResetAll?: () => void
}

const MAP_REWARDS = [
  { threshold: 3, title: "Pulso Inicial", reward: "Fragmento Nexus ✨" },
  { threshold: 10, title: "Ruta Media", reward: "Cofre Resonante 🧿" },
  { threshold: 18, title: "Zona Avanzada", reward: "Llave Ancestral 🔓" },
  { threshold: 25, title: "Supremacía", reward: "Corona de Datos 🏆" },
]

const SECRET_LEVEL_SET = new Set(SECRET_LEVELS)

function ProgressPanel({ completedLevels }: { completedLevels: Set<number> }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-2xl min-w-[220px] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-cyan-400/80" />
          <h3 className="text-cyan-400/80 font-light text-sm uppercase tracking-wider">
            Progreso
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-cyan-400/60" />
        ) : (
          <ChevronDown className="w-5 h-5 text-cyan-400/60" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 pt-0">
          <div className="text-center mb-6">
            <p className="text-cyan-400 text-4xl font-light mb-3">
              {completedLevels.size}
              <span className="text-cyan-400/40 text-2xl">/{LEVELS.length}</span>
            </p>
            <div className="w-full bg-slate-800/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${(completedLevels.size / LEVELS.length) * 100}%` }}
              />
            </div>
            <p className="text-cyan-400/50 text-xs mt-2 font-light">
              {Math.round((completedLevels.size / LEVELS.length) * 100)}% completado
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-cyan-500/20">
            <p className="text-cyan-400/60 text-xs font-light uppercase tracking-wider mb-3 text-center">
              Dificultades
            </p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-700" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function LevelMap({
  onSelectLevel,
  completedLevels,
  currentLevel,
  secretLevelsUnlocked,
  onResetAll,
}: LevelMapProps) {
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [fragments, setFragments] = useState(0)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [mounted, setMounted] = useState(false)

  const handleResetAll = () => {
    setShowResetConfirm(true)
  }

  const confirmResetAll = () => {
    setShowResetConfirm(false)
    // Si hay una función onResetAll del padre, usarla para resetear; si no, recargar la página
    if (onResetAll) {
      onResetAll()
    } else {
      localStorage.removeItem('nexus_progress')
      window.location.reload()
    }
  }

  // Marcar como montado para evitar errores de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar y actualizar puntos y fragmentos desde localStorage
  useEffect(() => {
    const updateStats = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('nexus_progress')
        if (saved) {
          try {
            const data = JSON.parse(saved)
            setScore(data.score || 0)
            setFragments(data.fragmentsCollected || 0)
          } catch {
            setScore(0)
            setFragments(0)
          }
        }
      }
    }
    
    if (mounted) {
      updateStats()
      // Actualizar cada vez que cambie el localStorage
      const interval = setInterval(updateStats, 500)
      return () => clearInterval(interval)
    }
  }, [mounted])

  // Sistema de desbloqueo basado en múltiples caminos
  const getUnlockedLevels = () => {
    const unlocked = new Set<number>()
    unlocked.add(1)
    completedLevels.forEach((level) => unlocked.add(level))
    secretLevelsUnlocked.forEach((level) => unlocked.add(level))

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
    if ([1, 4, 7, 12, 16, 20, 23].includes(levelNumber)) return "easy"
    if ([2, 5, 9, 13, 17, 21, 24].includes(levelNumber)) return "medium"
    if ([3, 6, 10, 14, 18, 22].includes(levelNumber)) return "hard"
    return "very-hard"
  }

  const getDifficultyInfo = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return {
          color: "green",
          bgColor: "from-green-500/20 to-emerald-500/20",
          borderColor: "border-green-400/50",
          textColor: "text-green-400",
          glowColor: "shadow-[0_0_20px_rgba(34,197,94,0.4)]",
          nodeColor: "bg-gradient-to-br from-green-400 via-emerald-500 to-green-600",
          nodeBorder: "border-green-400",
        }
      case "medium":
        return {
          color: "yellow",
          bgColor: "from-yellow-500/20 to-amber-500/20",
          borderColor: "border-yellow-400/50",
          textColor: "text-yellow-400",
          glowColor: "shadow-[0_0_20px_rgba(234,179,8,0.4)]",
          nodeColor: "bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600",
          nodeBorder: "border-yellow-400",
        }
      case "hard":
        return {
          color: "orange",
          bgColor: "from-orange-500/20 to-red-500/20",
          borderColor: "border-orange-400/50",
          textColor: "text-orange-400",
          glowColor: "shadow-[0_0_20px_rgba(249,115,22,0.4)]",
          nodeColor: "bg-gradient-to-br from-orange-400 via-orange-500 to-red-500",
          nodeBorder: "border-orange-400",
        }
      case "very-hard":
        return {
          color: "red",
          bgColor: "from-red-500/20 to-rose-500/20",
          borderColor: "border-red-400/50",
          textColor: "text-red-400",
          glowColor: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
          nodeColor: "bg-gradient-to-br from-red-500 via-rose-600 to-red-700",
          nodeBorder: "border-red-500",
        }
      default:
        return {
          color: "cyan",
          bgColor: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          textColor: "text-cyan-400",
          glowColor: "shadow-[0_0_20px_rgba(6,182,212,0.4)]",
          nodeColor: "bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600",
          nodeBorder: "border-cyan-400",
        }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0f1729] to-[#0a0f1a] flex flex-col items-center p-6 overflow-y-auto">
      <div className="max-w-7xl w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                startTransition(() => {
                  try {
                    router.push("/")
                  } catch (error) {
                    console.error("Error navigating to /:", error)
                    window.location.href = "/"
                  }
                })
              }}
              className="w-12 h-12 bg-slate-900/40 hover:bg-slate-800/60 border border-cyan-500/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-cyan-400/60 backdrop-blur-sm"
              title="Volver al inicio"
            >
              <Home className="w-5 h-5 text-cyan-400/80" />
            </button>
            {onResetAll && (
              <button
                onClick={handleResetAll}
                className="w-12 h-12 bg-slate-900/40 hover:bg-slate-800/60 border border-red-500/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-red-400/60 backdrop-blur-sm"
                title="Reiniciar todo el progreso"
              >
                <Trash2 className="w-5 h-5 text-red-400/80" />
              </button>
            )}
          </div>

          <div className="text-center flex-1 flex items-center justify-center gap-4">
            <img
              src="/avatar.png"
              alt="Avatar"
              className="w-16 h-16 rounded-full border-[3px] border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.9)] animate-pulse"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.9))'
              }}
            />
            <h1 className="text-6xl font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 tracking-[0.3em] mb-1">
              NEXUS
            </h1>
          </div>

          {/* Barra de puntos y progreso */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl px-6 py-3 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div className="flex flex-col">
                <span className="text-yellow-400 text-xs font-light uppercase tracking-wider">Puntos</span>
                <span className="text-yellow-300 text-lg font-light">{score.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-cyan-500/30" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div className="flex flex-col">
                <span className="text-purple-400 text-xs font-light uppercase tracking-wider">Fragmentos</span>
                <span className="text-purple-300 text-lg font-light">{fragments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa con scroll mejorado */}
        <div className="relative w-full">
            <div
              className="relative w-full rounded-2xl overflow-auto border border-cyan-500/10 bg-slate-950/30 scroll-fade"
              style={{
                minHeight: "65vh",
                maxHeight: "80vh",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="relative w-full" style={{ minHeight: "1600px", paddingBottom: "100px" }}>
              {/* SVG de conexiones */}
              {mounted && (
                <svg
                  className="absolute inset-0 w-full pointer-events-none"
                  style={{ zIndex: 1, height: "1600px" }}
                >
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
                        stroke={
                          isActive
                            ? "url(#lineGradient)"
                            : isUnlocked
                            ? "rgba(6, 182, 212, 0.4)"
                            : "rgba(60, 60, 60, 0.2)"
                        }
                        strokeWidth={isActive ? "3" : isUnlocked ? "2" : "1"}
                        strokeLinecap="round"
                        filter={isActive ? "url(#glow)" : ""}
                        className={isActive ? "animate-pulse" : ""}
                        opacity={isActive ? 1 : isUnlocked ? 0.6 : 0.3}
                      />
                    )
                  })}
                </svg>
              )}


              {/* Nodos de niveles */}
              {mounted && LEVELS.map((level, index) => {
                const isCompleted = completedLevels.has(level.number)
                const baseUnlocked = unlockedLevels.has(level.number)
                const isSecret = SECRET_LEVEL_SET.has(level.number)
                const hasSecretAccess =
                  !isSecret || secretLevelsUnlocked.includes(level.number) || isCompleted
                const isUnlocked = baseUnlocked && hasSecretAccess
                const isCurrent = level.number === currentLevel
                const position = NODE_POSITIONS[index]
                const difficulty = getLevelDifficulty(level.number)
                const difficultyInfo = getDifficultyInfo(difficulty)
                const isSurprise = isSurpriseLevel(level.number)

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
                        className={`w-24 h-24 rounded-full ${
                          isUnlocked
                            ? difficultyInfo.nodeColor
                            : "bg-gradient-to-br from-gray-700 to-gray-900"
                        } shadow-2xl border-2 ${
                          isCurrent
                            ? `${difficultyInfo.nodeBorder} animate-pulse-glow ring-2 ring-cyan-400/50`
                            : isUnlocked
                            ? difficultyInfo.nodeBorder
                            : "border-gray-600/50"
                        } ${isUnlocked ? `hover:${difficultyInfo.glowColor}` : ""} transition-all duration-300`}
                      />

                      {/* Checkmark de completado */}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-7 h-7 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.9)] border-2 border-white/70 z-10 animate-scale-in">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* Indicador de nivel sorpresa */}
                      {isSurprise && isUnlocked && (
                        <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.9)] border-2 border-white/70 z-10 animate-pulse">
                          <span className="text-xs">⭐</span>
                        </div>
                      )}

                      {/* Lock para niveles bloqueados */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400">
                          {isSecret ? (
                            <Sparkles className="w-6 h-6" />
                          ) : (
                            <Lock className="w-6 h-6" />
                          )}
                          {isSecret && (
                            <span className="text-[10px] uppercase tracking-wide text-cyan-300/60">
                              Secreto
                            </span>
                          )}
                        </div>
                      )}

                      {/* Glow effect para niveles desbloqueados */}
                      {isUnlocked && (
                        <div
                          className={`absolute inset-0 rounded-full opacity-50 blur-xl animate-pulse ${
                            difficulty === "easy"
                              ? "bg-green-400"
                              : difficulty === "medium"
                              ? "bg-yellow-400"
                              : difficulty === "hard"
                              ? "bg-orange-400"
                              : "bg-red-500"
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

          <div className="hidden xl:block absolute top-10 right-6 z-40 flex flex-col gap-4">
            <ProgressPanel completedLevels={completedLevels} />
            <RewardsDisplay rewards={getSurpriseRewards(completedLevels)} />
          </div>
        </div>

        <div className="xl:hidden mt-6 flex flex-col gap-4">
          <ProgressPanel completedLevels={completedLevels} />
          <RewardsDisplay rewards={getSurpriseRewards(completedLevels)} />
        </div>

        <div className="mt-8 w-full">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
            <h3 className="text-cyan-400/80 font-light text-sm mb-4 uppercase tracking-wider text-center">
              Recompensas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <p className="text-purple-400/60 text-[10px] font-light">
                  Con 5 / 10 / 15 fragmentos
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/50 rounded-lg p-4 text-center transition-all hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                  <span className="text-2xl">🏆</span>
                </div>
                <p className="text-yellow-400 font-light text-xs mb-1">Logros</p>
                <p className="text-yellow-400/60 text-[10px] font-light">Desafíos completados</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-6">
              {MAP_REWARDS.map((milestone) => {
                const achieved = completedLevels.size >= milestone.threshold
                const remaining = Math.max(0, milestone.threshold - completedLevels.size)
                return (
                  <div
                    key={milestone.title}
                    className={`rounded-xl p-4 border ${
                      achieved
                        ? "border-emerald-400/50 bg-emerald-500/10"
                        : "border-slate-600/50 bg-slate-800/40"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-widest text-cyan-300/70">
                      {milestone.title}
                    </p>
                    <p className="text-2xl font-light text-white mt-1">
                      {milestone.threshold} Niveles
                    </p>
                    <p className="text-cyan-100/80 text-sm mt-2">{milestone.reward}</p>
                    {!achieved && (
                      <p className="text-slate-300/70 text-xs mt-2">Faltan {remaining}</p>
                    )}
                    {achieved && (
                      <p className="text-emerald-300/80 text-xs mt-2">¡Desbloqueado!</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <style jsx>{`
          .scroll-fade::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Modal de confirmación para reiniciar todo */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900/95 border-2 border-red-500/50 rounded-xl p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-red-400">⚠️ Reiniciar Todo</h3>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-300 mb-6 text-center">
              ¿Desea comenzar de cero?<br />
              <span className="text-red-400 font-semibold">Esto eliminará todo su progreso, niveles completados, puntuación y fragmentos.</span>
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmResetAll}
                className="flex-1 bg-red-600/80 hover:bg-red-600 text-white font-light py-3 px-6 rounded-lg transition-all duration-200 border border-red-500/50 hover:border-red-400"
              >
                Sí, Reiniciar
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-slate-700/80 hover:bg-slate-600 text-white font-light py-3 px-6 rounded-lg transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

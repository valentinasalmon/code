"use client"

import { useState, useEffect, useCallback } from "react"
import { GameUI } from "@/components/game-ui"
import { GameBoard } from "@/components/game-board"
import { LevelCompleteModal } from "@/components/level-complete-modal"
import { LevelMap } from "@/components/level-map"
import {
  createLevel,
  canMove,
  canPushBlock,
  moveBlock,
  checkWinCondition,
  calculateScore,
  getLevelObjectives,
  getLevelRequirements,
  LEVELS,
  type GameState,
  // updateGameGrid, // Removed as per updates
} from "@/lib/game-logic"
import { useGameControls } from "@/hooks/use-game-controls"
import { RewardsPanel } from "@/components/rewards-panel"
import { ACHIEVEMENTS, checkAchievements, SECRET_LEVELS } from "@/lib/rewards"
import { isSurpriseLevel, getSurpriseLevel, getSurpriseRewards, SURPRISE_LEVELS, type SurpriseReward } from "@/lib/surprise-levels"
import { RewardNotification } from "@/components/reward-notification"
import { setGlobalAudioMuted, setGlobalAudioVolume } from "@/lib/audio"
import { X } from "lucide-react"

export default function PlayPage() {
  // Cargar progreso desde localStorage
  const loadProgress = () => {
    if (typeof window === 'undefined') return {
      completedLevels: new Set<number>(),
      score: 0,
      fragmentsCollected: 0,
      secretLevelsUnlocked: [] as number[],
      currentLevel: 1
    }
    
    const saved = localStorage.getItem('nexus_progress')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        return {
          completedLevels: new Set<number>(data.completedLevels || []),
          score: data.score || 0,
          fragmentsCollected: data.fragmentsCollected || 0,
          secretLevelsUnlocked: data.secretLevelsUnlocked || [],
          currentLevel: data.currentLevel || 1
        }
      } catch {
        return {
          completedLevels: new Set<number>(),
          score: 0,
          fragmentsCollected: 0,
          secretLevelsUnlocked: [] as number[],
          currentLevel: 1
        }
      }
    }
    return {
      completedLevels: new Set<number>(),
      score: 0,
      fragmentsCollected: 0,
      secretLevelsUnlocked: [] as number[],
      currentLevel: 1
    }
  }

  const initialProgress = loadProgress()
  
  const [showMap, setShowMap] = useState(true)
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(initialProgress.completedLevels)
  const [currentLevel, setCurrentLevel] = useState(initialProgress.currentLevel)
  const [gameState, setGameState] = useState<GameState>(() => createLevel(initialProgress.currentLevel))
  const [time, setTime] = useState(0)
  const [score, setScore] = useState(initialProgress.score)
  const [isPaused, setIsPaused] = useState(false)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [levelScore, setLevelScore] = useState(0)
  const [doorsUnlocked, setDoorsUnlocked] = useState(0)
  const [warningMessage, setWarningMessage] = useState<string>("")
  const [fragmentsCollected, setFragmentsCollected] = useState(initialProgress.fragmentsCollected)
  const [achievements, setAchievements] = useState(ACHIEVEMENTS)
  const [secretLevelsUnlocked, setSecretLevelsUnlocked] = useState<number[]>(initialProgress.secretLevelsUnlocked)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_volume')
      return saved ? parseFloat(saved) : 0.5
    }
    return 0.5
  })
  const [newReward, setNewReward] = useState<{ reward: SurpriseReward; levelNumber: number } | null>(null)

  useEffect(() => {
    setGlobalAudioMuted(muted)
  }, [muted])

  useEffect(() => {
    // Cargar volumen inicial desde localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_volume')
      if (saved) {
        const savedVolume = parseFloat(saved)
        setVolume(savedVolume)
        setGlobalAudioVolume(savedVolume)
      } else {
        setGlobalAudioVolume(volume)
        localStorage.setItem('nexus_volume', volume.toString())
      }
    }
  }, [])

  useEffect(() => {
    setGlobalAudioVolume(volume)
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_volume', volume.toString())
    }
  }, [volume])

  // Sonido de movimiento
  const playMoveSound = useCallback(() => {
    if (muted) return
    const audio = new Audio('/move.mp3')
    audio.volume = 0.1
    audio.play().catch(() => {})
  }, [muted])

  // Sonido de recolección
  const playCollectSound = useCallback(() => {
    if (muted) return
    const audio = new Audio('/collect.mp3')
    audio.volume = 0.2
    audio.play().catch(() => {})
  }, [muted])

  useEffect(() => {
    if (isPaused || gameState.isComplete || showMap) return

    const interval = setInterval(() => {
      setTime((prev) => prev + 10)
    }, 10)

    return () => clearInterval(interval)
  }, [isPaused, gameState.isComplete, showMap])

  // Actualizar achievements
  useEffect(() => {
    const updatedAchievements = checkAchievements(achievements, {
      levelsCompleted: completedLevels.size,
      fragmentsCollected,
      secretLevelsFound: secretLevelsUnlocked.length
    })
    setAchievements(updatedAchievements)
  }, [completedLevels.size, fragmentsCollected, secretLevelsUnlocked.length])

  // Desbloquear niveles secretos con fragmentos
  useEffect(() => {
    if (fragmentsCollected >= 5 && secretLevelsUnlocked.length === 0) {
      setSecretLevelsUnlocked([SECRET_LEVELS[0]])
    }
    if (fragmentsCollected >= 10 && secretLevelsUnlocked.length === 1) {
      setSecretLevelsUnlocked([...secretLevelsUnlocked, SECRET_LEVELS[1]])
    }
    if (fragmentsCollected >= 15 && secretLevelsUnlocked.length === 2) {
      setSecretLevelsUnlocked([...secretLevelsUnlocked, SECRET_LEVELS[2]])
    }
  }, [fragmentsCollected])

  // Guardar progreso en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const progress = {
        completedLevels: Array.from(completedLevels),
        score,
        fragmentsCollected,
        secretLevelsUnlocked,
        currentLevel
      }
      localStorage.setItem('nexus_progress', JSON.stringify(progress))
    }
  }, [completedLevels, score, fragmentsCollected, secretLevelsUnlocked, currentLevel])

  // Validación de seguridad: si isComplete es true, significa que ya pasó la validación en handleMove
  useEffect(() => {
    if (gameState.isComplete && checkWinCondition(gameState, currentLevel, doorsUnlocked)) {
      // Verificar si el nivel ya estaba completado antes de procesar
      const wasCompleted = completedLevels.has(currentLevel)
      
      // Solo procesar si no estaba completado antes
      if (!wasCompleted) {
        const surpriseLevel = getSurpriseLevel(currentLevel)
        const multiplier = surpriseLevel ? surpriseLevel.pointsMultiplier : 1
        const finalScore = calculateScore(gameState.moves, time, currentLevel, multiplier)
        setLevelScore(finalScore)
        setScore((prev) => prev + finalScore)
        
        // Agregar el nivel a los completados
        setCompletedLevels((prev) => new Set([...prev, currentLevel]))
        
        // Si es un nivel sorpresa, mostrar notificación
        if (surpriseLevel) {
          setNewReward({
            reward: surpriseLevel.reward,
            levelNumber: currentLevel
          })
        }
        
        setShowLevelComplete(true)
      }
    }
  }, [gameState.isComplete, gameState, currentLevel, time, doorsUnlocked])

  // Clear warning after 4 seconds
  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => setWarningMessage(""), 4000)
      return () => clearTimeout(timer)
    }
  }, [warningMessage])

  const handleMove = useCallback(
    (dirX: number, dirY: number) => {
      if (isPaused || gameState.isComplete) return

      const newX = gameState.playerPos.x + dirX
      const newY = gameState.playerPos.y + dirY

      if (newY < 0 || newY >= gameState.grid.length || newX < 0 || newX >= gameState.grid[0].length) {
        return
      }

      const targetCell = gameState.grid[newY]?.[newX]
      if (!targetCell) return

      if (targetCell.type === "block") {
        if (canPushBlock(gameState.grid, newX, newY, dirX, dirY)) {
          const blockNewX = newX + dirX
          const blockNewY = newY + dirY

          const { newGrid: gridAfterBlock, newSwitchesActive } = moveBlock(
            gameState.grid,
            newX,
            newY,
            blockNewX,
            blockNewY,
            gameState.switchesActive,
          )

          gridAfterBlock[gameState.playerPos.y][gameState.playerPos.x] = { type: "empty" }
          gridAfterBlock[newY][newX] = { type: "player" }

          setGameState({
            ...gameState,
            grid: gridAfterBlock,
            playerPos: { x: newX, y: newY },
            moves: gameState.moves + 1,
            switchesActive: newSwitchesActive,
            requirements: gameState.requirements,
          })
          playMoveSound()
        }
        return
      }

      if (targetCell.type === "door" && !targetCell.active) {
        if (gameState.keysCollected === 0) {
          return
        }
      }

      if (
        canMove(gameState.grid, gameState.playerPos.x, gameState.playerPos.y, newX, newY, gameState.keysCollected)
      ) {
        const newGrid = gameState.grid.map((row) => row.map((cell) => ({ ...cell })))
        const targetCell = newGrid[newY][newX]

        let newKeysCollected = gameState.keysCollected
        let isComplete: boolean = gameState.isComplete
        let newDoorsUnlocked = doorsUnlocked

        if (targetCell.type === "key") {
          newKeysCollected++
          newGrid[newY][newX] = { type: "empty" }
          playCollectSound()
        }

        if (targetCell.type === "fragment") {
          setFragmentsCollected((prev) => prev + 1)
          newGrid[newY][newX] = { type: "empty" }
          playCollectSound()
        }

        if (targetCell.type === "door" && !targetCell.active && newKeysCollected > 0) {
          newGrid[newY][newX] = { ...targetCell, active: true }
          newKeysCollected-- // Consumir una llave al abrir la puerta
          newDoorsUnlocked++
        }

        // Validar objetivos ANTES de permitir completar el nivel
        if (targetCell.type === "goal") {
          const requiredKeys = gameState.requirements.totalKeys || 0
          const requiredSwitches = gameState.requirements.totalSwitches || 0
          
          // El objetivo es abrir todas las puertas necesarias (usando las llaves), no tener las llaves al final
          const hasOpenedAllDoors = requiredKeys === 0 || newDoorsUnlocked >= requiredKeys
          const hasEnoughSwitches = gameState.switchesActive.size >= requiredSwitches
          
          // Si no se cumplen los objetivos, mostrar error y NO completar
          if (!hasOpenedAllDoors || !hasEnoughSwitches) {
            const missingDoors = Math.max(0, requiredKeys - newDoorsUnlocked)
            const missingSwitches = Math.max(0, requiredSwitches - gameState.switchesActive.size)
            
            let errorMsg = "❌ OBJETIVOS NO COMPLETADOS - NO PUEDES AVANZAR\n"
            if (missingDoors > 0) errorMsg += `Faltan abrir ${missingDoors} PUERTA${missingDoors > 1 ? 'S' : ''} (usa las llaves)\n`
            if (missingSwitches > 0) errorMsg += `Faltan ${missingSwitches} INTERRUPTOR${missingSwitches > 1 ? 'ES' : ''}`
            
            setWarningMessage(errorMsg)
            // NO mover al jugador a la meta si no cumple objetivos
            return
          }
          
          // Solo establecer isComplete si todos los objetivos están cumplidos
          isComplete = true
        }

        // Guardar qué había en la celda anterior antes de mover al jugador
        const previousCell = gameState.grid[gameState.playerPos.y][gameState.playerPos.x]
        
        // Si el jugador estaba sobre un switch, restaurarlo
        if (previousCell.type === "player" && previousCell.underlay === "switch" && previousCell.switchId) {
          newGrid[gameState.playerPos.y][gameState.playerPos.x] = { type: "switch", id: previousCell.switchId }
        } else if (previousCell.type === "switch") {
          newGrid[gameState.playerPos.y][gameState.playerPos.x] = { type: "switch", id: previousCell.id }
        } else {
          newGrid[gameState.playerPos.y][gameState.playerPos.x] = { type: "empty" }
        }
        
        // Si el jugador se mueve a un switch, mantener el switch como underlay
        if (targetCell.type === "switch") {
          newGrid[newY][newX] = { type: "player", underlay: "switch", switchId: targetCell.id }
        } else {
          newGrid[newY][newX] = { type: "player" }
        }
        playMoveSound()

        setGameState({
          grid: newGrid,
          playerPos: { x: newX, y: newY },
          keysCollected: newKeysCollected,
          switchesActive: gameState.switchesActive,
          moves: gameState.moves + 1,
          isComplete,
          requirements: gameState.requirements,
        })
        
        setDoorsUnlocked(newDoorsUnlocked)
      }
    },
    [gameState, isPaused, doorsUnlocked, currentLevel],
  )

  const handleReset = useCallback(() => {
    setGameState(createLevel(currentLevel))
    setTime(0)
    setShowLevelComplete(false)
    setDoorsUnlocked(0)
    setWarningMessage("")
  }, [currentLevel])

  const handleNextLevel = useCallback(() => {
    setShowMap(true)
    setShowLevelComplete(false)
  }, [])

  const handleReturnToStart = useCallback(() => {
    setShowMap(true)
    setShowLevelComplete(false)
  }, [])

  const handleResetAll = useCallback(() => {
    // Resetear todo el progreso
    localStorage.removeItem('nexus_progress')
    setCompletedLevels(new Set<number>())
    setScore(0)
    setFragmentsCollected(0)
    setSecretLevelsUnlocked([])
    setCurrentLevel(1)
    setGameState(createLevel(1))
    setTime(0)
    setShowLevelComplete(false)
    setDoorsUnlocked(0)
    setWarningMessage("")
    setShowMap(true)
  }, [])

  const handleSelectLevel = useCallback((level: number) => {
    setCurrentLevel(level)
    setGameState(createLevel(level))
    setTime(0)
    setShowMap(false)
    setShowLevelComplete(false)
    setDoorsUnlocked(0)
    setWarningMessage("")
    // Fragmentos se mantienen entre niveles
  }, [])


  useGameControls({
    onMove: handleMove,
    onReset: handleReset,
    isPaused,
    isComplete: gameState.isComplete,
  })

  if (showMap) {
    return (
      <LevelMap
        onSelectLevel={handleSelectLevel}
        completedLevels={completedLevels}
        currentLevel={currentLevel}
        secretLevelsUnlocked={secretLevelsUnlocked}
        onResetAll={handleResetAll}
      />
    )
  }

  const levelConfig = LEVELS.find((l) => l.number === currentLevel)
  const requirements =
    gameState.requirements ??
    getLevelRequirements(currentLevel) ?? {
      totalKeys: levelConfig?.totalKeys || 0,
      totalSwitches: levelConfig?.requiredSwitches || 0,
    }
  const requiredSwitches = requirements.totalSwitches || 0
  const totalKeys = requirements.totalKeys || 0
  const switchProgress = requiredSwitches > 0 ? (gameState.switchesActive.size / requiredSwitches) * 50 : 0
  const keyProgress = totalKeys > 0 ? (gameState.keysCollected / totalKeys) * 25 : 0
  const goalProgress = gameState.isComplete ? 25 : 0
  const progress = Math.min(100, switchProgress + keyProgress + goalProgress)

  const objectives = getLevelObjectives(currentLevel, requirements)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0f1729] to-[#0a0f1a] flex flex-col p-4" style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx global>{`
        body::-webkit-scrollbar,
        *::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
      <GameUI
        time={time}
        score={score}
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused(!isPaused)}
        progress={progress}
        keysCollected={gameState.keysCollected}
        totalKeys={totalKeys}
        fragmentsCollected={fragmentsCollected}
        onReturnToStart={handleReturnToStart}
        onReset={handleReset}
        muted={muted}
        onToggleMute={() => setMuted(!muted)}
        volume={volume}
        onVolumeChange={(newVolume) => {
          setVolume(newVolume)
          if (newVolume > 0) setMuted(false)
        }}
      />

      {warningMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-red-600/90 border-2 border-red-400 rounded-xl px-8 py-4 shadow-2xl backdrop-blur-md max-w-md">
            <p className="text-white font-bold text-base text-center whitespace-pre-line">{warningMessage}</p>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-start justify-center gap-6 mt-24 mb-8 px-4 overflow-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="hidden xl:flex flex-col gap-3 w-64 flex-shrink-0">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-5">
            <h3 className="text-cyan-400/80 font-light text-sm mb-4 uppercase tracking-wider text-center">Objetivos</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {objectives.map((objective, index) => (
                <div 
                  key={index} 
                  className={`${
                    objective.startsWith('⚠️') 
                      ? 'bg-red-500/10 border border-red-500/30 text-red-300/90 rounded-lg p-3' 
                      : 'bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3'
                  } flex items-start gap-2`}
                >
                  <span className="text-xs font-light leading-relaxed flex-1 text-left break-words whitespace-normal">
                    {objective.replace('⚠️ ', '')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <RewardsPanel 
            achievements={achievements}
            fragmentsCollected={fragmentsCollected}
            secretLevelsUnlocked={secretLevelsUnlocked}
          />
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="text-center animate-fade-in">
            <h2 className="text-xl font-display font-light text-cyan-400/80 tracking-wider">
              {levelConfig?.name}
            </h2>
          </div>

          <GameBoard
            grid={gameState.grid}
            cellSize={90}
            keysCollected={gameState.keysCollected}
            switchesActive={gameState.switchesActive}
          />
        </div>

        <div className="hidden lg:block xl:hidden w-64 flex-shrink-0">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-5">
            <h3 className="text-cyan-400/80 font-light text-sm mb-4 uppercase tracking-wider text-center">Objetivos</h3>
            <div className="space-y-3">
              {objectives.map((objective, index) => (
                <div 
                  key={index} 
                  className={`${
                    objective.startsWith('⚠️') 
                      ? 'bg-red-500/10 border border-red-500/30 text-red-300/90 rounded-lg p-3' 
                      : 'bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3'
                  } flex items-start gap-2`}
                >
                  <span className="text-sm font-light leading-relaxed flex-1 text-left">
                    {objective.replace('⚠️ ', '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {newReward && (
        <RewardNotification
          reward={newReward.reward}
          onClose={() => setNewReward(null)}
        />
      )}

      {showLevelComplete && (
        <LevelCompleteModal
          levelNumber={currentLevel}
          time={time}
          moves={gameState.moves}
          score={levelScore}
          onNextLevel={handleNextLevel}
          onRestart={handleReset}
          isLastLevel={currentLevel === LEVELS.length}
        />
      )}
    </div>
  )
}

"use client"

interface LevelCompleteModalProps {
  levelNumber: number
  time: number
  moves: number
  score: number
  onNextLevel: () => void
  onRestart: () => void
  isLastLevel: boolean
}

export function LevelCompleteModal({
  levelNumber,
  time,
  moves,
  score,
  onNextLevel,
  onRestart,
  isLastLevel,
}: LevelCompleteModalProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${String(seconds).padStart(2, "0")}`
  }

  // Calculate performance rating
  const getPerformanceRating = () => {
    if (moves <= 10 && time < 30000) return { 
      text: "¡PERFECTO!", 
      color: "text-cyan-400",
      description: "Rendimiento excepcional"
    }
    if (moves <= 20 && time < 60000) return { 
      text: "¡EXCELENTE!", 
      color: "text-green-400",
      description: "Muy bien ejecutado"
    }
    if (moves <= 30) return { 
      text: "¡BIEN HECHO!", 
      color: "text-yellow-400",
      description: "Buen trabajo"
    }
    return { 
      text: "¡COMPLETADO!", 
      color: "text-blue-400",
      description: "Nivel superado"
    }
  }

  const rating = getPerformanceRating()

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-8 text-center max-w-md w-full mx-4 animate-fade-in">
        <div className="mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/40 via-blue-400/30 to-cyan-500/40 blur-sm"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-300/60 to-blue-400/60 border border-cyan-400/50"></div>
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-cyan-200/80 to-blue-300/80 animate-pulse"></div>
          </div>
          <h2 className={`text-2xl font-light ${rating.color} mb-2`}>
            {rating.text}
          </h2>
          <p className="text-sm text-cyan-400/60 mb-1">Nivel {levelNumber} Completado</p>
        </div>

        <div className="space-y-4 mb-8 bg-slate-800/30 rounded-lg p-6 border border-cyan-500/10">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-2">
                <span className="text-cyan-400/80 text-lg">⏱️</span>
              </div>
              <p className="text-xs text-cyan-400/50 font-light uppercase tracking-wider mb-1">Tiempo</p>
              <p className="text-base text-cyan-400/80 font-light font-mono">{formatTime(time)}</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-400/80 text-lg">👣</span>
              </div>
              <p className="text-xs text-blue-400/50 font-light uppercase tracking-wider mb-1">Movimientos</p>
              <p className="text-base text-blue-400/80 font-light font-mono">{moves}</p>
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent my-4" />
          
          <div className="text-center">
            <div className="relative w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-2">
              <span className="text-yellow-400/80 text-xl">⭐</span>
              <div className="absolute inset-0 rounded-lg bg-yellow-400/20 blur-xl animate-pulse" />
            </div>
            <p className="text-xs text-yellow-400/50 font-light uppercase tracking-wider mb-1">Puntos Ganados</p>
            <p className="text-3xl text-yellow-400 font-light font-mono animate-pulse">
              +{score.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 px-4 py-3 bg-slate-800/40 hover:bg-slate-700/60 text-cyan-400/80 border border-cyan-500/30 hover:border-cyan-400/60 rounded-lg transition-all duration-200 text-sm font-light tracking-wider"
          >
            Reintentar
          </button>
          <button
            onClick={onNextLevel}
            className="flex-1 px-4 py-3 bg-slate-800/40 hover:bg-slate-700/60 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/60 rounded-lg transition-all duration-200 text-sm font-light tracking-wider"
          >
            {isLastLevel ? "Volver al Mapa" : "Siguiente Nivel"}
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Pause, Play, Home, RotateCcw, Volume2, VolumeX } from 'lucide-react'

interface GameUIProps {
  time: number
  score: number
  isPaused: boolean
  onPauseToggle: () => void
  progress: number
  keysCollected?: number
  totalKeys?: number
  fragmentsCollected?: number
  onReturnToStart?: () => void
  onReset?: () => void // Added reset callback
  muted?: boolean
  onToggleMute?: () => void
  volume?: number
  onVolumeChange?: (volume: number) => void
}

export function GameUI({
  time,
  score,
  isPaused,
  onPauseToggle,
  progress,
  keysCollected = 0,
  totalKeys = 0,
  fragmentsCollected = 0,
  onReturnToStart,
  onReset, // Added reset prop
  muted = false,
  onToggleMute,
  volume = 0.5,
  onVolumeChange,
}: GameUIProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 py-3 animate-slide-in">
      <div className="flex items-center justify-between gap-6 bg-slate-900/60 backdrop-blur-xl border-b border-cyan-500/20 px-8 py-3">
        {/* Timer */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-cyan-400 text-lg">⏱️</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-cyan-400/50 font-light uppercase tracking-wider">Tiempo</span>
            <span className="text-lg font-light text-cyan-400 tracking-wider font-mono">
              {formatTime(time)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-3">
            <span className="text-xs text-cyan-400/50 font-light uppercase tracking-wider">Progreso</span>
            <div className="flex-1 h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-cyan-400/70 font-light font-mono min-w-[3rem] text-right">
              {Math.round(progress)}%
            </span>
          </div>
        </div>


        {/* Score */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <span className="text-yellow-400 text-lg">⭐</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-yellow-400/50 font-light uppercase tracking-wider">Puntos</span>
            <span className="text-lg font-light text-yellow-400 tracking-wider font-mono">
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        {totalKeys > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
              <span className="text-orange-400 text-lg">🔑</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-orange-400/50 font-light uppercase tracking-wider">Llaves</span>
              <span className="text-lg font-light text-orange-400 tracking-wider font-mono">
                {keysCollected}/{totalKeys}
              </span>
            </div>
          </div>
        )}

        {fragmentsCollected > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 text-lg">✨</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-blue-400/50 font-light uppercase tracking-wider">Fragmentos</span>
              <span className="text-lg font-light text-blue-400 tracking-wider font-mono">
                {fragmentsCollected}
              </span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="w-10 h-10 bg-slate-800/40 hover:bg-slate-700/60 border border-orange-500/30 hover:border-orange-400/60 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              title="Reiniciar nivel"
            >
              <RotateCcw className="w-4 h-4 text-orange-400/80" />
            </button>
          )}
          {onReturnToStart && (
            <button
              onClick={onReturnToStart}
              className="w-10 h-10 bg-slate-800/40 hover:bg-slate-700/60 border border-blue-500/30 hover:border-blue-400/60 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              title="Volver al mapa"
            >
              <Home className="w-4 h-4 text-blue-400/80" />
            </button>
          )}
          <button
            onClick={onPauseToggle}
            className="w-10 h-10 bg-slate-800/40 hover:bg-slate-700/60 border border-cyan-500/30 hover:border-cyan-400/60 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            title={isPaused ? "Reanudar juego" : "Pausar juego"}
          >
            {isPaused ? (
              <Play className="w-4 h-4 text-cyan-400/80" fill="currentColor" />
            ) : (
              <Pause className="w-4 h-4 text-cyan-400/80" fill="currentColor" />
            )}
          </button>
          {onToggleMute && (
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleMute}
                className="w-10 h-10 bg-slate-800/40 hover:bg-slate-700/60 border border-cyan-500/30 hover:border-cyan-400/60 rounded-lg flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                title={muted ? "Activar sonido" : "Silenciar"}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 text-cyan-400/80" />
                ) : (
                  <Volume2 className="w-4 h-4 text-cyan-400/80" />
                )}
              </button>
              {onVolumeChange && !muted && (
                <div className="flex items-center gap-2 w-24">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    style={{
                      background: `linear-gradient(to right, rgb(6, 182, 212) 0%, rgb(6, 182, 212) ${volume * 100}%, rgba(51, 65, 85, 0.5) ${volume * 100}%, rgba(51, 65, 85, 0.5) 100%)`
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

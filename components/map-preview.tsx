"use client"

import { LEVELS } from "@/lib/game-logic"
import { NODE_CONNECTIONS, NODE_POSITIONS } from "@/lib/map-data"

const difficultyColors = {
  easy: "from-green-400 via-emerald-500 to-green-600",
  medium: "from-yellow-400 via-amber-500 to-yellow-600",
  hard: "from-orange-400 via-red-500 to-orange-600",
  "very-hard": "from-rose-500 via-red-600 to-rose-700",
}

const getDifficulty = (level: number) => {
  if ([1, 4, 7, 12, 16, 20, 23].includes(level)) return "easy"
  if ([2, 5, 9, 13, 17, 21, 24].includes(level)) return "medium"
  if ([3, 6, 10, 14, 18, 22].includes(level)) return "hard"
  return "very-hard"
}

export function MapPreview() {
  return (
    <div className="bg-slate-950/30 border border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-0">
        <div className="relative min-h-[600px] lg:min-h-[700px] overflow-auto map-preview-scroll">
          <div className="relative min-h-[1100px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="previewLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(14,165,233,0.9)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.8)" />
                </linearGradient>
                <filter id="previewGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {NODE_CONNECTIONS.map(([from, to], index) => {
                const fromPos = NODE_POSITIONS[from]
                const toPos = NODE_POSITIONS[to]
                return (
                  <line
                    key={`preview-line-${index}`}
                    x1={`${fromPos.x}%`}
                    y1={`${fromPos.y * 11}px`}
                    x2={`${toPos.x}%`}
                    y2={`${toPos.y * 11}px`}
                    stroke="url(#previewLine)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.5"
                    filter="url(#previewGlow)"
                  />
                )
              })}
            </svg>

            {LEVELS.map((level, index) => {
              const position = NODE_POSITIONS[index]
              if (!position) return null
              const difficulty = getDifficulty(level.number) as keyof typeof difficultyColors
              return (
                <div
                  key={`preview-node-${level.number}`}
                  className="absolute flex flex-col items-center gap-2 text-center"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y * 11}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${difficultyColors[difficulty]} border-2 border-white/40 shadow-[0_0_20px_rgba(6,182,212,0.4)]`}
                  />
                  <div className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs text-white/80 tracking-wide">
                    Nivel {level.number}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-slate-900/60 p-6 flex flex-col gap-5">
          <div>
            <p className="text-cyan-400/60 text-xs uppercase tracking-[0.3em]">Vista libre</p>
            <h3 className="text-2xl font-light text-white mt-2">Explora todo el mapa</h3>
            <p className="text-slate-300/70 text-sm leading-relaxed mt-3">
              Observa todas las rutas, bifurcaciones y finales de Nexus sin importar tu progreso. Usa esta vista previa para planificar qué camino seguir antes de desbloquearlo en el juego real.
            </p>
          </div>
          <div className="space-y-3">
            <div className="border border-cyan-500/30 rounded-xl p-4">
              <p className="text-cyan-300/70 text-xs uppercase tracking-wider mb-2">Dificultades</p>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full text-xs bg-green-500/10 border border-green-500/40 text-green-300">Fácil</span>
                <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/10 border border-yellow-500/40 text-yellow-300">Media</span>
                <span className="px-3 py-1 rounded-full text-xs bg-orange-500/10 border border-orange-500/40 text-orange-200">Difícil</span>
                <span className="px-3 py-1 rounded-full text-xs bg-rose-500/10 border border-rose-500/40 text-rose-200">Extrema</span>
              </div>
            </div>
            <div className="border border-emerald-500/20 rounded-xl p-4 bg-emerald-500/5">
              <p className="text-emerald-300 text-sm font-light">Cada nodo que completes en el juego principal libera recompensas acumulativas. Aquí puedes simular tu ruta ideal y decidir qué logros buscas primero.</p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .map-preview-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .map-preview-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}


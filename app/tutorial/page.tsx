"use client"

import { useRouter } from 'next/navigation'
import { Home, ArrowLeft } from 'lucide-react'

export default function TutorialPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0f1729] to-[#0a0f1a] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => router.push("/")}
            className="w-12 h-12 bg-slate-900/40 hover:bg-slate-800/60 border border-cyan-500/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-cyan-400/60 backdrop-blur-sm"
            title="Volver al inicio"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400/80" />
          </button>
          <div>
            <h1 className="text-5xl font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 tracking-wider mb-2">
              NEXUS
            </h1>
            <p className="text-cyan-400/60 text-sm font-light tracking-wider">
              Guía de Conocimiento
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-cyan-400 text-xl">🎮</span>
            </div>
            <h2 className="text-2xl font-light text-cyan-400/80 tracking-wider">Controles</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/40 border border-cyan-500/20 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded px-3 py-2 font-mono text-cyan-400 text-sm font-light">
                  WASD
                </div>
              </div>
              <p className="text-cyan-300/70 text-sm font-light">Mover tu entidad luminosa</p>
            </div>

            <div className="bg-slate-800/40 border border-cyan-500/20 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded px-3 py-2 font-mono text-cyan-400 text-sm font-light">
                  SPACE
                </div>
              </div>
              <p className="text-cyan-300/70 text-sm font-light">Reiniciar el nivel</p>
            </div>

            <div className="bg-slate-800/40 border border-cyan-500/20 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded px-3 py-2 font-mono text-cyan-400 text-sm font-light">
                  ESC
                </div>
              </div>
              <p className="text-cyan-300/70 text-sm font-light">Pausar o reanudar</p>
            </div>
          </div>
        </div>

        {/* Game Elements Section */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <span className="text-green-400 text-xl">🎯</span>
            </div>
            <h2 className="text-2xl font-light text-green-400/80 tracking-wider">Elementos del Juego</h2>
          </div>
          
          <div className="space-y-4">
            {/* Entidad Luminosa */}
            <div className="flex items-start gap-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-5">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💫</span>
              </div>
              <div className="flex-1">
                <h3 className="text-cyan-400 font-light text-base mb-1">Entidad Luminosa</h3>
                <p className="text-cyan-300/60 text-sm font-light leading-relaxed">
                  Tu personaje es una entidad abstracta de forma geométrica. Muévela con WASD para interactuar con el universo de Nexus.
                </p>
              </div>
            </div>

            {/* Keys */}
            <div className="flex items-start gap-4 bg-orange-500/5 border border-orange-500/20 rounded-lg p-5">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔑</span>
              </div>
              <div className="flex-1">
                <h3 className="text-orange-400 font-light text-base mb-1">Llaves Doradas</h3>
                <p className="text-orange-300/60 text-sm font-light leading-relaxed">
                  Recoge las llaves para desbloquear puertas. Son obligatorias si el nivel las requiere.
                </p>
              </div>
            </div>

            {/* Blocks */}
            <div className="flex items-start gap-4 bg-green-500/5 border border-green-500/20 rounded-lg p-5">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📦</span>
              </div>
              <div className="flex-1">
                <h3 className="text-green-400 font-light text-base mb-1">Bloques Verdes</h3>
                <p className="text-green-300/60 text-sm font-light leading-relaxed">
                  Empuja los bloques verdes con tu entidad para moverlos. Solo puedes empujarlos, no jalarlos. Úsalos estratégicamente para activar interruptores o crear caminos bloqueando pasajes.
                </p>
              </div>
            </div>

            {/* Switches */}
            <div className="flex items-start gap-4 bg-purple-500/5 border border-purple-500/20 rounded-lg p-5">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="flex-1">
                <h3 className="text-purple-400 font-light text-base mb-1">Interruptores Violetas</h3>
                <p className="text-purple-300/60 text-sm font-light leading-relaxed">
                  Los interruptores solo se activan cuando colocas un bloque verde sobre ellos. NO puedes activarlos directamente con tu entidad. Debes empujar un bloque hasta el interruptor para activarlo. Algunos niveles requieren activar múltiples interruptores.
                </p>
              </div>
            </div>

            {/* Doors */}
            <div className="flex items-start gap-4 bg-amber-500/5 border border-amber-500/20 rounded-lg p-5">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🚪</span>
              </div>
              <div className="flex-1">
                <h3 className="text-amber-400 font-light text-base mb-1">Puertas Cerradas</h3>
                <p className="text-amber-300/60 text-sm font-light leading-relaxed">
                  Las puertas bloquean tu paso. Para abrirlas, primero debes recoger las llaves doradas requeridas. Una vez que tengas suficientes llaves, la puerta se abrirá automáticamente y podrás pasar libremente. Las puertas abiertas se vuelven transparentes.
                </p>
              </div>
            </div>

            {/* Portal */}
            <div className="flex items-start gap-4 bg-blue-500/5 border border-blue-500/20 rounded-lg p-5">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🌀</span>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-400 font-light text-base mb-1">Portal</h3>
                <p className="text-blue-300/60 text-sm font-light leading-relaxed">
                  Tu objetivo final. Solo puedes completar el nivel si cumpliste todos los objetivos obligatorios.
                </p>
              </div>
            </div>

            {/* Fragments */}
            <div className="flex items-start gap-4 bg-blue-500/5 border border-blue-500/20 rounded-lg p-5">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✨</span>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-400 font-light text-base mb-1">Fragmentos de Conocimiento</h3>
                <p className="text-blue-300/60 text-sm font-light leading-relaxed">
                  Recolecta estos íconos de energía para desbloquear nodos secretos o niveles alternativos.
                </p>
              </div>
            </div>

            {/* Walls */}
            <div className="flex items-start gap-4 bg-red-500/5 border border-red-500/20 rounded-lg p-5">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🧱</span>
              </div>
              <div className="flex-1">
                <h3 className="text-red-400 font-light text-base mb-1">Muros</h3>
                <p className="text-red-300/60 text-sm font-light leading-relaxed">
                  Obstáculos inamovibles que delimitan el mapa. No puedes atravesarlos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <span className="text-purple-400 text-xl">💡</span>
            </div>
            <h2 className="text-2xl font-light text-purple-400/80 tracking-wider">Consejos</h2>
          </div>
          
          <ul className="space-y-3 text-purple-300/70 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-light mt-0.5">⚠️</span>
              <span className="font-light"><span className="text-purple-400/80">Objetivos obligatorios:</span> Completa todos los objetivos antes de llegar al portal.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-light mt-0.5">✓</span>
              <span className="font-light"><span className="text-purple-400/80">Planifica:</span> Algunos bloques pueden quedar atrapados si no tienes cuidado.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-light mt-0.5">✓</span>
              <span className="font-light"><span className="text-purple-400/80">Múltiples caminos:</span> Elige tu ruta en el mapa nodal según la dificultad.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-light mt-0.5">✨</span>
              <span className="font-light"><span className="text-purple-400/80">Fragmentos:</span> Recolecta fragmentos para desbloquear niveles secretos.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-light mt-0.5">⭐</span>
              <span className="font-light"><span className="text-purple-400/80">Puntuación:</span> Menos movimientos = más puntos.</span>
            </li>
          </ul>
        </div>

        {/* Play Button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/play")}
            className="bg-slate-900/40 hover:bg-slate-800/60 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-400 font-light text-base px-12 py-4 rounded-lg transition-all duration-200 backdrop-blur-sm tracking-wider hover:scale-105"
          >
            Comenzar a Jugar
          </button>
        </div>
      </div>
    </div>
  )
}

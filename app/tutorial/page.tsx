"use client"

import { useRouter } from 'next/navigation'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { useState, useEffect } from 'react'
import { setGlobalAudioMuted, setGlobalAudioVolume } from '@/lib/audio'

export default function TutorialPage() {
  const router = useRouter()
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.5) // Valor inicial consistente para SSR
  const [mounted, setMounted] = useState(false)

  // Cargar valores desde localStorage solo después de montar (cliente)
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('nexus_volume')
      if (savedVolume) {
        const parsedVolume = parseFloat(savedVolume)
        setVolume(parsedVolume)
        setGlobalAudioVolume(parsedVolume)
      } else {
        setGlobalAudioVolume(0.5)
        localStorage.setItem('nexus_volume', '0.5')
      }
    }
  }, [])

  useEffect(() => {
    setGlobalAudioMuted(muted)
  }, [muted])

  useEffect(() => {
    if (mounted) {
      setGlobalAudioVolume(volume)
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexus_volume', volume.toString())
      }
    }
  }, [volume, mounted])
  const rewardTrail = [
    { title: "Primeros nodos", detail: "1–3", reward: "Fragmento base ✨" },
    { title: "Rutas medias", detail: "4–10", reward: "Cofre luminoso 🧿" },
    { title: "Zonas avanzadas", detail: "11–18", reward: "Llave ancestral 🔓" },
    { title: "Cúspide Nexus", detail: "19–25", reward: "Corona de datos 🏆" },
  ]

  const controlScheme = [
    { key: "WASD", title: "Moverte", detail: "Desplázate por el tablero con suavidad y analiza cada casilla antes de avanzar." },
    { key: "Barra espaciadora", title: "Reiniciar al instante", detail: "Reinicia el nivel sin penalización para probar nuevas rutas cuando algo salga mal." },
    { key: "Clic izquierdo", title: "Interactuar", detail: "Activa portales, botones contextuales y confirma opciones en la interfaz minimalista." },
    { key: "ESC", title: "Pausar / menú", detail: "Pausa la sesión, ajusta volumen y vuelve al mapa sin perder tu progreso." },
  ]

  const treatmentHighlights = [
    { title: "Tipo de juego", detail: "Puzzle / estrategia lógica 2D single player para PC." },
    { title: "Público objetivo", detail: "Jóvenes y adultos de 15 a 30 años que aman los desafíos cognitivos." },
    { title: "Clasificación ESRB", detail: "E (Everyone). Sin violencia ni lenguaje inapropiado." },
    { title: "Lanzamiento estimado", detail: "Noviembre 2025." },
  ]

  const treatmentPillars = [
    {
      title: "Mundo y narrativa",
      paragraph:
        "Despiertas en un universo abstracto de fragmentos de conocimiento suspendidos. Cada nodo es una idea que perdió su enlace y debes reactivarla resolviendo acertijos.",
      bullets: [
        "Mapa nodal = mente del jugador.",
        "Nodos verdes, amarillos y rojos marcan dificultad.",
        "Cada conexión restablecida ilumina el pensamiento.",
      ],
    },
    {
      title: "Flujo y progresión",
      paragraph:
        "Puedes avanzar de forma no lineal: eliges rutas según los nodos desbloqueados, iluminando nuevas líneas cada vez que completas un puzzle.",
      bullets: [
        "Mapa → nivel 2D → resultados → mapa iluminado.",
        "No hay game over. Reinicios instantáneos fomentan la experimentación.",
        "Los niveles maestros combinan todas las mecánicas aprendidas.",
      ],
    },
    {
      title: "Retos y jugabilidad",
      paragraph:
        "El sistema privilegia la claridad lógica: cada elemento tiene una función precisa y combinable para crear secuencias complejas.",
      bullets: [
        "Resolver en el menor número de movimientos.",
        "Identificar patrones entre bloques, llaves, interruptores y puertas.",
        "Superar niveles especiales con reglas combinadas o condiciones extra.",
      ],
    },
  ]

  const emotionAudio = [
    "Curiosidad, calma y sensación de flujo mental.",
    "Música ambiental electrónica: sintetizadores suaves, sin percusión pesada.",
    "Feedback sutil: pulsos de luz, ecos electrónicos, silencio entre niveles.",
  ]

  const extraContent = [
    "Fragmentos de Conocimiento para desbloquear nodos secretos.",
    "Orbes de Claridad: muestran rutas o deshacen un movimiento en niveles especiales.",
    "Logros cognitivos (Analítico, Curioso) y modo desafío con condiciones opcionales.",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0f1729] to-[#0a0f1a] p-8" style={{ height: '100vh', overflowY: 'auto' }}>
      <div className="max-w-5xl mx-auto pb-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
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
          {/* Control de audio */}
          <div className="flex items-center gap-3 group">
            {mounted && (
              <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm border border-cyan-500/30 rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  style={{
                    background: `linear-gradient(to right, rgb(6, 182, 212) 0%, rgb(6, 182, 212) ${volume * 100}%, rgba(51, 65, 85, 0.5) ${volume * 100}%, rgba(51, 65, 85, 0.5) 100%)`
                  }}
                />
              </div>
            )}
            <button
              onClick={() => setMuted(!muted)}
              className="w-12 h-12 bg-slate-900/60 hover:bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              title={muted ? "Activar sonido" : "Silenciar"}
            >
              {muted ? (
                <VolumeX className="w-5 h-5 text-cyan-400/80" />
              ) : (
                <Volume2 className="w-5 h-5 text-cyan-400/80" />
              )}
            </button>
          </div>
        </div>

        {/* Cómo jugar - Visual */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <span className="text-cyan-300 text-2xl">🧭</span>
            </div>
            <h2 className="text-3xl font-light text-cyan-100 tracking-wider">Cómo jugar</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {controlScheme.map((control) => (
              <div key={control.key} className="bg-gradient-to-br from-slate-950/60 to-slate-900/40 border border-cyan-500/30 rounded-xl p-5 text-center hover:scale-105 transition-all duration-200 hover:border-cyan-400/50">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">
                    {control.key === "WASD" ? "⬆️" : 
                     control.key === "Barra espaciadora" ? "⏸️" :
                     control.key === "Clic izquierdo" ? "👆" : "⏸️"}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-wider text-cyan-300/80 font-medium mb-2">{control.key}</p>
                <h3 className="text-cyan-100 text-base font-light mb-1">{control.title}</h3>
                <p className="text-cyan-200/60 text-xs leading-relaxed">{control.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recompensas */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-8 mb-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-emerald-300 text-xl">⭐</span>
            </div>
            <div>
              <h2 className="text-2xl font-light text-emerald-100 tracking-wider">Recompensas y sorpresas</h2>
              <p className="text-emerald-200/60 text-sm font-light">
                Recolecta fragmentos para despertar nodos ocultos, desbloquear cofres conceptuales y acceder a puzzles maestros.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewardTrail.map((step) => (
              <div key={step.title} className="bg-slate-950/40 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70 mb-2">{step.title}</p>
                <p className="text-white text-2xl font-light">{step.detail}</p>
                <p className="text-emerald-100/70 text-sm mt-3">{step.reward}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 border border-purple-500/30 rounded-xl p-4">
              <p className="text-purple-200/70 text-xs uppercase tracking-[0.4em] mb-2">Nodos secretos</p>
              <p className="text-white text-sm leading-relaxed">
                Con 5, 10 y 15 fragmentos desbloqueas <span className="text-purple-200 font-medium">Umbral Resonante (26)</span>,
                <span className="text-purple-200 font-medium"> Memoria Fractal (27)</span> y
                <span className="text-purple-200 font-medium"> Horizonte Perdido (28)</span>, cada uno con reglas sorpresa.
              </p>
            </div>
            <div className="bg-slate-950/40 border border-cyan-500/30 rounded-xl p-4">
              <p className="text-cyan-200/70 text-xs uppercase tracking-[0.4em] mb-2">Factor sorpresa</p>
              <p className="text-white text-sm leading-relaxed">
                Orbes de claridad, bloques espectrales y mensajes ocultos aparecerán aleatoriamente cuando resuelvas nodos críticos del mapa.
              </p>
            </div>
          </div>
        </div>

        {/* Game Elements Section - Scrollable */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <span className="text-green-400 text-2xl">🎯</span>
            </div>
            <h2 className="text-3xl font-light text-green-400/80 tracking-wider">Elementos del Juego</h2>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Entidad Luminosa */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6 hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-4xl">💫</span>
              </div>
              <div className="flex-1">
                <h3 className="text-cyan-300 font-light text-lg mb-2">Entidad Luminosa</h3>
                <p className="text-cyan-200/70 text-sm font-light leading-relaxed">
                  Tu personaje es una entidad abstracta de forma geométrica. Muévela con WASD para interactuar con el universo de Nexus.
                </p>
              </div>
            </div>

            {/* Keys */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-xl p-6 hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 rounded-xl bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-4xl">🔑</span>
              </div>
              <div className="flex-1">
                <h3 className="text-orange-300 font-light text-lg mb-2">Llaves Doradas</h3>
                <p className="text-orange-200/70 text-sm font-light leading-relaxed">
                  Recoge las llaves para desbloquear puertas. Son obligatorias si el nivel las requiere.
                </p>
                <p className="text-amber-200/80 text-xs mt-2 italic">
                  Candados visibles: cada puerta muestra cuántas llaves necesitas y se vuelve translúcida cuando cumples el requisito.
                </p>
              </div>
            </div>

            {/* Blocks */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 rounded-xl bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-4xl">📦</span>
              </div>
              <div className="flex-1">
                <h3 className="text-green-300 font-light text-lg mb-2">Bloques Verdes</h3>
                <p className="text-green-200/70 text-sm font-light leading-relaxed">
                  Empuja los bloques verdes con tu entidad para moverlos. Solo puedes empujarlos, no jalarlos. Úsalos estratégicamente para activar interruptores o crear caminos bloqueando pasajes.
                </p>
              </div>
            </div>

            {/* Switches */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 rounded-xl bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-4xl">⚡</span>
              </div>
              <div className="flex-1">
                <h3 className="text-purple-300 font-light text-lg mb-2">Interruptores Violetas</h3>
                <p className="text-purple-200/70 text-sm font-light leading-relaxed">
                  Los interruptores solo se activan cuando colocas un bloque verde sobre ellos. NO puedes activarlos directamente con tu entidad. Debes empujar un bloque hasta el interruptor para activarlo. Algunos niveles requieren activar múltiples interruptores.
                </p>
                <p className="text-purple-200/80 text-xs mt-2 italic">
                  Consejo: deja el bloque descansando sobre el switch; si lo retiras, la energía se corta y tendrás que volver a acomodarlo.
                </p>
              </div>
            </div>

            {/* Doors */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-xl p-6 hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 rounded-xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-4xl">🚪</span>
              </div>
              <div className="flex-1">
                <h3 className="text-amber-300 font-light text-lg mb-2">Puertas Cerradas</h3>
                <p className="text-amber-200/70 text-sm font-light leading-relaxed">
                  Las puertas bloquean tu paso. Para abrirlas, primero debes recoger las llaves doradas requeridas. Una vez que tengas suficientes llaves, la puerta se abrirá automáticamente y podrás pasar libremente. Las puertas abiertas se vuelven transparentes.
                </p>
                <p className="text-amber-100/80 text-xs mt-2 italic">
                  Candados sincronizados: cada vez que consumes una llave, la cuenta se resta del nivel, así que planea bien qué puerta abrir primero.
                </p>
              </div>
            </div>

            {/* Portal */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 rounded-xl bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-4xl">🌀</span>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-300 font-light text-lg mb-2">Portal</h3>
                <p className="text-blue-200/70 text-sm font-light leading-relaxed">
                  Tu objetivo final. Solo puedes completar el nivel si cumpliste todos los objetivos obligatorios.
                </p>
              </div>
            </div>

            {/* Fragments */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6 hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 rounded-xl bg-indigo-500/20 border-2 border-indigo-500/40 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-4xl">✨</span>
              </div>
              <div className="flex-1">
                <h3 className="text-indigo-300 font-light text-lg mb-2">Fragmentos de Conocimiento</h3>
                <p className="text-indigo-200/70 text-sm font-light leading-relaxed">
                  Recolecta estos íconos de energía para desbloquear nodos secretos o niveles alternativos.
                </p>
              </div>
            </div>

            {/* Walls */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl p-6 hover:scale-[1.02] transition-all">
              <div className="w-16 h-16 rounded-xl bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-4xl">🧱</span>
              </div>
              <div className="flex-1">
                <h3 className="text-red-300 font-light text-lg mb-2">Muros</h3>
                <p className="text-red-200/70 text-sm font-light leading-relaxed">
                  Obstáculos inamovibles que delimitan el mapa. No puedes atravesarlos.
                </p>
              </div>
            </div>
          </div>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
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

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Play, BookOpen, Map, Volume2, VolumeX } from 'lucide-react'

export default function HomePage() {
  const [showInstructions, setShowInstructions] = useState(false)
  const [muted, setMuted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const audio = new Audio('/ambient.mp3')
    audio.loop = true
    audio.volume = 0.3
    
    if (!muted) {
      audio.play().catch(() => {})
    }

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [muted])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0f1729] to-[#0a0f1a] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Header con título */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-8xl font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 tracking-[0.2em] mb-3 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            NEXUS
          </h1>
          <p className="text-cyan-400/60 text-sm font-light tracking-[0.3em] uppercase">
            Fragmentos de Conocimiento
          </p>
        </div>

        {/* Menú principal */}
        {!showInstructions ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
            {/* Botón JUGAR */}
            <button
              onClick={() => router.push("/play")}
              className="group relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border-2 border-cyan-400/50 hover:border-cyan-400 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-10 h-10 text-white" fill="currentColor" />
                </div>
                <div className="text-center">
                  <h3 className="text-cyan-400 text-xl font-light mb-1 tracking-wider">JUGAR</h3>
                  <p className="text-cyan-400/60 text-xs font-light">Comienza tu aventura</p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/0 to-blue-400/0 group-hover:from-cyan-400/10 group-hover:to-blue-400/10 transition-all duration-300"></div>
            </button>

            {/* Botón CÓMO JUGAR */}
            <button
              onClick={() => setShowInstructions(true)}
              className="group relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border-2 border-green-400/50 hover:border-green-400 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.8)] group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-green-400 text-xl font-light mb-1 tracking-wider">CÓMO JUGAR</h3>
                  <p className="text-green-400/60 text-xs font-light">Aprende los controles</p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/0 to-emerald-400/0 group-hover:from-green-400/10 group-hover:to-emerald-400/10 transition-all duration-300"></div>
            </button>

            {/* Botón NIVELES */}
            <button
              onClick={() => router.push("/play")}
              className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border-2 border-purple-400/50 hover:border-purple-400 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.8)] group-hover:scale-110 transition-transform duration-300">
                  <Map className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-purple-400 text-xl font-light mb-1 tracking-wider">NIVELES</h3>
                  <p className="text-purple-400/60 text-xs font-light">Explora el mapa</p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 transition-all duration-300"></div>
            </button>
          </div>
        ) : (
          // Instrucciones
          <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-8 animate-scale-in max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-light text-cyan-400/80 mb-8 text-center tracking-wider">
              CÓMO JUGAR
            </h2>
            
            <div className="space-y-6 text-cyan-300/70 text-sm leading-relaxed">
              <div>
                <h3 className="text-xs font-light text-cyan-400/60 mb-3 uppercase tracking-wider">Controles</h3>
                <ul className="space-y-2 ml-4 text-xs">
                  <li><span className="text-cyan-400/70 font-mono">WASD</span> - Mover tu entidad luminosa</li>
                  <li><span className="text-cyan-400/70 font-mono">ESPACIO</span> - Reiniciar nivel</li>
                  <li><span className="text-cyan-400/70 font-mono">ESC</span> - Pausar juego</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-light text-cyan-400/60 mb-3 uppercase tracking-wider">Objetivos</h3>
                <ul className="space-y-2 ml-4 text-xs">
                  <li><span className="text-green-400/70">Interruptores</span> - Activa con bloques</li>
                  <li><span className="text-orange-400/70">Llaves</span> - Abre puertas</li>
                  <li><span className="text-cyan-400/70">Fragmentos</span> - Recolecta conocimiento</li>
                  <li><span className="text-blue-400/70">Portal</span> - Completa el nivel</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-light text-cyan-400/60 mb-3 uppercase tracking-wider">Sistema</h3>
                <ul className="space-y-2 ml-4 text-xs">
                  <li>Elige tu camino en el mapa nodal</li>
                  <li>Completa objetivos para avanzar</li>
                  <li>Recolecta fragmentos para desbloquear secretos</li>
                  <li>Minimiza movimientos para mejor puntuación</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={() => setShowInstructions(false)}
              className="w-full mt-8 h-12 text-sm font-light bg-slate-800/40 hover:bg-slate-700/60 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-200 backdrop-blur-sm tracking-wider"
            >
              VOLVER
            </Button>
          </div>
        )}

        {/* Control de audio */}
        <div className="absolute top-8 right-8 z-20">
          <button
            onClick={() => setMuted(!muted)}
            className="w-14 h-14 bg-slate-900/60 hover:bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            title={muted ? "Activar sonido" : "Silenciar"}
          >
            {muted ? (
              <VolumeX className="w-6 h-6 text-cyan-400/80" />
            ) : (
              <Volume2 className="w-6 h-6 text-cyan-400/80" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

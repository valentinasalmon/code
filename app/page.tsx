"use client"

import { useRouter } from 'next/navigation'
import { Play, BookOpen, Map, Volume2, VolumeX } from 'lucide-react'
import { useState, useEffect, startTransition } from 'react'
import { setGlobalAudioMuted, setGlobalAudioVolume } from '@/lib/audio'

export default function HomePage() {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
          {/* Botón JUGAR */}
          <button
            onClick={() => {
              startTransition(() => {
                try {
                  router.push("/play")
                } catch (error) {
                  console.error("Error navigating to /play:", error)
                  window.location.href = "/play"
                }
              })
            }}
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
            onClick={() => {
              startTransition(() => {
                try {
                  router.push("/tutorial")
                } catch (error) {
                  console.error("Error navigating to /tutorial:", error)
                  window.location.href = "/tutorial"
                }
              })
            }}
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
            onClick={() => {
              startTransition(() => {
                try {
                  router.push("/play")
                } catch (error) {
                  console.error("Error navigating to /play:", error)
                  window.location.href = "/play"
                }
              })
            }}
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

        {/* Control de audio */}
        <div className="absolute top-8 right-8 z-20 flex items-center gap-3 group">
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


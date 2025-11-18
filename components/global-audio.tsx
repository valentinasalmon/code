"use client"

import { useEffect, useRef } from "react"

export function GlobalAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    let audio: HTMLAudioElement | undefined = (window as any).__nexusGlobalAudio
    if (!audio) {
      audio = new Audio("/musica juego.mp3")
      audio.loop = true
      // Cargar volumen guardado o usar 0.5 por defecto
      const savedVolume = localStorage.getItem('nexus_volume')
      audio.volume = savedVolume ? parseFloat(savedVolume) : 0.5
      ;(window as any).__nexusGlobalAudio = audio
    } else {
      // Si el audio ya existe, actualizar volumen desde localStorage
      const savedVolume = localStorage.getItem('nexus_volume')
      if (savedVolume) {
        audio.volume = parseFloat(savedVolume)
      }
    }

    audioRef.current = audio
    audio
      .play()
      .catch(() => {
        /* autoplay guard */
      })

    return () => {
      // No pausar el audio al desmontar, debe seguir sonando
    }
  }, [])

  return null
}


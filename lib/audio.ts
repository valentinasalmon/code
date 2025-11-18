export type GlobalAudioHandle = HTMLAudioElement | undefined

declare global {
  interface Window {
    __nexusGlobalAudio?: HTMLAudioElement
  }
}

export const getGlobalAudio = (): GlobalAudioHandle => {
  if (typeof window === "undefined") return undefined
  return window.__nexusGlobalAudio
}

export const setGlobalAudioMuted = (muted: boolean) => {
  const audio = getGlobalAudio()
  if (!audio) return
  audio.muted = muted
  if (!muted && audio.paused) {
    audio.play().catch(() => {})
  }
}

export const setGlobalAudioVolume = (volume: number) => {
  const audio = getGlobalAudio()
  if (!audio) return
  const clamped = Math.max(0, Math.min(1, volume))
  audio.volume = clamped
  if (clamped > 0 && audio.muted) {
    audio.muted = false
  }
  if (audio.paused) {
    audio.play().catch(() => {})
  }
}


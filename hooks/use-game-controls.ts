"use client"

import { useEffect, useCallback } from "react"

export type Direction = "up" | "down" | "left" | "right"

interface UseGameControlsProps {
  onMove: (dirX: number, dirY: number) => void
  onReset: () => void
  isPaused: boolean
  isComplete: boolean
}

export function useGameControls({ onMove, onReset, isPaused, isComplete }: UseGameControlsProps) {
  const handleMove = useCallback(
    (direction: Direction) => {
      if (isPaused || isComplete) return

      switch (direction) {
        case "up":
          onMove(0, -1)
          break
        case "down":
          onMove(0, 1)
          break
        case "left":
          onMove(-1, 0)
          break
        case "right":
          onMove(1, 0)
          break
      }
    },
    [onMove, isPaused, isComplete],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault()
        onReset()
        return
      }

      switch (e.key) {
        case "w":
        case "W":
          e.preventDefault()
          handleMove("up")
          break
        case "s":
        case "S":
          e.preventDefault()
          handleMove("down")
          break
        case "a":
        case "A":
          e.preventDefault()
          handleMove("left")
          break
        case "d":
        case "D":
          e.preventDefault()
          handleMove("right")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleMove, onReset])

  return { handleMove }
}

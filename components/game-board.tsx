"use client"

import { useEffect, useRef } from "react"

export type CellType =
  | "empty"
  | "wall"
  | "player"
  | "block"
  | "switch"
  | "door"
  | "key"
  | "goal"
  | "portal"
  | "fragment"

export interface Cell {
  type: CellType
  active?: boolean
  color?: string
  id?: string
  underlay?: "switch"
  switchId?: string
}

interface GameBoardProps {
  grid: Cell[][]
  cellSize?: number
  keysCollected?: number
  switchesActive?: Set<string>
}

export function GameBoard({ grid, cellSize = 60, keysCollected = 0, switchesActive = new Set() }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Encontrar posición del jugador
  let playerX = 0
  let playerY = 0
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.type === "player") {
        playerX = x
        playerY = y
      }
    })
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        const posX = x * cellSize
        const posY = y * cellSize

        ctx.fillStyle = "rgba(10, 15, 35, 0.6)"
        ctx.fillRect(posX, posY, cellSize, cellSize)

        ctx.strokeStyle = "rgba(50, 80, 150, 0.3)"
        ctx.lineWidth = 1
        ctx.strokeRect(posX, posY, cellSize, cellSize)

        const renderSwitchBase = (isActive: boolean) => {
          if (isActive) {
            ctx.beginPath()
            ctx.arc(posX + cellSize / 2, posY + cellSize / 2, cellSize / 2, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(168, 85, 247, 0.15)"
            ctx.fill()

            ctx.beginPath()
            ctx.arc(posX + cellSize / 2, posY + cellSize / 2, cellSize / 2.5, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(168, 85, 247, 0.25)"
            ctx.fill()
          }

          ctx.beginPath()
          ctx.arc(posX + cellSize / 2, posY + cellSize / 2, cellSize / 2.8, 0, Math.PI * 2)
          const platformGradient = ctx.createRadialGradient(
            posX + cellSize / 2,
            posY + cellSize / 2,
            0,
            posX + cellSize / 2,
            posY + cellSize / 2,
            cellSize / 2.8,
          )

          if (isActive) {
            platformGradient.addColorStop(0, "rgba(168, 85, 247, 1)")
            platformGradient.addColorStop(1, "rgba(139, 92, 246, 0.7)")
          } else {
            platformGradient.addColorStop(0, "rgba(139, 92, 246, 0.6)")
            platformGradient.addColorStop(1, "rgba(124, 58, 237, 0.4)")
          }

          ctx.fillStyle = platformGradient
          ctx.fill()
          ctx.shadowBlur = isActive ? 35 : 12
          ctx.shadowColor = isActive ? "rgba(168, 85, 247, 1)" : "rgba(139, 92, 246, 0.8)"
          ctx.strokeStyle = isActive ? "rgba(168, 85, 247, 1)" : "rgba(139, 92, 246, 0.9)"
          ctx.lineWidth = 5
          ctx.stroke()
          ctx.shadowBlur = 0

          ctx.beginPath()
          ctx.arc(posX + cellSize / 2, posY + cellSize / 2, cellSize / 5, 0, Math.PI * 2)
          ctx.fillStyle = isActive ? "rgba(255, 255, 255, 0.95)" : "rgba(196, 181, 253, 0.8)"
          ctx.fill()

          if (isActive) {
            ctx.beginPath()
            ctx.arc(posX + cellSize / 2, posY + cellSize / 2, cellSize / 7, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
            ctx.fill()

            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI / 4) * i
              const startX = posX + cellSize / 2 + Math.cos(angle) * (cellSize / 5)
              const startY = posY + cellSize / 2 + Math.sin(angle) * (cellSize / 5)
              const endX = posX + cellSize / 2 + Math.cos(angle) * (cellSize / 2.8)
              const endY = posY + cellSize / 2 + Math.sin(angle) * (cellSize / 2.8)

              ctx.beginPath()
              ctx.moveTo(startX, startY)
              ctx.lineTo(endX, endY)
              ctx.strokeStyle = "rgba(167, 139, 250, 0.9)"
              ctx.lineWidth = 3
              ctx.stroke()
            }

            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI / 4) * i
              const circleX = posX + cellSize / 2 + Math.cos(angle) * (cellSize / 3.5)
              const circleY = posY + cellSize / 2 + Math.sin(angle) * (cellSize / 3.5)

              ctx.beginPath()
              ctx.arc(circleX, circleY, cellSize / 20, 0, Math.PI * 2)
              ctx.fillStyle = "rgba(167, 139, 250, 0.8)"
              ctx.fill()
            }
          } else {
            ctx.beginPath()
            ctx.arc(posX + cellSize / 2, posY + cellSize / 2, cellSize / 9, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(60, 60, 80, 0.7)"
            ctx.fill()
          }
        }

        switch (cell.type) {
          case "key": {
            // Sin efectos luminosos, solo el fondo básico
            break
          }

          case "wall": {
            const wallGradient = ctx.createLinearGradient(posX, posY, posX + cellSize, posY + cellSize)
            wallGradient.addColorStop(0, "rgba(40, 60, 120, 0.9)")
            wallGradient.addColorStop(1, "rgba(20, 40, 80, 0.9)")
            ctx.fillStyle = wallGradient
            ctx.fillRect(posX + 2, posY + 2, cellSize - 4, cellSize - 4)
            ctx.shadowBlur = 15
            ctx.shadowColor = "rgba(70, 120, 220, 0.6)"
            ctx.strokeStyle = "rgba(90, 140, 240, 0.9)"
            ctx.lineWidth = 3
            ctx.strokeRect(posX + 2, posY + 2, cellSize - 4, cellSize - 4)
            ctx.shadowBlur = 0
            break
          }

          case "block": {
            if (cell.underlay === "switch") {
              const isActive = cell.switchId ? switchesActive.has(cell.switchId) : false
              renderSwitchBase(isActive)
            }
            const blockGradient = ctx.createRadialGradient(
              posX + cellSize / 2,
              posY + cellSize / 2,
              0,
              posX + cellSize / 2,
              posY + cellSize / 2,
              cellSize / 2.5,
            )
            blockGradient.addColorStop(0, "rgba(34, 197, 94, 0.7)")
            blockGradient.addColorStop(1, "rgba(22, 163, 74, 0.3)")
            ctx.fillStyle = blockGradient
            ctx.fillRect(posX + 8, posY + 8, cellSize - 16, cellSize - 16)
            ctx.shadowBlur = 20
            ctx.shadowColor = "rgba(34, 197, 94, 0.8)"
            ctx.strokeStyle = "rgba(74, 222, 128, 1)"
            ctx.lineWidth = 4
            ctx.strokeRect(posX + 8, posY + 8, cellSize - 16, cellSize - 16)
            ctx.shadowBlur = 0
            break
          }

          case "switch": {
            const switchActive = cell.active || (cell.id && switchesActive.has(cell.id))
            renderSwitchBase(!!switchActive)
            break
          }

          case "player": {
            // Si el jugador está sobre un switch, renderizar el switch primero
            if (cell.underlay === "switch" && cell.switchId) {
              const switchActive = switchesActive.has(cell.switchId)
              renderSwitchBase(switchActive)
            }
            // El jugador se renderiza por separado en el JSX
            break
          }

          case "fragment": {
            // Fragmento de Conocimiento - energía luminosa
            const time = Date.now() / 1000
            const fragmentSize = cellSize / 3 + Math.sin(time * 5) * 3
            
            // Glow pulsante
            ctx.shadowBlur = 20 + Math.sin(time * 5) * 10
            ctx.shadowColor = "rgba(147, 197, 253, 0.9)"
            ctx.beginPath()
            ctx.arc(posX + cellSize / 2, posY + cellSize / 2, fragmentSize, 0, Math.PI * 2)
            const fragmentGradient = ctx.createRadialGradient(
              posX + cellSize / 2,
              posY + cellSize / 2,
              0,
              posX + cellSize / 2,
              posY + cellSize / 2,
              fragmentSize,
            )
            fragmentGradient.addColorStop(0, "rgba(147, 197, 253, 0.9)")
            fragmentGradient.addColorStop(0.5, "rgba(59, 130, 246, 0.6)")
            fragmentGradient.addColorStop(1, "rgba(37, 99, 235, 0.2)")
            ctx.fillStyle = fragmentGradient
            ctx.fill()
            ctx.shadowBlur = 0
            
            // Núcleo brillante
            ctx.beginPath()
            ctx.arc(posX + cellSize / 2, posY + cellSize / 2, fragmentSize / 2, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
            ctx.fill()
            
            // Partículas flotantes
            for (let i = 0; i < 6; i++) {
              const angle = (time * 2 + i * (Math.PI / 3)) % (Math.PI * 2)
              const radius = fragmentSize + 5
              const particleX = posX + cellSize / 2 + Math.cos(angle) * radius
              const particleY = posY + cellSize / 2 + Math.sin(angle) * radius
              ctx.beginPath()
              ctx.arc(particleX, particleY, 2, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(147, 197, 253, ${0.6 + Math.sin(time * 3) * 0.3})`
              ctx.fill()
            }
            break
          }

          case "goal": {
            const time = Date.now() / 1000
            const pulseSize = cellSize / 2.3 + Math.sin(time * 3) * 3
            
            for (let i = 0; i < 3; i++) {
              const ringSize = pulseSize + i * 8
              const opacity = 0.1 - (i * 0.03)
              ctx.beginPath()
              ctx.arc(posX + cellSize / 2, posY + cellSize / 2, ringSize, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`
              ctx.fill()
            }
            
            ctx.beginPath()
            ctx.arc(posX + cellSize / 2, posY + cellSize / 2, pulseSize, 0, Math.PI * 2)
            const goalGradient = ctx.createRadialGradient(
              posX + cellSize / 2,
              posY + cellSize / 2,
              0,
              posX + cellSize / 2,
              posY + cellSize / 2,
              pulseSize,
            )
            goalGradient.addColorStop(0, "rgba(96, 165, 250, 1)")
            goalGradient.addColorStop(0.5, "rgba(59, 130, 246, 0.8)")
            goalGradient.addColorStop(1, "rgba(37, 99, 235, 0.3)")
            ctx.fillStyle = goalGradient
            ctx.fill()
            
            ctx.shadowBlur = 35 + Math.sin(time * 3) * 10
            ctx.shadowColor = "rgba(59, 130, 246, 1)"
            ctx.strokeStyle = "rgba(147, 197, 253, 1)"
            ctx.lineWidth = 4
            ctx.stroke()
            ctx.shadowBlur = 0
            
            ctx.beginPath()
            ctx.arc(posX + cellSize / 2, posY + cellSize / 2, pulseSize / 3, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
            ctx.fill()
            
            for (let i = 0; i < 6; i++) {
              const angle = (time * 2 + i * (Math.PI / 3)) % (Math.PI * 2)
              const particleX = posX + cellSize / 2 + Math.cos(angle) * (pulseSize * 0.7)
              const particleY = posY + cellSize / 2 + Math.sin(angle) * (pulseSize * 0.7)
              
              ctx.beginPath()
              ctx.arc(particleX, particleY, 3, 0, Math.PI * 2)
              ctx.fillStyle = "rgba(147, 197, 253, 0.9)"
              ctx.fill()
            }
            break
          }

          case "portal": {
            const portalGradient = ctx.createRadialGradient(
              posX + cellSize / 2,
              posY + cellSize / 2,
              0,
              posX + cellSize / 2,
              posY + cellSize / 2,
              cellSize / 2.5,
            )
            portalGradient.addColorStop(0, "rgba(255, 0, 255, 0.7)")
            portalGradient.addColorStop(1, "rgba(128, 0, 128, 0.3)")
            ctx.fillStyle = portalGradient
            ctx.fillRect(posX + 8, posY + 8, cellSize - 16, cellSize - 16)
            ctx.shadowBlur = 20
            ctx.shadowColor = "rgba(255, 0, 255, 0.8)"
            ctx.strokeStyle = "rgba(255, 0, 255, 1)"
            ctx.lineWidth = 4
            ctx.strokeRect(posX + 8, posY + 8, cellSize - 16, cellSize - 16)
            ctx.shadowBlur = 0

            ctx.beginPath()
            ctx.arc(posX + cellSize / 2, posY + cellSize / 2, cellSize / 5, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(255, 0, 255, 1)"
            ctx.fill()

            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI / 4) * i
              const startX = posX + cellSize / 2 + Math.cos(angle) * (cellSize / 5)
              const startY = posY + cellSize / 2 + Math.sin(angle) * (cellSize / 5)
              const endX = posX + cellSize / 2 + Math.cos(angle) * (cellSize / 2.8)
              const endY = posY + cellSize / 2 + Math.sin(angle) * (cellSize / 2.8)

              ctx.beginPath()
              ctx.moveTo(startX, startY)
              ctx.lineTo(endX, endY)
              ctx.strokeStyle = "rgba(255, 0, 255, 0.9)"
              ctx.lineWidth = 3
              ctx.stroke()
            }

            for (let i = 0; i < 8; i++) {
              const angle = (Math.PI / 4) * i
              const circleX = posX + cellSize / 2 + Math.cos(angle) * (cellSize / 3.5)
              const circleY = posY + cellSize / 2 + Math.sin(angle) * (cellSize / 3.5)

              ctx.beginPath()
              ctx.arc(circleX, circleY, cellSize / 20, 0, Math.PI * 2)
              ctx.fillStyle = "rgba(255, 0, 255, 0.8)"
              ctx.fill()
            }
            break
          }
        }
      })
    })
  }, [grid, cellSize, switchesActive])

  // Scroll automático para seguir al jugador
  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const playerPixelX = playerX * cellSize
    const playerPixelY = playerY * cellSize
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    
    // Centrar el jugador en la vista
    const scrollX = Math.max(0, playerPixelX - containerWidth / 2 + cellSize / 2)
    const scrollY = Math.max(0, playerPixelY - containerHeight / 2 + cellSize / 2)
    
    container.scrollTo({
      left: scrollX,
      top: scrollY,
      behavior: 'smooth'
    })
  }, [playerX, playerY, cellSize])

  return (
    <div 
      ref={containerRef}
      className="relative animate-fade-in overflow-auto max-h-[80vh] max-w-[90vw] scrollbar-hide"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <canvas
        ref={canvasRef}
        width={grid[0]?.length * cellSize || 0}
        height={grid.length * cellSize || 0}
        className="border-2 border-cyan-500/50 rounded-lg shadow-2xl block"
      />

      {grid.map((row, y) =>
        row.map((cell, x) => {
          if (cell.type === "player") {
            return (
              <div
                key={`player-${x}-${y}`}
                className="absolute transition-all duration-200 ease-out z-[9999]"
                style={{
                  left: x * cellSize + cellSize / 2,
                  top: y * cellSize + cellSize / 2,
                  transform: "translate(-50%, -50%)",
                  width: cellSize,
                  height: cellSize,
                }}
              >
                <div className="absolute inset-0 blur-3xl bg-cyan-400/40 animate-pulse" />
                <div
                  className="relative w-full h-full flex items-center justify-center drop-shadow-[0_0_25px_rgba(14,165,233,0.8)]"
                  style={{ animation: "flameFloat 3s ease-in-out infinite" }}
                >
                  <img
                    src="/avatar.png"
                    alt="Entidad luminosa Nexus"
                    draggable={false}
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                </div>
              </div>
            )
          }

          if (cell.type === "key") {
            return (
              <div
                key={`key-${x}-${y}`}
                className="absolute transition-all duration-200 z-10"
                style={{
                  left: x * cellSize + cellSize / 2,
                  top: y * cellSize + cellSize / 2,
                  transform: "translate(-50%, -50%)",
                  width: cellSize * 0.6,
                  height: cellSize * 0.6,
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-5xl">🔑</span>
                </div>
              </div>
            )
          }

          if (cell.type === "door") {
            const isOpen = cell.active
            return (
              <div
                key={`door-${x}-${y}`}
                className="absolute transition-all duration-500 ease-out z-20"
                style={{ left: x * cellSize, top: y * cellSize, width: cellSize, height: cellSize }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div
                    className={`w-4/5 h-4/5 rounded-xl border-4 transition-all duration-500 ${
                      isOpen
                        ? "border-green-400 bg-green-400/20 shadow-[0_0_30px_rgba(0,255,0,0.7)] scale-110"
                        : "border-orange-400 bg-orange-400/40 shadow-[0_0_25px_rgba(255,165,0,0.6)] scale-100"
                    }`}
                  >
                    {!isOpen && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-2/5 h-2/5 text-orange-400" fill="currentColor" aria-label="Locked">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10z" />
                        </svg>
                      </div>
                    )}
                    {isOpen && (
                      <div className="w-full h-full flex items-center justify-center animate-scale-in">
                        <div className="w-1/2 h-1/2 rounded-lg bg-gradient-to-br from-green-300 to-emerald-400 opacity-60"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          }

          if (cell.type === "portal") {
            return (
              <div
                key={`portal-${x}-${y}`}
                className="absolute transition-all duration-200 z-10"
                style={{
                  left: x * cellSize + cellSize / 2,
                  top: y * cellSize + cellSize / 2,
                  transform: "translate(-50%, -50%)",
                  width: cellSize * 0.7,
                  height: cellSize * 0.7,
                }}
              >
                <div className="relative w-full h-full animate-float">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.9)] animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-300 to-cyan-300"></div>
                  <div className="absolute inset-4 rounded-full bg-blue-200"></div>
                </div>
              </div>
            )
          }

          return null
        }),
      )}

      <style jsx>{`
        @keyframes flameFloat {
          0% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.02);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

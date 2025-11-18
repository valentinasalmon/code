export type Cell =
  | { type: "empty" }
  | { type: "wall" }
  | ({ type: "player"; underlay?: "switch"; switchId?: string })
  | { type: "key" }
  | { type: "door"; active: boolean }
  | ({ type: "block"; underlay?: "switch"; switchId?: string })
  | { type: "switch"; id: string }
  | { type: "goal" }
  | { type: "fragment" } // Fragmento de Conocimiento

export interface LevelRequirements {
  totalKeys: number
  totalSwitches: number
}

const levelRequirementsRegistry = new Map<number, LevelRequirements>()

export interface GameState {
  grid: Cell[][]
  playerPos: { x: number; y: number }
  keysCollected: number
  switchesActive: Set<string>
  moves: number
  isComplete: boolean
  requirements: LevelRequirements
}

export interface Level {
  number: number
  name: string
  totalKeys?: number
  requiredSwitches?: number
}

export const LEVELS: Level[] = [
  { number: 1, name: "Tutorial", totalKeys: 0, requiredSwitches: 0 },
  { number: 2, name: "Primeros Pasos", totalKeys: 1, requiredSwitches: 0 },
  { number: 3, name: "Bloques Móviles", totalKeys: 0, requiredSwitches: 1 },
  { number: 4, name: "Doble Puerta", totalKeys: 2, requiredSwitches: 0 },
  { number: 5, name: "Tesoro Oculto ⭐", totalKeys: 1, requiredSwitches: 1 },
  { number: 6, name: "Laberinto", totalKeys: 2, requiredSwitches: 1 },
  { number: 7, name: "Múltiples Caminos", totalKeys: 2, requiredSwitches: 2 },
  { number: 8, name: "Estrategia Avanzada", totalKeys: 2, requiredSwitches: 2 },
  { number: 9, name: "El Testigo", totalKeys: 3, requiredSwitches: 1 },
  { number: 10, name: "Cámara Secreta ⭐", totalKeys: 3, requiredSwitches: 3 },
  { number: 11, name: "Final Épico", totalKeys: 4, requiredSwitches: 2 },
  { number: 12, name: "Maestría", totalKeys: 4, requiredSwitches: 3 },
  { number: 13, name: "Leyenda en Marcha", totalKeys: 5, requiredSwitches: 3 },
  { number: 14, name: "Ascensión", totalKeys: 5, requiredSwitches: 4 },
  { number: 15, name: "Sala del Maestro ⭐", totalKeys: 6, requiredSwitches: 5 },
  { number: 16, name: "Nueva Era", totalKeys: 2, requiredSwitches: 2 },
  { number: 17, name: "Ruta Alternativa", totalKeys: 3, requiredSwitches: 1 },
  { number: 18, name: "Desafío Dual", totalKeys: 2, requiredSwitches: 3 },
  { number: 19, name: "Laberinto Oscuro", totalKeys: 4, requiredSwitches: 2 },
  { number: 20, name: "Santuario Perdido ⭐", totalKeys: 1, requiredSwitches: 4 },
  { number: 21, name: "Ascenso Rápido", totalKeys: 5, requiredSwitches: 1 },
  { number: 22, name: "Camino Sinuoso", totalKeys: 3, requiredSwitches: 3 },
  { number: 23, name: "Prueba de Fuego", totalKeys: 4, requiredSwitches: 4 },
  { number: 24, name: "La Encrucijada", totalKeys: 2, requiredSwitches: 5 },
  { number: 25, name: "Trono Ancestral ⭐", totalKeys: 6, requiredSwitches: 3 },
  { number: 26, name: "Umbral Resonante", totalKeys: 3, requiredSwitches: 2 },
  { number: 27, name: "Memoria Fractal", totalKeys: 4, requiredSwitches: 3 },
  { number: 28, name: "Horizonte Perdido", totalKeys: 5, requiredSwitches: 4 },
]

const encodeSwitchId = (x: number, y: number) => `${x}-${y}`

function annotateSwitches(grid: Cell[][]): Cell[][] {
  return grid.map((row, y) =>
    row.map((cell, x) => {
      if (cell.type === "switch") {
        return { ...cell, id: encodeSwitchId(x, y) }
      }
      return { ...cell }
    }),
  )
}

function countRequirements(grid: Cell[][]): LevelRequirements {
  let totalKeys = 0
  let totalSwitches = 0
  grid.forEach((row) =>
    row.forEach((cell) => {
      if (cell.type === "key") totalKeys++
      if (cell.type === "switch") totalSwitches++
    }),
  )
  return { totalKeys, totalSwitches }
}

export const getLevelRequirements = (levelNumber: number): LevelRequirements | undefined =>
  levelRequirementsRegistry.get(levelNumber)

function initializeLevel(levelNumber: number, grid: Cell[][], playerPos: { x: number; y: number }): GameState {
  const annotatedGrid = annotateSwitches(grid)
  const requirements = countRequirements(annotatedGrid)
  levelRequirementsRegistry.set(levelNumber, requirements)

  return {
    grid: annotatedGrid,
    playerPos,
    keysCollected: 0,
    switchesActive: new Set<string>(),
    moves: 0,
    isComplete: false,
    requirements,
  }
}

export function createLevel(levelNumber: number): GameState {
  const finalize = (grid: Cell[][], playerPos: { x: number; y: number }) =>
    initializeLevel(levelNumber, grid, playerPos)

  // Level 1: Tutorial - Agrandado con Fragmento de Conocimiento
  if (levelNumber === 1) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "fragment" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 2: First key
  if (levelNumber === 2) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 3: Push blocks on switch
  if (levelNumber === 3) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 4: Two keys, two doors
  if (levelNumber === 4) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 5: Mixed - key and switch
  if (levelNumber === 5) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 6: Labyrinth with keys - FIXED
  if (levelNumber === 6) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 7: Multiple paths with 2 keys and 2 switches
  if (levelNumber === 7) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 8: Complex strategy - FIXED GRID
  if (levelNumber === 8) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "door", active: false }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 9: Three keys challenge
  if (levelNumber === 9) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "door", active: false }, { type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 10: Mastery - 3 keys 3 switches
  if (levelNumber === 10) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "block" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 11: Epic finale - 4 keys 2 switches
  if (levelNumber === 11) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 12: Mastery - 4 keys 3 switches
  if (levelNumber === 12) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "block" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 13: Legend - 5 keys 3 switches
  if (levelNumber === 13) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "block" }, { type: "block" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 14: Ascension - 5 keys 4 switches
  if (levelNumber === 14) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "block" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 15: NEXUS - The Final - 6 keys 5 switches
  if (levelNumber === 15) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "block" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 16: Nueva Era - 2 keys, 2 switches
  if (levelNumber === 16) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 17: Ruta Alternativa
  if (levelNumber === 17) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "wall" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 18: Desafío Dual
  if (levelNumber === 18) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "door", active: false }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 19: Laberinto Oscuro - 4 keys, 2 switches
  if (levelNumber === 19) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 20: Punto de Quiebre
  if (levelNumber === 20) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 21: Ascenso Rápido - 5 keys, 1 switch
  if (levelNumber === 21) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 22: Camino Sinuoso
  if (levelNumber === 22) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 23: Prueba de Fuego - 4 keys, 4 switches
  if (levelNumber === 23) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 24: La Encrucijada - 2 keys, 5 switches
  if (levelNumber === 24) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Level 25: Supremacía - 6 keys, 3 switches
  if (levelNumber === 25) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "door", active: false }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  if (levelNumber === 26) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "door", active: false }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "door", active: false }, { type: "fragment" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  if (levelNumber === 27) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "door", active: false }, { type: "wall" }],
      [{ type: "wall" }, { type: "key" }, { type: "empty" }, { type: "door", active: false }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "key" }, { type: "switch" }, { type: "empty" }, { type: "fragment" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "door", active: false }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  if (levelNumber === 28) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "switch" }, { type: "empty" }, { type: "door", active: false }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "door", active: false }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "door", active: false }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "fragment" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return finalize(grid, { x: 1, y: 1 })
  }

  // Fallback
  const fallbackGrid: Cell[][] = [
    [{ type: "wall" }, { type: "wall" }, { type: "wall" }],
    [{ type: "wall" }, { type: "player" }, { type: "goal" }],
    [{ type: "wall" }, { type: "wall" }, { type: "wall" }],
  ]
  return finalize(fallbackGrid, { x: 1, y: 1 })
}

export function canMove(grid: Cell[][], fromX: number, fromY: number, toX: number, toY: number, keysCollected: number): boolean {
  const targetCell = grid[toY]?.[toX]
  if (!targetCell || targetCell.type === "wall" || targetCell.type === "block") return false

  // El jugador puede pasar sobre interruptores (solo los bloques los activan)
  if (targetCell.type === "switch") {
    return true
  }

  if (targetCell.type === "door") {
    return targetCell.active || keysCollected > 0
  }

  return true
}

export function canPushBlock(grid: Cell[][], blockX: number, blockY: number, dirX: number, dirY: number): boolean {
  const newX = blockX + dirX
  const newY = blockY + dirY
  
  if (newY < 0 || newY >= grid.length || newX < 0 || newX >= grid[0]?.length) {
    return false
  }
  
  const nextCell = grid[newY]?.[newX]
  return nextCell !== undefined && nextCell.type !== "wall" && nextCell.type !== "block"
}

export function moveBlock(
  grid: Cell[][],
  blockX: number,
  blockY: number,
  newX: number,
  newY: number,
  switchesActive: Set<string>,
): { newGrid: Cell[][]; newSwitchesActive: Set<string> } {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))
  const targetCell = newGrid[newY]?.[newX]
  const originCell = newGrid[blockY]?.[blockX]

  if (!targetCell || !originCell || originCell.type !== "block") {
    return { newGrid, newSwitchesActive: switchesActive }
  }

  const updatedSwitches = new Set(switchesActive)

  if (originCell.underlay === "switch" && originCell.switchId) {
    newGrid[blockY][blockX] = { type: "switch", id: originCell.switchId }
    updatedSwitches.delete(originCell.switchId)
  } else {
    newGrid[blockY][blockX] = { type: "empty" }
  }

  let destinationSwitchId: string | undefined
  if (targetCell.type === "switch") {
    destinationSwitchId = targetCell.id
  }

  newGrid[newY][newX] = {
    type: "block",
    ...(destinationSwitchId ? { underlay: "switch", switchId: destinationSwitchId } : {}),
  }

  if (destinationSwitchId) {
    updatedSwitches.add(destinationSwitchId)
  }

  // Verificar interruptores adyacentes (arriba, abajo, izquierda, derecha)
  const adjacentPositions = [
    { x: newX, y: newY - 1 }, // Arriba
    { x: newX, y: newY + 1 }, // Abajo
    { x: newX - 1, y: newY }, // Izquierda
    { x: newX + 1, y: newY }, // Derecha
  ]

  for (const pos of adjacentPositions) {
    if (pos.y >= 0 && pos.y < newGrid.length && pos.x >= 0 && pos.x < newGrid[0]?.length) {
      const adjacentCell = newGrid[pos.y][pos.x]
      if (adjacentCell.type === "switch" && adjacentCell.id) {
        updatedSwitches.add(adjacentCell.id)
      }
    }
  }

  return { newGrid, newSwitchesActive: updatedSwitches }
}

export function checkWinCondition(gameState: GameState, levelNumber: number, doorsUnlocked: number = 0): boolean {
  const levelConfig = LEVELS.find((l) => l.number === levelNumber)
  const fallback = levelConfig ? { totalKeys: levelConfig.totalKeys || 0, totalSwitches: levelConfig.requiredSwitches || 0 } : undefined
  const requirements = gameState.requirements ?? fallback ?? { totalKeys: 0, totalSwitches: 0 }

  // El objetivo es abrir todas las puertas necesarias (usando las llaves), no tener las llaves al final
  const hasOpenedAllDoors = requirements.totalKeys === 0 || doorsUnlocked >= requirements.totalKeys
  const hasEnoughSwitches = requirements.totalSwitches === 0 || gameState.switchesActive.size >= requirements.totalSwitches

  return hasOpenedAllDoors && hasEnoughSwitches
}

export function calculateScore(moves: number, time: number, levelNumber: number, pointsMultiplier: number = 1): number {
  const baseScore = 1000
  const movesPenalty = Math.max(0, (moves - 10) * 5)
  const timePenalty = Math.max(0, (time - 60000) / 100)
  const levelBonus = levelNumber * 50

  const baseCalculated = Math.max(100, baseScore - movesPenalty - timePenalty + levelBonus)
  return Math.floor(baseCalculated * pointsMultiplier)
}

export function getLevelObjectives(levelNumber: number, overrides?: LevelRequirements): string[] {
  const levelConfig = LEVELS.find((l) => l.number === levelNumber)
  const requirements = overrides ?? (levelConfig
    ? { totalKeys: levelConfig.totalKeys || 0, totalSwitches: levelConfig.requiredSwitches || 0 }
    : { totalKeys: 0, totalSwitches: 0 })

  const objectives: string[] = []
  
  if (requirements.totalKeys > 0) {
    objectives.push(`⚠️ Recolecta ${requirements.totalKeys} LLAVE${requirements.totalKeys > 1 ? 'S' : ''} dorada${requirements.totalKeys > 1 ? 's' : ''}`)
  }
  
  if (requirements.totalSwitches > 0) {
    objectives.push(`⚠️ Activa ${requirements.totalSwitches} INTERRUPTOR${requirements.totalSwitches > 1 ? 'ES' : ''} empujando bloques`)
  }
  
  objectives.push("• Alcanza la META para completar")

  return objectives
}

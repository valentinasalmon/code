export type Cell = 
  | { type: "empty" }
  | { type: "wall" }
  | { type: "player" }
  | { type: "key" }
  | { type: "door"; active: boolean }
  | { type: "block" }
  | { type: "switch" }
  | { type: "goal" }
  | { type: "fragment" } // Fragmento de Conocimiento

export interface GameState {
  grid: Cell[][]
  playerPos: { x: number; y: number }
  keysCollected: number
  switchesActive: Set<number>
  moves: number
  isComplete: boolean
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
  { number: 5, name: "Desafío Mixto", totalKeys: 1, requiredSwitches: 1 },
  { number: 6, name: "Laberinto", totalKeys: 2, requiredSwitches: 1 },
  { number: 7, name: "Múltiples Caminos", totalKeys: 2, requiredSwitches: 2 },
  { number: 8, name: "Estrategia Avanzada", totalKeys: 2, requiredSwitches: 2 },
  { number: 9, name: "El Testigo", totalKeys: 3, requiredSwitches: 1 },
  { number: 10, name: "Dominio Total", totalKeys: 3, requiredSwitches: 3 },
  { number: 11, name: "Final Épico", totalKeys: 4, requiredSwitches: 2 },
  { number: 12, name: "Maestría", totalKeys: 4, requiredSwitches: 3 },
  { number: 13, name: "Leyenda en Marcha", totalKeys: 5, requiredSwitches: 3 },
  { number: 14, name: "Ascensión", totalKeys: 5, requiredSwitches: 4 },
  { number: 15, name: "NEXUS - El Final", totalKeys: 6, requiredSwitches: 5 },
  { number: 16, name: "Nueva Era", totalKeys: 2, requiredSwitches: 2 },
  { number: 17, name: "Ruta Alternativa", totalKeys: 3, requiredSwitches: 1 },
  { number: 18, name: "Desafío Dual", totalKeys: 2, requiredSwitches: 3 },
  { number: 19, name: "Laberinto Oscuro", totalKeys: 4, requiredSwitches: 2 },
  { number: 20, name: "Punto de Quiebre", totalKeys: 1, requiredSwitches: 4 },
  { number: 21, name: "Ascenso Rápido", totalKeys: 5, requiredSwitches: 1 },
  { number: 22, name: "Camino Sinuoso", totalKeys: 3, requiredSwitches: 3 },
  { number: 23, name: "Prueba de Fuego", totalKeys: 4, requiredSwitches: 4 },
  { number: 24, name: "La Encrucijada", totalKeys: 2, requiredSwitches: 5 },
  { number: 25, name: "Supremacía", totalKeys: 6, requiredSwitches: 3 },
]

export function createLevel(levelNumber: number): GameState {
  // Level 1: Tutorial - Agrandado con Fragmento de Conocimiento
  if (levelNumber === 1) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "fragment" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 2: First key
  if (levelNumber === 2) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 3: Push blocks on switch
  if (levelNumber === 3) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 4: Two keys, two doors
  if (levelNumber === 4) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 5: Mixed - key and switch
  if (levelNumber === 5) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
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
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 7: Multiple paths with 2 keys and 2 switches
  if (levelNumber === 7) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 8: Complex strategy - FIXED GRID
  if (levelNumber === 8) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 9: Three keys challenge
  if (levelNumber === 9) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "door", active: false }, { type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 10: Mastery - 3 keys 3 switches
  if (levelNumber === 10) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "block" }, { type: "block" }, { type: "block" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "block" }, { type: "switch" }, { type: "switch" }, { type: "switch" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 11: Epic finale - 4 keys 2 switches
  if (levelNumber === 11) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "block" }, { type: "switch" }, { type: "switch" }, { type: "switch" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 12: Mastery - 4 keys 3 switches
  if (levelNumber === 12) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "block" }, { type: "block" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "block" }, { type: "switch" }, { type: "switch" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 13: Legend - 5 keys 3 switches
  if (levelNumber === 13) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "block" }, { type: "block" }, { type: "block" }, { type: "block" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "block" }, { type: "switch" }, { type: "switch" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 14: Ascension - 5 keys 4 switches
  if (levelNumber === 14) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "block" }, { type: "block" }, { type: "block" }, { type: "block" }, { type: "block" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "block" }, { type: "switch" }, { type: "switch" }, { type: "switch" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 15: NEXUS - The Final - 6 keys 5 switches
  if (levelNumber === 15) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "door", active: false }, { type: "wall" }, { type: "block" }, { type: "block" }, { type: "block" }, { type: "block" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "block" }, { type: "switch" }, { type: "switch" }, { type: "switch" }, { type: "switch" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 16: Nueva Era - 2 keys, 2 switches
  if (levelNumber === 16) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 17: Ruta Alternativa
  if (levelNumber === 17) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 18: Desafío Dual
  if (levelNumber === 18) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 19: Laberinto Oscuro - 4 keys, 2 switches
  if (levelNumber === 19) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }, { type: "wall" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }, { type: "key" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 20: Punto de Quiebre
  if (levelNumber === 20) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 21: Ascenso Rápido - 5 keys, 1 switch
  if (levelNumber === 21) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 22: Camino Sinuoso
  if (levelNumber === 22) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "switch" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 23: Prueba de Fuego - 4 keys, 4 switches
  if (levelNumber === 23) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 24: La Encrucijada - 2 keys, 5 switches
  if (levelNumber === 24) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "key" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Level 25: Supremacía - 6 keys, 3 switches
  if (levelNumber === 25) {
    const grid: Cell[][] = [
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
      [{ type: "wall" }, { type: "player" }, { type: "key" }, { type: "block" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "door", active: false }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "door", active: false }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "switch" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "key" }, { type: "key" }, { type: "key" }, { type: "empty" }, { type: "empty" }, { type: "wall" }],
      [{ type: "wall" }, { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "goal" }, { type: "wall" }],
      [{ type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }, { type: "wall" }],
    ]
    return { grid, playerPos: { x: 1, y: 1 }, keysCollected: 0, switchesActive: new Set(), moves: 0, isComplete: false }
  }

  // Fallback
  return createLevel(1)
}

export function canMove(grid: Cell[][], fromX: number, fromY: number, toX: number, toY: number, keysCollected: number): boolean {
  const targetCell = grid[toY]?.[toX]
  if (!targetCell || targetCell.type === "wall" || targetCell.type === "block") return false

  if (targetCell.type === "door") {
    return targetCell.active || keysCollected > 0
  }

  return true
}

export function canPushBlock(grid: Cell[][], blockX: number, blockY: number, dirX: number, dirY: number): boolean {
  const newX = blockX + dirX
  const newY = blockY + dirY
  const nextCell = grid[newY]?.[newX]

  return nextCell && nextCell.type !== "wall" && nextCell.type !== "block"
}

export function moveBlock(
  grid: Cell[][],
  blockX: number,
  blockY: number,
  newX: number,
  newY: number,
  switchesActive: Set<number>,
): { newGrid: Cell[][]; newSwitchesActive: Set<number> } {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })))
  const targetCell = newGrid[newY]?.[newX]

  if (!targetCell) return { newGrid, newSwitchesActive: switchesActive }

  newGrid[blockY][blockX] = { type: "empty" }
  newGrid[newY][newX] = { type: "block" }

  let newSwitchesActive = switchesActive
  if (targetCell.type === "switch") {
    newSwitchesActive = new Set([...switchesActive, newY * 100 + newX])
  }

  return { newGrid, newSwitchesActive }
}

export function checkWinCondition(gameState: GameState, levelNumber: number): boolean {
  const levelConfig = LEVELS.find((l) => l.number === levelNumber)
  
  const requiredKeys = levelConfig?.totalKeys || 0
  const requiredSwitches = levelConfig?.requiredSwitches || 0
  
  const hasEnoughKeys = gameState.keysCollected >= requiredKeys
  const hasEnoughSwitches = gameState.switchesActive.size >= requiredSwitches

  return hasEnoughKeys && hasEnoughSwitches
}

export function calculateScore(moves: number, time: number, levelNumber: number): number {
  const baseScore = 1000
  const movesPenalty = Math.max(0, (moves - 10) * 5)
  const timePenalty = Math.max(0, (time - 60000) / 100)
  const levelBonus = levelNumber * 50

  return Math.max(100, baseScore - movesPenalty - timePenalty + levelBonus)
}

export function getLevelObjectives(levelNumber: number): string[] {
  const levelConfig = LEVELS.find((l) => l.number === levelNumber)
  
  if (!levelConfig) return []

  const objectives: string[] = []
  
  if (levelConfig.totalKeys && levelConfig.totalKeys > 0) {
    objectives.push(`⚠️ Recolecta ${levelConfig.totalKeys} LLAVE${levelConfig.totalKeys > 1 ? 'S' : ''} dorada${levelConfig.totalKeys > 1 ? 's' : ''}`)
  }
  
  if (levelConfig.requiredSwitches && levelConfig.requiredSwitches > 0) {
    objectives.push(`⚠️ Activa ${levelConfig.requiredSwitches} INTERRUPTOR${levelConfig.requiredSwitches > 1 ? 'ES' : ''} empujando bloques`)
  }
  
  objectives.push("• Alcanza la META para completar")

  return objectives
}

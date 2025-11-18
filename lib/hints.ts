// Sistema de pistas para cada nivel
export const LEVEL_HINTS: Record<number, string[]> = {
  1: [
    "Usa las teclas WASD para moverte por el laberinto",
    "Recoge todas las llaves doradas antes de llegar a la meta",
    "Empuja los bloques sobre los interruptores para activarlos"
  ],
  2: [
    "Busca la llave dorada en el laberinto",
    "La puerta se abrirá cuando tengas la llave",
    "Alcanza la meta para completar el nivel"
  ],
  3: [
    "Empuja el bloque hacia el interruptor",
    "Solo los bloques pueden activar los interruptores, no el jugador",
    "Una vez activado el interruptor, podrás avanzar"
  ],
  4: [
    "Necesitas recoger 2 llaves para abrir las puertas",
    "Las puertas se abren automáticamente cuando tienes una llave",
    "Planifica tu ruta para recoger ambas llaves"
  ],
  5: [
    "Recoge la llave y activa el interruptor",
    "Empuja el bloque sobre el interruptor",
    "Completa ambos objetivos antes de llegar a la meta"
  ],
  6: [
    "Explora el laberinto para encontrar las llaves",
    "Activa el interruptor empujando un bloque",
    "Necesitas 2 llaves y 1 interruptor activado"
  ],
  7: [
    "Hay múltiples caminos para completar este nivel",
    "Recoge 2 llaves y activa 2 interruptores",
    "Planifica tu ruta para no quedarte atascado"
  ],
  8: [
    "Recoge las llaves primero para abrir las puertas",
    "Empuja los bloques hacia los interruptores en la fila inferior",
    "Asegúrate de tener espacio para mover los bloques"
  ],
  9: [
    "Recoge las 3 llaves doradas",
    "Activa el interruptor empujando un bloque",
    "Las puertas se abren cuando tienes llaves"
  ],
  10: [
    "Recoge las 3 llaves en la fila superior",
    "Empuja los 3 bloques hacia los interruptores",
    "Los bloques están en la fila 2, los interruptores en la fila 3"
  ],
  11: [
    "Recoge las 4 llaves para abrir todas las puertas",
    "Empuja los bloques hacia los interruptores",
    "Hay 2 interruptores que necesitas activar"
  ],
  12: [
    "Recoge las 4 llaves en la fila superior",
    "Empuja los bloques hacia los interruptores",
    "Los bloques están en la fila 2, muévelos hacia abajo"
  ],
  13: [
    "Recoge las 5 llaves para abrir las puertas",
    "Empuja los 4 bloques hacia los interruptores",
    "Los interruptores están en la fila 3, los bloques en la fila 2"
  ],
  14: [
    "Recoge las 5 llaves primero",
    "Empuja los bloques desde la fila 2 hacia los interruptores",
    "Los interruptores están en la fila 3, debajo de los bloques"
  ],
  15: [
    "Este es el nivel final, necesitas 6 llaves y 5 interruptores",
    "Recoge todas las llaves primero",
    "Empuja los 5 bloques hacia los interruptores cuidadosamente"
  ],
  16: [
    "Recoge 2 llaves y activa 2 interruptores",
    "Empuja los bloques hacia los interruptores",
    "Planifica tu ruta para no quedarte atascado"
  ],
  17: [
    "Recoge 3 llaves para abrir las puertas",
    "Activa el interruptor empujando un bloque",
    "Hay una ruta alternativa para completar el nivel"
  ],
  18: [
    "Recoge 2 llaves y activa 3 interruptores",
    "Empuja los bloques hacia los interruptores",
    "Necesitas activar más interruptores que llaves"
  ],
  19: [
    "Recoge 4 llaves en este laberinto oscuro",
    "Activa 2 interruptores empujando bloques",
    "Explora cuidadosamente para encontrar todos los elementos"
  ],
  20: [
    "Solo necesitas 1 llave pero 4 interruptores",
    "Empuja el bloque hacia los interruptores",
    "Activa todos los interruptores para completar"
  ],
  21: [
    "Recoge las 5 llaves rápidamente",
    "Solo hay 1 interruptor que activar",
    "Las puertas se abren con las llaves"
  ],
  22: [
    "Recoge 3 llaves y activa 3 interruptores",
    "Empuja los bloques hacia los interruptores",
    "El camino es sinuoso, planifica bien"
  ],
  23: [
    "Recoge 4 llaves y activa 4 interruptores",
    "Empuja los bloques cuidadosamente",
    "Este nivel requiere precisión"
  ],
  24: [
    "Recoge 2 llaves pero activa 5 interruptores",
    "Empuja los bloques hacia los interruptores",
    "Necesitas más interruptores que llaves"
  ],
  25: [
    "Recoge 6 llaves para este nivel de supremacía",
    "Activa 3 interruptores empujando bloques",
    "Este es un nivel desafiante"
  ],
  26: [
    "Recoge 3 llaves y activa 2 interruptores",
    "Empuja los bloques hacia los interruptores",
    "Hay un fragmento de conocimiento en este nivel"
  ],
  27: [
    "Recoge 4 llaves y activa 3 interruptores",
    "Empuja los bloques hacia los interruptores",
    "Busca el fragmento de conocimiento"
  ],
  28: [
    "Recoge 5 llaves y activa 4 interruptores",
    "Empuja los bloques hacia los interruptores",
    "Este es el último nivel, ¡completa todos los objetivos!"
  ]
}

export function getHints(levelNumber: number): string[] {
  return LEVEL_HINTS[levelNumber] || [
    "Explora el laberinto cuidadosamente",
    "Recoge todas las llaves necesarias",
    "Activa los interruptores empujando bloques"
  ]
}


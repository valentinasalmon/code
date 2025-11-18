"use client"

import { Achievement } from "@/lib/rewards"

interface RewardsPanelProps {
  achievements: Achievement[]
  fragmentsCollected: number
  secretLevelsUnlocked: number[]
}

export function RewardsPanel({ achievements, fragmentsCollected, secretLevelsUnlocked }: RewardsPanelProps) {
  const unlockedAchievements = achievements.filter(a => a.unlocked)
  
  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4 max-h-[400px] overflow-y-auto">
      <h3 className="text-cyan-400/80 font-light text-xs mb-3 uppercase tracking-wider">Recompensas</h3>
      
      <div className="space-y-3">
        {/* Fragmentos */}
        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-400/80 text-lg">✨</span>
            <span className="text-cyan-400/80 text-xs font-light">Fragmentos de Conocimiento</span>
          </div>
          <p className="text-cyan-300/60 text-xs">{fragmentsCollected} recolectados</p>
          {fragmentsCollected >= 5 && (
            <p className="text-green-400/70 text-xs mt-1">Niveles secretos desbloqueados: {secretLevelsUnlocked.length}</p>
          )}
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <p className="text-cyan-400/60 text-xs font-light uppercase tracking-wider">Logros</p>
          {unlockedAchievements.length > 0 ? (
            unlockedAchievements.map(achievement => (
              <div key={achievement.id} className="bg-green-500/10 border border-green-500/20 rounded p-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="text-green-400/80 text-xs font-light">{achievement.name}</p>
                    <p className="text-green-300/60 text-[10px]">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-cyan-400/40 text-xs text-center py-2">Completa niveles para desbloquear logros</p>
          )}
        </div>
      </div>
    </div>
  )
}


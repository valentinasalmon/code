"use client"

import { useEffect, useState } from "react"
import { SurpriseReward } from "@/lib/surprise-levels"
import { X } from "lucide-react"

interface RewardNotificationProps {
  reward: SurpriseReward
  onClose: () => void
}

export function RewardNotification({ reward, onClose }: RewardNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-cerrar después de 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose()
      }, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  const getTypeColor = () => {
    switch (reward.type) {
      case "medal":
        return "from-yellow-500/20 to-orange-500/20 border-yellow-400/50 text-yellow-300"
      case "pet":
        return "from-purple-500/20 to-pink-500/20 border-purple-400/50 text-purple-300"
      case "title":
        return "from-cyan-500/20 to-blue-500/20 border-cyan-400/50 text-cyan-300"
      default:
        return "from-cyan-500/20 to-blue-500/20 border-cyan-400/50 text-cyan-300"
    }
  }

  const getTypeLabel = () => {
    switch (reward.type) {
      case "medal":
        return "Medalla"
      case "pet":
        return "Mascota"
      case "title":
        return "Título"
      default:
        return "Recompensa"
    }
  }

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div className={`bg-slate-900/95 backdrop-blur-xl border-2 ${getTypeColor()} rounded-xl p-6 shadow-2xl animate-reward-pop min-w-[320px] max-w-md pointer-events-auto`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getTypeColor()} flex items-center justify-center border-2`}>
                <span className="text-4xl">{reward.icon}</span>
              </div>
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getTypeColor()} blur-xl animate-pulse opacity-50`} />
            </div>
            <div className="flex-1">
              <p className="text-cyan-400/60 text-xs font-light uppercase tracking-wider mb-1">
                ¡Has Ganado una {getTypeLabel()}!
              </p>
              <p className="text-2xl font-light mb-1">
                {reward.name}
              </p>
              <p className="text-sm text-slate-400/80 font-light">
                {reward.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(), 300)
            }}
            className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}


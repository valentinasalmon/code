"use client"

import { useState } from "react"
import { SurpriseReward } from "@/lib/surprise-levels"
import { ChevronDown, ChevronUp } from "lucide-react"

interface RewardsDisplayProps {
  rewards: SurpriseReward[]
}

export function RewardsDisplay({ rewards }: RewardsDisplayProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (rewards.length === 0) return null

  const medals = rewards.filter((r) => r.type === "medal")
  const pets = rewards.filter((r) => r.type === "pet")
  const titles = rewards.filter((r) => r.type === "title")

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl mt-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors"
      >
        <h3 className="text-cyan-400/80 font-light text-sm uppercase tracking-wider">
          Recompensas Desbloqueadas ({rewards.length})
        </h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-cyan-400/60" />
        ) : (
          <ChevronDown className="w-5 h-5 text-cyan-400/60" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 space-y-3">
        {medals.length > 0 && (
          <div>
            <p className="text-xs text-cyan-400/50 font-light uppercase tracking-wider mb-2">Medallas</p>
            <div className="flex flex-wrap gap-2">
              {medals.map((medal) => (
                <div
                  key={medal.id}
                  className="flex items-center gap-2 bg-slate-800/40 border border-yellow-500/30 rounded-lg px-3 py-2"
                  title={medal.description}
                >
                  <span className="text-2xl">{medal.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-yellow-300 text-xs font-light">{medal.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pets.length > 0 && (
          <div>
            <p className="text-xs text-cyan-400/50 font-light uppercase tracking-wider mb-2">Mascotas</p>
            <div className="flex flex-wrap gap-2">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="flex items-center gap-2 bg-slate-800/40 border border-purple-500/30 rounded-lg px-3 py-2"
                  title={pet.description}
                >
                  <span className="text-2xl">{pet.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-purple-300 text-xs font-light">{pet.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {titles.length > 0 && (
          <div>
            <p className="text-xs text-cyan-400/50 font-light uppercase tracking-wider mb-2">Títulos</p>
            <div className="flex flex-wrap gap-2">
              {titles.map((title) => (
                <div
                  key={title.id}
                  className="flex items-center gap-2 bg-slate-800/40 border border-cyan-500/30 rounded-lg px-3 py-2"
                  title={title.description}
                >
                  <span className="text-2xl">{title.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-cyan-300 text-xs font-light">{title.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  )
}


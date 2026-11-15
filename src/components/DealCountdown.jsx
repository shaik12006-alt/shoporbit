import React, { useState, useEffect } from 'react'
import { Flame, Clock } from 'lucide-react'

export const DealCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          return { hours: 12, minutes: 0, seconds: 0 } // reset cycle
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/30 px-3.5 py-1.5 rounded-2xl shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
        <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
        <span className="hidden sm:inline">Flash Deals Reset in:</span>
        <span className="sm:hidden">Ends in:</span>
      </div>
      <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm text-white">
        <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-purple-500/20">
          {pad(timeLeft.hours)}h
        </span>
        <span className="text-purple-400">:</span>
        <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-purple-500/20">
          {pad(timeLeft.minutes)}m
        </span>
        <span className="text-purple-400">:</span>
        <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-purple-500/20 text-pink-400">
          {pad(timeLeft.seconds)}s
        </span>
      </div>
    </div>
  )
}

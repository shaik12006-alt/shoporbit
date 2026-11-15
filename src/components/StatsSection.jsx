import React from 'react'
import { Sparkles, TrendingUp, Users, ShoppingBag, Percent } from 'lucide-react'
import { useProducts } from '../context/ProductContext'

export const StatsSection = () => {
  const { products, clickEvents } = useProducts()

  // Calculate live dynamic metrics
  const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0)
  const averageDiscount = Math.round(
    products.reduce((acc, p) => acc + (p.discountPercentage || 0), 0) / (products.length || 1)
  )

  const stats = [
    {
      label: 'Curated Deals',
      value: `${products.length}+`,
      sub: 'Verified Amazon & Myntra Deals',
      icon: ShoppingBag,
      color: 'text-purple-400',
      border: 'border-purple-500/20'
    },
    {
      label: 'Shopper Redirects',
      value: `${totalClicks}+`,
      sub: 'Tracked outbound link visits',
      icon: TrendingUp,
      color: 'text-cyan-400',
      border: 'border-cyan-500/20'
    },
    {
      label: 'Average Savings',
      value: `${averageDiscount}%`,
      sub: 'Below standard retail price',
      icon: Percent,
      color: 'text-emerald-400',
      border: 'border-emerald-500/20'
    },
    {
      label: 'Trusted Partners',
      value: '2 Giants',
      sub: 'Amazon India & Myntra',
      icon: Sparkles,
      color: 'text-pink-400',
      border: 'border-pink-500/20'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-12">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon
        return (
          <div
            key={idx}
            className={`bg-[#0D1322] border ${stat.border} rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-semibold text-slate-400">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${stat.color}`}>
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk'] tracking-tight mb-1`}>
              {stat.value}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
              {stat.sub}
            </p>
          </div>
        )
      })}
    </div>
  )
}

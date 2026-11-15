import React from 'react'
import {
  SlidersHorizontal,
  RotateCcw,
  Tag,
  Check,
  Percent,
  Layers,
  Sparkles
} from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { CATEGORIES } from '../data/categories'

export const FilterSidebar = ({ className = '' }) => {
  const {
    selectedPlatform,
    setSelectedPlatform,
    selectedCategory,
    setSelectedCategory,
    minDiscount,
    setMinDiscount,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    setSearchQuery
  } = useProducts()

  const handleReset = () => {
    setSelectedPlatform('All')
    setSelectedCategory('all')
    setMinDiscount(0)
    setPriceRange([0, 150000])
    setSortBy('popular')
    setSearchQuery('')
  }

  return (
    <div className={`bg-[#0D1322] border border-slate-800/80 rounded-2xl p-5 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          <span>Filters & Sort</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-purple-300 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Sort Products
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-purple-500"
        >
          <option value="popular">🔥 Most Popular / Clicked</option>
          <option value="discount">⚡ Highest Discount %</option>
          <option value="price-low">💰 Price: Low to High</option>
          <option value="price-high">💎 Price: High to Low</option>
          <option value="rating">⭐ Highest Customer Rating</option>
        </select>
      </div>

      {/* Platform Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Platform</span>
          <span className="text-[11px] text-purple-400 font-normal">
            {selectedPlatform === 'All' ? 'All' : selectedPlatform}
          </span>
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          {['All', 'Amazon India', 'Myntra India'].map((plat) => {
            const isSelected = selectedPlatform === plat
            const label = plat === 'All' ? 'All' : plat === 'Amazon India' ? 'Amazon' : 'Myntra'
            return (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? plat === 'Amazon India'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : plat === 'Myntra India'
                      ? 'bg-pink-600 text-white font-bold shadow'
                      : 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-purple-400" />}
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Minimum Discount Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Minimum Discount
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 20, 40, 50].map((disc) => (
            <button
              key={disc}
              onClick={() => setMinDiscount(disc)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                minDiscount === disc
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {disc === 0 ? 'Any' : `${disc}%+`}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold uppercase tracking-wider text-slate-400">
            Max Price
          </label>
          <span className="text-purple-300 font-bold">
            ₹{priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="150000"
          step="2000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>₹1,000</span>
          <span>₹1,50,000+</span>
        </div>
      </div>
    </div>
  )
}

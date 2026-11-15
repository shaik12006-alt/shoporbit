import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Search,
  RotateCcw,
  Percent,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { ProductCard } from '../components/ProductCard'
import { SEO } from '../components/SEO'

export const MyntraFashionPage = () => {
  const { products } = useProducts()
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [sort, setSort] = useState('popular')
  const [discountFilter, setDiscountFilter] = useState(0)

  // Filter only Myntra products
  const myntraProducts = useMemo(() => {
    return products
      .filter(p => p.platform.toLowerCase().includes('myntra'))
      .filter(p => {
        if (selectedCat !== 'all' && p.category !== selectedCat) return false
        if (discountFilter > 0 && p.discountPercentage < discountFilter) return false
        if (search.trim()) {
          const q = search.toLowerCase()
          return (
            p.title.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => {
        if (sort === 'discount') return b.discountPercentage - a.discountPercentage
        if (sort === 'price-low') return a.dealPrice - b.dealPrice
        if (sort === 'price-high') return b.dealPrice - a.dealPrice
        if (sort === 'rating') return b.rating - a.rating
        return (b.clicks || 0) - (a.clicks || 0)
      })
  }, [products, selectedCat, discountFilter, search, sort])

  return (
    <div className="min-h-screen py-8 md:py-12">
      <SEO
        title="Myntra Fashion Edit & Discounts | ShopOrbit"
        description="Discover trending apparel, sneakers, ethnic wear, and luxury accessories from Myntra India. Handpicked deals with up to 60% discounts."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Myntra Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#210c1c] via-[#170e20] to-[#141226] border border-pink-500/30 p-6 sm:p-10 mb-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              Myntra Fashion & Lifestyle Curation
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight mb-3">
              Myntra Fashion <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">Runway</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Step up your style with handpicked streetwear, denim, designer ethnic ensembles, and iconic sneakers curated directly from Myntra.
            </p>

            {/* In-page Search */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search Myntra fashion (e.g. Nike, Levis, H&M, Kurta)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl border border-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              />
              <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Category:
            </span>
            {[
              { id: 'all', label: 'All Myntra Deals' },
              { id: 'mens-fashion', label: "Men's Fashion" },
              { id: 'womens-fashion', label: "Women's Ethnic & Western" },
              { id: 'footwear', label: 'Footwear & Sneakers' },
              { id: 'accessories', label: 'Bags & Accessories' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCat === cat.id
                    ? 'bg-pink-600 text-white font-bold shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Discount:</span>
              <select
                value={discountFilter}
                onChange={(e) => setDiscountFilter(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                <option value={0}>All Discounts</option>
                <option value={30}>30%+ Off</option>
                <option value={40}>40%+ Off</option>
                <option value={50}>50%+ Off</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="popular">Most Popular</option>
                <option value="discount">Highest Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <span>Showing <strong>{myntraProducts.length}</strong> Myntra India fashion deals</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-pink-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear search filter
            </button>
          )}
        </div>

        {/* Products Grid */}
        {myntraProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myntraProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#0D1322] border border-slate-800 rounded-3xl p-8">
            <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Myntra fashion items match your filter</h3>
            <p className="text-xs text-slate-400 mb-4">Try resetting filters or searching for alternative fashion brands.</p>
            <button
              onClick={() => {
                setSelectedCat('all')
                setDiscountFilter(0)
                setSearch('')
              }}
              className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

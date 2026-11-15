import React, { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Layers,
  Sparkles,
  Search,
  RotateCcw,
  Heart,
  Flame,
  Filter
} from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { ProductCard } from '../components/ProductCard'
import { FilterSidebar } from '../components/FilterSidebar'
import { CATEGORIES } from '../data/categories'
import { SEO } from '../components/SEO'

export const CategoriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    products,
    favorites,
    searchQuery,
    setSearchQuery,
    selectedPlatform,
    selectedCategory,
    setSelectedCategory,
    minDiscount,
    priceRange,
    sortBy
  } = useProducts()

  const urlQuery = searchParams.get('q')
  const urlCategory = searchParams.get('cat')
  const urlFilter = searchParams.get('filter')

  // Sync URL params to context on mount
  useEffect(() => {
    if (urlQuery) setSearchQuery(urlQuery)
    if (urlCategory) setSelectedCategory(urlCategory)
  }, [urlQuery, urlCategory, setSearchQuery, setSelectedCategory])

  const isFavoritesView = urlFilter === 'favorites'

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // If in favorites view
        if (isFavoritesView && !favorites.includes(p.id)) {
          return false
        }

        // Platform filter
        if (selectedPlatform !== 'All' && p.platform !== selectedPlatform) {
          return false
        }

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false
        }

        // Min Discount filter
        if (minDiscount > 0 && p.discountPercentage < minDiscount) {
          return false
        }

        // Price range filter
        if (p.dealPrice < priceRange[0] || p.dealPrice > priceRange[1]) {
          return false
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          return (
            p.title.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
          )
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage
        if (sortBy === 'price-low') return a.dealPrice - b.dealPrice
        if (sortBy === 'price-high') return b.dealPrice - a.dealPrice
        if (sortBy === 'rating') return b.rating - a.rating
        return (b.clicks || 0) - (a.clicks || 0) // default popular
      })
  }, [
    products,
    favorites,
    isFavoritesView,
    selectedPlatform,
    selectedCategory,
    minDiscount,
    priceRange,
    searchQuery,
    sortBy
  ])

  return (
    <div className="min-h-screen py-8 md:py-12">
      <SEO
        title={isFavoritesView ? 'My Saved Wishlist | ShopOrbit' : 'Browse Categories & Deals | ShopOrbit'}
        description="Explore categorized deals across electronics, smartphones, fashion, sneakers, home appliances, and audio with price drops from Amazon India & Myntra."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-purple-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
            {isFavoritesView ? (
              <>
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                <span>Saved Products</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                <span>All Departments</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            {isFavoritesView ? 'Your Saved Deals Wishlist' : 'Explore All Categories'}
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            {isFavoritesView
              ? 'Keep track of the deals you have saved. Click through to Amazon or Myntra anytime to complete your purchase.'
              : 'Filter and sort curated Amazon India and Myntra deals with full discount transparency.'}
          </p>
        </div>

        {/* Quick Category Badges Bar */}
        {!isFavoritesView && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-[#0D1322] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>All Deals</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800/80">
                {products.length}
              </span>
            </button>

            {CATEGORIES.map(cat => {
              const count = products.filter(p => p.category === cat.id).length
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-[#0D1322] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800/80">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Main Content Layout: Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar />
          </div>

          {/* Products Grid Area */}
          <div className="lg:col-span-3">
            {/* Header / Active filters counter */}
            <div className="flex items-center justify-between text-xs text-slate-400 mb-6 bg-[#0D1322] border border-slate-800/80 rounded-xl p-3">
              <span>
                Found <strong>{filteredProducts.length}</strong> matching {filteredProducts.length === 1 ? 'deal' : 'deals'}
              </span>

              {searchQuery && (
                <span className="text-purple-300">
                  Filtering for "{searchQuery}"
                </span>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#0D1322] border border-slate-800 rounded-3xl p-8">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">No products found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  {isFavoritesView
                    ? "You haven't saved any deals to your wishlist yet. Click the heart icon on any product to save it here!"
                    : "No deals match your current combination of platform, category, price, and discount filters."}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSearchQuery('')
                    if (isFavoritesView) setSearchParams({})
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
                >
                  {isFavoritesView ? 'Browse All Deals' : 'Clear All Filters'}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

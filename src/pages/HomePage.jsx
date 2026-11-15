import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Search,
  ExternalLink,
  Flame,
  ShieldCheck,
  Zap,
  TrendingUp,
  Tag,
  Star,
  Layers,
  ChevronRight,
  ShoppingBag
} from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { ProductCard } from '../components/ProductCard'
import { StatsSection } from '../components/StatsSection'
import { DealCountdown } from '../components/DealCountdown'
import { CATEGORIES } from '../data/categories'
import { SEO } from '../components/SEO'

export const HomePage = () => {
  const { products, searchQuery, setSearchQuery } = useProducts()
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'amazon' | 'myntra'
  const navigate = useNavigate()

  const handleHeroSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/categories?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Filter deals for the main featured grid
  const filteredProducts = products.filter(p => {
    if (activeTab === 'amazon') return p.platform.toLowerCase().includes('amazon')
    if (activeTab === 'myntra') return p.platform.toLowerCase().includes('myntra')
    return true
  })

  const amazonTopPicks = products.filter(p => p.platform.toLowerCase().includes('amazon')).slice(0, 4)
  const myntraTopPicks = products.filter(p => p.platform.toLowerCase().includes('myntra')).slice(0, 4)

  return (
    <div className="min-h-screen">
      <SEO
        title="Discover More. Spend Smarter | Handpicked Amazon & Myntra Deals"
        description="ShopOrbit curates handpicked price drops, verified electronics, and trending fashion from Amazon India and Myntra. Save money on smart purchases."
      />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Ambient Radial Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] md:w-[900px] md:h-[500px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill & Countdown */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/15 text-purple-300 text-xs sm:text-sm font-semibold border border-purple-500/30 backdrop-blur-md shadow-neon-purple">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              India's Premier Deals Discovery Hub
            </span>
            <DealCountdown />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-['Space_Grotesk'] leading-[1.1] mb-6 max-w-4xl mx-auto">
            Discover More.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Spend Smarter.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
            We scour <strong>Amazon India</strong> and <strong>Myntra</strong> daily to handpick verified price drops, genuine gadget steals, and curated fashion. No misleading discounts, just pure savings.
          </p>

          {/* Search Box in Hero */}
          <div className="max-w-2xl mx-auto mb-10">
            <form onSubmit={handleHeroSearch} className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-40 group-hover:opacity-75 blur transition duration-300" />
              <div className="relative flex items-center bg-[#0D1322] rounded-2xl p-2 border border-slate-700/80 shadow-2xl">
                <Search className="w-5 h-5 text-purple-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search laptops, noise cancelling headphones, hoodies, sneakers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 px-3 py-2 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95"
                >
                  Find Deals
                </button>
              </div>
            </form>
          </div>

          {/* Quick Platform Launchers */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/amazon-deals"
              className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-sm sm:text-base transition-all shadow-lg shadow-amber-500/10 hover:scale-105"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>Explore Amazon India Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/myntra-fashion"
              className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 font-bold text-sm sm:text-base transition-all shadow-lg shadow-pink-500/10 hover:scale-105"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
              <span>Explore Myntra Fashion Edit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- LIVE STATS SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsSection />
      </section>

      {/* --- FEATURED DEALS WITH TABS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              Handpicked Today
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              Featured Trending Deals
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Tested for price history, customer sentiment, and verified discount margins.
            </p>
          </div>

          {/* Platform Tab Buttons */}
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Deals ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('amazon')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'amazon'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              Amazon Deals
            </button>
            <button
              onClick={() => setActiveTab('myntra')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'myntra'
                  ? 'bg-pink-600 text-white font-extrabold shadow-lg shadow-pink-600/20'
                  : 'text-slate-400 hover:text-pink-300'
              }`}
            >
              Myntra Fashion
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700/80 hover:border-purple-500/50 transition-all shadow-lg hover:shadow-neon-purple group"
          >
            <span>Browse All {products.length} Curated Deals</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* --- AMAZON INDIA SPOTLIGHT SECTION --- */}
      <section className="bg-gradient-to-b from-[#090D18] via-[#0D1322] to-[#070A12] border-y border-amber-500/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Amazon India Lightning Hub
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
                Top Electronics, Audio & Smart Gadgets
              </h2>
            </div>
            <Link
              to="/amazon-deals"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold text-sm self-start sm:self-auto group"
            >
              <span>View All Amazon Deals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {amazonTopPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* --- MYNTRA FASHION SPOTLIGHT SECTION --- */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30 mb-2">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                Myntra Fashion Runway
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
                Trending Apparel, Footwear & Accessories
              </h2>
            </div>
            <Link
              to="/myntra-fashion"
              className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-bold text-sm self-start sm:self-auto group"
            >
              <span>View All Myntra Fashion</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myntraTopPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORIES BROWSER --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            Curated Hubs
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] mb-3">
            Shop by Category
          </h2>
          <p className="text-slate-400 text-sm">
            Quickly navigate straight to the categories you care about most.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length
            return (
              <Link
                key={cat.id}
                to={`/categories?cat=${cat.id}`}
                className="group relative bg-[#0D1322] border border-slate-800/80 hover:border-purple-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-card-hover flex flex-col justify-between overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 rounded-full blur-2xl transition-opacity`} />
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} p-0.5 mb-4 shadow-lg`}>
                    <div className="w-full h-full bg-[#0D1322] rounded-xl flex items-center justify-center text-white font-bold">
                      <Sparkles className="w-5 h-5 text-purple-300" />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {count} {count === 1 ? 'deal' : 'deals'}
                  </span>
                  <span className="text-purple-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                    Browse →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* --- HOW SHOPORBIT WORKS / TRUST --- */}
      <section className="bg-slate-900/40 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-purple-400 font-bold text-xs uppercase tracking-wider">
              Transparent & Unbiased
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] mt-1">
              How ShopOrbit Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto text-xl font-bold font-mono">
                1
              </div>
              <h3 className="text-lg font-bold text-white">We Handpick Real Drops</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our algorithm and human curators track price trends on Amazon India & Myntra to spot genuine discounts instead of artificial inflation.
              </p>
            </div>

            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto text-xl font-bold font-mono">
                2
              </div>
              <h3 className="text-lg font-bold text-white">You Click Directly to Merchant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We never handle your credit card or personal details. You checkout safely and directly on Amazon.in or Myntra.com with official buyer protection.
              </p>
            </div>

            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center mx-auto text-xl font-bold font-mono">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Zero Extra Cost to You</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                As registered Amazon Associates and Myntra partners, we may receive a commission from the merchant if you make a purchase. You pay the exact same price!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

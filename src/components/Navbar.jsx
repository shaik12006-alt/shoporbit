import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  Menu,
  X,
  Heart,
  Sparkles,
  Flame,
  Shield,
  Layers,
  ArrowRight,
  Zap,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
  const { searchQuery, setSearchQuery, favorites, products } = useProducts()
  const { isAdmin } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Track window scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto suggestions based on typed query
  const suggestions = searchQuery.trim().length > 1
    ? products
        .filter(p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : []

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchFocused(false)
      navigate(`/categories?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const selectSuggestion = (prod) => {
    setSearchQuery('')
    setSearchFocused(false)
    navigate(`/product/${prod.id}`)
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070A12]/95 backdrop-blur-md border-b border-purple-500/20 shadow-xl'
          : 'bg-[#070A12]/80 backdrop-blur-sm border-b border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-500 p-0.5 shadow-neon-purple group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#070A12] rounded-2xl flex items-center justify-center p-1.5">
                <img src="/orbit-logo.svg" alt="ShopOrbit Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Space_Grotesk']">
                  Shop<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Orbit</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  IN
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-medium text-slate-400 -mt-0.5">
                Discover More. Spend Smarter.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-white bg-purple-600/20 text-purple-300 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/amazon-deals"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30 font-semibold'
                    : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60'
                }`
              }
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Amazon Deals
            </NavLink>

            <NavLink
              to="/myntra-fashion"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'text-pink-300 bg-pink-500/15 border border-pink-500/30 font-semibold'
                    : 'text-slate-300 hover:text-pink-300 hover:bg-slate-800/60'
                }`
              }
            >
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              Myntra Fashion
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-white bg-purple-600/20 text-purple-300 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              Categories
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-white bg-purple-600/20 text-purple-300 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-white bg-purple-600/20 text-purple-300 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Search Bar (Desktop & Tablet) */}
          <div className="relative flex-1 max-w-xs md:max-w-sm hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search deals, brands (Sony, Nike, Apple)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-900/90 text-white placeholder-slate-400 rounded-xl border border-slate-700/80 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Instant Suggestions Dropdown */}
            {searchFocused && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn"
                onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-400 border-b border-slate-800">
                  Instant Deal Suggestions
                </div>
                <div className="py-1">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => selectSuggestion(item)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-purple-600/20 cursor-pointer transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-9 h-9 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="text-purple-300 font-medium">{item.brand}</span>
                          <span>•</span>
                          <span className="font-bold text-white">₹{item.dealPrice.toLocaleString('en-IN')}</span>
                          <span className="text-emerald-400 font-semibold">{item.discountPercentage}% off</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Actions: Wishlist & Admin Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Link */}
            <Link
              to="/categories?filter=favorites"
              className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Admin Dashboard shortcut */}
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                isAdmin
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 hover:bg-purple-600/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:text-white hover:border-slate-600'
              }`}
              title={isAdmin ? 'Admin Dashboard (Active)' : 'Admin Portal Login'}
            >
              <Shield className={`w-3.5 h-3.5 ${isAdmin ? 'text-purple-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isAdmin ? 'Admin' : 'Admin'}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700/60"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-purple-500/20 px-4 pt-3 pb-6 space-y-4 backdrop-blur-xl">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search Amazon & Myntra deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900 text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:border-purple-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `p-3 rounded-xl flex items-center gap-2 border transition-all ${
                  isActive
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              Home
            </NavLink>

            <NavLink
              to="/amazon-deals"
              className={({ isActive }) =>
                `p-3 rounded-xl flex items-center gap-2 border transition-all ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Amazon Deals
            </NavLink>

            <NavLink
              to="/myntra-fashion"
              className={({ isActive }) =>
                `p-3 rounded-xl flex items-center gap-2 border transition-all ${
                  isActive
                    ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              Myntra Fashion
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `p-3 rounded-xl flex items-center gap-2 border transition-all ${
                  isActive
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              Categories
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `p-3 rounded-xl flex items-center gap-2 border transition-all ${
                  isActive
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `p-3 rounded-xl flex items-center gap-2 border transition-all ${
                  isActive
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Contact
            </NavLink>
          </div>

          {/* Quick Platform Switcher Footer in Mobile */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Affiliate Hub: Amazon & Myntra</span>
            <Link to="/admin" className="text-purple-400 font-semibold underline">
              Admin Portal →
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

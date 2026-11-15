import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Star, Heart, Eye, Share2, Check, Flame, ShoppingBag } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import confetti from 'canvas-confetti'

export const ProductCard = ({ product }) => {
  const { trackClick, favorites, toggleFavorite, setQuickViewProduct } = useProducts()
  const [copied, setCopied] = useState(false)
  const isFav = favorites.includes(product.id)

  const isAmazon = product.platform.toLowerCase().includes('amazon')

  const handleAffiliateClick = (e) => {
    // Fire confetti celebration on clicking affiliate link
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: isAmazon ? ['#FF9900', '#146EB4', '#FFFFFF'] : ['#FF3F6C', '#8B5CF6', '#FFFFFF']
    })

    // Track the outbound click
    trackClick(product.id, product.affiliateUrl)
  }

  const handleShare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const productUrl = `${window.location.origin}/product/${product.id}`
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const formatPrice = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num)
  }

  return (
    <div className="group relative bg-[#0D1322] border border-slate-800/80 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-card-hover flex flex-col h-full">
      {/* Top Banner Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {/* Platform Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide shadow-md backdrop-blur-md ${
            isAmazon
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isAmazon ? 'bg-amber-400' : 'bg-pink-400'
            }`}
          />
          {product.platform}
        </span>

        {/* Custom Deal Badge if exists */}
        {product.badge && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-600/90 text-white shadow">
            <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
            {product.badge}
          </span>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(product.id)
          }}
          className={`p-2 rounded-xl backdrop-blur-md transition-all ${
            isFav
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
          }`}
          title={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setQuickViewProduct(product)
          }}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-purple-600 text-slate-300 hover:text-white border border-slate-700/60 hover:border-purple-500 transition-all shadow-md"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all shadow-md"
          title="Share deal"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="relative block pt-[75%] bg-slate-950/60 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1322] via-transparent to-transparent opacity-60" />

        {/* Demo Data Label */}
        {product.isDemo && (
          <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-slate-900/90 text-slate-400 px-2 py-0.5 rounded border border-slate-700/50 backdrop-blur-sm">
            Demo Data
          </span>
        )}
      </Link>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-purple-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-semibold text-slate-200">{product.rating}</span>
              <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-sm sm:text-base font-semibold text-slate-100 hover:text-purple-300 transition-colors line-clamp-2 leading-snug mb-3"
            title={product.title}
          >
            {product.title}
          </Link>
        </div>

        <div>
          {/* Price & Savings */}
          <div className="pt-2 border-t border-slate-800/80 mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-white">
                {formatPrice(product.dealPrice)}
              </span>
              {product.mrp > product.dealPrice && (
                <span className="text-xs sm:text-sm text-slate-500 line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="ml-auto text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            {product.mrp > product.dealPrice && (
              <p className="text-[11px] text-emerald-400/90 mt-0.5 font-medium">
                Save {formatPrice(product.mrp - product.dealPrice)}
              </p>
            )}
          </div>

          {/* Outbound Affiliate Redirect CTA */}
          <div className="flex items-center gap-2">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={handleAffiliateClick}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-lg active:scale-95 ${
                isAmazon
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-amber-600/20'
                  : 'bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white shadow-pink-600/20'
              }`}
            >
              <span>{isAmazon ? 'Buy on Amazon' : 'Buy on Myntra'}</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>

            <Link
              to={`/product/${product.id}`}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="View Specifications & Full Details"
            >
              <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>

          {/* Click tracker / popularity indicator */}
          <div className="mt-2 text-center">
            <span className="text-[10px] text-slate-500">
              🔥 {product.clicks || 0} shoppers explored this deal
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

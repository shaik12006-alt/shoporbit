import React, { useState } from 'react'
import { X, ExternalLink, Star, ShieldCheck, Heart, Sparkles, Check, Flame } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import confetti from 'canvas-confetti'

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, trackClick, favorites, toggleFavorite } = useProducts()
  const [selectedImage, setSelectedImage] = useState(0)

  if (!quickViewProduct) return null

  const isAmazon = quickViewProduct.platform.toLowerCase().includes('amazon')
  const isFav = favorites.includes(quickViewProduct.id)

  const allImages = [
    quickViewProduct.image,
    ...(quickViewProduct.additionalImages || [])
  ]

  const formatPrice = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num)
  }

  const handleAffiliateClick = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: isAmazon ? ['#FF9900', '#146EB4', '#FFFFFF'] : ['#FF3F6C', '#8B5CF6', '#FFFFFF']
    })
    trackClick(quickViewProduct.id, quickViewProduct.affiliateUrl)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative bg-[#0F172A] border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Preview */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-slate-950/40 border-b md:border-b-0 md:border-r border-slate-800/80">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-square mb-4">
            <img
              src={allImages[selectedImage] || quickViewProduct.image}
              alt={quickViewProduct.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Platform watermark badge */}
            <span
              className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-lg backdrop-blur-md ${
                isAmazon
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
              }`}
            >
              {quickViewProduct.platform}
            </span>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-purple-500 scale-105 shadow-md'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Affiliate Link */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-5">
          <div>
            {/* Brand, Badges and Rating */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                {quickViewProduct.brand}
              </span>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg text-amber-400 text-xs">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-slate-100">{quickViewProduct.rating}</span>
                <span className="text-slate-400">({quickViewProduct.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug mb-3">
              {quickViewProduct.title}
            </h2>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-black text-white">
                  {formatPrice(quickViewProduct.dealPrice)}
                </span>
                {quickViewProduct.mrp > quickViewProduct.dealPrice && (
                  <span className="text-sm md:text-base text-slate-500 line-through">
                    {formatPrice(quickViewProduct.mrp)}
                  </span>
                )}
                {quickViewProduct.discountPercentage > 0 && (
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    {quickViewProduct.discountPercentage}% OFF
                  </span>
                )}
              </div>
              {quickViewProduct.mrp > quickViewProduct.dealPrice && (
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  You save {formatPrice(quickViewProduct.mrp - quickViewProduct.dealPrice)} with this deal!
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
              {quickViewProduct.description}
            </p>

            {/* Key features bullets */}
            {quickViewProduct.features && quickViewProduct.features.length > 0 && (
              <div className="space-y-1.5 mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Key Highlights
                </h4>
                {quickViewProduct.features.slice(0, 3).map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <a
                href={quickViewProduct.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener"
                onClick={handleAffiliateClick}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm md:text-base shadow-xl transition-all active:scale-95 ${
                  isAmazon
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-600/20'
                }`}
              >
                <span>{isAmazon ? 'Claim Deal on Amazon India' : 'Buy Now on Myntra India'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => toggleFavorite(quickViewProduct.id)}
                className={`p-3 rounded-xl border transition-all ${
                  isFav
                    ? 'bg-pink-600 border-pink-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title={isFav ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400">
              ⚡ Redirects directly to the official merchant product page. Prices subject to change.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

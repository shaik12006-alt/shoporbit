import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ExternalLink,
  Star,
  Heart,
  Share2,
  Check,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Flame,
  Truck,
  RotateCcw,
  Clock,
  Layers
} from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { ProductCard } from '../components/ProductCard'
import { SEO } from '../components/SEO'
import confetti from 'canvas-confetti'

export const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, trackClick, favorites, toggleFavorite } = useProducts()
  const [selectedImage, setSelectedImage] = useState(0)
  const [copied, setCopied] = useState(false)

  const product = products.find(p => p.id === id)

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0)
    setSelectedImage(0)
  }, [id])

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">The deal you are looking for may have expired or been removed.</p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm"
        >
          Return to Home
        </Link>
      </div>
    )
  }

  const isAmazon = product.platform.toLowerCase().includes('amazon')
  const isFav = favorites.includes(product.id)

  const allImages = [
    product.image,
    ...(product.additionalImages || [])
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
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: isAmazon ? ['#FF9900', '#146EB4', '#FFFFFF'] : ['#FF3F6C', '#8B5CF6', '#FFFFFF']
    })
    trackClick(product.id, product.affiliateUrl)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  // Related products from same category or platform
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.platform === product.platform))
    .slice(0, 4)

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <SEO
        title={`${product.title} - ${product.platform} Deal`}
        description={`Get ${product.discountPercentage}% off on ${product.title}. Curated from ${product.platform} by ShopOrbit.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          <Link
            to={isAmazon ? '/amazon-deals' : '/myntra-fashion'}
            className="hover:text-white transition-colors"
          >
            {product.platform}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          <span className="text-slate-200 truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl bg-[#0D1322] border border-slate-800 overflow-hidden aspect-square">
              <img
                src={allImages[selectedImage] || product.image}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Platform badge */}
              <span
                className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-lg backdrop-blur-md ${
                  isAmazon
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                }`}
              >
                {product.platform}
              </span>

              {/* Demo Data badge */}
              {product.isDemo && (
                <span className="absolute bottom-4 left-4 text-[11px] font-medium bg-slate-900/90 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700/60 backdrop-blur-sm">
                  Demo Catalog Listing
                </span>
              )}
            </div>

            {/* Thumbnail previews */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === idx
                        ? 'border-purple-500 scale-105 shadow-neon-purple'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Affiliate Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand, Badges and Rating */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400 px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20">
                  {product.brand}
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-xl text-amber-400 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-white">{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount} customer reviews)</span>
                  </div>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                    title="Share this deal"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`p-2 rounded-xl border transition ${
                      isFav
                        ? 'bg-pink-600 border-pink-500 text-white'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                    title={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Space_Grotesk'] leading-tight mb-4">
                {product.title}
              </h1>

              {/* Pricing Box */}
              <div className="p-5 rounded-3xl bg-[#0D1322] border border-slate-800/90 mb-6 shadow-xl">
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {formatPrice(product.dealPrice)}
                  </span>
                  {product.mrp > product.dealPrice && (
                    <span className="text-base sm:text-lg text-slate-500 line-through">
                      MRP {formatPrice(product.mrp)}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {product.mrp > product.dealPrice && (
                  <div className="text-xs sm:text-sm text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    You save {formatPrice(product.mrp - product.dealPrice)} (Instant Discount)
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Truck className="w-3.5 h-3.5 text-purple-400" />
                    Fulfilled by {product.platform}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                    Merchant Return Guarantee
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Overview
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Features List */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Key Highlights & Features
                  </h3>
                  <div className="space-y-2">
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Outbound Buy CTA Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-purple-950/40 border border-purple-500/30 space-y-4">
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener"
                onClick={handleAffiliateClick}
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-base sm:text-lg font-black shadow-2xl transition-all active:scale-95 ${
                  isAmazon
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-600/25'
                }`}
              >
                <span>{isAmazon ? 'Buy Now on Amazon India' : 'Buy Now on Myntra India'}</span>
                <ExternalLink className="w-5 h-5 flex-shrink-0" />
              </a>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <strong>{product.clicks || 0} shoppers</strong> navigated to this deal
                </span>
                <span className="text-slate-500 text-[11px]">
                  Official merchant checkout • Safe & encrypted
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Specifications Table Section */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-[#0D1322] border border-slate-800 rounded-3xl p-6 sm:p-8 mb-16">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-slate-800/80 text-xs sm:text-sm">
                  <span className="text-slate-400 font-medium">{key}</span>
                  <span className="text-white font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Deals Section */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                  Similar Curated Deals
                </h2>
                <p className="text-xs text-slate-400">Shoppers also checked out these top recommendations</p>
              </div>
              <Link
                to="/categories"
                className="text-xs sm:text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                View More →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

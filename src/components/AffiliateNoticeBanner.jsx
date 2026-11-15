import React, { useState } from 'react'
import { Info, X, ShieldCheck, ExternalLink } from 'lucide-react'

export const AffiliateNoticeBanner = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)

  if (!isOpen) return null

  return (
    <>
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-purple-950/70 border-b border-purple-500/20 text-xs sm:text-sm text-slate-300 py-2 px-4 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-medium border border-purple-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Affiliate Disclosure
            </span>
            <p className="truncate">
              ShopOrbit participates in the Amazon Associates & Myntra Affiliate programs. We may earn commissions on qualifying purchases at no extra cost to you.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="text-purple-400 hover:text-purple-300 underline font-medium text-xs whitespace-nowrap"
            >
              Learn More
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Transparency Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Affiliate Transparency Policy</h3>
                <p className="text-xs text-slate-400">FTC & ASCI Compliant Disclosure</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed mb-6">
              <p>
                <strong>How ShopOrbit Works:</strong> ShopOrbit is a curated product discovery and deals aggregator. We scour Amazon India and Myntra to find high-value products, genuine price drops, and trending fashion.
              </p>
              <p>
                <strong>No Extra Cost:</strong> When you click on an outbound Amazon or Myntra link and complete a purchase, the merchant pays us a small referral fee. The price you pay is identical to visiting the store directly.
              </p>
              <p>
                <strong>Demo Catalog Notice:</strong> Products currently showcased in this build are illustrative sample demo data with real brand attributes to help you experience the full functionality. Real prices, ratings, and stock status are maintained directly by Amazon India and Myntra.
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition shadow-lg shadow-purple-600/30"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </>
  )
}

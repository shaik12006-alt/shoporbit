import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  ArrowRight
} from 'lucide-react'
import { SEO } from '../components/SEO'

export const AboutUsPage = () => {
  return (
    <div className="min-h-screen py-12 md:py-20">
      <SEO
        title="About Us & Affiliate Transparency | ShopOrbit"
        description="Learn how ShopOrbit curates India's best Amazon and Myntra deals with complete editorial independence, verified price drops, and total disclosure transparency."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Our Mission & Ethics
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            Discover More.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Spend Smarter.
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            ShopOrbit is India's independent affiliate discovery platform built to save you time and money. We replace sponsored confusion with human-verified value.
          </p>
        </div>

        {/* The Problem We Solve */}
        <div className="bg-[#0D1322] border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            Why We Started ShopOrbit
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Online shopping in India has exploded, but finding genuine deals has never been harder. Marketplaces are crowded with counterfeit reviews, artificially inflated MRPs followed by fake "80% discounts," and algorithmic feeds biased toward whoever bids the most on advertising.
          </p>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            We built <strong>ShopOrbit</strong> to be your personal filter. We monitor price drops, verify discount histories, and curate only the products worth your hard-earned money from India's two most reputable digital retailers: <strong>Amazon India</strong> and <strong>Myntra</strong>.
          </p>
        </div>

        {/* Our 4 Guiding Principles */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              Our 4 Editorial Pillars
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Every deal featured on ShopOrbit passes these four strict gates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Genuine Price Drop Verification</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We track historical average prices. If a seller simply hiked the MRP by 30% yesterday just to offer a "30% off" sale today, we reject the deal immediately.
              </p>
            </div>

            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Reliable Merchant Fulfillment</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We link exclusively to Amazon India Fulfilled and Myntra Assured listings to ensure original authenticity, reliable warranty, and prompt delivery.
              </p>
            </div>

            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-white">High Customer Sentiment Floor</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                No bargain is a good deal if the product breaks in two weeks. We maintain a minimum 4.0+ rating requirement with hundreds of verified buyer reviews.
              </p>
            </div>

            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="text-lg font-bold text-white">100% Open Affiliate Transparency</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We never hide our affiliate relationships. We tell you clearly how we make money, comply with FTC & ASCI guidelines, and protect your privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Affiliate Disclosure in Full */}
        <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-purple-950/40 border border-purple-500/30 rounded-3xl p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">How We Earn: Affiliate Model Explained</h2>
              <p className="text-xs text-slate-400">Zero surcharge to readers. Funded by retailers.</p>
            </div>
          </div>

          <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
            <p>
              ShopOrbit is funded through affiliate marketing partnerships. When you click on a product card or redirect link on our site and make a purchase on Amazon India or Myntra, the merchant pays us a small percentage referral fee.
            </p>
            <p>
              <strong>You never pay more:</strong> The price you pay on Amazon India or Myntra is 100% identical whether you reached it through ShopOrbit or typed the URL directly into your browser. In fact, you often save more because we highlight exclusive coupon codes and flash sale discounts you might have missed!
            </p>
            <p>
              We do not accept paid placements or sponsored reviews that compromise our editorial integrity. If a product does not meet our quality bar, it does not get published.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/amazon-deals"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Explore Amazon Deals <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/myntra-fashion"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs"
            >
              Explore Myntra Fashion <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

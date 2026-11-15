import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Send,
  Heart,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Lock
} from 'lucide-react'

export const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim() && email.includes('@')) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer className="bg-[#05070D] border-t border-slate-800/80 text-slate-400 text-sm mt-20 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-500 p-0.5 shadow-neon-purple">
                <div className="w-full h-full bg-[#070A12] rounded-2xl flex items-center justify-center p-1.5">
                  <img src="/orbit-logo.svg" alt="ShopOrbit Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-['Space_Grotesk']">
                Shop<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Orbit</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Discover More. Spend Smarter. ShopOrbit curates India's highest-value price drops, verified tech deals, and trending fashion from Amazon India and Myntra.
            </p>

            {/* Platform Trust Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Amazon Associates Partner
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                Myntra Fashion Affiliate
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Explore Deals
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/amazon-deals" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  Amazon India Deals
                </Link>
              </li>
              <li>
                <Link to="/myntra-fashion" className="hover:text-pink-300 transition-colors flex items-center gap-1.5">
                  Myntra Fashion Edit
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-purple-300 transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/categories?filter=bestseller" className="hover:text-purple-300 transition-colors">
                  Bestsellers & Steals
                </Link>
              </li>
              <li>
                <Link to="/categories?filter=lightning" className="hover:text-purple-300 transition-colors">
                  Lightning Discounts
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support Column */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-purple-300 transition-colors">
                  About ShopOrbit
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-purple-300 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/contact#faq" className="hover:text-purple-300 transition-colors">
                  FAQ & Deal Submissions
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-purple-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Deal Alerts
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Get handpicked price drops and lightning flash deals straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-lg shadow-purple-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                Subscribe to Drops
              </button>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs mt-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Subscribed! We will notify you of top deals.
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Legal & Mandatory Affiliate Disclosure Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 text-xs text-slate-400 space-y-2 mb-8 leading-relaxed">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Mandatory Affiliate Disclosure & Disclaimer
          </div>
          <p>
            ShopOrbit is an independent product discovery portal and a participant in the <strong>Amazon Associates Programme</strong>, an affiliate advertising programme designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in. We are also an authorized partner in the <strong>Myntra Affiliate Network</strong>.
          </p>
          <p>
            When you purchase through outbound links on ShopOrbit, we may receive a small commission from Amazon India or Myntra at absolutely no additional cost to you. Products featured in this deployment with "Demo Data" tags are sample listings for layout and evaluation. Actual merchant pricing, availability, delivery timelines, and warranties are governed entirely by Amazon.in and Myntra.com.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ShopOrbit India. Built with React & Vite. Powered by Supabase & Cloudflare Pages.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for smart Indian shoppers
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}

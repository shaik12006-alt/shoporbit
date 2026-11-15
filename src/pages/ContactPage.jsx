import React, { useState } from 'react'
import {
  Mail,
  Send,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Building,
  Clock
} from 'lucide-react'
import { SEO } from '../components/SEO'

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Deal Tip',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: 'Deal Tip',
        message: ''
      })
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  const faqs = [
    {
      q: 'Does buying through ShopOrbit cost me extra money?',
      a: 'Absolutely not. You pay the exact same price as shopping directly on Amazon.in or Myntra.com. We earn a modest referral fee from the retailer at zero expense to you.'
    },
    {
      q: 'How does ShopOrbit detect fake discounts?',
      a: 'We track historical 90-day price trends across categories. If a merchant marks an item up before "slashing" it by 50%, our algorithms and team flag and reject the artificial inflation.'
    },
    {
      q: 'Can brands submit their products to be featured on ShopOrbit?',
      a: 'Yes! Brands with active Amazon India Fulfilled or Myntra listings can submit products via the contact form above. Our curation team will evaluate user ratings, return rates, and pricing value before approval.'
    },
    {
      q: 'What should I do if a deal is expired or out of stock?',
      a: 'Flash deals and lightning sales fluctuate quickly based on merchant inventory. If you spot an expired price, simply send us a message with the product name and our team will refresh or archive the listing.'
    },
    {
      q: 'How are clicks and analytics handled?',
      a: 'We track outbound clicks anonymously to understand which products our community finds most helpful and to reward popular deals with higher visibility. We never track or store financial or payment credentials.'
    }
  ]

  return (
    <div className="min-h-screen py-12 md:py-20">
      <SEO
        title="Contact Us & Frequently Asked Questions | ShopOrbit"
        description="Have a deal tip, partner inquiry, or question about ShopOrbit? Contact our team or read our comprehensive FAQ."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            We’d Love to Hear From You
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            Contact & Support
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Have a hot deal tip? Spotted a broken affiliate link? Or want to collaborate? Drop us a note below.
          </p>
        </div>

        {/* Contact Form and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Contact Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0D1322] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                Get in Touch
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Editorial & Tips Email</div>
                    <div className="text-slate-400 text-xs mt-0.5">editorial@shoporbit.in</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex-shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Brand & Affiliate Partnerships</div>
                    <div className="text-slate-400 text-xs mt-0.5">partnerships@shoporbit.in</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Curation Hours</div>
                    <div className="text-slate-400 text-xs mt-0.5">Mon – Sat: 9:00 AM – 9:00 PM IST</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                <span className="text-purple-300 font-bold block mb-1">
                  ⚡ Quick Turnaround
                </span>
                We review deal submissions and merchant verification requests within 24 business hours.
              </div>
            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#0D1322] border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Subject / Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Deal Tip">Submit a Hot Deal Tip</option>
                    <option value="Broken Link">Report Expired Deal / Broken Link</option>
                    <option value="Brand Partnership">Brand / Affiliate Partnership</option>
                    <option value="Feedback">General Feedback & Suggestions</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide deal URL, price details, or your feedback..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-purple-600/30 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>

                {submitted && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                    <span>Thank you! Your message has been received. We will get back to you shortly.</span>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div id="faq" className="space-y-6 pt-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Answers to our most common questions about affiliate links, price verification, and merchant policies.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="bg-[#0D1322] border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-purple-400 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

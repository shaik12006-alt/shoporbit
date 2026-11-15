import React, { useState } from 'react'
import {
  Shield,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  MousePointerClick,
  ExternalLink,
  RotateCcw,
  Database,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Eye,
  Layers,
  Sparkles,
  Copy,
  Check
} from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../data/categories'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { SEO } from '../components/SEO'

export const AdminDashboardPage = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDemo,
    clickEvents
  } = useProducts()

  const {
    isAdmin,
    loginWithPin,
    loginWithSupabase,
    logoutAdmin,
    authError,
    authLoading,
    defaultDemoPin
  } = useAuth()

  const [pinInput, setPinInput] = useState('')
  const [activeTab, setActiveTab] = useState('products') // 'products' | 'analytics' | 'supabase'
  const [adminSearch, setAdminSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState('All')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [copiedSql, setCopiedSql] = useState(false)

  // New product form state
  const initialFormState = {
    title: '',
    brand: '',
    platform: 'Amazon India',
    category: 'electronics',
    mrp: '',
    dealPrice: '',
    image: '',
    affiliateUrl: '',
    badge: 'Hot Deal',
    inStock: true,
    description: '',
    featuresText: ''
  }
  const [formData, setFormData] = useState(initialFormState)

  // If not logged in, show login panel
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <SEO title="Admin Login | ShopOrbit" />
        <div className="bg-[#0D1322] border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto mb-3 shadow-neon-purple">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
              ShopOrbit Admin
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage affiliate products, track outbound clicks, and monitor deals.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              loginWithPin(pinInput)
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Admin Passcode
              </label>
              <input
                type="password"
                placeholder="Enter admin passcode..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                💡 Demo Passcode: <code className="text-purple-400 bg-slate-900 px-1 py-0.5 rounded">{defaultDemoPin}</code>
              </p>
            </div>

            {authError && (
              <div className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all active:scale-95"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Supabase Status: {isSupabaseConfigured() ? '🟢 Connected' : '🟡 Local Storage Mode (Ready to sync)'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Calculate analytics
  const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0)
  const amazonClicks = products
    .filter(p => p.platform.toLowerCase().includes('amazon'))
    .reduce((acc, p) => acc + (p.clicks || 0), 0)
  const myntraClicks = products
    .filter(p => p.platform.toLowerCase().includes('myntra'))
    .reduce((acc, p) => acc + (p.clicks || 0), 0)

  const topProducts = [...products]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 5)

  // Filter products for the table
  const displayedProducts = products
    .filter(p => {
      if (platformFilter !== 'All' && p.platform !== platformFilter) return false
      if (adminSearch.trim()) {
        const q = adminSearch.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        )
      }
      return true
    })

  // Handlers for Add / Edit
  const handleSaveProduct = (e) => {
    e.preventDefault()
    const featuresArray = formData.featuresText
      ? formData.featuresText.split('\n').filter(Boolean)
      : []

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: formData.title,
        brand: formData.brand,
        platform: formData.platform,
        category: formData.category,
        mrp: Number(formData.mrp),
        dealPrice: Number(formData.dealPrice),
        image: formData.image,
        affiliateUrl: formData.affiliateUrl,
        badge: formData.badge,
        inStock: formData.inStock,
        description: formData.description,
        features: featuresArray
      })
      setEditingProduct(null)
    } else {
      addProduct({
        title: formData.title,
        brand: formData.brand,
        platform: formData.platform,
        category: formData.category,
        mrp: Number(formData.mrp),
        dealPrice: Number(formData.dealPrice),
        image: formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        affiliateUrl: formData.affiliateUrl,
        badge: formData.badge,
        inStock: formData.inStock,
        description: formData.description,
        features: featuresArray,
        rating: 4.5,
        reviewCount: 120
      })
      setIsAddModalOpen(false)
    }
    setFormData(initialFormState)
  }

  const startEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      brand: product.brand,
      platform: product.platform,
      category: product.category,
      mrp: product.mrp,
      dealPrice: product.dealPrice,
      image: product.image,
      affiliateUrl: product.affiliateUrl,
      badge: product.badge || '',
      inStock: product.inStock,
      description: product.description || '',
      featuresText: (product.features || []).join('\n')
    })
  }

  const supabaseSql = `-- Supabase Schema for ShopOrbit
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  platform TEXT NOT NULL,
  category TEXT NOT NULL,
  mrp NUMERIC NOT NULL,
  deal_price NUMERIC NOT NULL,
  discount_percentage NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 4.5,
  review_count NUMERIC DEFAULT 0,
  image TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  badge TEXT,
  clicks NUMERIC DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_clicks (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  referrer TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`

  const copySql = () => {
    navigator.clipboard.writeText(supabaseSql)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 2500)
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <SEO title="Admin Control Dashboard | ShopOrbit" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <Shield className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                ShopOrbit Management Center
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Affiliate Link Redirection • Click Analytics • Catalog Operations
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setFormData(initialFormState)
                setIsAddModalOpen(true)
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Deal</span>
            </button>

            <button
              onClick={resetToDemo}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Reset to default demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/20 text-xs font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'products'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Click Analytics & Popular Deals
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              activeTab === 'supabase'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Supabase Config
          </button>
        </div>

        {/* --- TAB 1: PRODUCT CATALOG --- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search and Filter Row */}
            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search products by title, brand, category..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Platform:</span>
                {['All', 'Amazon India', 'Myntra India'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatformFilter(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      platformFilter === p
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p === 'All' ? 'All' : p.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Platform</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Discount</th>
                      <th className="py-3 px-4">Clicks</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {displayedProducts.map(p => {
                      const isAmz = p.platform.toLowerCase().includes('amazon')
                      return (
                        <tr key={p.id} className="hover:bg-slate-900/40 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                              />
                              <div className="max-w-xs sm:max-w-sm truncate">
                                <div className="font-semibold text-white truncate" title={p.title}>
                                  {p.title}
                                </div>
                                <div className="text-[11px] text-purple-400">{p.brand} • {p.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                isAmz
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : 'bg-pink-500/15 text-pink-300 border border-pink-500/30'
                              }`}
                            >
                              {p.platform}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            ₹{p.dealPrice.toLocaleString('en-IN')}
                            <span className="block text-[10px] text-slate-500 line-through">
                              ₹{p.mrp.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-xs">
                              {p.discountPercentage}% OFF
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-amber-400">
                              🔥 {p.clicks || 0}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${p.inStock ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={p.affiliateUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Test affiliate URL"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => startEdit(p)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition"
                                title="Edit product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete "${p.title}"?`)) {
                                    deleteProduct(p.id)
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: ANALYTICS & POPULAR DEALS --- */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#0D1322] border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-bold uppercase">
                  <span>Total Outbound Clicks</span>
                  <MousePointerClick className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white font-['Space_Grotesk']">
                  {totalClicks}
                </div>
                <p className="text-xs text-slate-500 mt-1">Shopper visits tracked to Amazon & Myntra</p>
              </div>

              <div className="bg-[#0D1322] border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-bold uppercase">
                  <span>Amazon India Clicks</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>
                <div className="text-3xl font-black text-amber-300 font-['Space_Grotesk']">
                  {amazonClicks}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {totalClicks ? Math.round((amazonClicks / totalClicks) * 100) : 0}% of total click volume
                </p>
              </div>

              <div className="bg-[#0D1322] border border-pink-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-bold uppercase">
                  <span>Myntra Fashion Clicks</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                </div>
                <div className="text-3xl font-black text-pink-300 font-['Space_Grotesk']">
                  {myntraClicks}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {totalClicks ? Math.round((myntraClicks / totalClicks) * 100) : 0}% of total click volume
                </p>
              </div>
            </div>

            {/* Popular Products Leaderboard */}
            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Top 5 Most Popular Deals by Outbound Clicks
              </h2>
              <div className="space-y-3">
                {topProducts.map((p, index) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
                        #{index + 1}
                      </div>
                      <img src={p.image} alt={p.title} className="w-9 h-9 rounded object-cover" />
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-white max-w-sm truncate">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-slate-400">{p.platform} • ₹{p.dealPrice.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-amber-400">
                        {p.clicks || 0} clicks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Clicks Activity Feed */}
            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Recent Outbound Click Events Log
              </h2>
              {clickEvents.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {clickEvents.slice(0, 15).map(ev => (
                    <div key={ev.id} className="flex items-center justify-between py-2 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">●</span>
                        <span className="font-medium text-white">{ev.productTitle}</span>
                        <span className="text-slate-500">({ev.platform})</span>
                      </div>
                      <span className="text-slate-400">
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No clicks recorded in this session yet. Click on any product's affiliate button on the site to see live events appear here!
                </p>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: SUPABASE INTEGRATION & CLOUDFLARE PAGES --- */}
        {activeTab === 'supabase' && (
          <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Supabase Free Tier Integration</h2>
                  <p className="text-xs text-slate-400">
                    Status: {isSupabaseConfigured() ? '🟢 Connected with environment keys' : '🟡 Active in Local Storage Mode (Ready to connect)'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                ShopOrbit is engineered to work <strong>100% out of the box</strong> using resilient persistent storage, and can seamlessly connect to your free-tier Supabase project at any time.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-400 pl-2">
                <li>Create a free project at <strong className="text-white">supabase.com</strong></li>
                <li>Go to the <strong>SQL Editor</strong> in your Supabase dashboard and run the schema query below:</li>
              </ol>
            </div>

            {/* SQL Copy Box */}
            <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <button
                onClick={copySql}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs border border-slate-700 transition"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL' : 'Copy SQL Script'}</span>
              </button>
              <pre className="pr-24">{supabaseSql}</pre>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
              <strong>Cloudflare Pages Deployment:</strong> To deploy to Cloudflare Pages, simply push this repository to GitHub or run <code>npm run build</code> and point Cloudflare Pages build output directory to <code>dist</code> with build command <code>npm run build</code>.
            </div>
          </div>
        )}

        {/* --- ADD / EDIT PRODUCT MODAL --- */}
        {(isAddModalOpen || editingProduct) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#0D1322] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => {
                  setIsAddModalOpen(false)
                  setEditingProduct(null)
                  setFormData(initialFormState)
                }}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-white mb-6">
                {editingProduct ? 'Edit Affiliate Product' : 'Add New Affiliate Deal'}
              </h2>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony WH-1000XM5 Headphones"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Brand</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sony, Nike, Apple"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Platform</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Amazon India">Amazon India</option>
                      <option value="Myntra India">Myntra India</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Deal Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. Hot Deal, 50% Off, Bestseller"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Original MRP (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 29990"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Deal Price (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 19990"
                      value={formData.dealPrice}
                      onChange={(e) => setFormData({ ...formData, dealPrice: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Affiliate Link (with Tag)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.amazon.in/dp/...?tag=shoporbit-21"
                    value={formData.affiliateUrl}
                    onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of why this deal is great..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">
                    Key Features (one per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ANC with 8 microphones&#10;Up to 30 hours battery&#10;Multipoint Bluetooth 5.2"
                    value={formData.featuresText}
                    onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition active:scale-95"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Deal'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

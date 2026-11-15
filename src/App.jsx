import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { AffiliateNoticeBanner } from './components/AffiliateNoticeBanner'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { QuickViewModal } from './components/QuickViewModal'

// Pages
import { HomePage } from './pages/HomePage'
import { AmazonDealsPage } from './pages/AmazonDealsPage'
import { MyntraFashionPage } from './pages/MyntraFashionPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { AboutUsPage } from './pages/AboutUsPage'
import { ContactPage } from './pages/ContactPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#070A12] text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Top Affiliate Transparency Notice */}
      <AffiliateNoticeBanner />

      {/* Main Navigation */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/amazon-deals" element={<AmazonDealsPage />} />
          <Route path="/myntra-fashion" element={<MyntraFashionPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-6xl font-black text-purple-500 font-['Space_Grotesk'] mb-2">404</h1>
                <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
                <p className="text-xs text-slate-400 mb-6 max-w-sm">
                  The page or deal you requested does not exist or has been shifted in orbit.
                </p>
                <Link
                  to="/"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Back to ShopOrbit Home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Global Quick View Modal */}
      <QuickViewModal />

      {/* Footer with Mandatory Affiliate Disclosures */}
      <Footer />
    </div>
  )
}

export default App

import React, { createContext, useContext, useState, useEffect } from 'react'
import { SAMPLE_PRODUCTS } from '../data/sampleProducts'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const ProductContext = createContext(null)

const STORAGE_KEY = 'shoporbit_products_v1'
const FAVORITES_KEY = 'shoporbit_favorites_v1'
const CLICKS_HISTORY_KEY = 'shoporbit_clicks_history_v1'

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Could not load products from localStorage', e)
    }
    return SAMPLE_PRODUCTS
  })

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  const [clickEvents, setClickEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(CLICKS_HISTORY_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('All') // 'All' | 'Amazon India' | 'Myntra India'
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minDiscount, setMinDiscount] = useState(0)
  const [priceRange, setPriceRange] = useState([0, 150000])
  const [sortBy, setSortBy] = useState('popular') // 'popular' | 'price-low' | 'price-high' | 'discount' | 'rating'
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [supabaseActive, setSupabaseActive] = useState(isSupabaseConfigured())
  const [isLoading, setIsLoading] = useState(false)

  // Save to localStorage whenever products change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch (e) {
      console.error('Failed to save products to localStorage', e)
    }
  }, [products])

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e)
    }
  }, [favorites])

  useEffect(() => {
    try {
      localStorage.setItem(CLICKS_HISTORY_KEY, JSON.stringify(clickEvents))
    } catch (e) {
      console.error('Failed to save clickEvents to localStorage', e)
    }
  }, [clickEvents])

  // Try fetching from Supabase if configured
  useEffect(() => {
    const fetchFromSupabase = async () => {
      if (!isSupabaseConfigured() || !supabase) return
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('clicks', { ascending: false })

        if (!error && data && data.length > 0) {
          // Normalize column names if snake_case
          const normalized = data.map(item => ({
            id: item.id,
            title: item.title,
            brand: item.brand,
            platform: item.platform,
            category: item.category,
            mrp: Number(item.mrp || item.deal_price),
            dealPrice: Number(item.deal_price || item.dealPrice),
            discountPercentage: Number(item.discount_percentage || item.discountPercentage || 0),
            rating: Number(item.rating || 4.5),
            reviewCount: Number(item.review_count || item.reviewCount || 0),
            image: item.image,
            additionalImages: item.additional_images || item.additionalImages || [],
            affiliateUrl: item.affiliate_url || item.affiliateUrl,
            badge: item.badge,
            isDemo: Boolean(item.is_demo ?? item.isDemo ?? true),
            demoLabel: item.demo_label || item.demoLabel || 'Demo Catalog Listing',
            featured: Boolean(item.featured),
            trending: Boolean(item.trending),
            clicks: Number(item.clicks || 0),
            inStock: Boolean(item.in_stock ?? item.inStock ?? true),
            description: item.description,
            features: item.features || [],
            specifications: item.specifications || {}
          }))
          setProducts(normalized)
          setSupabaseActive(true)
        }
      } catch (err) {
        console.warn('Supabase fetch failed, relying on local persistence:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFromSupabase()
  }, [])

  // Affiliate Click Tracking Function
  const trackClick = async (productId, customAffiliateUrl) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const newClickCount = (product.clicks || 0) + 1

    // 1. Update local product clicks
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, clicks: newClickCount } : p))
    )

    // 2. Record analytics event
    const clickEvent = {
      id: Date.now().toString(),
      productId,
      productTitle: product.title,
      platform: product.platform,
      dealPrice: product.dealPrice,
      timestamp: new Date().toISOString()
    }
    setClickEvents(prev => [clickEvent, ...prev.slice(0, 499)])

    // 3. Sync to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('products')
          .update({ clicks: newClickCount })
          .eq('id', productId)

        await supabase.from('product_clicks').insert([
          {
            product_id: productId,
            platform: product.platform,
            referrer: document.referrer || 'direct'
          }
        ])
      } catch (e) {
        console.warn('Could not record click to Supabase', e)
      }
    }
  }

  // Favorite toggle
  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // Admin Actions
  const addProduct = async (newProduct) => {
    const productWithDefaults = {
      ...newProduct,
      id: newProduct.id || `custom-${Date.now()}`,
      clicks: 0,
      isDemo: true,
      demoLabel: 'Demo Catalog Listing',
      discountPercentage: Math.round(((newProduct.mrp - newProduct.dealPrice) / newProduct.mrp) * 100),
      features: newProduct.features || [],
      specifications: newProduct.specifications || {},
      additionalImages: newProduct.additionalImages || []
    }

    setProducts(prev => [productWithDefaults, ...prev])

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').insert([
          {
            id: productWithDefaults.id,
            title: productWithDefaults.title,
            brand: productWithDefaults.brand,
            platform: productWithDefaults.platform,
            category: productWithDefaults.category,
            mrp: productWithDefaults.mrp,
            deal_price: productWithDefaults.dealPrice,
            discount_percentage: productWithDefaults.discountPercentage,
            rating: productWithDefaults.rating,
            review_count: productWithDefaults.reviewCount,
            image: productWithDefaults.image,
            additional_images: productWithDefaults.additionalImages,
            affiliate_url: productWithDefaults.affiliateUrl,
            badge: productWithDefaults.badge,
            is_demo: true,
            demo_label: 'Demo Catalog Listing',
            featured: productWithDefaults.featured,
            trending: productWithDefaults.trending,
            clicks: 0,
            in_stock: productWithDefaults.inStock,
            description: productWithDefaults.description,
            features: productWithDefaults.features,
            specifications: productWithDefaults.specifications
          }
        ])
      } catch (e) {
        console.error('Supabase product insert failed:', e)
      }
    }
  }

  const updateProduct = async (id, updatedFields) => {
    const updatedDiscount = updatedFields.mrp && updatedFields.dealPrice
      ? Math.round(((updatedFields.mrp - updatedFields.dealPrice) / updatedFields.mrp) * 100)
      : updatedFields.discountPercentage

    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, ...updatedFields, discountPercentage: updatedDiscount ?? p.discountPercentage } : p
      )
    )

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('products')
          .update({
            title: updatedFields.title,
            brand: updatedFields.brand,
            platform: updatedFields.platform,
            category: updatedFields.category,
            mrp: updatedFields.mrp,
            deal_price: updatedFields.dealPrice,
            discount_percentage: updatedDiscount,
            image: updatedFields.image,
            affiliate_url: updatedFields.affiliateUrl,
            badge: updatedFields.badge,
            featured: updatedFields.featured,
            trending: updatedFields.trending,
            in_stock: updatedFields.inStock,
            description: updatedFields.description
          })
          .eq('id', id)
      } catch (e) {
        console.error('Supabase update failed:', e)
      }
    }
  }

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    setFavorites(prev => prev.filter(fId => fId !== id))

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id)
      } catch (e) {
        console.error('Supabase delete failed:', e)
      }
    }
  }

  const resetToDemo = () => {
    setProducts(SAMPLE_PRODUCTS)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        favorites,
        toggleFavorite,
        clickEvents,
        trackClick,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDemo,
        searchQuery,
        setSearchQuery,
        selectedPlatform,
        setSelectedPlatform,
        selectedCategory,
        setSelectedCategory,
        minDiscount,
        setMinDiscount,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        quickViewProduct,
        setQuickViewProduct,
        supabaseActive,
        isLoading
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

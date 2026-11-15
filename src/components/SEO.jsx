import { useEffect } from 'react'

export const SEO = ({ title, description }) => {
  useEffect(() => {
    const defaultTitle = 'ShopOrbit — Discover More. Spend Smarter | Amazon & Myntra Deals'
    document.title = title ? `${title} | ShopOrbit` : defaultTitle

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.name = 'description'
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', description)
    }
  }, [title, description])

  return null
}

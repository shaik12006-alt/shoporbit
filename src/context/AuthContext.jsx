import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)

const LOCAL_ADMIN_HASH_KEY = 'shoporbit_local_admin_hash'
const SESSION_STORAGE_KEY = 'shoporbit_admin_auth_state'

// Helper for local dev Web Crypto SHA-256 hashing
async function computeSha256(text) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isLocalMode, setIsLocalMode] = useState(false)

  // 1. Initial Session Verification (Server-Side)
  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      setAuthLoading(true)

      // A. Try Cloudflare Pages server-side session cookie verification
      try {
        const res = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          if (data && data.authenticated) {
            if (isMounted) {
              setIsAdmin(true)
              setAuthLoading(false)
              return
            }
          }
        }
      } catch (err) {
        // If not running on Cloudflare Pages runtime (e.g. local vite dev without functions)
        setIsLocalMode(true)
      }

      // B. Check Supabase session if configured
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            if (isMounted) {
              setUser(session.user)
              setIsAdmin(true)
              setAuthLoading(false)
              return
            }
          }
        } catch (e) {
          console.warn('Supabase session check error:', e)
        }
      }

      // C. Local Dev fallback (sessionStorage only, no default password)
      const sessionActive = sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true'
      if (sessionActive && isMounted) {
        setIsAdmin(true)
      }

      if (isMounted) {
        setAuthLoading(false)
      }
    }

    checkSession()

    // Listen to Supabase auth state changes if configured
    let subscription = null
    if (isSupabaseConfigured() && supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return
        setUser(session?.user ?? null)
        if (session?.user) {
          setIsAdmin(true)
        }
      })
      subscription = data.subscription
    }

    return () => {
      isMounted = false
      if (subscription) subscription.unsubscribe()
    }
  }, [])

  // 2. Login with Admin Password (Server-Side Cloudflare Function + Local Dev Fallback)
  const loginWithPassword = async (password) => {
    setAuthLoading(true)
    setAuthError(null)

    const cleanPassword = (password || '').trim()
    if (!cleanPassword) {
      setAuthError('Please enter your admin password.')
      setAuthLoading(false)
      return { success: false, error: 'Password required' }
    }

    // A. Attempt Server-Side Edge Verification via Cloudflare Function
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: cleanPassword })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setIsAdmin(true)
          sessionStorage.setItem(SESSION_STORAGE_KEY, 'true')
          setAuthLoading(false)
          return { success: true }
        }
      } else if (res.status === 401 || res.status === 503) {
        const errorData = await res.json().catch(() => ({}))
        const msg = errorData.error || 'Invalid admin credentials'
        setAuthError(msg)
        setAuthLoading(false)
        return { success: false, error: msg }
      }
    } catch (edgeErr) {
      // In local dev without Cloudflare Pages Functions running:
      console.warn('Edge login endpoint unavailable, using local cryptographic verification.')
    }

    // B. Local Dev fallback with SHA-256 hash comparison
    // Never uses a default hardcoded password. Uses user's private local hash.
    try {
      const submittedHash = await computeSha256(cleanPassword)
      const existingHash = localStorage.getItem(LOCAL_ADMIN_HASH_KEY)

      if (!existingHash) {
        // First run in local dev: securely set the admin password
        localStorage.setItem(LOCAL_ADMIN_HASH_KEY, submittedHash)
        setIsAdmin(true)
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true')
        setAuthLoading(false)
        return {
          success: true,
          initialSetup: true,
          message: 'Admin password established successfully for this device.'
        }
      }

      if (submittedHash === existingHash) {
        setIsAdmin(true)
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true')
        setAuthLoading(false)
        return { success: true }
      } else {
        setAuthError('Incorrect admin password.')
        setAuthLoading(false)
        return { success: false, error: 'Incorrect password' }
      }
    } catch (e) {
      setAuthError('Authentication failed.')
      setAuthLoading(false)
      return { success: false, error: e.message }
    }
  }

  // 3. Supabase Auth Login
  const loginWithSupabase = async (email, password) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase credentials are not configured.' }
    }
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      setUser(data.user)
      setIsAdmin(true)
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true')
      return { success: true }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    } finally {
      setAuthLoading(false)
    }
  }

  // 4. Change Password Function
  const changeAdminPassword = async ({ currentPassword, newPassword }) => {
    setAuthLoading(true)
    setAuthError(null)

    if (!newPassword || newPassword.length < 8) {
      const msg = 'New password must be at least 8 characters long.'
      setAuthError(msg)
      setAuthLoading(false)
      return { success: false, error: msg }
    }

    // A. If signed in through Supabase
    if (user && isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        })
        if (error) throw error
        setAuthLoading(false)
        return { success: true, message: 'Supabase password updated successfully!' }
      } catch (err) {
        setAuthError(err.message)
        setAuthLoading(false)
        return { success: false, error: err.message }
      }
    }

    // B. Server-Side Cloudflare Function
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword })
      })

      if (res.ok) {
        const data = await res.json()
        setAuthLoading(false)
        return data
      } else {
        const errData = await res.json().catch(() => ({}))
        const errorMsg = errData.error || 'Password update failed on server.'
        setAuthError(errorMsg)
        setAuthLoading(false)
        return { success: false, error: errorMsg }
      }
    } catch (edgeErr) {
      // Local dev fallback
      const currentHash = await computeSha256(currentPassword)
      const existingHash = localStorage.getItem(LOCAL_ADMIN_HASH_KEY)

      if (existingHash && currentHash !== existingHash) {
        const msg = 'Current password does not match.'
        setAuthError(msg)
        setAuthLoading(false)
        return { success: false, error: msg }
      }

      const newHash = await computeSha256(newPassword)
      localStorage.setItem(LOCAL_ADMIN_HASH_KEY, newHash)
      setAuthLoading(false)
      return {
        success: true,
        newHash,
        message: 'Password updated locally. Copy your new SHA-256 hash to Cloudflare Secrets.'
      }
    }
  }

  // 5. Logout Function
  const logoutAdmin = async () => {
    // Call server-side logout to clear HttpOnly cookie
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (e) {
      // ignore
    }

    // Sign out of Supabase if active
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut()
      } catch (e) {
        // ignore
      }
    }

    setIsAdmin(false)
    setUser(null)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        user,
        authError,
        authLoading,
        loginWithPassword,
        loginWithSupabase,
        changeAdminPassword,
        logoutAdmin,
        isLocalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

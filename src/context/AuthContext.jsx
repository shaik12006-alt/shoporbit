import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)

const ADMIN_SESSION_KEY = 'shoporbit_admin_session'
const DEFAULT_DEMO_PIN = 'orbitadmin'

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
  })
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  // Listen to Supabase auth state if configured
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setIsAdmin(true)
        localStorage.setItem(ADMIN_SESSION_KEY, 'true')
      }
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setIsAdmin(true)
        localStorage.setItem(ADMIN_SESSION_KEY, 'true')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loginWithPin = (pin) => {
    setAuthLoading(true)
    setAuthError(null)

    // Demo / Quick Admin Access
    if (pin === DEFAULT_DEMO_PIN || pin === 'admin123') {
      setIsAdmin(true)
      localStorage.setItem(ADMIN_SESSION_KEY, 'true')
      setAuthLoading(false)
      return { success: true }
    } else {
      setAuthError('Invalid Admin Passcode. Default demo passcode is "orbitadmin"')
      setAuthLoading(false)
      return { success: false, error: 'Invalid passcode' }
    }
  }

  const loginWithSupabase = async (email, password) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase credentials not configured in .env' }
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
      localStorage.setItem(ADMIN_SESSION_KEY, 'true')
      return { success: true }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    } finally {
      setAuthLoading(false)
    }
  }

  const logoutAdmin = async () => {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut()
      } catch (e) {
        // ignore
      }
    }
    setIsAdmin(false)
    setUser(null)
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        user,
        authError,
        authLoading,
        loginWithPin,
        loginWithSupabase,
        logoutAdmin,
        defaultDemoPin: DEFAULT_DEMO_PIN
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

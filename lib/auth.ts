import { supabase } from './supabaseClient'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email: string | null
  role: 'customer' | 'staff' | 'admin'
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

/**
 * Authentication utilities for the admin panel
 */
export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        return { user: null, error: error.message }
      }

      return { user: data.user, error: null }
    } catch (err) {
      console.error('Unexpected sign in error:', err)
      return { user: null, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (err) {
      console.error('Sign out error:', err)
      return { error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get the current user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (err) {
      console.error('Get current user error:', err)
      return null
    }
  }

  /**
   * Get user profile by user ID
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Get profile error:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('Unexpected get profile error:', err)
      return null
    }
  }

  /**
   * Create a new profile for a user
   */
  static async createProfile(data: {
    id: string
    email: string | null
    role?: 'customer' | 'staff' | 'admin'
  }): Promise<Profile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .insert({
          id: data.id,
          email: data.email,
          role: data.role || 'customer'
        })
        .select()
        .single()

      if (error) {
        console.error('Create profile error:', error)
        return null
      }

      return profile
    } catch (err) {
      console.error('Unexpected create profile error:', err)
      return null
    }
  }

  /**
   * Update user profile role
   */
  static async updateProfileRole(userId: string, role: 'customer' | 'staff' | 'admin'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Update profile role error:', error)
        return false
      }

      return true
    } catch (err) {
      console.error('Unexpected update profile role error:', err)
      return false
    }
  }

  /**
   * Check if user has admin or staff role
   */
  static async hasAdminAccess(userId: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId)
      return profile?.role === 'admin' || profile?.role === 'staff'
    } catch (err) {
      console.error('Check admin access error:', err)
      return false
    }
  }

  /**
   * Check if user has admin role
   */
  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId)
      return profile?.role === 'admin'
    } catch (err) {
      console.error('Check admin role error:', err)
      return false
    }
  }

  /**
   * Get the complete auth state (user + profile)
   */
  static async getAuthState(): Promise<AuthState> {
    try {
      const user = await this.getCurrentUser()
      
      if (!user) {
        return {
          user: null,
          profile: null,
          loading: false,
          error: null
        }
      }

      const profile = await this.getProfile(user.id)
      
      return {
        user,
        profile,
        loading: false,
        error: null
      }
    } catch (err) {
      console.error('Get auth state error:', err)
      return {
        user: null,
        profile: null,
        loading: false,
        error: 'Failed to get authentication state'
      }
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (state: AuthState) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await this.getProfile(session.user.id)
        callback({
          user: session.user,
          profile,
          loading: false,
          error: null
        })
      } else {
        callback({
          user: null,
          profile: null,
          loading: false,
          error: null
        })
      }
    })
  }

  /**
   * Create a staff user (for admin use)
   */
  static async createStaffUser(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'staff' }
        }
      })

      if (error) {
        console.error('Create staff user error:', error)
        return { user: null, error: error.message }
      }

      // Create profile with staff role
      if (data.user) {
        await this.createProfile({
          id: data.user.id,
          email: data.user.email,
          role: 'staff'
        })
      }

      return { user: data.user, error: null }
    } catch (err) {
      console.error('Unexpected create staff user error:', err)
      return { user: null, error: 'An unexpected error occurred' }
    }
  }
}

/**
 * React hook for authentication state
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial auth state
    AuthService.getAuthState().then(setState)

    // Listen to auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(setState)

    return () => subscription.unsubscribe()
  }, [])

  return state
}

/**
 * Higher-order component for protecting admin routes
 */
export function withAuth<T extends {}>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { user, profile, loading } = useAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
            <a 
              href="/admin/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      )
    }

    if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <a 
              href="/admin/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Out
            </a>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

// Import React hooks for the hook and HOC
import { useState, useEffect } from 'react'

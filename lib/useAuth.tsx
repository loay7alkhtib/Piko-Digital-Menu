'use client'

/**
 * React hooks and components for authentication
 * This file is client-side only and contains React hooks
 */
import { useState, useEffect } from 'react'
import { AuthService, AuthState } from './auth'

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

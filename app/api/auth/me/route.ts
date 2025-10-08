import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

/**
 * GET /api/auth/me
 * Get current authenticated user and profile
 */
export async function GET(request: NextRequest) {
  try {
    const authState = await AuthService.getAuthState()
    
    if (!authState.user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Not authenticated' 
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authState.user.id,
        email: authState.user.email,
        role: authState.profile?.role || 'customer'
      }
    })

  } catch (error) {
    console.error('Get current user API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

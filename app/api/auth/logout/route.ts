import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

/**
 * POST /api/auth/logout
 * Sign out the current user
 */
export async function POST(request: NextRequest) {
  try {
    const { error } = await AuthService.signOut()
    
    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Logout failed',
          message: error 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    })

  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

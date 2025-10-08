import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { ValidationSchemas, Validator } from '@/lib/validation'

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validator = new Validator()
    const validation = validator.validate(body, ValidationSchemas.login)
    
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validation.errors 
        },
        { status: 400 }
      )
    }

    const { email, password } = body

    // Attempt authentication
    const { user, error } = await AuthService.signIn(email, password)
    
    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication failed',
          message: error 
        },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      )
    }

    // Get user profile
    const profile = await AuthService.getProfile(user.id)
    
    if (!profile) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Profile not found' 
        },
        { status: 404 }
      )
    }

    // Check if user has admin/staff access
    if (profile.role !== 'admin' && profile.role !== 'staff') {
      await AuthService.signOut() // Sign out the user
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access denied. Admin or staff role required.' 
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: profile.role
      },
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

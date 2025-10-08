import { NextRequest, NextResponse } from 'next/server'
import { getAllItemsForAdmin, createItem } from '@/lib/queries'
import { AuthService } from '@/lib/auth'
import { ValidationSchemas, Validator } from '@/lib/validation'

/**
 * GET /api/items
 * Get all items for admin panel
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authState = await AuthService.getAuthState()
    
    if (!authState.user || !authState.profile) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required' 
        },
        { status: 401 }
      )
    }

    if (authState.profile.role !== 'admin' && authState.profile.role !== 'staff') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admin or staff access required' 
        },
        { status: 403 }
      )
    }

    // Get locale from query params
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'

    // Validate locale
    if (!['en', 'ar', 'tr'].includes(locale)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid locale' 
        },
        { status: 400 }
      )
    }

    // Fetch items
    const items = await getAllItemsForAdmin(locale as any)
    
    return NextResponse.json({
      success: true,
      data: items
    })

  } catch (error) {
    console.error('Get items API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/items
 * Create a new item
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authState = await AuthService.getAuthState()
    
    if (!authState.user || !authState.profile) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required' 
        },
        { status: 401 }
      )
    }

    if (authState.profile.role !== 'admin' && authState.profile.role !== 'staff') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admin or staff access required' 
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate request body
    const validator = new Validator()
    const validation = validator.validate(body, ValidationSchemas.item)
    
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

    // Create item
    const item = await createItem(body)
    
    if (!item) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create item' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Item created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create item API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

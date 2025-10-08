import { NextRequest, NextResponse } from 'next/server'
import { StorageService } from '@/lib/storage'
import { AuthService } from '@/lib/auth'

/**
 * POST /api/upload
 * Upload a file to Supabase Storage
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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'items'
    const overwrite = formData.get('overwrite') === 'true'

    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No file provided' 
        },
        { status: 400 }
      )
    }

    // Upload file
    const result = await StorageService.uploadFile(file, {
      folder,
      overwrite,
      maxSizeBytes: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    })

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Upload failed' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        path: result.path
      },
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

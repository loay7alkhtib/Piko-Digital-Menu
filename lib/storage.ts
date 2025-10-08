import { supabase } from './supabaseClient'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  path?: string
}

export interface UploadOptions {
  bucket?: string
  folder?: string
  fileName?: string
  overwrite?: boolean
  maxSizeBytes?: number
  allowedTypes?: string[]
}

/**
 * Storage utilities for handling file uploads
 */
export class StorageService {
  private static readonly DEFAULT_BUCKET = 'menu-images'
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ]

  /**
   * Upload a file to Supabase Storage
   */
  static async uploadFile(
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, options)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        }
      }

      // Generate file path
      const fileName = options.fileName || this.generateFileName(file)
      const folder = options.folder || 'items'
      const filePath = `${folder}/${fileName}`
      const bucket = options.bucket || this.DEFAULT_BUCKET

      // Check if file should be overwritten
      if (!options.overwrite) {
        const existingFile = await this.checkFileExists(bucket, filePath)
        if (existingFile) {
          return {
            success: false,
            error: 'File already exists. Use overwrite option to replace it.'
          }
        }
      }

      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: options.overwrite || false,
          cacheControl: '3600'
        })

      if (error) {
        console.error('Upload error:', error)
        return {
          success: false,
          error: error.message
        }
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return {
        success: true,
        url: publicUrl,
        path: filePath
      }

    } catch (err) {
      console.error('Unexpected upload error:', err)
      return {
        success: false,
        error: 'An unexpected error occurred during upload'
      }
    }
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(
    filePath: string,
    bucket: string = this.DEFAULT_BUCKET
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        console.error('Delete error:', error)
        return {
          success: false,
          error: error.message
        }
      }

      return { success: true }

    } catch (err) {
      console.error('Unexpected delete error:', err)
      return {
        success: false,
        error: 'An unexpected error occurred during deletion'
      }
    }
  }

  /**
   * Get public URL for a file
   */
  static getPublicUrl(
    filePath: string,
    bucket: string = this.DEFAULT_BUCKET
  ): string {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return publicUrl
  }

  /**
   * List files in a folder
   */
  static async listFiles(
    folder: string = '',
    bucket: string = this.DEFAULT_BUCKET,
    limit: number = 100
  ): Promise<{ success: boolean; files?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder, {
          limit,
          offset: 0
        })

      if (error) {
        console.error('List files error:', error)
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        files: data || []
      }

    } catch (err) {
      console.error('Unexpected list files error:', err)
      return {
        success: false,
        error: 'An unexpected error occurred while listing files'
      }
    }
  }

  /**
   * Check if a file exists
   */
  static async checkFileExists(
    filePath: string,
    bucket: string = this.DEFAULT_BUCKET
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(filePath.split('/').slice(0, -1).join('/'), {
          search: filePath.split('/').pop()
        })

      return !error && data && data.length > 0

    } catch (err) {
      console.error('Check file exists error:', err)
      return false
    }
  }

  /**
   * Validate file before upload
   */
  private static validateFile(
    file: File, 
    options: UploadOptions
  ): { valid: boolean; error?: string } {
    // Check file size
    const maxSize = options.maxSizeBytes || this.MAX_FILE_SIZE
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds limit of ${Math.round(maxSize / 1024 / 1024)}MB`
      }
    }

    // Check file type
    const allowedTypes = options.allowedTypes || this.ALLOWED_TYPES
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      }
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        valid: false,
        error: 'File is empty'
      }
    }

    return { valid: true }
  }

  /**
   * Generate a unique file name
   */
  private static generateFileName(file: File): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    
    return `${timestamp}-${randomString}.${extension}`
  }

  /**
   * Optimize image file (client-side compression)
   */
  static async optimizeImage(
    file: File,
    maxWidth: number = 1200,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(optimizedFile)
            } else {
              reject(new Error('Failed to optimize image'))
            }
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Create a preview URL for an image file
   */
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  /**
   * Revoke a preview URL to free memory
   */
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url)
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Get file extension from filename
   */
  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  /**
   * Check if file is an image
   */
  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/')
  }

  /**
   * Get image dimensions
   */
  static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
        URL.revokeObjectURL(img.src)
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }
}

/**
 * React hook for file upload with progress
 */
export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Simulate progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const result = await StorageService.uploadFile(file, options)
      
      clearInterval(progressInterval)
      setProgress(100)

      if (!result.success) {
        setError(result.error || 'Upload failed')
      }

      setUploading(false)
      return result

    } catch (err) {
      setUploading(false)
      setError('An unexpected error occurred')
      return {
        success: false,
        error: 'An unexpected error occurred'
      }
    }
  }

  return {
    uploadFile,
    uploading,
    progress,
    error,
    clearError: () => setError(null)
  }
}

// Import React hooks
import { useState } from 'react'

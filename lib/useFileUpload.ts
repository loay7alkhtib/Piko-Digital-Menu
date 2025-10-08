'use client'

/**
 * React hook for file upload with progress
 * This file is client-side only and contains React hooks
 */
import { useState } from 'react'
import { StorageService, UploadOptions, UploadResult } from './storage'

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

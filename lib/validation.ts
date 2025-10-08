/**
 * Backend validation utilities for Piko Digital Menu
 * Provides type-safe validation for forms and data
 */

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string[]>
}

export interface ValidationRule<T = any> {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  min?: number
  max?: number
  custom?: (value: T) => string | null
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

/**
 * Validation utility class
 */
export class Validator {
  private errors: Record<string, string[]> = {}

  /**
   * Validate a single value against a rule
   */
  private validateValue<T>(
    value: T, 
    rule: ValidationRule<T>, 
    fieldName: string
  ): string[] {
    const fieldErrors: string[] = []

    // Required check
    if (rule.required && (value === null || value === undefined || value === '')) {
      fieldErrors.push(`${fieldName} is required`)
      return fieldErrors
    }

    // Skip other validations if value is empty and not required
    if (value === null || value === undefined || value === '') {
      return fieldErrors
    }

    // String validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        fieldErrors.push(`${fieldName} must be at least ${rule.minLength} characters`)
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        fieldErrors.push(`${fieldName} must be no more than ${rule.maxLength} characters`)
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        fieldErrors.push(`${fieldName} format is invalid`)
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        fieldErrors.push(`${fieldName} must be at least ${rule.min}`)
      }
      
      if (rule.max !== undefined && value > rule.max) {
        fieldErrors.push(`${fieldName} must be no more than ${rule.max}`)
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value)
      if (customError) {
        fieldErrors.push(customError)
      }
    }

    return fieldErrors
  }

  /**
   * Validate data against schema
   */
  validate(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
    this.errors = {}

    for (const [fieldName, rule] of Object.entries(schema)) {
      const value = data[fieldName]
      const fieldErrors = this.validateValue(value, rule, fieldName)
      
      if (fieldErrors.length > 0) {
        this.errors[fieldName] = fieldErrors
      }
    }

    return {
      valid: Object.keys(this.errors).length === 0,
      errors: this.errors
    }
  }

  /**
   * Get errors for a specific field
   */
  getFieldErrors(fieldName: string): string[] {
    return this.errors[fieldName] || []
  }

  /**
   * Check if a field has errors
   */
  hasFieldError(fieldName: string): boolean {
    return this.errors[fieldName] && this.errors[fieldName].length > 0
  }

  /**
   * Get first error for a field
   */
  getFirstFieldError(fieldName: string): string | null {
    const errors = this.getFieldErrors(fieldName)
    return errors.length > 0 ? errors[0] : null
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = {}
  }

  /**
   * Clear errors for a specific field
   */
  clearFieldErrors(fieldName: string): void {
    delete this.errors[fieldName]
  }
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  // Email validation
  email: {
    required: true,
    pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    maxLength: 255
  },

  // Password validation
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Password must contain at least one lowercase letter'
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'Password must contain at least one uppercase letter'
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Password must contain at least one number'
      }
      if (!/(?=.*[@$!%*?&])/.test(value)) {
        return 'Password must contain at least one special character'
      }
      return null
    }
  },

  // Slug validation
  slug: {
    required: true,
    pattern: /^[a-z0-9-]+$/,
    minLength: 1,
    maxLength: 255,
    custom: (value: string) => {
      if (value.startsWith('-') || value.endsWith('-')) {
        return 'Slug cannot start or end with a hyphen'
      }
      if (value.includes('--')) {
        return 'Slug cannot contain consecutive hyphens'
      }
      return null
    }
  },

  // Name validation
  name: {
    required: true,
    minLength: 1,
    maxLength: 255,
    custom: (value: string) => {
      if (value.trim().length === 0) {
        return 'Name cannot be empty or only whitespace'
      }
      return null
    }
  },

  // Price validation (in cents)
  priceCents: {
    required: true,
    min: 0,
    max: 99999999, // 999,999.99 TRY
    custom: (value: number) => {
      if (!Number.isInteger(value)) {
        return 'Price must be a whole number (cents)'
      }
      return null
    }
  },

  // Sort order validation
  sortOrder: {
    required: false,
    min: 0,
    custom: (value: number) => {
      if (value !== null && value !== undefined && !Number.isInteger(value)) {
        return 'Sort order must be a whole number'
      }
      return null
    }
  },

  // URL validation
  url: {
    required: false,
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (value && !value.match(/^https?:\/\/.+/)) {
        return 'URL must start with http:// or https://'
      }
      return null
    }
  },

  // Locale validation
  locale: {
    required: true,
    custom: (value: string) => {
      if (!['en', 'ar', 'tr'].includes(value)) {
        return 'Locale must be one of: en, ar, tr'
      }
      return null
    }
  },

  // Role validation
  role: {
    required: true,
    custom: (value: string) => {
      if (!['customer', 'staff', 'admin'].includes(value)) {
        return 'Role must be one of: customer, staff, admin'
      }
      return null
    }
  }
}

/**
 * Predefined validation schemas for common forms
 */
export const ValidationSchemas = {
  // Category form
  category: {
    slug: ValidationRules.slug,
    translations: {
      required: true,
      custom: (value: any) => {
        if (!Array.isArray(value)) {
          return 'Translations must be an array'
        }
        if (value.length === 0) {
          return 'At least one translation is required'
        }
        
        for (const translation of value) {
          if (!translation.locale || !translation.name) {
            return 'Each translation must have locale and name'
          }
          if (!['en', 'ar', 'tr'].includes(translation.locale)) {
            return 'Invalid locale in translation'
          }
        }
        return null
      }
    }
  },

  // Item form
  item: {
    category_id: {
      required: true,
      custom: (value: string) => {
        if (!value || typeof value !== 'string') {
          return 'Category ID is required'
        }
        return null
      }
    },
    translations: {
      required: true,
      custom: (value: any) => {
        if (!Array.isArray(value)) {
          return 'Translations must be an array'
        }
        if (value.length === 0) {
          return 'At least one translation is required'
        }
        
        for (const translation of value) {
          if (!translation.locale || !translation.name) {
            return 'Each translation must have locale and name'
          }
          if (!['en', 'ar', 'tr'].includes(translation.locale)) {
            return 'Invalid locale in translation'
          }
        }
        return null
      }
    },
    prices: {
      required: true,
      custom: (value: any) => {
        if (!Array.isArray(value)) {
          return 'Prices must be an array'
        }
        if (value.length === 0) {
          return 'At least one price is required'
        }
        
        for (const price of value) {
          if (!price.size_name || typeof price.size_name !== 'string') {
            return 'Each price must have a size name'
          }
          if (typeof price.price_cents !== 'number' || price.price_cents < 0) {
            return 'Each price must have a valid price in cents'
          }
        }
        return null
      }
    }
  },

  // User login form
  login: {
    email: ValidationRules.email,
    password: {
      required: true,
      minLength: 1
    }
  },

  // User registration form
  register: {
    email: ValidationRules.email,
    password: ValidationRules.password,
    role: ValidationRules.role
  },

  // Profile update form
  profile: {
    email: ValidationRules.email,
    role: ValidationRules.role
  }
}

/**
 * Utility functions for common validations
 */
export const ValidationUtils = {
  /**
   * Sanitize string input
   */
  sanitizeString(value: string): string {
    return value.trim().replace(/\s+/g, ' ')
  },

  /**
   * Validate and format slug
   */
  formatSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  },

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    return ValidationRules.email.pattern!.test(email)
  },

  /**
   * Validate password strength
   */
  getPasswordStrength(password: string): {
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score++
    else feedback.push('At least 8 characters')

    if (/[a-z]/.test(password)) score++
    else feedback.push('Lowercase letter')

    if (/[A-Z]/.test(password)) score++
    else feedback.push('Uppercase letter')

    if (/\d/.test(password)) score++
    else feedback.push('Number')

    if (/[@$!%*?&]/.test(password)) score++
    else feedback.push('Special character')

    return { score, feedback }
  },

  /**
   * Validate Turkish Lira price format
   */
  formatPrice(priceCents: number): string {
    return (priceCents / 100).toFixed(2) + ' ₺'
  },

  /**
   * Parse price from Turkish Lira format
   */
  parsePrice(priceString: string): number {
    const cleaned = priceString.replace(/[^\d.,]/g, '')
    const normalized = cleaned.replace(',', '.')
    const price = parseFloat(normalized)
    return Math.round(price * 100) // Convert to cents
  },

  /**
   * Validate file upload
   */
  validateFile(file: File, options: {
    maxSize?: number
    allowedTypes?: string[]
  } = {}): { valid: boolean; error?: string } {
    const maxSize = options.maxSize || 10 * 1024 * 1024 // 10MB default
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp']

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      }
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type must be one of: ${allowedTypes.join(', ')}`
      }
    }

    return { valid: true }
  }
}

/**
 * React hook for form validation
 */
export function useValidation<T extends Record<string, any>>(
  initialData: T,
  schema: ValidationSchema
) {
  const [data, setData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validator = new Validator()

  const validate = useCallback(() => {
    const result = validator.validate(data, schema)
    setErrors(result.errors)
    return result.valid
  }, [data, schema])

  const validateField = useCallback((fieldName: string) => {
    const rule = schema[fieldName]
    if (!rule) return

    const fieldErrors = validator.validateValue(data[fieldName], rule, fieldName)
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors
    }))
  }, [data, schema])

  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setData(prev => ({ ...prev, [fieldName]: value }))
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    
    // Validate field if it's been touched
    if (touched[fieldName]) {
      validateField(fieldName)
    }
  }, [touched, validateField])

  const setFieldTouched = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    validateField(fieldName)
  }, [validateField])

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName]?.[0] || null
  }, [errors])

  const hasFieldError = useCallback((fieldName: string) => {
    return Boolean(errors[fieldName]?.length)
  }, [errors])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const reset = useCallback(() => {
    setData(initialData)
    setErrors({})
    setTouched({})
  }, [initialData])

  return {
    data,
    errors,
    touched,
    validate,
    validateField,
    setFieldValue,
    setFieldTouched,
    getFieldError,
    hasFieldError,
    clearErrors,
    reset
  }
}

// Import React hooks
import { useState, useCallback } from 'react'

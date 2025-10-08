'use client'

/**
 * React hook for form validation
 * This file is client-side only and contains React hooks
 */
import { useState, useCallback } from 'react'
import { ValidationSchema } from './validation'

export function useValidation<T extends Record<string, any>>(
  initialData: T,
  schema: ValidationSchema
) {
  const [data, setData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = useCallback(() => {
    // Import Validator dynamically to avoid server-side issues
    import('./validation').then(({ Validator }) => {
      const validator = new Validator()
      const result = validator.validate(data, schema)
      setErrors(result.errors)
      return result.valid
    })
  }, [data, schema])

  const validateField = useCallback((fieldName: string) => {
    import('./validation').then(({ Validator }) => {
      const validator = new Validator()
      const rule = schema[fieldName]
      if (!rule) return

      const fieldErrors = validator.validateValue(data[fieldName], rule, fieldName)
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldErrors
      }))
    })
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

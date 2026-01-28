'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { FormField } from '@/lib/supabase'

interface Profile {
  full_name: string | null
  email: string
  major: string | null
  graduation_year: number | null
  phone: string | null
  linkedin_url: string | null
  bio: string | null
}

interface DynamicEventFormProps {
  eventId: string
  userId?: string
  profile?: Profile | null
  existingResponses?: Record<string, unknown>
  onSubmit: (data: { profileData: Partial<Profile>; customResponses: Record<string, unknown> }) => Promise<void>
  readOnly?: boolean
  submitLabel?: string
}

// Default fields if no form config exists
const DEFAULT_FIELDS: FormField[] = [
  { id: 'full_name', label: 'Full Name', type: 'text', required: true, order: 0, profileField: 'full_name', placeholder: 'e.g. John Doe' },
  { id: 'email', label: 'Email', type: 'email', required: true, order: 1, profileField: 'email', placeholder: 'name@gmail.com' },
  { id: 'major', label: 'Major', type: 'text', required: true, order: 2, profileField: 'major', placeholder: 'e.g. Computer Science' },
  { id: 'graduation_year', label: 'Graduation Year', type: 'number', required: false, order: 3, profileField: 'graduation_year', placeholder: 'e.g. 2027' },
  { id: 'notes', label: 'Notes', type: 'textarea', required: false, order: 4, placeholder: 'Anything else you would like to let us know?' },
]

export function DynamicEventForm({
  eventId,
  userId,
  profile,
  existingResponses,
  onSubmit,
  readOnly = false,
  submitLabel = 'Submit',
}: DynamicEventFormProps) {
  const [fields, setFields] = useState<FormField[]>(DEFAULT_FIELDS)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load form configuration
  const loadFormConfig = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}/form-config`)
      if (response.ok) {
        const data = await response.json()
        if (data.formConfig?.fields && data.formConfig.fields.length > 0) {
          setFields(data.formConfig.fields.sort((a: FormField, b: FormField) => a.order - b.order))
        }
      }
    } catch {
      // Use default fields if fetch fails
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    loadFormConfig()
  }, [loadFormConfig])

  // Initialize form data from profile and existing responses
  useEffect(() => {
    const initialData: Record<string, unknown> = {}

    fields.forEach(field => {
      if (field.profileField && profile) {
        const profileValue = profile[field.profileField as keyof Profile]
        if (profileValue !== null && profileValue !== undefined) {
          initialData[field.id] = profileValue
        }
      } else if (existingResponses && existingResponses[field.id] !== undefined) {
        initialData[field.id] = existingResponses[field.id]
      } else if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue
      } else {
        initialData[field.id] = field.type === 'checkbox' ? false : ''
      }
    })

    setFormData(initialData)
  }, [fields, profile, existingResponses])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    fields.forEach(field => {
      const value = formData[field.id]

      if (field.required) {
        if (value === undefined || value === null || value === '') {
          newErrors[field.id] = `${field.label} is required`
        } else if (field.type === 'email' && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value.trim())) {
            newErrors[field.id] = 'Please enter a valid email address'
          }
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      // Separate profile data and custom responses
      const profileData: Partial<Profile> = {}
      const customResponses: Record<string, unknown> = {}

      fields.forEach(field => {
        const value = formData[field.id]
        if (field.profileField) {
          (profileData as Record<string, unknown>)[field.profileField] = value
        } else {
          customResponses[field.id] = value
        }
      })

      await onSubmit({ profileData, customResponses })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id]
    const error = errors[field.id]
    const isDisabled = !!(readOnly || (field.profileField && !!profile && !!value))

    const baseInputClass = `w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent ${
      error ? 'border-red-400' : 'border-white/20'
    } ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={String(value || '')}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isDisabled}
            placeholder={field.placeholder}
            rows={3}
            className={baseInputClass}
          />
        )

      case 'select':
        return (
          <select
            value={String(value || '')}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isDisabled}
            className={baseInputClass}
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              disabled={isDisabled}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
            />
            <span className="text-white">{field.label}</span>
          </label>
        )

      case 'date':
        return (
          <input
            type="date"
            value={String(value || '')}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isDisabled}
            className={baseInputClass}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            inputMode="numeric"
            value={value !== undefined && value !== null ? String(value) : ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value ? Number(e.target.value) : '')}
            disabled={isDisabled}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        )

      case 'email':
        return (
          <input
            type="email"
            value={String(value || '')}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isDisabled}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        )

      default: // text
        return (
          <input
            type="text"
            value={String(value || '')}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isDisabled}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-white/70">
        Loading form...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.id}>
          {field.type !== 'checkbox' && (
            <label className="block text-white/80 text-sm font-medium mb-2">
              {field.label} {field.required && '*'}
            </label>
          )}
          {renderField(field)}
          {errors[field.id] && (
            <p className="mt-1 text-red-400 text-sm">{errors[field.id]}</p>
          )}
        </div>
      ))}

      {!readOnly && (
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : submitLabel}
        </button>
      )}
    </form>
  )
}

// Hook to use form config outside of the component
export function useFormConfig(eventId: string) {
  const [fields, setFields] = useState<FormField[]>(DEFAULT_FIELDS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(`/api/admin/events/${eventId}/form-config`)
        if (response.ok) {
          const data = await response.json()
          if (data.formConfig?.fields && data.formConfig.fields.length > 0) {
            setFields(data.formConfig.fields.sort((a: FormField, b: FormField) => a.order - b.order))
          }
        }
      } catch {
        // Use default fields
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [eventId])

  return { fields, loading }
}

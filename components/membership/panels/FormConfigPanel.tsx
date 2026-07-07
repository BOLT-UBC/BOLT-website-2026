'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { FormField, FormFieldType } from '@/lib/supabase'

interface Event {
  id: string
  name: string
}

interface FormConfigPanelProps {
  eventId?: string
}

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
]

const PROFILE_FIELDS = [
  { value: '', label: 'None (Custom Field)' },
  { value: 'full_name', label: 'Full Name' },
  { value: 'email', label: 'Email' },
  { value: 'major', label: 'Major' },
  { value: 'graduation_year', label: 'Graduation Year' },
  { value: 'phone', label: 'Phone' },
  { value: 'linkedin_url', label: 'LinkedIn URL' },
  { value: 'bio', label: 'Bio' },
]

const generateFieldId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export function FormConfigPanel({ eventId }: FormConfigPanelProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>(eventId || '')
  const [fields, setFields] = useState<FormField[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Load events list
  useEffect(() => {
    const loadEvents = async () => {
      const { data } = await supabase.from('events').select('id, name').order('name')
      if (data) {
        setEvents(data)
        if (!selectedEventId && data.length > 0) {
          setSelectedEventId(data[0].id)
        }
      }
    }
    loadEvents()
  }, [selectedEventId])

  // Load form config when event changes
  const loadFormConfig = useCallback(async () => {
    if (!selectedEventId) return

    setLoading(true)
    setMessage(null)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      const response = await fetch(`/api/admin/events/${selectedEventId}/form-config`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      })

      if (response.ok) {
        const data = await response.json()
        setFields(data.formConfig?.fields || [])
      } else {
        setFields([])
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to load form configuration' })
    } finally {
      setLoading(false)
    }
  }, [selectedEventId])

  useEffect(() => {
    loadFormConfig()
  }, [loadFormConfig])

  const saveFormConfig = async () => {
    if (!selectedEventId) return

    setSaving(true)
    setMessage(null)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        setMessage({ type: 'error', text: 'You must be logged in' })
        return
      }

      const response = await fetch(`/api/admin/events/${selectedEventId}/form-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ fields }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Form configuration saved successfully' })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to save configuration' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save form configuration' })
    } finally {
      setSaving(false)
    }
  }

  const addField = () => {
    const newField: FormField = {
      id: generateFieldId(),
      label: 'New Field',
      type: 'text',
      required: false,
      order: fields.length,
      placeholder: '',
    }
    setFields([...fields, newField])
    setEditingField(newField.id)
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f))
  }

  const removeField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId).map((f, i) => ({ ...f, order: i })))
    if (editingField === fieldId) {
      setEditingField(null)
    }
  }

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields]
    const [removed] = newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, removed)
    setFields(newFields.map((f, i) => ({ ...f, order: i })))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    moveField(draggedIndex, index)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const getFieldTypeIcon = (type: FormFieldType) => {
    switch (type) {
      case 'text':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
      case 'email':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      case 'number':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
      case 'textarea':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
      case 'select':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
      case 'checkbox':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      case 'date':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Form Configuration</h2>
          </div>
        </div>

        {/* Event Selector */}
        <div className="mb-6">
          <label className="block text-white/80 mb-2 text-sm">Select Event</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="">Select an event...</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-white/70">Loading form configuration...</div>
        ) : selectedEventId ? (
          <>
            {/* Fields List */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Form Fields</h3>
                <button
                  onClick={addField}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Field
                </button>
              </div>

              {fields.length === 0 ? (
                <div className="bg-white/5 rounded-lg p-8 text-center">
                  <p className="text-white/60">No fields configured. Click &quot;Add Field&quot; to start building your form.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white/5 rounded-lg border border-white/10 ${
                        draggedIndex === index ? 'opacity-50' : ''
                      } ${editingField === field.id ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <div className="cursor-grab text-white/50 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        </div>
                        <div className="text-white/70">{getFieldTypeIcon(field.type)}</div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{field.label}</div>
                          <div className="text-white/50 text-xs">
                            {FIELD_TYPES.find(t => t.value === field.type)?.label}
                            {field.required && ' • Required'}
                            {field.profileField && ` • Maps to: ${field.profileField}`}
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeField(field.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Field Editor */}
                      {editingField === field.id && (
                        <div className="border-t border-white/10 p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-white/70 mb-1 text-sm">Label</label>
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                              />
                            </div>
                            <div>
                              <label className="block text-white/70 mb-1 text-sm">Type</label>
                              <select
                                value={field.type}
                                onChange={(e) => updateField(field.id, { type: e.target.value as FormFieldType })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                              >
                                {FIELD_TYPES.map(type => (
                                  <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-white/70 mb-1 text-sm">Placeholder</label>
                              <input
                                type="text"
                                value={field.placeholder || ''}
                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                              />
                            </div>
                            <div>
                              <label className="block text-white/70 mb-1 text-sm">Map to Profile Field</label>
                              <select
                                value={field.profileField || ''}
                                onChange={(e) => updateField(field.id, { profileField: e.target.value || undefined })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                              >
                                {PROFILE_FIELDS.map(pf => (
                                  <option key={pf.value} value={pf.value}>{pf.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {field.type === 'select' && (
                            <div>
                              <label className="block text-white/70 mb-1 text-sm">Options (one per line)</label>
                              <textarea
                                value={(field.options || []).join('\n')}
                                onChange={(e) => updateField(field.id, { options: e.target.value.split('\n').filter(o => o.trim()) })}
                                rows={3}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                                placeholder="Option 1&#10;Option 2&#10;Option 3"
                              />
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-white/70 text-sm">Required</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={saveFormConfig}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-white/60">
            Select an event to configure its application form.
          </div>
        )}
      </div>
    </div>
  )
}

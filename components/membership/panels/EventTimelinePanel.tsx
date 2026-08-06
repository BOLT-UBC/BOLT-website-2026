'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface Event {
  event_id: string
  event_name: string
}

interface TimelineMilestone {
  id: string
  event_id: string
  milestone: string
  date: string | null
  is_complete: boolean
  display_order: number
}

interface EventTimelinePanelProps {
  eventId?: string
}

export function EventTimelinePanel({ eventId }: EventTimelinePanelProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>(eventId || '')
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Load events list
  useEffect(() => {
    const loadEvents = async () => {
      const { data } = await supabase.from('events').select('event_id, event_name').order('event_name')
      if (data) {
        setEvents(data)
        if (!selectedEventId && data.length > 0) {
          setSelectedEventId(data[0].event_id)
        }
      }
    }
    loadEvents()
  }, [selectedEventId])

  // Load timeline when event changes
  const loadTimeline = useCallback(async () => {
    if (!selectedEventId) return

    setLoading(true)
    setMessage(null)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      const response = await fetch(`/api/admin/events/${selectedEventId}/timeline`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      })

      if (response.ok) {
        const data = await response.json()
        setMilestones(data.milestones || [])
      } else {
        setMilestones([])
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to load timeline' })
    } finally {
      setLoading(false)
    }
  }, [selectedEventId])

  useEffect(() => {
    loadTimeline()
  }, [loadTimeline])

  const saveTimeline = async () => {
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

      const response = await fetch(`/api/admin/events/${selectedEventId}/timeline`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ milestones }),
      })

      if (response.ok) {
        const data = await response.json()
        setMilestones(data.milestones || [])
        setMessage({ type: 'success', text: 'Timeline saved successfully' })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to save timeline' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save timeline' })
    } finally {
      setSaving(false)
    }
  }

  const addMilestone = () => {
    const newMilestone: TimelineMilestone = {
      id: `new_${Date.now()}`,
      event_id: selectedEventId,
      milestone: 'New Milestone',
      date: null,
      is_complete: false,
      display_order: milestones.length,
    }
    setMilestones([...milestones, newMilestone])
    setEditingMilestone(newMilestone.id)
  }

  const updateMilestone = (id: string, updates: Partial<TimelineMilestone>) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id).map((m, i) => ({ ...m, display_order: i })))
    if (editingMilestone === id) {
      setEditingMilestone(null)
    }
  }

  const moveMilestone = (fromIndex: number, toIndex: number) => {
    const newMilestones = [...milestones]
    const [removed] = newMilestones.splice(fromIndex, 1)
    newMilestones.splice(toIndex, 0, removed)
    setMilestones(newMilestones.map((m, i) => ({ ...m, display_order: i })))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    moveMilestone(draggedIndex, index)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  const createDefaultMilestones = () => {
    const defaultMilestones: TimelineMilestone[] = [
      { id: `new_1`, event_id: selectedEventId, milestone: 'Applications Open', date: null, is_complete: false, display_order: 0 },
      { id: `new_2`, event_id: selectedEventId, milestone: 'Application Deadline', date: null, is_complete: false, display_order: 1 },
      { id: `new_3`, event_id: selectedEventId, milestone: 'Decision Release', date: null, is_complete: false, display_order: 2 },
      { id: `new_4`, event_id: selectedEventId, milestone: 'Confirmation Due', date: null, is_complete: false, display_order: 3 },
      { id: `new_5`, event_id: selectedEventId, milestone: 'Event Day', date: null, is_complete: false, display_order: 4 },
    ]
    setMilestones(defaultMilestones)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Event Timeline</h2>
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
              <option key={event.event_id} value={event.event_id}>{event.event_name}</option>
            ))}
          </select>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-white/70">Loading timeline...</div>
        ) : selectedEventId ? (
          <>
            {/* Timeline Milestones */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Timeline Milestones</h3>
                <div className="flex gap-2">
                  {milestones.length === 0 && (
                    <button
                      onClick={createDefaultMilestones}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Add Default Milestones
                    </button>
                  )}
                  <button
                    onClick={addMilestone}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Milestone
                  </button>
                </div>
              </div>

              {milestones.length === 0 ? (
                <div className="bg-white/5 rounded-lg p-8 text-center">
                  <svg className="w-12 h-12 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-white/60">No milestones configured. Click &quot;Add Default Milestones&quot; to start or add custom milestones.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`bg-white/5 rounded-lg border border-white/10 ${
                        draggedIndex === index ? 'opacity-50' : ''
                      } ${editingMilestone === milestone.id ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <div className="cursor-grab text-white/50 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        </div>
                        <button
                          onClick={() => updateMilestone(milestone.id, { is_complete: !milestone.is_complete })}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            milestone.is_complete 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-white/30 hover:border-white/50'
                          }`}
                        >
                          {milestone.is_complete && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1">
                          <div className={`text-white font-medium ${milestone.is_complete ? 'line-through opacity-60' : ''}`}>
                            {milestone.milestone}
                          </div>
                          <div className="text-white/50 text-xs">
                            {milestone.date 
                              ? new Date(milestone.date).toLocaleString() 
                              : 'Date TBA'}
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingMilestone(editingMilestone === milestone.id ? null : milestone.id)}
                          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeMilestone(milestone.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Milestone Editor */}
                      {editingMilestone === milestone.id && (
                        <div className="border-t border-white/10 p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-white/70 mb-1 text-sm">Milestone Name</label>
                              <input
                                type="text"
                                value={milestone.milestone}
                                onChange={(e) => updateMilestone(milestone.id, { milestone: e.target.value })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                              />
                            </div>
                            <div>
                              <label className="block text-white/70 mb-1 text-sm">Date & Time</label>
                              <input
                                type="datetime-local"
                                value={formatDateForInput(milestone.date)}
                                onChange={(e) => updateMilestone(milestone.id, { 
                                  date: e.target.value ? new Date(e.target.value).toISOString() : null 
                                })}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={milestone.is_complete}
                                onChange={(e) => updateMilestone(milestone.id, { is_complete: e.target.checked })}
                                className="rounded border-white/20 bg-white/10 text-green-500 focus:ring-green-500"
                              />
                              <span className="text-white/70 text-sm">Mark as Complete</span>
                            </label>
                            <button
                              onClick={() => updateMilestone(milestone.id, { date: null })}
                              className="text-xs text-white/50 hover:text-white"
                            >
                              Clear Date (TBA)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline Preview */}
            {milestones.length > 0 && (
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white/80 text-sm font-medium mb-3">Preview</h4>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {milestones.map((milestone, index) => (
                    <React.Fragment key={milestone.id}>
                      <div className="flex flex-col items-center min-w-[100px]">
                        <div className={`w-4 h-4 rounded-full ${
                          milestone.is_complete ? 'bg-green-500' : 'bg-white/30'
                        }`} />
                        <div className={`text-xs text-center mt-1 ${
                          milestone.is_complete ? 'text-green-300' : 'text-white/60'
                        }`}>
                          {milestone.milestone}
                        </div>
                        <div className="text-xs text-white/40 mt-0.5">
                          {milestone.date ? new Date(milestone.date).toLocaleDateString() : 'TBA'}
                        </div>
                      </div>
                      {index < milestones.length - 1 && (
                        <div className={`h-0.5 w-8 ${
                          milestone.is_complete ? 'bg-green-500' : 'bg-white/20'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={saveTimeline}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Timeline'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-white/60">
            Select an event to manage its timeline.
          </div>
        )}
      </div>
    </div>
  )
}

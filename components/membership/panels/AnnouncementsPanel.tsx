'use client'

import React, { useState, useEffect, useCallback } from 'react'
import type { Announcement } from '../types'
import { supabase } from '@/lib/supabase'

interface AnnouncementsPanelProps {
  userRole: 'non_member' | 'bolt_member' | 'executive_member' | 'admin' | undefined
}

export function AnnouncementsPanel({ userRole }: AnnouncementsPanelProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_pinned: false
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAdminOrExecutive = userRole === 'admin' || userRole === 'executive_member'

  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true)
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      const response = await fetch('/api/announcements', {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })

      if (response.ok) {
        const result = await response.json()
        setAnnouncements(result.announcements || [])
      } else {
        setError('Failed to load announcements')
      }
    } catch (err) {
      console.error('Error loading announcements:', err)
      setError('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAdminOrExecutive) {
      loadAnnouncements()
    }
  }, [isAdminOrExecutive, loadAnnouncements])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      const url = editingAnnouncement
        ? `/api/announcements/${editingAnnouncement.id}`
        : '/api/announcements'

      const method = editingAnnouncement ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingAnnouncement(null)
        setFormData({ title: '', content: '', is_pinned: false })
        await loadAnnouncements()
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to save announcement')
      }
    } catch (err) {
      console.error('Error saving announcement:', err)
      setError('Failed to save announcement')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })

      if (response.ok) {
        await loadAnnouncements()
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to delete announcement')
      }
    } catch (err) {
      console.error('Error deleting announcement:', err)
      setError('Failed to delete announcement')
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      is_pinned: announcement.is_pinned
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAnnouncement(null)
    setFormData({ title: '', content: '', is_pinned: false })
    setError(null)
  }

  if (!isAdminOrExecutive) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <p className="text-white/70">You don't have permission to manage announcements.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Manage Announcements</h2>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + New Announcement
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            <div>
              <label className="block text-white/80 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter announcement title..."
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter announcement content..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_pinned"
                checked={formData.is_pinned}
                onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_pinned" className="text-white/80">
                Pin this announcement (show at top)
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingAnnouncement ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Announcements List */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">All Announcements</h3>
        {loading ? (
          <div className="text-center py-8 text-white/70">Loading announcements...</div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`bg-white/5 rounded-lg p-4 ${announcement.is_pinned ? 'border-2 border-yellow-400/50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {announcement.is_pinned && (
                        <>
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          <span className="text-yellow-400 text-sm font-medium">Pinned</span>
                        </>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{announcement.title}</h4>
                    <p className="text-white/70 mb-2 whitespace-pre-wrap">{announcement.content}</p>
                    <p className="text-white/50 text-sm">
                      {new Date(announcement.created_at).toLocaleDateString()}
                      {announcement.profiles && ` • By ${announcement.profiles.full_name || announcement.profiles.email}`}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="px-3 py-1 bg-blue-600/50 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="px-3 py-1 bg-red-600/50 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/70">
            No announcements yet. Create your first announcement!
          </div>
        )}
      </div>
    </div>
  )
}


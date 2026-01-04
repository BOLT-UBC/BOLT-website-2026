'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Resource {
  id: string
  title: string
  description: string | null
  link: string
  display_order: number
}

interface ResourcesPanelProps {
  userRole?: 'non_member' | 'bolt_member' | 'executive_member' | 'admin'
}

export function ResourcesPanel({ userRole }: ResourcesPanelProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    display_order: 0
  })

  const canManageResources = userRole === 'admin' || userRole === 'executive_member'

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    try {
      const response = await fetch('/api/resources')
      if (response.ok) {
        const data = await response.json()
        setResources(data.resources || [])
      }
    } catch (error) {
      // Silently handle error
      void error
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        alert('You must be logged in to manage resources')
        return
      }

      const url = '/api/resources'
      const method = editingId ? 'PATCH' : 'POST'
      const body = editingId
        ? { id: editingId, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        await loadResources()
        setShowAddForm(false)
        setEditingId(null)
        setFormData({
          title: '',
          description: '',
          link: '',
          display_order: 0
        })
      } else {
        const errorData = await response.json()
        alert(`Failed to save resource: ${errorData.error}`)
      }
    } catch {
      alert('An error occurred while saving the resource')
    }
  }

  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id)
    setFormData({
      title: resource.title,
      description: resource.description || '',
      link: resource.link,
      display_order: resource.display_order
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        alert('You must be logged in to delete resources')
        return
      }

      const response = await fetch(`/api/resources?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        await loadResources()
      } else {
        const errorData = await response.json()
        alert(`Failed to delete resource: ${errorData.error}`)
      }
    } catch {
      alert('An error occurred while deleting the resource')
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      link: '',
      display_order: 0
    })
  }

  const isExternalLink = (link: string) => {
    return link.startsWith('http://') || link.startsWith('https://')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Resources</h2>
          </div>
          {canManageResources && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add Resource
            </button>
          )}
        </div>

        {canManageResources && showAddForm && (
          <form onSubmit={handleSubmit} className="bg-white/5 rounded-lg p-4 mb-6 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2 text-sm">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  placeholder="Resource title"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2 text-sm">Link *</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  placeholder="https://example.com or /path"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2 text-sm">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm resize-none"
                  placeholder="Resource description"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2 text-sm">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {editingId ? 'Update' : 'Create'} Resource
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-8 text-white/70">Loading resources...</div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => {
              const linkComponent = isExternalLink(resource.link) ? (
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 text-sm font-medium flex items-center gap-1"
                >
                  Access Resource
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={resource.link}
                  className="text-blue-300 hover:text-blue-200 text-sm font-medium flex items-center gap-1"
                >
                  Access Resource
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )

              return (
                <div key={resource.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                      {resource.description && (
                        <p className="text-white/70 mb-3 text-sm">{resource.description}</p>
                      )}
                      {linkComponent}
                    </div>
                    {canManageResources && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(resource)}
                          className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="px-3 py-1 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-white/60 text-sm">
            No resources available at the moment.
          </div>
        )}
      </div>
    </div>
  )
}


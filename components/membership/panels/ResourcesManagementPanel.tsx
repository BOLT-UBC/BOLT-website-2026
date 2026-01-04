'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Resource {
  id: string
  title: string
  description: string | null
  link: string
  display_order: number
}

export function ResourcesManagementPanel() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    display_order: 0
  })

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      const response = await fetch('/api/resources', {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })

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

      const url = editingId ? '/api/resources' : '/api/resources'
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
        const error = await response.json()
        alert(`Failed to save resource: ${error.error}`)
      }
    } catch (error) {
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
        const error = await response.json()
        alert(`Failed to delete resource: ${error.error}`)
      }
    } catch (error) {
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

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="text-center py-8 text-white/70">Loading resources...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Resources</h2>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add Resource
            </button>
          )}
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="bg-white/5 rounded-lg p-4 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-white/80 mb-2 text-sm">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/80 mb-2 text-sm">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm resize-none"
                  placeholder="Resource description"
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

        {resources.length > 0 ? (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm">{resource.title}</h3>
                      <span className="text-white/50 text-xs">(Order: {resource.display_order})</span>
                    </div>
                    {resource.description && (
                      <p className="text-white/70 text-xs mb-2">{resource.description}</p>
                    )}
                    <a
                      href={resource.link}
                      target={resource.link.startsWith('http') ? '_blank' : undefined}
                      rel={resource.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-blue-300 hover:text-blue-200 text-xs underline"
                    >
                      {resource.link}
                    </a>
                  </div>
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/60 text-sm">
            No resources found. Click "Add Resource" to create one.
          </div>
        )}
      </div>
    </div>
  )
}


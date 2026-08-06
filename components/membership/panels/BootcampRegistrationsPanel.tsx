'use client'

import React, { useState } from 'react'

interface Registration {
  registration_id: string
  status: 'pending' | 'confirmed' | 'cancelled'
  registered_at: string
  notes: string | null
  application_responses?: Record<string, unknown>
  members: {
    member_id: string
    email: string
    full_name: string | null
    graduation_date: string | null
    major: string | null
    phone_num: string | null
    linkedin: string | null
  } | null
}

interface BootcampRegistrationsPanelProps {
  registrations: Registration[]
  loading: boolean
  search: string
  statusFilter: string
  setSearch: (value: string) => void
  setStatusFilter: (value: string) => void
  onUpdateStatus: (registrationId: string, status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>
  onUpdateNotes: (registrationId: string, notes: string) => Promise<void>
  onBulkUpdateStatus: (registrationIds: string[], status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>
  onUpdateApplicationResponses?: (registrationId: string, responses: Record<string, unknown>) => Promise<void>
}

export function BootcampRegistrationsPanel({
  registrations,
  loading,
  search,
  statusFilter,
  setSearch,
  setStatusFilter,
  onUpdateStatus,
  onUpdateNotes,
  onBulkUpdateStatus,
  onUpdateApplicationResponses,
}: BootcampRegistrationsPanelProps) {
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([])
  const [bulkStatus, setBulkStatus] = useState<string>('')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<{ id: string; value: string } | null>(null)
  const [editingResponses, setEditingResponses] = useState<{ id: string; value: Record<string, unknown> } | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-200 border-green-400/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-200 border-red-400/30'
      case 'pending':
      default:
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
    }
  }

  const statusCounts = {
    pending: registrations.filter((r) => r.status === 'pending').length,
    confirmed: registrations.filter((r) => r.status === 'confirmed').length,
    cancelled: registrations.filter((r) => r.status === 'cancelled').length,
  }

  const handleSaveNotes = async (registrationId: string) => {
    if (editingNotes && editingNotes.id === registrationId) {
      await onUpdateNotes(registrationId, editingNotes.value)
      setEditingNotes(null)
    }
  }

  const handleSaveResponses = async (registrationId: string) => {
    if (editingResponses && editingResponses.id === registrationId && onUpdateApplicationResponses) {
      await onUpdateApplicationResponses(registrationId, editingResponses.value)
      setEditingResponses(null)
    }
  }

  const toggleRowExpand = (registrationId: string) => {
    if (expandedRow === registrationId) {
      setExpandedRow(null)
      setEditingNotes(null)
      setEditingResponses(null)
    } else {
      const registration = registrations.find(r => r.registration_id === registrationId)
      setExpandedRow(registrationId)
      setEditingNotes({ id: registrationId, value: registration?.notes || '' })
      setEditingResponses({ id: registrationId, value: registration?.application_responses || {} })
    }
  }

  const updateResponseField = (key: string, value: unknown) => {
    if (editingResponses) {
      setEditingResponses({
        ...editingResponses,
        value: { ...editingResponses.value, [key]: value }
      })
    }
  }

  const addResponseField = (key: string) => {
    if (editingResponses && key.trim()) {
      setEditingResponses({
        ...editingResponses,
        value: { ...editingResponses.value, [key]: '' }
      })
    }
  }

  const removeResponseField = (key: string) => {
    if (editingResponses) {
      const newValue = { ...editingResponses.value }
      delete newValue[key]
      setEditingResponses({
        ...editingResponses,
        value: newValue
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">BOLT Bootcamp Registrations</h2>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-white/70 text-sm mb-1">Total Registrations</div>
            <div className="text-white text-3xl font-bold">{registrations.length}</div>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-400/20">
            <div className="text-yellow-200/70 text-sm mb-1">Pending</div>
            <div className="text-yellow-200 text-3xl font-bold">{statusCounts.pending}</div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-400/20">
            <div className="text-green-200/70 text-sm mb-1">Confirmed</div>
            <div className="text-green-200 text-3xl font-bold">{statusCounts.confirmed}</div>
          </div>
          <div className="bg-red-500/10 rounded-lg p-4 border border-red-400/20">
            <div className="text-red-200/70 text-sm mb-1">Cancelled</div>
            <div className="text-red-200 text-3xl font-bold">{statusCounts.cancelled}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-white/80 mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRegistrations.length > 0 && (
          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-yellow-100 mb-3">
              Bulk Actions ({selectedRegistrations.length} selected)
            </h3>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-yellow-100 mb-1">Update Status</label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-yellow-300/30 rounded text-white"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={async () => {
                  if (bulkStatus && selectedRegistrations.length > 0) {
                    await onBulkUpdateStatus(selectedRegistrations, bulkStatus as 'pending' | 'confirmed' | 'cancelled')
                    setSelectedRegistrations([])
                    setBulkStatus('')
                  }
                }}
                disabled={!bulkStatus}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                Update {selectedRegistrations.length} Registrations
              </button>
            </div>
          </div>
        )}

        {/* Registrations Table */}
        {loading ? (
          <div className="text-center py-8 text-white/70">Loading registrations...</div>
        ) : registrations.length === 0 ? (
          <div className="bg-white/5 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-white/60 text-lg">No registrations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedRegistrations.length === registrations.length && registrations.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRegistrations(registrations.map(reg => reg.registration_id))
                        } else {
                          setSelectedRegistrations([])
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Major</th>
                  <th className="text-left py-3 px-2">Year</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Registered</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => {
                  const profile = registration.members
                  if (!profile) return null

                  const isExpanded = expandedRow === registration.registration_id
                  const hasCustomResponses = registration.application_responses && Object.keys(registration.application_responses).length > 0

                  return (
                    <React.Fragment key={registration.registration_id}>
                      <tr className={`border-b border-white/10 hover:bg-white/5 ${isExpanded ? 'bg-white/5' : ''}`}>
                        <td className="py-3 px-2">
                          <input
                            type="checkbox"
                            checked={selectedRegistrations.includes(registration.registration_id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRegistrations([...selectedRegistrations, registration.registration_id])
                              } else {
                                setSelectedRegistrations(selectedRegistrations.filter(id => id !== registration.registration_id))
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="py-3 px-2 font-medium">{profile.full_name || 'N/A'}</td>
                        <td className="py-3 px-2 text-sm">{profile.email}</td>
                        <td className="py-3 px-2 text-sm">{profile.major || 'N/A'}</td>
                        <td className="py-3 px-2 text-sm">{profile.graduation_date ? new Date(profile.graduation_date).getFullYear() : 'N/A'}</td>
                        <td className="py-3 px-2">
                          <select
                            value={registration.status}
                            onChange={(e) =>
                              onUpdateStatus(registration.registration_id, e.target.value as 'pending' | 'confirmed' | 'cancelled')
                            }
                            className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(registration.status)} bg-transparent focus:outline-none focus:ring-2 focus:ring-white/50`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-2 text-sm text-white/70">
                          {new Date(registration.registered_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleRowExpand(registration.registration_id)}
                              className={`p-1.5 rounded hover:bg-white/10 transition-colors ${isExpanded ? 'bg-white/10 text-blue-300' : 'text-white/50'}`}
                              title="Edit details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {profile.linkedin && (
                              <a
                                href={profile.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded hover:bg-white/10 text-blue-300 hover:text-blue-200"
                                title="LinkedIn"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                              </a>
                            )}
                            {hasCustomResponses && (
                              <span className="text-xs text-purple-300" title="Has custom responses">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Row for Editing */}
                      {isExpanded && (
                        <tr className="bg-white/5">
                          <td colSpan={8} className="p-4">
                            <div className="space-y-6">
                              {/* Profile Info */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-white/60 text-xs mb-1">Phone</label>
                                  <div className="text-white text-sm">{profile.phone_num || 'Not provided'}</div>
                                </div>
                                <div>
                                  <label className="block text-white/60 text-xs mb-1">LinkedIn</label>
                                  <div className="text-white text-sm truncate">
                                    {profile.linkedin ? (
                                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                                        {profile.linkedin}
                                      </a>
                                    ) : 'Not provided'}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-white/60 text-xs mb-1">Registration Date</label>
                                  <div className="text-white text-sm">{new Date(registration.registered_at).toLocaleString()}</div>
                                </div>
                              </div>

                              {/* Admin Notes */}
                              <div>
                                <label className="block text-white/80 text-sm mb-2">Admin Notes</label>
                                <textarea
                                  value={editingNotes?.id === registration.registration_id ? editingNotes.value : registration.notes || ''}
                                  onChange={(e) => setEditingNotes({ id: registration.registration_id, value: e.target.value })}
                                  placeholder="Add notes about this registration..."
                                  rows={2}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                                />
                                <button
                                  onClick={() => handleSaveNotes(registration.registration_id)}
                                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                >
                                  Save Notes
                                </button>
                              </div>

                              {/* Application Responses */}
                              {onUpdateApplicationResponses && (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="text-white/80 text-sm">Custom Application Responses</label>
                                    <button
                                      onClick={() => {
                                        const key = prompt('Enter field name:')
                                        if (key) addResponseField(key)
                                      }}
                                      className="text-xs text-blue-300 hover:text-blue-200"
                                    >
                                      + Add Field
                                    </button>
                                  </div>
                                  
                                  {editingResponses?.id === registration.registration_id && Object.keys(editingResponses.value).length > 0 ? (
                                    <div className="space-y-2">
                                      {Object.entries(editingResponses.value).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-2">
                                          <span className="text-white/60 text-sm min-w-[120px]">{key}:</span>
                                          <input
                                            type="text"
                                            value={String(value || '')}
                                            onChange={(e) => updateResponseField(key, e.target.value)}
                                            className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/50"
                                          />
                                          <button
                                            onClick={() => removeResponseField(key)}
                                            className="p-1 text-red-400 hover:text-red-300"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        onClick={() => handleSaveResponses(registration.registration_id)}
                                        className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                      >
                                        Save Responses
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="text-white/40 text-sm">No custom responses. Click &quot;Add Field&quot; to add custom data.</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
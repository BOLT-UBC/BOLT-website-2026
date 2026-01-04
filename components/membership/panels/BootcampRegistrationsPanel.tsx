'use client'

import React, { useState } from 'react'

interface Registration {
  id: string
  status: 'pending' | 'confirmed' | 'cancelled'
  registered_at: string
  notes: string | null
  profiles: {
    id: string
    email: string
    full_name: string | null
    graduation_year: number | null
    major: string | null
    phone: string | null
    linkedin_url: string | null
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
}: BootcampRegistrationsPanelProps) {
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([])
  const [bulkStatus, setBulkStatus] = useState<string>('')

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

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">BOLT Bootcamp Registrations</h2>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                          setSelectedRegistrations(registrations.map(reg => reg.id))
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
                  <th className="text-left py-3 px-2">Graduation Year</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Registered</th>
                  <th className="text-left py-3 px-2">Notes</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => {
                  const profile = registration.profiles
                  if (!profile) return null

                  return (
                    <tr key={registration.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-2">
                        <input
                          type="checkbox"
                          checked={selectedRegistrations.includes(registration.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRegistrations([...selectedRegistrations, registration.id])
                            } else {
                              setSelectedRegistrations(selectedRegistrations.filter(id => id !== registration.id))
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 px-2 font-medium">{profile.full_name || 'N/A'}</td>
                      <td className="py-3 px-2">{profile.email}</td>
                      <td className="py-3 px-2">{profile.major || 'N/A'}</td>
                      <td className="py-3 px-2">{profile.graduation_year || 'N/A'}</td>
                      <td className="py-3 px-2">
                        <select
                          value={registration.status}
                          onChange={(e) =>
                            onUpdateStatus(registration.id, e.target.value as 'pending' | 'confirmed' | 'cancelled')
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
                      <td className="py-3 px-2 text-sm text-white/70 max-w-xs">
                        <div className="truncate" title={registration.notes || ''}>
                          {registration.notes || 'None'}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        {profile.linkedin_url && (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200 text-sm"
                          >
                            LinkedIn →
                          </a>
                        )}
                      </td>
                    </tr>
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


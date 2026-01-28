import React, { useState } from 'react'
import { roleUtils } from '../RoleBadge'
import type { UserProfile } from '../types'
import { BootcampRegistrationsPanel } from './BootcampRegistrationsPanel'
import { ResourcesManagementPanel } from './ResourcesManagementPanel'
import { FormConfigPanel } from './FormConfigPanel'
import { EventTimelinePanel } from './EventTimelinePanel'

interface AdminPanelProps {
  adminUsers: UserProfile[]
  adminLoading: boolean
  adminSearch: string
  adminRoleFilter: string
  adminYearFilter: string
  selectedUsers: string[]
  bulkAction: string
  bulkValue: string
  setAdminSearch: (value: string) => void
  setAdminRoleFilter: (value: string) => void
  setAdminYearFilter: (value: string) => void
  setSelectedUsers: (value: string[]) => void
  setBulkAction: (value: string) => void
  setBulkValue: (value: string) => void
  loadAdminData: () => void
  handleBulkUpdate: () => void
  // Bootcamp registrations props
  bootcampRegistrations: any[]
  bootcampLoading: boolean
  bootcampSearch: string
  bootcampStatusFilter: string
  setBootcampSearch: (value: string) => void
  setBootcampStatusFilter: (value: string) => void
  updateRegistrationStatus: (registrationId: string, status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>
  updateRegistrationNotes: (registrationId: string, notes: string) => Promise<void>
  bulkUpdateRegistrationStatus: (registrationIds: string[], status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>
  updateApplicationResponses?: (registrationId: string, responses: Record<string, unknown>) => Promise<void>
}

export function AdminPanel({
  adminUsers,
  adminLoading,
  adminSearch,
  adminRoleFilter,
  adminYearFilter,
  selectedUsers,
  bulkAction,
  bulkValue,
  setAdminSearch,
  setAdminRoleFilter,
  setAdminYearFilter,
  setSelectedUsers,
  setBulkAction,
  setBulkValue,
  loadAdminData,
  handleBulkUpdate,
  bootcampRegistrations,
  bootcampLoading,
  bootcampSearch,
  bootcampStatusFilter,
  setBootcampSearch,
  setBootcampStatusFilter,
  updateRegistrationStatus,
  updateRegistrationNotes,
  bulkUpdateRegistrationStatus,
  updateApplicationResponses,
}: AdminPanelProps) {
  const { getRoleDisplayName, getRoleColor } = roleUtils
  const [activeTab, setActiveTab] = useState<'users' | 'bootcamp' | 'resources' | 'forms' | 'timeline'>('users')

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('bootcamp')}
          className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'bootcamp'
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          Registrations
        </button>
        <button
          onClick={() => setActiveTab('forms')}
          className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'forms'
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          Form Config
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'timeline'
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'resources'
              ? 'bg-white/20 text-white'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          Resources
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">User Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-white/80 mb-2">Search</label>
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Role</label>
            <select
              value={adminRoleFilter}
              onChange={(e) => setAdminRoleFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="">All Roles</option>
              <option value="non_member">Non-Member</option>
              <option value="bolt_member">Bolt Member</option>
              <option value="executive_member">Executive Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 mb-2">Graduation Year</label>
            <select
              value={adminYearFilter}
              onChange={(e) => setAdminYearFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="">All Years</option>
              {Array.from({length: 11}, (_, i) => 2020 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadAdminData}
              disabled={adminLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {adminLoading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-yellow-100 mb-3">
              Bulk Actions ({selectedUsers.length} selected)
            </h3>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-yellow-100 mb-1">Action</label>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-yellow-300/30 rounded text-white"
                >
                  <option value="">Select Action</option>
                  <option value="role">Change Role</option>
                  <option value="graduation_year">Set Graduation Year</option>
                </select>
              </div>

              {bulkAction && (
                <div>
                  <label className="block text-yellow-100 mb-1">Value</label>
                  {bulkAction === 'role' ? (
                    <select
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-yellow-300/30 rounded text-white"
                    >
                      <option value="">Select Role</option>
                      <option value="non_member">Non-Member</option>
                      <option value="bolt_member">Bolt Member</option>
                      <option value="executive_member">Executive Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      placeholder="2025"
                      min="2020"
                      max="2030"
                      className="px-3 py-2 bg-white/10 border border-yellow-300/30 rounded text-white placeholder-yellow-200/50"
                    />
                  )}
                </div>
              )}

              <button
                onClick={handleBulkUpdate}
                disabled={!bulkAction || !bulkValue}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                Apply to {selectedUsers.length} Users
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === adminUsers.length && adminUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(adminUsers.map(user => user.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="text-left py-3 px-2">Name</th>
                <th className="text-left py-3 px-2">Email</th>
                <th className="text-left py-3 px-2">Role</th>
                <th className="text-left py-3 px-2">Graduation Year</th>
                <th className="text-left py-3 px-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id])
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="py-3 px-2 font-medium">{user.full_name || 'N/A'}</td>
                  <td className="py-3 px-2">{user.email}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="py-3 px-2">{user.graduation_year || 'N/A'}</td>
                  <td className="py-3 px-2 text-sm text-white/70">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {activeTab === 'bootcamp' && (
        <BootcampRegistrationsPanel
          registrations={bootcampRegistrations}
          loading={bootcampLoading}
          search={bootcampSearch}
          statusFilter={bootcampStatusFilter}
          setSearch={setBootcampSearch}
          setStatusFilter={setBootcampStatusFilter}
          onUpdateStatus={updateRegistrationStatus}
          onUpdateNotes={updateRegistrationNotes}
          onBulkUpdateStatus={bulkUpdateRegistrationStatus}
          onUpdateApplicationResponses={updateApplicationResponses}
        />
      )}

      {activeTab === 'forms' && (
        <FormConfigPanel />
      )}

      {activeTab === 'timeline' && (
        <EventTimelinePanel />
      )}

      {activeTab === 'resources' && (
        <ResourcesManagementPanel />
      )}
    </div>
  )
}

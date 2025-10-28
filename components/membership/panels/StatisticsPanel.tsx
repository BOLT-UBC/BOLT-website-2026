import React from 'react'
import { roleUtils } from '../RoleBadge'
import type { UserProfile, AdminStats } from '../types'

interface StatisticsPanelProps {
  adminStats: AdminStats | null
  adminLoading: boolean
}

export function StatisticsPanel({ adminStats, adminLoading }: StatisticsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6m4 6V7m4 10v-3M3 3v18h18" />
          </svg>
          <h2 className="text-2xl font-bold text-white">Statistics</h2>
        </div>

        {adminLoading ? (
          <p className="text-white/70">Loading statistics...</p>
        ) : adminStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/70 text-sm">Total Users</div>
              <div className="text-white text-2xl font-bold">{adminStats.totalUsers}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/70 text-sm">New This Month</div>
              <div className="text-white text-2xl font-bold">{adminStats.newSignups}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/70 text-sm">Complete Profiles</div>
              <div className="text-white text-2xl font-bold">{adminStats.completeProfiles}</div>
              <div className="text-white/60 text-xs mt-1">{adminStats.profileCompletionRate}% completion</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/70 text-sm">Resume Uploads</div>
              <div className="text-white text-2xl font-bold">{adminStats.usersWithResumes}</div>
              <div className="text-white/60 text-xs mt-1">{adminStats.resumeUploadRate}% uploaded</div>
            </div>
          </div>
        ) : (
          <p className="text-white/70">No statistics available.</p>
        )}

        {/* Role distribution */}
        {adminStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {Object.entries(adminStats.roleDistribution || {}).map(([role, count]) => (
              <div key={role} className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 text-sm capitalize">{role.replace('_', ' ')}</div>
                <div className="text-white text-2xl font-bold">{count as number}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

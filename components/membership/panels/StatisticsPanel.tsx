import React from 'react'
// import { roleUtils } from '../RoleBadge'
import type { AdminStats } from '../types'
import { RolePieChart, RegistrationGraph } from '../Chart'

interface StatisticsPanelProps {
  adminStats: AdminStats | null
  adminLoading: boolean
}

export function StatisticsPanel({ adminStats, adminLoading }: StatisticsPanelProps) {


  // Track Filtering
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  const roleDistribution = React.useMemo(() => {
    const registrations = Array.isArray(adminStats?.roleRegistrations) ? adminStats.roleRegistrations : [];
    return registrations.reduce((acc, reg) => {
      acc[reg.role] = (acc[reg.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [adminStats?.roleRegistrations]);

  // Filtering Logic
  const filteredTimestamps = React.useMemo(() => {
    const registrations = Array.isArray(adminStats?.roleRegistrations) ? adminStats.roleRegistrations : [];
    
    // Case All Selected
    if (!selectedRole) {
      return registrations.map(r => r.createdAt).sort((a, b) => a - b);
    }
    
    return registrations
      .filter(r => r.role === selectedRole)
      .map(r => r.createdAt)
      .sort((a, b) => a - b);
  }, [adminStats?.roleRegistrations, selectedRole]);

  // Shared color palette
  const COLORS = ['#22d3ee', '#81f8a3', '#fbbf24', '#2dd4bf'];

  // Determine the color for the graph
  const graphColor = React.useMemo(() => {
    if (!selectedRole) return '#f8fafc'; // Base color (Silver-White) for "All"
    
    const roles = Object.keys(roleDistribution);
    const index = roles.indexOf(selectedRole);
    return COLORS[index % COLORS.length];
  }, [selectedRole, roleDistribution]);

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
            {Object.entries(roleDistribution || {}).map(([role, count]) => (
              <div key={role} className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 text-sm capitalize">{role.replace('_', ' ')}</div>
                <div className="text-white text-2xl font-bold">{count as number}</div>
              </div>
            ))}
          </div>
        )}

        {/* User Distribution Chart and Timeline Chart*/}
        {adminStats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Pie Chart */}
            <div className="h-[450px] bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-medium mb-4">User Distribution</h3>
              <RolePieChart distribution={roleDistribution} />
            </div>

            {/* Timeline with Filter Buttons */}
            <div className="h-[450px] bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h3 className="text-white font-medium">Timeline</h3>
                
                {/* Filter Buttons */}
                <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                  <button
                    onClick={() => setSelectedRole(null)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      selectedRole === null 
                      ? 'bg-white/20 text-white font-bold' 
                      : 'text-white/50 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {Object.keys(roleDistribution).map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors capitalize ${
                        selectedRole === role 
                        ? 'bg-white/20 text-white font-bold' 
                        : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {role.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <RegistrationGraph 
                  createdAt={filteredTimestamps} 
                  maxMonthlySignups={adminStats.maxMonthlySignups || 10}
                  lineColor={graphColor}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

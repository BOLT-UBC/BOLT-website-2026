import React from 'react'
import Image from 'next/image'
import { RoleBadge, UserRole } from './RoleBadge'

export interface SidebarTeam { id: string; name: string; }
export interface SidebarProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  team_id: string | null
}

export type RoleView = 'admin' | 'executive_member' | 'bolt_member' | 'non_member'

export function Sidebar({
  profile,
  email,
  teams,
  activeTab,
  setActiveTab,
  roleView,
  setRoleView,
  collapsed = false,
  onToggle,
}: {
  profile: SidebarProfile | null
  email: string
  teams: SidebarTeam[]
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  roleView: RoleView
  setRoleView: React.Dispatch<React.SetStateAction<RoleView>>
  collapsed?: boolean
  onToggle?: () => void
}) {
  const effectiveRole: RoleView = profile?.role === 'admin' ? roleView : (profile?.role || 'non_member')
  const iconSize = collapsed ? 'w-6 h-6' : 'w-5 h-5'

  const tabs: { id: string; label: string; icon: React.ReactNode }[] = []

  // Add admin tab first if user is admin
  if (effectiveRole === 'admin') {
    tabs.push({ id: 'admin', label: 'Admin', icon: (
      <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ) })
  }

  // Add regular tabs
  tabs.push(
    { id: 'home', label: 'Home', icon: (
      <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    ) },
    { id: 'profile', label: 'Profile', icon: (
      <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    ) },
    { id: 'resume', label: 'Resume', icon: (
      <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ) },
    { id: 'events', label: 'Events', icon: (
      <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    ) }
  )

  // Add Resources tab for all users except non_members
  if (effectiveRole !== 'non_member') {
    tabs.push({ id: 'resources', label: 'Resources', icon: (
      <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    ) })
  }

  if (effectiveRole === 'admin' || effectiveRole === 'executive_member') {
    tabs.push({ id: 'announcements', label: 'Announcements', icon: (
      <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
    ) })
    tabs.push({ id: 'statistics', label: 'Statistics', icon: (
      <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M7 13v5m5-10v10m5-7v7" /></svg>
    ) })
  }

  tabs.push({ id: 'account', label: 'Account', icon: (
    <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ) })

  return (
    <div className={`h-screen bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Toggle Button */}
      <div className={`p-4 flex items-center ${collapsed ? 'flex-col gap-3' : 'justify-between'}`} style={{ paddingTop: '100px' }}>
        {!collapsed && (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Profile" width={40} height={40} className="rounded-full" />
              ) : (
                <div className="text-lg font-bold text-white">{profile?.full_name?.charAt(0) || email?.charAt(0) || 'U'}</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-white truncate">{profile?.full_name || 'Member'}</h2>
              <p className="text-white/70 text-xs truncate">{email}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="Profile" width={40} height={40} className="rounded-full" />
            ) : (
              <div className="text-lg font-bold text-white">{profile?.full_name?.charAt(0) || email?.charAt(0) || 'U'}</div>
            )}
          </div>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className={`p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 ${collapsed ? 'w-full' : ''}`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {collapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Role Badge and Admin View Selector */}
      {!collapsed && (
        <div className="p-4">
          <div className="flex flex-wrap gap-1 justify-center mb-3">
            <RoleBadge role={(profile?.role || 'non_member') as UserRole} />
            {profile?.team_id && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                {teams.find(t => t.id === profile.team_id)?.name || 'Team Member'}
              </span>
            )}
          </div>
          {profile?.role === 'admin' && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs font-medium">View as:</span>
                <select
                  value={roleView}
                  onChange={(e) => setRoleView(e.target.value as RoleView)}
                  className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-white/50 min-w-0 flex-1 ml-2"
                >
                  <option value="admin">Admin</option>
                  <option value="executive_member">Executive</option>
                  <option value="bolt_member">Bolt Member</option>
                  <option value="non_member">Non-Member</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center ${
                collapsed ? 'justify-center px-0' : 'gap-3 px-3'
              } py-2.5 rounded-lg text-left transition-colors group relative ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              title={collapsed ? tab.label : undefined}
            >
              <div className="flex-shrink-0">{tab.icon}</div>
              {!collapsed && <span className="font-medium text-sm">{tab.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-lg border border-white/10">
                  {tab.label}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}



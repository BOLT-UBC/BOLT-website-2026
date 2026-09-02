'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/useAuth'
import { authService } from '@/lib/auth'
import {
  Sidebar,
  DeleteAccountModal,
  type RoleView,
  type SidebarProfile,
  useMembershipData,
  useAdminData,
  useProfileManagement,
  HomePanel,
  ProfilePanel,
  ResumePanel,
  EventsPanel,
  StatisticsPanel,
  AdminPanel,
  AccountPanel,
  AnnouncementsPanel,
  ResourcesPanel
} from '@/components/membership'

export default function MembershipPortal() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [roleView, setRoleView] = useState<RoleView>('admin')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  // Custom hooks for data management
  const { profile, events, teams, setProfile } = useMembershipData(user?.id)
  const adminData = useAdminData(profile?.role, activeTab, roleView)
  const profileManagement = useProfileManagement(user, profile)

  // Initialize profile form when profile loads
  useEffect(() => {
    if (profile && user) {
      profileManagement.initializeForm()
    }
  }, [profile, user])

  // Close the mobile sidebar drawer whenever a tab is selected
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [activeTab])

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type "DELETE" to confirm account deletion')
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/account/delete?userId=${user?.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete account')
      }

      // Sign out and redirect
      await authService.signOut()
      router.push('/')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete account')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
      setDeleteConfirmText('')
    }
  }

  const handleUpdateProfile = async () => {
    await profileManagement.handleUpdateProfile(setProfile)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#614ea5] to-[#493b7b] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#614ea5] to-[#493b7b] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Please Sign In</h1>
          <p className="text-xl mb-6">You need to be signed in to access the membership portal.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Gate non-members out of the full member portal - they haven't been
  // approved yet, so show an "awaiting approval" message instead of the
  // full panel set.
  if (profile && profile.role === 'non_member') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#614ea5] to-[#493b7b] flex items-center justify-center">
        <div className="text-center text-white max-w-lg px-6">
          <h1 className="text-4xl font-bold mb-4">Awaiting Approval</h1>
          <p className="text-xl mb-6">
            Thanks for signing up! Your account is currently pending membership approval.
            You&apos;ll get full access to the member portal once an admin approves your membership.
          </p>
          <button
            onClick={async () => {
              try {
                await authService.signOut()
              } finally {
                router.push('/')
              }
            }}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    )
  }

  // Convert profile to SidebarProfile format
  const sidebarProfile: SidebarProfile | null = profile ? {
    member_id: profile.member_id,
    email: profile.email,
    full_name: profile.full_name,
    avatar: profile.avatar,
    role: profile.role as 'non_member' | 'bolt_member' | 'executive_member' | 'admin',
    team_id: profile.team_id,
  } : null

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'home':
        return <HomePanel events={events} onSwitchTab={setActiveTab} />

      case 'profile':
        return (
          <ProfilePanel
            profile={profile}
            user={{ email: user.email || '' }}
            isEditing={profileManagement.isEditing}
            updating={profileManagement.updating}
            editForm={profileManagement.editForm}
            setIsEditing={profileManagement.setIsEditing}
            setEditForm={profileManagement.setEditForm}
            handleUpdateProfile={handleUpdateProfile}
          />
        )

      case 'resume':
        return <ResumePanel />

      case 'events':
        return <EventsPanel events={events} userId={user?.id} />

      case 'announcements':
        if (adminData.getEffectiveRole() === 'admin' || adminData.getEffectiveRole() === 'executive_member') {
          return <AnnouncementsPanel userRole={profile?.role} />
        }
        return null

      case 'statistics':
        if (adminData.getEffectiveRole() === 'admin' || adminData.getEffectiveRole() === 'executive_member') {
          return <StatisticsPanel adminStats={adminData.adminStats} adminLoading={adminData.adminLoading} />
        }
        return null

      case 'admin':
        if (adminData.getEffectiveRole() === 'admin') {
          return (
            <AdminPanel
              adminUsers={adminData.adminUsers}
              adminLoading={adminData.adminLoading}
              adminSearch={adminData.adminSearch}
              adminRoleFilter={adminData.adminRoleFilter}
              adminYearFilter={adminData.adminYearFilter}
              selectedUsers={adminData.selectedUsers}
              bulkAction={adminData.bulkAction}
              bulkValue={adminData.bulkValue}
              setAdminSearch={adminData.setAdminSearch}
              setAdminRoleFilter={adminData.setAdminRoleFilter}
              setAdminYearFilter={adminData.setAdminYearFilter}
              setSelectedUsers={adminData.setSelectedUsers}
              setBulkAction={adminData.setBulkAction}
              setBulkValue={adminData.setBulkValue}
              loadAdminData={adminData.loadAdminData}
              handleBulkUpdate={adminData.handleBulkUpdate}
              bootcampRegistrations={adminData.bootcampRegistrations}
              bootcampLoading={adminData.bootcampLoading}
              bootcampSearch={adminData.bootcampSearch}
              bootcampStatusFilter={adminData.bootcampStatusFilter}
              setBootcampSearch={adminData.setBootcampSearch}
              setBootcampStatusFilter={adminData.setBootcampStatusFilter}
              updateRegistrationStatus={adminData.updateRegistrationStatus}
              updateRegistrationNotes={adminData.updateRegistrationNotes}
              bulkUpdateRegistrationStatus={adminData.bulkUpdateRegistrationStatus}
              updateApplicationResponses={adminData.updateApplicationResponses}
            />
          )
        }
        return null

      case 'resources':
        if (adminData.getEffectiveRole() !== 'non_member') {
          return <ResourcesPanel userRole={profile?.role} />
        }
        return null

      case 'account':
        return (
          <AccountPanel
            user={{ email: user.email || '', created_at: user.created_at }}
            profile={profile}
            setShowDeleteConfirm={setShowDeleteConfirm}
            onLogout={async () => {
              try {
                await authService.signOut()
                router.push('/')
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to sign out:', error)
                // Still redirect even if sign out fails
                router.push('/')
              }
            }}
          />
        )

      default:
        return <HomePanel events={events} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#614ea5] to-[#493b7b]">
      <Navbar />

      <div className="flex relative" style={{ paddingTop: '80px' }}>
        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="fixed left-4 top-[92px] z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md md:hidden"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Fixed Left Sidebar (desktop) */}
        <div className="fixed left-0 top-0 z-40 hidden md:block">
          <Sidebar
            profile={sidebarProfile}
            email={user.email || ''}
            teams={teams}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            roleView={roleView}
            setRoleView={setRoleView}
            collapsed={!sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* Mobile sidebar drawer */}
        {mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 z-50 md:hidden">
              <Sidebar
                profile={sidebarProfile}
                email={user.email || ''}
                teams={teams}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                roleView={roleView}
                setRoleView={setRoleView}
                collapsed={false}
                onToggle={() => setMobileSidebarOpen(false)}
              />
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div
          className={`min-w-0 flex-1 transition-all duration-300 ${
            sidebarOpen ? 'md:ml-64' : 'md:ml-20'
          }`}
        >
          <div className="min-h-[calc(100vh-80px)]">
            <div className="px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                  Welcome to your BOLT membership dashboard
                </h1>
              </div>

              {/* Content Panel */}
              <div className="w-full">
                {renderActivePanel()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        confirmText={deleteConfirmText}
        setConfirmText={setDeleteConfirmText}
        deleting={deleting}
        onConfirm={handleDeleteAccount}
        onCancel={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
      />
    </div>
  )
}

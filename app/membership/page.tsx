'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ResumeUpload from '@/components/ResumeUpload'
import { useAuth } from '@/lib/useAuth'
import { authService } from '@/lib/auth'
import { profileService, eventService, teamService } from '@/lib/database'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'non_member' | 'platinum_member' | 'executive_member' | 'admin'
  team_id: string | null
  graduation_year: number | null
  major: string | null
  phone: string | null
  linkedin_url: string | null
  resume_url: string | null
  resume_file_name: string | null
  resume_uploaded_at: string | null
  created_at: string
  updated_at: string
}

interface Event {
  id: string
  name: string
  description: string | null
  image_url: string | null
  date: string | null
  location: string | null
  max_capacity: number | null
  registration_open: boolean
  registration_deadline: string | null
}

interface Team {
  id: string
  name: string
  description: string | null
}

export default function MembershipPortal() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [activeTab, setActiveTab] = useState('home')
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    graduation_year: '',
    major: '',
    phone: '',
    linkedin_url: ''
  })

  // Admin dashboard state
  const [adminUsers, setAdminUsers] = useState<UserProfile[]>([])
  const [adminStats, setAdminStats] = useState<{
    totalUsers: number
    roleDistribution: Record<string, number>
    newSignups: number
    recentSignups: number
    completeProfiles: number
    usersWithResumes: number
    profileCompletionRate: number
    resumeUploadRate: number
  } | null>(null)
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminSearch, setAdminSearch] = useState('')
  const [adminRoleFilter, setAdminRoleFilter] = useState('')
  const [adminYearFilter, setAdminYearFilter] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')
  const [bulkValue, setBulkValue] = useState('')

  // Load user profile and data
  useEffect(() => {
    if (user?.id) {
      loadUserData()
    }
  }, [user?.id])

  // Load admin data when admin tab is selected
  useEffect(() => {
    if (activeTab === 'admin' && profile?.role === 'admin') {
      loadAdminData()
    }
  }, [activeTab, profile?.role])

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

  const loadUserData = async () => {
    try {
        const [profileData, eventsData, teamsData] = await Promise.all([
        profileService.getById(user!.id),
        eventService.getAll(),
          teamService.getAll()
        ])

        setProfile(profileData)
        setEvents(eventsData)
        setTeams(teamsData)

        // Set form data
        setEditForm({
          full_name: profileData.full_name || '',
        email: user?.email || '',
        graduation_year: profileData.graduation_year?.toString() || '',
          major: profileData.major || '',
          phone: profileData.phone || '',
          linkedin_url: profileData.linkedin_url || ''
        })
    } catch (error) {
      // Failed to load user data
      void error
    }
  }

  const handleUpdateProfile = async () => {
    if (!user?.id) return

    try {
      setUpdating(true)

      // Update email in Supabase Auth if it has changed
      if (editForm.email !== user.email) {
        await authService.updateEmail(editForm.email)
      }

      // Update profile data
      const updatedProfile = await profileService.update(user.id, {
        full_name: editForm.full_name || null,
        graduation_year: editForm.graduation_year ? parseInt(editForm.graduation_year) : null,
        major: editForm.major || null,
        phone: editForm.phone || null,
        linkedin_url: editForm.linkedin_url || null
      })

      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (error) {
      // Failed to update profile
      void error
    } finally {
      setUpdating(false)
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'non_member': return 'Non-Member'
      case 'platinum_member': return 'Platinum Member'
      case 'executive_member': return 'Executive Member'
      case 'admin': return 'Admin'
      default: return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'non_member': return 'bg-gray-100 text-gray-800'
      case 'platinum_member': return 'bg-yellow-100 text-yellow-800'
      case 'executive_member': return 'bg-blue-100 text-blue-800'
      case 'admin': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Admin dashboard functions
  const loadAdminData = async () => {
    if (profile?.role !== 'admin') return

    setAdminLoading(true)
    try {
      // Load users
      const usersResponse = await fetch(`/api/admin/users?search=${adminSearch}&role=${adminRoleFilter}&graduation_year=${adminYearFilter}`)
      const usersData = await usersResponse.json()
      setAdminUsers(usersData.users || [])

      // Load statistics
      const statsResponse = await fetch('/api/admin/statistics')
      const statsData = await statsResponse.json()
      setAdminStats(statsData)
    } catch (error) {
      // Failed to load admin data
      void error
    } finally {
      setAdminLoading(false)
    }
  }

  const handleBulkUpdate = async () => {
    if (selectedUsers.length === 0 || !bulkAction || !bulkValue) return

    try {
      const updates: Record<string, string | number> = {}
      if (bulkAction === 'role') {
        updates.role = bulkValue
      } else if (bulkAction === 'graduation_year') {
        updates.graduation_year = parseInt(bulkValue)
      }

      const response = await fetch('/api/admin/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUsers, updates })
      })

      if (response.ok) {
        alert(`Updated ${selectedUsers.length} users successfully!`)
        setSelectedUsers([])
        setBulkAction('')
        setBulkValue('')
        loadAdminData()
      } else {
        alert('Failed to update users')
      }
    } catch (error) {
      // Failed to update users
      void error
      alert('Error updating users')
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#614ea5] to-[#493b7b]">
      <Navbar />

      <div className="pt-20 px-6 sm:px-6 md:px-16 pb-16">
        {/* Header - moved lower */}
        <div className="text-center mb-16 mt-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
            Membership Portal
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Welcome to your BOLT UBC membership dashboard
          </p>
        </div>

        {/* Main Layout - Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - User Profile (Smaller) */}
          <div className="lg:w-1/4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 sticky top-8">
              {/* Profile Header */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Profile"
                      width={64}
                      height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="text-2xl font-bold text-white">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
            </div>
                <h2 className="text-lg font-bold text-white mb-1">
                {profile?.full_name || 'Member'}
              </h2>
                <p className="text-white/80 text-sm mb-3">{user.email}</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(profile?.role || 'non_member')}`}>
                  {getRoleDisplayName(profile?.role || 'non_member')}
                </span>
                {profile?.team_id && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    {teams.find(t => t.id === profile.team_id)?.name || 'Team Member'}
                  </span>
                )}
          </div>
        </div>

        {/* Navigation Tabs */}
              <div className="space-y-1">
                {[
                  {
                    id: 'home',
                    label: 'Home',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  },
                  {
                    id: 'profile',
                    label: 'Profile',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  },
                  {
                    id: 'resume',
                    label: 'Resume',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  },
                  {
                    id: 'events',
                    label: 'Events',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  },
                  ...(profile?.role === 'admin' ? [{
                    id: 'admin',
                    label: 'Admin',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  }] : []),
                  {
                    id: 'account',
                    label: 'Account',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
                    {tab.icon}
                    <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
              </div>
            </div>
        </div>

          {/* Right Content Area */}
          <div className="lg:w-3/4">
            {/* Home Tab */}
            {activeTab === 'home' && (
            <div className="space-y-6">
                {/* Announcements Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white">Announcements</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Welcome to BOLT UBC 2025!</h3>
                      <p className="text-white/70 mb-2">
                        We're excited to have you as part of our community. Make sure to complete your profile and upload your resume to get the most out of your membership.
                      </p>
                      <p className="text-white/50 text-sm">January 15, 2025</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Upcoming Workshop Series</h3>
                      <p className="text-white/70 mb-2">
                        Join us for our technical workshop series starting next week. Topics include web development, data science, and machine learning.
                      </p>
                      <p className="text-white/50 text-sm">January 10, 2025</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {events.length > 0 ? (
                      events.slice(0, 6).map((event) => {
                        // Map event names to their corresponding page routes
                        const getEventRoute = (eventName: string) => {
                          const name = eventName.toLowerCase();
                          if (name.includes('first byte')) return '/events/first-byte';
                          if (name.includes('bolt connect')) return '/events/bolt-connect';
                          if (name.includes('bolt circuit')) return '/events/bolt-circuit';
                          if (name.includes('bolt bootcamp')) return '/events/bolt-bootcamp';
                          return '/events'; // fallback to events page
                        };

                        return (
                          <a
                            key={event.id}
                            href={getEventRoute(event.name)}
                            className="block bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors group"
                          >
                            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                              {event.name}
                            </h3>
                            {event.description && (
                              <p className="text-white/70 mb-3 text-sm line-clamp-2">{event.description}</p>
                            )}
                            <div className="space-y-2 text-sm text-white/60">
                              {event.date && (
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="truncate">{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                            </div>
                            {event.name.toLowerCase().includes('bolt connect') && (
                              <div className="mt-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Registration Open
                                </span>
                              </div>
                            )}
                            <div className="mt-3 flex items-center text-blue-300 text-sm font-medium group-hover:text-blue-200 transition-colors">
                              Learn More →
                            </div>
                          </a>
                        );
                      })
                    ) : (
                      <div className="col-span-full bg-white/5 rounded-lg p-8 text-center">
                        <svg className="w-12 h-12 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-white/60 text-lg">No upcoming events at the moment</p>
                        <p className="text-white/40 text-sm mt-2">Check back soon for exciting events!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resources Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white">Resources</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">Previous Cases</h3>
                      </div>
                      <p className="text-white/70 mb-3">Access past hackathon and datathon case studies and datasets.</p>
                      <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
                        View Cases →
                      </button>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">Assets & Logos</h3>
                      </div>
                      <p className="text-white/70 mb-3">Download BOLT logos, brand assets, and design resources for your projects.</p>
                      <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
                        Download Assets →
                      </button>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">Workshop Materials</h3>
                      </div>
                      <p className="text-white/70 mb-3">Slides, code samples, and resources from our technical workshops.</p>
                      <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
                        Browse Materials →
                      </button>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">Tech Stack Guides</h3>
                      </div>
                      <p className="text-white/70 mb-3">Quick-start guides and tutorials for popular technologies and frameworks.</p>
                      <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
                        Explore Guides →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                  <div className="space-y-6">
                  <div>
                    <label className="block text-white/80 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                      <label className="block text-white/80 mb-2">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Enter your email address"
                      />
                    </div>

                  <div>
                      <label className="block text-white/80 mb-2">Graduation Year</label>
                      <input
                        type="number"
                        value={editForm.graduation_year}
                        onChange={(e) => setEditForm({ ...editForm, graduation_year: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="e.g., 2025"
                        min="2020"
                        max="2030"
                      />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2">Major</label>
                    <input
                      type="text"
                      value={editForm.major}
                      onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Enter your major"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Enter your phone number"
                    />
                  </div>

                    <div>
                    <label className="block text-white/80 mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editForm.linkedin_url}
                      onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>

                    <div className="flex gap-4">
                    <button
                        onClick={handleUpdateProfile}
                        disabled={updating}
                        className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                        {updating ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/60 mb-1">Full Name</label>
                    <p className="text-white text-lg">{profile?.full_name || 'Not provided'}</p>
                  </div>

                  <div>
                     <label className="block text-white/60 mb-1">Email</label>
                     <p className="text-white text-lg">{user.email}</p>
                   </div>

                   <div>
                     <label className="block text-white/60 mb-1">Membership Status</label>
                     <div className="flex items-center gap-2">
                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile?.role || 'non_member')}`}>
                         {getRoleDisplayName(profile?.role || 'non_member')}
                       </span>
                         {profile?.role === 'non_member' && (
                          <a
                            href="https://www.bouncelife.com/events/68b5499b97ed25a0b6575d26"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                          >
                            Become a Member →
                          </a>
                         )}
                     </div>
                   </div>

                   <div>
                     <label className="block text-white/60 mb-1">Graduation Year</label>
                     <p className="text-white text-lg">{profile?.graduation_year ? `Class of ${profile.graduation_year}` : 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Major</label>
                    <p className="text-white text-lg">{profile?.major || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Phone</label>
                    <p className="text-white text-lg">{profile?.phone || 'Not provided'}</p>
                  </div>

                   <div className="md:col-span-2">
                    <label className="block text-white/60 mb-1">LinkedIn</label>
                    <p className="text-white text-lg">
                      {profile?.linkedin_url ? (
                          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                            {profile.linkedin_url}
                          </a>
                        ) : (
                          'Not provided'
                        )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

            {/* Resume Tab */}
          {activeTab === 'resume' && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Resume Management</h2>
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
            <div>
                        <h3 className="text-lg font-semibold text-blue-100 mb-2">Boost Your Opportunities!</h3>
                        <p className="text-blue-200/90 leading-relaxed">
                          Upload your resume to our secure database so our sponsors and partners can discover your talent!
                          This helps you connect with internship opportunities, job openings, and networking events.
                          Your resume helps us match you with the right opportunities and showcase your skills to our industry partners.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <ResumeUpload />
            </div>
          )}

            {/* Events Tab */}
          {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
                  <div className="space-y-4">
                    {events.length > 0 ? (
                      events.map((event) => (
                        <div key={event.id} className="bg-white/5 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-2">{event.name}</h3>
                    {event.description && (
                            <p className="text-white/70 mb-2">{event.description}</p>
                    )}
                    {event.date && (
                            <p className="text-white/60 text-sm">
                        📅 {new Date(event.date).toLocaleDateString()}
                      </p>
                    )}
                    {event.location && (
                            <p className="text-white/60 text-sm">
                              📍 {event.location}
                            </p>
                          )}
                    </div>
                      ))
                    ) : (
                      <p className="text-white/60">No events available at the moment.</p>
                    )}
                  </div>
              </div>
            </div>
          )}

            {/* Admin Dashboard Tab */}
            {activeTab === 'admin' && profile?.role === 'admin' && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                {adminStats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">Total Users</h3>
                      </div>
                      <p className="text-3xl font-bold text-white">{adminStats.totalUsers}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">New This Month</h3>
                      </div>
                      <p className="text-3xl font-bold text-white">{adminStats.newSignups}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">Complete Profiles</h3>
                      </div>
                      <p className="text-3xl font-bold text-white">{adminStats.profileCompletionRate}%</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">Resume Uploads</h3>
                      </div>
                      <p className="text-3xl font-bold text-white">{adminStats.resumeUploadRate}%</p>
                    </div>
                  </div>
                )}

                {/* Search and Filters */}
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
                        <option value="platinum_member">Platinum Member</option>
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
                                <option value="platinum_member">Platinum Member</option>
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
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

                {/* Admin Panel - Only show for admins */}
                {profile?.role === 'admin' && (
                  <div className="mb-8 p-6 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <h3 className="text-xl font-bold text-red-100 mb-4">🔧 Admin Panel</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-red-100 mb-2">Update User Role</label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            placeholder="User email"
                            className="flex-1 px-3 py-2 bg-white/10 border border-red-300/30 rounded text-white placeholder-red-200/50"
                            id="admin-email"
                          />
                          <select className="px-3 py-2 bg-white/10 border border-red-300/30 rounded text-white" id="admin-role">
                            <option value="non_member">Non-Member</option>
                            <option value="platinum_member">Platinum Member</option>
                            <option value="executive_member">Executive Member</option>
                            <option value="admin">Admin</option>
                          </select>
                    <button
                      onClick={async () => {
                              const email = (document.getElementById('admin-email') as HTMLInputElement)?.value;
                              const role = (document.getElementById('admin-role') as HTMLSelectElement)?.value;
                              if (email && role) {
                                try {
                                  const response = await fetch('/api/admin/update-role', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email, role })
                                  });
                                  if (response.ok) {
                                    alert('Role updated successfully!');
                                  } else {
                                    alert('Failed to update role');
                                  }
                                } catch (error) {
                                  // Failed to update role
                                  void error
                                  alert('Error updating role');
                                }
                        }
                      }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                            Update Role
                    </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
            <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/60 mb-1">Email</label>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-white/60 mb-1">Account Created</label>
                        <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                  <div className="border-t border-white/20 pt-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
                    <p className="text-white/70 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Account
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Account</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. This will permanently delete your account and remove all your data.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="font-bold">DELETE</span> to confirm:
                  </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="DELETE"
            />
                </div>
            <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting || deleteConfirmText !== 'DELETE'}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                  </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
                </div>
            </div>
          </div>
        </div>
      )}
        </div>

      <Footer />
    </div>
  )
}

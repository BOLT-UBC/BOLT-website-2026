'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
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
  year: number | null
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
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [editForm, setEditForm] = useState({
    full_name: '',
    year: '',
    major: '',
    phone: '',
    linkedin_url: ''
  })

  // Load user profile and data
  useEffect(() => {
    if (user?.id) {
      loadUserData()
    }
  }, [user?.id])

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
      if (user?.id) {
        const [profileData, eventsData, teamsData] = await Promise.all([
          profileService.getById(user.id),
          eventService.getUpcoming(),
          teamService.getAll()
        ])

        setProfile(profileData)
        setEvents(eventsData)
        setTeams(teamsData)

        // Set form data
        setEditForm({
          full_name: profileData.full_name || '',
          year: profileData.year?.toString() || '',
          major: profileData.major || '',
          phone: profileData.phone || '',
          linkedin_url: profileData.linkedin_url || ''
        })
      }
    } catch (error) {
      // Failed to load user data
      void error
    }
  }

  const handleSaveProfile = async () => {
    if (!user?.id) return

    try {
      const updatedProfile = await profileService.update(user.id, {
        full_name: editForm.full_name || null,
        year: editForm.year ? parseInt(editForm.year) : null,
        major: editForm.major || null,
        phone: editForm.phone || null,
        linkedin_url: editForm.linkedin_url || null
      })

      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (error) {
      // Failed to update profile
      void error
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
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-xl">Please log in to access the membership portal.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#614ea5] to-[#493b7b]">
      <Navbar />

      <div className="pt-20 px-6 sm:px-6 md:px-16 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
            Membership Portal
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Welcome to your BOLT UBC membership dashboard
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="text-2xl font-bold text-white">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {profile?.full_name || 'Member'}
              </h2>
              <p className="text-white/80 mb-2">{user.email}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile?.role || 'non_member')}`}>
                  {getRoleDisplayName(profile?.role || 'non_member')}
                </span>
                {profile?.team_id && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {teams.find(t => t.id === profile.team_id)?.name || 'Team Member'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'resume', label: 'Resume', icon: '📄' },
            { id: 'events', label: 'Events', icon: '📅' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Profile Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-white/80 mb-2">Year</label>
                    <select
                      value={editForm.year}
                      onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                      <option value="">Select year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
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

                  <div className="md:col-span-2">
                    <label className="block text-white/80 mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editForm.linkedin_url}
                      onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-4">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
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
                    <label className="block text-white/60 mb-1">Year</label>
                    <p className="text-white text-lg">{profile?.year ? `${profile.year}${profile.year === 1 ? 'st' : profile.year === 2 ? 'nd' : profile.year === 3 ? 'rd' : 'th'} Year` : 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Major</label>
                    <p className="text-white text-lg">{profile?.major || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Phone</label>
                    <p className="text-white text-lg">{profile?.phone || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">LinkedIn</label>
                    <p className="text-white text-lg">
                      {profile?.linkedin_url ? (
                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200">
                          View Profile
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Member Since</label>
                    <p className="text-white text-lg">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'resume' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Resume Management</h3>
              <ResumeUpload
                onUploadSuccess={(resume) => {
                  void resume
                  loadUserData() // Refresh profile data
                }}
                onUploadError={(error) => {
                  void error
                  // Handle upload error
                }}
              />
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Upcoming Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-white/10 rounded-lg p-6 border border-white/20">
                    <h4 className="text-xl font-bold text-white mb-2">{event.name}</h4>
                    {event.description && (
                      <p className="text-white/80 mb-4">{event.description}</p>
                    )}
                    {event.date && (
                      <p className="text-white/60 mb-2">
                        📅 {new Date(event.date).toLocaleDateString()}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-white/60 mb-4">📍 {event.location}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.registration_open
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {event.registration_open ? 'Open' : 'Closed'}
                      </span>
                      <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                        Register
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Account Settings</h3>
              <div className="space-y-6">
                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Account Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/60 mb-1">Email</label>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Role</label>
                      <p className="text-white">{getRoleDisplayName(profile?.role || 'non_member')}</p>
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Account Status</label>
                      <p className="text-green-400">Active</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Privacy & Security</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                      Change Password
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                      Download My Data
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await authService.signOut()
                          router.push('/')
                        } catch (error) {
                          // Logout failed
                          void error
                        }
                      }}
                      className="w-full text-left px-4 py-3 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors"
                    >
                      Sign Out
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full text-left px-4 py-3 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 max-w-md w-full mx-4 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Delete Account</h3>
            <p className="text-white/80 mb-4">
              This action cannot be undone. All your data, including your profile, resume, and event registrations will be permanently deleted.
            </p>
            <p className="text-white/60 text-sm mb-4">
              Type <span className="font-mono bg-white/20 px-2 py-1 rounded">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 mb-4 focus:outline-none focus:border-white/40"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                }}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== 'DELETE'}
                className="flex-1 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { roleUtils } from '../RoleBadge'
import type { UserProfile, EditForm } from '../types'


interface ProfilePanelProps {
  profile: UserProfile | null
  user: { email: string }
  isEditing: boolean
  updating: boolean
  editForm: EditForm
  setIsEditing: (value: boolean) => void
  setEditForm: (value: EditForm | ((prev: EditForm) => EditForm)) => void
  handleUpdateProfile: () => void
}

export function ProfilePanel({
  profile,
  user,
  isEditing,
  updating,
  editForm,
  setIsEditing,
  setEditForm,
  handleUpdateProfile
}: ProfilePanelProps) {
  const { getRoleDisplayName, getRoleColor } = roleUtils
  const [error, setError] = useState<string | null>(null)

  // Calculate profile completion percentage
  const calculateProfileCompletion = (profile: UserProfile | null): number => {
    if (!profile) return 0

    const fields = [
      profile.full_name,
      profile.email,
      profile.graduation_year,
      profile.major,
      profile.phone,
      profile.linkedin_url,
      profile.bio,
      profile.pronouns,
      profile.discord_username,
      profile.ubc_student_id,
      profile.resume_url,
    ]

    const completedFields = fields.filter(field => field !== null && field !== '').length
    return Math.round((completedFields / fields.length) * 100)
  }

  const profileCompletion = calculateProfileCompletion(profile)
  const missingFields: string[] = []

  if (profile) {
    if (!profile.full_name) missingFields.push('Full Name')
    if (!profile.graduation_year) missingFields.push('Graduation Year')
    if (!profile.major) missingFields.push('Major')
    if (!profile.phone) missingFields.push('Phone')
    if (!profile.linkedin_url) missingFields.push('LinkedIn')
    if (!profile.bio) missingFields.push('Bio')
    if (!profile.pronouns) missingFields.push('Pronouns')
    if (!profile.discord_username) missingFields.push('Discord Username')
    if (!profile.ubc_student_id) missingFields.push('UBC Student ID')
    if (!profile.resume_url) missingFields.push('Resume')
  }

  const FieldIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
      {children}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Main Profile Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        {/* Header with Edit Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Profile</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all flex items-center gap-2 border border-white/20"
          >
            {isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </>
            )}
          </button>
        </div>

        {/* Profile Completion */}
        <div className="mb-6 pb-6">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-white/60 text-sm">Profile Completion</span>
            <span className="text-white text-sm font-medium">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                profileCompletion === 100
                  ? 'bg-green-500'
                  : profileCompletion >= 70
                  ? 'bg-blue-500'
                  : profileCompletion >= 40
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>

        {/* Profile Content */}
        {isEditing ? (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input
                type="text"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pronouns
              </label>
              <input
                type="text"
                value={editForm.pronouns}
                onChange={(e) => setEditForm({ ...editForm, pronouns: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="e.g., she/her, he/him, they/them"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Graduation Year
              </label>
              <input
                type="number"
                value={editForm.graduation_year}
                onChange={(e) => setEditForm({ ...editForm, graduation_year: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="e.g., 2025"
                min="2020"
                max="2030"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Major
              </label>
              <input
                type="text"
                value={editForm.major}
                onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Enter your major"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                UBC Student ID
              </label>
              <input
                type="text"
                value={editForm.ubc_student_id}
                onChange={(e) => setEditForm({ ...editForm, ubc_student_id: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="e.g., 12345678"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                LinkedIn URL
              </label>
              <input
                type="url"
                value={editForm.linkedin_url}
                onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Discord Username
              </label>
              <input
                type="text"
                value={editForm.discord_username}
                onChange={(e) => setEditForm({ ...editForm, discord_username: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="e.g., username#1234"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Bio/About Me
              </label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault()
                setError(null)
                try {
                  await handleUpdateProfile()
                } catch (err: unknown) {
                  // eslint-disable-next-line no-console
                  console.error('Profile update error:', err)
                  const errorMessage = (err instanceof Error ? err.message : (err as { error?: { message?: string } })?.error?.message) || 'Failed to update profile. Please try again.'
                  setError(errorMessage)
                }
              }}
              disabled={updating}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {updating ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-8 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all border border-white/20"
            >
              Cancel
            </button>
          </div>
          </>
        ) : (
          <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">Full Name</label>
                <p className="text-white text-sm">{profile?.full_name || <span className="text-white/40">Not provided</span>}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">Email</label>
                <p className="text-white text-sm break-all">{profile?.email ?? user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">Pronouns</label>
                <p className="text-white text-sm">{profile?.pronouns || <span className="text-white/40">Not provided</span>}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">Membership Status</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getRoleColor(profile?.role || 'non_member')}`}>
                    {getRoleDisplayName(profile?.role || 'non_member')}
                  </span>
                  {profile?.role === 'non_member' && (
                    <a
                      href="https://www.bouncelife.com/events/68b5499b97ed25a0b6575d26"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                    >
                      Become a Member →
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">Graduation Year</label>
                <p className="text-white text-sm">{profile?.graduation_year ? `Class of ${profile.graduation_year}` : <span className="text-white/40">Not provided</span>}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">Major</label>
                <p className="text-white text-sm">{profile?.major || <span className="text-white/40">Not provided</span>}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">UBC Student ID</label>
                <p className="text-white text-sm">{profile?.ubc_student_id || <span className="text-white/40">Not provided</span>}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">Phone</label>
                <p className="text-white text-sm">{profile?.phone || <span className="text-white/40">Not provided</span>}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">LinkedIn</label>
                <p className="text-white text-sm">
                  {profile?.linkedin_url ? (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline break-all">
                      {profile.linkedin_url}
                    </a>
                  ) : (
                    <span className="text-white/40">Not provided</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">Discord Username</label>
                <p className="text-white text-sm">{profile?.discord_username || <span className="text-white/40">Not provided</span>}</p>
              </div>
            </div>

            <div className="md:col-span-2 flex items-start gap-4">
              <FieldIcon>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </FieldIcon>
              <div className="flex-1 min-w-0">
                <label className="block text-white/50 mb-1 text-xs">Bio/About Me</label>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{profile?.bio || <span className="text-white/40">Not provided</span>}</p>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  )
}

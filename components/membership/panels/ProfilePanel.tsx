import React from 'react'
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

  return (
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
  )
}

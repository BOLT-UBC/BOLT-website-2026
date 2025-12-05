import { useState } from 'react'
import { authService } from '@/lib/auth'
import { profileService } from '@/lib/database'
import type { UserProfile, EditForm } from '../types'

export function useProfileManagement(user: UserProfile, profile: UserProfile | null) {
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [editForm, setEditForm] = useState<EditForm>({
    full_name: '',
    email: '',
    graduation_year: '',
    major: '',
    phone: '',
    linkedin_url: '',
    bio: '',
    pronouns: '',
    discord_username: '',
    ubc_student_id: ''
  })

  const initializeForm = () => {
    if (profile && user) {
      setEditForm({
        full_name: profile.full_name || '',
        email: user.email || '',
        graduation_year: profile.graduation_year?.toString() || '',
        major: profile.major || '',
        phone: profile.phone || '',
        linkedin_url: profile.linkedin_url || '',
        bio: profile.bio || '',
        pronouns: profile.pronouns || '',
        discord_username: profile.discord_username || '',
        ubc_student_id: profile.ubc_student_id || ''
      })
    }
  }

  const handleUpdateProfile = async (setProfile: (profile: UserProfile) => void): Promise<void> => {
    if (!user?.id) {
      throw new Error('User ID is required')
    }

    setUpdating(true)
    try {
      // Update email in Supabase Auth if it has changed
      if (editForm.email !== user.email) {
        await authService.updateEmail(editForm.email)
      }

      // Update profile data - convert empty strings to null, trim whitespace
      // Prepare update data - convert empty strings to null
      const graduationYearValue = editForm.graduation_year.trim()
      const graduationYear = graduationYearValue ? (isNaN(parseInt(graduationYearValue)) ? null : parseInt(graduationYearValue)) : null

      const updatedProfile = await profileService.update(user.id, {
        full_name: editForm.full_name.trim() || null,
        graduation_year: graduationYear,
        major: editForm.major.trim() || null,
        phone: editForm.phone.trim() || null,
        linkedin_url: editForm.linkedin_url.trim() || null,
        bio: editForm.bio.trim() || null,
        pronouns: editForm.pronouns.trim() || null,
        discord_username: editForm.discord_username.trim() || null,
        ubc_student_id: editForm.ubc_student_id.trim() || null
      })

      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to update profile:', error)
      // Format error message for better display
      const errorMessage = error?.message || error?.error?.message || 'Failed to update profile. Please try again.'
      throw new Error(errorMessage)
    } finally {
      setUpdating(false)
    }
  }

  return {
    isEditing,
    updating,
    editForm,
    setIsEditing,
    setUpdating,
    setEditForm,
    initializeForm,
    handleUpdateProfile
  }
}

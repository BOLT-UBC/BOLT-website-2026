import { useState } from 'react'
import { authService, type AuthUser } from '@/lib/auth'
import { profileService } from '@/lib/database'
import type { UserProfile, EditForm } from '../types'

export function useProfileManagement(user: AuthUser | null, profile: UserProfile | null) {
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [editForm, setEditForm] = useState<EditForm>({
    full_name: '',
    email: '',
    graduation_date: '',
    major: '',
    phone_num: '',
    linkedin: '',
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
        graduation_date: profile.graduation_date || '',
        major: profile.major || '',
        phone_num: profile.phone_num || '',
        linkedin: profile.linkedin || '',
        bio: profile.bio || '',
        pronouns: profile.pronouns || '',
        discord_username: profile.discord_username || '',
        ubc_student_id: profile.ubc_student_id || ''
      })
    }
  }

  // Parameter name in type definition is required by TypeScript but unused
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const graduationDate = editForm.graduation_date.trim() || null

      const updatedProfile = await profileService.update(user.id, {
        full_name: editForm.full_name.trim() || null,
        graduation_date: graduationDate,
        major: editForm.major.trim() || null,
        phone_num: editForm.phone_num.trim() || null,
        linkedin: editForm.linkedin.trim() || null,
        bio: editForm.bio.trim() || null,
        pronouns: editForm.pronouns.trim() || null,
        discord_username: editForm.discord_username.trim() || null,
        ubc_student_id: editForm.ubc_student_id.trim() || null
      })

      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to update profile:', error)
      // Format error message for better display
      const errorMessage = error instanceof Error
        ? error.message
        : (error && typeof error === 'object' && 'error' in error && error.error && typeof error.error === 'object' && 'message' in error.error && typeof error.error.message === 'string')
        ? error.error.message
        : 'Failed to update profile. Please try again.'
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

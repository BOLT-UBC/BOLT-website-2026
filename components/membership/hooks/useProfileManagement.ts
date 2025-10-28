import { useState } from 'react'
import { authService } from '@/lib/auth'
import { profileService } from '@/lib/database'
import type { UserProfile, EditForm } from '../types'

export function useProfileManagement(user: any, profile: UserProfile | null) {
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [editForm, setEditForm] = useState<EditForm>({
    full_name: '',
    email: '',
    graduation_year: '',
    major: '',
    phone: '',
    linkedin_url: ''
  })

  const initializeForm = () => {
    if (profile && user) {
      setEditForm({
        full_name: profile.full_name || '',
        email: user.email || '',
        graduation_year: profile.graduation_year?.toString() || '',
        major: profile.major || '',
        phone: profile.phone || '',
        linkedin_url: profile.linkedin_url || ''
      })
    }
  }

  const handleUpdateProfile = async (setProfile: (profile: UserProfile) => void) => {
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
      console.error('Failed to update profile:', error)
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

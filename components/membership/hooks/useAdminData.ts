import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserProfile, AdminStats } from '../types'

interface BootcampRegistration {
  id: string
  status: 'pending' | 'confirmed' | 'cancelled'
  registered_at: string
  notes: string | null
  application_responses?: Record<string, unknown>
  profiles: {
    id: string
    email: string
    full_name: string | null
    graduation_year: number | null
    major: string | null
    phone: string | null
    linkedin_url: string | null
  } | null
}

export function useAdminData(profileRole: string | undefined, activeTab: string, roleView: string) {
  const [adminUsers, setAdminUsers] = useState<UserProfile[]>([])
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminSearch, setAdminSearch] = useState('')
  const [adminRoleFilter, setAdminRoleFilter] = useState('')
  const [adminYearFilter, setAdminYearFilter] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')
  const [bulkValue, setBulkValue] = useState('')

  // Bootcamp registrations state
  const [bootcampRegistrations, setBootcampRegistrations] = useState<BootcampRegistration[]>([])
  const [bootcampLoading, setBootcampLoading] = useState(false)
  const [bootcampSearch, setBootcampSearch] = useState('')
  const [bootcampStatusFilter, setBootcampStatusFilter] = useState('')

  const getEffectiveRole = () => (profileRole === 'admin' ? roleView : (profileRole || 'non_member'))

  const loadAdminData = async () => {
    if (profileRole !== 'admin') return

    setAdminLoading(true)
    try {
      // Get current access token for Authorization header
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        // eslint-disable-next-line no-console
        console.error('[loadAdminData] Session error:', sessionError)
      }

      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        // eslint-disable-next-line no-console
        console.error('[loadAdminData] No access token available')
        setAdminUsers([])
        setAdminStats(null)
        return
      }

      // Load users
      const usersResponse = await fetch(`/api/admin/users?search=${adminSearch}&role=${adminRoleFilter}&graduation_year=${adminYearFilter}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!usersResponse.ok) {
        const errorData = await usersResponse.json().catch(() => ({}))
        // eslint-disable-next-line no-console
        console.error('[loadAdminData] Failed to load users:', usersResponse.status, errorData)
        setAdminUsers([])
      } else {
        const usersData = await usersResponse.json()
        setAdminUsers(usersData.users || [])
      }

      // Load statistics
      const statsResponse = await fetch('/api/admin/statistics', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!statsResponse.ok) {
        const errorData = await statsResponse.json().catch(() => ({}))
        // eslint-disable-next-line no-console
        console.error('[loadAdminData] Failed to load statistics:', statsResponse.status, errorData)
        setAdminStats(null)
      } else {
        const statsData = await statsResponse.json()
        setAdminStats(statsData)
      }
    } catch (error) {
      // Failed to load admin data
      // eslint-disable-next-line no-console
      console.error('[loadAdminData] Error:', error)
    } finally {
      setAdminLoading(false)
    }
  }

  const loadStatistics = async () => {
    const effectiveRole = getEffectiveRole()
    if (activeTab === 'statistics' && (effectiveRole === 'admin' || effectiveRole === 'executive_member')) {
      try {
        setAdminLoading(true)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          // eslint-disable-next-line no-console
          console.error('[loadStatistics] Session error:', sessionError)
        }

        const accessToken = sessionData.session?.access_token

        if (!accessToken) {
          // eslint-disable-next-line no-console
          console.error('[loadStatistics] No access token available')
          setAdminStats(null)
          return
        }

        const res = await fetch('/api/admin/statistics', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          // eslint-disable-next-line no-console
          console.error('[loadStatistics] Failed to load statistics:', res.status, errorData)
          setAdminStats(null)
          return
        }
        const data = await res.json()
        setAdminStats(data)
      } catch (error) {
        // Failed to load statistics
        // eslint-disable-next-line no-console
        console.error('[loadStatistics] Error:', error)
        setAdminStats(null)
      } finally {
        setAdminLoading(false)
      }
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

      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token
      const response = await fetch('/api/admin/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
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

  useEffect(() => {
    if (activeTab === 'admin' && getEffectiveRole() === 'admin') {
      loadAdminData()
    }
  }, [activeTab, profileRole, roleView])

  const loadBootcampRegistrations = async () => {
    if (profileRole !== 'admin') return

    setBootcampLoading(true)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        console.error('[loadBootcampRegistrations] No access token available')
        setBootcampRegistrations([])
        return
      }

      const response = await fetch(
        `/api/admin/bootcamp-registrations?search=${bootcampSearch}&status=${bootcampStatusFilter}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[loadBootcampRegistrations] Failed to load registrations:', response.status, errorData)
        setBootcampRegistrations([])
      } else {
        const data = await response.json()
        setBootcampRegistrations(data.registrations || [])
      }
    } catch (error) {
      console.error('[loadBootcampRegistrations] Error:', error)
      setBootcampRegistrations([])
    } finally {
      setBootcampLoading(false)
    }
  }

  const updateRegistrationStatus = async (registrationId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        alert('Not authenticated')
        return
      }

      const response = await fetch('/api/admin/bootcamp-registrations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ registrationId, status }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to update status: ${errorData.error || 'Unknown error'}`)
        return
      }

      // Reload registrations
      await loadBootcampRegistrations()
    } catch (error) {
      console.error('[updateRegistrationStatus] Error:', error)
      alert('Error updating registration status')
    }
  }

  const updateRegistrationNotes = async (registrationId: string, notes: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        alert('Not authenticated')
        return
      }

      const response = await fetch('/api/admin/bootcamp-registrations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ registrationId, notes }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to update notes: ${errorData.error || 'Unknown error'}`)
        return
      }

      // Reload registrations
      await loadBootcampRegistrations()
    } catch (error) {
      console.error('[updateRegistrationNotes] Error:', error)
      alert('Error updating notes')
    }
  }

  const bulkUpdateRegistrationStatus = async (registrationIds: string[], status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        alert('Not authenticated')
        return
      }

      const response = await fetch('/api/admin/bootcamp-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ registrationIds, status }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to update registrations: ${errorData.error || 'Unknown error'}`)
        return
      }

      const result = await response.json()
      alert(`Successfully updated ${result.updated || registrationIds.length} registration(s)`)

      // Reload registrations
      await loadBootcampRegistrations()
    } catch (error) {
      console.error('[bulkUpdateRegistrationStatus] Error:', error)
      alert('Error updating registrations')
    }
  }

  const updateApplicationResponses = async (registrationId: string, responses: Record<string, unknown>) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      if (!accessToken) {
        alert('Not authenticated')
        return
      }

      const response = await fetch('/api/admin/bootcamp-registrations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ registrationId, application_responses: responses }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to update responses: ${errorData.error || 'Unknown error'}`)
        return
      }

      // Reload registrations
      await loadBootcampRegistrations()
    } catch (error) {
      console.error('[updateApplicationResponses] Error:', error)
      alert('Error updating application responses')
    }
  }

  useEffect(() => {
    loadStatistics()
  }, [activeTab, profileRole, roleView])

  useEffect(() => {
    if (activeTab === 'admin' && getEffectiveRole() === 'admin') {
      loadBootcampRegistrations()
    }
  }, [activeTab, profileRole, roleView, bootcampSearch, bootcampStatusFilter])

  return {
    adminUsers,
    adminStats,
    adminLoading,
    adminSearch,
    adminRoleFilter,
    adminYearFilter,
    selectedUsers,
    bulkAction,
    bulkValue,
    setAdminSearch,
    setAdminRoleFilter,
    setAdminYearFilter,
    setSelectedUsers,
    setBulkAction,
    setBulkValue,
    loadAdminData,
    handleBulkUpdate,
    getEffectiveRole,
    // Bootcamp registrations
    bootcampRegistrations,
    bootcampLoading,
    bootcampSearch,
    bootcampStatusFilter,
    setBootcampSearch,
    setBootcampStatusFilter,
    loadBootcampRegistrations,
    updateRegistrationStatus,
    updateRegistrationNotes,
    bulkUpdateRegistrationStatus,
    updateApplicationResponses,
  }
}

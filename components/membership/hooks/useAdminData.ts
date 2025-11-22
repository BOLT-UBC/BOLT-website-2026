import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserProfile, AdminStats } from '../types'

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

  const getEffectiveRole = () => (profileRole === 'admin' ? roleView : (profileRole || 'non_member'))

  const loadAdminData = async () => {
    if (profileRole !== 'admin') return

    setAdminLoading(true)
    try {
      // Get current access token for Authorization header
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      // Load users
      const usersResponse = await fetch(`/api/admin/users?search=${adminSearch}&role=${adminRoleFilter}&graduation_year=${adminYearFilter}`,
        {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
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
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
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
        const { data: sessionData } = await supabase.auth.getSession()
        const accessToken = sessionData.session?.access_token
        const res = await fetch('/api/admin/statistics', {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
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

  useEffect(() => {
    loadStatistics()
  }, [activeTab, profileRole, roleView])

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
    getEffectiveRole
  }
}

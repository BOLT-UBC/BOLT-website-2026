import { useState, useEffect } from 'react'
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

  const loadStatistics = async () => {
    const effectiveRole = getEffectiveRole()
    if (activeTab === 'statistics' && (effectiveRole === 'admin' || effectiveRole === 'executive_member')) {
      try {
        setAdminLoading(true)
        const res = await fetch('/api/admin/statistics')
        if (!res.ok) return
        const data = await res.json()
        setAdminStats(data)
      } catch (error) {
        // Failed to load statistics
        void error
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

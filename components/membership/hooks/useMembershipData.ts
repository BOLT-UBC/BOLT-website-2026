import { useState, useEffect } from 'react'
import { profileService, eventService, teamService } from '@/lib/database'
import type { UserProfile, Event, Team } from '../types'

export function useMembershipData(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)

  const loadUserData = async () => {
    if (!userId) return

    setLoading(true)
    try {
      const [profileData, eventsData, teamsData] = await Promise.all([
        profileService.getById(userId),
        eventService.getAll(),
        teamService.getAll()
      ])

      setProfile(profileData)
      setEvents(eventsData)
      setTeams(teamsData)
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      loadUserData()
    }
  }, [userId])

  return {
    profile,
    events,
    teams,
    loading,
    setProfile,
    loadUserData
  }
}

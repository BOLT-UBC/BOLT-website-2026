import { supabase } from './supabase'
import type { Database } from './supabase'

type Tables = Database['public']['Tables']

// Team service
export const teamService = {
  async getAll() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('team_name')

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('team_id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(team: Tables['teams']['Insert']) {
    const { data, error } = await supabase
      .from('teams')
      .insert(team)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Tables['teams']['Update']) {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('team_id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('team_id', id)

    if (error) throw error
  }
}

// Profile (members table) service
export const profileService = {
  async getAll() {
    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        teams:team_id (
          team_id,
          team_name
        )
      `)
      .order('full_name')

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        teams:team_id (
          team_id,
          team_name
        )
      `)
      .eq('member_id', id)
      .single()

    if (error) throw error
    return data
  },

  async getByTeam(teamId: string) {
    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        teams:team_id (
          team_id,
          team_name
        )
      `)
      .eq('team_id', teamId)
      .order('full_name')

    if (error) throw error
    return data
  },

  async create(profile: Tables['members']['Insert']) {
    const { data, error } = await supabase
      .from('members')
      .insert(profile)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Tables['members']['Update']) {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('member_id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('member_id', id)

    if (error) throw error
  }
}

// Event service
export const eventService = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('event_id', id)
      .single()

    if (error) throw error
    return data
  },

  async getUpcoming() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .eq('registration_open', true)
      .order('event_date', { ascending: true })

    if (error) throw error
    return data
  },

  async create(event: Tables['events']['Insert']) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Tables['events']['Update']) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('event_id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('event_id', id)

    if (error) throw error
  }
}

// Event registration service (backed by event_attendance)
export const eventRegistrationService = {
  async getByEvent(eventId: string) {
    const { data, error } = await supabase
      .from('event_attendance')
      .select(`
        *,
        members:member_id (
          member_id,
          full_name,
          email
        )
      `)
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('event_attendance')
      .select(`
        *,
        events:event_id (
          event_id,
          event_name,
          event_date,
          location
        )
      `)
      .eq('member_id', userId)
      .order('registered_at', { ascending: false })

    if (error) throw error
    return data
  },

  async register(eventId: string, userId: string, notes?: string) {
    const { data, error } = await supabase
      .from('event_attendance')
      .insert({
        event_id: eventId,
        member_id: userId,
        notes
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    const { data, error } = await supabase
      .from('event_attendance')
      .update({ status })
      .eq('registration_id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async cancel(id: string) {
    const { data, error } = await supabase
      .from('event_attendance')
      .update({ status: 'cancelled' })
      .eq('registration_id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

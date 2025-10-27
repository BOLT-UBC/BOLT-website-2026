import { supabase } from './supabase'
import type { Database } from './supabase'

type Tables = Database['public']['Tables']

// Team service
export const teamService = {
  async getAll() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
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
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Profile service
export const profileService = {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        teams:team_id (
          id,
          name
        )
      `)
      .order('full_name')

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        teams:team_id (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getByTeam(teamId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        teams:team_id (
          id,
          name
        )
      `)
      .eq('team_id', teamId)
      .order('full_name')

    if (error) throw error
    return data
  },

  async create(profile: Tables['profiles']['Insert']) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Tables['profiles']['Update']) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Event service
export const eventService = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getUpcoming() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .eq('registration_open', true)
      .order('date', { ascending: true })

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
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Event registration service
export const eventRegistrationService = {
  async getByEvent(eventId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        profiles:user_id (
          id,
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
      .from('event_registrations')
      .select(`
        *,
        events:event_id (
          id,
          name,
          date,
          location
        )
      `)
      .eq('user_id', userId)
      .order('registered_at', { ascending: false })

    if (error) throw error
    return data
  },

  async register(eventId: string, userId: string, notes?: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: userId,
        notes
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    const { data, error } = await supabase
      .from('event_registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async cancel(id: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Partner service
export const partnerService = {
  async getAll() {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('tier', { ascending: false })

    if (error) throw error
    return data
  },

  async getByTier(tier: 'platinum' | 'gold' | 'silver' | 'bronze') {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('tier', tier)
      .order('name')

    if (error) throw error
    return data
  },

  async create(partner: Tables['partners']['Insert']) {
    const { data, error } = await supabase
      .from('partners')
      .insert(partner)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Tables['partners']['Update']) {
    const { data, error } = await supabase
      .from('partners')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}



import { supabase } from './supabase'

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...')

    // Test basic connection
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Database connection failed:', error)
      return false
    }

    console.log('✅ Database connected successfully')
    console.log('Sample data:', data)
    return true
  } catch (error) {
    console.error('❌ Database connection error:', error)
    return false
  }
}

// Test all services
export async function testAllServices() {
  console.log('Testing all database services...')

  try {
    // Test teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .limit(3)

    if (teamsError) throw teamsError
    console.log('✅ Teams service working:', teams?.length, 'teams found')

    // Test events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(3)

    if (eventsError) throw eventsError
    console.log('✅ Events service working:', events?.length, 'events found')

    // Test partners
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('*')
      .limit(3)

    if (partnersError) throw partnersError
    console.log('✅ Partners service working:', partners?.length, 'partners found')

    console.log('🎉 All services working correctly!')
    return true
  } catch (error) {
    console.error('❌ Service test failed:', error)
    return false
  }
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Server-side only
  testDatabaseConnection().then(() => {
    testAllServices()
  })
}

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Simple query to keep Supabase connection alive
    const { data, error } = await supabase
      .from('members')
      .select('member_id')
      .limit(1)

    if (error) {
      console.error('Ping failed:', error)
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database ping failed',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Keep-alive ping successful',
      timestamp: new Date().toISOString(),
      database: 'connected'
    })
  } catch (error) {
    console.error('Ping error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Ping failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Also support HEAD requests for lighter pings
export async function HEAD() {
  try {
    await supabase
      .from('members')
      .select('member_id')
      .limit(1)

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}

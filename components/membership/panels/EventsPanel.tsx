'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EventCard } from '@/components/EventCard'
import { getEventConfig, getPortalEventRoute, eventMonths } from '@/lib/eventConfig'
import { supabase } from '@/lib/supabase'
import { eventRegistrationService } from '@/lib/database'
import type { Event } from '../types'

interface EventsPanelProps {
  events: Event[]
  userId?: string
}

interface UserRegistration {
  registration_id: string
  event_id: string
  status: 'pending' | 'confirmed' | 'cancelled'
  registered_at: string
  events: {
    event_id: string
    event_name: string
    event_date: string | null
    location: string | null
  }
}

export function EventsPanel({ events, userId }: EventsPanelProps) {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<UserRegistration[]>([])
  const [loadingRegistrations, setLoadingRegistrations] = useState(true)

  useEffect(() => {
    const loadRegistrations = async () => {
      if (!userId) {
        setLoadingRegistrations(false)
        return
      }

      try {
        const data = await eventRegistrationService.getByUser(userId)
        setRegistrations(data as UserRegistration[])
      } catch (error) {
        // Silently handle error
        void error
      } finally {
        setLoadingRegistrations(false)
      }
    }

    loadRegistrations()
  }, [userId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-200 border-green-400/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-200 border-red-400/30'
      case 'pending':
      default:
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed'
      case 'cancelled':
        return 'Cancelled'
      case 'pending':
      default:
        return 'Pending'
    }
  }

  const getEventRoute = (eventName: string) => {
    return getPortalEventRoute(eventName)
  }

  return (
    <div className="space-y-6">
      {/* Events List */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Events</h2>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {events.slice(0, 8).map((event) => {
                const config = getEventConfig(event.event_name, event.description || undefined)
                const applicationRoute = getPortalEventRoute(event.event_name)
                const isBootcamp = event.event_name.toLowerCase().includes('bootcamp')
                const learnMoreRoute = isBootcamp ? '/events/bolt-bootcamp' : applicationRoute
                const eventMonth = eventMonths[config.titleAccent]
                const primaryCta = isBootcamp
                ? { label: 'Register Now', href: applicationRoute }
                : undefined
                return (
                <EventCard
                key={event.event_id}
                event={{
                  id: event.event_id,
                  name: event.event_name,
                  description: event.description,
                  date: event.event_date,
                  location: event.location,
                }}
                config={config}
                eventRoute={learnMoreRoute}
                eventMonth={eventMonth}
                isDarkMode={true}
                primaryCta={primaryCta}
                />
            )
            })}
        </div>
        ) : (
          <div className="bg-white/5 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-white/60 text-lg">No upcoming events at the moment</p>
            <p className="text-white/40 text-sm mt-2">Check back soon for exciting events!</p>
          </div>
        )}
      </div>

      {/* Application Manager */}
      {userId && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">My Applications</h2>
          {loadingRegistrations ? (
            <div className="text-center py-4 text-white/70">Loading applications...</div>
          ) : registrations.length > 0 ? (
            <div className="space-y-3">
              {registrations.map((registration) => {
                const eventRoute = getEventRoute(registration.events.event_name)
                return (
                  <div
                    key={registration.registration_id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => router.push(eventRoute)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm mb-1">{registration.events.event_name}</h3>
                        <p className="text-white/60 text-xs">
                          Registered {new Date(registration.registered_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(registration.status)}`}>
                          {getStatusLabel(registration.status)}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(eventRoute)
                          }}
                          className="text-white/70 hover:text-white text-xs font-medium underline"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-white/60 text-sm">
              You haven't registered for any events yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

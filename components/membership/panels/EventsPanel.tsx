'use client'

import React from 'react'
import { EventCard } from '@/components/EventCard'
import { getEventConfig, getEventRoute, eventMonths } from '@/lib/eventConfig'
import type { Event } from '../types'

interface EventsPanelProps {
  events: Event[]
}

export function EventsPanel({ events }: EventsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Events</h2>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-7">
            {events.slice(0, 4).map((event) => {
              const config = getEventConfig(event.name, event.description || undefined)
              const eventRoute = getEventRoute(event.name)
              const eventMonth = eventMonths[config.titleAccent]

              return (
                <EventCard
                  key={event.id}
                  event={event}
                  config={config}
                  eventRoute={eventRoute}
                  eventMonth={eventMonth}
                  isDarkMode={true}
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
    </div>
  )
}

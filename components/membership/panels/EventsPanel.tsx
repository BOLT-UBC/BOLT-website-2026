import React from 'react'
import type { Event } from '../types'

interface EventsPanelProps {
  events: Event[]
}

export function EventsPanel({ events }: EventsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{event.name}</h3>
                {event.description && (
                  <p className="text-white/70 mb-2">{event.description}</p>
                )}
                {event.date && (
                  <p className="text-white/60 text-sm">
                    📅 {new Date(event.date).toLocaleDateString()}
                  </p>
                )}
                {event.location && (
                  <p className="text-white/60 text-sm">
                    📍 {event.location}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-white/60">No events available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  )
}

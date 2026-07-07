'use client'

import React from 'react'

interface TimelineEvent {
  label: string
  date: Date | null
  isComplete: boolean
  isCurrent: boolean
}

interface TimelineProps {
  events: TimelineEvent[]
}

export function Timeline({ events }: TimelineProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'TBA'
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (event: TimelineEvent) => {
    if (event.isComplete) return 'bg-green-500 ring-2 ring-green-400'
    if (event.isCurrent) return 'bg-yellow-500 ring-2 ring-yellow-400'
    return 'bg-gray-500 ring-2 ring-gray-400'
  }

  const getLineColor = (index: number) => {
    if (index === events.length - 1) return ''
    const currentEvent = events[index]

    // If current event is complete, line is green
    if (currentEvent.isComplete) return 'bg-green-500'
    // If current event is current stage, line is yellow
    if (currentEvent.isCurrent) return 'bg-yellow-500'
    // Otherwise gray
    return 'bg-gray-500'
  }

  return (
    <div className="w-full">
      {/* Desktop Timeline */}
      <div className="hidden md:block w-full">
        <div className="relative flex items-start w-full px-2 py-6">
          {events.map((event, index) => (
            <div key={index} className="flex-1 flex flex-col items-center relative">
              {/* Connecting line */}
              {index < events.length - 1 && (
                <div
                  className={`absolute top-3 left-1/2 h-1 ${getLineColor(index)}`}
                  style={{
                    width: 'calc(100% - 2rem)',
                    left: 'calc(50% + 1rem)'
                  }}
                />
              )}

              {/* Event Node */}
              <div className="relative z-10 flex flex-col items-center gap-3 w-full px-2">
                <div
                  className={`w-8 h-8 rounded-full ${getStatusColor(event)} transition-all duration-300 flex items-center justify-center shadow-lg`}
                >
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>

                {/* Label and date */}
                <div className="text-center w-full">
                  <div className="text-sm md:text-base font-semibold text-white mb-2 leading-tight">
                    {event.label}
                  </div>
                  <div className="text-sm md:text-base text-white/80 font-medium">
                    {formatDate(event.date)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden w-full">
        <div className="relative flex flex-col gap-6 px-2 py-4">
          {events.map((event, index) => (
            <div key={index} className="flex items-start gap-4 relative">
              {/* Vertical line */}
              {index < events.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 ${getLineColor(index)}`}
                  style={{ height: 'calc(100% + 1.5rem)' }}
                />
              )}

              {/* Event Node */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full ${getStatusColor(event)} transition-all duration-300 flex items-center justify-center shadow-lg`}
                >
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>
              </div>

              {/* Label and date */}
              <div className="flex-1 pt-1">
                <div className="text-base font-semibold text-white mb-2">
                  {event.label}
                </div>
                <div className="text-base text-white/80 font-medium">
                  {formatDate(event.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

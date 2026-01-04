'use client'

import React, { useState, useEffect } from 'react'
import type { Event, Announcement } from '../types'
import { supabase } from '@/lib/supabase'
import { EventCard } from '@/components/EventCard'
import { getEventConfig, getPortalEventRoute, eventMonths } from '@/lib/eventConfig'

interface HomePanelProps {
  events: Event[]
  onSwitchTab?: (tab: string) => void
}

interface Resource {
  id: string
  title: string
  description: string | null
  link: string
  display_order: number
}

export function HomePanel({ events, onSwitchTab }: HomePanelProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [loadingResources, setLoadingResources] = useState(true)

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const accessToken = sessionData.session?.access_token

        const response = await fetch('/api/announcements', {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        })

        if (response.ok) {
          const result = await response.json()
          setAnnouncements(result.announcements || [])
        }
      } catch (error) {
        // Silently handle error - announcements will just be empty
        void error
      } finally {
        setLoadingAnnouncements(false)
      }
    }

    loadAnnouncements()
  }, [])

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await fetch('/api/resources')
        if (response.ok) {
          const data = await response.json()
          setResources(data.resources || [])
        }
      } catch (error) {
        // Silently handle error
        void error
      } finally {
        setLoadingResources(false)
      }
    }

    loadResources()
  }, [])

  return (
    <div className="space-y-6">
      {/* Announcements and Upcoming Events Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements Section - Left */}
        <div
          onClick={() => onSwitchTab?.('announcements')}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Announcements</h2>
          </div>
          {loadingAnnouncements ? (
            <div className="text-center py-4 text-white/70">Loading announcements...</div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {announcements.map((announcement) => {
                const contentPreview = announcement.content.length > 150
                  ? announcement.content.substring(0, 150) + '...'
                  : announcement.content

                return (
                  <div
                    key={announcement.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedAnnouncement(announcement)
                    }}
                    className={`bg-white/5 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors ${announcement.is_pinned ? 'border-2 border-yellow-400/50' : ''}`}
                  >
                    {announcement.is_pinned && (
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        <span className="text-yellow-400 text-sm font-medium">Pinned</span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-white mb-2">{announcement.title}</h3>
                    <p className="text-white/70 mb-2 whitespace-pre-wrap line-clamp-3">{contentPreview}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-white/70">
              No announcements at the moment. Check back soon!
            </div>
          )}
        </div>

        {/* Upcoming Events Section - Right */}
        <div
          onClick={() => onSwitchTab?.('events')}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
          </div>
          {events.length > 0 ? (
            (() => {
              // Filter to only show upcoming event
              const bootcampEvent = events.find(event =>
                event.name.toLowerCase().includes('bolt bootcamp')
              )

              if (!bootcampEvent) {
                return (
                  <div className="bg-white/5 rounded-lg p-8 text-center">
                    <svg className="w-12 h-12 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-white/60 text-lg">No upcoming events at the moment</p>
                    <p className="text-white/40 text-sm mt-2">Check back soon for exciting events!</p>
                  </div>
                )
              }

              const config = getEventConfig(bootcampEvent.name, bootcampEvent.description || undefined)
              const eventRoute = getPortalEventRoute(bootcampEvent.name)
              const eventMonth = eventMonths[config.titleAccent]

              return (
                <div onClick={(e) => e.stopPropagation()}>
                  <EventCard
                    key={bootcampEvent.id}
                    event={bootcampEvent}
                    config={config}
                    eventRoute={eventRoute}
                    eventMonth={eventMonth}
                    isDarkMode={true}
                  />
                </div>
              )
            })()
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

      {/* Resources Section - Just Titles */}
      <div
        onClick={() => onSwitchTab?.('resources')}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
      >
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 className="text-2xl font-bold text-white">Resources</h2>
        </div>
        {loadingResources ? (
          <div className="text-center py-4 text-white/70 text-sm">Loading resources...</div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resources.map((resource) => (
              <div key={resource.id} className="text-white font-medium">
                {resource.title}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-white/60 text-sm">
            No resources available.
          </div>
        )}
      </div>

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {selectedAnnouncement.is_pinned && (
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span className="text-yellow-400 text-sm font-medium">Pinned</span>
                  </div>
                )}
                <h2 className="text-2xl font-bold text-white mb-3">{selectedAnnouncement.title}</h2>
                <div className="text-white/60 text-sm space-y-1">
                  <p>
                    {new Date(selectedAnnouncement.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })} at {new Date(selectedAnnouncement.created_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                  <p className="font-medium">
                    {(() => {
                      const profile = Array.isArray(selectedAnnouncement.profiles)
                        ? selectedAnnouncement.profiles[0]
                        : selectedAnnouncement.profiles
                      return profile
                        ? `By ${profile.full_name || profile.email}`
                        : selectedAnnouncement.created_by
                          ? `By User ID: ${selectedAnnouncement.created_by.substring(0, 8)}...`
                          : 'By Unknown'
                    })()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-white/70 whitespace-pre-wrap leading-relaxed">
              {selectedAnnouncement.content}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

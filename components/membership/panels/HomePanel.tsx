'use client'

import React, { useState, useEffect } from 'react'
import type { Event, Announcement } from '../types'
import Link from "next/link"; // makes links exist
import { supabase } from '@/lib/supabase'

interface HomePanelProps {
  events: Event[]
}

export function HomePanel({ events }: HomePanelProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

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

  return (
    <div className="space-y-6">
      {/* Announcements Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <h2 className="text-2xl font-bold text-white">Announcements</h2>
        </div>
        {loadingAnnouncements ? (
          <div className="text-center py-4 text-white/70">Loading announcements...</div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`bg-white/5 rounded-lg p-4 ${announcement.is_pinned ? 'border-2 border-yellow-400/50' : ''}`}
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
                <p className="text-white/70 mb-2 whitespace-pre-wrap">{announcement.content}</p>
                <p className="text-white/50 text-sm">
                  {new Date(announcement.created_at).toLocaleDateString()}
                  {announcement.profiles && ` • By ${announcement.profiles.full_name || announcement.profiles.email}`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-white/70">
            No announcements at the moment. Check back soon!
          </div>
        )}
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.length > 0 ? (
            events.slice(0, 6).map((event) => {
              // Map event names to their corresponding page routes
              const getEventRoute = (eventName: string) => {
                const name = eventName.toLowerCase();
                if (name.includes('first byte')) return '/events/first-byte';
                if (name.includes('bolt connect')) return '/events/bolt-connect';
                if (name.includes('bolt circuit')) return '/events/bolt-circuit';
                if (name.includes('bolt bootcamp')) return '/events/bolt-bootcamp';
                return '/events'; // fallback to events page
              };

              return (
                <a
                  key={event.id}
                  href={getEventRoute(event.name)}
                  className="block bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors group"
                >
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {event.name}
                  </h3>
                  {event.description && (
                    <p className="text-white/70 mb-3 text-sm line-clamp-2">{event.description}</p>
                  )}
                  <div className="space-y-2 text-sm text-white/60">
                    {event.date && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                  {event.name.toLowerCase().includes('bolt connect') && (
                    <div className="mt-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Registration Open
                      </span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center text-blue-300 text-sm font-medium group-hover:text-blue-200 transition-colors">
                    Learn More →
                  </div>
                </a>
              );
            })
          ) : (
            <div className="col-span-full bg-white/5 rounded-lg p-8 text-center">
              <svg className="w-12 h-12 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white/60 text-lg">No upcoming events at the moment</p>
              <p className="text-white/40 text-sm mt-2">Check back soon for exciting events!</p>
            </div>
          )}
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 className="text-2xl font-bold text-white">Resources</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Previous Cases</h3>
            </div>
            <p className="text-white/70 mb-3">Access past hackathon and datathon case studies and datasets.</p>
            <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
              View Cases →
            </button>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Assets & Logos</h3>
            </div>
            <p className="text-white/70 mb-3">Download BOLT logos, brand assets, and design resources for your projects.</p>
            <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
              Download Assets →
            </button>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Workshop Materials</h3>
            </div>
            <p className="text-white/70 mb-3">Slides, code samples, and resources from our technical workshops.</p>
            <button className="text-blue-300 hover:text-blue-200 text-sm font-medium">
              Browse Materials →
            </button>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Tech Stack Guides</h3>
            </div>
            <p className="text-white/70 mb-3">Quick-start guides and tutorials for popular technologies and frameworks.</p>
            <Link href="/membership/guides" className="text-blue-300 hover:text-blue-200 text-sm font-medium"
             > Explore Guides →

              </Link>


          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import type { EventConfig } from '@/lib/eventConfig'

interface EventCardProps {
  event: {
    id: string
    name: string
    description?: string | null
    date?: string | null
    location?: string | null
  }
  config: EventConfig
  eventRoute: string
  eventMonth?: string
  isDarkMode?: boolean // For portal vs homepage styling
}

export function EventCard({ event, config, eventRoute, eventMonth, isDarkMode = false }: EventCardProps) {
  const router = useRouter()

  return (
    <div
      className={`${isDarkMode ? 'bg-white/20' : 'bg-white/20'} backdrop-blur-lg rounded-xl p-3 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group active:scale-95 active:shadow-xl ${isDarkMode ? 'active:bg-white/30' : 'active:bg-white/30'}`}
      onClick={() => router.push(eventRoute)}
    >
      <div
        className={`relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-3 ${config.glow}`}
        style={{
          backgroundImage: `url(${config.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-80`} />
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35)_0%,_transparent_55%)]" />
        {/* Content layer */}
        <div className="relative z-10 flex flex-col justify-between p-4 sm:p-5 h-full">
          <div>
            <p className="font-inter text-[10px] uppercase tracking-[0.35em] text-white/65">Inside the event</p>
            <h3 className="mt-2 font-inter text-lg sm:text-xl font-bold text-white/95">
              {config.titleAccent}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-white/85">
              {config.subtitle}
            </p>
          </div>
          <div
            className={`${config.accentBg} ${config.accentBorder} border backdrop-blur-md rounded-full inline-flex items-center px-3 py-1 text-[11px] sm:text-xs text-white/90 font-medium self-start`}
          >
            {config.footer}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 border border-white/15 rounded-xl" />
      </div>
      <div className={`space-y-1.5 mt-4 mx-4 ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-gray-900'} transition-colors duration-300`}>
        <h3 className={`font-inter ${isDarkMode ? 'text-white' : 'text-gray-800'} font-bold text-sm`}>{event.name}</h3>
        {event.description && (
          <p className={`font-inter ${isDarkMode ? 'text-white/70' : 'text-gray-700'} text-xs leading-relaxed line-clamp-3`}>
            {event.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {eventMonth && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
              {eventMonth}
            </span>
          )}
        </div>
        <div className="flex justify-center pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(eventRoute)
            }}
            className="bg-black/20 backdrop-blur-lg hover:bg-black/30 text-white font-inter font-semibold px-3 py-1.5 text-xs rounded-full transition-all duration-200 border border-white/20 flex items-center gap-1.5 group active:scale-95 active:bg-black/40 active:shadow-lg"
          >
            Learn More
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-active:translate-x-0.25 group-active:-translate-y-0.25 group-active:scale-105"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}


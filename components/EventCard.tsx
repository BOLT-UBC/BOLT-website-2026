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
      className={`${isDarkMode ? 'bg-white/20' : 'bg-white/20'} backdrop-blur-lg rounded-lg p-1.5 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer group active:scale-[0.98] ${isDarkMode ? 'active:bg-white/30' : 'active:bg-white/30'}`}
      onClick={() => router.push(eventRoute)}
    >
      <div
        className={`relative w-full aspect-[16/8] overflow-hidden rounded-md mb-1.5 ${config.glow}`}
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
        <div className="relative z-10 flex flex-col justify-between p-2 h-full">
          <div>
            <p className="font-inter text-[8px] uppercase tracking-[0.25em] text-white/65">Inside the event</p>
            <h3 className="mt-0.5 font-inter text-xs font-bold text-white/95">
              {config.titleAccent}
            </h3>
            <p className="mt-0.5 text-[9px] text-white/85">
              {config.subtitle}
            </p>
          </div>
          <div
            className={`${config.accentBg} ${config.accentBorder} border backdrop-blur-md rounded-full inline-flex items-center px-1.5 py-0.5 text-[9px] text-white/90 font-medium self-start`}
          >
            {config.footer}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 border border-white/15 rounded-md" />
      </div>
      <div className={`space-y-0.5 mt-1.5 mx-1.5 ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-gray-900'} transition-colors duration-300`}>
        <h3 className={`font-inter ${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold text-[11px]`}>{event.name}</h3>
        {event.description && (
          <p className={`font-inter ${isDarkMode ? 'text-white/70' : 'text-gray-700'} text-[9px] leading-relaxed line-clamp-2`}>
            {event.description}
          </p>
        )}
        <div className="flex justify-center pt-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(eventRoute)
            }}
            className="bg-black/20 backdrop-blur-lg hover:bg-black/30 text-white font-inter font-semibold px-2 py-0.5 text-[9px] rounded-full transition-all duration-200 border border-white/20 flex items-center gap-1 group active:scale-95"
          >
            Learn More
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}


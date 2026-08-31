export interface EventConfig {
  titleAccent: string
  subtitle: string
  footer: string
  backgroundImage: string
  gradient: string
  accentBg: string
  accentBorder: string
  glow: string
}

export const eventPreviewConfigs: Record<string, EventConfig> = {
  'first byte': {
    titleAccent: "First Byte",
    subtitle: "Hands-on workshops",
    footer: "Beginner friendly",
    backgroundImage: "/events/byte-2.png",
    gradient: "from-[#321070] via-[#482a9f] to-[#221247]",
    accentBg: "bg-white/15",
    accentBorder: "border-white/10",
    glow: "shadow-[0_0_25px_rgba(123,97,255,0.35)]"
  },
  'bolt connect': {
    titleAccent: "BOLT Connect",
    subtitle: "Networking with a twist",
    footer: "Industry mixers",
    backgroundImage: "/partners/mastercard.webp",
    gradient: "from-[#2b0b3d] via-[#46198f] to-[#a53802]",
    accentBg: "bg-white/10",
    accentBorder: "border-white/15",
    glow: "shadow-[0_0_25px_rgba(255,136,76,0.35)]"
  },
  'fin-tech night': {
    titleAccent: "Fin-Tech Night",
    subtitle: "Evening of fintech insights",
    footer: "Industry networking",
    backgroundImage: "/events/fin-tech.webp",
    gradient: "from-[#03111f] via-[#073455] to-[#0b5b86]",
    accentBg: "bg-white/12",
    accentBorder: "border-white/15",
    glow: "shadow-[0_0_25px_rgba(37,153,255,0.3)]"
  },
  'bolt bootcamp': {
    titleAccent: "BOLT Bootcamp",
    subtitle: "Immersive learning sprint",
    footer: "Flagship program",
    backgroundImage: "/events/bootcamp.webp",
    gradient: "from-[#12002c] via-[#2d0f82] to-[#015c92]",
    accentBg: "bg-white/12",
    accentBorder: "border-white/15",
    glow: "shadow-[0_0_25px_rgba(134,201,255,0.25)]"
  },
  'byte university': {
   titleAccent: "Byte University",
   subtitle: "Your subtitle here",
   footer: "Your category here",
   backgroundImage: "/events/byte-university.webp",
   gradient: "from-[#321070] via-[#482a9f] to-[#221247]",
   accentBg: "bg-white/15",
   accentBorder: "border-white/10",
   glow: "shadow-[0_0_25px_rgba(123,97,255,0.35)]"
 },
}

export const eventMonths: Record<string, string> = {
  "First Byte": "October",
  "BOLT Connect": "November",
  "BOLT Circuit": "March",
  "BOLT Bootcamp": "March",
  "Byte University": "November"
}

export function getEventConfig(eventName: string, eventDescription?: string): EventConfig {
  const name = eventName.toLowerCase()
  if (name.includes('first byte')) return eventPreviewConfigs['first byte']
  if (name.includes('bolt connect')) return eventPreviewConfigs['bolt connect']
  if (name.includes('fin-tech night')) return eventPreviewConfigs['fin-tech night']
  if (name.includes('bolt bootcamp')) return eventPreviewConfigs['bolt bootcamp']
  if (name.includes('byte university')) return eventPreviewConfigs['byte university']
  // Default fallback
  return {
    titleAccent: eventName,
    subtitle: eventDescription || "Join us for this event",
    footer: "Upcoming",
    backgroundImage: "/events/byte.png",
    gradient: "from-[#321070] via-[#482a9f] to-[#221247]",
    accentBg: "bg-white/15",
    accentBorder: "border-white/10",
    glow: "shadow-[0_0_25px_rgba(123,97,255,0.35)]"
  }
}

export function getEventRoute(eventName: string): string {
  const name = eventName.toLowerCase()
  if (name.includes('first byte')) return '/events/first-byte'
  if (name.includes('bolt connect')) return '/events/bolt-connect'
  if (name.includes('fin-tech night')) return '/events/fin-tech-night'
  if (name.includes('bolt bootcamp')) return '/events/bolt-bootcamp'
  if (name.includes('byte university')) return '/events/byte-university'
  return '/events'
}

export function getPortalEventRoute(eventName: string) {
    switch (eventName) {
      case 'BOLT Bootcamp':
        return '/membership/events/bolt-bootcamp'
      default:
        // portal can reuse the same public routes for other events
        return getEventRoute(eventName)
    }
  }

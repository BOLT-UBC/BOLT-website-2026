"use client";

import { useRouter } from "next/navigation";
import { Event, EventsData } from "../types/types";

// Import with type assertion for JSON data
import eventsDataJson from "../lib/events.json";
const eventsData = eventsDataJson as EventsData;

const Events: React.FC = () => {
  const EVENTS: Event[] = eventsData.events;
  const router = useRouter();

  const eventLinks = [
    "/events/first-byte",
    "/events/bolt-connect",
    "/events/bolt-circuit",
    "/events/bolt-bootcamp"
  ];

  const eventPreviewConfigs = [
    {
      titleAccent: "First Byte",
      subtitle: "Hands-on workshops",
      footer: "Beginner friendly",
      gradient: "from-[#321070] via-[#482a9f] to-[#221247]",
      accentBg: "bg-white/15",
      accentBorder: "border-white/10",
      glow: "shadow-[0_0_25px_rgba(123,97,255,0.35)]"
    },
    {
      titleAccent: "BOLT Connect",
      subtitle: "Networking with a twist",
      footer: "Industry mixers",
      gradient: "from-[#2b0b3d] via-[#46198f] to-[#a53802]",
      accentBg: "bg-white/10",
      accentBorder: "border-white/15",
      glow: "shadow-[0_0_25px_rgba(255,136,76,0.35)]"
    },
    {
      titleAccent: "BOLT Circuit",
      subtitle: "Analytics case competition",
      footer: "Team-based challenges",
      gradient: "from-[#03111f] via-[#073455] to-[#0b5b86]",
      accentBg: "bg-white/12",
      accentBorder: "border-white/15",
      glow: "shadow-[0_0_25px_rgba(37,153,255,0.3)]"
    },
    {
      titleAccent: "BOLT Bootcamp",
      subtitle: "Immersive learning sprint",
      footer: "Flagship program",
      gradient: "from-[#12002c] via-[#2d0f82] to-[#015c92]",
      accentBg: "bg-white/12",
      accentBorder: "border-white/15",
      glow: "shadow-[0_0_25px_rgba(134,201,255,0.25)]"
    }
  ];

  const eventMonths = {
    "First Byte": "October",
    "BOLT Connect": "November",
    "BOLT Circuit": "March",
    "BOLT Bootcamp": "April"
  };

  return (
    <div className="w-full py-16 md:py-20 bg-gradient-to-br from-[#f8f7f3] to-[#f0ede7]" id="Events">
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-6 md:px-8">
        <div className="mb-6 md:mb-8">
          <h2 className="font-inter text-sm font-normal text-gray-600 mb-2 lowercase italic">Events</h2>
          <h1 className="font-inter text-2xl sm:text-3xl font-bold text-black mb-4 md:mb-6 leading-tight">Our Events</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-7">
          {EVENTS.slice(0, 4).map((event, index) => {
            const eventDescriptions = [
              "An introductory workshop series for beginners covering fundamental data analysis tools, Excel, SQL, and data visualization basics.",
              "Connect with like-minded data enthusiasts, industry professionals, and alumni. Network and discover career opportunities in analytics.",
              "An intensive case competition where teams tackle real-world business problems using data analytics and present solutions to industry judges.",
              "Our flagship bootcamp introducing students to data analytics through hands-on projects and mentorship from industry professionals."
            ];

            return (
            <div
              key={index}
              className="bg-white/20 backdrop-blur-lg rounded-xl p-3 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group active:scale-95 active:shadow-xl active:bg-white/30"
              onClick={() => router.push(eventLinks[index])}
            >
              <div
                className={`relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-3 bg-gradient-to-br ${eventPreviewConfigs[index].gradient} ${eventPreviewConfigs[index].glow}`}
              >
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35)_0%,_transparent_55%)]" />
                <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
                  <div>
                    <p className="font-inter text-[10px] uppercase tracking-[0.35em] text-white/65">Inside the event</p>
                    <h3 className="mt-2 font-inter text-lg sm:text-xl font-bold text-white/95">
                      {eventPreviewConfigs[index].titleAccent}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-white/85">
                      {eventPreviewConfigs[index].subtitle}
                    </p>
                  </div>
                  <div
                    className={`${eventPreviewConfigs[index].accentBg} ${eventPreviewConfigs[index].accentBorder} border backdrop-blur-md rounded-full inline-flex items-center px-3 py-1 text-[11px] sm:text-xs text-white/90 font-medium self-start`}
                  >
                    {eventPreviewConfigs[index].footer}
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 border border-white/15 rounded-xl" />
              </div>
              <div className="space-y-1.5 mt-4 mx-4 group-hover:text-gray-900 transition-colors duration-300">
                <h3 className="font-inter text-gray-800 font-bold text-sm">{event.name}</h3>
                <p className="font-inter text-gray-700 text-xs leading-relaxed line-clamp-3">
                  {eventDescriptions[index]}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    {eventMonths[event.name as keyof typeof eventMonths]}
                  </span>
                </div>
                <div className="flex justify-center pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(eventLinks[index]);
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
          )})}
        </div>

        {/* View More Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/events')}
            className="bg-black/20 backdrop-blur-lg text-white font-inter font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:bg-black/30 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 flex items-center gap-2 group"
          >
            View More
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Events;

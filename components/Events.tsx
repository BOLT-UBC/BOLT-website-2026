"use client";

import { useRouter } from "next/navigation";
import { Event, EventsData } from "../types/types";
import { EventCard } from "./EventCard";
import { getEventConfig, getEventRoute, eventMonths } from "../lib/eventConfig";

// Import with type assertion for JSON data
import eventsDataJson from "../lib/events.json";
const eventsData = eventsDataJson as EventsData;

const Events: React.FC = () => {
  const EVENTS: Event[] = eventsData.events;
  const router = useRouter();

  const eventDescriptions = [
    "An introductory workshop series for beginners covering fundamental data analysis tools, Excel, SQL, and data visualization basics.",
    "Connect with like-minded data enthusiasts, industry professionals, and alumni. Network and discover career opportunities in analytics.",
    "An intensive case competition where teams tackle real-world business problems using data analytics and present solutions to industry judges.",
    "Our flagship bootcamp introducing students to data analytics through hands-on projects and mentorship from industry professionals."
  ];

  return (
    <div className="w-full py-16 md:py-20 bg-gradient-to-br from-[#f8f7f3] to-[#f0ede7]" id="Events">
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-6 md:px-8">
        <div className="mb-6 md:mb-8">
          <h1 className="font-inter text-2xl sm:text-3xl font-bold text-black mb-4 md:mb-6 leading-tight">Our Events</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-7">
          {EVENTS.slice(0, 4).map((event, index) => {
            const config = getEventConfig(event.name)
            const eventRoute = getEventRoute(event.name)
            const eventMonth = eventMonths[config.titleAccent]

            return (
              <EventCard
                key={event.name}
                event={{ ...event, id: event.name, description: eventDescriptions[index] }}
                config={config}
                eventRoute={eventRoute}
                eventMonth={eventMonth}
                isDarkMode={false}
              />
            )
          })}
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

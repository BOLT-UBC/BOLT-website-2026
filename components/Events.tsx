"use client";

import { useRouter } from "next/navigation";
import { Event, EventsData } from "../types/types";
import { getEventImageUrl } from "../lib/assets";

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
              "Our flagship bootcamp introducing students to data analytics through hands-on projects and mentorship from industry professionals.",
              "Connect with like-minded data enthusiasts, industry professionals, and alumni. Network and discover career opportunities in analytics.",
              "An intensive case competition where teams tackle real-world business problems using data analytics and present solutions to industry judges.",
              "An introductory workshop series for beginners covering fundamental data analysis tools, Excel, SQL, and data visualization basics."
            ];

            return (
            <div
              key={index}
              className="bg-white/20 backdrop-blur-lg rounded-xl p-3 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group active:scale-95 active:shadow-xl active:bg-white/30"
              onClick={() => router.push(eventLinks[index])}
            >
              <div className="w-56 h-56 overflow-hidden rounded-lg mb-2 mx-auto">
                <img
                  src={getEventImageUrl(event.image)}
                  alt={`${event.name} - BOLT UBC data analytics event`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="338"
                />
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
      </div>
    </div>
  );
};

export default Events;

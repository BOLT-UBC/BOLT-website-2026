"use client";

import { useEffect } from "react";
import { Event, EventsData } from "../../types/types";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { EventCard } from "../../components/EventCard";
import { getEventConfig, getEventRoute, eventMonths } from "../../lib/eventConfig";

// Import with type assertion for JSON data
import eventsDataJson from "../../lib/events.json";
const eventsData = eventsDataJson as EventsData;

export default function EventsPage() {
  const EVENTS: Event[] = eventsData.events;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const eventDescriptions = [
    "An introductory workshop series for beginners covering fundamental data analysis tools, Excel, SQL, and data visualization basics.",
    "Connect with like-minded data enthusiasts, industry professionals, and alumni. Network and discover career opportunities in analytics.",
    "An intensive case competition where teams tackle real-world business problems using data analytics and present solutions to industry judges.",
    "Our flagship bootcamp introducing students to data analytics through hands-on projects and mentorship from industry professionals."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f3] to-[#f0ede7]">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h1 className="font-inter text-3xl md:text-4xl font-bold text-black mb-4">
              Our Events
            </h1>
            <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
              Discover all the exciting events and programs BOLT UBC has to offer
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-7">
            {EVENTS.map((event, index) => {
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
        </div>
      </div>

      <Footer />
    </div>
  );
}


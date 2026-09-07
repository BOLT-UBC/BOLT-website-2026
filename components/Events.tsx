"use client";

import { useRouter } from "next/navigation";
import { Event, EventsData } from "../types/types";
import { EventCard } from "./EventCard";

import {
  getEventConfig,
  getEventRoute,
  eventMonths,
} from "../lib/eventConfig";

import eventsDataJson from "../lib/events.json";

const eventsData = eventsDataJson as EventsData;

const Events: React.FC = () => {
  const EVENTS: Event[] = eventsData.events;

  const router = useRouter();

  const eventDescriptions = [
    "An introductory workshop series for beginners covering fundamental data analysis tools, Excel, SQL, and data visualization basics.",

    "Connect with like-minded data enthusiasts, industry professionals, and alumni. Network and discover career opportunities in analytics.",

    "An intensive case competition where teams tackle real-world business problems using data analytics and present solutions to industry judges.",

    "Our flagship bootcamp introducing students to data analytics through hands-on projects and mentorship from industry professionals.",
  ];

  return (
    <section
      id="Events"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#07020f]
        pb-20
        pt-10
        md:pb-24
        md:pt-14
      "
    >
      {/* ===================================================== */}
      {/* COSMIC BACKGROUND */}
      {/* ===================================================== */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 60% 60% at 50% 45%,
              rgba(108, 42, 220, 0.24),
              transparent 68%
            ),
            radial-gradient(
              ellipse 40% 40% at 90% 20%,
              rgba(145, 65, 255, 0.14),
              transparent 70%
            ),
            radial-gradient(
              ellipse 40% 35% at 10% 85%,
              rgba(90, 35, 190, 0.12),
              transparent 70%
            ),
            #07020f
          `,
        }}
      />

      {/* ===================================================== */}
      {/* STARS */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-40
        "
        style={{
          backgroundImage: `
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.9) 1px,
              transparent 1.5px
            ),
            radial-gradient(
              circle,
              rgba(190, 120, 255, 0.7) 1px,
              transparent 1.5px
            )
          `,
          backgroundSize: "180px 180px, 260px 260px",
          backgroundPosition: "20px 30px, 90px 120px",
        }}
      />

      {/* ===================================================== */}
      {/* PURPLE GLOW */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[35%]
          h-[500px]
          w-[800px]
          -translate-x-1/2
          rounded-full
          bg-purple-700/10
          blur-[120px]
        "
      />

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-6
          md:px-10
        "
      >
        {/* ================================================= */}
        {/* SECTION HEADING */}
        {/* ================================================= */}

        <div className="mb-10 md:mb-12">
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.28em]
              text-purple-300
              sm:text-sm
            "
          >
            Upcoming
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-bold
              tracking-[-0.04em]
              text-white
              sm:text-5xl
            "
          >
            Our Events
          </h2>

          <div
            className="
              mt-5
              h-px
              w-24
              bg-gradient-to-r
              from-purple-500
              to-transparent
            "
          />
        </div>

        {/* ================================================= */}
        {/* EVENTS GRID */}
        {/* ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:gap-7
          "
        >
          {EVENTS.slice(0, 4).map((event, index) => {
            const config = getEventConfig(event.name);

            const eventRoute = getEventRoute(
              event.name
            );

            const eventMonth =
              eventMonths[config.titleAccent];

            return (
              <EventCard
                key={event.name}
                event={{
                  ...event,
                  id: event.name,
                  description: eventDescriptions[index],
                }}
                config={config}
                eventRoute={eventRoute}
                eventMonth={eventMonth}
                isDarkMode={true}
              />
            );
          })}
        </div>

        {/* ================================================= */}
        {/* VIEW MORE */}
        {/* ================================================= */}

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/events")}
            className="
              group
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-white/[0.04]
              px-7
              py-3
              text-sm
              font-semibold
              text-white
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-purple-400/40
              hover:bg-purple-500/10
              hover:shadow-[0_0_30px_rgba(168,85,247,0.18)]
            "
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
              className="
                transition-transform
                duration-200
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            >
              <path d="M7 17L17 7" />
              <path d="M17 7H7" />
              <path d="M17 7V17" />
            </svg>
          </button>
        </div>
      </div>

      {/* ===================================================== */}
      {/* BOTTOM FADE */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-24
          bg-gradient-to-t
          from-[#07020f]
          to-transparent
        "
      />
    </section>
  );
};

export default Events;
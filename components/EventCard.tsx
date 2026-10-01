"use client";

import { useRouter } from "next/navigation";
import type { EventConfig } from "@/lib/eventConfig";

type PrimaryCta = {
  label: string;
  href: string;
  disabled?: boolean;
};

interface EventCardProps {
  event: {
    id: string;
    name: string;
    description?: string | null;
    date?: string | null;
    location?: string | null;
  };
  config: EventConfig;
  eventRoute: string;
  eventMonth?: string;
  isDarkMode?: boolean;
  primaryCta?: PrimaryCta;
}

export function EventCard({
  event,
  config,
  eventRoute,
  eventMonth,
  isDarkMode = false,
  primaryCta,
}: EventCardProps) {
  const router = useRouter();

  return (
    <div
      className={`
        group
        cursor-pointer
        rounded-2xl
        border
        border-white/10
        bg-white/[0.06]
        backdrop-blur-lg
        p-1.5
        shadow-[0_18px_48px_rgba(18,4,58,0.35)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-purple-400/30
        hover:bg-white/[0.09]
        hover:shadow-[0_20px_55px_rgba(90,40,180,0.35)]
        active:scale-[0.98]
      `}
      onClick={() => router.push(eventRoute)}
    >
      {/* Event Image (clean, no overlay text) */}
      <div
        className={`
          relative
          w-full
          aspect-[16/8]
          overflow-hidden
          rounded-xl
          mb-2
          ${config.glow}
        `}
        style={{
          backgroundImage: `url(${config.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Light gradient tint. Raise opacity (e.g. opacity-60) for a stronger purple tint. */}
        <div
          className={`
            absolute
            inset-0
            bg-gradient-to-br
            ${config.gradient}
            opacity-30
          `}
        />

        {/* Image Border */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-xl
            border
            border-white/15
          "
        />
      </div>

      {/* Event Information */}
      <div
        className={`
          mx-1.5
          mt-2
          space-y-1.5
          pb-1
          transition-colors
          duration-300
          ${
            isDarkMode
              ? "group-hover:text-white"
              : "group-hover:text-gray-900"
          }
        `}
      >
        {/* Event Name (only place the name appears) */}
        <h3
          className={`
            font-inter
            text-xl
            font-bold
            leading-tight
            ${
              isDarkMode
                ? "text-white"
                : "text-gray-800"
            }
          `}
        >
          {event.name}
        </h3>

        {/* Event Description */}
        {event.description && (
          <p
            className={`
              font-inter
              line-clamp-2
              text-xs
              leading-relaxed
              ${
                isDarkMode
                  ? "text-white/70"
                  : "text-gray-700"
              }
            `}
          >
            {event.description}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-2 pt-1">
          {/* Primary CTA */}
          {primaryCta ? (
            <button
              onClick={(e) => {
                e.stopPropagation();

                if (!primaryCta.disabled) {
                  router.push(primaryCta.href);
                }
              }}
              className={`
                group
                flex
                items-center
                gap-1
                rounded-full
                border
                border-white/20
                bg-white/5
                px-4
                py-1.5
                font-inter
                text-xs
                font-semibold
                text-white
                backdrop-blur-lg
                transition-all
                duration-200
                hover:border-purple-400/40
                hover:bg-purple-500/15
                hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]
                active:scale-95
                ${
                  primaryCta.disabled
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              `}
              aria-disabled={
                primaryCta.disabled ? true : undefined
              }
            >
              {primaryCta.label}
            </button>
          ) : null}

          {/* Learn More */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(eventRoute);
            }}
            className="
              group
              flex
              items-center
              gap-1
              rounded-full
              border
              border-white/20
              bg-white/5
              px-4
              py-1.5
              font-inter
              text-xs
              font-semibold
              text-white
              backdrop-blur-lg
              transition-all
              duration-200
              hover:border-purple-400/40
              hover:bg-purple-500/15
              hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]
              active:scale-95
            "
          >
            Learn More

            <svg
              width="10"
              height="10"
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
              "
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
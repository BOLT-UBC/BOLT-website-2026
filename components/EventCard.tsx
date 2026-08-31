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
      {/* Event Image */}
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
        {/* Main Gradient Overlay */}
        <div
          className={`
            absolute
            inset-0
            bg-gradient-to-br
            ${config.gradient}
            opacity-80
          `}
        />

        {/* Radial Highlight */}
        <div
          className="
            absolute
            inset-0
            opacity-40
            bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35)_0%,_transparent_55%)]
          "
        />

        {/* Event Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-3">
          <div>
            <p
              className="
                font-inter
                text-[8px]
                uppercase
                tracking-[0.25em]
                text-white/65
              "
            >
              Inside the event
            </p>

            <h3
              className="
                mt-0.5
                font-inter
                text-xs
                font-bold
                text-white
              "
            >
              {config.titleAccent}
            </h3>

            <p className="mt-0.5 text-[9px] text-white/85">
              {config.subtitle}
            </p>
          </div>

          {/* Event Tag */}
          <div
            className={`
              ${config.accentBg}
              ${config.accentBorder}
              inline-flex
              items-center
              self-start
              rounded-full
              border
              px-2
              py-0.5
              text-[9px]
              font-medium
              text-white/90
              backdrop-blur-md
            `}
          >
            {config.footer}
          </div>
        </div>

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
          space-y-1
          transition-colors
          duration-300
          ${
            isDarkMode
              ? "group-hover:text-white"
              : "group-hover:text-gray-900"
          }
        `}
      >
        {/* Event Name */}
        <h3
          className={`
            font-inter
            text-[12px]
            font-semibold
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
              text-[9px]
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
                px-3
                py-1
                font-inter
                text-[10px]
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
              px-3
              py-1
              font-inter
              text-[10px]
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
              width="8"
              height="8"
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
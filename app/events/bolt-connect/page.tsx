"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import EventTimeline from "@/components/EventTimeline";

const photos = [
  {
    src: "/images/Presenters.webp",
    alt: "Presenters",
  },
];

function EventGallery({
  photos,
  instaURL,
}: {
  photos: { src: string; alt?: string }[];
  instaURL: string;
}) {
  const hero = photos[0];

  return (
    <section className="font-inter w-full space-y-6">
      <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5">
        <Image
          src={hero.src}
          alt={hero.alt ?? ""}
          className="w-full h-auto max-h-[420px] object-cover transition-transform duration-300 hover:scale-[1.02]"
          width={800}
          height={600}
        />

        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.35)]" />
      </div>

      <div>
        <a
          href="https://www.instagram.com/bolt.ubc/"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center font-semibold text-sm sm:text-base lg:text-lg"
        >
          <span className="relative px-5 py-2 rounded-full text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc] shadow-[0_0_18px_rgba(106,17,203,.35),0_0_34px_rgba(37,117,252,.25)] transition-all duration-200 hover:shadow-[0_0_26px_rgba(106,17,203,.55),0_0_48px_rgba(37,117,252,.35)] hover:-translate-y-0.5">
            Meet the Presenters
          </span>
        </a>
      </div>
    </section>
  );
}

export default function BoltConnectPage() {
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const agenda = [
    {
      id: 1,
      title: "Panel Discussion",
      time: "Main Room",
      description: [
        "Hear directly from industry professionals about their career paths and insights into the featured sector.",
      ],
    },
    {
      id: 2,
      title: "Breakout Sessions",
      time: "ANGU 037 / 039 / 234 / 235",
      description: [
        "Join small-group breakout activities designed to spark deeper conversations with professionals.",
      ],
    },
    {
      id: 3,
      title: "Open Networking",
      time: "Main Room",
      description: [
        "Connect with panelists, alumni, and fellow students in an open networking session to close out the night.",
      ],
    },
  ];

  const timeline = [
    {
      name: "Registration Opens",
      date: "TBA",
      dateISO: "2026-10-15",
      description: "RSVP for BOLT Connect through the membership portal.",
    },
    {
      name: "Registration Closes",
      date: "TBA",
      dateISO: "2026-11-04",
      description: "Deadline to reserve your spot for BOLT Connect.",
    },
    {
      name: "BOLT Connect",
      date: "Nov 7",
      dateISO: "2026-11-07",
      description: "Panel discussion, breakout sessions, and open networking.",
    },
  ];

  const sponsors = [{ name: "TBA", image: "/images/Logo.webp" }];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07001d] via-[#12053a] to-[#1c1041] text-white selection:bg-purple-500/30">
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-6xl space-y-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-start">
            
            {/* LEFT SIDE */}
            <div className="space-y-6">
              <header className="space-y-4">
                <h1 className="font-inter font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight">
                  BOLT{" "}
                  <span className="font-extrabold tracking-widest bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent animate-glint">
                    CONNECT
                  </span>
                </h1>
              </header>

              {/* ABOUT SECTION */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold">
                    About BOLT Connect
                  </h3>

                  <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                </div>

                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-white/85 max-w-2xl">
                  An industry-focused networking event centered around a
                  featured company or sector. The event will include a panel
                  discussion with industry professionals, structured
                  small-group breakout activities, and open networking to help
                  students build meaningful professional connections.
                </p>
              </section>

              {/* EVENT SUMMARY */}
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base shadow-[0_18px_48px_rgba(70,25,143,0.25)]">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">
                    Experience Level
                  </span>

                  <span className="text-white font-semibold">
                    All Levels
                  </span>
                </div>

                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base shadow-[0_18px_48px_rgba(70,25,143,0.25)]">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">
                    Format
                  </span>

                  <span className="text-white font-semibold">
                    Panel + Networking
                  </span>
                </div>

                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base shadow-[0_18px_48px_rgba(70,25,143,0.25)]">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">
                    Duration
                  </span>

                  <span className="text-white font-semibold">
                    1 Evening
                  </span>
                </div>
              </div>

              {/* TIMELINE */}
              <EventTimeline timeline={timeline} />

              {/* AGENDA SECTION */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold">
                    Evening Agenda
                  </h3>

                  <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                </div>

                <div className="grid gap-6">
                  {agenda.map((w) => (
                    <div
                      key={w.id}
                      className="group relative rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-6 transition-all hover:bg-white/[0.08] hover:translate-x-1"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          {w.id}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-baseline gap-3 mb-3">
                            <h4 className="text-xl font-bold text-white">
                              {w.title}
                            </h4>

                            <span className="text-sm font-medium text-purple-400/80 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">
                              {w.time}
                            </span>
                          </div>

                          <ul className="space-y-2">
                            {w.description.map((point, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-white/70 text-sm leading-relaxed"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />

                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT SIDE */}
            <aside className="top-32 space-y-4">
  {/* BOLT Connect Image */}
  <div className="relative w-full flex items-center justify-center">
    <Image
      src="/events/bolt-connect-new.png"
      alt="BOLT Connect"
      width={900}
      height={900}
      priority
      className={`
        relative z-10
        w-[90%]
        h-auto
        object-contain
        drop-shadow-[0_40px_80px_rgba(18,4,58,0.55)]
        transition-transform
        duration-700
        ease-out
        ${isLaunching ? "-translate-y-4" : "translate-y-0"}
      `}
    />

    {/* Launch Fire - does NOT take up layout space */}
    <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 overflow-hidden z-0">
      <Image
        src="/events/launch.webp"
        alt="Launch Fire"
        width={900}
        height={400}
        className={`
          w-full
          h-full
          object-cover
          object-bottom
          transition-all
          duration-700
          ease-out
          ${
            isLaunching
              ? "translate-y-0 opacity-100 blur-none"
              : "translate-y-24 opacity-0 blur-sm"
          }
        `}
      />
    </div>
  </div>

  {/* RSVP Button */}
  <div className="px-6 pt-0 pb-2">
    <a
      href="/membership/events/bolt-connect"
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setIsLaunching(true)}
      onMouseLeave={() => setIsLaunching(false)}
      className="group relative flex w-full items-center justify-center rounded-xl bg-[#07001e] py-4 transition-all duration-300 border border-white/20 hover:border-white/50 hover:bg-[#260101] overflow-hidden shadow-[0_18px_48px_rgba(70,25,143,0.25)]"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)]" />

      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <span className="relative z-10 font-bold text-white tracking-widest uppercase text-sm sm:text-base">
        RSVP Now
      </span>
    </a>
  </div>

  {/* Presenters Gallery */}
  <EventGallery
    photos={photos}
    instaURL="https://www.instagram.com/bolt.ubc/"
  />

  {/* Featured Company */}
  <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6 text-center">
      Featured Company
    </p>

    <div className="grid grid-cols-1 gap-4">
      {sponsors.map((sponsor, idx) => (
        <div
          key={idx}
          className="group relative flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all text-center"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden mb-3 ring-1 ring-white/10">
            <img
              src={sponsor.image}
              alt={sponsor.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h5 className="font-bold text-white text-sm">
            {sponsor.name}
          </h5>
        </div>
      ))}

      <div className="mt-2 p-4 rounded-2xl border border-dashed border-white/10 text-center">
        <p className="text-xs text-white/40 italic">
          Featured company to be announced soon
        </p>
      </div>
    </div>
  </div>

  {/* Event Details */}
  <section className="space-y-6">
    <div className="flex items-center gap-4">
      <h3 className="text-3xl font-bold">
        Event Details
      </h3>

      <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
    </div>

    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
      <div className="flex justify-between text-sm sm:text-base">
        <span className="text-white/60">
          Date
        </span>

        <span className="font-semibold text-white">
          November 7, 2026
        </span>
      </div>

      <div className="flex justify-between text-sm sm:text-base">
        <span className="text-white/60">
          Main Room
        </span>

        <span className="font-semibold text-white text-right">
          Birmingham Centre
        </span>
      </div>

      <div className="flex justify-between text-sm sm:text-base">
        <span className="text-white/60">
          Breakout Rooms
        </span>

        <span className="font-semibold text-white text-right">
          ANGU 037, 039, 234, 235
        </span>
      </div>

      <div className="flex justify-between text-sm sm:text-base">
        <span className="text-white/60">
          Expected Attendance
        </span>

        <span className="font-semibold text-white">
          90–100
        </span>
      </div>
    </div>
  </section>
</aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
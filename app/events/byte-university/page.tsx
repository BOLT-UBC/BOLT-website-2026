"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import EventTimeline from "@/components/EventTimeline";

export default function ByteUniversityPage() {
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const workshops = [
    {
      id: 1,
      title: "Workshop 1: Hosted by Google",
      time: "ANGU 234",
      description: [
        "Details on this workshop's topic and speaker will be announced soon.",
      ],
    },
    {
      id: 2,
      title: "Workshop 2: Hosted by Deloitte",
      time: "ANGU 235",
      description: [
        "Details on this workshop's topic and speaker will be announced soon.",
      ],
    },
    {
      id: 3,
      title: "Workshop 3: Hosted by Mastercard",
      time: "ANGU 237",
      description: [
        "Details on this workshop's topic and speaker will be announced soon.",
      ],
    },
  ];

  const timeline = [
    {
      name: "Registration Opens",
      date: "TBA",
      dateISO: "2026-10-26",
      description:
        "Sign up and select your preferred workshop through the membership portal.",
    },
    {
      name: "Registration Closes",
      date: "TBA",
      dateISO: "2026-11-18",
      description:
        "Deadline to register and lock in your workshop choice.",
    },
    {
      name: "Byte University",
      date: "Nov 21",
      dateISO: "2026-11-21",
      description:
        "Attend your chosen workshop, followed by open networking with speakers.",
    },
  ];

  const sponsors = [
    {
      name: "Google",
      image: "/images/Logo.webp",
    },
    {
      name: "Deloitte",
      image: "/images/Logo.webp",
    },
    {
      name: "Mastercard",
      image: "/images/Logo.webp",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07001d] via-[#12053a] to-[#1c1041] text-white selection:bg-purple-500/30">
      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-6xl space-y-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-start">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Page Title */}
              <header className="space-y-4">
                <h1 className="font-inter font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight">
                  BYTE{" "}
                  <span className="font-extrabold tracking-widest bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent animate-glint">
                    UNIVERSITY
                  </span>
                </h1>
              </header>

              {/* ABOUT SECTION */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold">
                    About Byte University
                  </h3>

                  <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                </div>

                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-white/85 max-w-2xl">
                  A professional development event featuring three concurrent
                  workshops led by industry professionals from companies such
                  as Google, Deloitte, and Mastercard. Students will choose
                  one workshop based on their interests, followed by an open
                  networking session with speakers.
                </p>
              </section>

              {/* EVENT SUMMARY CARDS */}
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
                    3 Concurrent Workshops
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

              {/* TIMELINE SECTION */}
              <EventTimeline timeline={timeline} />

              {/* WORKSHOPS SECTION */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold">
                    Choose Your Workshop
                  </h3>

                  <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                </div>

                <div className="grid gap-6">
                  {workshops.map((w) => (
                    <div
                      key={w.id}
                      className="group relative rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-6 transition-all hover:bg-white/[0.08] hover:translate-x-1"
                    >
                      <div className="flex items-start gap-4">
                        {/* Number */}
                        <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          {w.id}
                        </div>

                        <div className="flex-1">
                          {/* Workshop Title */}
                          <div className="flex flex-wrap items-baseline gap-3 mb-3">
                            <h4 className="text-xl font-bold text-white">
                              {w.title}
                            </h4>

                            <span className="text-sm font-medium text-purple-400/80 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">
                              {w.time}
                            </span>
                          </div>

                          {/* Workshop Description */}
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

            {/* RIGHT COLUMN */}
            <aside className="top-32 space-y-6">
              {/* BYTE UNIVERSITY IMAGE */}
              <div className="relative w-full flex items-center justify-center">
                <Image
                  src="/events/byte-university.png"
                  alt="Byte University"
                  width={900}
                  height={900}
                  className={`
                    w-[90%]
                    h-auto
                    object-contain
                    drop-shadow-[0_40px_80px_rgba(18,4,58,0.55)]
                    transition-transform
                    duration-700
                    ease-out
                    ${
                      isLaunching
                        ? "-translate-y-4"
                        : "translate-y-0"
                    }
                  `}
                  priority
                />
              </div>

              {/* REGISTER BUTTON */}
              <div className="px-6 pt-0 pb-2">
                <a
                  href="/membership/events/byte-university"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setIsLaunching(true)}
                  onMouseLeave={() => setIsLaunching(false)}
                  className="
                    group
                    relative
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#07001e]
                    py-4
                    transition-all
                    duration-300
                    border
                    border-white/20
                    hover:border-white/50
                    hover:bg-[#260101]
                    overflow-hidden
                    shadow-[0_18px_48px_rgba(70,25,143,0.25)]
                  "
                >
                  {/* Hover Glow */}
                  <div
                    className="
                      absolute
                      inset-0
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                      duration-500
                      bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)]
                    "
                  />

                  {/* Shine Animation */}
                  <div
                    className="
                      absolute
                      inset-0
                      translate-x-[-100%]
                      group-hover:translate-x-[100%]
                      transition-transform
                      duration-700
                      bg-gradient-to-r
                      from-transparent
                      via-white/10
                      to-transparent
                    "
                  />

                  <span
                    className="
                      relative
                      z-10
                      font-bold
                      text-white
                      tracking-widest
                      uppercase
                      text-sm
                      sm:text-base
                    "
                  >
                    Register Now
                  </span>
                </a>
              </div>

              {/* WORKSHOP HOSTS SECTION */}
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6 text-center">
                  Workshop Hosts
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
                </div>
              </div>

              {/* EVENT DETAILS SECTION */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold">
                    Event Details
                  </h3>

                  <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
                  {/* Date */}
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-white/60">
                      Date
                    </span>

                    <span className="font-semibold text-white">
                      November 21, 2026
                    </span>
                  </div>

                  {/* Main Room */}
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-white/60">
                      Main Room
                    </span>

                    <span className="font-semibold text-white text-right">
                      Birmingham Centre
                    </span>
                  </div>

                  {/* Workshop Rooms */}
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-white/60">
                      Workshop Rooms
                    </span>

                    <span className="font-semibold text-white text-right">
                      ANGU 234, 235, 237
                    </span>
                  </div>

                  {/* Expected Attendance */}
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-white/60">
                      Expected Attendance
                    </span>

                    <span className="font-semibold text-white">
                      TBA
                    </span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import EventTimeline from "@/components/EventTimeline";

export default function FirstBytePage() {
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timeline = [
    {
      name: "Registrations Open",
      date: "Wednesday, September 30",
      dateISO: "2026-09-30",
      description: "Register for FirstByte using the membership portal.",
      cta: {
        label: "Sign Up",
        href: "https://docs.google.com/forms/d/e/1FAIpQLScUD_0WTiar7YLFGphfmix-ZP0Xz6CO9tga0ZGrHHSlq1p3Aw/viewform",
      },
    },
    {
      name: "Case Released",
      date: "Wednesday, October 7",
      dateISO: "2026-10-07",
      description: "The case is released to all registered competitors.",
    },
    {
      name: "Registrations Close",
      date: "Saturday, October 10 at 11:59 PM",
      dateISO: "2026-10-10",
      description: "Deadline for competitors to register for FirstByte.",
    },
    {
      name: "Workshop",
      date: "TBD",
      dateISO: "", // fill in once the date is confirmed
      description: "Prep workshop for competitors. Date to be announced.",
    },
    {
      name: "Submissions Due",
      date: "Thursday, October 15 at 11:59 PM",
      dateISO: "2026-10-15",
      description: "Final deadline to submit your case solution.",
    },
    {
      name: "FirstByte Datathon",
      date: "Saturday, October 17",
      dateISO: "2026-10-17",
      description:
        "Event day at the Big 4 Conference Centre, Sauder School of Business. Teams present their findings.",
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
            <div className="space-y-6">
              <header className="space-y-4">
                <h1 className="font-inter font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight">
                  <span className="font-extrabold tracking-widest bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent animate-glint">
                    FIRSTBYTE
                  </span>
                </h1>
              </header>

              {/* ABOUT Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold">About FirstByte</h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                </div>

                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-white/85 max-w-2xl">
                  A beginner-friendly datathon designed to introduce first- and
                  second-year students to data analytics through hands-on,
                  team-based problem solving. Participants will work with
                  real-world datasets and gain practical experience in
                  analytics in an accessible, low-pressure environment.
                </p>
              </section>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base shadow-[0_18px_48px_rgba(70,25,143,0.25)]">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">
                    Experience Level
                  </span>
                  <span className="text-white font-semibold">Beginner</span>
                </div>

                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base shadow-[0_18px_48px_rgba(70,25,143,0.25)]">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">
                    Format
                  </span>
                  <span className="text-white font-semibold">
                    Team Datathon
                  </span>
                </div>

                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base shadow-[0_18px_48px_rgba(70,25,143,0.25)]">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">
                    Location
                  </span>
                  <span className="text-white font-semibold">
                    Big 4 Conference Centre
                  </span>
                </div>
              </div>

              {/* Timeline Section */}
              <EventTimeline timeline={timeline} />
            </div>

            <aside className="top-32 space-y-8">
              {/* Hero Image Section */}
              {/* -mb-28 pulls the Apply Now button up. Try -mb-20 (less) or -mb-36 (more). */}
              <div className="relative w-full aspect-[1/1] flex items-center justify-center -mb-28">
                <Image
                  src="/events/byte-2.png"
                  alt="Students collaborating during the First Byte datathon"
                  width={900}
                  height={900}
                  className={`
                    relative z-10 w-[90%] h-[90%] object-contain
                    drop-shadow-[0_40px_80px_rgba(18,4,58,0.55)]
                    transition-transform duration-700 ease-out
                    ${isLaunching ? "-translate-y-4" : "translate-y-0"}
                  `}
                  priority
                />
              </div>

              {/* Apply Button */}
              <div className="p-6 space-y-4">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScUD_0WTiar7YLFGphfmix-ZP0Xz6CO9tga0ZGrHHSlq1p3Aw/viewform"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setIsLaunching(true)}
                  onMouseLeave={() => setIsLaunching(false)}
                  className="group relative flex w-full items-center justify-center rounded-xl bg-[#07001e] py-4 transition-all duration-300 border border-white/20 hover:border-white/50 hover:bg-[#260101] overflow-hidden shadow-[0_18px_48px_rgba(70,25,143,0.25)]"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)]" />

                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  <span className="relative z-10 font-bold text-white tracking-widest uppercase text-sm sm:text-base">
                    Apply Now
                  </span>
                </a>
              </div>

              {/* Sponsors Section */}
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6 text-center">
                  Event Sponsors
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
                      More partners being announced soon
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Info Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold">Event Details</h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-white/60">Date</span>
                    <span className="font-semibold text-white">
                      October 17, 2026
                    </span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-white/60">Location</span>
                    <span className="font-semibold text-white text-right">
                      Big 4 Conference Centre
                    </span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-white/60">
                      Expected Attendance
                    </span>
                    <span className="font-semibold text-white">50–60</span>
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
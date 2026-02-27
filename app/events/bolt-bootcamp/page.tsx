"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import EventTimeline from "@/components/EventTimeline";

export default function BoltBootcampPage() {
  const [isLaunching, setIsLaunching] = useState(false)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const workshops = [
    { id: 1, title: "Workshop 1: TBA", time: "TBA", description: ["Details related to this workshop will be announced soon"] },
    { id: 2, title: "Workshop 2: TBA", time: "TBA", description: ["Details related to this workshop will be announced soon"] },
    { id: 3, title: "Workshop 3: TBA", time: "TBA", description: ["Details related to this workshop will be announced soon"] }
  ];

  const prizes = [
    { rank: "1st", reward: "Prizes TBA"},
    { rank: "2nd", reward: "Prizes TBA"},
    { rank: "3rd", reward: "Prizes TBA"}
  ];

  // Timeline props
  const timeline = [
    {
      name: "Applications Open",
      date: "Jan 15",
      dateISO: "2026-01-15",
      description: "Apply to Bootcamp using the membership portal"
    },
    {
      name: "Application Closes",
      date: "Feb 18",
      dateISO: "2026-02-18",
      description: "Deadline to apply for Bootcamp."
    },
    {
      name: "Case Release",
      date: "Feb 28",
      dateISO: "2026-02-28",
      description: "Case and dataset are released to all students"
    },
    {
      name: "Workshop Series",
      date: "Mar 1",
      dateISO: "2026-03-01",
      description: "Learn more about data analysis through our workshops"
    },
    {
      name: "First Round Submission Closes",
      date: "Mar 5",
      dateISO: "2026-03-05",
      description: "Deadline for submitting your case presentations."
    },
    {
      name: "Bootcamp Main Event",
      date: "Mar 7",
      dateISO: "2026-03-07",
      description: "Qualified teams will pitch in front of a panel of judges."
    }
  ];

  const sponsors = [
    { name: "TBA", image: "/images/Logo.webp" }
  ];

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
                  BOLT <span className="font-extrabold tracking-widest bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent animate-glint">BOOTCAMP</span>
                </h1>
              </header>

              {/* ABOUT Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold">About Bootcamp</h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                </div>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-white/85 max-w-2xl">
                Bootcamp is our largest annual case competition event. All students are welcome to join this thrilling week-long event with a variety of workshops, and collaborate with your peers to take down one of our most challenging cases yet.
                </p>
              </section>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base shadow-[0_18px_48px_rgba(70,25,143,0.25)]">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">Experience Level</span>
                  <span className="text-white font-semibold">Intermediate</span>
                </div>
                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base shadow-[0_18px_48px_rgba(70,25,143,0.25)]">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">Format</span>
                  <span className="text-white font-semibold">Workshops + Datathon</span>
                </div>
                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base shadow-[0_18px_48px_rgba(70,25,143,0.25)]">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">Duration</span>
                  <span className="text-white font-semibold">1 Week</span>
                </div>
              </div>

              {/* Timeline Section */}
              <EventTimeline timeline={timeline}/>

              {/* Workshops Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold">Skill-Building Workshops</h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                </div>
                <div className="grid gap-6">
                  {workshops.map((w) => (
                    <div key={w.id} className="group relative rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-6 transition-all hover:bg-white/[0.08] hover:translate-x-1">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          {w.id}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-baseline gap-3 mb-3">
                            <h4 className="text-xl font-bold text-white">{w.title}</h4>
                            <span className="text-sm font-medium text-purple-400/80 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">
                              {w.time}
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {w.description.map((point, index) => (
                              <li key={index} className="flex items-start gap-2 text-white/70 text-sm leading-relaxed">
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
            <aside className="top-32 space-y-8">
              <div className="relative w-full aspect-[1/1] flex items-center justify-center mb-32">
                <img 
                  src="/events/launch.webp"
                  alt="Launch Fire"
                  className={`
                    absolute bottom-0 left-0 w-full h-[45%]
                    object-cover object-bottom
                    transition-all duration-700 ease-out
                    z-0
                    ${isLaunching
                      ? 'translate-y-[75%] scale-60 opacity-100 blur-none'
                      : 'translate-y-24 scale-40 opacity-0 blur-sm'
                    }
                  `}
                />
                <img 
                  src="/events/bootcamp.webp"
                  alt="BOLT Bootcamp"
                  className={`
                    relative z-10 w-[90%] h-[90%] object-cover
                    transition-transform duration-700 ease-out
                    ${isLaunching ? '-translate-y-4' : 'translate-y-0'}
                  `}
                />
              </div>

              <div className="p-6 space-y-4">
                <a
                  href={'/membership/events/bolt-bootcamp'}
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

              {/* Sponsors Section (Modified to match width) */}
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-6 text-center">Event Sponsors</p>
                <div className="grid grid-cols-1 gap-4">
                  {sponsors.map((sponsor, idx) => (
                    <div key={idx} className="group relative flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all text-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden mb-3 ring-1 ring-white/10">
                        <img src={sponsor.image} alt={sponsor.name} className="w-full h-full object-cover" />
                      </div>
                      <h5 className="font-bold text-white text-sm">{sponsor.name}</h5>
                    </div>
                  ))}
                  <div className="mt-2 p-4 rounded-2xl border border-dashed border-white/10 text-center">
                    <p className="text-xs text-white/40 italic">More partners being announced soon</p>
                  </div>
                </div>
              </div>
              
              {/* Prizes Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold">Winning Prizes</h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {prizes.map((p, idx) => (
                    <div 
                      key={idx} 
                      className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                        p.rank === "1st" 
                          ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
                          : p.rank === "2nd"
                          ? "border-slate-300/50 bg-slate-300/10 shadow-[0_0_30px_rgba(203,213,225,0.1)] text-slate-300"
                          : p.rank === "3rd"
                          ? "border-orange-600/50 bg-orange-600/10 shadow-[0_0_30px_rgba(234,88,12,0.1)] text-orange-500"
                          : "border-white/10 bg-white/5"
                      } flex flex-col items-center text-center group`}
                    >
                      
                      <span className={`text-4xl font-black mb-2 ${p.rank === "1st" ? 'text-amber-400' : 'text-white/40'}`}>
                        {p.rank}
                      </span>
                      
                      <p className="text-xl font-bold text-white mb-2">{p.reward}</p>
                    </div>
                  ))}
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

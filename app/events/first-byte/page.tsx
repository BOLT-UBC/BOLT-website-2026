"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import Image from "next/image";

const FirstBytePage: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 650);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07001d] via-[#12053a] to-[#1c1041] text-white">
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-6xl space-y-20">
          <section className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs sm:text-sm uppercase tracking-[0.35em] text-fuchsia-100/80 shadow-[0_14px_32px_rgba(72,38,120,0.35)]">
                First Byte Datathon
              </div>
              <h1 className="font-inter font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Launch Your Data Journey with First Byte
              </h1>
              <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-white/85 max-w-2xl">
                First Byte is BOLT UBC&rsquo;s beginner-focused analytics experience. Over two immersive workshops and a capstone case, you&rsquo;ll collaborate with peers, build analytical confidence, and present polished insights to industry judges. Registration is now closed, but you can explore what this journey looks like below.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">Experience Level</span>
                  <span className="text-white font-semibold">Beginner Friendly</span>
                </div>
                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">Format</span>
                  <span className="text-white font-semibold">Workshops + Datathon</span>
                </div>
                <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base">
                  <span className="text-xs uppercase tracking-wide text-purple-200/80">Duration</span>
                  <span className="text-white font-semibold">2 Weeks</span>
                </div>
              </div>
              <div className="space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed text-white/85 max-w-2xl">
                <p>
                  Expect a mix of live demos, collaborative breakouts, and office hours that help you turn data curiosity into action. By finale night, you&rsquo;ll have a case-ready deck and the confidence to present it.
                </p>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 shadow-[0_18px_44px_rgba(70,25,143,0.3)] space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-100/70">What You&rsquo;ll Build</p>
                  <ul className="space-y-2 text-white/85 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                      Your own analytic workflow — from cleaning messy datasets to synthesizing insights that matter.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                      A case-ready story that showcases your team&rsquo;s recommendations to industry mentors.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                      Momentum that carries into co-op interviews, BOLT projects, and future hackathons.
                    </li>
                  </ul>
                </div>
                <div className="relative inline-flex">
                  {isAnimating && (
                    <span className="pointer-events-none absolute inset-0 -translate-y-1 rounded-full bg-fuchsia-400/40 blur-xl animate-ping" />
                  )}
                  <Button text="Registration Closed" onClick={handleClick} outline />
                </div>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[680px] items-center justify-center">
              <Image
                src="/events/byte-2.png"
                alt="Students collaborating during the First Byte datathon"
                width={900}
                height={900}
                className="w-full max-w-[540px] object-contain drop-shadow-[0_40px_80px_rgba(18,4,58,0.55)]"
                priority
              />
            </div>
          </section>

          <section className="space-y-10">
            <div className="max-w-3xl space-y-4">
              <h2 className="font-semibold text-3xl sm:text-4xl">Two Workshops, One Case-Ready Team</h2>
              <p className="text-base sm:text-lg text-white/80">
                We meet you where you are. Each session blends concept walkthroughs with guided practice so you can apply techniques immediately alongside mentors.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 shadow-[0_20px_40px_rgba(29,6,76,0.5)] space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-fuchsia-100">
                  Workshop 1
                </div>
                <h3 className="text-2xl font-semibold text-white">Introduction to Data Analytics</h3>
                <ul className="space-y-3 text-sm sm:text-base text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                    Build confidence with Excel and SQL fundamentals to interrogate messy datasets.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                    Learn a repeatable framework for framing problems, scoping assumptions, and testing quickly.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                    Collaborate in small pods with mentor feedback as you explore the competition dataset.
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 shadow-[0_20px_40px_rgba(29,6,76,0.5)] space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-amber-100">
                  Workshop 2
                </div>
                <h3 className="text-2xl font-semibold text-white">Presenting Insights Effectively</h3>
                <ul className="space-y-3 text-sm sm:text-base text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                    Turn analysis into narrative: storyboard your slides and structure a compelling deck.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                    Practice delivery with real-time coaching on visuals, pacing, and Q&amp;A handling.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
                    Walk away prepared to tackle the finale presentation with confidence.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 shadow-[0_22px_48px_rgba(24,3,72,0.5)] space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">By the Numbers</p>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#150033]/60 px-5 py-4">
                <p className="text-3xl font-bold text-white">250+</p>
                <p className="text-sm text-white/70">Total Registrations</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#150033]/60 px-5 py-4">
                <p className="text-3xl font-bold text-white">145</p>
                <p className="text-sm text-white/70">Final Case Presenters</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FirstBytePage;

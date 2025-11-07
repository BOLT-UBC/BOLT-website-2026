"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const photos = [{ src: "/images/Presenters.webp", alt: "Presenters" }];

function EventGallery({ photos, instaURL }: { photos: { src: string; alt?: string }[]; instaURL: string }) {
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
          href={instaURL}
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0718] to-[#1a0f3a] text-white">
      <div className="relative z-50"><Navbar /></div>
      <main className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,40rem)_minmax(320px,1fr)] items-start">
            <div className="w-full text-left space-y-6"> 
              <div>
                <h1 className="font-inter font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                  BOLT <span className="font-bold inline-block relative isolation-isolate bg-gradient-to-r from-[#46198f] via-[#46198f] to-[#a53802] bg-clip-text text-transparent [text-shadow:0_0_1px_#fff,0_0_2px_#fff,0_0_16px_#fff]">Connect</span>
                </h1>
                <h2 className="mt-0 text-1xl sm:text-[36px] lg:text-[44px] font-extrabold leading-snug">
                  <span className="bg-gradient-to-r from-purple-700 to-purple-700 bg-clip-text text-transparent [text-shadow:0_0_15px_rgba(158,142,255,0.2)]">
                    Networking
                  </span>{" "}
                  with a Twist
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed text-white/90 text-justify lg: max-w-[31.5rem]">
                <p className="font-semibold">
                  Connect with like-minded data enthusiasts, industry professionals, and alumni. Network and discover career opportunities in analytics.
                </p>
                <p>
                  BOLT Connect is a unique networking night that goes beyond traditional professional mixers. In addition to structured open networking between students and industry professionals, last year's event featured a <span className="font-extrabold">"Case Solving with Professionals"</span> segment.
                </p>
                <p>
                  In this activity, professionals led small groups of students through a mock case interview, offering real-time guidance on structuring problems, brainstorming solutions, and effective communication—key skills for internships and new grad roles.
                </p>
                <p>
                  The event fosters <span className="font-bold">organic connections</span>, <span className="font-extrabold">mentorship opportunities</span>, and <span className="font-extrabold">practical career preparation</span>, especially in fields like consulting, tech, and business analytics.
                </p>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:pl-4">
              <EventGallery photos={photos} instaURL="https://www.instagram.com/bolt.ubc/" />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

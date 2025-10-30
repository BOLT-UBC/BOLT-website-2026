"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const photos = [{ src: "/images/Presenters.webp", alt: "Presenters" }];

function EventGallery({ photos, instaURL }: { photos: { src: string; alt?: string }[]; instaURL: string }) {
  const hero = photos[0];

  return (
    <section className="font-inter w-full">
      <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5">
        <Image
          src={hero.src}
          alt={hero.alt ?? ""}
          className="w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.02]"
          width={800}
          height={600}
        />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.35)]" />
      </div>

      <div className="mt-6">
        <a
          href={instaURL}
          target="_blank"
          rel="noreferrer"
          className="group relative inline-flex items-center font-extrabold text-[18px] md:text-[20px]"
        >
          <span className="relative px-4 py-2 rounded-[0.9rem] text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc] shadow-[0_0_18px_rgba(106,17,203,.35),0_0_34px_rgba(37,117,252,.25)] transition-all duration-200 hover:shadow-[0_0_26px_rgba(106,17,203,.55),0_0_48px_rgba(37,117,252,.35)] hover:-translate-y-0.5">
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
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-y-1 lg:grid-cols-[minmax(0,43rem)_minmax(420px,1fr)] lg:gap-x-0 items-start">
            <div className="max-w-[48rem] text-left">
              <h1 className="font-inter font-bold text-5xl md:text-7xl leading-tight mb-0">
                BOLT <span className="font-bold inline-block relative isolation-isolate bg-gradient-to-r from-[#46198f] via-[#46198f] to-[#a53802] bg-clip-text text-transparent [text-shadow:0_0_1px_#fff,0_0_2px_#fff,0_0_16px_#fff]">Connect</span>
              </h1>
              <h2 className="text-[28px] md:text-[41.7px] font-extrabold -mt-2 leading-none">
                <span className="bg-gradient-to-r from-purple-700 to-purple-700 bg-clip-text text-transparent [text-shadow:0_0_15px_rgba(158,142,255,0.2)]">
                  Networking
                </span>{" "}
                with a Twist
              </h2>
              <p className="font-bold max-w-[31rem] text-[10px] md:text-[19px] mb-6 text-justify leading-tight">
                Connect with like-minded data enthusiasts, industry professionals, and alumni. Network and discover career opportunities in analytics.
              </p>
              <p className="max-w-[31rem] text-[12px] md:text-[19.5px] mb-4 text-justify leading-snug">
                BOLT Connect is a unique networking night that goes beyond traditional professional mixers. In addition to structured open networking between students and industry professionals, last year's event featured a <span className="font-extrabold">"Case Solving with Professionals"</span> segment.
              </p>

              <p className="max-w-[31rem] text-[12px] md:text-[19px] mb-4 text-justify leading-snug">
                In this activity, professionals led small groups of students through a mock case interview, offering real-time guidance on structuring problems, brainstorming solutions, and effective communication which are key skills for internships and new grad roles.
              </p>
              <p className="max-w-[31rem] text-[12px] md:text-[19.5px] text-justify leading-snug">
                The event fosters <span className="font-bold">organic connections</span>, <span className="font-extrabold">mentorship opportunities</span>, and <span className="font-extrabold">practical career preparation</span>, especially in fields like consulting, tech, and business analytics.
              </p>
            </div>

            <aside className="lg:sticky lg:top-28 -ml-2 md:-ml-3 mt-6">
              <EventGallery photos={photos} instaURL="https://www.instagram.com/bolt.ubc/" />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

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
                  BOLT <span className="font-bold inline-block relative isolation-isolate bg-gradient-to-r from-[#46198f] via-[#46198f] to-[#a53802] bg-clip-text text-transparent [text-shadow:0_0_1px_#fff,0_0_2px_#fff,0_0_16px_#fff]">Connect</span> × Mastercard
                </h1>
                <h2 className="mt-0 text-1xl sm:text-[36px] lg:text-[44px] font-extrabold leading-snug">
                  <span className="bg-gradient-to-r from-purple-700 to-purple-700 bg-clip-text text-transparent [text-shadow:0_0_15px_rgba(158,142,255,0.2)]">
                    Networking
                  </span>{" "}
                  with a Twist
                </h2>
              </div>

              <div className="space-y-5 text-sm sm:text-base lg:text-lg leading-relaxed text-white/90 max-w-2xl xl:max-w-none">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 shadow-[0_18px_48px_rgba(70,25,143,0.25)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-200/80">November 28 • BOLT Members Only</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    We&rsquo;re thrilled to present an exclusive partnership event: <span className="font-bold text-amber-200/90">BOLT Connect × Mastercard</span>.
                  </p>
                </div>

                <p className="font-semibold">
                  Join us for an evening of networking with Mastercard professionals across data analytics, engineering, and product. Discover how you can become part of their Summer 2026 co-op intake while connecting with fellow BOLT members.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base">
                    <span className="text-xs uppercase tracking-wide text-purple-200/80">Date</span>
                    <span className="text-white font-semibold">November 28</span>
                  </div>
                  <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base">
                    <span className="text-xs uppercase tracking-wide text-purple-200/80">Who</span>
                    <span className="text-white font-semibold">BOLT Members Only</span>
                  </div>
                  <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm sm:text-base">
                    <span className="text-xs uppercase tracking-wide text-purple-200/80">Next Step</span>
                    <span className="text-white font-semibold">Submit resume via link in bio</span>
                  </div>
                </div>

                <p>
                  All resumes submitted through our link in bio will be shared directly with Mastercard for review. Make sure yours highlights your curiosity, impact, and readiness to contribute.
                </p>
                <p>
                  As always, BOLT Connect takes networking beyond surface-level conversations. Expect facilitated table rotations, mini case prompts, and meaningful mentorship moments that help you sharpen your storytelling and career readiness.
                </p>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:pl-4">
              <EventGallery photos={photos} instaURL="https://www.instagram.com/bolt.ubc/" />
              <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Partner Spotlight</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 sm:p-4">
                    <Image src="/partners/mastercard.webp" alt="Mastercard logo" fill className="object-contain" sizes="96px" />
                  </div>
                  <div className="space-y-1 text-sm sm:text-base text-white/80">
                    <p className="font-semibold text-white">Mastercard</p>
                    <p>Meet data, engineering, and product leaders shaping the future of payments.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

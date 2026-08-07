"use client";

import { useRef } from "react";
import Image from "next/image";
import Button from "./Button";
import SpaceScene from "./SpaceScene";
import Navbar from "./Navbar";
import MembershipBanner from "./MembershipBanner";
import { SITE_URLS } from "../lib/config";

const Hero: React.FC = () => {
  const spaceSceneRef = useRef<{
    createExplosion: (_x: number, _y: number) => void;
  }>(null);

  const handleHeroClick = (e: React.MouseEvent) => {
    // Don't trigger explosion if clicking on buttons, interactive elements, or the membership banner
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest('[role="button"]') ||
      target.closest('[id="Membership"]') ||
      target.closest('[id="Membership-inline"]')
    ) {
      return;
    }

    // Trigger explosion at click coordinates
    if (spaceSceneRef.current) {
      spaceSceneRef.current.createExplosion(e.clientX, e.clientY);
    }
  };

  return (
    <div
      className="flex items-center justify-start bg-gradient-to-br from-[#1a0b2e] via-[#614ea5] to-[#493b7b] w-full h-screen px-6 sm:px-6 md:px-16 relative overflow-hidden -mt-0 top-0 cursor-crosshair"
      id="Home"
      onClick={handleHeroClick}
    >
      <SpaceScene ref={spaceSceneRef} />
      <Navbar />
      <MembershipBanner />
      <div className="flex justify-start items-center mt-8 lg:mt-0 relative z-30 w-full">
        <div className="flex flex-col justify-center items-start max-w-3xl p-4 md:p-6 gap-4 relative">
          <div className="flex items-center gap-6">
            <h1 className="font-inter text-6xl md:text-8xl font-bold text-red-600 leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
              BOLT DEV SERVER
            </h1>
            <Image
              src="/images/Logo.webp"
              alt="BOLT UBC Logo - UBC's Largest Data Club"
              className="w-20 sm:w-28 md:w-36 h-auto object-contain -ml-10"
              loading="eager"
              decoding="async"
              width={200}
              height={200}
            />
          </div>
          <h2 className="font-inter text-3xl md:text-5xl font-bold text-white leading-snug">
            UBC's <span className="text-[#e879f9] uppercase">Largest</span> Data
            Club
          </h2>
          <p className="font-inter text-sm md:text-base font-normal text-white/90 leading-relaxed max-w-2xl">
            Empowering UBC students to harness the power of data through
            hands-on workshops, case competitions, and networking events. Join
            us to develop practical analytics skills and connect with industry
            professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              text="BECOME A MEMBER"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open(SITE_URLS.membership, "_blank");
                }
              }}
            />
            <Button
              text="PARTNER WITH US"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = SITE_URLS.sponsorEmail;
                }
              }}
              outline
            />
          </div>
          {/* Mobile: Membership banner after buttons */}
          <div className="md:hidden">
            <MembershipBanner variant="inline" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

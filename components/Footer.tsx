"use client";

import { memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SOCIAL_LINKS, SITE_URLS, getCopyrightText } from "../lib/config";

function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const isTeamPage = pathname === '/team';
  const isEventPage = pathname.startsWith('/events/');
  const isNotHomePage = isTeamPage || isEventPage;

  const handleNavigation = (sectionId: string) => {
    // If clicking on Team, navigate to team page
    if (sectionId === 'Team') {
      router.push('/team');
      return;
    }

    // If we're on the team page or event page, navigate to home first
    if (isNotHomePage) {
      router.push('/');
      setTimeout(() => {
        if (typeof document !== 'undefined') {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      if (typeof document !== 'undefined') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#614ea5] to-[#493b7b] text-white py-12 md:py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 md:px-8">
        {/* Footer Navigation - Single Row */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center gap-8 mb-8">
          {/* Social Links - Left Side */}
          <div className="flex flex-col gap-4 items-center lg:items-start">
            <div className="flex items-center gap-6">
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:opacity-80 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
              </svg>
            </a>
            <a
              href={SITE_URLS.contactEmail}
              aria-label="Email"
              className="hover:opacity-80 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zM20 8l-7.475 4.675q-.125.075-.262.113t-.263.037t-.262-.037t-.263-.113L4 8v10h16zm-8 3l8-5H4z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:opacity-80 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:opacity-80 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
              </svg>
            </a>
            </div>
            <p className="font-inter text-white/60 text-xs">{getCopyrightText()}</p>
          </div>

          {/* Navigation Directories - Right Side */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm max-w-md lg:max-w-none mx-auto lg:mx-0">
            <button onClick={() => handleNavigation('About')} className="font-inter text-white/80 hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => handleNavigation('Team')} className="font-inter text-white/80 hover:text-white transition-colors">
              Team
            </button>
            <button onClick={() => handleNavigation('Events')} className="font-inter text-white/80 hover:text-white transition-colors">
              Events
            </button>
            <button onClick={() => handleNavigation('Partners')} className="font-inter text-white/80 hover:text-white transition-colors">
              Partners
            </button>
            <button onClick={() => handleNavigation('Solutions')} className="font-inter text-white/80 hover:text-white transition-colors">
              Solutions
            </button>
            <a href={SITE_URLS.membership} target="_blank" rel="noopener noreferrer" className="font-inter text-white/80 hover:text-white transition-colors">
              Membership
            </a>
            <a href={SITE_URLS.contactEmail} className="font-inter text-white/80 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>

        {/* Land Acknowledgement - Bottom */}
        <div className="pt-12 mt-8">
          <p className="font-inter text-xs text-white/80 leading-relaxed text-center mx-auto mb-3">
            UBC BOLT respectfully acknowledges that we are located on the traditional, ancestral, and unceded territory of the xʷməθkʷəy̓əm (Musqueam) people. The Musqueam people have been stewards of this land since time immemorial. We are grateful for the opportunity to live, work, and learn on this territory, and we are committed to building respectful relationships with Indigenous peoples and communities.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <a
              href="https://indigenous.ubc.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-white/70 hover:text-white underline transition-colors"
            >
              UBC Indigenous Portal
            </a>
            <a
              href="https://www.musqueam.bc.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-white/70 hover:text-white underline transition-colors"
            >
              Musqueam Indian Band
            </a>
            <a
              href="https://native-land.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-white/70 hover:text-white underline transition-colors"
            >
              Native Land Digital
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

Footer.displayName = 'Footer';

export default memo(Footer);

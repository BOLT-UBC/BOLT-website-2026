"use client";

import { memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SOCIAL_LINKS,
  SITE_URLS,
  getCopyrightText,
} from "../lib/config";

function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const isTeamPage = pathname === "/team";
  const isEventPage = pathname.startsWith("/events/");
  const isNotHomePage = isTeamPage || isEventPage;

  const handleNavigation = (sectionId: string) => {
    if (sectionId === "Team") {
      router.push("/team");
      return;
    }

    if (isNotHomePage) {
      router.push("/");

      setTimeout(() => {
        const element = document.getElementById(sectionId);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 150);

      return;
    }

    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <footer
      className="
        relative
        w-full
        overflow-hidden
        bg-[#0b0612]
        text-white
      "
    >
      {/* ====================================================== */}
      {/* BACKGROUND                                             */}
      {/* ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-0
          h-[400px]
          w-[400px]
          rounded-full
          bg-purple-700/15
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-0
          h-[400px]
          w-[400px]
          rounded-full
          bg-violet-600/10
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-purple-400/40
          to-transparent
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 sm:px-8 md:py-16">

        {/* ==================================================== */}
        {/* MAIN FOOTER                                          */}
        {/* ==================================================== */}

        <div
          className="
            flex
            flex-col
            gap-10
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          {/* -------------------------------------------------- */}
          {/* SOCIALS                                            */}
          {/* -------------------------------------------------- */}

          <div className="flex flex-col items-center gap-5 lg:items-start">

            <div className="flex items-center gap-4">

              {/* LinkedIn */}
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-white/75
                  transition-all
                  duration-300
                  hover:border-purple-400/30
                  hover:bg-purple-500/15
                  hover:text-white
                  hover:-translate-y-0.5
                "
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.1 18v-7H5.5v7h2.6ZM6.8 9.9c.85 0 1.55-.7 1.55-1.55S7.65 6.8 6.8 6.8s-1.55.7-1.55 1.55S5.95 9.9 6.8 9.9ZM18.5 18v-3.84c0-2.07-.45-3.66-2.91-3.66-1.18 0-1.97.65-2.29 1.27h-.04V11h-2.49v7h2.6v-3.47c0-.91.17-1.79 1.3-1.79 1.12 0 1.13 1.04 1.13 1.85V18h2.7Z" />
                </svg>
              </a>

              {/* Email — fixed */}
              <a
                href={SITE_URLS.contactEmail}
                aria-label="Email"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-white/75
                  transition-all
                  duration-300
                  hover:border-purple-400/30
                  hover:bg-purple-500/15
                  hover:text-white
                  hover:-translate-y-0.5
                "
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-white/75
                  transition-all
                  duration-300
                  hover:border-purple-400/30
                  hover:bg-purple-500/15
                  hover:text-white
                  hover:-translate-y-0.5
                "
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                  />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="0.8"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-white/75
                  transition-all
                  duration-300
                  hover:border-purple-400/30
                  hover:bg-purple-500/15
                  hover:text-white
                  hover:-translate-y-0.5
                "
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.6V3.94c-.28-.04-1.24-.12-2.36-.12-2.34 0-3.94 1.43-3.94 4.06V10H7.65v3h2.65v8h3.2Z" />
                </svg>
              </a>

            </div>

            <p className="font-inter text-xs text-white/40">
              {getCopyrightText()}
            </p>
          </div>

          {/* ================================================== */}
          {/* NAVIGATION                                         */}
          {/* ================================================== */}

          <div
            className="
              flex
              max-w-xl
              flex-wrap
              items-center
              justify-center
              gap-x-6
              gap-y-4
              lg:justify-end
            "
          >
            {[
              ["About", "About"],
              ["Team", "Team"],
              ["Events", "Events"],
              ["Partners", "Partners"],
              ["Solutions", "Solutions"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => handleNavigation(id)}
                className="
                  font-inter
                  text-sm
                  text-white/55
                  transition-colors
                  duration-200
                  hover:text-white
                "
              >
                {label}
              </button>
            ))}

            <a
              href={SITE_URLS.membership}
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-inter
                text-sm
                text-white/55
                transition-colors
                duration-200
                hover:text-white
              "
            >
              Membership
            </a>

            <a
              href={SITE_URLS.contactEmail}
              className="
                font-inter
                text-sm
                text-white/55
                transition-colors
                duration-200
                hover:text-white
              "
            >
              Contact
            </a>
          </div>
        </div>

        {/* ==================================================== */}
        {/* DIVIDER                                              */}
        {/* ==================================================== */}

        <div className="my-10 h-px bg-white/[0.07]" />

        {/* ==================================================== */}
        {/* LAND ACKNOWLEDGEMENT                                 */}
        {/* ==================================================== */}

        <div className="mx-auto max-w-5xl text-center">

          <p
            className="
              mx-auto
              mb-4
              max-w-4xl
              font-inter
              text-xs
              leading-relaxed
              text-white/45
            "
          >
            UBC BOLT respectfully acknowledges that we are located on
            the traditional, ancestral, and unceded territory of the
            xʷməθkʷəy̓əm (Musqueam) people. The Musqueam people have
            been stewards of this land since time immemorial. We are
            grateful for the opportunity to live, work, and learn on
            this territory, and we are committed to building respectful
            relationships with Indigenous peoples and communities.
          </p>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">

            <a
              href="https://indigenous.ubc.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-inter
                text-xs
                text-white/40
                underline
                underline-offset-2
                transition-colors
                hover:text-purple-300
              "
            >
              UBC Indigenous Portal
            </a>

            <a
              href="https://www.musqueam.bc.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-inter
                text-xs
                text-white/40
                underline
                underline-offset-2
                transition-colors
                hover:text-purple-300
              "
            >
              Musqueam Indian Band
            </a>

            <a
              href="https://native-land.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-inter
                text-xs
                text-white/40
                underline
                underline-offset-2
                transition-colors
                hover:text-purple-300
              "
            >
              Native Land Digital
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";

export default memo(Footer);

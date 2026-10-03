"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { TeamData, Team as TeamType, Member } from "../../types/types";
import { getProfileUrl } from "../../lib/assets";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Import with type assertion for JSON data
import teamDataJson from "../../lib/team.json";
const teamData = teamDataJson as unknown as TeamData;

/* ------------------------------------------------------------------ */
/* LinkedIn links (matched by name, case-insensitive)                  */
/* Add or edit links here. Names must match the names in team.json.    */
/* ------------------------------------------------------------------ */

const LINKEDIN_LINKS: Record<string, string> = {
  "Aadeesh Nargotra": "https://www.linkedin.com/in/aadeeshnargotra/",
  "Nicole Li": "https://www.linkedin.com/in/nicole-li-219268366/",
  "Leland Graves": "https://www.linkedin.com/in/leland-graves0/",
  "Hannah Goharian": "https://www.linkedin.com/in/hgoharian/",
  "Chirag Raisingh": "https://www.linkedin.com/in/chirag-raisingh/",
  "Arnav Dhablania": "https://www.linkedin.com/in/arnavdhablania/",
  "Kathy Hui": "https://www.linkedin.com/in/kathy-hui-/",
  "Harshit Sethi": "https://www.linkedin.com/in/harshit-sethi-0b9b2422a/",
  "Nathan Cheung": "https://www.linkedin.com/in/nathan-cheung-79b07727a/",
  "Samaira Aima": "https://www.linkedin.com/in/samaira-aima/",
  "Anne Nguyen": "https://www.linkedin.com/in/anne-nguyen-2903691b3/",
  "Amala Mohan": "https://www.linkedin.com/in/amala-mohan-62586a33b/",
  "Eleanor Lam": "https://www.linkedin.com/in/eleanor-lam/",
  "Prisha Budhiraja": "https://www.linkedin.com/in/prisha-budhiraja/",
  "Manya Garg": "https://www.linkedin.com/in/manya-garg-00a98220a/",
  "Antarip Kashyap": "https://www.linkedin.com/in/antarip-kashyap-150ba821a/",
  "Alexy Lamoot": "https://www.linkedin.com/in/alexy-lamoot-a30231192/",
  "Kyle Gomez": "https://www.linkedin.com/in/kylegomez03/",
  "Nav Thukral": "https://www.linkedin.com/in/navthukral/",
  // Not found yet: Tharun Pranav, Will Lourens, Daniel Truong,
  // Chloe Sepulveda, Doris Che, Bradley Wong
};

const normalizeName = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, " ");

const LINKEDIN_BY_NAME = Object.fromEntries(
  Object.entries(LINKEDIN_LINKS).map(([name, url]) => [
    normalizeName(name),
    url,
  ])
);

function withLinkedIn(member: Member): Member {
  const url = LINKEDIN_BY_NAME[normalizeName(member.name)];
  return url ? { ...member, linkedin: url } : member;
}

/* ------------------------------------------------------------------ */
/* Small reusable pieces                                               */
/* ------------------------------------------------------------------ */

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <h2 className="font-inter text-3xl font-bold text-white">{children}</h2>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
    </div>
  );
}

const iconLinkClass =
  "text-white/60 transition-colors hover:text-purple-300";

function MemberCard({
  member,
  featured = false,
}: {
  member: Member;
  featured?: boolean;
}) {
  const hasLinkedIn = !!member.linkedin && member.linkedin.trim() !== "";
  const hasLinks =
    hasLinkedIn || !!member.personalEmail || !!member.clubEmail;

  return (
    <div
      className={`
        flex
        items-center
        gap-4
        rounded-2xl
        border
        p-4
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-purple-400/40
        hover:shadow-[0_12px_32px_rgba(90,40,180,0.3)]
        ${
          featured
            ? "border-purple-400/30 bg-purple-500/10 hover:bg-purple-500/15"
            : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
        }
      `}
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-purple-400/30">
        <Image
          src={getProfileUrl(member.profilepic || "default.webp")}
          alt={`${member.name} - ${member.title} at BOLT UBC`}
          className="h-full w-full object-cover"
          width={80}
          height={80}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-inter text-base font-bold text-white">
          {member.name}
        </h3>
        <p className="line-clamp-2 font-inter text-sm leading-snug text-purple-200/80">
          {member.title}
        </p>

        {hasLinks && (
          <div className="mt-2.5 flex items-center gap-3">
            {member.personalEmail && (
              <a
                href={`mailto:${member.personalEmail}`}
                title={member.personalEmail}
                aria-label={`Email ${member.name} (personal)`}
                className={iconLinkClass}
              >
                <MailIcon className="h-5 w-5" />
              </a>
            )}
            {member.clubEmail && (
              <a
                href={`mailto:${member.clubEmail}`}
                title={member.clubEmail}
                aria-label={`Email ${member.name} (club)`}
                className={iconLinkClass}
              >
                <MailIcon className="h-5 w-5" />
              </a>
            )}
            {hasLinkedIn && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className={iconLinkClass}
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const gridClass =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TeamPage() {
  const [presidents, setPresidents] = useState<Member[]>([]);
  const [leadershipMembers, setLeadershipMembers] = useState<Member[]>([]);
  const [departmentTeams, setDepartmentTeams] = useState<TeamType[]>([]);
  const [isPastExecutivesExpanded, setIsPastExecutivesExpanded] =
    useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Separate presidents and other leadership members
    const leadershipTeam = teamData.teams.find(
      (team) => team.team_name === "Leadership"
    );
    if (leadershipTeam) {
      const presidentMembers = leadershipTeam.executives.filter(
        (member) =>
          member.title === "President" || member.title.includes("President")
      );
      const otherLeadership = leadershipTeam.executives.filter(
        (member) =>
          member.title !== "President" && !member.title.includes("President")
      );

      setPresidents(presidentMembers.map(withLinkedIn));
      setLeadershipMembers(otherLeadership.map(withLinkedIn));
    }

    // Get all other teams (departments) and move Advising to the end
    const departments = teamData.teams.filter(
      (team) => team.team_name !== "Leadership"
    );
    const advisingTeam = departments.find(
      (team) => team.team_name === "Advising"
    );
    const otherDepartments = departments.filter(
      (team) => team.team_name !== "Advising"
    );

    // Put Advising at the end
    const reorderedDepartments = [...otherDepartments];
    if (advisingTeam) {
      reorderedDepartments.push(advisingTeam);
    }

    setDepartmentTeams(
      reorderedDepartments.map((team) => ({
        ...team,
        executives: team.executives.map(withLinkedIn),
      }))
    );
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07020f] text-white selection:bg-purple-500/30">
      {/* Dark base with purple glow, matching the Events page */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 70% 40%, rgba(108, 42, 220, 0.30), transparent 65%),
            radial-gradient(ellipse 40% 30% at 90% 12%, rgba(145, 65, 255, 0.14), transparent 70%),
            radial-gradient(ellipse 55% 40% at 20% 85%, rgba(90, 35, 190, 0.18), transparent 70%),
            #07020f
          `,
        }}
      />

      {/* Faint stars */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(255, 255, 255, 0.9) 1px, transparent 1.5px),
            radial-gradient(circle, rgba(190, 120, 255, 0.7) 1px, transparent 1.5px)
          `,
          backgroundSize: "225px 225px, 310px 310px",
          backgroundPosition: "20px 30px, 90px 120px",
        }}
      />

      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative z-10 pb-12 pt-28 sm:pt-32">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          {/* Header (left aligned, like the Events page) */}
          <div className="mb-10">
            <p className="mb-2 font-inter text-sm uppercase tracking-[0.3em] text-purple-300">
              BOLT UBC
            </p>
            <h1 className="mb-3 font-inter text-4xl font-bold md:text-5xl">
              Our Team
            </h1>
            <p className="max-w-2xl font-inter text-base text-white/70">
              Meet the passionate individuals who make BOLT UBC possible
            </p>
          </div>

          {/* Leadership: presidents first (highlighted), then the rest */}
          {(presidents.length > 0 || leadershipMembers.length > 0) && (
            <section className="mb-10">
              <SectionTitle>Leadership</SectionTitle>
              <div className={gridClass}>
                {presidents.map((member, index) => (
                  <MemberCard key={`p-${index}`} member={member} featured />
                ))}
                {leadershipMembers.map((member, index) => (
                  <MemberCard key={`l-${index}`} member={member} />
                ))}
              </div>
            </section>
          )}

          {/* Department Teams */}
          {departmentTeams.map((team, teamIndex) => (
            <section key={teamIndex} className="mb-10">
              <SectionTitle>{team.team_name}</SectionTitle>
              <div className={gridClass}>
                {team.executives.map((member, index) => (
                  <MemberCard key={index} member={member} />
                ))}
              </div>
            </section>
          ))}

          {/* Past Executives */}
          <section className="mb-4">
            <SectionTitle>Past Executives</SectionTitle>

            <button
              onClick={() =>
                setIsPastExecutivesExpanded(!isPastExecutivesExpanded)
              }
              className="flex w-full items-center justify-between rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 font-inter text-base font-semibold text-white shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-purple-400/40 hover:bg-purple-500/10 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]"
            >
              <span>Executive Team 2025-2026</span>
              <svg
                className={`h-5 w-5 transition-transform duration-200 ${
                  isPastExecutivesExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isPastExecutivesExpanded && (
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg backdrop-blur-lg">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {teamData.pastExecutives["2025-2026"].map((member, index) => (
                    <div key={index} className="py-1">
                      <div className="font-inter text-xs font-semibold text-white">
                        {member.name}
                      </div>
                      <div className="font-inter text-xs text-purple-200/70">
                        {member.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { TeamData, Team as TeamType, Member } from "../../types/types";
import { getProfileUrl } from "../../lib/assets";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Import with type assertion for JSON data
import teamDataJson from "../../lib/team.json";
const teamData = teamDataJson as unknown as TeamData;

export default function TeamPage() {
  const [presidents, setPresidents] = useState<Member[]>([]);
  const [leadershipMembers, setLeadershipMembers] = useState<Member[]>([]);
  const [departmentTeams, setDepartmentTeams] = useState<TeamType[]>([]);
  const [isPastExecutivesExpanded, setIsPastExecutivesExpanded] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Separate presidents and other leadership members
    const leadershipTeam = teamData.teams.find(team => team.team_name === "Leadership");
    if (leadershipTeam) {
      const presidentMembers = leadershipTeam.executives.filter(member =>
        member.title === "President" || member.title.includes("President")
      );
      const otherLeadership = leadershipTeam.executives.filter(member =>
        member.title !== "President" && !member.title.includes("President")
      );

      setPresidents(presidentMembers);
      setLeadershipMembers(otherLeadership);
    }

    // Get all other teams (departments) and move Advising to the end
    const departments = teamData.teams.filter(team => team.team_name !== "Leadership");
    const advisingTeam = departments.find(team => team.team_name === "Advising");
    const otherDepartments = departments.filter(team => team.team_name !== "Advising");

    // Put Advising at the end
    const reorderedDepartments = [...otherDepartments];
    if (advisingTeam) {
      reorderedDepartments.push(advisingTeam);
    }

    setDepartmentTeams(reorderedDepartments);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h1 className="font-inter text-3xl md:text-4xl font-bold text-black mb-4">
              Our Team
            </h1>
            <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the passionate individuals who make BOLT UBC possible
            </p>
          </div>

          {/* Leadership */}
          {(presidents.length > 0 || leadershipMembers.length > 0) && (
            <div className="mb-8">
              <h2 className="font-inter text-lg md:text-xl font-bold text-black mb-4 text-center">
                Leadership
            </h2>

              {/* Presidents Row */}
              {presidents.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {presidents.map((member, index) => (
                    <div key={index} className="text-center px-1 py-2 min-w-[120px]">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                    <img
                      src={getProfileUrl(member.profilepic || 'default.webp')}
                      alt={`${member.name} - ${member.title} at BOLT UBC`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                          width="64"
                          height="64"
                    />
                  </div>
                      <h3 className="font-inter text-xs font-bold text-black mb-1">
                    {member.name}
                  </h3>
                      <p className="font-inter text-xs text-gray-600 mb-2">
                    {member.title}
                  </p>
                      {member.personalEmail && (
                        <a
                          href={`mailto:${member.personalEmail}`}
                          className="font-inter text-xs text-black hover:text-gray-600 transition-colors mb-1 block"
                        >
                          {member.personalEmail}
                        </a>
                      )}
                      {member.clubEmail && (
                        <a
                          href={`mailto:${member.clubEmail}`}
                          className="font-inter text-xs text-black hover:text-gray-600 transition-colors mb-2 block"
                        >
                          {member.clubEmail}
                        </a>
                      )}
                      <div className="mt-2">
                        {member.linkedin && member.linkedin.trim() !== "" ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <svg className="w-5 h-5 text-black hover:text-gray-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        ) : (
                          <div className="inline-block">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Other Leadership Row */}
              {leadershipMembers.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4">
                  {leadershipMembers.map((member, index) => (
                    <div key={index} className="text-center px-1 py-2 min-w-[120px]">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                        <img
                          src={getProfileUrl(member.profilepic || 'default.webp')}
                          alt={`${member.name} - ${member.title} at BOLT UBC`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          width="64"
                          height="64"
                        />
                      </div>
                      <h3 className="font-inter text-xs font-bold text-black mb-1">
                        {member.name}
                      </h3>
                      <p className="font-inter text-xs text-gray-600 mb-2">
                        {member.title}
                      </p>
                      {member.personalEmail && (
                        <a
                          href={`mailto:${member.personalEmail}`}
                          className="font-inter text-xs text-black hover:text-gray-600 transition-colors mb-1 block"
                        >
                          {member.personalEmail}
                        </a>
                      )}
                      {member.clubEmail && (
                        <a
                          href={`mailto:${member.clubEmail}`}
                          className="font-inter text-xs text-black hover:text-gray-600 transition-colors mb-2 block"
                        >
                          {member.clubEmail}
                    </a>
                  )}
                      <div className="mt-2">
                        {member.linkedin && member.linkedin.trim() !== "" ? (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <svg className="w-5 h-5 text-black hover:text-gray-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        ) : (
                          <div className="inline-block">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Department Teams */}
          {departmentTeams.map((team, teamIndex) => (
            <div key={teamIndex} className="mb-8">
              <h2 className="font-inter text-lg md:text-xl font-bold text-black mb-4 text-center">
                {team.team_name}
            </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {team.executives.map((member, index) => (
                <div
                  key={index}
                    className="text-center p-4 min-w-[120px]"
                >
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                    <img
                      src={getProfileUrl(member.profilepic || 'default.webp')}
                      alt={`${member.name} - ${member.title} at BOLT UBC`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                        width="64"
                        height="64"
                    />
                  </div>
                    <h3 className="font-inter text-xs font-bold text-black mb-1">
                    {member.name}
                  </h3>
                    <p className="font-inter text-xs text-gray-600 mb-2">
                    {member.title}
                  </p>
                    {member.personalEmail && (
                      <a
                        href={`mailto:${member.personalEmail}`}
                        className="font-inter text-xs text-black hover:text-gray-600 transition-colors mb-1 block"
                      >
                        {member.personalEmail}
                      </a>
                    )}
                    {member.clubEmail && (
                      <a
                        href={`mailto:${member.clubEmail}`}
                        className="font-inter text-xs text-black hover:text-gray-600 transition-colors mb-2 block"
                      >
                        {member.clubEmail}
                      </a>
                    )}
                  {member.linkedin && (
                      <div className="mt-2">
                        {member.linkedin && member.linkedin.trim() !== "" ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <svg className="w-5 h-5 text-black hover:text-gray-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        ) : (
                          <div className="inline-block">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                  )}
                </div>
              ))}
            </div>
            </div>
          ))}

          {/* Past Executives */}
          <div className="mb-8">
            <h2 className="font-inter text-lg md:text-xl font-bold text-black mb-4 text-center">
              Past Executives
            </h2>

            {/* Horizontal Bar */}
            <div className="w-full">
              <button
                onClick={() => setIsPastExecutivesExpanded(!isPastExecutivesExpanded)}
                className="w-full bg-black/20 backdrop-blur-lg hover:bg-black/30 text-white font-inter text-base font-semibold px-6 py-4 rounded-full transition-all duration-300 flex items-center justify-between shadow-lg hover:shadow-xl border border-white/10"
              >
                <span>Executive Team 2025-2026</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isPastExecutivesExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Expanded Content */}
            {isPastExecutivesExpanded && (
              <div className="mt-4 bg-black/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {teamData.pastExecutives["2025-2026"].map((member, index) => (
                    <div key={index} className="text-center py-1">
                      <div className="font-inter text-xs font-semibold text-black">
                        {member.name}
                      </div>
                      <div className="font-inter text-xs text-gray-700">
                        {member.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

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
  const [allMembers, setAllMembers] = useState<Member[]>([]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Flatten all members from all teams
    const members: Member[] = [];
    teamData.teams.forEach((team: TeamType) => {
      team.executives.forEach((member: Member) => {
        members.push(member);
      });
    });
    setAllMembers(members);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f3] to-[#f0ede7]">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h1 className="font-inter text-4xl md:text-6xl font-bold text-black mb-4">
              Our Team
            </h1>
            <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the passionate individuals who make BOLT UBC possible
            </p>
          </div>

          {/* Leadership Team */}
          <div className="mb-16">
            <h2 className="font-inter text-2xl md:text-3xl font-bold text-black mb-8 text-center">
              Leadership Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamData.teams[0]?.executives.map((member, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
                >
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={getProfileUrl(member.profilepic || 'default.webp')}
                      alt={`${member.name} - ${member.title} at BOLT UBC`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width="200"
                      height="200"
                    />
                  </div>
                  <h3 className="font-inter text-lg font-bold text-black mb-2">
                    {member.name}
                  </h3>
                  <p className="font-inter text-sm text-gray-600 mb-3">
                    {member.title}
                  </p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* All Members */}
          <div className="mb-16">
            <h2 className="font-inter text-2xl md:text-3xl font-bold text-black mb-8 text-center">
              All Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
                >
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={getProfileUrl(member.profilepic || 'default.webp')}
                      alt={`${member.name} - ${member.title} at BOLT UBC`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width="200"
                      height="200"
                    />
                  </div>
                  <h3 className="font-inter text-lg font-bold text-black mb-2">
                    {member.name}
                  </h3>
                  <p className="font-inter text-sm text-gray-600 mb-3">
                    {member.title}
                  </p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

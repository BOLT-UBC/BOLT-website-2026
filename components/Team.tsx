"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Member, TeamData } from "../types/types";
import { getProfileUrl } from "../lib/assets";

// Import with type assertion for JSON data
import teamDataJson from "../lib/team.json";
const teamData = teamDataJson as unknown as TeamData;

const Team: React.FC = () => {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const navigate = useRouter();

  useEffect(() => {
    const members = teamData.teams.flatMap((team) =>
      team.executives.map((exec) => ({
        name: exec.name,
        title: exec.title,
        profilepic: exec.profilepic,
      }))
    );
    setAllMembers(members);
  }, []);

  // Split members into two halves for two carousels
  const firstHalf = allMembers.slice(0, Math.ceil(allMembers.length / 2));
  const secondHalf = allMembers.slice(Math.ceil(allMembers.length / 2));

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  return (
    <div className="w-full py-20 md:py-24 bg-gradient-to-br from-[#f8f7f3] to-[#f0ede7] flex flex-col items-center overflow-hidden relative" id="Team">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-8 md:mb-12">
        <h2 className="font-inter text-sm font-normal text-gray-600 mb-2 lowercase italic">Team</h2>
        <h1 className="font-inter text-2xl sm:text-3xl font-bold text-black mb-4 md:mb-6 leading-tight">Meet Our Team</h1>
      </div>

      <div className="w-full">
        <div className="w-full flex flex-col items-center gap-4">
          {/* First Carousel - Scrolling Right */}
          <div className="relative w-full">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f8f7f3] to-transparent z-10 pointer-events-none"></div>
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f0ede7] to-transparent z-10 pointer-events-none"></div>
            <div className="w-full overflow-hidden">
              <div className="flex gap-8 py-4 scroll-right">
                {[...firstHalf, ...firstHalf].map((member, index) => (
                  <div key={`first-${index}`} className="flex-shrink-0 flex flex-col items-center hover:-translate-y-2 transition-all duration-300 cursor-pointer group active:scale-95 active:-translate-y-1">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 transition-opacity duration-300 ${
                        loadedImages.has(index) ? "opacity-100" : "opacity-70"
                      }`}>
                        <img
                          src={getProfileUrl(member.profilepic || 'default.webp')}
                          alt={`${member.name} - ${member.title} at BOLT UBC`}
                          loading="lazy"
                          decoding="async"
                          onLoad={() => handleImageLoad(index)}
                          className="w-full h-full object-cover"
                          width="80"
                          height="80"
                        />
                      </div>
                    </div>
                    <div className="text-center mt-3 bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 border border-white/30 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/25 transition-all duration-300 group-active:shadow-lg group-active:shadow-purple-500/30 group-active:bg-white/30">
                      <div className="font-inter text-black font-medium text-sm">{member.name}</div>
                      <div className="font-inter text-gray-700 text-xs">{member.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Carousel - Scrolling Left */}
          <div className="relative w-full">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f8f7f3] to-transparent z-10 pointer-events-none"></div>
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f0ede7] to-transparent z-10 pointer-events-none"></div>
            <div className="w-full overflow-hidden">
              <div className="flex gap-8 py-4 scroll-left">
                {[...secondHalf, ...secondHalf].map((member, index) => (
                  <div key={`second-${index}`} className="flex-shrink-0 flex flex-col items-center hover:-translate-y-2 transition-all duration-300 cursor-pointer group active:scale-95 active:-translate-y-1">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 transition-opacity duration-300 ${
                        loadedImages.has(index + firstHalf.length) ? "opacity-100" : "opacity-70"
                      }`}>
                        <img
                          src={getProfileUrl(member.profilepic || 'default.webp')}
                          alt={`${member.name} - ${member.title} at BOLT UBC`}
                          loading="lazy"
                          decoding="async"
                          onLoad={() => handleImageLoad(index + firstHalf.length)}
                          className="w-full h-full object-cover"
                          width="80"
                          height="80"
                        />
                      </div>
                    </div>
                    <div className="text-center mt-3 bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 border border-white/30 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/25 transition-all duration-300 group-active:shadow-lg group-active:shadow-purple-500/30 group-active:bg-white/30">
                      <div className="font-inter text-black font-medium text-sm">{member.name}</div>
                      <div className="font-inter text-gray-700 text-xs">{member.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View More Button */}
          <div className="mt-8">
            <button
              onClick={() => navigate.push('/team')}
              className="bg-black/20 backdrop-blur-lg text-white font-inter font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:bg-black/30 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 flex items-center gap-2 group"
            >
              View More
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;

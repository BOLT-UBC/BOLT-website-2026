"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Member, TeamData } from "../types/types";
import { getProfileUrl } from "../lib/assets";

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

  const firstHalf = allMembers.slice(
    0,
    Math.ceil(allMembers.length / 2)
  );

  const secondHalf = allMembers.slice(
    Math.ceil(allMembers.length / 2)
  );

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  return (
    <section
      id="Team"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#07020f]
        py-20
        text-white
        md:py-24
      "
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[10%] h-[450px] w-[450px] rounded-full bg-purple-700/15 blur-[140px]" />

        <div className="absolute right-[-15%] top-[30%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(255,255,255,.9) 1px, transparent 1.5px),
              radial-gradient(circle, rgba(190,120,255,.7) 1px, transparent 1.5px)
            `,
            backgroundSize: "180px 180px, 260px 260px",
            backgroundPosition: "20px 30px, 90px 120px",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 mx-auto mb-10 max-w-6xl px-6 md:mb-12 md:px-8">
        <p className="mb-3 font-inter text-xs font-semibold uppercase tracking-[0.25em] text-purple-300 sm:text-sm">
          The People Behind BOLT
        </p>

        <h1 className="font-inter text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Meet Our{" "}
          <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
            Team
          </span>
        </h1>

        <div className="mt-5 h-[2px] w-20 bg-gradient-to-r from-purple-500 to-transparent" />
      </div>

      {/* Carousels */}
      <div className="relative z-10 w-full">
        <div className="flex flex-col gap-5">
          {/* First Row */}
          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-20 bg-gradient-to-r from-[#07020f] to-transparent md:w-32" />

            <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-20 bg-gradient-to-l from-[#07020f] to-transparent md:w-32" />

            <div className="overflow-hidden">
              <div className="flex w-max gap-6 py-4 md:gap-8 scroll-right">
                {[...firstHalf, ...firstHalf].map((member, index) => {
                  const imageIndex = index % firstHalf.length;

                  return (
                    <div
                      key={`first-${index}`}
                      className="
                        group
                        flex
                        w-[150px]
                        flex-shrink-0
                        cursor-pointer
                        flex-col
                        items-center
                        transition-all
                        duration-300
                        hover:-translate-y-2
                      "
                    >
                      {/* Profile */}
                      <div
                        className={`
                          relative
                          h-24
                          w-24
                          overflow-hidden
                          rounded-full
                          border
                          border-white/15
                          bg-white/[0.04]
                          shadow-[0_0_25px_rgba(125,45,255,0.08)]
                          transition-all
                          duration-300
                          group-hover:border-purple-400/50
                          group-hover:shadow-[0_0_30px_rgba(125,45,255,0.25)]
                          ${
                            loadedImages.has(imageIndex)
                              ? "opacity-100"
                              : "opacity-70"
                          }
                        `}
                      >
                        <img
                          src={getProfileUrl(
                            member.profilepic || "default.webp"
                          )}
                          alt={`${member.name} - ${member.title} at BOLT UBC`}
                          loading="lazy"
                          decoding="async"
                          onLoad={() => handleImageLoad(imageIndex)}
                          className="h-full w-full object-cover"
                          width="96"
                          height="96"
                        />
                      </div>

                      {/* Name */}
                      <div
                        className="
                          mt-4
                          w-full
                          rounded-xl
                          border
                          border-white/10
                          bg-white/[0.04]
                          px-3
                          py-3
                          text-center
                          backdrop-blur-xl
                          transition-all
                          duration-300
                          group-hover:border-purple-400/25
                          group-hover:bg-white/[0.06]
                        "
                      >
                        <div className="font-inter text-sm font-medium text-white">
                          {member.name}
                        </div>

                        <div className="mt-1 font-inter text-xs text-white/45">
                          {member.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-20 bg-gradient-to-r from-[#07020f] to-transparent md:w-32" />

            <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-20 bg-gradient-to-l from-[#07020f] to-transparent md:w-32" />

            <div className="overflow-hidden">
              <div className="flex w-max gap-6 py-4 md:gap-8 scroll-left">
                {[...secondHalf, ...secondHalf].map((member, index) => {
                  const imageIndex = index + firstHalf.length;

                  return (
                    <div
                      key={`second-${index}`}
                      className="
                        group
                        flex
                        w-[150px]
                        flex-shrink-0
                        cursor-pointer
                        flex-col
                        items-center
                        transition-all
                        duration-300
                        hover:-translate-y-2
                      "
                    >
                      <div
                        className={`
                          relative
                          h-24
                          w-24
                          overflow-hidden
                          rounded-full
                          border
                          border-white/15
                          bg-white/[0.04]
                          shadow-[0_0_25px_rgba(125,45,255,0.08)]
                          transition-all
                          duration-300
                          group-hover:border-purple-400/50
                          group-hover:shadow-[0_0_30px_rgba(125,45,255,0.25)]
                          ${
                            loadedImages.has(imageIndex)
                              ? "opacity-100"
                              : "opacity-70"
                          }
                        `}
                      >
                        <img
                          src={getProfileUrl(
                            member.profilepic || "default.webp"
                          )}
                          alt={`${member.name} - ${member.title} at BOLT UBC`}
                          loading="lazy"
                          decoding="async"
                          onLoad={() => handleImageLoad(imageIndex)}
                          className="h-full w-full object-cover"
                          width="96"
                          height="96"
                        />
                      </div>

                      <div
                        className="
                          mt-4
                          w-full
                          rounded-xl
                          border
                          border-white/10
                          bg-white/[0.04]
                          px-3
                          py-3
                          text-center
                          backdrop-blur-xl
                          transition-all
                          duration-300
                          group-hover:border-purple-400/25
                          group-hover:bg-white/[0.06]
                        "
                      >
                        <div className="font-inter text-sm font-medium text-white">
                          {member.name}
                        </div>

                        <div className="mt-1 font-inter text-xs text-white/45">
                          {member.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="relative z-30 mt-10 flex justify-center">
          <button
            onClick={() => navigate.push("/team")}
            className="
              group
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-white/[0.05]
              px-8
              py-3
              font-inter
              text-sm
              font-semibold
              text-white
              backdrop-blur-lg
              transition-all
              duration-300
              hover:border-purple-400/40
              hover:bg-purple-500/15
              hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]
            "
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
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Team;

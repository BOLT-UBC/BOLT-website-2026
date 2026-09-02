"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./Button";
import Navbar from "./Navbar";
import { SITE_URLS } from "../lib/config";
import { useAuth } from "../lib/useAuth";

const Hero: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <section
      id="Home"
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#07020f]
        text-white
      "
    >
      {/* ===================================================== */}
      {/* BACKGROUND */}
      {/* ===================================================== */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 60% 60% at 72% 48%,
              rgba(108, 42, 220, 0.34),
              transparent 65%
            ),
            radial-gradient(
              ellipse 35% 35% at 88% 25%,
              rgba(145, 65, 255, 0.18),
              transparent 70%
            ),
            radial-gradient(
              ellipse 40% 30% at 48% 88%,
              rgba(90, 35, 190, 0.14),
              transparent 70%
            ),
            #07020f
          `,
        }}
      />

      {/* ===================================================== */}
      {/* STARS */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-50
        "
        style={{
          backgroundImage: `
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.9) 1px,
              transparent 1.5px
            ),
            radial-gradient(
              circle,
              rgba(190, 120, 255, 0.7) 1px,
              transparent 1.5px
            )
          `,
          backgroundSize: "180px 180px, 260px 260px",
          backgroundPosition: "20px 30px, 90px 120px",
        }}
      />

      {/* A few brighter stars */}
      <div
        className="
          pointer-events-none
          absolute
          left-[36%]
          top-[18%]
          h-2
          w-2
          rounded-full
          bg-purple-300
          shadow-[0_0_14px_5px_rgba(180,100,255,0.6)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[22%]
          top-[20%]
          h-1.5
          w-1.5
          rounded-full
          bg-white
          shadow-[0_0_12px_4px_rgba(255,255,255,0.5)]
        "
      />

      {/* ===================================================== */}
      {/* NAVBAR */}
      {/* ===================================================== */}

      <div className="relative z-50">
        <Navbar />
      </div>

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <div
        className="
          relative
          z-20
          mx-auto
          grid
          min-h-[760px]
          max-w-7xl
          grid-cols-1
          items-center
          gap-12
          px-6
          pb-16
          pt-28
          md:px-10
          lg:grid-cols-2
        "
      >
        {/* ================================================= */}
        {/* LEFT SIDE */}
        {/* ================================================= */}

        <div className="flex max-w-2xl flex-col">
          {/* Eyebrow */}
          <span
            className="
              mb-6
              text-xs
              uppercase
              tracking-[0.28em]
              text-purple-300
              sm:text-sm
            "
          >
            BOLT DEV SERVER
          </span>

          {/* Heading */}
          <h1
            className="
              text-6xl
              font-bold
              leading-[0.92]
              tracking-[-0.05em]
              sm:text-7xl
              lg:text-[92px]
            "
          >
            <span className="text-white">
              UBC&apos;s largest
            </span>

            <br />

            <span
              className="
                bg-gradient-to-r
                from-purple-300
                via-fuchsia-400
                to-purple-500
                bg-clip-text
                text-transparent
              "
            >
              data
            </span>{" "}

            <span className="text-white">
              club.
            </span>
          </h1>

          {/* Description */}
          <p
            className="
              mt-7
              max-w-xl
              text-lg
              leading-relaxed
              text-white/70
            "
          >
            Empowering UBC students to harness the power of data
            through hands-on workshops, case competitions, and
            networking events.
          </p>

          {/* Buttons */}
          <div
            className="
              -ml-6
              mt-8
              flex
              flex-col
              gap-4
              sm:flex-row
            "
          >
            <Button
              text="MEMBERSHIP PORTAL"
              onClick={() => {
                router.push(
                  user ? "/membership" : "/login?next=/membership"
                );
              }}
            />

            <Button
              text="EXPLORE EVENTS"
              outline
              onClick={() => {
                window.location.href = "/events";
              }}
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}

        <div
          className="
            relative
            hidden
            min-h-[560px]
            lg:block
          "
        >
          {/* --------------------------------------------- */}
          {/* Large purple galaxy glow */}
          {/* --------------------------------------------- */}

          <div
            className="
              pointer-events-none
              absolute
              right-[0]
              top-[20px]
              h-[500px]
              w-[500px]
              rounded-full
              bg-purple-700/25
              blur-[120px]
            "
          />

          {/* --------------------------------------------- */}
          {/* Secondary glow */}
          {/* --------------------------------------------- */}

          <div
            className="
              pointer-events-none
              absolute
              right-[90px]
              top-[90px]
              h-[300px]
              w-[300px]
              rounded-full
              bg-fuchsia-500/20
              blur-[80px]
            "
          />

          {/* --------------------------------------------- */}
          {/* Galaxy light streak */}
          {/* --------------------------------------------- */}

          <div
            className="
              pointer-events-none
              absolute
              right-[-80px]
              top-[170px]
              h-[2px]
              w-[650px]
              -rotate-[24deg]
              bg-gradient-to-r
              from-transparent
              via-purple-300/40
              to-transparent
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-[20px]
              top-[300px]
              h-px
              w-[420px]
              -rotate-[24deg]
              bg-gradient-to-r
              from-transparent
              via-fuchsia-300/25
              to-transparent
            "
          />

          {/* --------------------------------------------- */}
          {/* BOLT */}
          {/* --------------------------------------------- */}

          <Image
            src="/events/bolt.png"
            alt="BOLT lightning symbol"
            width={600}
            height={600}
            priority
            className="
              absolute
              right-[55px]
              top-[-10px]
              z-10
              w-[350px]
              object-contain
              drop-shadow-[0_0_15px_rgba(155,77,255,0.95)]
              drop-shadow-[0_0_40px_rgba(125,45,255,0.85)]
              drop-shadow-[0_0_80px_rgba(105,35,255,0.55)]
              xl:w-[410px]
            "
          />

          {/* --------------------------------------------- */}
          {/* MEMBERSHIP PORTAL */}
          {/* --------------------------------------------- */}

          <div
            className="
              absolute
              bottom-4
              right-0
              z-20
              w-[330px]
              rounded-2xl
              border
              border-white/15
              bg-[#120823]/80
              p-7
              shadow-2xl
              backdrop-blur-xl
            "
          >
            <div className="flex items-center gap-2.5">
              <span
                className="
                  flex
                  h-8
                  w-8
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-purple-400/30
                  bg-purple-500/15
                  text-purple-300
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12l2 2 4-4" />
                  <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
                </svg>
              </span>

              <span
                className="
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-purple-300
                "
              >
                Official Membership
              </span>
            </div>

            <h2
              className="
                mt-4
                text-2xl
                font-semibold
                leading-snug
              "
            >
              Become a BOLT member.
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-white/55
              "
            >
              Unlock exclusive events, workshops, and our
              industry network.
            </p>

            <button
              type="button"
              className="
                mt-6
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-purple-500
                via-fuchsia-500
                to-purple-600
                px-6
                py-4
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-purple-900/30
                transition
                hover:brightness-110
                hover:shadow-purple-500/40
              "
              onClick={() => {
                window.open(
                  SITE_URLS.membership,
                  "_blank"
                );
              }}
            >
              Get Membership
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <div
        className="
          relative
          z-20
          mx-auto
          max-w-7xl
          px-6
          pb-16
          md:px-10
        "
      >
        <div
          className="
            grid
            grid-cols-2
            overflow-hidden
            rounded-2xl
            border
            border-white/15
            bg-white/[0.02]
            backdrop-blur-sm
            md:grid-cols-4
          "
        >
          {[
            ["500+", "Members"],
            ["20+", "Events Hosted"],
            ["10+", "Industry Partners"],
            ["5+", "Years of Impact"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="
                border-white/10
                p-7
                text-center
                md:border-r
                md:last:border-r-0
              "
            >
              <div
                className="
                  text-3xl
                  font-semibold
                "
              >
                {value}
              </div>

              <div
                className="
                  mt-1
                  text-sm
                  text-white/55
                "
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================== */}
      {/* BOTTOM FADE */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-32
          bg-gradient-to-t
          from-[#07020f]
          to-transparent
        "
      />
    </section>
  );
};

export default Hero;
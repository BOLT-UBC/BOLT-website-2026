"use client";

import { memo } from "react";

const Partners: React.FC = memo(() => {
  const partners = [
    { name: "Google", logo: "/partners/google.webp" },
    { name: "Deloitte", logo: "/partners/deloitte.webp" },
    { name: "GeoComply", logo: "/partners/geocomply.webp" },
    { name: "EY", logo: "/partners/ey_white.webp" },
    { name: "Accenture", logo: "/partners/accenture_white.webp" },
    { name: "UBC", logo: "/partners/ubc_white.webp" },
    { name: "Mastercard", logo: "/partners/mastercard.webp" },
    { name: "Red Bull", logo: "/partners/redbull.webp" },
    { name: "CGI", logo: "/partners/cgi.webp" },
    { name: "Microsoft", logo: "/partners/microsoft.webp" },
  ];

  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section
      id="Partners"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#07020f]
        py-16
        md:py-20
      "
    >
      {/* ===================================================== */}
      {/* COSMIC BACKGROUND */}
      {/* ===================================================== */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 60% 65% at 50% 50%,
              rgba(108, 42, 220, 0.24),
              transparent 68%
            ),
            radial-gradient(
              ellipse 40% 45% at 85% 20%,
              rgba(145, 65, 255, 0.16),
              transparent 70%
            ),
            radial-gradient(
              ellipse 40% 35% at 15% 85%,
              rgba(90, 35, 190, 0.12),
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
          opacity-40
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

      {/* ===================================================== */}
      {/* CENTER GLOW */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[200px]
          w-[750px]
          -translate-x-1/2
          -translate-y-1/2
          -rotate-6
          rounded-full
          bg-purple-600/10
          blur-[90px]
        "
      />

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
          md:px-10
        "
      >
        {/* Heading */}
        <div className="mb-8 text-center md:mb-10">
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.28em]
              text-purple-300
              sm:text-sm
            "
          >
            Our Network
          </p>

          <h2
            className="
              mt-3
              text-3xl
              font-bold
              tracking-[-0.04em]
              text-white
              sm:text-4xl
            "
          >
            Industry partners
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-6
              text-white/50
              sm:text-base
            "
          >
            Collaborating with leading organizations to bring real-world data
            experiences to our community.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* LOGO CAROUSEL */}
      {/* ================================================= */}

      <div className="relative z-10 w-full overflow-hidden">
        {/* Left fade */}
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            z-20
            h-full
            w-20
            bg-gradient-to-r
            from-[#07020f]
            to-transparent
            md:w-36
          "
        />

        {/* Right fade */}
        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            z-20
            h-full
            w-20
            bg-gradient-to-l
            from-[#07020f]
            to-transparent
            md:w-36
          "
        />

        {/* Logos */}
        <div
          className="
            inline-flex
            w-max
            flex-nowrap
            gap-2
            py-5
            md:gap-5
            scroll-right-continuous
          "
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="
                group
                flex
                h-24
                w-32
                flex-shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                px-5
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-purple-400/30
                hover:bg-white/[0.05]
                hover:shadow-[0_0_30px_rgba(125,45,255,0.15)]
                sm:h-28
                sm:w-40
                md:w-44
              "
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="
                  max-h-12
                  w-full
                  object-contain
                  sm:max-h-14
                "
                loading="eager"
                decoding="sync"
                width="200"
                height="96"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================== */}
      {/* BOTTOM GLOW */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-px
          w-[80%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-purple-500/30
          to-transparent
        "
      />
    </section>
  );
});

Partners.displayName = "Partners";

export default Partners;

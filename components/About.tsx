"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";

const Carousel: React.FC<{
  images: string[];
  interval?: number;
  onImageLoad?: () => void;
}> = ({ images, interval = 4000, onImageLoad }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    if (typeof window === "undefined") return;

    timerRef.current = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, interval);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [images.length, interval]);

  const goTo = (i: number) => {
    setIndex((i + images.length) % images.length);
  };

  return (
    <div
      className="
        relative
        w-full
        max-w-[760px]
        sm:max-w-[640px]
        md:max-w-[800px]
        lg:max-w-[960px]
      "
    >
      {/* ===================================================== */}
      {/* IMAGE FRAME */}
      {/* ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-white/[0.025]
          p-2
          shadow-[0_0_60px_rgba(125,45,255,0.18)]
          backdrop-blur-md
        "
      >
        {/* 16:9 image container */}
        <div className="relative overflow-hidden rounded-2xl pb-[56.25%]">
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`About BOLT image ${i + 1}`}
              className={`
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-opacity
                duration-700
                ${
                  i === index
                    ? "z-20 opacity-100"
                    : "z-10 opacity-0"
                }
              `}
              loading="lazy"
              decoding="async"
              onLoad={() => onImageLoad?.()}
              width={1280}
              height={720}
            />
          ))}

          {/* Image overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-30
              bg-gradient-to-t
              from-black/20
              via-transparent
              to-white/[0.03]
            "
          />
        </div>
      </div>

      {/* ===================================================== */}
      {/* SLIDE INDICATORS */}
      {/* ===================================================== */}

      <div className="mt-5 flex justify-center gap-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`
              h-2
              rounded-full
              transition-all
              duration-300
              ${
                i === index
                  ? "w-7 bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
                  : "w-2 bg-white/25 hover:bg-white/50"
              }
            `}
          />
        ))}
      </div>

      {/* ===================================================== */}
      {/* PREVIOUS BUTTON */}
      {/* ===================================================== */}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous image"
            className="
              absolute
              left-4
              top-1/2
              z-40
              flex
              h-10
              w-10
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-black/40
              text-xl
              text-white
              backdrop-blur-md
              transition
              hover:border-purple-400/40
              hover:bg-purple-600/50
            "
          >
            ‹
          </button>

          {/* ================================================= */}
          {/* NEXT BUTTON */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next image"
            className="
              absolute
              right-4
              top-1/2
              z-40
              flex
              h-10
              w-10
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-black/40
              text-xl
              text-white
              backdrop-blur-md
              transition
              hover:border-purple-400/40
              hover:bg-purple-600/50
            "
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

const About: React.FC = memo(() => {
  const images = [
    "/images/Image1.webp",
    "/images/Image2.webp",
  ];

  const handleImageLoad = () => {
    // Optional loading state
  };

  return (
    <section
      id="About"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#07020f]
        px-6
        py-20
        text-white
        sm:px-6
        md:px-10
        md:py-24
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
              ellipse 55% 65% at 18% 45%,
              rgba(108, 42, 220, 0.22),
              transparent 68%
            ),
            radial-gradient(
              ellipse 50% 60% at 82% 50%,
              rgba(145, 65, 255, 0.20),
              transparent 68%
            ),
            radial-gradient(
              ellipse 40% 35% at 50% 90%,
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
      {/* GALAXY STREAK */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[15%]
          top-1/2
          h-px
          w-[900px]
          -rotate-[18deg]
          bg-gradient-to-r
          from-transparent
          via-purple-400/20
          to-transparent
          blur-sm
        "
      />

      {/* ===================================================== */}
      {/* LEFT PURPLE GLOW */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-[180px]
          top-[20%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-purple-700/15
          blur-[130px]
        "
      />

      {/* ===================================================== */}
      {/* RIGHT PURPLE GLOW */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-[180px]
          top-[35%]
          h-[550px]
          w-[550px]
          rounded-full
          bg-violet-600/15
          blur-[140px]
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
          grid
          w-full
          max-w-7xl
          grid-cols-1
          items-center
          gap-12
          lg:grid-cols-2
          lg:gap-20
        "
      >
        {/* ================================================= */}
        {/* LEFT — TEXT */}
        {/* ================================================= */}

        <div className="max-w-xl">
          {/* Eyebrow */}
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
            About BOLT
          </p>

          {/* Heading */}
          <h1
            className="
              mt-4
              text-4xl
              font-bold
              leading-[0.95]
              tracking-[-0.045em]
              text-white
              sm:text-5xl
              lg:text-6xl
            "
          >
            Growth and{" "}
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
              Community
            </span>
          </h1>

          {/* Small accent line */}
          <div
            className="
              mt-6
              h-px
              w-24
              bg-gradient-to-r
              from-purple-400
              to-transparent
            "
          />

          {/* Paragraphs */}
          <div
            className="
              mt-7
              max-w-lg
              space-y-5
            "
          >
            <p
              className="
                text-sm
                leading-7
                text-white/65
                sm:text-base
              "
            >
              Bolt provides an enriching platform that fosters
              collaboration, presents intellectually{" "}
              <strong className="font-semibold text-white">
                stimulating challenges
              </strong>
              , and facilitates{" "}
              <strong className="font-semibold text-white">
                hands-on experiences
              </strong>
              .
            </p>

            <p
              className="
                text-sm
                leading-7
                text-white/65
                sm:text-base
              "
            >
              This unique opportunity is open to students from
              diverse backgrounds, inviting them to immerse
              themselves in the dynamic realm of business
              analytics.
            </p>

            <p
              className="
                text-sm
                leading-7
                text-white/65
                sm:text-base
              "
            >
              Our mission is to{" "}
              <strong className="font-semibold text-white">
                foster a growth mindset
              </strong>{" "}
              in the community and help students{" "}
              <strong className="font-semibold text-white">
                develop data analytics skills
              </strong>{" "}
              to be successful in their careers.
            </p>

            <p
              className="
                text-sm
                leading-7
                text-white/65
                sm:text-base
              "
            >
              Anyone with an interest in data, analytics, or tech
              is invited to join us on our journey.
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT — CAROUSEL */}
        {/* ================================================= */}

        <div
          className="
            relative
            mt-4
            flex
            items-center
            justify-center
            lg:mt-0
          "
        >
          {/* Glow behind image */}
          <div
            className="
              pointer-events-none
              absolute
              h-[320px]
              w-[520px]
              rounded-full
              bg-purple-600/20
              blur-[110px]
            "
          />

          {/* Secondary glow */}
          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              h-[180px]
              w-[180px]
              rounded-full
              bg-fuchsia-500/10
              blur-[70px]
            "
          />

          <div className="relative z-10 w-full">
            <Carousel
              images={images}
              interval={4000}
              onImageLoad={handleImageLoad}
            />
          </div>
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
          h-28
          bg-gradient-to-t
          from-[#07020f]
          to-transparent
        "
      />
    </section>
  );
});

About.displayName = "About";

export default About;
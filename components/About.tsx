"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const VISIBLE = 4; // how many cards peek out of the stack
const SWIPE_THRESHOLD = 60; // px of drag needed to flip a card

// Per-image focal point ("x% y%"). A LOWER y% moves the picture DOWN in the frame,
// a HIGHER y% moves it UP. Images not listed here stay centered.
const IMAGE_POSITION: Record<string, string> = {
  "/images/Image3.webp": "center 20%",
};

const Carousel: React.FC<{
  images: string[];
  interval?: number;
  onImageLoad?: () => void;
}> = ({ images, interval = 4500, onImageLoad }) => {
  const [failed, setFailed] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  // Images that 404 are skipped so you never see a broken card.
  // Check your browser console to see which paths failed.
  const list = images.filter((src) => !failed.includes(src));
  const count = list.length;

  const handleError = (src: string) => {
    console.warn(`[About carousel] Could not load image: ${src}`);
    setFailed((f) => (f.includes(src) ? f : [...f, src]));
  };

  const go = useCallback(
    (delta: number) =>
      setIndex((c) => (count ? (((c + delta) % count) + count) % count : 0)),
    [count]
  );

  const goTo = (i: number) => setIndex(((i % count) + count) % count);

  // Autoplay (index in deps so manual navigation restarts the timer)
  useEffect(() => {
    if (count <= 1 || paused || dragging) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => go(1), interval);
    return () => window.clearInterval(id);
  }, [count, paused, dragging, interval, go, index]);

  // ---- Drag / swipe / tap on the front card ----
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    moved.current = false;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) moved.current = true;
    setDragX(dx);
  };

  const finishDrag = (commit: boolean) => {
    if (commit && count > 1) {
      if (Math.abs(dragX) > SWIPE_THRESHOLD) {
        go(dragX < 0 ? 1 : -1);
      } else if (!moved.current) {
        go(1); // plain tap/click = next card
      }
    }
    startX.current = null;
    setDragX(0);
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  if (count === 0) return null;

  return (
    <div
      className="relative w-full max-w-[760px] md:max-w-[800px] lg:max-w-[960px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* ===================================================== */}
      {/* CARD DECK */}
      {/* ===================================================== */}

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="About BOLT photos"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => finishDrag(true)}
        onPointerCancel={() => finishDrag(false)}
        className="relative aspect-video w-[86%] cursor-grab touch-pan-y select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#07020f] active:cursor-grabbing"
      >
        {list.map((src, i) => {
          const offset = (((i - index) % count) + count) % count; // 0 = front
          const isFront = offset === 0;
          const isVisible = offset < VISIBLE;
          const depth = Math.min(offset, VISIBLE - 1);

          const x = depth * 5; // % of card width, fans out to the right
          const y = -depth * 3.5; // % of card height, rises slightly
          const rot = depth * 2.2; // degrees
          const scale = 1 - depth * 0.05;
          const dx = isFront ? dragX : 0;

          return (
            <div
              key={src}
              aria-hidden={!isFront}
              className={`pointer-events-none absolute inset-0 overflow-hidden rounded-2xl border bg-[#0d0618] ${
                isFront
                  ? "border-white/20 shadow-[0_0_60px_rgba(125,45,255,0.35)]"
                  : "border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
              }`}
              style={{
                zIndex: count - offset,
                opacity: isVisible ? 1 : 0,
                transformOrigin: "bottom left",
                transform: `translate(${x}%, ${y}%) translate(${dx}px, 0) rotate(${
                  rot + dx / 30
                }deg) scale(${scale})`,
                filter: `brightness(${1 - depth * 0.16})`,
                transition:
                  dragging && isFront
                    ? "none"
                    : "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease, filter 500ms ease",
              }}
            >
              <Image
                src={src}
                alt={`About BOLT image ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 520px, 86vw"
                priority={i === 0}
                draggable={false}
                onLoad={() => onImageLoad?.()}
                onError={() => handleError(src)}
                className="object-cover"
                style={{ objectPosition: IMAGE_POSITION[src] ?? "center" }}
              />

              {/* soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[0.03]" />
            </div>
          );
        })}
      </div>

      {/* ===================================================== */}
      {/* CONTROLS */}
      {/* ===================================================== */}

      {count > 1 && (
        <div className="mt-8 flex w-[86%] items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/40 text-xl text-white backdrop-blur-md transition hover:border-purple-400/40 hover:bg-purple-600/50"
          >
            ‹
          </button>

          <div className="flex items-center gap-3">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-7 bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
                    : "w-2 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/40 text-xl text-white backdrop-blur-md transition hover:border-purple-400/40 hover:bg-purple-600/50"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

const About: React.FC = memo(() => {
  const images = [
    "/images/Image1.webp",
    "/images/Image2.webp",
    "/images/Image3.webp",
    "/images/Image4.webp",
    "/images/Image5.webp",
    "/images/Image6.webp",
    "/images/Image7.webp",
  ];

  const handleImageLoad = () => {
    // Optional loading state
  };

  return (
    <section
      id="About"
      className="relative w-full overflow-hidden bg-[#07020f] px-6 py-20 text-white sm:px-6 md:px-10 md:py-24"
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
        className="pointer-events-none absolute inset-0 opacity-40"
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

      <div className="pointer-events-none absolute left-[15%] top-1/2 h-px w-[900px] -rotate-[18deg] bg-gradient-to-r from-transparent via-purple-400/20 to-transparent blur-sm" />

      {/* ===================================================== */}
      {/* LEFT PURPLE GLOW */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute -left-[180px] top-[20%] h-[500px] w-[500px] rounded-full bg-purple-700/15 blur-[130px]" />

      {/* ===================================================== */}
      {/* RIGHT PURPLE GLOW */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute -right-[180px] top-[35%] h-[550px] w-[550px] rounded-full bg-violet-600/15 blur-[140px]" />

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* ================================================= */}
        {/* LEFT — TEXT */}
        {/* ================================================= */}

        <div className="max-w-xl">
          {/* Eyebrow */}
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-purple-300 sm:text-sm">
            About BOLT
          </p>

          {/* Heading */}
          <h1 className="mt-4 text-4xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Growth and{" "}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
              Community
            </span>
          </h1>

          {/* Small accent line */}
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-purple-400 to-transparent" />

          {/* Paragraphs */}
          <div className="mt-7 max-w-lg space-y-5">
            <p className="text-sm leading-7 text-white/65 sm:text-base">
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

            <p className="text-sm leading-7 text-white/65 sm:text-base">
              This unique opportunity is open to students from
              diverse backgrounds, inviting them to immerse
              themselves in the dynamic realm of business
              analytics.
            </p>

            <p className="text-sm leading-7 text-white/65 sm:text-base">
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

            <p className="text-sm leading-7 text-white/65 sm:text-base">
              Anyone with an interest in data, analytics, or tech
              is invited to join us on our journey.
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT — CAROUSEL */}
        {/* ================================================= */}

        <div className="relative mt-4 flex items-center justify-center lg:mt-0">
          {/* Glow behind image */}
          <div className="pointer-events-none absolute h-[320px] w-[520px] rounded-full bg-purple-600/20 blur-[110px]" />

          {/* Secondary glow */}
          <div className="pointer-events-none absolute right-0 top-0 h-[180px] w-[180px] rounded-full bg-fuchsia-500/10 blur-[70px]" />

          <div className="relative z-10 w-full">
            <Carousel
              images={images}
              interval={4500}
              onImageLoad={handleImageLoad}
            />
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* BOTTOM FADE */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#07020f] to-transparent" />
    </section>
  );
});

About.displayName = "About";

export default About;
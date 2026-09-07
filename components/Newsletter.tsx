"use client";

import { useState, memo } from "react";

const Newsletter: React.FC = memo(() => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);

    try {
      // Replace this with your actual email service later
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubscribed(true);
      setEmail("");
    } catch {
      // Handle subscription error here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="Newsletter"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#07020f]
        py-20
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
              ellipse 60% 70% at 72% 50%,
              rgba(108, 42, 220, 0.34),
              transparent 65%
            ),
            radial-gradient(
              ellipse 35% 40% at 88% 25%,
              rgba(145, 65, 255, 0.18),
              transparent 70%
            ),
            radial-gradient(
              ellipse 45% 35% at 30% 90%,
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
      {/* PURPLE GLOW */}
      {/* ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          top-1/2
          h-[450px]
          w-[450px]
          -translate-y-1/2
          rounded-full
          bg-purple-700/20
          blur-[120px]
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
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-10
            rounded-3xl
            border
            border-white/10
            bg-white/[0.025]
            px-7
            py-10
            backdrop-blur-md
            md:px-10
            md:py-12
            lg:grid-cols-2
            lg:gap-16
            lg:px-14
            lg:py-14
          "
        >
          {/* ================================================= */}
          {/* TEXT */}
          {/* ================================================= */}

          <div className="max-w-xl">
            <p
              className="
                mb-4
                text-xs
                font-medium
                uppercase
                tracking-[0.28em]
                text-purple-300
              "
            >
              Stay in the loop
            </p>

            <h2
              className="
                text-4xl
                font-bold
                leading-tight
                tracking-[-0.04em]
                text-white
                sm:text-5xl
              "
            >
              Stay connected
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
                with BOLT.
              </span>
            </h2>

            <p
              className="
                mt-5
                max-w-lg
                text-base
                leading-7
                text-white/60
                sm:text-lg
              "
            >
              Subscribe to our newsletter for exclusive updates on
              upcoming events, data analytics insights, workshops,
              and career opportunities in the tech industry.
            </p>
          </div>

          {/* ================================================= */}
          {/* NEWSLETTER FORM */}
          {/* ================================================= */}

          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="w-full"
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-stretch
                "
              >
                {/* Email input */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading || isSubscribed}
                  className="
                    min-w-0
                    flex-1
                    rounded-full
                    border
                    border-white/15
                    bg-white/[0.04]
                    px-5
                    py-4
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/35
                    transition
                    focus:border-purple-400/50
                    focus:bg-white/[0.06]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />

                {/* Subscribe button */}
                <button
                  type="submit"
                  disabled={isLoading || isSubscribed}
                  className="
                    rounded-full
                    bg-white
                    px-7
                    py-4
                    text-sm
                    font-semibold
                    text-[#120820]
                    transition
                    hover:bg-purple-100
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isLoading
                    ? "Subscribing..."
                    : isSubscribed
                      ? "Subscribed!"
                      : "Subscribe"}
                </button>
              </div>

              {/* Success message */}
              {isSubscribed && (
                <p
                  className="
                    mt-4
                    text-sm
                    text-purple-300
                  "
                >
                  Thanks for subscribing! Check your email for
                  confirmation.
                </p>
              )}

              {/* Privacy / reassurance text */}
              {!isSubscribed && (
                <p
                  className="
                    mt-4
                    text-xs
                    text-white/35
                  "
                >
                  No spam. Just BOLT updates, events, and opportunities.
                </p>
              )}
            </form>
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
          h-24
          bg-gradient-to-t
          from-[#07020f]
          to-transparent
        "
      />
    </section>
  );
});

Newsletter.displayName = "Newsletter";

export default Newsletter;
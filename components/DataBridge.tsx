"use client";

import { memo } from "react";

const DataBridge: React.FC = memo(() => {
  const services = [
    {
      title: "Data Analysis",
      description:
        "Comprehensive analysis of your business data to identify trends, patterns, and opportunities for growth.",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Data Visualization",
      description:
        "Create compelling dashboards and visualizations that make your data accessible and actionable.",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
    },
    {
      title: "Strategic Insights",
      description:
        "Transform raw data into strategic recommendations that drive business decisions and growth.",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="Solutions"
      className="relative w-full overflow-hidden bg-[#07020f] pb-10 pt-20 text-white md:pb-14 md:pt-24"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[20%] h-[500px] w-[500px] rounded-full bg-purple-700/15 blur-[140px]" />

        <div className="absolute right-[-15%] top-[10%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[150px]" />

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[120px]" />

        {/* Stars */}
        <div
          className="absolute inset-0 opacity-40"
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

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-8">
        {/* Heading */}
        <div className="mb-10 max-w-3xl md:mb-12">
          <p className="mb-3 font-inter text-xs font-semibold uppercase tracking-[0.25em] text-purple-300 sm:text-sm">
            Byte Consulting
          </p>

          <h1 className="mb-5 font-inter text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Free Data Consulting for{" "}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
              Local Businesses
            </span>
          </h1>

          <div className="mb-6 h-[2px] w-20 bg-gradient-to-r from-purple-500 to-transparent" />

          <p className="font-inter text-sm leading-relaxed text-white/65 md:text-base">
            Connect with our expert data analytics team for complimentary
            consulting services. We help local businesses in Vancouver unlock
            the power of their data through analysis, visualization, and
            strategic insights.
          </p>
        </div>

        {/* Service Cards */}
        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="
                group
                rounded-2xl
                border border-white/10
                bg-white/[0.035]
                p-6
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-purple-400/30
                hover:bg-white/[0.055]
                hover:shadow-[0_0_35px_rgba(125,45,255,0.12)]
              "
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-purple-300 transition-all duration-300 group-hover:bg-purple-500/20">
                {service.icon}
              </div>

              <h3 className="mb-3 font-inter text-base font-semibold text-white">
                {service.title}
              </h3>

              <p className="font-inter text-sm leading-relaxed text-white/55">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 font-inter text-sm leading-relaxed text-white/60">
            Our team of dedicated students across different disciplines is
            ready to help your business thrive. Contact us for a free
            consultation and discover how data can transform your operations.
          </p>

          <a
            href="mailto:boltubc@gmail.com"
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-full
              border border-white/15
              bg-white/[0.06]
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
            Contact Us

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
          </a>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="font-inter text-xs text-white/30">
            * All services are provided free of charge to local businesses as
            part of our educational mission.
          </p>
        </div>
      </div>
    </section>
  );
});

DataBridge.displayName = "DataBridge";

export default DataBridge;
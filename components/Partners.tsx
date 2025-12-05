"use client";

import { memo } from "react";

const Partners: React.FC = memo(() => {
  // Partner logos
  const partners = [
    { name: "Google", logo: "/partners/google.webp" },
    { name: "Deloitte", logo: "/partners/deloitte.webp" },
    { name: "GeoComply", logo: "/partners/geocomply.webp" },
    { name: "EY", logo: "/partners/ey.webp" },
    { name: "Accenture", logo: "/partners/accenture.webp" },
    { name: "UBC", logo: "/partners/ubc.webp" },
    { name: "Mastercard", logo: "/partners/mastercard.webp" },
    { name: "Red Bull", logo: "/partners/redbull.webp" },
    { name: "CGI", logo: "/partners/cgi.webp" },
    { name: "Microsoft", logo: "/partners/microsoft.webp" },
  ];

  // Triple the partners array for seamless continuous loop
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="w-full py-12 md:py-14 bg-gradient-to-r from-[#614ea5] to-[#493b7b] flex flex-col items-center justify-center overflow-hidden" id="Partners">
      {/* Description text - centered with max width */}
      <div className="max-w-6xl w-full mx-auto px-6 sm:px-6 md:px-8 text-center mb-6 md:mb-8">
        <p className="font-inter font-bold text-xs sm:text-sm leading-relaxed text-white max-w-2xl mx-auto px-2 break-words [text-shadow:0_0_15px_rgba(255,255,255,0.4),0_0_30px_rgba(158,142,255,0.3)]">
          Collaborating with leading organizations to bring real-world data experiences to our community
        </p>
      </div>

      {/* Carousel - full width */}
      <div className="relative w-full overflow-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#614ea5] to-transparent z-10 pointer-events-none"></div>
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#493b7b] to-transparent z-10 pointer-events-none"></div>
        <div className="inline-flex w-max gap-3 sm:gap-4 md:gap-6 scroll-right-continuous py-1 flex-nowrap">
          {duplicatedPartners.map((partner, index) => (
            <div key={`${partner.name}-${index}`} className="flex-shrink-0 p-1.5 sm:p-3 md:p-4 min-w-[100px] sm:min-w-[140px] md:min-w-[180px] hover:-translate-y-2 transition-transform duration-300 cursor-pointer active:scale-95 active:-translate-y-1">
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-auto object-contain max-h-12 sm:max-h-16 md:max-h-20"
                loading="eager"
                decoding="sync"
                width="200"
                height="96"
                style={{ imageRendering: 'auto' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Partners.displayName = 'Partners';

export default Partners;

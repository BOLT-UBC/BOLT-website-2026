"use client";

import React, { useEffect, useRef, memo } from "react";

const Partners: React.FC = memo(() => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Partner logos
  const partners = [
    { name: "UBC", logo: "/partners/ubc.webp" },
    { name: "Mastercard", logo: "/partners/mastercard.webp" },
    { name: "Red Bull", logo: "/partners/redbull.webp" },
    { name: "CGI", logo: "/partners/cgi.webp" },
    { name: "Microsoft", logo: "/partners/microsoft.webp" },
    { name: "Google", logo: "/partners/google.webp" },
    { name: "Deloitte", logo: "/partners/deloitte_logo.webp" },
  ];

  // Duplicate partners array for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  useEffect(() => {
    const carouselContainer = carouselRef.current;
    if (!carouselContainer) return;

    const carousel = carouselContainer.querySelector('.flex') as HTMLElement;
    if (!carousel) return;

    let animationId: number;
    let position = 0;

    // Function to get responsive dimensions and speed
    const getDimensions = () => {
      if (typeof window === 'undefined') return { partnerWidth: 200, gap: 32, totalWidth: 232, speed: 1.5 };

      const width = window.innerWidth;
      const partnerWidth = width < 640 ? 120 : width < 768 ? 160 : 200;
      const gap = width < 640 ? 16 : width < 768 ? 24 : 32;
      // Slower, more stable speed on mobile for better iPhone compatibility
      const speed = width < 640 ? 1.0 : width < 768 ? 1.5 : 1.5;
      return { partnerWidth, gap, totalWidth: partnerWidth + gap, speed };
    };

    let dimensions = getDimensions();

    const animate = () => {
      position -= dimensions.speed;

      // Reset position when we've scrolled one full set
      if (Math.abs(position) >= partners.length * dimensions.totalWidth) {
        position = 0;
      }

      carousel.style.transform = `translate3d(${position}px, 0, 0)`;
      carousel.style.willChange = 'transform';
      animationId = requestAnimationFrame(animate);
    };

    // Start animation with a small delay for better iPhone compatibility
    setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 100);

    // Handle window resize
    const handleResize = () => {
      dimensions = getDimensions();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }

    // No hover pause functionality - let carousel run continuously

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [partners.length]);

  return (
    <section className="w-full py-12 md:py-14 bg-gradient-to-r from-[#614ea5] to-[#493b7b] flex flex-col items-center justify-center overflow-hidden" id="Partners">
      {/* Description text - centered with max width */}
      <div className="max-w-6xl w-full mx-auto px-6 sm:px-6 md:px-8 text-center mb-6 md:mb-8">
        <p className="font-inter text-xs sm:text-sm leading-relaxed opacity-90 text-white max-w-2xl mx-auto px-2 break-words">
          Collaborating with leading organizations to bring real-world data experiences to our community
        </p>
      </div>

      {/* Carousel - full width */}
      <div className="relative w-full overflow-hidden" ref={carouselRef}>
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#614ea5] to-transparent z-10 pointer-events-none"></div>
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#493b7b] to-transparent z-10 pointer-events-none"></div>
        <div className="flex gap-3 sm:gap-4 md:gap-6 will-change-transform py-1" style={{ transform: 'translate3d(0, 0, 0)' }}>
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

/*import React, { memo } from "react";
import byteImage from "../assets/images/Byte.webp";

const About: React.FC = memo(() => {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f7f3] to-[#f0ede7] text-black text-left w-full py-20 md:py-24 px-6 sm:px-6 md:px-8 relative overflow-hidden" id="About">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <h2 className="font-inter text-sm md:text-base font-normal text-gray-600 mb-2 lowercase italic">About us</h2>
          <h1 className="font-inter text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 md:mb-8 leading-tight">Growth and Community</h1>
          <div className="max-w-lg">
            <p className="font-inter text-sm leading-relaxed text-gray-800 mb-6 font-normal">
              Bolt provides an enriching platform that fosters collaboration,
              presents intellectually <strong className="font-bold text-black">stimulating challenges</strong>, and facilitates
              <strong className="font-bold text-black">hands-on experiences</strong>. This unique opportunity is open to students from
              diverse backgrounds, inviting them to immerse themselves in the
              dynamic realm of business analytics.
            </p>
            <p className="font-inter text-sm leading-relaxed text-gray-800 font-normal">
              Our mission is to <strong className="font-bold text-black">foster a growth mindset</strong> in the community and help students
              <strong className="font-bold text-black">develop data analytics skills</strong> to be successful in their careers. Anyone with a
              interest for data, analytics, or tech is invited to join us on our journey.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center mt-8 lg:mt-0">
          <img
            src={byteImage}
            alt="BOLT UBC community members collaborating on data analytics projects"
            className="w-48 sm:w-56 md:w-64 h-auto object-contain"
            loading="lazy"
            decoding="async"
            width="256"
            height="256"
          />
        </div>
      </div>
    </div>
  );
});

About.displayName = 'About';

export default About;*/

// ...existing code...
import React, { memo, useEffect, useRef, useState } from "react";
import byteImage from "../assets/images/Byte.webp";
import groupImage1 from "../assets/images/Image1.webp";
import groupImage2 from "../assets/images/Image2.webp";

// ...existing code...
const Carousel: React.FC<{ images: string[]; interval?: number }> = ({ images, interval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [images.length, interval]);

  const goTo = (i: number) => setIndex((i + images.length) % images.length);

  return (
    // bigger responsive container: full width on small screens, capped on larger screens
    <div className="relative w-full max-w-[760px] sm:max-w-[640px] md:max-w-[800px] lg:max-w-[960px]">
      {/* 16:9 aspect ratio for a wider carousel */}
      <div className="relative pb-[56.25%]">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`slide-${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? "opacity-100 z-20" : "opacity-0 z-10"}`}
            loading="lazy"
            decoding="async"
            width="1280"
            height="720"
          />
        ))}
      </div>

      {/* indicators */}
      <div className="flex justify-center gap-3 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3.5 h-3.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>

      {/* prev / next */}
{images.length > 1 && (
  <>
    <button
      onClick={() => goTo(index - 1)}
      aria-label="Previous"
      className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 sm:p-3 rounded-full z-30 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
    >
      ‹
    </button>
    <button
      onClick={() => goTo(index + 1)}
      aria-label="Next"
      className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 sm:p-3 rounded-full z-30 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
    >
      ›
    </button>
  </>
)}
    </div>
  );
};
// ...existing code...
const About: React.FC = memo(() => {
  // add more images here by importing and adding to the array
  const images = [byteImage, groupImage1, groupImage2];

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f7f3] to-[#f0ede7] text-black text-left w-full py-20 md:py-24 px-6 sm:px-6 md:px-8 relative overflow-hidden" id="About">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <h2 className="font-inter text-sm md:text-base font-normal text-gray-600 mb-2 lowercase italic">About us</h2>
          <h1 className="font-inter text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 md:mb-8 leading-tight">Growth and Community</h1>
          <div className="max-w-lg">
            <p className="font-inter text-sm leading-relaxed text-gray-800 mb-6 font-normal">
              Bolt provides an enriching platform that fosters collaboration,
              presents intellectually <strong className="font-bold text-black">stimulating challenges</strong>, and facilitates
              <strong className="font-bold text-black">hands-on experiences</strong>. This unique opportunity is open to students from
              diverse backgrounds, inviting them to immerse themselves in the
              dynamic realm of business analytics.
            </p>
            <p className="font-inter text-sm leading-relaxed text-gray-800 font-normal">
              Our mission is to <strong className="font-bold text-black">foster a growth mindset</strong> in the community and help students
              <strong className="font-bold text-black">develop data analytics skills</strong> to be successful in their careers. Anyone with a
              interest for data, analytics, or tech is invited to join us on our journey.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center mt-8 lg:mt-0">
          <Carousel images={images} interval={4000} />
        </div>
      </div>
    </div>
  );
});

About.displayName = 'About';

export default About;
// ...existing code...

import React, { memo } from "react";
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
              <strong className="font-bold text-black"> hands-on experiences</strong>. This unique opportunity is open to students from
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
            alt="UBC BOLT Community"
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

export default About;

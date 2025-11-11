"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import Image from "next/image";
import ByteImage from "../../../public/images/Byte.webp"; // Import your gliding image

const FirstBytePage: React.FC = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Parallax offsets for both boxes ---
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const sensitivity = 20;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * -sensitivity; // move opposite
    const y = (e.clientY / innerHeight - 0.5) * -sensitivity;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  // --- Gliding image state ---
  const [startGlide, setStartGlide] = useState(false);
  useEffect(() => {
    setStartGlide(true);
  }, []);

  const handleClick = () => {
    // Do nothing for now
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#150033] "
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center pt-24 md:pt-28 pb-12 md:pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto flex-1 relative">
        {/* Gliding Image */}
        <Image
          src={ByteImage}
          alt="Gliding Image"
          className={`absolute bottom-10 left-1/2 w-[20rem] h-auto transition-transform duration-[2500ms] ${
            startGlide
              ? "translate-x-[15rem] -translate-y-[20rem]"
              : "-translate-x-1/2 translate-y-0"
          }`}
        />

        {/* Left Purple Box */}
        <div
          className="relative z-20 flex flex-col shadow-xl shadow-[#614ea5] bg-gradient-to-r from-[#614ea5] to-[#493b7b] \
          p-6 w-full md:w-1/3 rounded-3xl md:min-h-[60vh] lg:min-h-[70vh] transition-transform duration-150"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            First Byte
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-6">
            An introductory workshop series for beginners covering fundamental
            data analysis tools, Excel, SQL, and data visualization basics.
          </p>
          <img
            src="byte.webp"
            alt="First Byte Event"
            className="rounded-lg mb-4"
          />
        </div>

        {/* Right Box — semi-transparent */}
        <div
          className="relative z-10 flex flex-col justify-center shadow-lg shadow-[#614ea5]/45 rounded-3xl
  p-6 sm:p-8 md:p-10 lg:p-12 w-full md:w-[55%] mt-8 md:mt-0 md:ml-[-2rem]
  transition-transform duration-100 overflow-visible"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          {/* Semi-transparent background */}
          <div className="absolute inset-0 bg-[#614ea5]/30 rounded-3xl -z-10"></div>

          <div className="relative text-gray-200">
            <p className="leading-relaxed text-gray-300 text-sm sm:text-base md:text-lg">
              First Byte is a beginner-oriented datathon designed to introduce
              students to the world of data analytics and problem-solving.
              Participants receive a dataset and attend two workshops:
              <br />
              <br />
              ● Workshop 1: Introduction to Data Analytics
              <br />
              ● Workshop 2: Presenting Insights Effectively
              <br />
              Participants will then work in teams to build meaningful insights
              and present their findings to a panel of judges.
              <br />
              <br />
              Last Year's Numbers:
              <br />
              ● 250+ total enrolments (workshops + competition)
              <br />● 145 students participated in the final case competition
            </p>
            <div className="mt-6 md:mt-10">
              <Button text="Register Now" onClick={handleClick} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FirstBytePage;

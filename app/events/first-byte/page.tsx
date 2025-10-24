"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function FirstBytePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f3] to-[#f0ede7]">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <h1 className="font-inter text-4xl md:text-6xl font-bold text-black mb-4">
              First Byte
            </h1>
            <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
              Our flagship bootcamp introducing students to data analytics through hands-on projects and mentorship from industry professionals.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 shadow-lg">
            <h2 className="font-inter text-2xl font-bold text-black mb-4">
              About First Byte
            </h2>
            <p className="font-inter text-gray-700 leading-relaxed mb-6">
              First Byte is BOLT UBC's premier data analytics bootcamp designed to introduce students to the fundamentals of data analysis,
              visualization, and interpretation. Through hands-on projects and mentorship from industry professionals, participants gain
              practical skills and real-world experience.
            </p>

            <h3 className="font-inter text-xl font-bold text-black mb-3">
              What You'll Learn
            </h3>
            <ul className="font-inter text-gray-700 space-y-2 mb-6">
              <li>• Data analysis fundamentals</li>
              <li>• Data visualization techniques</li>
              <li>• Statistical analysis methods</li>
              <li>• Industry-standard tools and software</li>
              <li>• Real-world project experience</li>
            </ul>

            <h3 className="font-inter text-xl font-bold text-black mb-3">
              Event Details
            </h3>
            <div className="font-inter text-gray-700 space-y-2">
              <p><strong>Date:</strong> October 2024</p>
              <p><strong>Duration:</strong> 2 days</p>
              <p><strong>Location:</strong> UBC Campus</p>
              <p><strong>Prerequisites:</strong> None - open to all UBC students</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

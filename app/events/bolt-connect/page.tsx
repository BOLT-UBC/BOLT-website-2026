"use client";

import React, { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function BoltConnectPage() {
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
              BOLT Connect
            </h1>
            <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with like-minded data enthusiasts, industry professionals, and alumni. Network and discover career opportunities in analytics.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 shadow-lg">
            <h2 className="font-inter text-2xl font-bold text-black mb-4">
              About BOLT Connect
            </h2>
            <p className="font-inter text-gray-700 leading-relaxed mb-6">
              BOLT Connect is our premier networking event that brings together students, industry professionals, and alumni
              in the data analytics field. This event provides a platform for meaningful connections, career insights, and
              professional development opportunities.
            </p>

            <h3 className="font-inter text-xl font-bold text-black mb-3">
              What You'll Experience
            </h3>
            <ul className="font-inter text-gray-700 space-y-2 mb-6">
              <li>• Networking with industry professionals</li>
              <li>• Career guidance and mentorship</li>
              <li>• Panel discussions with experts</li>
              <li>• Company presentations and opportunities</li>
              <li>• Alumni success stories</li>
            </ul>

            <h3 className="font-inter text-xl font-bold text-black mb-3">
              Event Details
            </h3>
            <div className="font-inter text-gray-700 space-y-2">
              <p><strong>Date:</strong> November 2024</p>
              <p><strong>Duration:</strong> 1 day</p>
              <p><strong>Location:</strong> UBC Campus</p>
              <p><strong>Format:</strong> In-person networking event</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

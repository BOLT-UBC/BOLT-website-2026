"use client";

import { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function BoltCircuitPage() {
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
              BOLT Circuit
            </h1>
            <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
              An intensive case competition where teams tackle real-world business problems using data analytics and present solutions to industry judges.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 shadow-lg">
            <h2 className="font-inter text-2xl font-bold text-black mb-4">
              About BOLT Circuit
            </h2>
            <p className="font-inter text-gray-700 leading-relaxed mb-6">
              BOLT Circuit is our flagship case competition that challenges teams to solve complex business problems using data analytics.
              Participants work with real datasets, apply analytical techniques, and present their solutions to a panel of industry judges.
            </p>

            <h3 className="font-inter text-xl font-bold text-black mb-3">
              Competition Format
            </h3>
            <ul className="font-inter text-gray-700 space-y-2 mb-6">
              <li>• Team-based competition (3-4 members)</li>
              <li>• Real-world business case studies</li>
              <li>• Access to industry datasets</li>
              <li>• Mentorship from professionals</li>
              <li>• Final presentation to judges</li>
            </ul>

            <h3 className="font-inter text-xl font-bold text-black mb-3">
              Event Details
            </h3>
            <div className="font-inter text-gray-700 space-y-2">
              <p><strong>Date:</strong> March 2025</p>
              <p><strong>Duration:</strong> 2 days</p>
              <p><strong>Location:</strong> UBC Campus</p>
              <p><strong>Team Size:</strong> 3-4 members</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

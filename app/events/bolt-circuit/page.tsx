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

      <div className="pt-32 pb-32 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="font-inter text-4xl md:text-6xl font-bold text-black mb-4">
            BOLT Circuit
          </h1>
          <p className="font-inter text-2xl md:text-3xl text-gray-600">
            Surprising collaboration coming soon
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

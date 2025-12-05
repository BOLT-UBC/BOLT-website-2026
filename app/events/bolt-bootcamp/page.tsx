"use client";

import { useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function BoltBootcampPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f3] to-[#f0ede7]">
      <Navbar />

      <div className="pt-32 pb-32 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="font-inter text-4xl md:text-6xl font-bold text-black mb-4">
            BOLT Bootcamp 2026 Coming Soon
          </h1>
          <p className="font-inter text-2xl md:text-3xl text-gray-600">
            Follow us on <a href="https://www.instagram.com/ubcbolt/" className="text-blue-500 hover:text-blue-600">Instagram</a> for updates.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

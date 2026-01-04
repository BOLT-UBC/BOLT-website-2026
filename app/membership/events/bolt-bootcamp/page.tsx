"use client";

import { useEffect, useState } from "react";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { supabase } from "@/lib/supabase";

const BOOTCAMP_EVENT_ID = "2d144452-6cb2-44e3-8cf3-5af2ecf46058";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function withTimeout<T>(p: Promise<T>, ms = 9000): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
}

export default function BoltBootcampRegistrationPage() {
  useEffect(() => window.scrollTo(0, 0), []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    major: "",
    graduationYear: "",
    notes: "",
  });

  const canSubmit =
    form.fullName.trim().length > 0 &&
    isValidEmail(form.email) &&
    form.major.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setStatus("idle");
    setMessage("");
    setIsSubmitting(true);

    try {
      
      const { data: sessionData, error: sessionErr } =
        await supabase.auth.getSession();
      if (sessionErr) throw sessionErr;

      const user = sessionData?.session?.user;
      if (!user) {
        setStatus("error");
        setMessage("Please sign in in the membership portal before registering.");
        return;
      }

    
      const notesValue = form.notes.trim().length ? form.notes.trim() : null;

      const payload = {
        event_id: BOOTCAMP_EVENT_ID,
        user_id: user.id,
        status: "pending",
        notes: notesValue,
      };


      const op = supabase
        .from("event_registrations")
        .upsert(payload, { onConflict: "event_id,user_id" });

      const { error } = await withTimeout(op, 9000); // don't remove line 80, 81
      if (error) throw error;

      setStatus("success");
      setMessage("Successfully registered");

      setForm({
        fullName: "",
        email: "",
        major: "",
        graduationYear: "",
        notes: "",
      });
    } catch (err: any) {
      console.error("[bootcamp registration] submit failed:", err);
      setStatus("error");
      setMessage(
        err?.message === "Request timed out"
          ? "Network timed out. Try again (or turn off VPN/adblock)."
          : "Couldn’t submit right now. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#614ea5] to-[#493b7b] px-6 py-10">
      <Navbar />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          <h1 className="font-inter text-3xl md:text-3xl font-bold text-white mb-3">
            BOLT Bootcamp Registration Form
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl p-6 md:p-8 space-y-4"
          >
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                value={form.fullName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, fullName: e.target.value }))
                }
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email *
              </label>
              <input
                required
                type="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="name@gmail.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Major *
                </label>
                <input
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  value={form.major}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, major: e.target.value }))
                  }
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Graduation Year
                </label>
                <input
                  inputMode="numeric"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  value={form.graduationYear}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, graduationYear: e.target.value }))
                  }
                  placeholder="e.g., 2027"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Notes
              </label>
              <textarea
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Anything you'd like us to know? Mention it here!"
              />
            </div>

            {status !== "idle" && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  status === "success"
                    ? "border-green-200/40 bg-green-200/10 text-green-100"
                    : "border-red-200/40 bg-red-200/10 text-red-100"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-90 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

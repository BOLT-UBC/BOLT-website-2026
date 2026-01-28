"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Timeline } from "@/components/membership/Timeline";
import { useAuth } from "@/lib/useAuth";

const BOOTCAMP_EVENT_ID = "2d144452-6cb2-44e3-8cf3-5af2ecf46058";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

type FormStep = "form" | "review" | "status";

interface TimelineMilestone {
  id: string
  milestone: string
  date: string | null
  is_complete: boolean
  display_order: number
}

export default function BoltBootcampRegistrationPage() {
  const router = useRouter();
  useEffect(() => window.scrollTo(0, 0), []);

  const [currentStep, setCurrentStep] = useState<FormStep>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [existingRegistration, setExistingRegistration] = useState<{
    id: string
    status: string
    registered_at: string
    notes: string | null
    application_responses?: Record<string, unknown>
  } | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [timelineMilestones, setTimelineMilestones] = useState<TimelineMilestone[]>([]);
  const { user } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    major: "",
    graduationYear: "",
    notes: "",
  });


  // Load timeline milestones
  const loadTimeline = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/events/${BOOTCAMP_EVENT_ID}/timeline`);
      if (response.ok) {
        const data = await response.json();
        if (data.milestones && data.milestones.length > 0) {
          setTimelineMilestones(data.milestones);
        }
      }
    } catch {
      // Use default timeline if fetch fails
    }
  }, []);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  // Check if user already registered
  useEffect(() => {
    const checkExistingRegistration = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;

        if (!user) {
          setCheckingStatus(false);
          return;
        }

        const { data, error } = await supabase
          .from("event_registrations")
          .select("*, application_responses")
          .eq("event_id", BOOTCAMP_EVENT_ID)
          .eq("user_id", user.id)
          .single();

        if (data && !error) {
          setExistingRegistration(data);
          setCurrentStep("status");
        }
      } catch {
        // User not registered yet
      } finally {
        setCheckingStatus(false);
      }
    };

    checkExistingRegistration();
  }, []);

  const canSubmit =
    form.fullName.trim().length > 0 &&
    isValidEmail(form.email) &&
    form.major.trim().length > 0;

  const handleReview = () => {
    if (canSubmit) {
      setCurrentStep("review");
    }
  };

  const handleBackToForm = () => {
    setCurrentStep("form");
  };

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
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

      // Store custom responses alongside profile-linked data
      const applicationResponses = {
        notes: form.notes.trim() || null,
        // Store a copy of form data for record-keeping
        submitted_full_name: form.fullName,
        submitted_email: form.email,
        submitted_major: form.major,
        submitted_graduation_year: form.graduationYear || null,
      };

      const payload = {
        event_id: BOOTCAMP_EVENT_ID,
        user_id: user.id,
        status: "pending",
        notes: form.notes.trim() || null,
        application_responses: applicationResponses,
      };

      const { error } = await supabase
        .from("event_registrations")
        .upsert(payload, { onConflict: "event_id,user_id" });
      if (error) throw error;

      setStatus("success");
      setMessage("Successfully registered");
      setCurrentStep("status");

      // Fetch the registration to show status
      const { data: regData } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", BOOTCAMP_EVENT_ID)
        .eq("user_id", user.id)
        .single();

      if (regData) {
        setExistingRegistration(regData);
      }
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error("[bootcamp registration] submit failed:", err);
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setMessage(
        errorMessage === "Request timed out"
          ? "Network timed out. Try again (or turn off VPN/adblock)."
          : "Couldn't submit right now. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 border-green-400/30";
      case "cancelled":
        return "bg-red-500/10 border-red-400/30";
      case "pending":
      default:
        return "bg-yellow-500/10 border-yellow-400/30";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-200";
      case "cancelled":
        return "text-red-200";
      case "pending":
      default:
        return "text-yellow-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      case "pending":
      default:
        return "Pending Review";
    }
  };

  const getTimelineEvents = () => {
    // Use dynamic milestones if available, otherwise fall back to defaults
    if (timelineMilestones.length > 0) {
      return timelineMilestones.map((m, index) => {
        // Determine if this milestone is current (most recent incomplete after a complete one)
        const isComplete = m.is_complete;
        const previousComplete = index > 0 && timelineMilestones[index - 1].is_complete;
        const isCurrent = !isComplete && previousComplete;

        return {
          label: m.milestone,
          date: m.date ? new Date(m.date) : null,
          isComplete: m.is_complete,
          isCurrent,
        };
      });
    }

    // Default timeline if no milestones are configured
    const defaultEvents = [
      {
        label: 'Applications Open',
        date: null,
        isComplete: false,
        isCurrent: false,
      },
      {
        label: 'Application Deadline',
        date: null,
        isComplete: false,
        isCurrent: false,
      },
      {
        label: 'Decision Release',
        date: null,
        isComplete: false,
        isCurrent: false,
      },
      {
        label: 'Confirmation Due',
        date: null,
        isComplete: false,
        isCurrent: false,
      },
      {
        label: 'Event Day',
        date: null,
        isComplete: false,
        isCurrent: false,
      },
    ];

    return defaultEvents;
  }


  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#614ea5] to-[#493b7b] px-6 py-10">
        <Navbar />
        <div className="pt-28 pb-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center text-white">
            <div className="text-xl">Checking registration status...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Status page - user already registered
  if (currentStep === "status" && existingRegistration) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#614ea5] to-[#493b7b] px-6 py-10">
        <Navbar />

        <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-inter text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Timeline
            </h1>

            <div className="space-y-8">
              {/* Timeline */}
              <div>
                <Timeline
                  events={getTimelineEvents()}
                />
              </div>

              <div className="space-y-4">
                {existingRegistration.status === "pending" && (
                  <div className={`${getStatusColor(existingRegistration.status)} rounded-xl p-6 border-2`}>
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`${getStatusTextColor(existingRegistration.status)} font-medium`}>Application Status:</span>
                        <span className={`${getStatusTextColor(existingRegistration.status)} font-semibold text-lg`}>{getStatusLabel(existingRegistration.status)}</span>
                      </div>
                      <p className={`${getStatusTextColor(existingRegistration.status)} text-sm`}>
                        Your registration is pending review. Check back again at a later time.
                      </p>
                    </div>
                  </div>
                )}

                {existingRegistration.status === "confirmed" && (
                  <div className={`${getStatusColor(existingRegistration.status)} rounded-xl p-6 border-2`}>
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`${getStatusTextColor(existingRegistration.status)} font-medium`}>Application Status:</span>
                        <span className={`${getStatusTextColor(existingRegistration.status)} font-semibold text-lg`}>{getStatusLabel(existingRegistration.status)}</span>
                      </div>
                      <p className={`${getStatusTextColor(existingRegistration.status)} text-sm`}>
                        Your registration has been confirmed! We'll send you more details soon.
                      </p>
                    </div>
                  </div>
                )}

                {existingRegistration.status === "cancelled" && (
                  <div className={`${getStatusColor(existingRegistration.status)} rounded-xl p-6 border-2`}>
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`${getStatusTextColor(existingRegistration.status)} font-medium`}>Application Status:</span>
                        <span className={`${getStatusTextColor(existingRegistration.status)} font-semibold text-lg`}>{getStatusLabel(existingRegistration.status)}</span>
                      </div>
                      <p className={`${getStatusTextColor(existingRegistration.status)} text-sm`}>
                        Your registration has been cancelled.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 items-center">
                <button
                  onClick={async () => {
                    // Load user profile data to populate form
                    if (user?.id) {
                      try {
                        const { data: profileData } = await supabase
                          .from('profiles')
                          .select('*')
                          .eq('id', user.id)
                          .single()

                        if (profileData) {
                          setForm({
                            fullName: profileData.full_name || user.email || '',
                            email: user.email || '',
                            major: profileData.major || '',
                            graduationYear: profileData.graduation_year?.toString() || '',
                            notes: existingRegistration.notes || '',
                          })
                          setCurrentStep("form")
                        }
                      } catch {
                        // If profile load fails, just go to form
                        setCurrentStep("form")
                      }
                    } else {
                      setCurrentStep("form")
                    }
                  }}
                  className="text-white font-medium underline hover:no-underline"
                >
                  View Application
                </button>
                <button
                  onClick={() => router.push("/membership")}
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  Back to Membership Portal
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Review step
  if (currentStep === "review") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#614ea5] to-[#493b7b] px-6 py-10">
        <Navbar />

        <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-inter text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              Review Your Registration
            </h1>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-white/80 text-sm font-medium mb-1">Full Name</h3>
                <p className="text-white">{form.fullName}</p>
              </div>

              <div>
                <h3 className="text-white/80 text-sm font-medium mb-1">Email</h3>
                <p className="text-white">{form.email}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-white/80 text-sm font-medium mb-1">Major</h3>
                  <p className="text-white">{form.major}</p>
                </div>
                <div>
                  <h3 className="text-white/80 text-sm font-medium mb-1">Graduation Year</h3>
                  <p className="text-white">{form.graduationYear || "Not specified"}</p>
                </div>
              </div>

              {form.notes && (
                <div>
                  <h3 className="text-white/80 text-sm font-medium mb-1">
                    Notes
                  </h3>
                  <p className="text-white whitespace-pre-wrap">{form.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBackToForm}
                className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Back to Edit
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </button>
            </div>

            {status !== "idle" && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                  status === "success"
                    ? "border-green-200/40 bg-green-200/10 text-green-100"
                    : "border-red-200/40 bg-red-200/10 text-red-100"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Form step
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#614ea5] to-[#493b7b] px-6 py-10">
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-inter text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            {existingRegistration ? 'Your Application' : 'BOLT Bootcamp Registration Form'}
          </h1>

          {existingRegistration && (
            <div className="mb-6 text-center">
              <button
                onClick={() => setCurrentStep("status")}
                className="text-white/70 hover:text-white text-sm underline"
              >
                ← Back to Status
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReview();
            }}
            className="space-y-4"
          >
            {existingRegistration && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Registration Date
                </label>
                <p className="text-white px-4 py-3 border-white/20 rounded-lg">
                  {new Date(existingRegistration.registered_at).toLocaleDateString()}
                </p>
              </div>
            )}

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                required
                disabled={!!existingRegistration}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
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
                disabled={!!existingRegistration}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={!!existingRegistration}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={!!existingRegistration}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
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
                disabled={!!existingRegistration}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Anything else you would like to let us know?"
                rows={3}
              />
            </div>

            {status === "error" && (
              <div className="rounded-xl border border-red-200/40 bg-red-200/10 px-4 py-3 text-sm text-red-100">
                {message}
              </div>
            )}

            {!existingRegistration && (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-90 disabled:cursor-not-allowed"
              >
                Review Registration
              </button>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

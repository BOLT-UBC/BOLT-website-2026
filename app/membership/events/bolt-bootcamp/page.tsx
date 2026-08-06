/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { supabase, type Database } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { Timeline } from "@/components/membership/Timeline";
import { useAuth } from "@/lib/useAuth";
import { StepIndicator } from "@/components/membership/StepIndicator";
import FormFieldGenerator, { FormFieldConfig, validateField } from "@/components/FormEntry";
const BOOTCAMP_EVENT_ID = "2d144452-6cb2-44e3-8cf3-5af2ecf46058";

const BACKGROUND = {
  back: "bg-slate-950",
  middle: "bg-slate-900 border border-slate-800 shadow-[0_1px_0_rgba(255,255,255,0.1)_inset,0_10px_15px_-3px_rgba(0,0,0,0.5)] rounded-2xl",
  front: "bg-slate-800 border border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white",
};

interface FormField {
  id: string; type: string; label: string; order: number; required: boolean; placeholder: string; options?: string[];
}

// CSS Spinner for replacement of Loader2
const Spinner = () => (
  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
);


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
  const pathname = usePathname();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<"form" | "review" | "status">("form");
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [timeline, setTimeline] = useState<any[]>([]);
  const [deadline, setDeadline] = useState<string | null>("2026-02-27T00:00:00");
  const [existingRegistration, setExistingRegistration] = useState<{
    registration_id: string
    status: string
    registered_at: string
    notes: string | null
    application_responses?: Record<string, unknown>
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!deadline) return;

    const calculateTime = () => {
      const target = new Date(deadline).getTime();
      const now = new Date().getTime();
      const difference = target - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [deadline]);


  // Helper to format numbers with leading zeros (e.g., 05)
  const f = (n: number) => n.toString().padStart(2, '0');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    formFields.forEach((field) => {
      const error = validateField(field as FormFieldConfig, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    const isValid = validateForm();
    if (isValid) {
      setCurrentStep("review");
      window.scrollTo(0, 0);
    } else {
      // Scroll to top to see errors if validation fails
      window.scrollTo(0, 0);
    }
  };


  const loadPageData = useCallback(async () => {
    try {
      const configRes = await fetch(`/api/events/bootcamp/form-config`);
      const configData = await configRes.json();
      if (configData.fields) setFormFields(configData.fields.sort((a: any, b: any) => a.order - b.order));

      // const timelineRes = await fetch(`/api/events/bootcamp/timeline`);
      // const timelineData = await timelineRes.json();
      // if (timelineData.milestones) {
      //   setTimeline(timelineData.milestones);
      //   const dEvent = timelineData.milestones.find((m: any) => m.milestone.toLowerCase().includes('deadline'));
      //   if (dEvent) setDeadline(dEvent.date);
      // }
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { loadPageData(); window.scrollTo(0, 0); }, [loadPageData]);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      const { data: reg } = await supabase.from("event_attendance").select("*")
        .eq("event_id", BOOTCAMP_EVENT_ID).eq("member_id", data.session.user.id)
        .single<Database['public']['Tables']['event_attendance']['Row']>();

      if (reg) {
        setExistingRegistration(reg);
        setFormData(reg.application_responses || {});
        setCurrentStep("status");
      }
      setCheckingStatus(false);
    };
    checkUser();
  }, [router, pathname]);

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await supabase.from("event_attendance").upsert({
        event_id: BOOTCAMP_EVENT_ID, member_id: user.id, status: "pending", application_responses: formData,
      });
      setCurrentStep("status");
      window.scrollTo(0, 0);
    } catch { alert("Error submitting"); } finally { setIsSubmitting(false); }
  };

  if (checkingStatus) {
    return <div className={`min-h-screen ${BACKGROUND.back} flex items-center justify-center`}><Spinner /></div>;
  }
  if (checkingStatus) {
    return (
      <div className={`min-h-screen ${BACKGROUND.back}`}>
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

  return (
    <div className={`min-h-screen flex flex-col ${BACKGROUND.back} text-slate-200`}>
      <Navbar />

      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {currentStep === 'status' ? 'Application Status' : 'BOLT Bootcamp Registration'}
          </h1>
          <p className="mt-2 text-slate-400">
            {currentStep === 'status' ? '' : 'Please complete the following form.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className={`${BACKGROUND.middle} p-6`}><StepIndicator currentStep={currentStep} /></div>

            <div className={`${BACKGROUND.middle} overflow-hidden`}>
              {currentStep === "form" && (
                <>
                  <div className="px-6 py-4 border-b border-slate-800 bg-white/5 flex justify-between items-center">
                    <h2 className="font-semibold text-white">Applicant Details</h2>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Step 1 / 3</span>
                  </div>
                  <div className="p-6">
                    {/* Fixed: Increased spacing from space-y-1 to space-y-6 for even layout */}
                    <div className="space-y-6">
                      {formFields.map((field) => (
                        <FormFieldGenerator
                          key={field.id}
                          field={field as FormFieldConfig}
                          value={formData[field.id]}
                          error={errors[field.id]}
                          onChange={(id, val) => {
                            // Update value
                            setFormData((prev) => ({ ...prev, [id]: val }));
                            
                            // Clear error on change
                            if (errors[id]) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors[id];
                                return newErrors;
                              });
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 px-6 py-4 border-t border-slate-800 flex justify-end">
                    {/* Fixed: Now calls handleNextStep to validate before proceeding */}
                    <button onClick={handleNextStep} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95">
                      Review Application <span>→</span>
                    </button>
                  </div>
                </>
              )}

              {currentStep === "review" && (
                <>
                  <div className="px-6 py-4 border-b border-slate-800 bg-white/5 font-semibold text-white">Review & Submit</div>
                  <div className="p-6 space-y-6">
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 text-amber-200 text-sm italic">
                      <p>Confirm your details. Edits are disabled after submission.</p>
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {formFields.map(field => (
                        <div key={field.id}>
                          <dt className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{field.label}</dt>
                          <dd className="text-white font-medium">{String(formData[field.id] || '-')}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="bg-white/5 px-6 py-4 border-t border-slate-800 flex justify-between items-center">
                    <button onClick={() => setCurrentStep("form")} className="text-slate-400 hover:text-white flex items-center gap-2 transition"><span>←</span> Back</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="bg-indigo-600 px-8 py-2.5 rounded-lg font-bold text-white flex items-center gap-2">
                      {isSubmitting ? <Spinner /> : "Confirm Submission ✓"}
                    </button>
                  </div>
                </>
              )}

              {currentStep === "status" && (() => {
                // Helper to determine styles and text based on status
                const status = existingRegistration?.status || 'pending';
                
                const statusConfig = {
                  confirmed: {
                    style: "bg-green-500/10 text-green-500 border-green-500/30",
                    icon: "✓",
                    title: "Application Confirmed!",
                    message: "Congratulations! Your spot in the bootcamp is secured. We will send you further details via email shortly."
                  },
                  cancelled: {
                    style: "bg-red-500/10 text-red-500 border-red-500/30",
                    icon: "✕",
                    title: "Application Cancelled",
                    message: "Your application has been cancelled or was not successful. Please contact support if you believe this is an error."
                  },
                  pending: {
                    style: "bg-amber-500/10 text-amber-500 border-amber-500/30", // Using amber for better visibility than yellow
                    icon: "⏳",
                    title: "Application Under Review",
                    message: "We have received your application and are currently reviewing it. Please check back later for updates."
                  }
                };

                // Select config or fallback to pending
                const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

                return (
                  <div className="p-12 text-center space-y-6">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl font-bold border ${config.style}`}>
                      {config.icon}
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">
                        {config.title}
                      </h2>
                      <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
                        {config.message}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                      <button 
                        onClick={() => router.push("/membership")} 
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                      >
                        Back to Portal
                      </button>
                      <button 
                        onClick={() => router.push("/events/bolt-bootcamp")} 
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 rounded-lg text-white font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
                      >
                        Event Details
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${BACKGROUND.middle} p-6 flex flex-col items-center overflow-visible`}>
              <div className="relative w-full flex flex-col items-center pt-16">
                {/* Mascot & Pedestal */}
                <div className="absolute top-0 transform -translate-y-4 hover:scale-105 transition-transform">
                   <img src="/events/byte.png" alt="Byte" className="w-24 h-24 object-contain" />
                </div>
                <div className="w-32 h-12 bg-gradient-to-b from-indigo-600 to-indigo-900 rounded-t-xl relative shadow-2xl">
                  <div className="absolute -bottom-2 -left-4 -right-4 h-4 bg-slate-950 rounded-lg border-t border-indigo-400/10" />
                </div>

                {/* Countdown Display */}
                <div className="mt-8 text-center w-full">
                  <div className="flex justify-center items-baseline gap-1 text-white font-mono font-bold tracking-tight">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl tabular-nums">{f(timeLeft.days)}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Days</span>
                    </div>
                    <span className="text-2xl text-indigo-500 animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl tabular-nums">{f(timeLeft.hours)}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Hrs</span>
                    </div>
                    <span className="text-2xl text-indigo-500 animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl tabular-nums">{f(timeLeft.minutes)}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Mins</span>
                    </div>
                    <span className="text-2xl text-indigo-500 animate-pulse">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl tabular-nums">{f(timeLeft.seconds)}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Secs</span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Left until application closes
                  </p>
                </div>
              </div>
            </div>

            {/* <div className={`${BACKGROUND.middle} p-6`}>
              <h3 className="font-bold text-white mb-6 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full" /> Event Timeline
              </h3>
              <Timeline events={timeline.map(m => ({
                label: m.milestone, date: m.date ? new Date(m.date) : null, isComplete: m.is_complete, isCurrent: false 
              }))} />
            </div> */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
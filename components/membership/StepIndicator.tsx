"use client";

import React from "react";

type FormStep = "form" | "review" | "status";

interface StepIndicatorProps {
  currentStep: FormStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: "form", label: "Details" },
    { id: "review", label: "Review" },
    { id: "status", label: "Status" },
  ];

  const getCurrentIndex = () => steps.findIndex((s) => s.id === currentStep);
  const currentIndex = getCurrentIndex();

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between w-full relative">
        {/* Progress Line Background */}
        <div className="absolute left-0 top-5 transform -translate-y-1/2 w-full h-0.5 bg-slate-800 -z-10" />
        
        {/* Progress Line Fill */}
        <div 
            className="absolute left-0 top-5 transform -translate-y-1/2 h-0.5 bg-indigo-500 -z-10 transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-sm ${
                  isActive
                    ? "border-indigo-500 bg-slate-900 text-indigo-400 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    : isCompleted
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-600"
                }`}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span
                className={`mt-2 text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${
                  isActive || isCompleted ? "text-indigo-400" : "text-slate-600"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
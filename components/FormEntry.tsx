/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import React from "react";

// --- Types based on your JSON structure ---
export interface FormFieldConfig {
  id: string;
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "date";
  label: string;
  order: number;
  required: boolean;
  placeholder?: string;
  profileField?: string;
  options?: string[];
}

interface FormFieldProps {
  field: FormFieldConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  onChange: (id: string, value: any) => void;
  error?: string;
}

// --- Styling Constants ---
const STYLES = {
  container: "mb-5",
  label: "block text-sm font-medium text-slate-400 mb-1.5",
  input: "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed",
  checkboxWrapper: "flex items-start gap-3 p-3 border border-slate-700/50 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors",
  checkbox: "w-5 h-5 mt-0.5 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer",
  errorText: "text-red-400 text-xs mt-1 font-medium flex items-center gap-1",
};

/**
 * Validates a single field value based on its configuration
 */
export function validateField(field: FormFieldConfig, value: any): string | null {
  // 1. Check Required
  if (field.required) {
    if (value === null || value === undefined || value === "") {
      return `${field.label} is required`;
    }
    if (field.type === "checkbox" && value !== true) {
      return `${field.label} must be checked`;
    }
  }

  // Skip type checks if empty and not required
  if (!value) return null;

  // 2. Type Checks
  switch (field.type) {
    case "email":
      // Standard email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
      break;

    case "number":
      if (isNaN(Number(value))) {
        return "Please enter a valid number";
      }
      break;

    case "date":
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return "Please select a valid date";
      }
      break;

    case "select":
      if (field.options && !field.options.includes(value)) {
        return "Please select a valid option from the dropdown";
      }
      break;
  }

  return null;
}

/**
 * Renders the input field based on configuration
 */
export default function FormFieldGenerator({ field, value, onChange, error }: FormFieldProps) {
  
  // Handlers
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(field.id, e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field.id, e.target.checked);
  };

  // Render logic switch
  const renderInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.id}
            required={field.required}
            className={`${STYLES.input} min-h-[100px] resize-y`}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={handleTextChange}
          />
        );

      case "select":
        return (
          <div className="relative">
            <select
              id={field.id}
              required={field.required}
              className={`${STYLES.input} appearance-none cursor-pointer`}
              value={value || ""}
              onChange={handleTextChange}
            >
              <option value="" disabled className="text-slate-500">
                {field.placeholder || "Select an option..."}
              </option>
              {field.options?.map((option, idx) => (
                <option key={`${field.id}-opt-${idx}`} value={option} className="bg-slate-800 text-white py-2">
                  {option}
                </option>
              ))}
            </select>
            {/* Custom Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className={STYLES.checkboxWrapper}>
            <input
              id={field.id}
              type="checkbox"
              required={field.required}
              className={STYLES.checkbox}
              checked={!!value} // Ensure boolean
              onChange={handleCheckboxChange}
            />
            <label htmlFor={field.id} className="text-sm text-slate-300 cursor-pointer select-none">
              {field.label}
              {field.required && <span className="text-indigo-400 ml-1">*</span>}
              {field.placeholder && (
                <span className="block text-xs text-slate-500 mt-0.5">{field.placeholder}</span>
              )}
            </label>
          </div>
        );

      case "date":
        return (
          <input
            id={field.id}
            type="date"
            required={field.required}
            className={`${STYLES.input} [color-scheme:dark]`} // Ensures calendar popup is dark mode
            value={value || ""}
            onChange={handleTextChange}
            max="9999-12-31"
          />
        );

      case "number":
        return (
          <input
            id={field.id}
            type="number"
            required={field.required}
            className={STYLES.input}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={handleTextChange}
            step="any"
          />
        );

      case "email":
        return (
          <input
            id={field.id}
            type="email"
            required={field.required}
            className={STYLES.input}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={handleTextChange}
            autoComplete="email"
          />
        );

      case "text":
      default:
        return (
          <input
            id={field.id}
            type="text"
            required={field.required}
            className={STYLES.input}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={handleTextChange}
          />
        );
    }
  };

  return (
    <div className={STYLES.container}>
      {/* Label (Hidden for checkbox as it has its own layout) */}
      {field.type !== "checkbox" && (
        <label htmlFor={field.id} className={STYLES.label}>
          {field.label} {field.required && <span className="text-indigo-400">*</span>}
        </label>
      )}

      {renderInput()}

      {/* Error Message */}
      {error && (
        <p className={STYLES.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
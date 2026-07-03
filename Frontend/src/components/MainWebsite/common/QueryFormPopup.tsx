"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function QueryFormPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    experience: "",
    center: "",
    learningMode: "Online",
    consent: true,
  });

  useEffect(() => {
    // Check if the user has already closed/interacted with the form in this session
    const hasDismissed = sessionStorage.getItem("queryFormDismissed");
    if (hasDismissed) return;

    // Trigger popup after 10 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("queryFormDismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Persist status so it doesn't open again during the session
    sessionStorage.setItem("queryFormDismissed", "true");
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-text">
      {/* Modal Container */}
      <div className="relative flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-30 text-gray-500 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close form"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Column: Yellow Promo Poster */}
        <div className="hidden md:flex w-full md:w-[48%] bg-[#fbc02d] p-6 md:p-10 flex-col justify-between items-center text-center text-slate-900 min-h-[280px] md:min-h-[500px] select-none">
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-1.5 opacity-90">
            <svg className="w-6 h-6 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 9l11 7 9-5.6V17h2V9L12 2zm0 13.5L4.7 11 12 6.5l7.3 4.5-7.3 4.5zM12 16c-2.8 0-5-2.2-5-5h10c0 2.8-2.2 5-5 5z" />
            </svg>
            <span className="font-extrabold text-sm uppercase tracking-wider text-slate-800">Apscale X Academy</span>
          </div>

          {/* New Batch details */}
          <div className="my-auto py-4">
            <h2 className="text-xl md:text-2xl font-black tracking-wider text-blue-950 uppercase leading-none">
              NEW BATCH STARTS
            </h2>
            
            {/* Calendar Block */}
            <div className="bg-white rounded-2xl p-4 shadow-lg w-28 md:w-32 mx-auto my-4 text-center border-t-8 border-red-500 flex flex-col items-center">
              <span className="text-red-500 font-extrabold text-xs md:text-sm uppercase tracking-wider">JULY</span>
              <span className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">06</span>
              <span className="text-slate-500 font-bold text-xxs md:text-xs uppercase">MON</span>
            </div>

            <p className="text-[11px] md:text-xs font-black text-blue-950 uppercase tracking-widest max-w-[240px] mx-auto leading-snug">
              POST GRADUATE CERTIFICATION PROGRAM AND LEADERSHIP PROGRAM
            </p>
          </div>

          {/* Footer Text */}
          <div className="w-full">
            <p className="text-[12px] md:text-sm font-extrabold text-slate-800 uppercase tracking-wide">
              STEP INTO THE FUTURE OF <br />
              <span className="text-blue-950">DIGITAL MARKETING!</span>
            </p>
            {/* Slide dots indicator */}
            <div className="flex gap-1.5 justify-center mt-3">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="w-2 h-2 rounded-full bg-white/40"></span>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-[52%] p-6 md:p-8 flex flex-col justify-center">
          {isSubmitted ? (
            <div className="text-center py-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Thank you!</h3>
              <p className="text-slate-600 text-sm font-semibold max-w-[280px]">
                Our academic counselor will get in touch with you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 select-text">
              <div className="mb-2 text-left">
                <h3 className="text-xl md:text-2xl font-black text-slate-900">Apply Now</h3>
              </div>

              {/* Full Name */}
              <div>
                <input
                  type="text"
                  placeholder="Full Name*"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email*"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all"
                />
              </div>

              {/* Mobile Number with Country Code Dropdown */}
              <div className="flex gap-2">
                <div className="relative shrink-0">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="h-full px-3 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-bold text-slate-800 bg-slate-50 cursor-pointer"
                  >
                    <option value="+91">+91 IN</option>
                    <option value="+1">+1 US</option>
                    <option value="+44">+44 UK</option>
                    <option value="+971">+971 AE</option>
                  </select>
                </div>
                <input
                  type="tel"
                  placeholder="Mobile Number*"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all"
                />
              </div>

              {/* Work Experience Dropdown */}
              <div>
                <select
                  value={formData.experience}
                  required
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-semibold text-slate-700 bg-white cursor-pointer"
                >
                  <option value="" disabled>Work Experience*</option>
                  <option value="Fresher">Fresher / Student</option>
                  <option value="1-2 years">1 - 2 Years</option>
                  <option value="3-5 years">3 - 5 Years</option>
                  <option value="5+ years">5+ Years</option>
                </select>
              </div>

              {/* Learning Center Dropdown */}
              <div>
                <select
                  value={formData.center}
                  required
                  onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                  className="w-full px-4 py-2.5 md:py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm font-semibold text-slate-700 bg-white cursor-pointer"
                >
                  <option value="" disabled>Learning Center*</option>
                  <option value="Online">Online / Live Virtual</option>
                  <option value="Bangalore">Bangalore Campus</option>
                  <option value="Delhi NCR">Delhi NCR Campus</option>
                  <option value="Mumbai">Mumbai Campus</option>
                  <option value="Pune">Pune Campus</option>
                </select>
              </div>

              {/* Learning Mode Radio Buttons */}
              <div className="flex items-center gap-4 text-xs md:text-sm text-left">
                <span className="font-bold text-slate-800">Learning Mode:</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="learningMode"
                    value="Online"
                    checked={formData.learningMode === "Online"}
                    onChange={(e) => setFormData({ ...formData, learningMode: e.target.value })}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500 accent-rose-600"
                  />
                  Online
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="learningMode"
                    value="Classroom"
                    checked={formData.learningMode === "Classroom"}
                    onChange={(e) => setFormData({ ...formData, learningMode: e.target.value })}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500 accent-rose-600"
                  />
                  Classroom
                </label>
              </div>

              {/* Consent checkbox */}
              <div className="flex items-start gap-2.5 text-left mt-1.5">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 rounded border-slate-300 mt-0.5 accent-rose-600 cursor-pointer"
                  required
                />
                <label htmlFor="consent" className="text-[10px] md:text-[11px] leading-tight text-slate-400 font-semibold cursor-pointer">
                  I authorize Apscale X and its associates to contact me via Call, Email, WhatsApp & SMS. I accept to{" "}
                  <Link href="/privacy-policy" className="underline hover:text-slate-600">Privacy Policy</Link> &{" "}
                  <Link href="/terms-and-conditions" className="underline hover:text-slate-600">Terms of Use</Link>.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 md:py-3.5 bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold rounded-full transition-all duration-200 mt-2 uppercase tracking-wider text-[13px] md:text-sm shadow-md hover:shadow-lg active:scale-99 cursor-pointer"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { contactApi } from "@/lib/api/contact";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [workshopInterest, setWorkshopInterest] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<{ name?: boolean; email?: boolean; phone?: boolean; interest?: boolean; message?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = true;
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = true;
    if (!phone.trim() || !/^\+?\d{7,15}$/.test(phone.replace(/[\s-()]/g, ""))) newErrors.phone = true;
    if (!workshopInterest) newErrors.interest = true;
    if (!message.trim() || message.length < 10) newErrors.message = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await contactApi.submitContactForm({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        topic: workshopInterest,
        message: message.trim()
      });
      
      setIsSuccess(true);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setWorkshopInterest("");
      setMessage("");
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      setErrorMsg(err.response?.data?.message || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactOptions = [
    {
      label: "Support Email",
      value: "contact@aiscale.com",
      description: "Expect a response within 12 hours.",
      icon: Mail,
      href: "mailto:contact@aiscale.com"
    },
    {
      label: "Admissions Toll-Free",
      value: "+91 1800 4122 6965",
      description: "Mon-Sat, 9:00 AM - 7:00 PM IST.",
      icon: Phone,
      href: "tel:+91180041226965"
    },
    {
      label: "WhatsApp Support",
      value: "+91 9876543210",
      description: "Direct support chat.",
      icon: MessageSquare,
      href: "https://wa.me/919876543210"
    },
    {
      label: "Corporate Headquarters",
      value: "Bangalore, India",
      description: "Datamites Corporate Campus, 560001.",
      icon: MapPin,
      href: "#"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* 1. Hero Header */}
      <section 
        className="relative bg-[#001A5A] text-white pt-10 pb-10 md:pt-20 md:pb-20 px-4 md:px-36 text-center overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(circle at 90% 10%, rgba(229, 45, 106, 0.15) 0%, transparent 80%)",
        }}
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative z-10">
          <span className="text-[#e52d6a] text-[10px] font-black tracking-[0.2em] uppercase bg-[#e52d6a]/10 px-4 py-1.5 rounded-full border border-[#e52d6a]/20">
            CONNECT WITH US
          </span>
          <h1 className="text-lg sm:text-2xl md:text-5xl font-extrabold tracking-tight leading-tight whitespace-nowrap">
            We are Here to Help You Scale Up
          </h1>
          <p className="text-slate-300 text-xs md:text-lg max-w-xl leading-relaxed">
            Have questions about curriculum, bulk team bookings, or certifications? Get in touch with our program coordinators.
          </p>
        </div>
      </section>

      {/* 2. Main Two-Column Layout */}
      <section className="py-16 md:py-24 px-4 md:px-36 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact info */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Contact Information</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Reach out via phone, email, or WhatsApp, or drop by our Bangalore corporate hub.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {contactOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <a 
                  key={i} 
                  href={opt.href} 
                  className={`flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all ${opt.href === "#" ? "pointer-events-none" : ""}`}
                >
                  <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm text-[#0052FF] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{opt.label}</h3>
                    <div className="text-slate-900 text-sm font-semibold mt-1 truncate">{opt.value}</div>
                    <p className="text-slate-500 text-[11px] font-semibold mt-1 leading-relaxed">{opt.description}</p>
                  </div>
                </a>
              );
            })}
          </div>

        </div>

        {/* Right Column: Contact form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mb-6 text-emerald-500 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Message Sent Successfully!</h3>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
                Thank you for reaching out. One of our course coordinators will call or email you shortly.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="bg-[#001A5A] hover:bg-[#003063] text-white font-extrabold px-6 py-2.5 rounded-xl text-sm transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-extrabold text-slate-900">Send Us a Message</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Fill in your details below and we will get back to you immediately.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                  {errorMsg}
                </div>
              )}

              {/* Name Field */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-800 tracking-wide uppercase">Full Name *</label>
                <input 
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: false })); }}
                  className={`w-full text-sm px-4 py-2.5 border rounded-xl focus:outline-none focus:border-black bg-white text-black transition-colors ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5"><ShieldAlert className="w-3.5 h-3.5" /> Full Name is required</p>}
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-800 tracking-wide uppercase">Email Address *</label>
                  <input 
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: false })); }}
                    className={`w-full text-sm px-4 py-2.5 border rounded-xl focus:outline-none focus:border-black bg-white text-black transition-colors ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5"><ShieldAlert className="w-3.5 h-3.5" /> Valid email required</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-800 tracking-wide uppercase">Phone Number *</label>
                  <input 
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: false })); }}
                    className={`w-full text-sm px-4 py-2.5 border rounded-xl focus:outline-none focus:border-black bg-white text-black transition-colors ${errors.phone ? 'border-red-400' : 'border-slate-200'}`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5"><ShieldAlert className="w-3.5 h-3.5" /> Valid phone required</p>}
                </div>
              </div>

              {/* Workshop Interest Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-800 tracking-wide uppercase">Subject *</label>
                <input
                  type="text"
                  placeholder="Enter the subject"
                  value={workshopInterest}
                  onChange={(e) => { setWorkshopInterest(e.target.value); setErrors(prev => ({ ...prev, interest: false })); }}
                  className={`w-full text-sm px-4 py-2.5 border rounded-xl bg-white text-black focus:outline-none focus:border-black transition-colors ${errors.interest ? 'border-red-400' : 'border-slate-200'}`}
                />
                {errors.interest && <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5"><ShieldAlert className="w-3.5 h-3.5" /> Please enter a subject</p>}
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-800 tracking-wide uppercase">Your Message *</label>
                <textarea 
                  rows={4}
                  placeholder="Write your questions or notes here..."
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setErrors(prev => ({ ...prev, message: false })); }}
                  className={`w-full text-sm px-4 py-2.5 border rounded-xl focus:outline-none focus:border-black bg-white text-black transition-colors ${errors.message ? 'border-red-400' : 'border-slate-200'}`}
                />
                {errors.message && <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5"><ShieldAlert className="w-3.5 h-3.5" /> Please write at least 10 characters</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0052FF] hover:bg-blue-600 active:scale-[0.99] text-white font-extrabold py-3.5 rounded-xl text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-lg mt-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Send Message <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

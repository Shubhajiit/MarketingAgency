"use client";

import React from "react";
import { Mail } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-[#001048] via-[#0033a0] to-[#0566ff] text-white min-h-[60vh]">
      <div className="max-w-4xl mx-auto w-full px-6 pt-10 pb-6 md:pt-16 md:pb-8 flex flex-col gap-6">
        
        {/* Contact Us Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-5xl font-bold tracking-tight">
            Contact Us
          </h1>
          <div className="text-slate-200 text-sm md:text-xl font-medium space-y-1">
            <p>We would love to hear from you.</p>
            <p>Feel free to reach out using the below details.</p>
          </div>
        </div>

        {/* Contact Links */}
        <div className="flex flex-col gap-4 text-sm md:text-lg font-medium">
          {/* WhatsApp Link */}
          <a
            href="https://wa.me/918388865431"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 hover:text-green-400 transition-colors w-fit"
          >
            <img 
              src="/Social_Icons/WhatsApp.png" 
              className="w-7 h-7 md:w-9 md:h-9 object-contain" 
              alt="WhatsApp" 
            />
            <span>+91-8388865431 (WhatsApp)</span>
          </a>

          {/* Phone Link */}
          <a
            href="tel:+918388865431"
            className="flex items-center gap-3.5 hover:text-green-450 transition-colors w-fit"
          >
            <img 
              src="/Social_Icons/phone-call.png" 
              className="w-7 h-7 md:w-9 md:h-9 object-contain" 
              alt="Phone Call" 
            />
            <span>+91-8388865431 (Call)</span>
          </a>

          {/* Email Link */}
          <a
            href="mailto:shubhajitbasak45@gmail.com"
            className="flex items-center gap-3.5 hover:text-blue-300 transition-colors w-fit"
          >
            <img 
              src="/Social_Icons/gmails.png" 
              className="w-7 h-7 md:w-9 md:h-9 object-contain" 
              alt="Gmail" 
            />
            <span>shubhajitbasak45@gmail.com</span>
          </a>
        </div>

        {/* Visit Us Section */}
        <div className="flex flex-col gap-2 mt-1">
          <h2 className="text-xl md:text-3xl font-bold tracking-tight">
            Visit Us
          </h2>
          <div className="flex flex-col gap-1 text-slate-200">
            <span className="font-bold text-white text-sm md:text-lg">Address:</span>
            <p className="text-sm md:text-lg leading-relaxed max-w-lg">
              15th Floor, Delta Tower, J-1/8, Sector 5, Salt Lake,<br />
              Bidhan Nagar Kolkata - 700091
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

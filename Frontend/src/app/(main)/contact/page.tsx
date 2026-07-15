"use client";

import React from "react";
import { Mail } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-[#001048] via-[#0033a0] to-[#0566ff] text-white min-h-[60vh]">
      <div className="max-w-4xl mx-auto w-full px-6 pt-8 pb-10 md:pt-24 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          
          {/* Left Column: Header & Contact Links */}
          <div className="flex flex-col gap-8">
            {/* Contact Us Section */}
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl md:text-5xl font-bold tracking-tight">
                Contact Us
              </h1>
              <div className="text-slate-200 text-sm md:text-xl font-medium space-y-2">
                <p>We would love to hear from you.</p>
                <p>Feel free to reach out using the below details.</p>
              </div>
            </div>

            {/* Contact Links */}
            <div className="flex flex-col gap-6 text-sm md:text-lg font-medium">
              {/* WhatsApp Link */}
              <a
                href="https://wa.me/918604527667"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 text-slate-300 hover:text-white transition-colors w-fit"
              >
                <img
                  src="/Social_Icons/icons8-whatsapp-logo.svg"
                  className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-85"
                  alt="WhatsApp"
                />
                <span>WhatsApp: 8604527667</span>
              </a>

              {/* Phone Link */}
              <a
                href="tel:+918604527667"
                className="flex items-center gap-3.5 text-slate-300 hover:text-white transition-colors w-fit"
              >
                <img
                  src="/Social_Icons/icons8-call.svg"
                  className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-85"
                  alt="Phone Call"
                />
                <span>Call: 8604527667</span>
              </a>

              {/* Email Link */}
              <a
                href="mailto:aitrainwithnaveen@gmail.com"
                className="flex items-center gap-3.5 text-slate-300 hover:text-white transition-colors w-fit"
              >
                <img
                  src="/Social_Icons/icons8-gmail.svg"
                  className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-85"
                  alt="Gmail"
                />
                <span className="break-all">Gmail: aitrainwithnaveen@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visit Us Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl md:text-5xl font-bold tracking-tight">
              Visit Us
            </h2>
            <div className="flex flex-col gap-2 text-slate-200">
              <span className="font-bold text-white text-sm md:text-lg">Address:</span>
              <p className="text-sm md:text-lg leading-relaxed max-w-lg">
                15th Floor, Delta Tower, J-1/8, Sector 5, Salt Lake,<br />
                Bidhan Nagar Kolkata - 700091
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

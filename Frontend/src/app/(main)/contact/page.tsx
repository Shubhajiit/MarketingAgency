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
        <div className="flex flex-col gap-3 text-sm md:text-lg font-medium">
          {/* WhatsApp Link */}
          <a
            href="https://wa.me/918388865431"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 hover:text-green-400 transition-colors w-fit"
          >
            <svg 
              className="w-5 h-5 md:w-6 md:h-6 fill-current" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.588 1.977 14.113.953 12.007.953 6.57 1.02 2.148 5.39 2.144 10.82c-.001 1.637.452 3.23 1.312 4.646l-.993 3.63 3.738-.97c1.378.75 2.87 1.13 4.4 1.13h.001zm11.362-7.38c-.302-.15-1.78-.88-2.053-.982-.272-.1-.47-.15-.667.15-.198.3-.767.982-.94 1.182-.173.2-.347.225-.65.075-3.05-1.52-4.25-2.585-5.698-5.1-.383-.66.383-.615 1.097-2.04.122-.24.06-.45-.03-.6-.09-.15-.767-1.85-1.05-2.53-.275-.667-.556-.575-.765-.586l-.65-.01c-.224 0-.59.084-.9.423-.31.339-1.18 1.155-1.18 2.816 0 1.66 1.21 3.266 1.378 3.493.167.226 2.38 3.637 5.766 5.1.8.349 1.43.559 1.92.715.81.258 1.54.221 2.12.135.647-.097 1.78-.73 2.03-1.43.254-.7.254-1.3.178-1.43-.076-.128-.272-.2-.575-.35z" />
            </svg>
            <span>+91-8388865431</span>
          </a>

          {/* Email Link */}
          <a
            href="mailto:shubhajitbasak45@gmail.com"
            className="flex items-center gap-3.5 hover:text-blue-300 transition-colors w-fit"
          >
            <Mail className="w-5 h-5 md:w-6 h-6" />
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

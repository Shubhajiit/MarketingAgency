"use client";

import React from "react";
import Image from "next/image";

export interface Course {
  id: string;
  title: string;
  instructorName?: string;
  category: "popular" | "pro-specialist" | "short" | "advanced";
  tag: string;
  hours: string;
  price: number;
  originalPrice: number;
  discount: string;
  bgGradient: string;
  circlesColor?: string;
  mentorPicture?: string;
  instructorImage?: string;
  isGraphicOnly?: boolean;
  graphicType?: "ai" | "seo" | "ppc" | "strategy";
  primaryCtaText: "Download Brochure" | "View Course";
  secondaryCtaText: "View Course" | "Buy Now";

  // Custom properties for replica UI
  isMockTest?: boolean;
  isPackage?: boolean;
  authorName?: string;
  validityText?: string;
  thumbnailType?: "dsa" | "cpp";
  isActive?: boolean;

  // Metadata properties
  metaType?: string;
  metaTypeSubtitle?: string;
  metaRating?: string;
  metaReviewsCount?: string;
  metaLevel?: string;
  metaLevelSubtitle?: string;
  metaDuration?: string;
  metaDurationSubtitle?: string;
  metaHandsOn?: string;
  metaHandsOnSubtitle?: string;
  videos?: any[];
}

interface CourseCardProps {
  course: Course;
  onPrimaryClick?: (course: Course) => void;
  onSecondaryClick?: (course: Course) => void;
}

// Custom DSA Supreme 3.0 Thumbnail component
export const DSASupremeThumbnail = () => {
  return (
    <div className="w-full h-full bg-[#030712] relative overflow-hidden flex z-10 px-4 py-3 select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-600/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-24 h-24 bg-rose-600/25 rounded-full blur-xl pointer-events-none" />

      {/* Content layout */}
      <div className="flex-1 flex flex-col justify-between z-10">
        {/* Top-Left Company Logos */}
        <div className="flex items-center gap-1 opacity-90 mt-1">
          {/* Wipro */}
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[5px] font-black text-blue-900 border-[0.5px] border-slate-200">W</div>
          {/* Amazon */}
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[5px] font-black text-black border-[0.5px] border-slate-200">a</div>
          {/* Apple */}
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[5px] font-black text-black border-[0.5px] border-slate-200"></div>
          {/* Netflix */}
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[5px] font-black text-red-600 border-[0.5px] border-slate-200">N</div>
          {/* Google */}
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[5px] font-black text-blue-500 border-[0.5px] border-slate-200">G</div>
        </div>

        {/* Course Title and Subtitle */}
        <div className="mb-2">
          <div className="text-[11px] font-black text-[#fbbf24] leading-tight tracking-wide drop-shadow-sm font-sans uppercase">
            Data Structures
          </div>
          <div className="text-[11px] font-black text-[#fbbf24] leading-tight tracking-wide drop-shadow-sm font-sans uppercase">
            & Algorithms
          </div>
          <div className="text-[12px] font-black text-white leading-none tracking-tight font-sans mt-0.5">
            SUPREME 3.0
          </div>
        </div>
      </div>

      {/* Instructor Portrait Image (using Unsplash developer portrait placeholder) */}
      <div className="w-[42%] h-full relative z-10 flex items-end">
        <img
          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80"
          alt="Love Babbar"
          className="w-full h-[95%] object-cover object-top brightness-95 border-b-2 border-orange-500"
        />
      </div>
    </div>
  );
};

// Custom C++ Mock Test Thumbnail component
export const CPPMockTestThumbnail = () => {
  return (
    <div className="w-full h-full bg-white relative overflow-hidden flex items-center justify-center z-10 px-4 select-none border-b border-slate-100">
      {/* Light pinkish-red checkered grid pattern */}
      <div
        className="absolute inset-0 opacity-45 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffe4e6 1px, transparent 1px),
            linear-gradient(to bottom, #ffe4e6 1px, transparent 1px)
          `,
          backgroundSize: '8px 8px'
        }}
      />

      {/* C++ Circular Logo on the left */}
      <div className="flex items-center gap-4 z-10 w-full justify-center">
        <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shadow-sm relative shrink-0">
          {/* Inner C++ logo graphic */}
          <div className="w-13 h-13 rounded-full bg-slate-50 flex items-center justify-center relative">
            <span className="text-xl font-black text-blue-600 font-sans tracking-tight">C++</span>
          </div>
        </div>

        {/* Text next to the logo */}
        <div className="flex flex-col text-left justify-center">
          <span className="text-2xl font-black text-slate-800 tracking-tight leading-none font-sans">C++</span>
          <span className="text-xl font-bold text-slate-700 tracking-tight leading-tight font-sans">Mock Test</span>
        </div>
      </div>
    </div>
  );
};

export const ConcentricRings = ({ color = "#fff" }: { color?: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-20 pointer-events-none">
    <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="1" fill="none" />
    <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="50" cy="50" r="20" stroke={color} strokeWidth="3" fill="none" />
    <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="4" fill="none" />
  </svg>
);

export function CourseCard({ course, onPrimaryClick, onSecondaryClick }: CourseCardProps) {
  // If it's a mock test UI format
  if (course.isMockTest) {
    return (
      <div className="bg-white border border-slate-100 rounded-none flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative w-full">
        {/* Card Image Area */}
        <div className="relative h-[155px] w-full shrink-0">
          <CPPMockTestThumbnail />
        </div>

        {/* Card Content */}
        <div className="p-4 flex flex-col flex-1 justify-between bg-white">
          <div className="flex flex-col">
            <h3 className="text-sm md:text-base font-bold text-slate-800 leading-snug tracking-tight line-clamp-2">
              {course.title}
            </h3>
            <span className="text-xs md:text-sm text-slate-400 font-normal mt-1">
              {course.instructorName || course.authorName || "Love Babbar"}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {/* Minimal thin progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[0%]"></div>
            </div>

            {/* Actions: Start Now button & Validity */}
            <div className="flex flex-col gap-1 text-left select-text">
              <button
                onClick={() => onPrimaryClick && onPrimaryClick(course)}
                className="text-[#4f46e5] hover:text-indigo-700 font-normal text-sm md:text-base text-left hover:underline w-fit select-text"
              >
                Start Now
              </button>
              <div className="text-[11px] md:text-xs text-slate-400 font-normal flex items-center gap-1 select-text">
                <span>Valid Till |</span>
                <span className="text-emerald-500 font-normal">Lifetime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If it's the package/DSA style
  if (course.isPackage) {
    return (
      <div className="bg-white border border-slate-100 rounded-none flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative w-full">
        {/* Card Image Area */}
        <div className="relative h-[155px] w-full shrink-0">
          <DSASupremeThumbnail />

          {/* PACKAGE badge on top-left of the image */}
          <div className="absolute top-3 left-3 bg-[#f59e0b] text-white text-[8px] font-black px-2 py-0.5 uppercase rounded tracking-wider z-20 select-none shadow-xs">
            PACKAGE
          </div>
        </div>

        {/* Card Content - Minimal list format as shown in image */}
        <div className="p-4 flex flex-col flex-1 justify-between bg-white">
          <h3 className="text-sm md:text-base font-bold text-slate-800 leading-snug tracking-tight line-clamp-2">
            {course.title}
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            {/* Minimal thin progress bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[0%]"></div>
            </div>

            {/* Actions: Start Now button & Validity */}
            <div className="flex flex-col gap-1 text-left select-text">
              <button
                onClick={() => onPrimaryClick && onPrimaryClick(course)}
                className="text-[#4f46e5] hover:text-indigo-700 font-normal text-sm md:text-base text-left hover:underline w-fit select-text"
              >
                Start Now
              </button>
              <div className="text-[11px] md:text-xs text-slate-400 font-normal flex items-center gap-1 select-text">
                <span>Valid Till |</span>
                <span className="text-emerald-500 font-normal">{course.validityText || "Lifetime"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const courseImg = course.mentorPicture || course.instructorImage;

  // Fallback / original styling if needed
  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-2xl flex flex-col justify-between shadow-[0_4px_15px_rgba(0,0,0,0.02)] md:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group">
      <div className={`relative h-[100px] md:h-[155px] w-full bg-gradient-to-tr ${course.bgGradient} shrink-0`}>
        {course.circlesColor && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
        )}

        {courseImg && (
          <img
            src={courseImg}
            alt={course.title}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[88%] w-auto object-contain z-10 transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
          />
        )}

        <div className="absolute top-0 left-0 bg-[#0c102a] text-white text-[7px] md:text-[9px] font-extrabold px-1.5 md:px-3 py-1 md:py-1.5 uppercase rounded-br-lg tracking-wider z-20 select-none shadow-sm">
          {course.tag}
        </div>

        <div className="absolute bottom-[-14px] md:bottom-[-18px] right-2 md:right-5 w-8 h-8 md:w-12 md:h-12 bg-[#a3ff12] text-[#0c102a] rounded-full flex flex-col items-center justify-center border border-white shadow-md z-20">
          <span className="text-[9px] md:text-[13px] font-black leading-none">{course.discount}</span>
          <span className="text-[6px] md:text-[8px] font-extrabold leading-none mt-0.5">OFF</span>
        </div>
      </div>

      <div className="p-3 pt-5 md:p-5 md:pt-7 flex flex-col items-center text-center flex-1 justify-between">
        <div className="w-full flex flex-col items-center">
          <h3 className="text-[11px] sm:text-xs md:text-[15px] font-extrabold text-[#0c102a] tracking-tight leading-snug min-h-[32px] md:min-h-[44px] flex items-center justify-center px-0.5">
            {course.title}
          </h3>

          <p className="text-[9px] md:text-[11px] text-slate-500 font-semibold tracking-wide mt-1 md:mt-2">
            {course.instructorName ? `Instructor: ${course.instructorName}` : course.hours}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 md:gap-3 mt-3 w-full">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="text-xs sm:text-sm md:text-[20px] font-semibold text-[#0c102a]">
                ₹{course.price}
              </span>
              <span className="text-slate-400 text-[10px] sm:text-xs line-through font-semibold">
                ₹{course.originalPrice}
              </span>
            </div>
            <span className="bg-[#a3ff12] text-[#0c102a] text-[8px] md:text-[9px] font-semibold px-1 py-0.5 rounded uppercase tracking-wider scale-90 sm:scale-100 whitespace-nowrap">
              {course.discount} OFF
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1 mt-3 md:mt-4.5">
          <button
            onClick={() => onPrimaryClick && onPrimaryClick(course)}
            className="w-full py-1.5 md:py-2 bg-white border border-[#0c102a] text-[#0c102a] hover:bg-slate-50 font-extrabold text-[9px] sm:text-[10px] md:text-[12px] rounded transition-all duration-150 uppercase tracking-wide cursor-pointer shadow-xs whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {course.primaryCtaText}
          </button>
          <button
            onClick={() => onSecondaryClick && onSecondaryClick(course)}
            className="w-full py-1 text-[#0c102a] hover:text-[#009ee3] font-bold text-[9px] sm:text-[10px] md:text-[12px] transition-colors uppercase tracking-wide cursor-pointer flex items-center justify-center gap-0.5"
          >
            {course.secondaryCtaText}
          </button>
        </div>
      </div>
    </div>
  );
}

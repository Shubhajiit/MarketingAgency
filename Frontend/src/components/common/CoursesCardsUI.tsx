"use client";

import React from "react";

export interface Course {
  id: string;
  title: string;
  category: "popular" | "pro-specialist" | "short" | "advanced";
  tag: string;
  hours: string;
  price: number;
  originalPrice: number;
  discount: string;
  bgGradient: string;
  circlesColor?: string;
  instructorImage?: string;
  isGraphicOnly?: boolean;
  graphicType?: "ai" | "seo" | "ppc" | "strategy";
  primaryCtaText: "Download Brochure" | "View Course";
  secondaryCtaText: "View Course" | "Buy Now";
}

interface CourseCardProps {
  course: Course;
  onPrimaryClick: (course: Course) => void;
  onSecondaryClick: (course: Course) => void;
}

// Helper Component for the concentric circle backgrounds
export const ConcentricRings = ({ color }: { color: string }) => null;

// Illustrative graphics for short courses (AI, SEO, PPC, Strategy)
export const CourseGraphic = ({ type }: { type?: "ai" | "seo" | "ppc" | "strategy" }) => {
  if (type === "seo") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#0284c7] to-[#0369a1] relative px-6 py-4 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_70%)]" />
        <div className="w-[180px] h-[110px] bg-slate-900 border border-slate-700/50 rounded-lg shadow-2xl relative overflow-hidden flex flex-col z-10">
          <div className="h-5 bg-slate-950 border-b border-slate-800 flex items-center px-2 gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 p-2 flex flex-col justify-between bg-[#071329]">
            <div className="text-[9px] text-white font-bold leading-normal tracking-tight text-center mt-1">
              Search Engine Optimization
            </div>
            <div className="flex justify-between items-center px-1">
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-[6px] text-slate-400">ORGANIC TRAFFIC</span>
                <span className="text-[10px] text-green-400 font-extrabold leading-none">+184%</span>
              </div>
              <div className="w-10 h-7 rounded border border-slate-700 bg-slate-950 flex items-center justify-center text-[8px]">
                🔍
              </div>
            </div>
            <div className="text-[6px] text-slate-500 text-center leading-normal border-t border-slate-800/80 pt-1">
              SEO Audit & Rank Optimization
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "ppc") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#0d9488] to-[#0f766e] relative px-6 py-4 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.15)_0%,transparent_70%)]" />
        <div className="w-[180px] h-[110px] bg-slate-900 border border-slate-700/50 rounded-lg shadow-2xl relative overflow-hidden flex flex-col z-10">
          <div className="h-5 bg-slate-950 border-b border-slate-800 flex items-center px-2 gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 p-2 flex flex-col justify-between bg-[#041d1a]">
            <div className="text-[9px] text-white font-bold leading-normal tracking-tight text-center mt-1">
              Paid Search (PPC) Campaigns
            </div>
            <div className="flex gap-2 justify-center items-center mt-1">
              <div className="flex flex-col items-center bg-slate-950 p-1 rounded border border-slate-800 w-12">
                <span className="text-[5px] text-slate-400">CPC</span>
                <span className="text-[8px] text-teal-400 font-extrabold">$0.45</span>
              </div>
              <div className="flex flex-col items-center bg-slate-950 p-1 rounded border border-slate-800 w-12">
                <span className="text-[5px] text-slate-400">CTR</span>
                <span className="text-[8px] text-yellow-400 font-extrabold">6.2%</span>
              </div>
            </div>
            <div className="text-[6px] text-slate-500 text-center leading-normal">
              Keyword Bidding & Budget Management
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "strategy") {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#475569] to-[#334155] relative px-6 py-4 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.15)_0%,transparent_70%)]" />
        <div className="w-[180px] h-[110px] bg-slate-900 border border-slate-700/50 rounded-lg shadow-2xl relative overflow-hidden flex flex-col z-10">
          <div className="h-5 bg-slate-950 border-b border-slate-800 flex items-center px-2 gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 p-2 flex flex-col justify-between bg-[#151c24]">
            <div className="text-[9px] text-white font-bold leading-normal tracking-tight text-center mt-1">
              Digital Marketing Strategy
            </div>
            <div className="flex items-center justify-center gap-1 mt-1.5">
              <span className="text-[8px] px-1 bg-slate-800 rounded text-slate-300 font-bold border border-slate-700">Plan</span>
              <span className="text-[8px] text-slate-500">→</span>
              <span className="text-[8px] px-1 bg-slate-800 rounded text-slate-300 font-bold border border-slate-700">Launch</span>
              <span className="text-[8px] text-slate-500">→</span>
              <span className="text-[8px] px-1 bg-slate-800 rounded text-emerald-400 font-bold border border-emerald-900 bg-emerald-950/20">Scale</span>
            </div>
            <div className="text-[6px] text-slate-500 text-center leading-normal">
              Frameworks for High-Growth Acquisition
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: AI Screen Graphic
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#1e2245] to-[#0c102a] relative px-6 py-4 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]" />
      <div className="w-[180px] h-[110px] bg-slate-900 border border-slate-700/50 rounded-lg shadow-2xl relative overflow-hidden flex flex-col z-10">
        <div className="h-5 bg-slate-950 border-b border-slate-800 flex items-center px-2 gap-1.5 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 p-2 flex flex-col justify-between bg-[#090d23]">
          <div className="text-[9px] text-white font-bold leading-normal tracking-tight text-center mt-1">
            Advanced AI for Digital Marketing
          </div>
          <p className="text-[6px] text-slate-400 text-center font-medium max-w-[130px] mx-auto leading-normal">
            Leverage specialized AI tools to maximize performance
          </p>
          <div className="flex justify-center gap-1.5 items-center mt-1">
            <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-[7px] text-blue-400 font-bold">
              AI
            </div>
            <div className="w-4 h-4 rounded bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-[7px] text-purple-400">
              ∞
            </div>
            <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[7px] text-emerald-400">
              📈
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-12 bottom-6 z-20 pointer-events-none select-none">
        <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 2v17.5l5.2-5.2h6.8L4.5 2z" stroke="black" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
};

export function CourseCard({ course, onPrimaryClick, onSecondaryClick }: CourseCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group">
      {/* Top Image Graphic Area */}
      <div className={`relative h-[110px] sm:h-[155px] w-full bg-gradient-to-tr ${course.bgGradient} shrink-0`}>
        {course.isGraphicOnly ? (
          <CourseGraphic type={course.graphicType} />
        ) : (
          <>
            {/* Background circular swirl patterns */}
            {course.circlesColor && <ConcentricRings color={course.circlesColor} />}

            {/* Instructor Portrait Image */}
            {course.instructorImage && (
              <img
                src={course.instructorImage}
                alt={course.title}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[88%] w-auto object-contain z-10 transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
              />
            )}
          </>
        )}

        {/* Top-Left Category Tag */}
        <div className="absolute top-0 left-0 bg-[#0c102a] text-white text-[8px] sm:text-[9px] font-extrabold px-2 py-1 sm:px-3 sm:py-1.5 uppercase rounded-br-lg tracking-wider z-20 select-none shadow-sm">
          {course.tag}
        </div>

        {/* Corner Discount circle Badge */}
        <div className="absolute bottom-[-12px] right-3 sm:bottom-[-18px] sm:right-5 w-8 h-8 sm:w-12 sm:h-12 bg-[#a3ff12] text-[#0c102a] rounded-full flex flex-col items-center justify-center border-2 border-white shadow-md z-20">
          <span className="text-[9px] sm:text-[13px] font-black leading-none">{course.discount}</span>
          <span className="text-[6px] sm:text-[8px] font-extrabold leading-none mt-0 sm:mt-0.5">OFF</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 pt-4 sm:p-5 sm:pt-7 flex flex-col items-center text-center flex-1 justify-between">
        <div className="w-full flex flex-col items-center">
          {/* Course Title */}
          <h3 className="text-xs sm:text-[15px] font-extrabold text-[#0c102a] tracking-tight leading-snug min-h-[32px] sm:min-h-[44px] flex items-center justify-center px-1">
            {course.title}
          </h3>

          {/* Stats details */}
          <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold tracking-wide mt-1 sm:mt-2">
            {course.hours}
          </p>

          {/* Pricing */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3.5 mt-2 sm:mt-4 flex-wrap sm:flex-nowrap">
            <span className="text-sm sm:text-[20px] font-semibold text-[#0c102a]">
              ₹{course.price}
            </span>
            <span className="text-slate-400 text-[10px] sm:text-xs line-through font-semibold">
              ₹{course.originalPrice}
            </span>
            <span className="bg-[#a3ff12] text-[#0c102a] text-[8px] sm:text-[9px] font-semibold px-1 sm:px-1.5 py-0.5 rounded uppercase tracking-wider">
              {course.discount} OFF
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="w-full flex flex-col gap-1.5 mt-3 sm:mt-4.5">
          <button
            onClick={() => onPrimaryClick(course)}
            className="w-full py-1.5 sm:py-2 bg-white border border-[#0c102a] text-[#0c102a] hover:bg-slate-50 font-bold sm:font-extrabold text-[10px] sm:text-[12px] rounded transition-all duration-150 uppercase tracking-wide cursor-pointer shadow-xs"
          >
            {course.primaryCtaText}
          </button>
          <button
            onClick={() => onSecondaryClick(course)}
            className="w-full py-1 text-[#0c102a] hover:text-[#009ee3] font-bold text-[10px] sm:text-[12px] transition-colors uppercase tracking-wide cursor-pointer flex items-center justify-center gap-0.5"
          >
            {course.secondaryCtaText}
          </button>
        </div>
      </div>
    </div>
  );
}

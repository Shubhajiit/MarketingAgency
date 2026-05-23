"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

interface Course {
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

const coursesData: Course[] = [
  // Popular Courses
  {
    id: "social-media-marketing-pop",
    title: "Social Media Marketing Course",
    category: "popular",
    tag: "DMI SPECIALIST",
    hours: "27 Hours • Self-Paced",
    price: 1442,
    originalPrice: 2060,
    discount: "30%",
    bgGradient: "from-[#e52d6a] to-[#d81b60]",
    circlesColor: "#00c58d",
    instructorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=350&q=80",
    primaryCtaText: "Download Brochure",
    secondaryCtaText: "View Course"
  },
  {
    id: "advanced-ai-pop",
    title: "Advanced AI For Digital Marketing",
    category: "popular",
    tag: "DMI TRACK",
    hours: "8 Hours • Self-Paced",
    price: 672,
    originalPrice: 895,
    discount: "25%",
    bgGradient: "from-[#1e2245] to-[#0c102a]",
    isGraphicOnly: true,
    graphicType: "ai",
    primaryCtaText: "View Course",
    secondaryCtaText: "Buy Now"
  },
  {
    id: "digital-marketing-diploma-pop",
    title: "Professional Diploma in Digital Marketing",
    category: "popular",
    tag: "DMI PRO",
    hours: "30 Hours • Self-Paced",
    price: 1442,
    originalPrice: 2060,
    discount: "30%",
    bgGradient: "from-[#22c55e] to-[#15803d]",
    circlesColor: "#00c58d",
    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=350&q=80",
    primaryCtaText: "Download Brochure",
    secondaryCtaText: "View Course"
  },
  {
    id: "search-marketing-pop",
    title: "Search Marketing Course",
    category: "popular",
    tag: "DMI SPECIALIST",
    hours: "27 Hours • Self-Paced",
    price: 1442,
    originalPrice: 2060,
    discount: "30%",
    bgGradient: "from-[#f97316] to-[#ea580c]",
    circlesColor: "#10b981",
    instructorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&q=80",
    primaryCtaText: "Download Brochure",
    secondaryCtaText: "View Course"
  },

  // Pro & Specialist Courses
  {
    id: "dmi-pro-spec",
    title: "Professional Diploma in Digital Marketing",
    category: "pro-specialist",
    tag: "DMI PRO",
    hours: "30 Hours • Self-Paced",
    price: 1442,
    originalPrice: 2060,
    discount: "30%",
    bgGradient: "from-[#22c55e] to-[#15803d]",
    circlesColor: "#00c58d",
    instructorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=350&q=80",
    primaryCtaText: "Download Brochure",
    secondaryCtaText: "View Course"
  },
  {
    id: "search-marketing-spec",
    title: "Search Marketing Course",
    category: "pro-specialist",
    tag: "DMI SPECIALIST",
    hours: "27 Hours • Self-Paced",
    price: 1442,
    originalPrice: 2060,
    discount: "30%",
    bgGradient: "from-[#f97316] to-[#ea580c]",
    circlesColor: "#10b981",
    instructorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&q=80",
    primaryCtaText: "Download Brochure",
    secondaryCtaText: "View Course"
  },
  {
    id: "social-media-marketing-spec",
    title: "Social Media Marketing Course",
    category: "pro-specialist",
    tag: "DMI SPECIALIST",
    hours: "27 Hours • Self-Paced",
    price: 1442,
    originalPrice: 2060,
    discount: "30%",
    bgGradient: "from-[#e52d6a] to-[#d81b60]",
    circlesColor: "#00c58d",
    instructorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=350&q=80",
    primaryCtaText: "Download Brochure",
    secondaryCtaText: "View Course"
  },
  {
    id: "strategy-leadership-spec",
    title: "Strategy & Leadership Course",
    category: "pro-specialist",
    tag: "DMI SPECIALIST",
    hours: "27 Hours • Self-Paced",
    price: 1442,
    originalPrice: 2060,
    discount: "30%",
    bgGradient: "from-[#a855f7] to-[#7e22ce]",
    circlesColor: "#38bdf8",
    instructorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=350&q=80",
    primaryCtaText: "Download Brochure",
    secondaryCtaText: "View Course"
  },

  // Short Courses
  {
    id: "advanced-ai-short",
    title: "Advanced AI For Digital Marketing",
    category: "short",
    tag: "DMI TRACK",
    hours: "8 Hours • Self-Paced",
    price: 672,
    originalPrice: 895,
    discount: "25%",
    bgGradient: "from-[#1e2245] to-[#0c102a]",
    isGraphicOnly: true,
    graphicType: "ai",
    primaryCtaText: "View Course",
    secondaryCtaText: "Buy Now"
  },
  {
    id: "seo-short",
    title: "Search Engine Optimization (SEO)",
    category: "short",
    tag: "DMI TRACK",
    hours: "8 Hours • Self-Paced",
    price: 672,
    originalPrice: 895,
    discount: "25%",
    bgGradient: "from-[#0284c7] to-[#0369a1]",
    isGraphicOnly: true,
    graphicType: "seo",
    primaryCtaText: "View Course",
    secondaryCtaText: "Buy Now"
  },
  {
    id: "ppc-short",
    title: "Paid Search (PPC)",
    category: "short",
    tag: "DMI TRACK",
    hours: "8 Hours • Self-Paced",
    price: 672,
    originalPrice: 895,
    discount: "25%",
    bgGradient: "from-[#0d9488] to-[#0f766e]",
    isGraphicOnly: true,
    graphicType: "ppc",
    primaryCtaText: "View Course",
    secondaryCtaText: "Buy Now"
  },
  {
    id: "digital-strategy-short",
    title: "Digital Strategy Course",
    category: "short",
    tag: "DMI TRACK",
    hours: "8 Hours • Self-Paced",
    price: 672,
    originalPrice: 895,
    discount: "25%",
    bgGradient: "from-[#475569] to-[#334155]",
    isGraphicOnly: true,
    graphicType: "strategy",
    primaryCtaText: "View Course",
    secondaryCtaText: "Buy Now"
  },

  // Advanced Courses
  {
    id: "dmi-expert-adv",
    title: "DMI Expert Certification",
    category: "advanced",
    tag: "DMI EXPERT",
    hours: "44 Hours • Self-Paced",
    price: 2900,
    originalPrice: 3625,
    discount: "20%",
    bgGradient: "from-[#6366f1] to-[#4f46e5]",
    circlesColor: "#f43f5e",
    instructorImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=350&q=80",
    primaryCtaText: "Download Brochure",
    secondaryCtaText: "View Course"
  },
  {
    id: "postgrad-diploma-adv",
    title: "Postgraduate Diploma In Digital Marketing",
    category: "advanced",
    tag: "DMI POSTGRAD",
    hours: "60 Hours • Self-Paced",
    price: 3500,
    originalPrice: 4120,
    discount: "15%",
    bgGradient: "from-[#0f172a] to-[#020617]",
    circlesColor: "#a855f7",
    instructorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=350&q=80",
    primaryCtaText: "Download Brochure",
    secondaryCtaText: "View Course"
  },
  {
    id: "msc-digital-marketing-adv",
    title: "Masters (MSc) In Digital Marketing",
    category: "advanced",
    tag: "DMI MASTERS",
    hours: "120 Hours • Self-Paced",
    price: 4500,
    originalPrice: 5000,
    discount: "10%",
    bgGradient: "from-[#1d4ed8] to-[#1e3a8a]",
    circlesColor: "#fbbf24",
    instructorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=350&q=80",
    primaryCtaText: "Download Brochure",
    secondaryCtaText: "View Course"
  }
];

const tabs = [
  { id: "popular", label: "Popular Courses" },
  { id: "pro-specialist", label: "Pro & Specialist Courses" },
  { id: "short", label: "Short Courses" },
  { id: "advanced", label: "Advanced Courses" }
];

// Helper Component for the concentric circle backgrounds
const ConcentricRings = ({ color }: { color: string }) => (
  <div className="absolute right-[-20px] top-[-20px] w-44 h-44 opacity-40 pointer-events-none z-0">
    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color }}>
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeDasharray="1, 15"
        strokeLinecap="round"
        className="animate-[spin_120s_linear_infinite]"
      />
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeDasharray="4, 10"
        strokeLinecap="round"
        className="animate-[spin_90s_linear_infinite_reverse]"
      />
      <circle
        cx="100"
        cy="100"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeDasharray="2, 6"
        className="animate-[spin_60s_linear_infinite]"
      />
    </svg>
  </div>
);

// Illustrative graphics for short courses (AI, SEO, PPC, Strategy)
const CourseGraphic = ({ type }: { type?: "ai" | "seo" | "ppc" | "strategy" }) => {
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

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<string>("popular");

  // Dynamic SEO Configuration
  useEffect(() => {
    document.title = "Explore Our Certification Courses | AI Scale";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Browse and explore our global standard digital marketing and AI certification courses, including DMI Pro, DMI Expert, Advanced AI, SEO, and PPC."
      );
    }
  }, []);

  const filteredCourses = coursesData.filter(
    (course) => course.category === activeTab
  );

  return (
    <div className="min-h-screen font-sans flex flex-col bg-white">
      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-50 w-full flex flex-col bg-white shadow-sm">
        {/* Top Banner 1 - Dark */}
        <div className="bg-[#333333] text-white text-[11px] md:text-sm py-2 overflow-hidden flex items-center">
          <div className="animate-marquee whitespace-nowrap flex min-w-max">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-4 text-blue-100 font-semibold tracking-wider">
                ★ HURRY! UPTO 50% OFF ON ALL WORKSHOP BOOKINGS ★
              </span>
            ))}
          </div>
        </div>

        {/* Top Banner 2 - Orange */}
        <div className="bg-[#fca130] py-1.5 px-4 md:px-36 text-white text-xs md:text-sm flex flex-row justify-between md:justify-end gap-4 md:gap-6 font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
          <a href="#" className="flex items-center gap-1.5 hover:underline shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Refer & Earn
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:underline shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Bootcamp
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:underline shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Demo Class
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:underline font-bold shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            1800 4122 6965
          </a>
        </div>

        {/* Navbar */}
        <Navbar />
      </div>

      {/* Main Page Area */}
      <main className="flex-1 bg-slate-50/50 py-16 px-4 md:px-36">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          {/* Header */}
          <h1 className="text-3xl md:text-[38px] font-black text-[#1e2245] tracking-tight text-center mb-8">
            Explore Our Certification Courses
          </h1>

          {/* Interactive Navigation Tabs */}
          <div className="w-full border-b border-slate-100 flex justify-center mb-10 overflow-x-auto whitespace-nowrap scrollbar-none">
            <nav className="flex gap-8 md:gap-12 px-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 text-[13px] md:text-sm font-bold tracking-wide transition-all duration-200 border-b-3 -mb-[1.5px] cursor-pointer select-none ${isActive
                      ? "text-[#1e2245] border-[#00c58d]"
                      : "text-slate-400 hover:text-slate-600 border-transparent"
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Grid of Course Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[480px]">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-100 rounded-2xl flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group"
              >
                {/* Top Image Graphic Area */}
                <div className={`relative h-[180px] w-full bg-gradient-to-tr ${course.bgGradient} overflow-hidden shrink-0`}>
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
                  <div className="absolute top-0 left-0 bg-[#0c102a] text-white text-[9px] font-extrabold px-3 py-1.5 uppercase rounded-br-lg tracking-wider z-20 select-none shadow-sm">
                    {course.tag}
                  </div>

                  {/* Corner Discount circle Badge */}
                  <div className="absolute bottom-[-18px] right-5 w-12 h-12 bg-[#a3ff12] text-[#0c102a] rounded-full flex flex-col items-center justify-center border-2 border-white shadow-md z-20 select-none">
                    <span className="text-[13px] font-black leading-none">{course.discount}</span>
                    <span className="text-[8px] font-extrabold leading-none mt-0.5">OFF</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 pt-8 flex flex-col items-center text-center flex-1 justify-between">
                  <div className="w-full flex flex-col items-center">
                    {/* Course Title */}
                    <h3 className="text-[15px] font-extrabold text-[#0c102a] tracking-tight leading-snug min-h-[44px] flex items-center justify-center px-1">
                      {course.title}
                    </h3>

                    {/* Stats details */}
                    <p className="text-[11px] text-slate-500 font-semibold tracking-wide mt-2 select-none">
                      {course.hours}
                    </p>

                    {/* Pricing */}
                    <div className="flex items-center justify-center gap-2 mt-4 select-none">
                      <span className="text-[20px] font-black text-[#0c102a]">
                        ${course.price}
                      </span>
                      <span className="text-slate-400 text-xs line-through font-semibold">
                        ${course.originalPrice}
                      </span>
                      <span className="bg-[#a3ff12] text-[#0c102a] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {course.discount} OFF
                      </span>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="w-full flex flex-col gap-2.5 mt-6">
                    <button className="w-full py-2.5 bg-white border border-[#0c102a] text-[#0c102a] hover:bg-slate-50 font-extrabold text-[12.5px] rounded transition-all duration-150 uppercase tracking-wide cursor-pointer shadow-xs">
                      {course.primaryCtaText}
                    </button>
                    <button className="w-full py-1 text-[#0c102a] hover:text-[#009ee3] font-bold text-[12.5px] transition-colors uppercase tracking-wide cursor-pointer flex items-center justify-center gap-0.5">
                      {course.secondaryCtaText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

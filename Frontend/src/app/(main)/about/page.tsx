"use client";

import Link from "next/link";
import { Award, BookOpen, Users, Compass, ShieldCheck, Sparkles, ArrowRight, TrendingUp } from "lucide-react";

export default function AboutUsPage() {


  const team = [
    {
      name: "Naveen Mishra",
      role: "Founder",
      image: "/Mentors/Founder.svg",
      tag: "Founder",
      bullets: [
        "IIT Delhi Alumni",
        "Director of AI for Techies",
        "Senior Data Analyst"
      ],
      bio: "I have successfully conducted over 90 workshops and trained more than 1,000 students. Through my career-focused mentoring programs, I have helped over 300+ students transition into successful professional opportunities."
    },
    {
      name: "Aditya Shukla",
      role: "Co-Founder",
      image: "/Mentors/Co-Founder.svg",
      tag: "Co-Founder",
      bullets: [
        "IIT Kharagpur Alumni",
        "Co-Founder of AI for Techies",
        "Senior AI & Tech Mentor"
      ],
      bio: "I lead the management and operations of the company, focusing on scaling business processes, optimizing team workflows, and driving strategic execution across all marketing and educational campaigns."
    }
  ];

  return (
    <>
      <style>{`
        @keyframes customGlow {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.3;
            filter: blur(16px);
          }
          50% {
            transform: scale(1.04);
            opacity: 0.6;
            filter: blur(24px);
          }
        }
        .animate-custom-glow {
          animation: customGlow 3s ease-in-out infinite;
        }
      `}</style>

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden px-6 py-10 md:px-16 md:pt-16 md:pb-8 flex flex-col items-center text-center gap-4"
        style={{
          background: "linear-gradient(160deg, #f0f5ff 0%, #ffffff 55%, #fdf4ff 100%)",
        }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <h1 className="relative z-10 text-4xl md:text-5xl font-semibold text-zinc-900 tracking-tight leading-none">
          About Us
        </h1>
        <p className="relative z-10 text-zinc-500 text-sm sm:text-base w-full mt-2 leading-relaxed hidden md:block">
          Meet the leaders, mentors, and experts building the future of AI-driven digital education.
        </p>
      </div>

      {/* Wavy blue border line (Repeating wave across full width) */}
      <div className="w-full overflow-hidden leading-[0] bg-white -mt-0.5 relative z-10">
        <svg className="w-full h-3 text-blue-500" viewBox="0 0 1200 12" preserveAspectRatio="none">
          <defs>
            <pattern id="wavePattern" width="640" height="12" patternUnits="userSpaceOnUse">
              <path d="M0,6 Q160,0 320,6 T640,6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </pattern>
          </defs>
          <rect width="100%" height="12" fill="url(#wavePattern)" />
        </svg>
      </div>

      {/* ── Meet the Leadership & Team ── */}
      <div className="bg-slate-50/50 px-6 sm:px-12 md:px-24 pt-2 pb-12 md:pt-6 md:pb-16 border-b border-zinc-100 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left side: Sticky info header */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-5">
            <h2 className="text-3xl md:text-4xl font-normal text-black tracking-tight leading-tight">
              Meet Our Mentors &amp; Founders
            </h2>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
              Learn directly from creators and industry veterans who have built products and systems at premier organizations. We focus on real-world application, not just theory.
            </p>
          </div>

          {/* Right side: Modern, high-end list cards with dark gradient and moving borders */}
          <div className="lg:col-span-8 flex flex-col gap-8 w-full">
            {team.map((member, i) => (
              <div key={i} className="relative w-full group">
                {/* Border wrapper with overflow-hidden */}
                <div className="relative p-[2px] overflow-hidden rounded-3xl w-full shadow-[0_15px_40px_-15px_rgba(0,0,0,0.5)]">
                  {/* Rotating border gradient (moving lighting - fully vibrant neon colors) */}
                  <div
                    className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] opacity-100"
                    style={{
                      background: 'conic-gradient(from 0deg at 50% 50%, #3b82f6 0%, #8b5cf6 25%, #f43f5e 50%, #10b981 75%, #3b82f6 100%)'
                    }}
                  />

                  {/* Card Content Wrapper (Light Gray Background) */}
                  <div className="relative w-full h-full bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-[22px] p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start z-10">

                    {/* Photo & Name area */}
                    <div className="flex flex-col items-center gap-3 shrink-0 w-36 sm:w-44 text-center">
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-200 transition-transform duration-500 group-hover:scale-[1.03]">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {member.name}
                        </h3>
                      </div>
                    </div>

                    {/* Bio text area */}
                    <div className="flex-1 flex flex-col gap-2 text-center sm:text-left justify-start pt-2">
                      <div className="flex justify-center sm:justify-start">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                          {member.role}
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-zinc-600 leading-relaxed mt-2">
                        {member.bio}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Meet the Team (Employees) ── */}
      <div className="bg-white px-6 sm:px-12 md:px-24 py-16 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-blue-600">
              Our Core Team
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight">
              The Minds Behind the Magic
            </h2>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
              Our dedicated professionals work tirelessly behind the scenes to deliver exceptional digital experiences and ensure client success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sangram Rao",
                role: "Performance Marketing & Meta Ads Expert",
                image: "/Mentors/Performance-Marketing.jpeg",
                description: "With over 8 years of experience, specializes in Meta Ads, paid advertising, budget scaling, conversion funnels, and data-driven marketing campaigns.",
              },
              {
                name: "Harsh Pandey",
                role: "Video Editor & Founder of Social Rise Up",
                image: "/Mentors/Editor.jpeg",
                description: "With 7 years of professional editing experience, crafts compelling visual stories, high-converting video ads, dynamic content layouts, and drives social growth.",
              },
              {
                name: "Vishnu Rao",
                role: "Video Editor & Online Educator",
                image: "/Mentors/Online-Editor.jpeg",
                description: "With over 4 years of professional video editing experience, conducts online editing workshops and mentors aspiring creators in advanced editing techniques.",
              }
            ].map((emp, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-b from-zinc-50 to-zinc-100/50 hover:from-white hover:to-white border border-zinc-200/80 hover:border-blue-400 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.15)] flex flex-col"
              >
                {/* Card Top: Full-width Image or Gradient Fallback */}
                <div className="relative w-full h-80 overflow-hidden bg-zinc-100 border-b border-zinc-100">
                  {emp.image ? (
                    <img
                      src={emp.image}
                      alt={emp.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                        {emp.name.split(" ").map(n => n[0]).join("")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom: Content info */}
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">{emp.role}</p>
                  </div>
                  <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed flex-1">
                    {emp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div
        className="relative overflow-hidden px-8 md:px-16 py-16 flex flex-col items-center text-center gap-5"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 60%, #4c1d95 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <span className="relative z-10 text-[10px] font-semibold tracking-[0.22em] uppercase text-blue-300">
          Ready to Start?
        </span>
        <h2 className="relative z-10 text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug max-w-sm">
          Master AI Skills with Hands-On Training
        </h2>
        <p className="relative z-10 text-blue-200/80 text-sm leading-relaxed max-w-sm">
          Secure a seat in our upcoming live workshops — prompt engineering, digital automation,
          and modern code development applied from day one.
        </p>
        <Link
          href="/three-days-workshops"
          className="relative z-10 group inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-2.5 rounded-lg text-sm transition-all duration-200 shadow-md mt-1"
        >
          Explore 3-Day Workshops
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Award, BookOpen, Users, Compass, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function AboutUsPage() {
  const stats = [
    { id: 1, value: "15,000+", label: "Careers Transformed", icon: Users, color: "text-[#0052FF]" },
    { id: 2, value: "4.8 / 5", label: "Learner Satisfaction", icon: Award, color: "text-amber-500" },
    { id: 3, value: "120+", label: "Global Corporate Partners", icon: BookOpen, color: "text-[#00c58d]" },
    { id: 4, value: "50+", label: "Industry Experts & Mentors", icon: Compass, color: "text-[#e52d6a]" },
  ];

  const values = [
    {
      title: "Direct Mentorship",
      description: "Learn directly from practitioners working at top tech firms (Google, OpenAI, Meta) who teach real-world workflows rather than dry theory.",
      icon: Sparkles,
      gradient: "from-blue-500/20 to-[#0052FF]/20"
    },
    {
      title: "Hands-on Projects",
      description: "Gain actual experience by working on real production codebases and capstones. Build a portfolio that stands out to modern tech recruiters.",
      icon: Compass,
      gradient: "from-emerald-500/20 to-[#00c58d]/20"
    },
    {
      title: "Continuous Career Support",
      description: "Our relationship doesn't end when the workshop does. Enjoy lifetime access to resources, community Slack channels, and mock interview setups.",
      icon: ShieldCheck,
      gradient: "from-pink-500/20 to-[#e52d6a]/20"
    }
  ];

  const team = [
    {
      name: "Dr. jane doe",
      role: "Lead AI Researcher & Speaker",
      image: "https://avatar.iran.liara.run/public/64",
      bio: "Ex-Google Brain Scientist specializing in large language models and generative AI systems."
    },
    {
      name: "Mr. Mridul Sen",
      role: "Senior Solutions Architect",
      image: "https://avatar.iran.liara.run/public/15",
      bio: "Cloud & Devops Leader with 12+ years of architecting scalable distributed systems for Fortune 500 agencies."
    },
    {
      name: "Ms. Priya Nair",
      role: "Director of Product Strategy",
      image: "https://avatar.iran.liara.run/public/85",
      bio: "Former Lead Product Manager at Stripe focusing on growth strategy and user conversion automation."
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* 1. Hero Section */}
      <section 
        className="relative bg-[#001A5A] text-white pt-20 pb-24 px-4 md:px-36 text-center overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(circle at 10% 20%, rgba(0, 82, 255, 0.15) 0%, transparent 80%)",
        }}
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 relative z-10">
          <span className="text-[#00c58d] text-xs font-black tracking-[0.2em] uppercase bg-[#00c58d]/10 px-4 py-1.5 rounded-full border border--[#00c58d]/20 animate-fade-in">
            OUR MISSION & VISION
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl">
            Democratizing Technology & AI Education for All Learners
          </h1>
          <p className="text-sm md:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
            We bridge the gap between academic theory and industry reality. Through immersive live workshops, direct mentorship, and cohort-based learning, we help professionals adapt and thrive.
          </p>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-12 md:py-16 px-4 md:px-36 bg-slate-50 border-b border-slate-100 relative -mt-8 z-20 max-w-6xl mx-auto w-full rounded-2xl shadow-xl border border-slate-200/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.id} className="text-center flex flex-col items-center gap-2.5">
                <div className={`p-3 bg-white rounded-xl shadow-sm border border-slate-100 ${stat.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-[11px] md:text-xs text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Core Story Section */}
      <section className="py-20 px-4 md:px-36 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Bridging the Skills Gap in an AI-First World
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            As technology accelerates, the traditional educational system struggles to keep pace. AI is shifting the foundations of software design, marketing operations, product development, and customer engagement. 
          </p>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            AI Scale was created to build a flexible learning hub. Our workshops are designed to bypass outdated textbook curriculums and introduce cutting-edge tools directly. Our focus is immediate execution—you should be applying what you learn in our live classrooms by the very next business day.
          </p>
        </div>
        <div className="relative rounded-2xl overflow-hidden border-2 border-slate-100 shadow-[10px_10px_0px_#0052FF] aspect-[4/3] bg-slate-100 flex items-center justify-center">
          <img 
            src="https://res.cloudinary.com/dppgindsc/image/upload/v1780774475/workshops/lqcuatyi3elxhrqbtkdn.png" 
            alt="AI Learning Platform in action" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 4. Core Values Section */}
      <section className="py-20 bg-slate-50/50 border-t border-b border-slate-100 px-4 md:px-36">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center flex flex-col items-center gap-3">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Our Core Learning Pillars</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl">
              We design every single masterclass and course around three simple principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, i) => {
              const IconComponent = val.icon;
              return (
                <div 
                  key={i} 
                  className="bg-white border border-slate-200/70 p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 relative group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${val.gradient} flex items-center justify-center text-slate-800`}>
                    <IconComponent className="w-5 h-5 text-[#0052FF]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{val.title}</h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{val.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Mentors Section */}
      <section className="py-20 px-4 md:px-36 max-w-7xl mx-auto flex flex-col gap-12 w-full">
        <div className="text-center flex flex-col items-center gap-3">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Instructors & Industry Mentors</h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl">
            Learn from professionals who have designed systems and scale programs at top tech companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="flex flex-col items-center bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner mb-4 bg-slate-100 flex items-center justify-center">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight text-center">{member.name}</h3>
              <span className="text-[#0052FF] text-xs font-bold mt-1 text-center">{member.role}</span>
              <p className="text-slate-500 text-xs leading-relaxed text-center mt-3 border-t border-slate-100 pt-3 flex-1">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-16 md:py-20 bg-[#0B132B] text-white px-4 md:px-36 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:24px_24px] pointer-events-none" />
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 relative z-10">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Ready to Master AI Skills?</h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
            Secure a seat in our upcoming live workshops. Learn hands-on prompt engineering, digital automation, and code development.
          </p>
          <div className="flex gap-4 mt-2">
            <Link 
              href="/three-days-workshops" 
              className="bg-[#0052FF] hover:bg-blue-600 active:scale-[0.99] text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              Explore 3-Day Workshops <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Award, BookOpen, Users, Compass, ShieldCheck, Sparkles, ArrowRight, TrendingUp } from "lucide-react";

export default function AboutUsPage() {
  const stats = [
    { id: 1, value: "15,000+", label: "Careers Transformed",  icon: Users,      color: "#2563eb" },
    { id: 2, value: "4.8 / 5", label: "Learner Satisfaction", icon: Award,      color: "#d97706" },
    { id: 3, value: "120+",    label: "Corporate Partners",    icon: TrendingUp, color: "#059669" },
    { id: 4, value: "50+",     label: "Industry Mentors",      icon: BookOpen,   color: "#7c3aed" },
  ];

  const pillars = [
    {
      title: "Direct Mentorship",
      description: "Learn from practitioners at Google, OpenAI, and Meta — people who teach real workflows, not dry theory.",
      icon: Sparkles,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      title: "Hands-on Projects",
      description: "Work on real production codebases and capstones. Build a portfolio that stands out to modern tech recruiters.",
      icon: Compass,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      title: "Career Support",
      description: "Lifetime access to resources, community Slack, and mock interview setups — long after the workshop ends.",
      icon: ShieldCheck,
      color: "#7c3aed",
      bg: "#f5f3ff",
    },
  ];

  const team = [
    {
      name: "Dr. Jane Doe",
      role: "Lead AI Researcher & Speaker",
      image: "https://avatar.iran.liara.run/public/64",
      bio: "Ex-Google Brain Scientist specialising in large language models and generative AI systems.",
      tag: "AI Research",
    },
    {
      name: "Mr. Mridul Sen",
      role: "Senior Solutions Architect",
      image: "https://avatar.iran.liara.run/public/15",
      bio: "Cloud & DevOps leader with 12+ years architecting scalable distributed systems for Fortune 500 companies.",
      tag: "Cloud & DevOps",
    },
    {
      name: "Ms. Priya Nair",
      role: "Director of Product Strategy",
      image: "https://avatar.iran.liara.run/public/85",
      bio: "Former Lead PM at Stripe, focused on growth strategy and user-conversion automation.",
      tag: "Product",
    },
  ];

  return (
    <>

        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden px-8 md:px-16 pt-20 pb-24 flex flex-col items-center text-center gap-6"
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

          <span className="relative z-10 inline-block text-[10px] font-semibold tracking-[0.22em] uppercase text-zinc-400 border border-zinc-200 bg-white/70 rounded-full px-4 py-1.5">
            Our Mission &amp; Vision
          </span>

          <h1 className="relative z-10 text-4xl md:text-[3.25rem] font-bold text-zinc-900 tracking-tight leading-[1.1] max-w-2xl">
            Democratizing{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Technology &amp; AI
            </span>{" "}
            Education for Every Learner
          </h1>

          <p className="relative z-10 text-zinc-500 text-sm md:text-base leading-relaxed max-w-lg">
            We bridge the gap between academic theory and industry reality — through
            immersive live workshops, direct mentorship, and cohort-based learning.
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="border-t border-b border-zinc-100 bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-zinc-100">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 py-9 px-4">
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                  <span className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: s.color }}>
                    {s.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium text-center leading-snug">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Story ── */}
        <div className="bg-white px-8 md:px-16 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-b border-zinc-100">
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-zinc-400">
              Our Story
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight leading-snug">
              Bridging the Skills Gap in an AI-First World
            </h2>
            <div className="space-y-3 text-zinc-500 text-sm leading-7">
              <p>
                As technology accelerates, the traditional education system struggles to keep pace.
                AI is reshaping software design, marketing operations, product development,
                and customer engagement from the ground up.
              </p>
              <p>
                AI Scale was built to bypass outdated curriculums and introduce cutting-edge tools
                directly. Our focus is immediate execution — you apply what you learn by the very
                next business day.
              </p>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-[4/3] ring-1 ring-zinc-100 shadow-md">
            <img
              src="https://res.cloudinary.com/dppgindsc/image/upload/v1780774475/workshops/lqcuatyi3elxhrqbtkdn.png"
              alt="AI Learning Platform"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ── Pillars ── */}
        <div className="bg-zinc-50 px-8 md:px-16 py-16 flex flex-col gap-12 border-b border-zinc-100">
          <div className="flex flex-col items-center text-center gap-2 max-w-md mx-auto">
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-zinc-400">
              How We Teach
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
              Our Core Learning Pillars
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Every masterclass is built around three principles we never compromise on.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-zinc-100 p-6 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: p.bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: p.color }} />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <h3 className="text-sm font-semibold text-zinc-900">{p.title}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">{p.description}</p>
                  </div>
                  <div className="pt-4 border-t border-zinc-100">
                    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: p.color }}>
                      Pillar 0{i + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Team ── */}
        <div className="bg-white px-8 md:px-16 py-16 flex flex-col gap-12 border-b border-zinc-100">
          <div className="flex flex-col items-center text-center gap-2 max-w-md mx-auto">
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-zinc-400">
              Meet the Team
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
              Instructors &amp; Industry Mentors
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Learn from professionals who have shipped systems at the world's top tech companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {team.map((m, i) => (
              <div
                key={i}
                className="group flex flex-col bg-white border border-zinc-100 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-zinc-100 transition-all duration-300"
              >
                <div className="relative h-44 bg-zinc-50 overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
                  />
                  <span
                    className="absolute bottom-2.5 left-3 text-[9px] font-semibold uppercase tracking-widest px-2 py-1 rounded"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      color: "#2563eb",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {m.tag}
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-1 flex-1">
                  <h3 className="text-xs font-semibold text-zinc-900 tracking-tight">{m.name}</h3>
                  <span className="text-[0.7rem] text-blue-600 font-medium">{m.role}</span>
                  <p className="text-zinc-400 text-[0.7rem] leading-relaxed mt-3 pt-3 border-t border-zinc-100">
                    {m.bio}
                  </p>
                </div>
              </div>
            ))}
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

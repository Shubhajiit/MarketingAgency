"use client";

import React from "react";
import { LogoCloud } from "@/components/ui/logo-cloud-2";
import Image from "next/image";
import Link from "next/link";
import GrowthStats from "@/components/ui/growth-stats";
import CertificationCoursesSection from "@/components/MainWebsite/Courses/certification-courses";

const COURSE_LEVELS = [
    {
        title: "Digital Marketing Essentials",
        subtitle: "6 Hours • Associate Level Certification",
        bullets: [
            "For beginners and non-marketers",
            "Learn the fundamentals of digital marketing",
            "Build digital awareness"
        ],
        image: "/LandingPage/essentials_course.png",
        linkText: "View Course",
        linkUrl: "/courses"
    },
    {
        title: "Short Courses: Bite-size Learning",
        subtitle: "5 to 10 Hours • Associate Level Certification",
        bullets: [
            "Rapid skills development",
            "Focus on an in-demand or emerging skill",
            "Stay relevant in your role",
            "To the point and essential"
        ],
        image: "/LandingPage/short_course.png",
        linkText: "View Courses",
        linkUrl: "/courses"
    },
    {
        title: "Pro & Specialist Courses",
        subtitle: "25 to 40 Hours • Professional Certification",
        bullets: [
            "In depth and comprehensive",
            "DMI Pro: For generalists who need to develop multiple skills at professional level",
            "DMI Specialisms: For specialists focusing on one discipline to build expertise"
        ],
        image: "/LandingPage/pro_course.png",
        linkText: "View Courses",
        linkUrl: "/courses"
    },
    {
        title: "Advanced Courses",
        subtitle: "Advanced Qualifications",
        bullets: [
            "Expert led programmes and courses",
            "Open the doors to C-level roles",
            "Build expertise in digital marketing",
            "Gain business strategy and leadership skills"
        ],
        image: "/LandingPage/advanced_course.png",
        linkText: "View Courses",
        linkUrl: "/courses"
    }
];

const REVIEWS = [
    {
        text: "A lot of online workshops, but this one actually delivered. Practical, no fluff, and I left with tools I could use the very next day. Worth every minute.",
        author: "James R."
    },
    {
        text: "The session on AI-driven SEO alone saved my team weeks of manual research. This isn't just theory—it's highly actionable systems that produce real growth.",
        author: "Sarah K. (Growth Lead)"
    },
    {
        text: "Excellent value. The instructor walked through a live setup of a lead generation funnel without any complex coding. A game-changer for our agency.",
        author: "Arjun M. (Marketing Director)"
    },
    {
        text: "I was skeptical at first, but the framework for scaling content output 3x using AI is incredibly robust. Highly recommend for any marketing professional.",
        author: "Elena R. (Brand Manager)"
    }
];

export default function Page() {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [transitionEnabled, setTransitionEnabled] = React.useState(true);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const startTimer = React.useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTransitionEnabled(true);
            setCurrentIndex((prev) => prev + 1);
        }, 2000);
    }, []);

    React.useEffect(() => {
        startTimer();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [startTimer]);

    React.useEffect(() => {
        if (currentIndex === REVIEWS.length) {
            const timer = setTimeout(() => {
                setTransitionEnabled(false);
                setCurrentIndex(0);
            }, 500); // Wait for transition duration
            return () => clearTimeout(timer);
        }
    }, [currentIndex]);

    const handleDotClick = (index: number) => {
        setTransitionEnabled(true);
        setCurrentIndex(index);
        startTimer();
    };
    return (
        <div className="flex-1 flex flex-col">

            {/* Hero Section */}
            <section className="relative isolate w-full min-h-[450px] flex items-center overflow-hidden">
                {/* <ParticlesBg /> */}

                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0 w-full h-full bg-zinc-900 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Professional Woman"
                        className="w-full h-full object-cover object-top opacity-30"
                    />
                    {/* Gradient to darken the left side slightly more */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-20 w-full px-4 md:px-36 text-white flex flex-col pt-6">
                    <h1 className="text-[26px] md:text-[32px] font-semibold tracking-wide mb-3 uppercase">
                        AI For Marketing Professionals Course
                    </h1>

                    {/* Ratings */}
                    <div className="flex items-center gap-2 mb-6 text-[13px]">
                        <div className="flex text-[#fca130] text-base">
                            ★★★★★
                        </div>
                        <span className="font-semibold">4.9</span>
                        <span className="text-gray-300">(9,000) reviews</span>
                    </div>

                    {/* Bullet Points */}
                    <div className="flex flex-col gap-3 mb-10 max-w-3xl text-sm text-gray-100">
                        <p className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full shrink-0"></span>
                            Designed for marketing and growth professionals to apply AI and analytics across acquisition, retention, personalization, and measurement
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full shrink-0"></span>
                            Focuses on decision-making, experimentation, and revenue impact rather than coding
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full shrink-0"></span>
                            Enables confident collaboration with data, product, and martech teams
                        </p>
                    </div>

                    {/* Bottom Bar in Hero */}
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-10 mt-auto pb-8 w-full">

                        <div className="flex flex-row md:contents gap-3 sm:gap-6 items-end">
                            {/* Accreditation */}
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-bold mb-2">Accredited by</span>
                                <div className="flex items-center gap-2 md:gap-3">
                                    {/* Mock IABAC Logo */}
                                    <div className="w-8 h-8 md:w-10 md:h-10 border border-white rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold shrink-0">
                                        IABAC
                                    </div>
                                    <div className="text-[10px] md:text-xs leading-tight text-gray-300 max-w-[100px] md:max-w-[120px]">
                                        International Association of Business Analytics Certification
                                    </div>
                                </div>
                            </div>

                            {/* Download Brochure */}
                            <div className="flex items-center gap-2 md:gap-3 md:mt-0 cursor-pointer group pb-0.5 md:pb-0 shrink-0">
                                <svg className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-gray-300 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span className="font-bold text-xs md:text-sm leading-tight">Download<br />Brochure</span>
                            </div>
                        </div>

                        {/* Price Details */}
                        <div className="flex flex-col mt-2 md:mt-0 md:ml-12 w-full md:w-auto">
                            <span className="line-through text-gray-400 text-sm font-medium">₹ 55,000</span>
                            <div className="flex items-start gap-1">
                                <span className="text-[#fca130] text-3xl font-bold">₹ 41,559*</span>
                            </div>
                            <span className="text-xs mt-1"><span className="font-bold">NO COST EMI :</span> ₹ 6,926 p.m for 6 Months</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">*Offer valid till 24th May 2026</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 w-full md:w-auto md:ml-auto mt-4 md:mt-0 md:mr-12 md:mb-3">
                            <button className="w-full sm:w-auto px-8 py-2.5 bg-[#001A5A] hover:bg-[#003063] transition-colors text-white text-sm font-semibold rounded shadow-md">
                                Enquiry
                            </button>
                            <button className="w-full sm:w-auto px-8 py-2.5 bg-[#001A5A] hover:bg-[#003063] transition-colors text-white text-sm font-semibold rounded shadow-md">
                                Enroll Now
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Feature Banner */}
            <div className="w-full bg-[#fff1ab] py-3 pr-4 pl-6 md:pl-12 flex items-center justify-center gap-6 md:gap-10 border-b border-[#ebd04e] shadow-sm relative z-30">
                <div className="shrink-0 flex items-center">
                    <Image src="/Logo/Hand.webp" alt="Hand illustration" width={34} height={34} className="object-contain transform scale-200" />
                </div>
                <span className="font-bold text-gray-900 text-[12px] sm:text-sm md:text-lg tracking-wide">
                    Build Live AI Project. Get Featured on ET.
                </span>
            </div>

            {/* Workshop steps + testimonial */}
            <section className="w-full px-4 md:px-36 py-12 md:py-16 bg-white">
                <div className="max-w-[1180px] mx-auto">
                    <h2 className="text-[24px] md:text-[30px] font-semibold text-[#0f1b2d]">
                        A Workshop Worth Your Time. Guaranteed
                    </h2>
                    <p className="text-sm md:text-base text-[#6b7280] mt-2">
                        No strings attached - just pure learning
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
                        {[
                            {
                                step: "STEP 1",
                                text: "Register and attend for free",
                            },
                            {
                                step: "STEP 2",
                                text: "Dive into hands-on, practical learning",
                            },
                            {
                                step: "STEP 3",
                                text: "Walk away with real, actionable value",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="rounded-xl border border-slate-100 bg-[#f8fafd] px-6 py-5 md:px-7 md:py-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
                            >
                                <div className="text-[11px] tracking-widest text-[#7b7b7b] font-semibold">
                                    {item.step}
                                </div>
                                <div className="text-sm md:text-base font-medium text-[#1f2937] mt-2">
                                    {item.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 md:mt-12 rounded-2xl bg-[#f8fafd] border border-slate-100 px-6 md:px-12 py-9 md:py-12 relative overflow-hidden">
                        <div className="absolute -left-2 top-5 text-[#f6d9a4] text-[100px] md:text-[125px] leading-none select-none z-0">
                            "
                        </div>
                        <div className="absolute -right-2 bottom-4 text-[#f6d9a4] text-[100px] md:text-[125px] leading-none select-none z-0">
                            "
                        </div>

                        <div className="overflow-hidden w-full relative z-10">
                            <div
                                className={`flex ${transitionEnabled ? 'transition-transform duration-500 ease-in-out' : ''}`}
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {[...REVIEWS, REVIEWS[0]].map((review, idx) => (
                                    <div key={idx} className="w-full shrink-0 flex flex-col items-center px-4">
                                        <p className="text-center text-[#334155] text-sm md:text-base leading-relaxed max-w-4xl mx-auto min-h-[60px] flex items-center justify-center">
                                            {review.text}
                                        </p>
                                        <div className="text-center text-[#1f2937] font-semibold mt-6 text-sm md:text-base">
                                            {review.author}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 mt-6 relative z-20">
                            {REVIEWS.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${(currentIndex % REVIEWS.length) === index ? 'bg-[#111827]' : 'bg-[#c7c7c7] hover:bg-[#a3a3a3]'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* AI-native competitor section */}
            <section className="w-full px-4 md:px-36 py-12 md:py-16 bg-[#f8fafd]">
                <div className="max-w-[1180px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:pr-6">
                            <h3 className="text-[24px] md:text-[30px] font-semibold text-[#111827] leading-tight">
                                The Gap Between
                                <br />
                                you & your <span className="text-[#0b7a2a]">AI-</span>
                                <br />
                                <span className="text-[#0b7a2a]">Native</span> Competitor
                            </h3>
                            <p className="text-sm md:text-base text-[#6b7280] mt-4">
                                In 2026, the best-performing marketing teams aren't bigger. They're AI-native.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white border border-[#f0f0f0] p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                            <div className="w-10 h-10 rounded-md bg-[#78f07f] text-[#0f6a2d] flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 11h3v10H3z" />
                                    <path d="M10 7h3v14h-3z" />
                                    <path d="M17 4h3v17h-3z" />
                                </svg>
                            </div>
                            <h4 className="mt-4 text-base font-semibold text-[#111827]">
                                60% of Searches Never Reach Your Website Anymore
                            </h4>
                            <p className="mt-3 text-sm text-[#6b7280]">
                                If your brand isn't showing up when ChatGPT, Perplexity or Google AI answers - you're already losing customers to brands that figured out AEO and GEO first.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white border border-[#f0f0f0] p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                            <div className="w-10 h-10 rounded-md bg-[#78f07f] text-[#0f6a2d] flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 5h16" />
                                    <path d="M6 5l6 9 6-9" />
                                </svg>
                            </div>
                            <h4 className="mt-4 text-base font-semibold text-[#111827]">
                                Daily Use Is Not The Same As Daily Results.
                            </h4>
                            <p className="mt-3 text-sm text-[#6b7280]">
                                Checking AI every morning doesn't make you AI-first. Results come from systems, not habits.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white border border-[#f0f0f0] p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                            <div className="w-10 h-10 rounded-md bg-[#78f07f] text-[#0f6a2d] flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5 1.34 3.5 3 3.5z" />
                                    <path d="M8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11z" />
                                    <path d="M2 20c0-3 4-5 6-5" />
                                    <path d="M22 20c0-3-4-5-6-5" />
                                </svg>
                            </div>
                            <h4 className="mt-4 text-base font-semibold text-[#111827]">
                                Your Team Is Working Hard. AI-Native Teams Are Working Fast.
                            </h4>
                            <p className="mt-3 text-sm text-[#6b7280]">
                                10 hours of research, writing, and designing. An AI-powered team does the same in 47 minutes.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white border border-[#f0f0f0] p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                            <div className="w-10 h-10 rounded-md bg-[#78f07f] text-[#0f6a2d] flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                </svg>
                            </div>
                            <h4 className="mt-4 text-base font-semibold text-[#111827]">
                                The Businesses That Figure This Out In 2026 Will Be Impossible To Catch In 2027.
                            </h4>
                            <p className="mt-3 text-sm text-[#6b7280]">
                                This is not a trend. It's a structural shift. The window to get ahead is open right now. It won't stay open much longer.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white border border-[#f0f0f0] p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
                            <div className="w-10 h-10 rounded-md bg-[#78f07f] text-[#0f6a2d] flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="4" y="3" width="16" height="18" rx="2" />
                                    <path d="M8 7h8" />
                                    <path d="M8 11h8" />
                                    <path d="M8 15h6" />
                                </svg>
                            </div>
                            <h4 className="mt-4 text-base font-semibold text-[#111827]">
                                Everyone Has The Subscription. Nobody Has The System.
                            </h4>
                            <p className="mt-3 text-sm text-[#6b7280]">
                                ChatGPT, Gemini, Claude. Both you and our competitor have all three. The difference is they've wired it into their business instead of copy-pasting outputs into a Doc.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full px-4 md:px-24 lg:px-32 py-12 md:py-16 bg-white">
                <div className="max-w-[1200px] mx-auto">
                    <h3 className="text-center text-[24px] md:text-[30px] font-semibold text-[#111827] mb-4 -mt-2">
                        Tools That You'll Learn
                    </h3>
                    <LogoCloud />
                </div>
            </section>

            <section className="w-full px-4 md:px-24 lg:px-32 py-12 md:py-16 bg-[#f8fafd]">
                <div className="max-w-[1200px] mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[22px] md:text-[28px] font-semibold text-[#1f2a44]">
                            Upcoming events & webinars
                        </h4>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="Previous"
                                className="w-9 h-9 rounded-full bg-[#eef1f6] text-[#1f2a44] flex items-center justify-center hover:bg-[#e2e6ee] transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                aria-label="Next"
                                className="w-9 h-9 rounded-full bg-[#eef1f6] text-[#1f2a44] flex items-center justify-center hover:bg-[#e2e6ee] transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 6l6 6-6 6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-8">
                        {[
                            {
                                title: "The Value of AI",
                                date: "16th Jun 2026",
                                time: "09:00 - 11:00",
                                location: "London",
                                image:
                                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
                                highlight: false,
                                lock: false,
                                description:
                                    "The rise of AI in marketing is clear, but the evidence on effectiveness is still emerging. Join us f...",
                            },
                            {
                                title: "Next Gen Meet Up: An Evening with an Agency",
                                date: "17th Jun 2026",
                                time: "17:30 - 19:30",
                                location: "London",
                                image:
                                    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
                                highlight: false,
                                lock: false,
                                description: "",
                            },
                            {
                                title: "DMA Member Lunch in Cannes",
                                date: "24th Jun 2026",
                                time: "13:00 - 15:00",
                                location: "Cannes, France",
                                image:
                                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
                                highlight: false,
                                lock: true,
                                description:
                                    "Join DMA CEO Rachel Aldighieri and Operations Director Ellie Turner for an exclusive members' lunch ...",
                            },
                        ].map((event) => (
                            <article
                                key={event.title}
                                className="group rounded-2xl bg-[#f9fafb] border border-[#e5e7eb] overflow-hidden shadow-[0_6px_18px_rgba(16,24,40,0.08)] md:min-w-[340px] flex flex-col"
                            >
                                <div className="relative h-[190px]">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute left-4 bottom-4 bg-white text-[#1d4ed8] text-xs font-bold px-3 py-1 rounded-full shadow">
                                        EVENT
                                    </span>
                                    {event.lock ? (
                                        <span className="absolute right-4 top-4 w-10 h-10 rounded-full bg-[#facc15] text-[#111827] flex items-center justify-center shadow">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="5" y="11" width="14" height="10" rx="2" />
                                                <path d="M7 11V8a5 5 0 0110 0v3" />
                                            </svg>
                                        </span>
                                    ) : null}
                                </div>

                                <div
                                    className={
                                        event.highlight
                                            ? "bg-[#1f2a5b] text-white px-5 py-5 min-h-[150px] flex-1"
                                            : "bg-[#f9fafb] text-[#111827] px-5 py-5 min-h-[150px] flex-1 transition-colors group-hover:bg-[#1f2a5b] group-hover:text-white"
                                    }
                                >
                                    <div
                                        className={
                                            event.highlight
                                                ? "text-xs font-semibold tracking-wide text-[#c7d2fe] mb-2"
                                                : "text-xs font-semibold tracking-wide text-[#6b7280] mb-2 transition-colors group-hover:text-[#c7d2fe]"
                                        }
                                    >
                                        {event.date} <span className="mx-2">•</span> {event.time} <span className="mx-2">•</span> {event.location}
                                    </div>
                                    <h5
                                        className={
                                            event.highlight
                                                ? "text-lg font-semibold text-white leading-snug"
                                                : "text-lg font-semibold text-[#111827] leading-snug transition-colors group-hover:text-white"
                                        }
                                    >
                                        {event.title}
                                    </h5>
                                    {event.description ? (
                                        <p className="mt-3 text-sm text-[#6b7280] transition-colors group-hover:text-[#e5e7eb]">
                                            {event.description}
                                        </p>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                        <span className="w-2 h-2 rounded-full bg-[#111827]"></span>
                        <span className="w-2 h-2 rounded-full bg-[#c7c7c7]"></span>
                        <span className="w-2 h-2 rounded-full bg-[#c7c7c7]"></span>
                        <span className="w-2 h-2 rounded-full bg-[#c7c7c7]"></span>
                    </div>
                </div>
            </section>

            <GrowthStats />
            <CertificationCoursesSection bgColor="bg-[#f8fafd]" />

            {/* Course Level Selector Section */}
            <section className="w-full bg-white py-16 md:py-24 px-4 md:px-36 border-t border-slate-100">
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <h2 className="text-2xl sm:text-3xl md:text-[38px] font-semibold text-[#1e2245] tracking-tight text-center leading-tight flex flex-wrap items-center justify-center gap-3">
                        <span>Choose the Right Course for Your Skill Level & Career Goals</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80 uppercase tracking-wider whitespace-nowrap align-middle">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Coming soon, building
                        </span>
                    </h2>
                    <p className="text-[13px] md:text-sm text-[#5c6479] text-center max-w-3xl mx-auto mt-4 leading-relaxed font-normal">
                        We develop courses for every stage of your marketing career. Find a course that will give you the <span className="font-bold text-[#1e2245]">skills and experience you need for any marketing role</span> such as Digital Strategy and Leadership, AI, Social Media, Search Marketing or SEO.
                    </p>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-12 md:mt-16">
                        {COURSE_LEVELS.map((course, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-[#e5e7eb] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-slate-300"
                            >
                                {/* Left: Portrait image container */}
                                <div className="relative shrink-0 flex items-center justify-center">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-full shadow-sm bg-slate-50"
                                    />
                                </div>

                                {/* Right: Content details */}
                                <div className="flex-1 flex flex-col justify-between min-h-0">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-extrabold text-[#1e2245] leading-tight">
                                            {course.title}
                                        </h3>
                                        <p className="text-[10px] sm:text-[11px] text-[#8e9aa8] font-bold tracking-wide mt-1 mb-2.5">
                                            {course.subtitle}
                                        </p>

                                        <ul className="space-y-1.5 mb-4">
                                            {course.bullets.map((bullet, bIdx) => (
                                                <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                                                    <svg className="w-3.5 h-3.5 text-[#00c58d] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            href={course.linkUrl}
                                            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#00a877] hover:text-[#008f64] transition-colors group/link"
                                        >
                                            {course.linkText}
                                            <span className="transform transition-transform group-hover/link:translate-x-1">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

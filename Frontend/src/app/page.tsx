"use client";
import React from 'react';
import Link from 'next/link';
import MarqueeTestimonials from "@/components/ui/MarqueeTestimonials";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import ParticlesBg from "@/components/ui/particles-bg";

export default function Page() {
    const [hoveredSection, setHoveredSection] = React.useState<string | null>(null);
    const coursesScrollRef = React.useRef<HTMLDivElement>(null);

    const stats = [
        { percentage: "", label: "Canva", isIncrease: false, logo: "/Logo/ScrollingLogo/canva.webp" },
        { percentage: "", label: "ChatGPT", isIncrease: false, logo: "/Logo/ScrollingLogo/chatgpt.png" },
        { percentage: "", label: "Claude", isIncrease: false, logo: "/Logo/ScrollingLogo/Claude.webp" },
        { percentage: "", label: "Gemini", isIncrease: false, logo: "/Logo/ScrollingLogo/Gemini.webp" },
        { percentage: "", label: "Grok", isIncrease: false, logo: "/Logo/ScrollingLogo/Grok.webp" },
        { percentage: "", label: "Perplexity", isIncrease: false, logo: "/Logo/ScrollingLogo/Perplexity.webp" },
    ];

    const scrollCourses = (direction: 'left' | 'right') => {
        if (coursesScrollRef.current) {
            const { scrollLeft, clientWidth } = coursesScrollRef.current;
            const scrollAmount = clientWidth * 0.75;
            coursesScrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen font-sans flex flex-col">
            <div className="sticky top-0 z-50 w-full flex flex-col bg-white">
                {/* Top Banner 1 - Dark */}
                <div className="bg-[#333333] text-white text-[11px] md:text-sm py-2 overflow-hidden flex items-center">
                    <div className="animate-marquee whitespace-nowrap flex min-w-max">
                        {/* Repeat the sentence enough times to fill the screen and animate smoothly */}
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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        Refer & Earn
                    </a>
                    <a href="#" className="flex items-center gap-1.5 hover:underline shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        Bootcamp
                    </a>
                    <a href="#" className="flex items-center gap-1.5 hover:underline shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Demo Class
                    </a>
                    <a href="#" className="flex items-center gap-1.5 hover:underline font-bold shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        1800 4122 6965
                    </a>
                </div>

                <Navbar />
            </div>

            {/* Hero Section */}
            <section className="relative isolate w-full min-h-[450px] flex items-center overflow-hidden">
                <ParticlesBg />

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
                            <button className="w-full sm:w-auto px-8 py-2.5 bg-[#009ee3] hover:bg-blue-600 transition-colors text-white text-sm font-semibold rounded shadow-md">
                                Enquiry
                            </button>
                            <button className="w-full sm:w-auto px-8 py-2.5 bg-[#009ee3] hover:bg-blue-600 transition-colors text-white text-sm font-semibold rounded shadow-md">
                                Enroll Now
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Stats Marquee Section */}
            <div className="bg-gray-50 w-full py-5 border-b border-gray-200 overflow-hidden flex items-center">
                <div className="animate-marquee-reverse whitespace-nowrap flex min-w-max items-center gap-12 px-4">
                    {[...stats, ...stats, ...stats, ...stats].map((stat, index) => (
                        <React.Fragment key={index}>
                            <div
                                className="flex items-center justify-center gap-3 group cursor-pointer shrink-0 w-[180px]"
                            >
                                <img
                                    src={stat.logo}
                                    alt={stat.label}
                                    className="h-9 md:h-10 w-auto object-contain transition-opacity"
                                />
                                {(stat.percentage || stat.isIncrease) && (
                                    <div className="flex items-center gap-1.5">
                                        {stat.isIncrease && (
                                            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                                <polyline points="5 12 12 5 19 12"></polyline>
                                            </svg>
                                        )}
                                        <span className="text-3xl font-bold text-gray-800 google-sans-stats">
                                            {stat.percentage}
                                        </span>
                                    </div>
                                )}
                                <p className="text-gray-800 text-xl md:text-2xl capitalize mulish-logo-text">
                                    {stat.label}
                                </p>
                            </div>
                            <div className="w-px h-10 bg-gray-300"></div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Breadcrumb Section */}
            <div className="bg-[#f8f9fa] py-3 px-4 md:px-36 text-[13px] text-gray-500 border-b border-gray-200 flex flex-wrap gap-1">
                <a href="#" className="text-[#009ee3] hover:underline">Home</a>
                <span className="mx-1">/</span>
                <span className="text-[#009ee3] hover:underline cursor-pointer">AI for Marketing Professionals Course</span>
            </div>

            {/* Course Details Sections */}
            <main className="bg-[#fafafa] py-14 px-4 md:px-36 flex flex-col gap-14 flex-1">
                <div className="max-w-6xl w-full mx-auto flex flex-col gap-14">

                    {/* Lead Mentors Section */}
                    <section className="flex flex-col gap-6">
                        <div className="flex items-center">
                            <div className="w-1 h-6 bg-[#009ee3] mr-3 rounded-sm"></div>
                            <h2 className="text-[17px] font-bold text-[#002b49] tracking-wider uppercase">
                                AI FOR MARKETING PROFESSIONALS LEAD MENTORS
                            </h2>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 rounded-lg border border-gray-155 shadow-sm max-w-4xl">
                            <div className="w-[140px] h-[140px] shrink-0 overflow-hidden rounded border border-gray-200 shadow-sm bg-gray-50">
                                <img
                                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=256&h=256&q=80"
                                    alt="Ashok Veda"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[17px] font-bold text-gray-900">Ashok Veda</span>
                                    <a
                                        href="https://www.linkedin.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-[#0077b5] text-white p-0.5 rounded-sm hover:bg-[#005582] transition-colors leading-none"
                                    >
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                </div>
                                <p className="text-[13px] text-gray-800 leading-relaxed font-normal">
                                    A globally reputed AI Expert with 19 years experience in Analytics and Data Science. Ashok Veda trained over 20k Data Science aspirants , currently serving as Founder and CEO at Rubixe.com, an AI company. Ashok Veda holds MBA from IIMA and University of Amsterdam. PH.D scholar in AI
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Course Fee Section */}
                    <section className="flex flex-col gap-6">
                        <div className="flex items-center">
                            <div className="w-1 h-6 bg-[#009ee3] mr-3 rounded-sm"></div>
                            <h2 className="text-[17px] font-bold text-[#002b49] tracking-wider uppercase">
                                AI FOR MARKETING PROFESSIONALS COURSE FEE
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">

                            {/* Card 1 - Live Virtual */}
                            <div className="bg-white rounded-lg border border-gray-150 shadow-md flex flex-col items-center pt-8 pb-8 px-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                                <h3 className="text-[23px] font-semibold text-[#009ee3]">Live Virtual</h3>
                                <span className="text-[13px] font-medium text-[#009ee3] mt-1">Instructor Led Live Online</span>

                                <div className="flex items-center justify-center gap-6 py-4 mt-2 w-full">
                                    <span className="text-gray-500 line-through text-sm font-semibold">₹ 55,000</span>
                                    <span className="text-[#fca130] text-xl font-bold">₹ 41,559</span>
                                </div>

                                <div className="w-full border-b border-gray-100 my-2"></div>

                                <ul className="w-full space-y-3.5 my-6 text-[12.5px] text-gray-800 font-medium px-2 flex-1">
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>IABAC® Certification</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>3-Month | 120 Learning Hours</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>48-Hour Live Online Training</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Applied Learning with Mentoring</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Flexi Pass + Cloud Lab</span>
                                    </li>
                                </ul>

                                <button className="w-[160px] py-2 bg-[#fca130] hover:bg-[#e08e20] text-white text-[13px] font-bold rounded shadow-sm transition-colors uppercase tracking-wide mt-4">
                                    Enquire Now
                                </button>
                            </div>

                            {/* Card 2 - Blended Learning */}
                            <div className="bg-white rounded-lg border border-[#fca130] shadow-md flex flex-col items-center pt-8 pb-8 px-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg scale-[1.02] md:scale-105 z-10">
                                {/* Popular ribbon */}
                                <div className="absolute top-[14px] right-[-30px] w-28 bg-[#fca130] text-white text-[9px] font-extrabold py-1 rotate-45 text-center shadow-sm uppercase tracking-wider">
                                    Popular
                                </div>

                                <h3 className="text-[23px] font-semibold text-[#009ee3]">Blended Learning</h3>
                                <span className="text-[13px] font-medium text-[#009ee3] mt-1">Self Learning + Live Mentoring</span>

                                <div className="flex items-center justify-center gap-6 py-4 mt-2 w-full">
                                    <span className="text-gray-500 line-through text-sm font-semibold">₹ 41,000</span>
                                    <span className="text-[#fca130] text-xl font-bold">₹ 31,140</span>
                                </div>

                                <div className="w-full border-b border-gray-100 my-2"></div>

                                <ul className="w-full space-y-3.5 my-6 text-[12.5px] text-gray-800 font-medium px-2 flex-1">
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Self Learning + Live Mentoring</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>IABAC® Certification</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>1 Year Access To Elearning</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Applied Learning with Mentoring</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>24*7 Learner assistance and support</span>
                                    </li>
                                </ul>

                                <button className="w-[160px] py-2 bg-[#fca130] hover:bg-[#e08e20] text-white text-[13px] font-bold rounded shadow-sm transition-colors uppercase tracking-wide mt-4">
                                    Enquire Now
                                </button>
                            </div>

                            {/* Card 3 - Classroom */}
                            <div className="bg-white rounded-lg border border-gray-150 shadow-md flex flex-col items-center pt-8 pb-8 px-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                                <h3 className="text-[23px] font-semibold text-[#009ee3]">Classroom</h3>
                                <span className="text-[13px] font-medium text-[#009ee3] mt-1">In - Person Classroom Training</span>

                                <div className="flex items-center justify-center gap-6 py-4 mt-2 w-full">
                                    <span className="text-gray-500 line-through text-sm font-semibold">₹ 55,000</span>
                                    <span className="text-[#fca130] text-xl font-bold">₹ 47,347</span>
                                </div>

                                <div className="w-full border-b border-gray-100 my-2"></div>

                                <ul className="w-full space-y-3.5 my-6 text-[12.5px] text-gray-800 font-medium px-2 flex-1">
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>IABAC® Certification</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>3-Month | 120 Learning Hours</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>48-Hour Classroom Sessions</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Applied Learning with Mentoring</span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <svg className="w-4 h-4 text-[#fca130] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Flexi Pass + Cloud Lab</span>
                                    </li>
                                </ul>

                                <button className="w-[160px] py-2 bg-[#fca130] hover:bg-[#e08e20] text-white text-[13px] font-bold rounded shadow-sm transition-colors uppercase tracking-wide mt-4">
                                    Enquire Now
                                </button>
                            </div>

                        </div>
                    </section>

                </div>
            </main>

            {/* Featured Workshop Section */}
            <section className="bg-black text-white w-full py-16 px-4 md:px-36 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Decorative Swirl - Bottom Left */}
                <div className="absolute -left-24 -bottom-24 w-[240px] h-[240px] pointer-events-none opacity-50 z-0">
                    <svg viewBox="0 0 400 400" className="w-full h-full mix-blend-screen">
                        <defs>
                            <linearGradient id="ringGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="50%" stopColor="#f43f5e" />
                                <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                        </defs>
                        {Array.from({ length: 12 }).map((_, i) => {
                            const points: string[] = [];
                            const steps = 60;
                            const radiusBase = 120;
                            const freq = 4 + (i % 3);
                            const phase = (i * Math.PI) / 6;
                            const amp = 6 + (i % 3) * 2;

                            for (let step = 0; step <= steps; step++) {
                                const angle = (step / steps) * Math.PI * 2;
                                const r = radiusBase + Math.sin(angle * freq + phase) * amp;
                                const x = 200 + r * Math.cos(angle);
                                const y = 200 + r * Math.sin(angle);
                                points.push(`${step === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
                            }

                            return (
                                <path
                                    key={i}
                                    d={points.join(' ') + ' Z'}
                                    fill="none"
                                    stroke="url(#ringGrad2)"
                                    strokeWidth="0.8"
                                    className="opacity-70"
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Content Area */}
                <div className="relative z-10 max-w-2xl flex flex-col items-start text-left">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-4">
                        Featured Workshop: Microsoft Copilot 365
                    </h2>
                    <p className="text-gray-300 text-[14.5px] leading-relaxed mb-8 font-light max-w-xl">
                        Learn how Microsoft Copilot 365 can boost your team&apos;s daily work by integrating AI directly into tools like Outlook, Word, Excel, and Teams. This workshop includes demonstrations showing how Copilot automates tasks, simplifies collaboration, and enhances productivity.
                    </p>
                    <button className="px-7 py-2.5 bg-[#063e9c] hover:bg-[#05327e] text-white text-[15px] font-medium rounded-lg shadow-md transition-all duration-200 cursor-pointer">
                        Read more
                    </button>
                </div>

                {/* Main Glowing Ring - Right Side */}
                <div className="absolute right-[-80px] md:right-[20px] top-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[480px] md:h-[480px] pointer-events-none z-0">
                    <svg viewBox="0 0 400 400" className="w-full h-full mix-blend-screen">
                        <defs>
                            <linearGradient id="ringGradMain" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="40%" stopColor="#f43f5e" />
                                <stop offset="70%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#eab308" />
                            </linearGradient>
                        </defs>
                        {Array.from({ length: 18 }).map((_, i) => {
                            const points: string[] = [];
                            const steps = 80;
                            const radiusBase = 120;
                            const freq = 5 + (i % 3);
                            const phase = (i * Math.PI) / 9;
                            const amp = 8 + (i % 4) * 2;

                            for (let step = 0; step <= steps; step++) {
                                const angle = (step / steps) * Math.PI * 2;
                                const r = radiusBase + Math.sin(angle * freq + phase) * amp;
                                const x = 200 + r * Math.cos(angle);
                                const y = 200 + r * Math.sin(angle);
                                points.push(`${step === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
                            }

                            return (
                                <path
                                    key={i}
                                    d={points.join(' ') + ' Z'}
                                    fill="none"
                                    stroke="url(#ringGradMain)"
                                    strokeWidth="0.8"
                                    className="opacity-70"
                                    style={{
                                        transformOrigin: '200px 200px',
                                        transform: `rotate(${i * 3}deg)`,
                                    }}
                                />
                            );
                        })}
                    </svg>
                </div>
            </section>


            {/* Offered AI for Marketing Professionals Courses Section */}
            <section className="bg-[#f8f9fa] py-16 px-4 md:px-36 border-t border-b border-gray-100 relative overflow-hidden">
                <div className="max-w-6xl mx-auto flex flex-col gap-10 relative">
                    {/* Header */}
                    <div className="flex flex-col">
                        <div className="flex items-center">
                            <div className="w-1.5 h-7 bg-[#009ee3] mr-3 rounded-sm"></div>
                            <h2 className="text-[20px] font-bold text-gray-800 tracking-wide uppercase">
                                Offered AI For Marketing Professionals Courses
                            </h2>
                        </div>
                    </div>

                    {/* Carousel Container with Arrows on Left and Right */}
                    <div className="relative w-full px-0 md:px-8">
                        {/* Left Arrow Button */}
                        <button
                            onClick={() => scrollCourses('left')}
                            className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded shadow-md hidden md:flex items-center justify-center text-gray-800 hover:text-[#009ee3] transition-all duration-200"
                            aria-label="Previous Courses"
                        >
                            <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        {/* Card Scroll Viewport */}
                        <div
                            ref={coursesScrollRef}
                            className="flex overflow-x-auto gap-6 pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {[
                                {
                                    title: "ARTIFICIAL INTELLIGENCE FOR MANAGERS COURSE",
                                    description: "Specialized Course For Senior Executives With Syllabus Covering Core Concepts Along With Strategic Insights.",
                                    originalPrice: "₹ 39,000",
                                    offerPrice: "₹ 28,825",
                                    rating: "16,564"
                                },
                                {
                                    title: "ARTIFICIAL INTELLIGENCE EXPERT COURSE",
                                    description: "Global Artificial Intelligence Certification - Advanced Level Issued By IABAC®",
                                    originalPrice: "₹ 76,000",
                                    offerPrice: "₹ 55,450",
                                    rating: "15,398"
                                },
                                {
                                    title: "CERTIFIED NLP EXPERT COURSE",
                                    description: "Advanced Level Specialization In NLP With State Of Art Techniques With Practical Use Case Applications.",
                                    originalPrice: "₹ 35,000",
                                    offerPrice: "₹ 32,298",
                                    rating: "16,182"
                                },
                                {
                                    title: "ARTIFICIAL INTELLIGENCE FOUNDATION COURSE",
                                    description: "Global Artificial Intelligence Certification Issued By IABAC®",
                                    originalPrice: "₹ 22,000",
                                    offerPrice: "₹ 16,091",
                                    rating: "16,123"
                                }
                            ].map((course, idx) => (
                                <div
                                    key={idx}
                                    className="w-[270px] sm:w-[280px] md:w-[265px] lg:w-[275px] flex-shrink-0 snap-start bg-white border border-gray-100 rounded-lg p-6 flex flex-col justify-between items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 relative group"
                                >
                                    {/* Icon Badge */}
                                    <div className="w-16 h-16 rounded-full bg-[#e2f0d9] flex items-center justify-center mb-6">
                                        <svg className="w-10 h-10 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 3a2.5 2.5 0 0 1 2.5 2.5v13a2.5 2.5 0 0 1-2.5 2.5H9a3 3 0 0 1-3-3v-6.5A5.5 5.5 0 0 1 11.5 3h.5" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 3a2.5 2.5 0 0 0-2.5 2.5v13a2.5 2.5 0 0 0 2.5 2.5h.5a3 3 0 0 0 3-3v-6.5A5.5 5.5 0 0 0 12.5 3h-.5" />
                                            <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                                            <circle cx="16" cy="8" r="1.2" fill="currentColor" />
                                            <circle cx="7" cy="13" r="1.2" fill="currentColor" />
                                            <circle cx="17" cy="13" r="1.2" fill="currentColor" />
                                            <circle cx="9" cy="17" r="1.2" fill="currentColor" />
                                            <circle cx="15" cy="17" r="1.2" fill="currentColor" />
                                            <line x1="8" y1="8" x2="11.5" y2="8" stroke="currentColor" strokeWidth="1" />
                                            <line x1="16" y1="8" x2="12.5" y2="8" stroke="currentColor" strokeWidth="1" />
                                            <line x1="7" y1="13" x2="11.5" y2="13" stroke="currentColor" strokeWidth="1" />
                                            <line x1="17" y1="13" x2="12.5" y2="13" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                    </div>

                                    {/* Course Title */}
                                    <h3 className="text-sm font-bold text-gray-800 tracking-tight leading-snug uppercase text-center mb-4 min-h-[40px] flex items-center justify-center">
                                        {course.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs text-gray-600 leading-relaxed text-center mb-6 min-h-[72px] flex items-center justify-center px-1">
                                        {course.description}
                                    </p>

                                    {/* Pricing */}
                                    <div className="flex items-center justify-center gap-3 mb-6 w-full pt-4 border-t border-gray-100">
                                        <span className="line-through text-gray-400 text-sm font-semibold">{course.originalPrice}</span>
                                        <span className="text-[#fca130] text-lg font-bold">{course.offerPrice}</span>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
                                            <svg className="w-4 h-4 text-gray-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span>{course.rating}</span>
                                        </div>
                                        <a href="#" className="text-[#009ee3] hover:text-blue-600 font-bold text-xs transition-colors duration-200 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-all">
                                            <span>View More</span>
                                            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Arrow Button */}
                        <button
                            onClick={() => scrollCourses('right')}
                            className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded shadow-md hidden md:flex items-center justify-center text-gray-800 hover:text-[#009ee3] transition-all duration-200"
                            aria-label="Next Courses"
                        >
                            <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>



            {/* What to expect from the AI Workshop Section */}
            <section className="bg-white text-slate-900 w-full py-20 px-4 md:px-36 relative overflow-hidden">
                {/* CSS Floating Animations Style Block */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes float-slow {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-15px) rotate(3deg); }
                    }
                    @keyframes float-medium {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-25px) rotate(-6deg); }
                    }
                    @keyframes float-fast {
                        0%, 100% { transform: translateY(0px) scale(1); }
                        50% { transform: translateY(-12px) scale(1.08); }
                    }
                    .animate-float-slow {
                        animation: float-slow 7s ease-in-out infinite;
                    }
                    .animate-float-medium {
                        animation: float-medium 5s ease-in-out infinite;
                    }
                    .animate-float-fast {
                        animation: float-fast 4s ease-in-out infinite;
                    }
                `}} />

                {/* 3D Decorative Floating Shapes */}
                <div className="absolute top-[10%] right-[10%] w-32 h-32 opacity-80 pointer-events-none animate-float-slow z-0 hidden lg:block">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_35px_rgba(148,163,184,0.15)]">
                        <defs>
                            <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#f8fafc" />
                            </linearGradient>
                            <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#f1f5f9" />
                                <stop offset="100%" stopColor="#cbd5e1" />
                            </linearGradient>
                            <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#e2e8f0" />
                                <stop offset="100%" stopColor="#94a3b8" />
                            </linearGradient>
                        </defs>
                        {/* Isometric Cube */}
                        <polygon points="50,20 80,35 50,50 20,35" fill="url(#cubeTop)" />
                        <polygon points="20,35 50,50 50,80 20,65" fill="url(#cubeLeft)" />
                        <polygon points="50,50 80,35 80,65 50,80" fill="url(#cubeRight)" />
                    </svg>
                </div>

                <div className="absolute top-[35%] right-[25%] w-8 h-8 opacity-70 pointer-events-none animate-float-fast z-0 hidden lg:block">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_16px_rgba(148,163,184,0.1)]">
                        <defs>
                            <radialGradient id="sphere1" cx="35%" cy="35%" r="65%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="70%" stopColor="#cbd5e1" />
                                <stop offset="100%" stopColor="#94a3b8" />
                            </radialGradient>
                        </defs>
                        <circle cx="50" cy="50" r="40" fill="url(#sphere1)" />
                    </svg>
                </div>

                <div className="absolute top-[50%] right-[32%] w-10 h-10 opacity-70 pointer-events-none animate-float-medium z-0 hidden lg:block">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_20px_rgba(148,163,184,0.12)]">
                        <circle cx="50" cy="50" r="40" fill="url(#sphere1)" />
                    </svg>
                </div>

                <div className="absolute bottom-[20%] right-[8%] w-36 h-36 opacity-85 pointer-events-none animate-float-medium z-0 hidden lg:block">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_25px_40px_rgba(148,163,184,0.18)]">
                        <defs>
                            <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="50%" stopColor="#f1f5f9" />
                                <stop offset="100%" stopColor="#94a3b8" />
                            </linearGradient>
                            <radialGradient id="coneShadow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="rgba(148,163,184,0.15)" />
                                <stop offset="100%" stopColor="rgba(148,163,184,0)" />
                            </radialGradient>
                        </defs>
                        {/* Shadow underneath */}
                        <ellipse cx="50" cy="82" rx="30" ry="8" fill="url(#coneShadow)" />
                        {/* Cone Shape */}
                        <path d="M 20,72 L 50,15 L 80,72 A 30,12 0 0,1 20,72" fill="url(#coneGrad)" />
                    </svg>
                </div>

                <div className="absolute bottom-[10%] right-[22%] w-24 h-24 opacity-80 pointer-events-none animate-float-slow z-0 hidden lg:block">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_15px_30px_rgba(148,163,184,0.15)]" style={{ transform: 'rotate(15deg)' }}>
                        <polygon points="50,20 80,35 50,50 20,35" fill="url(#cubeTop)" />
                        <polygon points="20,35 50,50 50,80 20,65" fill="url(#cubeLeft)" />
                        <polygon points="50,50 80,35 80,65 50,80" fill="url(#cubeRight)" />
                    </svg>
                </div>

                {/* Main Grid Container */}
                <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">

                    {/* Header Details */}
                    <div className="w-full text-left mb-12">
                        <h2 className="text-3xl md:text-[36px] font-bold tracking-tight text-[#0f172a] mb-5 leading-tight">
                            What to expect from the AI Workshop?
                        </h2>
                        <p className="text-slate-600 text-[15.5px] leading-relaxed max-w-3xl font-normal">
                            Our AI Workshop gives your team a clear, practical understanding of how to apply AI in everyday business operations, without unnecessary jargon or hype.
                        </p>
                    </div>

                    {/* Two Column Content: List on Left, Empty space on Right (allowing room for decorative floating shapes in wider viewports) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">

                        {/* Left Side: 1-6 List */}
                        <div className="lg:col-span-8 flex flex-col gap-7">

                            {/* Item 1 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-[36px] h-[36px] shrink-0 bg-[#0055c5] flex items-center justify-center text-white font-bold text-sm rounded shadow-sm">
                                    1
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[16px] font-bold text-[#0f172a]">
                                        Introduction to Artificial Intelligence
                                    </h3>
                                    <p className="text-slate-500 text-[14px] leading-relaxed font-normal">
                                        Gain a clear understanding of key AI concepts and how AI-based solutions can impact business operations
                                    </p>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-[36px] h-[36px] shrink-0 bg-[#0055c5] flex items-center justify-center text-white font-bold text-sm rounded shadow-sm">
                                    2
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[16px] font-bold text-[#0f172a]">
                                        Real-World Applications of AI
                                    </h3>
                                    <p className="text-slate-500 text-[14px] leading-relaxed font-normal">
                                        Explore practical examples of how AI can streamline various business processes and enhance productivity.
                                    </p>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-[36px] h-[36px] shrink-0 bg-[#0055c5] flex items-center justify-center text-white font-bold text-sm rounded shadow-sm">
                                    3
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[16px] font-bold text-[#0f172a]">
                                        Overview of AI Tools
                                    </h3>
                                    <p className="text-slate-500 text-[14px] leading-relaxed font-normal">
                                        Learn about essential AI tools like Microsoft Copilot and how they can be integrated into your daily workflow for better efficiency.
                                    </p>
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-[36px] h-[36px] shrink-0 bg-[#0055c5] flex items-center justify-center text-white font-bold text-sm rounded shadow-sm">
                                    4
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[16px] font-bold text-[#0f172a]">
                                        Custom AI Solutions
                                    </h3>
                                    <p className="text-slate-500 text-[14px] leading-relaxed font-normal">
                                        Discover when and why you might need custom AI tools tailored to your specific business needs, including practical implementation examples.
                                    </p>
                                </div>
                            </div>

                            {/* Item 5 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-[36px] h-[36px] shrink-0 bg-[#0055c5] flex items-center justify-center text-white font-bold text-sm rounded shadow-sm">
                                    5
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[16px] font-bold text-[#0f172a]">
                                        Best Practices and Challenges
                                    </h3>
                                    <p className="text-slate-500 text-[14px] leading-relaxed font-normal">
                                        Understand the critical factors to consider when implementing AI in your organization, ensuring a smooth and effective adoption.
                                    </p>
                                </div>
                            </div>

                            {/* Item 6 */}
                            <div className="flex gap-4 items-start">
                                <div className="w-[36px] h-[36px] shrink-0 bg-[#0055c5] flex items-center justify-center text-white font-bold text-sm rounded shadow-sm">
                                    6
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[16px] font-bold text-[#0f172a]">
                                        Interactive Q&A Session
                                    </h3>
                                    <p className="text-slate-500 text-[14px] leading-relaxed font-normal">
                                        Engage directly with our AI expert, who will answer your specific questions and provide insights based on extensive industry experience.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Right Side: Spacer for large screens to allow 3D floating shapes to display beautifully alongside the text */}
                        <div className="hidden lg:block lg:col-span-4 h-full min-h-[450px]"></div>

                    </div>

                    {/* Centered Button at the bottom */}
                    <div className="w-full flex justify-center mt-12">
                        <button className="px-10 py-3.5 bg-[#003399] hover:bg-[#002884] text-white text-[15px] font-semibold rounded shadow-md transition-all duration-200 uppercase tracking-wide w-full sm:w-auto">
                            Contact us
                        </button>
                    </div>

                </div>
            </section>

            {/* Why Choose Our Workshop Section */}
            <section className="bg-black text-white w-full py-20 px-4 md:px-36 relative overflow-hidden border-t border-zinc-950">
                {/* Decorative Swirl - Top Left */}
                <div className="absolute -left-20 -top-20 w-[220px] h-[220px] pointer-events-none opacity-40 z-0">
                    <svg viewBox="0 0 400 400" className="w-full h-full mix-blend-screen">
                        <defs>
                            <linearGradient id="swirlGradTL" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                        </defs>
                        {Array.from({ length: 10 }).map((_, i) => {
                            const points: string[] = [];
                            const steps = 65;
                            const radiusBase = 120;
                            const freq = 4 + (i % 2);
                            const phase = (i * Math.PI) / 5;
                            const amp = 6 + (i % 3) * 2;

                            for (let step = 0; step <= steps; step++) {
                                const angle = (step / steps) * Math.PI * 2;
                                const r = radiusBase + Math.sin(angle * freq + phase) * amp;
                                const x = 200 + r * Math.cos(angle);
                                const y = 200 + r * Math.sin(angle);
                                points.push(`${step === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
                            }

                            return (
                                <path
                                    key={i}
                                    d={points.join(' ') + ' Z'}
                                    fill="none"
                                    stroke="url(#swirlGradTL)"
                                    strokeWidth="0.8"
                                    className="opacity-70"
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Decorative Ribbon Wave - Right Side */}
                <div className="absolute right-[-100px] top-[10%] w-[380px] h-[550px] md:w-[500px] md:h-[700px] pointer-events-none opacity-80 z-0">
                    <svg viewBox="0 0 500 700" className="w-full h-full mix-blend-screen">
                        <defs>
                            <linearGradient id="ribbonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ec4899" />
                                <stop offset="40%" stopColor="#f43f5e" />
                                <stop offset="70%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#eab308" />
                            </linearGradient>
                        </defs>
                        {Array.from({ length: 22 }).map((_, i) => {
                            const points: string[] = [];
                            const steps = 90;
                            const phase = (i * Math.PI) / 11;

                            for (let step = 0; step <= steps; step++) {
                                const t = step / steps;
                                const y = t * 700;
                                const x = 250 + Math.sin(t * Math.PI * 2 + phase) * 80 + Math.cos(t * Math.PI * 4) * 20;
                                points.push(`${step === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
                            }

                            return (
                                <path
                                    key={i}
                                    d={points.join(' ')}
                                    fill="none"
                                    stroke="url(#ribbonGrad)"
                                    strokeWidth="0.8"
                                    className="opacity-60"
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
                        Why choose our Microsoft Copilot Workshop?
                    </h2>
                    <p className="text-gray-300 text-[15px] leading-relaxed max-w-3xl mb-16 font-light opacity-90">
                        Our Microsoft Copilot workshops provide essential knowledge and practical tools in a concise, accessible format. Tailored for companies looking to upskill their teams, our sessions are suitable for professionals across all industries.
                    </p>

                    {/* Columns Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 w-full text-left">
                        {/* Column 1 - Language Flexibility */}
                        <div className="flex flex-col items-start">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-5 shrink-0 border border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0055c5] to-[#009ee3] flex items-center justify-center text-white">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 18l6-6 4 4 8-8" />
                                        <path d="M17 8h4v4" />
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-[17px] font-bold text-white mb-2 tracking-wide">Language Flexibility</h3>
                            <p className="text-gray-300 text-[13.5px] leading-relaxed font-light opacity-90">
                                The Microsoft Copilot workshop is available in English, German, and Polish, allowing participants to choose the language that best suits their needs.
                            </p>
                        </div>

                        {/* Column 2 - Comprehensive & Online */}
                        <div className="flex flex-col items-start">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-5 shrink-0 border border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0055c5] to-[#009ee3] flex items-center justify-center text-white">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-[17px] font-bold text-white mb-2 tracking-wide">Comprehensive &amp; Online</h3>
                            <p className="text-gray-300 text-[13.5px] leading-relaxed font-light opacity-90">
                                The online AI training is designed to be concise yet comprehensive, delivering essential AI &amp; Microsoft Copilot knowledge and practical insights in just 2.5 hours.
                            </p>
                        </div>

                        {/* Column 3 - Industry-Wide */}
                        <div className="flex flex-col items-start">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-5 shrink-0 border border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0055c5] to-[#009ee3] flex items-center justify-center text-white">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3" />
                                        <circle cx="12" cy="4" r="1.5" />
                                        <circle cx="12" cy="20" r="1.5" />
                                        <circle cx="4" cy="12" r="1.5" />
                                        <circle cx="20" cy="12" r="1.5" />
                                        <circle cx="6.34" cy="6.34" r="1.5" />
                                        <circle cx="17.66" cy="17.66" r="1.5" />
                                        <circle cx="6.34" cy="17.66" r="1.5" />
                                        <circle cx="17.66" cy="6.34" r="1.5" />
                                        <line x1="12" y1="7" x2="12" y2="9" />
                                        <line x1="12" y1="15" x2="12" y2="17" />
                                        <line x1="7" y1="12" x2="9" y2="12" />
                                        <line x1="15" y1="12" x2="17" y2="12" />
                                        <line x1="8" y1="8" x2="10" y2="10" />
                                        <line x1="14" y1="14" x2="16" y2="16" />
                                        <line x1="8" y1="16" x2="10" y2="14" />
                                        <line x1="14" y1="10" x2="16" y2="8" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-[17px] font-bold text-white mb-2 tracking-wide">Industry-Wide</h3>
                            <p className="text-gray-300 text-[13.5px] leading-relaxed font-light opacity-90">
                                This training covers beginner-friendly basics, making it accessible and valuable for participants in any industry looking to improve their workflow and productivity using Microsoft Copilot.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet Your Workshop Expert Section */}
            <section className="bg-[#f8fafc] text-[#0f172a] w-full py-12 px-4 md:px-36 relative overflow-hidden border-t border-gray-100">
                <div className="max-w-6xl mx-auto flex flex-col items-center w-full">

                    {/* Header */}
                    <div className="text-center w-full mb-8 flex flex-col items-center">
                        <h2 className="text-3xl md:text-[36px] font-bold text-gray-900 mb-3 tracking-tight">
                            Meet Your Workshop Expert
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed">
                            We are thrilled to introduce our workshop leaders who bring a wealth of experience, creativity, and passion to our organization.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">

                        {/* Card 1 - Founder (Agata) */}
                        <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col md:flex-row w-full group md:h-[220px]">

                            {/* Left Image Section */}
                            <div className="w-full md:w-[42%] bg-[#e2f0d9] flex items-end justify-center overflow-hidden h-[220px] md:h-full relative shrink-0">
                                <img
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
                                    alt="Agata Chudzińska"
                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Right Text Section */}
                            <div className="w-full md:w-[58%] p-4 md:p-5 flex flex-col justify-between">
                                <div>
                                    {/* Name & Role Header */}
                                    <div className="flex flex-row justify-between items-start gap-3 mb-2">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight leading-tight">
                                            Agata Chudzińska
                                        </h3>
                                        <span className="text-[11px] font-semibold text-[#6366f1] text-right mt-1 shrink-0">
                                            Founder
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-550 text-[12.5px] md:text-[13px] leading-relaxed mb-3 font-normal">
                                        With over eight years of experience, Agata helps organizations transform complex AI concepts into practical business value. She specializes in machine learning, NLP, and AI implementation strategy.
                                    </p>
                                </div>

                                {/* Social Links */}
                                <div className="flex items-center gap-3 text-[#6366f1] text-[17px] pt-2 border-t border-gray-50">
                                    <a href="#" className="hover:text-indigo-800 transition-colors" aria-label="X (Twitter)">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="hover:text-indigo-800 transition-colors" aria-label="Instagram">
                                        <svg className="w-[17px] h-[17px] stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                        </svg>
                                    </a>
                                    <a href="#" className="hover:text-indigo-800 transition-colors" aria-label="LinkedIn">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - Co-Founder (Mia) */}
                        <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col md:flex-row w-full group md:h-[220px]">

                            {/* Left Image Section */}
                            <div className="w-full md:w-[42%] bg-[#d9e2ec] flex items-end justify-center overflow-hidden h-[220px] md:h-full relative shrink-0">
                                <img
                                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600"
                                    alt="Mia Thompson"
                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Right Text Section */}
                            <div className="w-full md:w-[58%] p-4 md:p-5 flex flex-col justify-between">
                                <div>
                                    {/* Name & Role Header */}
                                    <div className="flex flex-row justify-between items-start gap-3 mb-2">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight leading-tight">
                                            Mia Thompson
                                        </h3>
                                        <span className="text-[11px] font-semibold text-[#6366f1] text-right mt-1 shrink-0">
                                            Co-Founder
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-550 text-[12.5px] md:text-[13px] leading-relaxed mb-3 font-normal">
                                        Our relentless commitment to innovation drives us to continually enhance our programs, ensuring maximum business value. Mia leads strategic partnerships, helping teams transition to confident execution.
                                    </p>
                                </div>

                                {/* Social Links */}
                                <div className="flex items-center gap-3 text-[#6366f1] text-[17px] pt-2 border-t border-gray-50">
                                    <a href="#" className="hover:text-indigo-800 transition-colors" aria-label="X (Twitter)">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="hover:text-indigo-800 transition-colors" aria-label="Instagram">
                                        <svg className="w-[17px] h-[17px] stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                        </svg>
                                    </a>
                                    <a href="#" className="hover:text-indigo-800 transition-colors" aria-label="LinkedIn">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            <MarqueeTestimonials />
            <Footer />
        </div>
    );
}

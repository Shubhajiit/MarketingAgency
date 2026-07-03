"use client";

import React from "react";
import { LogoCloud } from "@/components/ui/logo-cloud-2";
import Image from "next/image";
import Link from "next/link";
import InsideDA360 from "@/components/ui/inside-da360";
import GlobalCommunity from "@/components/ui/global-community";
import CertificationCoursesSection from "@/components/MainWebsite/Courses/certification-courses";
import { usePublicWorkshops } from "@/lib/hooks/useWorkshops";


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

const FALLBACK_WORKSHOPS = [
    {
        _id: "one-day-ai-workshop",
        title: "One Day AI Workshop",
        type: "one-day",
        slug: "one-day-ai-workshop",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        description: "The rise of AI in marketing is clear. Learn how to use 20+ powerful AI tools for content creation, video editing, thumbnail making, and platform growth.",
        workshopDates: [
            { date: "2026-07-25", place: "Mumbai" },
            { date: "2026-06-26", place: "Online" },
            { date: "2026-07-27", place: "Delhi" }
        ]
    },
    {
        _id: "three-days-ai-workshop",
        title: "Digital Marketing with AI",
        type: "three-days",
        slug: "digital-marketing-with-ai-1",
        thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
        description: "Intensive three-day workshop on integrating AI with digital marketing. Learn hands-on strategy, prompt engineering, and campaign optimization.",
        workshopDates: [
            { date: "2026-06-21", place: "Delhi" },
            { date: "2026-06-25", place: "Mumbai" },
            { date: "2026-07-01", place: "Online" }
        ]
    }
];

const getUpcomingDetails = (workshopDates: any[], type: string) => {
    if (!workshopDates || workshopDates.length === 0) {
        return {
            dateStr: "Coming Soon",
            place: "Online",
            timeStr: type === "three-days" ? "19:00 - 21:00" : "09:00 - 11:00"
        };
    }

    const parsed = workshopDates.map(item => {
        const dVal = typeof item === 'string' ? item : (item?.date || '');
        const placeVal = typeof item === 'string' ? 'Online' : (item?.place || 'Online');
        return { date: new Date(dVal), place: placeVal.trim() };
    }).filter(item => !isNaN(item.date.getTime()));

    if (parsed.length === 0) {
        return {
            dateStr: "Coming Soon",
            place: "Online",
            timeStr: type === "three-days" ? "19:00 - 21:00" : "09:00 - 11:00"
        };
    }

    // Sort ascending by date
    parsed.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Find the first date >= today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = parsed.find(item => item.date >= today) || parsed[0];

    const day = upcoming.date.getDate();
    const month = upcoming.date.toLocaleDateString('en-IN', { month: 'short' });
    const year = upcoming.date.getFullYear();

    const getSuffix = (d: number) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    };

    const dateStr = `${day}${getSuffix(day)} ${month} ${year}`;
    const timeStr = type === "three-days" ? "19:00 - 21:00" : "09:00 - 11:00";

    return {
        dateStr,
        place: upcoming.place,
        timeStr
    };
};

export default function Page() {
    const { data: workshopResponse, isLoading } = usePublicWorkshops({ limit: 100 });
    const activeWorkshops = workshopResponse?.data?.workshops || [];
    const displayWorkshops = activeWorkshops.length > 0 ? activeWorkshops : FALLBACK_WORKSHOPS;

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

    const [heroSlideIndex, setHeroSlideIndex] = React.useState(0);
    const heroSlides = [
        "/LandingPage/HeroSectionAssets/Slide1.jpg",
        "/LandingPage/HeroSectionAssets/Slide2.jpg",
        "/LandingPage/HeroSectionAssets/Slide3.jpg"
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex-1 flex flex-col">

            {/* Hero Section */}
            <section className="relative isolate w-full min-h-[500px] sm:min-h-[650px] flex items-center justify-center overflow-hidden py-12 sm:py-20">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0 w-full h-full bg-zinc-900 overflow-hidden">
                    {heroSlides.map((slide, index) => (
                        <img
                            key={slide}
                            src={slide}
                            alt={`Hero Background ${index + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${heroSlideIndex === index ? "opacity-100" : "opacity-0"
                                }`}
                        />
                    ))}
                    {/* Slight black overlay */}
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-20 w-full max-w-5xl px-4 sm:px-6 text-center text-white flex flex-col items-center justify-center -mt-4 sm:-mt-12">
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold italic tracking-wide mb-4 text-slate-100">
                        School Of Digital Marketing
                    </p>

                    <h1 className="text-[29px] sm:text-6xl md:text-7.5xl font-black italic tracking-tight leading-none mb-6 text-white relative w-full">
                        <span className="block">Endorsed By</span>
                        <span className="block mt-2">Marketing Leaders.</span>
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg font-medium text-slate-200 mb-8 max-w-2xl">
                        Built in Collaboration with Top Digital Marketing Professionals.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-row gap-3 sm:gap-4 justify-center w-full max-w-md mx-auto">
                        <Link
                            href="/courses"
                            className="whitespace-nowrap px-4 py-2.5 sm:px-8 sm:py-3 bg-[#0055ff] hover:bg-[#0044cc] transition-all duration-200 text-white font-bold text-[13px] sm:text-base rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        >
                            Apply Now
                        </Link>
                        <Link
                            href="/courses"
                            className="whitespace-nowrap px-4 py-2.5 sm:px-8 sm:py-3 bg-white hover:bg-slate-50 transition-all duration-200 text-black font-bold text-[13px] sm:text-base rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                        >
                            Explore Programs
                        </Link>
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

            {/* Brightest Minds Grid Section */}
            <section className="w-full py-4 md:py-8 bg-white">
                <div className="max-w-[1240px] mx-auto px-4">
                    <h2 className="text-center text-[18px] sm:text-[26px] md:text-[32px] font-normal text-[#961a1a] tracking-tight mb-4 md:mb-6">
                        See why the brightest minds choose Apscale X
                    </h2>

                    <div className="grid grid-cols-5 gap-0 overflow-hidden border border-gray-200">
                        {/* Row 1, Col 1: Text */}
                        <div className="flex flex-col justify-center p-2 sm:p-4 md:p-6 bg-white text-[#001a5a] min-h-[70px] sm:min-h-[120px] md:min-h-[220px]">
                            <h3 className="text-[6px] sm:text-[10px] md:text-sm lg:text-base font-semibold leading-tight tracking-tight uppercase">
                                Start Your Success Story At Apscale X, India's Premier Digital Academy
                            </h3>
                        </div>

                        {/* Row 1, Col 2: Image */}
                        <div className="relative min-h-[70px] sm:min-h-[120px] md:min-h-[220px]">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                                alt="Student laughing"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* Row 1, Col 3: Red Box */}
                        <div className="bg-[#b91c1c] text-white flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 text-center min-h-[70px] sm:min-h-[120px] md:min-h-[220px]">
                            <span className="text-[10px] sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">250,000+</span>
                            <span className="text-[4px] sm:text-[8px] md:text-[10px] lg:text-[11px] uppercase mt-1 sm:mt-2 font-bold tracking-wider">alumni worldwide</span>
                        </div>

                        {/* Row 1, Col 4: Navy Box */}
                        <div className="bg-[#001a5a] text-white flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 text-center min-h-[70px] sm:min-h-[120px] md:min-h-[220px]">
                            <span className="text-[10px] sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">#26</span>
                            <span className="text-[4px] sm:text-[8px] md:text-[10px] lg:text-[11px] uppercase mt-1 sm:mt-2 font-bold tracking-wider">public university in the nation</span>
                        </div>

                        {/* Row 1, Col 5: Image */}
                        <div className="relative min-h-[70px] sm:min-h-[120px] md:min-h-[220px]">
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
                                alt="Students group walking"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* Row 2, Col 1: Image */}
                        <div className="relative min-h-[70px] sm:min-h-[120px] md:min-h-[220px]">
                            <img
                                src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=600&q=80"
                                alt="Students discussing"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* Row 2, Col 2: Teal Box */}
                        <div className="bg-[#0f766e] text-white flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 text-center min-h-[70px] sm:min-h-[120px] md:min-h-[220px]">
                            <span className="text-[10px] sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">Over 300</span>
                            <span className="text-[4px] sm:text-[8px] md:text-[10px] lg:text-[11px] uppercase mt-1 sm:mt-2 font-bold tracking-wider">fields of study</span>
                        </div>

                        {/* Row 2, Col 3: Maroon Box */}
                        <div className="bg-[#850b0b] text-white flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 text-center min-h-[70px] sm:min-h-[120px] md:min-h-[220px]">
                            <span className="text-[10px] sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">2700+</span>
                            <span className="text-[4px] sm:text-[8px] md:text-[10px] lg:text-[11px] uppercase mt-1 sm:mt-2 font-bold tracking-wider">inventions by faculty</span>
                        </div>

                        {/* Row 2, Col 4: Image */}
                        <div className="relative min-h-[70px] sm:min-h-[120px] md:min-h-[220px]">
                            <img
                                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"
                                alt="Mentor showing laptop screen"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* Row 2, Col 5: Olive Circle Button */}
                        <div className="bg-[#f3f4f6] flex items-center justify-center p-1 sm:p-2 md:p-4 min-h-[70px] sm:min-h-[120px] md:min-h-[220px]">
                            <Link
                                href="/courses"
                                className="w-14 h-14 sm:w-24 sm:h-24 md:w-36 md:h-36 rounded-full bg-[#b8c599] hover:bg-[#a5b287] hover:scale-105 text-[#001a5a] font-extrabold text-[4px] sm:text-[7px] md:text-[11px] flex flex-col items-center justify-center text-center p-1 sm:p-2 md:p-3 transition-all duration-300 shadow-sm border border-[#9ba97d] tracking-wider leading-tight"
                            >
                                <span className="underline decoration-2 underline-offset-4 font-black">VIEW ALL FACTS & RANKINGS</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI-native competitor section */}
            <section className="relative w-full h-[350px] sm:h-[550px] md:h-[750px] overflow-hidden bg-black">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/LandingPage/Video/Video1.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/15 pointer-events-none" />

                {/* White shadow type separators */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/60 to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/60 to-transparent pointer-events-none z-10" />
            </section>

            {/* Stats / Yellow Section */}
            <section className="w-full bg-[#FFE342] text-black py-3.5 sm:py-6 md:py-8 px-4 sm:px-12 lg:px-24">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-4">
                    {/* Left content */}
                    <div className="flex flex-col">
                        <span className="text-[15px] sm:text-[19px] font-medium tracking-wide text-neutral-800">
                            Be A Skilled Professional
                        </span>
                        <span className="text-xl sm:text-3xl md:text-[34px] font-semibold tracking-tight mt-0.5 text-black">
                            Learn Today. Lead Tomorrow
                        </span>
                    </div>

                    {/* Right stats */}
                    <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:flex sm:flex-nowrap sm:gap-10 md:gap-14 lg:gap-20 w-full sm:w-auto">
                        <div className="flex flex-col">
                            <span className="text-xl xs:text-2xl sm:text-4xl md:text-[42px] font-medium tracking-tight text-black leading-none">
                                100,000+
                            </span>
                            <span className="text-[10px] xs:text-[11px] sm:text-[13px] font-normal text-neutral-800 mt-1 sm:whitespace-nowrap">
                                Careers Transformed Since 2015
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl xs:text-2xl sm:text-4xl md:text-[42px] font-medium tracking-tight text-black leading-none">
                                95,000+
                            </span>
                            <span className="text-[10px] xs:text-[11px] sm:text-[13px] font-normal text-neutral-800 mt-1 sm:whitespace-nowrap">
                                Successfully Placed
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl xs:text-2xl sm:text-4xl md:text-[42px] font-medium tracking-tight text-black leading-none">
                                2,000+
                            </span>
                            <span className="text-[10px] xs:text-[11px] sm:text-[13px] font-normal text-neutral-800 mt-1 sm:whitespace-nowrap">
                                Hiring Partners
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full px-4 md:px-24 lg:px-32 py-12 md:py-16 bg-white">
                <div className="max-w-[1200px] mx-auto">
                    <h3 className="text-center text-[28px] md:text-[36px] font-semibold text-[#111827] mb-8 -mt-2">
                        Tools That You'll Learn
                    </h3>
                    <LogoCloud />
                </div>
            </section>

            <section className="w-full px-4 md:px-24 lg:px-32 py-12 md:py-16 bg-[#f8fafd]">
                <div className="max-w-[1200px] mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-[20px] sm:text-[24px] md:text-[32px] font-extrabold text-[#1f2a44] tracking-tight">
                                Upcoming Workshops & Events
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Join our live, interactive sessions led by industry experts.
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="Previous"
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#1f2a44] flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                aria-label="Next"
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#1f2a44] flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 6l6 6-6 6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className={
                            displayWorkshops.length === 2
                                ? "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                                : displayWorkshops.length === 1
                                    ? "grid grid-cols-1 max-w-xl mx-auto"
                                    : "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto"
                        }>
                            {Array.from({ length: displayWorkshops.length > 0 ? displayWorkshops.length : 3 }).map((_, i) => (
                                <div key={i} className="animate-pulse rounded-3xl bg-white border border-slate-100 overflow-hidden flex flex-col h-[400px] shadow-sm">
                                    <div className="h-[220px] bg-slate-200 w-full" />
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
                                            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                                            <div className="h-6 bg-slate-200 rounded w-4/5 mb-3" />
                                            <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                                            <div className="h-4 bg-slate-200 rounded w-5/6" />
                                        </div>
                                        <div className="h-8 bg-slate-200 rounded w-1/3 mt-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={
                            displayWorkshops.length === 2
                                ? "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                                : displayWorkshops.length === 1
                                    ? "grid grid-cols-1 max-w-xl mx-auto"
                                    : "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto"
                        }>
                            {displayWorkshops.map((w) => {
                                const details = getUpcomingDetails(w.workshopDates || [], w.type || 'one-day');
                                const destinationUrl = w.type === 'three-days'
                                    ? `/three-days-workshops/${w.slug}`
                                    : `/one-day-workshop/${w.slug}`;
                                return (
                                    <Link
                                        key={w._id || w.slug || w.title}
                                        href={destinationUrl}
                                        className="group cursor-pointer flex flex-col flex-1 h-full w-full"
                                    >
                                        <article className="group relative flex flex-col flex-1 h-full w-full rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(31,42,91,0.08)] hover:border-indigo-100">
                                            {/* Thumbnail Area with Inner Image Zoom */}
                                            <div className="relative h-[220px] w-full shrink-0 overflow-hidden">
                                                <img
                                                    src={w.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"}
                                                    alt={w.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                                {/* Pulsing Live Badge */}
                                                <span className="absolute left-4 top-4 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm border border-white/20 tracking-wider uppercase flex items-center gap-1.5 z-10">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                    </span>
                                                    {w.type === 'three-days' ? '3-Day Workshop' : '1-Day Workshop'}
                                                </span>
                                            </div>

                                            {/* Content Details */}
                                            <div className="p-6 flex-1 flex flex-col justify-between bg-white transition-colors duration-500 group-hover:bg-[#1f2a5b] group-hover:text-white">
                                                <div>
                                                    {/* Vector Icon Info List */}
                                                    <div className="flex flex-col gap-2.5 text-[13px] font-semibold text-slate-500 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-slate-400 shrink-0 transition-colors group-hover:text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                                            </svg>
                                                            <span className="group-hover:text-indigo-200 transition-colors duration-500">
                                                                {details.dateStr} <span className="text-slate-300 group-hover:text-slate-500 mx-1">•</span> {details.timeStr}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-slate-400 shrink-0 transition-colors group-hover:text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                                <circle cx="12" cy="10" r="3"></circle>
                                                            </svg>
                                                            <span className="group-hover:text-indigo-200 transition-colors duration-500">
                                                                {details.place}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <h5 className="text-[20px] font-bold text-slate-900 leading-snug tracking-tight mb-2.5 transition-colors duration-500 group-hover:text-white">
                                                        {w.title}
                                                    </h5>
                                                    {w.description ? (
                                                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 transition-colors duration-500 group-hover:text-slate-200">
                                                            {w.description}
                                                        </p>
                                                    ) : null}
                                                </div>

                                                {/* Premium interactive action footer */}
                                                <div className="mt-6 pt-5 border-t border-slate-100 group-hover:border-slate-800/20 flex items-center justify-between text-sm font-bold text-indigo-600 transition-colors duration-500 group-hover:text-indigo-300">
                                                    <span>Learn More & Register</span>
                                                    <svg className="w-5 h-5 transform transition-transform duration-500 group-hover:translate-x-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex items-center gap-2 mt-8 justify-center">
                        {displayWorkshops.map((_, idx) => (
                            <span key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === 0 ? "w-4 bg-indigo-600" : "bg-slate-300"}`}></span>
                        ))}
                    </div>
                </div>
            </section>


            <InsideDA360 />
            <GlobalCommunity />
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

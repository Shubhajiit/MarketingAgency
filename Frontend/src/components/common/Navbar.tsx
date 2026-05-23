"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { workshopApi, Workshop } from '@/lib/api/workshops';

const RingIcon = ({ gradient }: { gradient: string }) => (
    <div className={`w-5 h-5 rounded-full p-[2.5px] bg-gradient-to-r ${gradient} flex-shrink-0 flex items-center justify-center`}>
        <div className="w-full h-full bg-white rounded-full" />
    </div>
);

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isMobileCoursesOpen, setIsMobileCoursesOpen] = React.useState(false);
    const [isMobileWorkshopsOpen, setIsMobileWorkshopsOpen] = React.useState(false);
    const [isCoursesOpen, setIsCoursesOpen] = React.useState(false);
    const [isWorkshopsOpen, setIsWorkshopsOpen] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const workshopsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const { user, isAuthenticated } = useAuth();
    const pathname = usePathname();
    const dashboardHref = '/dashboard';

    React.useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        setIsMobileCoursesOpen(false);
        setIsMobileWorkshopsOpen(false);
        setIsCoursesOpen(false);
        setIsWorkshopsOpen(false);
    }, [pathname]);

    // Live workshops data from API
    const [liveWorkshops, setLiveWorkshops] = React.useState<Workshop[]>([]);
    const [lastFetched, setLastFetched] = React.useState<number | null>(null);
    const [isFetching, setIsFetching] = React.useState(false);

    const fetchLiveWorkshops = React.useCallback(async () => {
        const now = Date.now();
        // Return if fetched within the last 5 minutes (300,000 ms)
        if (lastFetched && (now - lastFetched < 5 * 60 * 1000)) return;
        
        setIsFetching(true);
        try {
            const res = await workshopApi.list({ limit: 20 });
            setLiveWorkshops(res.data.workshops);
            setLastFetched(now);
        } catch {
            // Silently fail — the dropdown will just show no items
        } finally {
            setIsFetching(false);
        }
    }, [lastFetched]);

    const workshopsLoaded = lastFetched !== null;
    const showLoader = isFetching && !workshopsLoaded;

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsCoursesOpen(true);
        setIsWorkshopsOpen(false);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsCoursesOpen(false);
        }, 150);
    };

    const handleWorkshopsMouseEnter = () => {
        if (workshopsTimeoutRef.current) {
            clearTimeout(workshopsTimeoutRef.current);
            workshopsTimeoutRef.current = null;
        }
        setIsWorkshopsOpen(true);
        setIsCoursesOpen(false);
        fetchLiveWorkshops();
    };

    const handleWorkshopsMouseLeave = () => {
        if (workshopsTimeoutRef.current) clearTimeout(workshopsTimeoutRef.current);
        workshopsTimeoutRef.current = setTimeout(() => {
            setIsWorkshopsOpen(false);
        }, 150);
    };

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (workshopsTimeoutRef.current) clearTimeout(workshopsTimeoutRef.current);
        };
    }, []);

    return (
        <>
            {/* Navbar */}
            <header className="relative bg-white border-b border-gray-100 py-3 px-4 md:px-36 flex justify-between items-center z-50 w-full">
                <div className="flex items-center">
                    <img src="/Logo/Logo.png" alt="Datamites Logo" className="h-12 w-auto object-contain" />
                </div>

                <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-gray-800 tracking-wide">
                    {/* <a href="#" className="hover:text-[#009ee3]">HOME</a> */}
                    <div
                        className="h-full flex items-center"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <a href="#" className="hover:text-[#009ee3] flex items-center gap-1 py-4">
                            COURSES
                            <svg className={`w-3 h-3 transition-transform duration-200 ${isCoursesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </a>
                    </div>
                    <div
                        className="h-full flex items-center"
                        onMouseEnter={handleWorkshopsMouseEnter}
                        onMouseLeave={handleWorkshopsMouseLeave}
                    >
                        <a href="#" className="hover:text-[#009ee3] flex items-center gap-1 py-4 uppercase">
                            LIVE WORKSHOPS
                            <svg className={`w-3 h-3 transition-transform duration-200 ${isWorkshopsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </a>
                    </div>
                    <a href="#" className="hover:text-[#009ee3] flex items-center gap-1">PARTNERS <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></a>
                    <a href="#" className="hover:text-[#009ee3]">REVIEWS</a>
                    {isAuthenticated && user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-9 h-9 rounded-full bg-[#009ee3] text-white flex items-center justify-center font-semibold uppercase hover:bg-blue-600 transition-colors"
                            >
                                {user.email.charAt(0)}
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                                    <div className="px-4 py-2 border-b border-gray-100 text-sm text-gray-500 truncate">
                                        {user.email}
                                    </div>
                                    <Link
                                        href={dashboardHref}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#009ee3]"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        Go to dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="px-5 py-2 bg-[#009ee3] text-white rounded hover:bg-blue-600 transition-colors">Login</Link>
                    )}
                </nav>

                {/* Courses Mega Menu Dropdown */}
                {isCoursesOpen && (
                    <div
                        className="absolute top-full left-0 right-0 w-full bg-white border-t border-b border-gray-100 shadow-2xl z-50 py-10 transition-all duration-200"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => setIsCoursesOpen(false)}
                    >
                        <div className="max-w-screen-2xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Column 1: Intro */}
                            <div className="flex flex-col pr-6">
                                <span className="text-[#00c58d] text-sm font-bold tracking-wider uppercase block mb-1">Online Learning</span>
                                <h2 className="text-[#1e2245] text-3xl font-black tracking-tight leading-tight mb-3">
                                    World Class Certification
                                </h2>
                                <p className="text-gray-500 text-[14px] leading-relaxed mb-4">
                                    DMI is the proven global standard for digital marketing certification with over 300,000+ members and over 75,000+ certified professionals worldwide.
                                </p>
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center justify-center bg-[#00c58d] hover:bg-[#00b07c] text-white text-[13px] font-bold py-2.5 px-5 rounded transition-colors w-fit gap-1"
                                >
                                    View All Courses <span className="text-sm font-semibold">→</span>
                                </Link>
                            </div>

                            {/* Column 2: Pro & Specialist Courses */}
                            <div>
                                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                                    <RingIcon gradient="from-[#22c55e] to-[#3b82f6]" />
                                    <h3 className="text-base font-bold text-gray-900">Pro & Specialist Courses</h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                DMI Pro
                                            </strong>
                                            Perfect for career switchers,
                                            <span className="inline-block bg-[#e52d6a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm mx-1 uppercase tracking-wider align-middle">Popular</span>
                                            owners and marketing managers.
                                        </p>
                                    </a>
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                Search Marketing
                                            </strong>
                                            Sharpen your search marketing strategy from SEO and PPC to analytics.
                                        </p>
                                    </a>
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                Social Media Marketing
                                            </strong>
                                            Perfect for those looking to fully grasp the social media landscape.
                                        </p>
                                    </a>
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                Strategy & Leadership
                                            </strong>
                                            For aspiring and emerging marketing leaders to gain the strategic, data-driven and AI-powered skills to drive performance, manage teams, and grow business impact.
                                        </p>
                                    </a>
                                </div>
                            </div>

                            {/* Column 3: Advanced Courses */}
                            <div>
                                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                                    <RingIcon gradient="from-[#10b981] to-[#06b6d4]" />
                                    <h3 className="text-base font-bold text-gray-900">Advanced Courses</h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                DMI Expert
                                            </strong>
                                            Designed for marketing professionals looking to drive business growth and commercial success in a senior role
                                        </p>
                                    </a>
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                Postgraduate Diploma In Digital Marketing
                                            </strong>
                                            Designed for professionals at various stages from Marketing Executives to CEO&apos;s, this programme offers cutting-edge digital marketing skills, strategic insights, and the latest industry best practices.
                                        </p>
                                    </a>
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                Masters (MSc) In Digital Marketing
                                            </strong>
                                            Master your digital marketing skills and elevate your career with BPP&apos;s Master&apos;s Programme taught by industry experts and the top practitioners in their fields globally.
                                        </p>
                                    </a>
                                </div>
                            </div>

                            {/* Column 4: Short Courses */}
                            <div>
                                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                                    <RingIcon gradient="from-[#eab308] to-[#10b981]" />
                                    <h3 className="text-base font-bold text-gray-900">Short Courses</h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                Advanced AI
                                            </strong>
                                            Fast-track your AI skills with
                                            <span className="inline-block bg-[#e52d6a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm mx-1 uppercase tracking-wider align-middle">NEW</span>
                                            short interactive course. Learn the fundamentals of AI and understand AI data-driven marketing.
                                        </p>
                                    </a>
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                Search Engine Optimization (SEO)
                                            </strong>
                                            Rank better in search results through a mix of SEO strategies to make it easy for the right people to find you.
                                        </p>
                                    </a>
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                Paid Search (PPC)
                                            </strong>
                                            Develop PPC campaigns by understanding keywords, bidding and budget.
                                        </p>
                                    </a>
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                Social Media Marketing
                                            </strong>
                                            The perfect intro exploring today&apos;s rapidly changing social media landscape.
                                        </p>
                                    </a>
                                    <a href="#" className="group block p-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-all duration-150">
                                        <p className="text-[14px] leading-relaxed text-slate-500">
                                            <strong className="text-[#1e2245] font-bold group-hover:text-[#009ee3] transition-colors duration-150 mr-1.5">
                                                Digital Strategy
                                            </strong>
                                            Discover the fundamentals of developing a digital strategy.
                                        </p>
                                    </a>
                                    <a href="#" className="text-sm font-bold text-[#1e2245] hover:text-[#009ee3] transition-colors duration-150 mt-1 block">
                                        More...
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Workshops Mega Menu Dropdown */}
                {isWorkshopsOpen && (
                    <div 
                        className="absolute top-full left-0 right-0 w-full bg-white border-t border-b border-gray-100 shadow-2xl z-50 py-10 transition-all duration-200"
                        onMouseEnter={handleWorkshopsMouseEnter}
                        onMouseLeave={handleWorkshopsMouseLeave}
                        onClick={() => setIsWorkshopsOpen(false)}
                    >
                        <div className="max-w-screen-2xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Column 1: Intro */}
                            <div className="flex flex-col pr-6">
                                <span className="text-[#00c58d] text-sm font-bold tracking-wider uppercase block mb-1">Live Learning</span>
                                <h2 className="text-[#1e2245] text-3xl font-black tracking-tight leading-tight mb-3">
                                    Live Workshops
                                </h2>
                                <p className="text-gray-500 text-[14px] leading-relaxed mb-4">
                                    Join our expert-led live workshops with hands-on sessions, industry tools demos, and networking opportunities with professionals worldwide.
                                </p>
                            </div>

                            {/* Column 2-3: Dynamic Workshops */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                                    <RingIcon gradient="from-[#22c55e] to-[#3b82f6]" />
                                    <h3 className="text-base font-bold text-gray-900">Upcoming Workshops</h3>
                                    {showLoader && (
                                        <div className="ml-2 w-4 h-4 border-2 border-gray-300 border-t-[#009ee3] rounded-full animate-spin" />
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {liveWorkshops.length > 0 ? (
                                        liveWorkshops.map((w) => (
                                            <Link
                                                key={w._id}
                                                href={`/workshops/${w.slug}`}
                                                className="group block p-3 -mx-1.5 rounded-lg hover:bg-slate-50 transition-all duration-150 border border-transparent hover:border-gray-100"
                                            >
                                                <div className="flex items-start gap-3">
                                                    {w.thumbnail ? (
                                                        <img src={w.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0 mt-0.5" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5">
                                                            {w.title.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <strong className="text-[#1e2245] text-[14px] font-bold group-hover:text-[#009ee3] transition-colors duration-150 block leading-snug">
                                                            {w.title}
                                                        </strong>
                                                        {w.subtitle && (
                                                            <p className="text-[12px] text-slate-500 leading-relaxed mt-1 line-clamp-2">{w.subtitle}</p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            {w.batchNumber && (
                                                                <span className="text-[9px] font-bold text-[#6366f1] bg-[#efeefc] px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                                    {w.batchNumber}
                                                                </span>
                                                            )}
                                                            {w.startDate && (
                                                                <span className="text-[10px] text-gray-400 font-medium">
                                                                    Starts {new Date(w.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : workshopsLoaded ? (
                                        <p className="text-sm text-gray-400 col-span-2 py-4">No workshops available at the moment. Check back soon!</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-gray-800 focus:outline-none ml-auto p-1 hover:bg-gray-50 rounded"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </header>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-150 px-6 py-4 flex flex-col gap-3 text-xs font-semibold text-gray-800 tracking-wide transition-all duration-300 z-20 w-full">
                    <a href="#" className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between">HOME</a>

                    <button
                        onClick={() => setIsMobileCoursesOpen(!isMobileCoursesOpen)}
                        className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between w-full text-left font-semibold text-xs text-gray-800"
                    >
                        COURSES
                        <svg className={`w-3 h-3 transition-transform duration-200 ${isMobileCoursesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isMobileCoursesOpen && (
                        <div className="pl-4 py-2 flex flex-col gap-4 border-l border-gray-200 mt-1 mb-2 bg-gray-50/50 rounded-r-md">
                            {/* Pro & Specialist */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <div className="w-3.5 h-3.5 rounded-full p-[2px] bg-gradient-to-r from-[#22c55e] to-[#3b82f6] flex-shrink-0 flex items-center justify-center">
                                        <div className="w-full h-full bg-white rounded-full" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">Pro & Specialist Courses</span>
                                </div>
                                <div className="flex flex-col gap-2 pl-5">
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3] flex items-center gap-1.5">
                                        DMI Pro
                                        <span className="bg-[#e52d6a] text-white text-[9px] font-bold px-1 rounded-sm uppercase tracking-wider">Popular</span>
                                    </a>
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3]">Search Marketing</a>
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3]">Social Media Marketing</a>
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3]">Strategy & Leadership</a>
                                </div>
                            </div>
                            {/* Advanced */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <div className="w-3.5 h-3.5 rounded-full p-[2px] bg-gradient-to-r from-[#10b981] to-[#06b6d4] flex-shrink-0 flex items-center justify-center">
                                        <div className="w-full h-full bg-white rounded-full" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">Advanced Courses</span>
                                </div>
                                <div className="flex flex-col gap-2 pl-5">
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3]">DMI Expert</a>
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3]">Postgraduate Diploma In Digital Marketing</a>
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3]">Masters (MSc) In Digital Marketing</a>
                                </div>
                            </div>
                            {/* Short */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <div className="w-3.5 h-3.5 rounded-full p-[2px] bg-gradient-to-r from-[#eab308] to-[#10b981] flex-shrink-0 flex items-center justify-center">
                                        <div className="w-full h-full bg-white rounded-full" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">Short Courses</span>
                                </div>
                                <div className="flex flex-col gap-2 pl-5">
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3] flex items-center gap-1.5">
                                        Advanced AI
                                        <span className="bg-[#e52d6a] text-white text-[9px] font-bold px-1 rounded-sm uppercase tracking-wider">NEW</span>
                                    </a>
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3]">Search Engine Optimization (SEO)</a>
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3]">Paid Search (PPC)</a>
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3]">Social Media Marketing</a>
                                    <a href="#" className="text-xs text-gray-600 hover:text-[#009ee3]">Digital Strategy</a>
                                    <a href="#" className="text-xs font-semibold text-[#1e2245] hover:text-[#009ee3]">More...</a>
                                </div>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={() => {
                            setIsMobileWorkshopsOpen(!isMobileWorkshopsOpen);
                            fetchLiveWorkshops();
                        }}
                        className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between w-full text-left font-semibold text-xs text-gray-800 uppercase"
                    >
                        LIVE WORKSHOPS
                        <svg className={`w-3 h-3 transition-transform duration-200 ${isMobileWorkshopsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isMobileWorkshopsOpen && (
                        <div className="pl-4 py-2 flex flex-col gap-3 border-l border-gray-200 mt-1 mb-2 bg-gray-50/50 rounded-r-md">
                            <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-3.5 h-3.5 rounded-full p-[2px] bg-gradient-to-r from-[#22c55e] to-[#3b82f6] flex-shrink-0 flex items-center justify-center">
                                    <div className="w-full h-full bg-white rounded-full" />
                                </div>
                                <span className="text-xs font-bold text-gray-900">Upcoming Workshops</span>
                                {showLoader && (
                                    <div className="ml-1 w-3 h-3 border-2 border-gray-300 border-t-[#009ee3] rounded-full animate-spin" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2 pl-5">
                                {liveWorkshops.length > 0 ? (
                                    liveWorkshops.map((w) => (
                                        <Link
                                            key={w._id}
                                            href={`/workshops/${w.slug}`}
                                            className="text-xs text-gray-600 hover:text-[#009ee3] flex items-center gap-1.5"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {w.title}
                                            {w.batchNumber && (
                                                <span className="bg-[#6366f1] text-white text-[8px] font-bold px-1 rounded-sm uppercase tracking-wider">{w.batchNumber}</span>
                                            )}
                                        </Link>
                                    ))
                                ) : workshopsLoaded ? (
                                    <span className="text-xs text-gray-400">No workshops available</span>
                                ) : null}
                            </div>
                        </div>
                    )}
                    <a href="#" className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between">PARTNERS <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></a>
                    <a href="#" className="hover:text-[#009ee3] py-2.5 flex items-center justify-between">REVIEWS</a>
                    {isAuthenticated && user ? (
                        <>
                            <div className="py-2.5 border-t border-gray-100 mt-2 flex justify-between items-center relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="w-8 h-8 rounded-full bg-[#009ee3] text-white flex items-center justify-center font-semibold uppercase"
                                >
                                    {user.email.charAt(0)}
                                </button>
                                <span className="text-gray-600 truncate ml-3 flex-1">{user.email}</span>
                            </div>
                            {isProfileOpen && (
                                <Link
                                    href={dashboardHref}
                                    className="py-2.5 text-center bg-gray-50 text-[#009ee3] border border-gray-200 rounded hover:bg-gray-100 transition-colors mt-2 w-full"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Go to dashboard
                                </Link>
                            )}
                        </>
                    ) : (
                        <Link href="/login" className="py-2.5 text-center bg-[#009ee3] text-white rounded hover:bg-blue-600 transition-colors mt-2 w-full">Login</Link>
                    )}
                </div>
            )}
        </>
    );
}

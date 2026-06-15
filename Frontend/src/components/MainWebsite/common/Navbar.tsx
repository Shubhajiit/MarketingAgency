"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { workshopApi, Workshop } from '@/lib/api/workshops';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';

const RingIcon = ({ gradient }: { gradient: string }) => (
    <div className={`w-5 h-5 rounded-full p-[2.5px] bg-gradient-to-r ${gradient} flex-shrink-0 flex items-center justify-center`}>
        <div className="w-full h-full bg-white rounded-full" />
    </div>
);

export default function Navbar() {
    const [mounted, setMounted] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isMobileCoursesOpen, setIsMobileCoursesOpen] = React.useState(false);
    const [isMobileWorkshopsOpen, setIsMobileWorkshopsOpen] = React.useState(false);
    const [isMobileThreeDaysOpen, setIsMobileThreeDaysOpen] = React.useState(false);
    const [isCoursesOpen, setIsCoursesOpen] = React.useState(false);
    const [isWorkshopsOpen, setIsWorkshopsOpen] = React.useState(false);
    const [isThreeDaysOpen, setIsThreeDaysOpen] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const workshopsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const threeDaysTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const { cartCount, openDrawer } = useCartStore();
    const pathname = usePathname();
    const dashboardHref = '/dashboard';

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        setIsMobileCoursesOpen(false);
        setIsMobileWorkshopsOpen(false);
        setIsMobileThreeDaysOpen(false);
        setIsCoursesOpen(false);
        setIsWorkshopsOpen(false);
        setIsThreeDaysOpen(false);
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
            const res = await workshopApi.listPublic({ limit: 20 });
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
        setIsThreeDaysOpen(false);
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
        setIsThreeDaysOpen(false);
        fetchLiveWorkshops();
    };

    const handleWorkshopsMouseLeave = () => {
        if (workshopsTimeoutRef.current) clearTimeout(workshopsTimeoutRef.current);
        workshopsTimeoutRef.current = setTimeout(() => {
            setIsWorkshopsOpen(false);
        }, 150);
    };

    const handleThreeDaysMouseEnter = () => {
        if (threeDaysTimeoutRef.current) {
            clearTimeout(threeDaysTimeoutRef.current);
            threeDaysTimeoutRef.current = null;
        }
        setIsThreeDaysOpen(true);
        setIsWorkshopsOpen(false);
        setIsCoursesOpen(false);
        fetchLiveWorkshops();
    };

    const handleThreeDaysMouseLeave = () => {
        if (threeDaysTimeoutRef.current) clearTimeout(threeDaysTimeoutRef.current);
        threeDaysTimeoutRef.current = setTimeout(() => {
            setIsThreeDaysOpen(false);
        }, 150);
    };

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (workshopsTimeoutRef.current) clearTimeout(workshopsTimeoutRef.current);
            if (threeDaysTimeoutRef.current) clearTimeout(threeDaysTimeoutRef.current);
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
                    <Link href="/courses" className="hover:text-[#009ee3] flex items-center gap-1 py-4">
                        COURSES
                    </Link>
                    <div
                        className="h-full flex items-center"
                        onMouseEnter={handleWorkshopsMouseEnter}
                        onMouseLeave={handleWorkshopsMouseLeave}
                    >
                        <a href="#" className="hover:text-[#009ee3] flex items-center gap-1 py-4 uppercase">
                            ONE DAY WORKSHOP
                            <svg className={`w-3 h-3 transition-transform duration-200 ${isWorkshopsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </a>
                    </div>
                    <div
                        className="h-full flex items-center"
                        onMouseEnter={handleThreeDaysMouseEnter}
                        onMouseLeave={handleThreeDaysMouseLeave}
                    >
                        <Link href="/three-days-workshops" className="hover:text-[#009ee3] flex items-center gap-1 py-4 uppercase">
                            THREE DAYS WORKSHOPS
                            <svg className={`w-3 h-3 transition-transform duration-200 ${isThreeDaysOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </Link>
                    </div>
                    <Link href="/about" className="hover:text-[#009ee3] flex items-center gap-1">ABOUT US</Link>
                    <Link href="/contact" className="hover:text-[#009ee3]">CONTACT US</Link>

                    {/* Cart Button */}
                    <button
                        onClick={openDrawer}
                        className="relative p-2 text-gray-700 hover:text-[#009ee3] transition-colors flex items-center justify-center cursor-pointer"
                        aria-label="View Cart"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-[#e52d6a] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-in scale-in duration-200">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {!mounted || isLoading ? (
                        <div className="h-9 w-20 bg-slate-100 animate-pulse rounded border border-slate-200/50" />
                    ) : isAuthenticated && user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-9 h-9 rounded-full bg-[#001A5A] text-white flex items-center justify-center font-semibold uppercase hover:bg-[#003063] transition-colors"
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
                        <Link href="/login" className="px-5 py-2 bg-[#001A5A] text-white rounded hover:bg-[#003063] transition-colors">Login</Link>
                    )}
                </nav>



                {/* One Day Workshops Mega Menu Dropdown */}
                {isWorkshopsOpen && (
                    <div
                        className="absolute top-full left-0 right-0 w-full bg-white border-t border-b border-gray-100 shadow-2xl z-50 py-10 transition-all duration-200"
                        onMouseEnter={handleWorkshopsMouseEnter}
                        onMouseLeave={handleWorkshopsMouseLeave}
                        onClick={() => setIsWorkshopsOpen(false)}
                    >
                        <div className="max-w-screen-2xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Column 1: Intro */}
                            <div className="flex flex-col pr-6 text-black">
                                <span className="text-[#00c58d] text-sm font-bold tracking-wider uppercase block mb-1">Live Learning</span>
                                <h2 className="text-[#1e2245] text-3xl font-black tracking-tight leading-tight mb-3">
                                    One Day Workshop
                                </h2>
                                <p className="text-gray-500 text-[14px] leading-relaxed mb-4">
                                    Join our expert-led live workshops with hands-on sessions, industry tools demos, and networking opportunities with professionals worldwide.
                                </p>
                            </div>

                            {/* Column 2-3: Dynamic Workshops */}
                            <div className="md:col-span-2 text-black">
                                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                                    <RingIcon gradient="from-[#22c55e] to-[#3b82f6]" />
                                    <h3 className="text-base font-bold text-gray-900">Upcoming Workshops</h3>
                                    {showLoader && (
                                        <div className="ml-2 w-4 h-4 border-2 border-gray-300 border-t-[#009ee3] rounded-full animate-spin" />
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {liveWorkshops.filter(w => w.type !== 'three-days').length > 0 ? (
                                        liveWorkshops.filter(w => w.type !== 'three-days').map((w) => (
                                            <Link
                                                key={w._id}
                                                href={`/one-day-workshop/${w.slug}`}
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
                                                            {(w as any).batchNumber && (
                                                                <span className="text-[9px] font-bold text-[#6366f1] bg-[#efeefc] px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                                    {(w as any).batchNumber}
                                                                </span>
                                                            )}
                                                            {(w as any).startDate && (
                                                                <span className="text-[10px] text-gray-400 font-medium">
                                                                    Starts {new Date((w as any).startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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

                {/* Three Days Workshops Mega Menu Dropdown */}
                {isThreeDaysOpen && (
                    <div
                        className="absolute top-full left-0 right-0 w-full bg-white border-t border-b border-gray-100 shadow-2xl z-50 py-10 transition-all duration-200"
                        onMouseEnter={handleThreeDaysMouseEnter}
                        onMouseLeave={handleThreeDaysMouseLeave}
                        onClick={() => setIsThreeDaysOpen(false)}
                    >
                        <div className="max-w-screen-2xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Column 1: Intro */}
                            <div className="flex flex-col pr-6 text-black">
                                <span className="text-[#00c58d] text-sm font-bold tracking-wider uppercase block mb-1">Live Learning</span>
                                <h2 className="text-[#1e2245] text-3xl font-black tracking-tight leading-tight mb-3">
                                    Three Days Workshops
                                </h2>
                                <p className="text-gray-500 text-[14px] leading-relaxed mb-4">
                                    Join our comprehensive multi-day live workshops with deep-dive sessions, step-by-step implementations, and expert mentoring.
                                </p>
                            </div>

                            {/* Column 2-3: Dynamic Workshops */}
                            <div className="md:col-span-2 text-black">
                                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
                                    <RingIcon gradient="from-[#22c55e] to-[#3b82f6]" />
                                    <h3 className="text-base font-bold text-gray-900">Upcoming Workshops</h3>
                                    {showLoader && (
                                        <div className="ml-2 w-4 h-4 border-2 border-gray-300 border-t-[#009ee3] rounded-full animate-spin" />
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {liveWorkshops.filter(w => w.type === 'three-days').length > 0 ? (
                                        liveWorkshops.filter(w => w.type === 'three-days').map((w) => (
                                            <Link
                                                key={w._id}
                                                href={`/three-days-workshops/${w.slug}`}
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
                                                            {(w as any).batchNumber && (
                                                                <span className="text-[9px] font-bold text-[#6366f1] bg-[#efeefc] px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                                    {(w as any).batchNumber}
                                                                </span>
                                                            )}
                                                            {(w as any).startDate && (
                                                                <span className="text-[10px] text-gray-400 font-medium">
                                                                    Starts {new Date((w as any).startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                {/* Mobile Cart Button */}
                <button
                    onClick={openDrawer}
                    className="md:hidden relative p-2 text-gray-700 hover:text-[#009ee3] transition-colors flex items-center justify-center cursor-pointer ml-auto mr-2"
                    aria-label="View Cart"
                >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-[#e52d6a] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                            {cartCount}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-gray-800 focus:outline-none p-1 hover:bg-gray-50 rounded"
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

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-150 px-6 py-4 flex flex-col gap-3 text-xs font-semibold text-gray-800 tracking-wide transition-all duration-300 z-50 w-full shadow-2xl max-h-[calc(100vh-120px)] overflow-y-auto">
                        <Link href="/" className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between">HOME</Link>

                        <Link href="/courses" className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between">
                            COURSES
                        </Link>

                        <button
                            onClick={() => {
                                setIsMobileWorkshopsOpen(!isMobileWorkshopsOpen);
                                fetchLiveWorkshops();
                            }}
                            className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between w-full text-left font-semibold text-xs text-gray-800 uppercase"
                        >
                            ONE DAY WORKSHOP
                            <svg className={`w-3 h-3 transition-transform duration-200 ${isMobileWorkshopsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isMobileWorkshopsOpen && (
                            <div className="pl-4 py-2 flex flex-col gap-3 border-l border-gray-200 mt-1 mb-2 bg-gray-50/50 rounded-r-md animate-in fade-in slide-in-from-top-2 duration-200">
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
                                    {liveWorkshops.filter(w => w.type !== 'three-days').length > 0 ? (
                                        liveWorkshops.filter(w => w.type !== 'three-days').map((w) => (
                                            <Link
                                                key={w._id}
                                                href={`/one-day-workshop/${w.slug}`}
                                                className="text-xs text-gray-600 hover:text-[#009ee3] flex items-center gap-1.5"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {w.title}
                                                {(w as any).batchNumber && (
                                                    <span className="bg-[#6366f1] text-white text-[8px] font-bold px-1 rounded-sm uppercase tracking-wider">{(w as any).batchNumber}</span>
                                                )}
                                            </Link>
                                        ))
                                    ) : workshopsLoaded ? (
                                        <span className="text-xs text-gray-400">No workshops available</span>
                                    ) : null}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setIsMobileThreeDaysOpen(!isMobileThreeDaysOpen);
                                fetchLiveWorkshops();
                            }}
                            className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between w-full text-left font-semibold text-xs text-gray-800 uppercase"
                        >
                            THREE DAYS WORKSHOPS
                            <svg className={`w-3 h-3 transition-transform duration-200 ${isMobileThreeDaysOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isMobileThreeDaysOpen && (
                            <div className="pl-4 py-2 flex flex-col gap-3 border-l border-gray-200 mt-1 mb-2 bg-gray-50/50 rounded-r-md animate-in fade-in slide-in-from-top-2 duration-200">
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
                                    {liveWorkshops.filter(w => w.type === 'three-days').length > 0 ? (
                                        liveWorkshops.filter(w => w.type === 'three-days').map((w) => (
                                            <Link
                                                key={w._id}
                                                href={`/three-days-workshops/${w.slug}`}
                                                className="text-xs text-gray-600 hover:text-[#009ee3] flex items-center gap-1.5"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {w.title}
                                                {(w as any).batchNumber && (
                                                    <span className="bg-[#6366f1] text-white text-[8px] font-bold px-1 rounded-sm uppercase tracking-wider">{(w as any).batchNumber}</span>
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
                        {!mounted || isLoading ? (
                            <div className="py-2.5 border-t border-gray-100 mt-2 flex flex-col gap-3 w-full animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/50" />
                                    <div className="h-4 bg-slate-100 rounded w-2/3 border border-slate-200/30" />
                                </div>
                                <div className="h-9 bg-slate-100 rounded w-full border border-slate-200/50" />
                            </div>
                        ) : isAuthenticated && user ? (
                            <>
                                <div className="py-2.5 border-t border-gray-100 mt-2 flex justify-between items-center relative">
                                    <div className="w-8 h-8 rounded-full bg-[#009ee3] text-white flex items-center justify-center font-semibold uppercase">
                                        {user.email.charAt(0)}
                                    </div>
                                    <span className="text-gray-600 truncate ml-3 flex-1">{user.email}</span>
                                </div>
                                <Link
                                    href={dashboardHref}
                                    className="py-2.5 text-center bg-gray-50 text-[#009ee3] border border-gray-200 rounded hover:bg-gray-100 transition-colors mt-2 w-full font-bold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Go to dashboard
                                </Link>
                            </>
                        ) : (
                            <Link href="/login" className="py-2.5 text-center bg-[#009ee3] text-white rounded hover:bg-blue-600 transition-colors mt-2 w-full">Login</Link>
                        )}
                    </div>
                )}
            </header>
        </>
    );
}

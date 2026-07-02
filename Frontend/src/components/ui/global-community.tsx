import React from "react";

interface PhotoInfo {
    src: string;
    label: string;
}

export default function GlobalCommunity() {
    const tickerText = "Learn Today. Lead Tomorrow.";
    const tickerItems = Array(12).fill(tickerText);

    return (
        <>
            <section className="w-full bg-[#f9fafb] pt-16 md:pt-24 pb-0 px-4 md:px-24 lg:px-32 text-gray-900 overflow-hidden">
                <div className="max-w-[1200px] mx-auto text-center">
                    {/* Section Header */}
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1e2245] mb-10">
                        Join Our Thriving Global Learning Community
                    </h2>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 max-w-4xl mx-auto mb-16">
                        {/* Stat 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-500 flex items-center justify-center text-white mb-2 sm:mb-4 shadow-md shadow-amber-500/20">
                                {/* Briefcase Icon */}
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                                </svg>
                            </div>
                            <span className="text-base sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                100,000+
                            </span>
                            <span className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1">
                                Careers Transformed Since 2015
                            </span>
                        </div>

                        {/* Stat 2 */}
                        <div className="flex flex-col items-center">
                            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-500 flex items-center justify-center text-white mb-2 sm:mb-4 shadow-md shadow-emerald-500/20">
                                {/* Users Icon */}
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                                    <path d="M16 3.13a4 4 0 010 7.75" />
                                </svg>
                            </div>
                            <span className="text-base sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                95,000+
                            </span>
                            <span className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1">
                                Successfully Placed
                            </span>
                        </div>

                        {/* Stat 3 */}
                        <div className="flex flex-col items-center">
                            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-500 flex items-center justify-center text-white mb-2 sm:mb-4 shadow-md shadow-indigo-500/20">
                                {/* Globe Icon */}
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                                </svg>
                            </div>
                            <span className="text-base sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                2,000+
                            </span>
                            <span className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1">
                                Hiring Partners
                            </span>
                        </div>
                    </div>

                    {/* Map Area */}
                    <div className="relative w-[135%] -translate-x-[13%] sm:translate-x-0 sm:w-full max-w-5xl mx-auto aspect-[2.1/1] select-none">
                        {/* SVG Map Background */}
                        <img
                            src="/LandingPage/global-map.svg"
                            alt="Global Community Map"
                            className="w-full h-full object-contain opacity-80"
                        />

                        {/* Marker 1 (North America / Left) */}
                        <div className="absolute top-[38%] left-[28%] flex flex-col items-center">
                            {/* Bubble */}
                            <div className="absolute bottom-full mb-1.5 sm:mb-2.5 flex flex-col items-center">
                                <div className="bg-white text-gray-950 rounded-lg sm:rounded-xl px-1.5 py-0.5 sm:px-3 sm:py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-1 sm:gap-2 border border-slate-100/80">
                                    <img
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                                        className="w-4 h-4 sm:w-6 sm:h-6 rounded-full object-cover border border-slate-200"
                                        alt="Learner"
                                    />
                                    <span className="text-[9px] sm:text-[12px] font-bold text-gray-900 whitespace-nowrap">
                                        30,181 <span className="font-medium text-slate-500 text-[8px] sm:text-[11px]">Learners</span>
                                    </span>
                                </div>
                                {/* Speech Bubble Arrow */}
                                <div className="w-1.5 h-1.5 bg-white transform rotate-45 -mt-1 sm:-mt-1.5 shadow-[3px_3px_5px_rgba(0,0,0,0.03)] border-r border-b border-slate-100/80" />
                            </div>
                            {/* Pinging Dot */}
                            <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-red-500"></span>
                            </div>
                        </div>

                        {/* Marker 2 (India / Bottom Middle) */}
                        <div className="absolute top-[72%] left-[56%] flex flex-col items-center">
                            {/* Bubble */}
                            <div className="absolute bottom-full mb-1.5 sm:mb-2.5 flex flex-col items-center">
                                <div className="bg-white text-gray-950 rounded-lg sm:rounded-xl px-1.5 py-0.5 sm:px-3 sm:py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-1 sm:gap-2 border border-slate-100/80">
                                    <img
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                                        className="w-4 h-4 sm:w-6 sm:h-6 rounded-full object-cover border border-slate-200"
                                        alt="Learner"
                                    />
                                    <span className="text-[9px] sm:text-[12px] font-bold text-gray-900 whitespace-nowrap">
                                        52,001 <span className="font-medium text-slate-500 text-[8px] sm:text-[11px]">Learners</span>
                                    </span>
                                </div>
                                {/* Speech Bubble Arrow */}
                                <div className="w-1.5 h-1.5 bg-white transform rotate-45 -mt-1 sm:-mt-1.5 shadow-[3px_3px_5px_rgba(0,0,0,0.03)] border-r border-b border-slate-100/80" />
                            </div>
                            {/* Pinging Dot */}
                            <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-red-500"></span>
                            </div>
                        </div>

                        {/* Marker 3 (East Asia / Right) */}
                        <div className="absolute top-[52%] left-[64%] flex flex-col items-center">
                            {/* Bubble */}
                            <div className="absolute bottom-full mb-1.5 sm:mb-2.5 flex flex-col items-center">
                                <div className="bg-white text-gray-950 rounded-lg sm:rounded-xl px-1.5 py-0.5 sm:px-3 sm:py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-1 sm:gap-2 border border-slate-100/80">
                                    <img
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                                        className="w-4 h-4 sm:w-6 sm:h-6 rounded-full object-cover border border-slate-200"
                                        alt="Learner"
                                    />
                                    <span className="text-[9px] sm:text-[12px] font-bold text-gray-900 whitespace-nowrap">
                                        7,990 <span className="font-medium text-slate-500 text-[8px] sm:text-[11px]">Learners</span>
                                    </span>
                                </div>
                                {/* Speech Bubble Arrow */}
                                <div className="w-1.5 h-1.5 bg-white transform rotate-45 -mt-1 sm:-mt-1.5 shadow-[3px_3px_5px_rgba(0,0,0,0.03)] border-r border-b border-slate-100/80" />
                            </div>
                            {/* Pinging Dot */}
                            <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-red-500"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ticker Section under the map - Full screen bleed */}
            <section className="w-full bg-[#f9fafb] overflow-hidden pt-0 pb-8 relative select-none">
                <style>{`
                    @keyframes scroll-left {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes scroll-right {
                        0% { transform: translateX(-50%); }
                        100% { transform: translateX(0); }
                    }
                    .animate-scroll-left {
                        display: flex;
                        width: max-content;
                        animation: scroll-left 80s linear infinite;
                    }
                    .animate-scroll-right {
                        display: flex;
                        width: max-content;
                        animation: scroll-right 80s linear infinite;
                    }
                `}</style>

                {/* Slanted Container */}
                <div className="transform -rotate-[2.5deg] scale-105 w-full bg-white py-3.5 sm:py-6 shadow-sm border-t border-b border-slate-100/80 flex flex-col gap-3.5 sm:gap-4">
                    {/* Row 1: Left to Right scrolling */}
                    <div className="w-full overflow-hidden flex">
                        <div className="animate-scroll-right flex items-center whitespace-nowrap gap-8">
                            {tickerItems.map((text, idx) => (
                                <span key={idx} className="text-xs sm:text-xl md:text-2xl font-bold sm:font-black text-gray-900 flex items-center gap-2 sm:gap-3">
                                    {text} <span className="text-red-500 font-extrabold text-xs sm:text-2xl md:text-3xl">↗</span>
                                </span>
                            ))}
                            {/* Duplicate for loop */}
                            {tickerItems.map((text, idx) => (
                                <span key={`dup-${idx}`} className="text-xs sm:text-xl md:text-2xl font-bold sm:font-black text-gray-900 flex items-center gap-2 sm:gap-3">
                                    {text} <span className="text-red-500 font-extrabold text-xs sm:text-2xl md:text-3xl">↗</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Row 2: Right to Left scrolling */}
                    <div className="w-full overflow-hidden flex">
                        <div className="animate-scroll-left flex items-center whitespace-nowrap gap-8">
                            {tickerItems.map((text, idx) => (
                                <span key={idx} className="text-xs sm:text-xl md:text-2xl font-bold sm:font-black text-gray-900 flex items-center gap-2 sm:gap-3">
                                    {text} <span className="text-red-500 font-extrabold text-xs sm:text-2xl md:text-3xl">↗</span>
                                </span>
                            ))}
                            {/* Duplicate for loop */}
                            {tickerItems.map((text, idx) => (
                                <span key={`dup-${idx}`} className="text-xs sm:text-xl md:text-2xl font-bold sm:font-black text-gray-900 flex items-center gap-2 sm:gap-3">
                                    {text} <span className="text-red-500 font-extrabold text-xs sm:text-2xl md:text-3xl">↗</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

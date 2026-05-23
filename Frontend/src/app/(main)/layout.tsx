import React from 'react';
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
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

            <main className="flex-1 flex flex-col">
                {children}
            </main>
            
            <Footer />
        </div>
    );
}

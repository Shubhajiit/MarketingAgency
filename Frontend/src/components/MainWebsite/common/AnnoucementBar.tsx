"use client";

import React from 'react';
import { usePublicWorkshops } from '@/lib/hooks/useWorkshops';
import Link from 'next/link';

export default function AnnoucementBar() {
    const { data: workshopsData, isLoading } = usePublicWorkshops();
    const workshops = workshopsData?.data?.workshops || [];
    const activeWorkshops = workshops.filter((w: any) => w.isActive && !w.isCancelled);

    if (isLoading) {
        return (
            <div className="bg-blue-100/90 border-b border-blue-200 px-4 py-2.5 md:py-3.5 flex items-center justify-center min-h-[40px]">
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 text-center">
                    <p className="text-[11px] sm:text-xs md:text-[16px] font-bold tracking-tight text-[#001A5A] leading-tight animate-pulse">
                        Checking for upcoming workshops...
                    </p>
                </div>
            </div>
        );
    }

    if (activeWorkshops.length > 0) {
        return (
            <div className="relative w-full overflow-hidden flex items-center bg-blue-100/90 border-b border-blue-200 py-2 md:py-3">
                <style>{`
                    @keyframes marquee {
                        0% { transform: translate3d(0, 0, 0); }
                        100% { transform: translate3d(-50%, 0, 0); }
                    }
                    .animate-marquee-custom {
                        display: inline-flex;
                        white-space: nowrap;
                        animation: marquee 30s linear infinite;
                    }
                    .animate-marquee-custom:hover {
                        animation-play-state: paused;
                    }
                `}</style>
                
                <div className="flex animate-marquee-custom gap-16 md:gap-32">
                    {/* First set */}
                    <div className="flex flex-row items-center gap-2 sm:gap-3">
                        <span className="text-[11px] sm:text-xs md:text-[16px] font-bold tracking-tight text-[#001A5A] leading-tight shrink-0">
                            Upcoming Workshops:
                        </span>
                        {activeWorkshops.map((w: any, index: number) => {
                            const url = w.type === 'three-days' 
                                ? `/three-days-workshops/${w.slug}` 
                                : `/one-day-workshop/${w.slug}`;
                            return (
                                <React.Fragment key={`${w._id}-first`}>
                                    {index > 0 && (
                                        <span className="text-blue-300 text-[11px] sm:text-xs md:text-[16px] font-bold px-0.5">
                                            |
                                        </span>
                                    )}
                                    <Link 
                                        href={url} 
                                        className="underline text-blue-700 hover:text-blue-900 transition-colors text-[11px] sm:text-xs md:text-[16px] font-bold whitespace-nowrap"
                                    >
                                        {w.title} ({w.type === 'three-days' ? '3-Days' : '1-Day'})
                                    </Link>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Second set (duplicate for seamless looping) */}
                    <div className="flex flex-row items-center gap-2 sm:gap-3" aria-hidden="true">
                        <span className="text-[11px] sm:text-xs md:text-[16px] font-bold tracking-tight text-[#001A5A] leading-tight shrink-0">
                            Upcoming Workshops:
                        </span>
                        {activeWorkshops.map((w: any, index: number) => {
                            const url = w.type === 'three-days' 
                                ? `/three-days-workshops/${w.slug}` 
                                : `/one-day-workshop/${w.slug}`;
                            return (
                                <React.Fragment key={`${w._id}-second`}>
                                    {index > 0 && (
                                        <span className="text-blue-300 text-[11px] sm:text-xs md:text-[16px] font-bold px-0.5">
                                            |
                                        </span>
                                    )}
                                    <Link 
                                        href={url} 
                                        className="underline text-blue-700 hover:text-blue-900 transition-colors text-[11px] sm:text-xs md:text-[16px] font-bold whitespace-nowrap"
                                    >
                                        {w.title} ({w.type === 'three-days' ? '3-Days' : '1-Day'})
                                    </Link>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden flex items-center bg-blue-100/90 border-b border-blue-200 py-2.5 md:py-3.5">
            <style>{`
                @keyframes marquee-fallback {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
                .animate-marquee-fallback {
                    display: inline-flex;
                    white-space: nowrap;
                    animation: marquee-fallback 25s linear infinite;
                }
                .animate-marquee-fallback:hover {
                    animation-play-state: paused;
                }
            `}</style>
            
            <div className="flex animate-marquee-fallback gap-16 md:gap-32">
                <p className="text-[11px] sm:text-xs md:text-[16px] font-bold tracking-tight text-[#001A5A] leading-tight md:leading-none whitespace-nowrap">
                    Sale On | Get Up To 30% OFF | 2 days left | Next Enrollment May 27th | <Link href="/courses" className="underline text-blue-700 hover:text-blue-900 transition-colors">View Courses</Link>
                </p>
                <p className="text-[11px] sm:text-xs md:text-[16px] font-bold tracking-tight text-[#001A5A] leading-tight md:leading-none whitespace-nowrap" aria-hidden="true">
                    Sale On | Get Up To 30% OFF | 2 days left | Next Enrollment May 27th | <Link href="/courses" className="underline text-blue-700 hover:text-blue-900 transition-colors">View Courses</Link>
                </p>
            </div>
        </div>
    );
}

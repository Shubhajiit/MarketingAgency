"use client";

import React from 'react';
import { usePublicWorkshops } from '@/lib/hooks/useWorkshops';
import Link from 'next/link';

export default function AnnoucementBar() {
    const { data: workshopsData, isLoading } = usePublicWorkshops();
    const workshops = workshopsData?.data?.workshops || [];
    const activeWorkshops = workshops.filter((w: any) => w.isActive && !w.isCancelled);

    const firstOneDay = activeWorkshops.find((w: any) => w.type !== 'three-days');
    const firstThreeDays = activeWorkshops.find((w: any) => w.type === 'three-days');

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
            <div className="bg-blue-100/90 border-b border-blue-200 px-4 py-2.5 md:py-3.5 flex items-center justify-center">
                <div className="mx-auto flex max-w-7xl flex-row items-center justify-center gap-2 sm:gap-3 text-center flex-wrap">
                    <span className="text-[11px] sm:text-xs md:text-[16px] font-bold tracking-tight text-[#001A5A] leading-tight">
                        Upcoming Workshops:
                    </span>
                    
                    {/* Mobile View: Inline short links */}
                    <div className="flex sm:hidden flex-row gap-1 justify-center items-center divide-x divide-blue-300">
                        {firstOneDay && (
                            <Link 
                                href={`/one-day-workshop/${firstOneDay.slug}`} 
                                className="underline text-blue-700 hover:text-blue-900 transition-colors text-[11px] font-bold px-1.5"
                            >
                                1-Day Workshop
                            </Link>
                        )}
                        {firstThreeDays && (
                            <Link 
                                href={`/three-days-workshops/${firstThreeDays.slug}`} 
                                className="underline text-blue-700 hover:text-blue-900 transition-colors text-[11px] font-bold px-1.5"
                            >
                                3-Days Workshop
                            </Link>
                        )}
                    </div>

                    {/* Desktop/Tablet View: Full titles */}
                    <div className="hidden sm:flex flex-wrap gap-2.5 sm:gap-4 justify-center items-center">
                        {activeWorkshops.map((w: any) => {
                            const url = w.type === 'three-days' 
                                ? `/three-days-workshops/${w.slug}` 
                                : `/one-day-workshop/${w.slug}`;
                            return (
                                <Link 
                                    key={w._id} 
                                    href={url} 
                                    className="underline text-blue-700 hover:text-blue-900 transition-colors text-xs md:text-[16px] font-bold"
                                >
                                    {w.title} ({w.type === 'three-days' ? '3-Days' : '1-Day'})
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-100/90 border-b border-blue-200 px-4 py-2.5 md:py-3.5 flex items-center justify-center">
            <div className="mx-auto flex max-w-7xl flex-row items-center justify-center gap-2.5 sm:gap-3 md:gap-6 text-center flex-wrap">
                <p className="text-[11px] sm:text-xs md:text-[16px] font-bold tracking-tight text-[#001A5A] leading-tight md:leading-none">
                    Sale On | Get Up To 30% OFF | 2 days left | Next Enrollment May 27th | <Link href="/courses" className="underline text-blue-700 hover:text-blue-900 transition-colors">View Courses</Link>
                </p>
            </div>
        </div>
    );
}

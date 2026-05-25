import React from 'react';

export default function AnnoucementBar() {
    return (
        <div className="bg-[#B6FF00] px-4 py-2.5 md:py-3.5 flex items-center justify-center">
            <div className="mx-auto flex max-w-7xl flex-row items-center justify-center gap-2.5 sm:gap-3 md:gap-6 text-center flex-wrap">
                <p className="text-[11px] sm:text-xs md:text-[16px] font-bold tracking-tight text-[#001A5A] leading-tight md:leading-none">
                    Sale On | Get Up To 30% OFF | 2 days left | Next Enrollment May 27th
                </p>
                <a
                    href="/courses"
                    className="inline-flex items-center justify-center rounded border border-[#001A5A] px-2.5 py-1 text-[10px] md:text-[13px] md:px-4 md:py-1.5 font-bold text-[#001A5A] transition-all hover:bg-[#001A5A] hover:text-white shrink-0 active:scale-95"
                >
                    View Courses
                </a>
            </div>
        </div>
    );
}

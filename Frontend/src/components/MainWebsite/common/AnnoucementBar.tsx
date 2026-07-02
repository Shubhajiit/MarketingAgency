import React from 'react';

export default function AnnoucementBar() {
    return (
        <div className="bg-blue-100/90 border-b border-blue-200 px-4 py-2.5 md:py-3.5 flex items-center justify-center">
            <div className="mx-auto flex max-w-7xl flex-row items-center justify-center gap-2.5 sm:gap-3 md:gap-6 text-center flex-wrap">
                <p className="text-[11px] sm:text-xs md:text-[16px] font-bold tracking-tight text-[#001A5A] leading-tight md:leading-none">
                    Sale On | Get Up To 30% OFF | 2 days left | Next Enrollment May 27th | <a href="/courses" className="underline text-blue-700 hover:text-blue-900 transition-colors">View Courses</a>
                </p>
            </div>
        </div>
    );
}

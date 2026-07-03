"use client";

import React from 'react';
import Link from 'next/link';

export default function AnnoucementBar() {
    const handleOpenQueryForm = () => {
        window.dispatchEvent(new CustomEvent("openQueryForm"));
    };

    return (
        <div className="bg-blue-100/90 border-b border-blue-200 px-4 py-2.5 flex items-center justify-center min-h-[40px] text-center w-full select-none">
            <p className="text-[11px] sm:text-xs md:text-[15px] font-bold tracking-tight text-[#001A5A] leading-tight flex items-center flex-wrap justify-center gap-1">
                <span>Join Us - </span>
                <button 
                    onClick={handleOpenQueryForm}
                    className="underline text-blue-700 hover:text-blue-900 transition-colors font-extrabold cursor-pointer border-0 bg-transparent p-0 m-0 inline"
                >
                    Click Here
                </button>
                <span className="text-blue-300 mx-2">|</span>
                <span>Enroll our courses at minimal price</span>
                <span className="text-blue-300 mx-2">|</span>
                <Link 
                    href="/courses"
                    className="underline text-blue-700 hover:text-blue-900 transition-colors font-extrabold"
                >
                    All Courses
                </Link>
            </p>
        </div>
    );
}

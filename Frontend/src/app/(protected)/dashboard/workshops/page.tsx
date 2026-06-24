"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { userApi } from '@/lib/api/user';
import { useAuthStore } from '@/store/auth.store';

export default function WorkshopsPage() {
  const { user, checkAuth } = useAuth();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (checkAuth) {
      checkAuth(true);
    }
  }, [checkAuth]);

  const handleRemoveWorkshop = async (workshopId: string) => {
    if (!window.confirm("Are you sure you want to remove this cancelled workshop from your dashboard?")) {
      return;
    }
    setIsRemoving(workshopId);
    try {
      const res = await userApi.removeWorkshop(workshopId);
      if (res.success && res.data?.user) {
        useAuthStore.getState().setAuth(res.data.user);
      }
    } catch (error) {
      console.error("Error removing workshop:", error);
      alert("Failed to remove workshop. Please try again.");
    } finally {
      setIsRemoving(null);
    }
  };

  const enrolledWorkshops = (user?.enrolledWorkshops || []).filter(
    (w: any) => w && typeof w === 'object' && w.title
  );

  if (enrolledWorkshops.length > 0) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 font-sans pt-6">
        {/* Title */}
        <div className="border-b border-slate-200 pb-4 w-full">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Enrolled Workshops
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Access your registered interactive learning sessions
          </p>
        </div>

        {/* Workshop Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {enrolledWorkshops.map((workshop: any) => {
            const isThreeDays = workshop.type === 'three-days';
            const href = isThreeDays
              ? `/three-days-workshops/${workshop.slug}`
              : `/one-day-workshop/${workshop.slug}`;

            return (
              <div
                key={workshop._id || workshop.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative"
              >
                {/* Cross Button to Remove Workshop if Cancelled */}
                {workshop.isCancelled && (
                  <button
                    onClick={() => handleRemoveWorkshop(workshop._id || workshop.id)}
                    disabled={isRemoving === (workshop._id || workshop.id)}
                    className="absolute top-2.5 right-2.5 z-20 bg-slate-900/85 hover:bg-rose-600 disabled:bg-slate-400 text-white p-1.5 rounded-full shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer border border-white/20"
                    title="Remove from Dashboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Thumbnail */}
                <div className="aspect-[16/9] w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={workshop.thumbnail || "https://res.cloudinary.com/dppgindsc/image/upload/v1780774475/workshops/lqcuatyi3elxhrqbtkdn.png"}
                    alt={workshop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {workshop.isCancelled ? (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                      Cancelled
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-indigo-600 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                      {isThreeDays ? '3-Day' : '1-Day'}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: workshop.title }}
                    />
                    
                    {workshop.isCancelled ? (
                      <div className="mt-2 mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-700 leading-relaxed font-medium">
                        <div className="flex items-center gap-1.5 font-bold text-rose-800 mb-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Workshop Cancelled
                        </div>
                        A full refund has been automatically initiated. The refund amount will be credited back to your original payment method within the next 7 days.
                      </div>
                    ) : (
                      <>
                        {workshop.subtitle && (
                          <div 
                            className="text-xs text-slate-500 mb-4 overflow-y-auto pr-1"
                            style={{
                              height: '2.8rem',
                              scrollbarWidth: 'thin',
                            }}
                          >
                            {workshop.subtitle}
                          </div>
                        )}
                        {workshop.instructor && (
                          <div className="flex items-center gap-2 mb-4">
                            {workshop.instructorImage ? (
                              <img
                                src={workshop.instructorImage}
                                alt={workshop.instructor}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                                {workshop.instructor.charAt(0)}
                              </div>
                            )}
                            <span className="text-xs text-slate-700 font-semibold">
                              {workshop.instructor}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {workshop.isCancelled ? (
                    <div className="w-full text-center py-2.5 px-4 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg border border-slate-200 mt-auto">
                      Session Cancelled
                    </div>
                  ) : (
                    <Link
                      href={href}
                      className="w-full text-center py-2.5 px-4 bg-[#1b2a60] hover:bg-[#15204a] text-white text-xs font-bold rounded-lg shadow-sm transition-colors mt-auto inline-block"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }


  // Existing/Empty state
  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4 select-none">
      {/* Lamp SVG Illustration */}
      <svg viewBox="0 0 400 300" className="w-72 h-56 mx-auto mb-6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Light beam gradient */}
          <linearGradient id="beam-gradient" x1="185" y1="122" x2="160" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eef2ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#eef2ff" stopOpacity="0.15" />
          </linearGradient>
          
          {/* Sparkle template */}
          <g id="sparkle-star">
            <path d="M 0,-8 Q 0,0 8,0 Q 0,0 0,8 Q 0,0 -8,0 Q 0,0 0,-8 Z" fill="#1b2a60" />
          </g>
          
          <g id="sparkle-star-light">
            <path d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z" fill="#93c5fd" />
          </g>
        </defs>

        {/* Light Beam */}
        <polygon points="183,121 208,134 235,240 115,240" fill="url(#beam-gradient)" />

        {/* Sparkles inside beam */}
        <use href="#sparkle-star" x="175" y="195" transform="scale(1.2)" />
        <use href="#sparkle-star-light" x="145" y="160" />
        <use href="#sparkle-star-light" x="200" y="220" />

        {/* Background Sparkles */}
        <use href="#sparkle-star-light" x="150" y="90" transform="scale(0.8)" />
        <use href="#sparkle-star-light" x="180" y="100" />
        <use href="#sparkle-star-light" x="260" y="90" transform="scale(0.8)" />
        <use href="#sparkle-star-light" x="140" y="235" transform="scale(0.5)" />
        
        {/* Tiny dots */}
        <circle cx="160" cy="115" r="1.2" fill="#1b2a60" />
        <circle cx="240" cy="120" r="1.2" fill="#1b2a60" />
        <circle cx="130" cy="180" r="1.2" fill="#1b2a60" />
        <circle cx="215" cy="170" r="1.5" fill="#93c5fd" />

        {/* Desk Base/Box */}
        <rect x="235" y="195" width="55" height="45" rx="3" fill="white" stroke="#1b2a60" strokeWidth="2.5" />
        <circle cx="270" cy="208" r="3.5" fill="#1b2a60" />
        <line x1="258" y1="222" x2="268" y2="220" stroke="#1b2a60" strokeWidth="2.5" strokeLinecap="round" />

        {/* Lamp Base Clamp */}
        <path d="M 245,195 L 280,195" stroke="#1b2a60" strokeWidth="3" strokeLinecap="round" />
        
        {/* Joints & Arms */}
        <circle cx="272" cy="195" r="5" fill="white" stroke="#1b2a60" strokeWidth="2.5" />
        <line x1="272" y1="195" x2="255" y2="135" stroke="#1b2a60" strokeWidth="2.5" />
        <circle cx="255" cy="135" r="5" fill="white" stroke="#1b2a60" strokeWidth="2.5" />
        <circle cx="255" cy="135" r="1.5" fill="#1b2a60" />

        {/* Upper Arm */}
        <line x1="255" y1="135" x2="212" y2="102" stroke="#1b2a60" strokeWidth="2.5" />
        <line x1="260" y1="137" x2="217" y2="104" stroke="#1b2a60" strokeWidth="1.5" />

        {/* Head Joint */}
        <circle cx="212" cy="102" r="4" fill="white" stroke="#1b2a60" strokeWidth="2.5" />

        {/* Lamp Shade */}
        <path d="M 212,102 L 222,108 L 210,135 L 185,122 L 202,105 Z" fill="white" stroke="#1b2a60" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="224" cy="109" r="2" fill="#1b2a60" />
      </svg>

      {/* Supporting Text */}
      <h2 className="text-lg font-bold text-slate-900 leading-snug mb-8 max-w-sm px-4">
        It's a good time to explore all the workshops in store for you
      </h2>

      {/* Explore Button */}
      <Link
        href="/"
        className="w-full max-w-xs py-3 px-6 bg-[#1b2a60] text-white text-sm font-semibold rounded-md shadow-sm hover:bg-[#15204a] transition-colors inline-block"
      >
        Explore workshops
      </Link>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { workshopApi, Workshop } from '@/lib/api/workshops';
import { useAuthStore } from '@/store/auth.store';

export default function UpcomingWorkshopsPage() {
  const { user, checkAuth } = useAuth();
  const [allWorkshops, setAllWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (checkAuth) {
      checkAuth(true);
    }
    fetchWorkshops();
  }, [checkAuth]);

  const fetchWorkshops = async () => {
    try {
      const response = await workshopApi.listPublic({ limit: 100 });
      if (response.success) {
        setAllWorkshops(response.data.workshops);
      }
    } catch (error) {
      console.error("Error fetching workshops:", error);
    } finally {
      setLoading(null as any);
      setLoading(false);
    }
  };

  const enrolledWorkshopIds = new Set(
    (user?.enrolledWorkshops || []).map((w: any) => w._id || w.id)
  );

  const upcomingWorkshops = allWorkshops.filter(
    (w) => !enrolledWorkshopIds.has(w._id) && w.isActive && !w.isCancelled
  );

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 font-sans pt-6 animate-pulse">
        {/* Title Skeleton */}
        <div className="border-b border-slate-200 pb-4 w-full">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-80 bg-slate-200 rounded mt-2" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px]"
            >
              {/* Thumbnail Skeleton */}
              <div className="aspect-[16/9] w-full bg-slate-200" />
              
              {/* Content Skeleton */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Title */}
                  <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-5/6" />
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                  </div>
                  {/* Subtitle */}
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-4/5" />
                  </div>
                  {/* Instructor */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200" />
                    <div className="h-3 bg-slate-200 rounded w-20" />
                  </div>
                </div>

                {/* Button */}
                <div className="mt-6">
                  <div className="w-full bg-slate-200 h-10 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 font-sans pt-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 w-full">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Upcoming Workshops
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore and register for our latest interactive learning sessions
        </p>
      </div>

      {upcomingWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-0">
          {upcomingWorkshops.map((workshop) => {
            const isThreeDays = workshop.type === 'three-days';
            const href = isThreeDays
              ? `/three-days-workshops/${workshop.slug}`
              : `/one-day-workshop/${workshop.slug}`;

            return (
              <div
                key={workshop._id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/9] w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={workshop.thumbnail || "https://res.cloudinary.com/dppgindsc/image/upload/v1780774475/workshops/lqcuatyi3elxhrqbtkdn.png"}
                    alt={workshop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white font-semibold sm:font-bold text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm">
                    {isThreeDays ? '3-Day' : '1-Day'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold sm:font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {workshop.title}
                    </h3>
                    <div 
                      className="text-slate-500 text-[11px] sm:text-xs mt-2 overflow-y-auto pr-1"
                      style={{
                        height: '2.8rem',
                        scrollbarWidth: 'thin',
                      }}
                    >
                      {workshop.subtitle}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      {workshop.instructorImage && (
                        <img
                          src={workshop.instructorImage}
                          alt={workshop.instructor}
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-slate-200"
                        />
                      )}
                      <span className="text-xs font-medium sm:font-semibold text-slate-700">
                        {workshop.instructor}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={href}
                      className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium sm:font-bold py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-sm"
                    >
                      View Details & Register
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 4v4h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No new workshops available</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
            You are currently registered for all our active workshops. Stay tuned for new announcements!
          </p>
          <Link
            href="/dashboard/workshops"
            className="inline-block mt-6 text-indigo-600 font-bold text-sm hover:underline"
          >
            Go to My Workshops &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

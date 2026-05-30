'use client';

import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 font-sans pt-6 animate-pulse">
      {/* Navigation Tabs Skeleton */}
      <div className="flex border-b border-slate-200 w-full">
        <div className="h-10 w-32 bg-slate-200 border-b-2 border-transparent -mb-[1px] mx-4" />
        <div className="h-10 w-32 bg-slate-200 border-b-2 border-transparent -mb-[1px] mx-4" />
      </div>

      {/* Search Input Bar Skeleton */}
      <div className="w-full h-11 bg-slate-200 rounded-lg" />

      {/* Course Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white border border-slate-100 rounded-none flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden w-full h-[330px]"
          >
            {/* Card Image Area Skeleton */}
            <div className="h-[155px] w-full bg-slate-200 shrink-0" />

            {/* Card Content Skeleton */}
            <div className="p-4 flex flex-col flex-1 justify-between bg-white space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>

              <div className="space-y-3">
                {/* Thin progress bar skeleton */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full" />
                
                <div className="space-y-1">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Users2 } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 select-none">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100/50 shadow-sm">
          <Users2 className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
        Community
      </h2>
      <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
        We're working hard to bring community features to you. Stay tuned!
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-[11px] font-semibold text-emerald-700 tracking-wider uppercase">Coming Soon</span>
      </div>
    </div>
  );
}

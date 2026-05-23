'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Sidebar from '@/components/AdminDashboardComponent/common/Sidebar';
import {
  Search,
  SlidersHorizontal,
  Bell,
  MessageSquare,
  Settings
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginRoute = pathname === '/admin';

  useEffect(() => {
    if (!isLoading) {
      if (isLoginRoute) {
        if (isAuthenticated && user?.role === 'admin') {
          router.replace('/admin/dashboard');
        } else if (isAuthenticated && user?.role !== 'admin') {
          router.replace('/dashboard');
        }
      } else {
        if (!isAuthenticated) {
          router.replace('/admin');
        } else if (user?.role !== 'admin') {
          router.replace('/dashboard');
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router, isLoginRoute]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
        <svg className="animate-spin w-8 h-8 text-[#6366f1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex text-[#1f2937]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 ml-68 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <header className="bg-white border-b border-[#e9ebf0] h-18 px-8 flex items-center justify-between sticky top-0 z-20">
          {/* Search bar */}
          <div className="relative w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-10 py-2.5 bg-[#f8f9fe] border border-transparent rounded-full text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#efeefc] focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[#6366f1] cursor-pointer transition-colors">
              <SlidersHorizontal size={16} />
            </span>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button className="w-10 h-10 rounded-full border border-[#e9ebf0] flex items-center justify-center text-gray-500 hover:text-[#6366f1] hover:bg-gray-50 transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  2
                </span>
              </button>
            </div>

            {/* Chat Messages */}
            <button className="w-10 h-10 rounded-full border border-[#e9ebf0] flex items-center justify-center text-gray-500 hover:text-[#6366f1] hover:bg-gray-50 transition-colors">
              <MessageSquare size={18} />
            </button>

            {/* Settings */}
            <button className="w-10 h-10 rounded-full border border-[#e9ebf0] bg-[#efeefc]/40 flex items-center justify-center text-[#5e35b1] hover:text-[#6366f1] hover:bg-gray-50 transition-colors">
              <Settings size={18} className="animate-spin-slow" />
            </button>

            <div className="w-px h-8 bg-gray-200 mx-1"></div>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] border-2 border-[#e2e0fb] overflow-hidden flex items-center justify-center text-white font-bold shadow-sm shadow-[#6366f1]/10 cursor-pointer">
              {user?.name ? user.name.charAt(0) : 'N'}
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 bg-gradient-to-b from-[#f8f9fe] via-[#f5f7fe] to-[#f8f9fe] px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

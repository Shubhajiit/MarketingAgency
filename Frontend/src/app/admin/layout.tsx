'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Sidebar from '@/components/AdminDashboardComponent/common/Sidebar';
import {
  Search,
  SlidersHorizontal,
  Bell,
  MessageSquare,
  Settings,
  Menu
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (user?.role !== 'admin') {
        router.replace('/dashboard');
      }
    }
  }, [mounted, isLoading, isAuthenticated, user, router, pathname]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Redirecting state when not authenticated/authorized
  if (mounted && !isLoading && (!isAuthenticated || user?.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
        <svg className="animate-spin w-8 h-8 text-[#6366f1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const renderContent = () => {
    if (!mounted || isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <svg className="animate-spin w-8 h-8 text-[#6366f1]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      );
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex text-[#1f2937] overflow-x-hidden relative">
      {/* Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Panel */}
      <div className="flex-1 lg:ml-68 flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Sticky Header */}
        <header className="bg-white border-b border-[#e9ebf0] h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:text-[#6366f1] hover:bg-gray-50 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Search bar */}
            <div className="relative w-full max-w-[160px] sm:max-w-xs md:max-w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-9 pr-9 py-2 bg-[#f8f9fe] border border-transparent rounded-full text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#efeefc] focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-[#6366f1] cursor-pointer transition-colors">
                <SlidersHorizontal size={15} />
              </span>
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-2 sm:gap-4 ml-4 shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#e9ebf0] flex items-center justify-center text-gray-500 hover:text-[#6366f1] hover:bg-gray-50 transition-colors relative">
                <Bell size={16} />
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  2
                </span>
              </button>
            </div>

            {/* Chat Messages */}
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#e9ebf0] flex items-center justify-center text-gray-500 hover:text-[#6366f1] hover:bg-gray-50 transition-colors">
              <MessageSquare size={16} />
            </button>

            {/* Settings */}
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#e9ebf0] bg-[#efeefc]/40 flex items-center justify-center text-[#5e35b1] hover:text-[#6366f1] hover:bg-gray-50 transition-colors">
              <Settings size={16} className="animate-spin-slow" />
            </button>

            <div className="w-px h-6 sm:h-8 bg-gray-200 mx-0.5 sm:mx-1"></div>

            {/* Profile Avatar */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] border-2 border-[#e2e0fb] overflow-hidden flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-[#6366f1]/10 cursor-pointer">
              {user?.name ? user.name.charAt(0) : 'N'}
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 bg-gradient-to-b from-[#f8f9fe] via-[#f5f7fe] to-[#f8f9fe] px-4 py-6 sm:p-6 lg:p-8 flex flex-col">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

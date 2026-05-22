'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Video,
  Award,
  MessageSquare,
  CreditCard,
  FileText,
  Lock,
  Settings,
  HelpCircle,
  Search,
  SlidersHorizontal,
  Bell,
  LogOut,
  X,
  ExternalLink
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showPromo, setShowPromo] = useState(true);

  const isLoginRoute = pathname === '/admin';

  useEffect(() => {
    if (!isLoading) {
      if (isLoginRoute) {
        if (isAuthenticated && user?.role === 'admin') {
          router.push('/admin/stats');
        } else if (isAuthenticated && user?.role !== 'admin') {
          router.push('/dashboard');
        }
      } else {
        if (!isAuthenticated) {
          router.push('/admin');
        } else if (user?.role !== 'admin') {
          router.push('/dashboard');
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

  // Visual helper to determine active status
  const isActive = (route: string) => pathname === route;

  // Active styles for menu items
  const activeClass = "flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 bg-[#efeefc] text-[#5e35b1]";
  const inactiveClass = "flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-[#5f6368] hover:text-[#5e35b1] hover:bg-[#efeefc]/40 transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex text-[#1f2937]">
      {/* Sidebar */}
      <aside className="w-68 bg-white border-r border-[#e9ebf0] flex flex-col fixed h-full z-30 transition-all duration-300">
        {/* Logo */}
        <div className="px-6 py-6 flex items-center justify-between border-b border-[#f4f5f8]">
          <Link href="/admin/stats" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white shadow-md shadow-[#6366f1]/20">
              <GraduationCap size={18} className="transform -rotate-12" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#111827] mulish-logo-text">
              U<span className="text-[#6366f1]">Study</span>
            </span>
          </Link>
          <button className="text-gray-400 hover:text-gray-600 lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6 no-scrollbar">
          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Menu</p>
            <nav className="space-y-1">
              <Link href="/admin/stats" className={isActive('/admin/stats') ? activeClass : inactiveClass}>
                <LayoutDashboard size={18} />
                <span>Dashboards</span>
              </Link>
              <button disabled className="w-full text-left cursor-not-allowed opacity-60 flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-[#5f6368]">
                <Users size={18} />
                <span>Teachers</span>
              </button>
              <Link href="/admin/users" className={isActive('/admin/users') ? activeClass : inactiveClass}>
                <Users size={18} />
                <span>Students</span>
              </Link>
              <Link href="/admin/workshops" className={isActive('/admin/workshops') ? activeClass : inactiveClass}>
                <BookOpen size={18} />
                <span>Course</span>
              </Link>
              <Link href="/admin/videos" className={isActive('/admin/videos') ? activeClass : inactiveClass}>
                <Video size={18} />
                <span>Resource</span>
              </Link>
              <button disabled className="w-full text-left cursor-not-allowed opacity-60 flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-[#5f6368]">
                <Award size={18} />
                <span>Certificate</span>
              </button>
              <button disabled className="w-full text-left cursor-not-allowed opacity-60 flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-[#5f6368]">
                <MessageSquare size={18} />
                <span>Chat</span>
              </button>
              <button disabled className="w-full text-left cursor-not-allowed opacity-60 flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-[#5f6368]">
                <CreditCard size={18} />
                <span>Transaction</span>
              </button>
              <button disabled className="w-full text-left cursor-not-allowed opacity-60 flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-[#5f6368]">
                <FileText size={18} />
                <span>App Pages</span>
              </button>
              <button disabled className="w-full text-left cursor-not-allowed opacity-60 flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-[#5f6368]">
                <Lock size={18} />
                <span>Authentication</span>
              </button>
            </nav>
          </div>

          <div>
            <p className="px-3 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Help</p>
            <nav className="space-y-1">
              <button disabled className="w-full text-left cursor-not-allowed opacity-60 flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-[#5f6368]">
                <Settings size={18} />
                <span>Setting</span>
              </button>
              <button disabled className="w-full text-left cursor-not-allowed opacity-60 flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-[#5f6368]">
                <HelpCircle size={18} />
                <span>Support</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-[#f4f5f8] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold shadow-sm shadow-[#6366f1]/20">
                {user?.name ? user.name.charAt(0) : 'N'}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#111827] leading-none">
                {user?.name || 'Neurotic Spy'}
              </span>
              <span className="text-[10px] text-gray-500 mt-1 uppercase font-semibold tracking-wider">
                {user?.role || 'Administrator'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link 
              href={user?._id ? `/dashboard/${user._id}` : '/dashboard'} 
              title="Go to User Dashboard"
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#6366f1] hover:bg-gray-50 transition-all duration-200"
            >
              <ExternalLink size={16} />
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push('/admin');
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

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

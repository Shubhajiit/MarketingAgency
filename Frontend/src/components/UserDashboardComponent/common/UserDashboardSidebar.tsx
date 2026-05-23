'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { X } from 'lucide-react';

interface UserDashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function UserDashboardSidebar({ isOpen, onClose }: UserDashboardSidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardActive = pathname.startsWith('/dashboard');
  const isCoursesActive = pathname.startsWith('/my-courses');
  const isWorkshopsActive = pathname.startsWith('/workshops');

  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
  }, [pathname]);

  return (
    <aside className={`w-64 bg-[#0a192f] text-white flex flex-col fixed h-full z-30 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      {/* Logo */}
      <div className="px-6 py-6 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center">
          <img
            src="/Logo/Logo.png"
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 md:hidden rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Profile */}
      <div className="px-6 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-500 overflow-hidden relative">
            <svg className="w-10 h-10 text-gray-300 absolute -bottom-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">{user?.name || 'Marcelino Hwang'}</span>
            <span className="text-xs text-gray-400">{user?.email || 'heymercel@email.com'}</span>
          </div>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-8 no-scrollbar">
        {/* Main Menu */}
        <div className="px-4">
          <p className="px-2 text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Main Menu</p>
          <div className="space-y-1">
            <Link
              href={user?._id ? `/dashboard/${user._id}` : '/dashboard'}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                isDashboardActive
                  ? 'bg-[#2db39b] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              My Progress
            </Link>
            <Link
              href="/my-courses"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                isCoursesActive
                  ? 'bg-[#2db39b] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Explore Courses
            </Link>
            <Link
              href="/workshops"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                isWorkshopsActive
                  ? 'bg-[#2db39b] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Explore Workshops
            </Link>
          </div>
        </div>

        {/* Labels */}
        <div className="px-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Labels</p>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div className="space-y-1">
            <Link href="/my-courses?label=ui-design" className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors">
              <div className="w-2 h-2 rounded-full bg-[#009ee3]" />
              UI Design
            </Link>
            <Link href="/my-courses?label=ux-design" className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              UX Design
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors">
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          System Settings
        </Link>
        <Link href="/help" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors">
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Help Center
        </Link>
        <button
          onClick={async () => {
            await logout();
            router.push('/login');
          }}
          className="w-full flex items-center gap-3 px-4 py-2 mt-4 text-gray-300 hover:text-red-400 hover:bg-white/5 rounded-lg text-sm transition-colors"
        >
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout Account
        </button>
      </div>
    </aside>
  );
}

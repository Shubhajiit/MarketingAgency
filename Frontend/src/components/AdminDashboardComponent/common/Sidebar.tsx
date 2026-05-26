'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import {
  X,
  LayoutDashboard,
  Users,
  BookOpen,
  UserPlus,
  Settings,
  HelpCircle,
  ExternalLink,
  LogOut,
  Award
} from 'lucide-react';

export default function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    const Cookies = (await import('js-cookie')).default;
    Cookies.remove('refreshToken');
    clearAuth();
  };

  // Visual helper to determine active status
  const isActive = (route: string) => pathname === route;

  // Active styles for menu items
  const activeClass = "flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 bg-[#efeefc] text-[#5e35b1]";
  const inactiveClass = "flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-[#5f6368] hover:text-[#5e35b1] hover:bg-[#efeefc]/40 transition-all duration-200";

  return (
    <aside className="w-68 bg-white border-r border-[#e9ebf0] flex flex-col fixed h-full z-30 transition-all duration-300">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-[#f4f5f8]">
        <Link href="/admin/dashboard" className="flex items-center">
          <img
            src="/Logo/Logo.png"
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
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
            <Link href="/admin/dashboard" className={isActive('/admin/dashboard') ? activeClass : inactiveClass}>
              <LayoutDashboard size={18} />
              <span>Dashboards</span>
            </Link>
            <Link href="/admin/users" className={isActive('/admin/users') ? activeClass : inactiveClass}>
              <Users size={18} />
              <span>Students</span>
            </Link>
            <Link href="/admin/workshops" className={isActive('/admin/workshops') ? activeClass : inactiveClass}>
              <BookOpen size={18} />
              <span>Workshops</span>
            </Link>
            <Link href="/admin/courses" className={isActive('/admin/courses') ? activeClass : inactiveClass}>
              <Award size={18} />
              <span>Courses</span>
            </Link>
            <Link href="/admin/assign-course" className={isActive('/admin/assign-course') ? activeClass : inactiveClass}>
              <UserPlus size={18} />
              <span>Assign Course</span>
            </Link>
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
            href="/dashboard"
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
  );
}

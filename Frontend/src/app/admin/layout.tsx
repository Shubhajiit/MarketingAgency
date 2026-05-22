'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin w-8 h-8 text-[#009ee3]" fill="none" viewBox="0 0 24 24">
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-900 text-white px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link href="/admin/stats" className="text-xl font-bold text-[#009ee3] tracking-tight">
            AI Scale <span className="text-xs text-gray-400 font-normal ml-1">Admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-300">
            <Link href="/admin/stats" className="hover:text-white transition-colors">Stats</Link>
            <Link href="/admin/videos" className="hover:text-white transition-colors">Videos</Link>
            <Link href="/admin/workshops" className="hover:text-white transition-colors">Workshops</Link>
            <Link href="/admin/users" className="hover:text-white transition-colors">Users</Link>
            <Link href={user?._id ? `/dashboard/${user._id}` : '/dashboard'} className="hover:text-white transition-colors">User View</Link>
          </nav>
        </div>
        <button
          onClick={async () => {
            await logout();
            router.push('/admin');
          }}
          className="text-sm text-gray-400 hover:text-red-400 font-medium transition-colors"
        >
          Sign Out
        </button>
      </header>
      <main className="flex-1 px-4 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

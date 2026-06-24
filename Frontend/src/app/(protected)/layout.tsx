'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import UserDashboardHeader from '@/components/UserDashboardComponent/common/UserDashboardHeader';
import UserDashboardSidebar from '@/components/UserDashboardComponent/common/UserDashboardSidebar';
import MobileBottomNav from '@/components/UserDashboardComponent/common/MobileBottomNav';

import DashboardSkeleton from '@/components/UserDashboardComponent/common/DashboardSkeleton';
import CartDrawer from '@/components/MainWebsite/common/CartDrawer';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isPlayerPage = pathname?.startsWith('/dashboard/activecourses/');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  if (mounted && !isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-[#2db39b]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!mounted || isLoading) {
      if (isPlayerPage) {
        return (
          <div className="flex h-screen items-center justify-center bg-black text-white font-sans">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-slate-400 text-sm font-medium">Loading...</p>
            </div>
          </div>
        );
      }
      return <DashboardSkeleton />;
    }
    return children;
  };

  if (mounted && isPlayerPage) {
    return renderContent();
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans relative overflow-x-hidden">
      <UserDashboardSidebar />
      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 pl-0 flex flex-col min-h-screen min-w-0 transition-all duration-300">
        {/* Top Navigation - Global top header */}
        <UserDashboardHeader />

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-12 pt-0 md:pt-0 pb-20 md:pb-0 overflow-x-hidden flex flex-col">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(3px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in-up {
              animation: fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              overflow: clip;
            }
            /* Hide scrollbars from all dashboard elements */
            ::-webkit-scrollbar {
              display: none !important;
            }
            * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
          `}} />
          <div key={pathname} className="flex-1 flex flex-col animate-fade-in-up">
            {renderContent()}
          </div>
        </main>
      </div>
      <MobileBottomNav />
      <CartDrawer />
    </div>
  );
}


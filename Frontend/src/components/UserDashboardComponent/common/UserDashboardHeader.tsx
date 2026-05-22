'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

interface UserDashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function UserDashboardHeader({ onMenuClick }: UserDashboardHeaderProps) {
  const [searchVal, setSearchVal] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push('/courses');
    }
  };

  return (
    <header className="h-16 bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 border-b border-gray-100 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="block md:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <img
            src="/UserDashBoard/SidebarLogo/SidebarMenu.png"
            alt="Menu"
            className="w-6 h-6 object-contain"
          />
        </button>
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative hidden md:flex items-center">
          <img
            src="/UserDashBoard/HeaderLogo/Search.png"
            alt="Search"
            className="w-5 h-5 absolute left-4 pointer-events-none object-contain"
          />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search..."
            className="w-full pl-12 pr-10 py-2.5 bg-gray-50 border-0 outline-none rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#2db39b] focus:bg-white transition-colors"
          />
        </form>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative text-gray-400 hover:text-gray-600 transition-colors p-1">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="flex items-center gap-2 bg-[#2db39b] hover:bg-[#259b86] text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium text-sm transition-colors">
          <img
            src="/UserDashBoard/HeaderLogo/VideoPlay.png"
            alt="Play"
            className="w-4 h-4 object-contain"
          />
          <span className="hidden md:inline">See Tutorial</span>
        </button>
      </div>
    </header>
  );
}

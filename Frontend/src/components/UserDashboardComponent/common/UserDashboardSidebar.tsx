"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import {
	BookOpen,
	Video,
	Bookmark,
	Users2,
	ChevronDown,
	ChevronUp,
	Store,
	LogOut
} from 'lucide-react';

const libraryItems = [
	{ label: 'Courses', href: '/dashboard/activecourse' },
	{ label: 'Workshops', href: '/dashboard/workshops' }
];

const standaloneItems = [
	{ label: 'Bookmarks', href: '/dashboard/bookings', icon: Bookmark, hasDropdown: true },
	{ label: 'Community', href: '/dashboard/community', icon: Users2 }
];

export default function UserDashboardSidebar() {
	const pathname = usePathname();
	const { user, clearAuth } = useAuthStore();
	const logout = () => {
		import('js-cookie').then(({ default: Cookies }) => Cookies.remove('refreshToken'));
		clearAuth();
	};
	const [isLibraryOpen, setIsLibraryOpen] = useState(true);

	const isActive = (href: string) => pathname === href;
	const activeClass = 'flex items-center gap-3 px-4 py-2.5 rounded-xl font-normal text-sm bg-[#eef2ff] text-[#2d2f54]';
	const inactiveClass = 'flex items-center gap-3 px-4 py-2.5 rounded-xl font-normal text-sm text-[#5f6368] hover:bg-[#f6f7fb] hover:text-[#2d2f54] transition-colors';

	return (
		<aside className="hidden md:flex w-64 bg-white border-r border-[#eef0f4] flex-col fixed h-full z-30">
			<div className="px-6 py-5 flex items-center justify-between">
				<Link href="/dashboard" className="flex items-center gap-2">
					<img src="/Logo/Logo.png" alt="Logo" className="h-8 w-auto object-contain" />
				</Link>
			</div>

			<div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
				<div>
					<button
						onClick={() => setIsLibraryOpen(!isLibraryOpen)}
						className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-normal text-sm text-[#2d2f54] hover:bg-[#f6f7fb] transition-colors border-0 bg-transparent cursor-pointer"
					>
						<div className="w-5 h-5 flex items-center justify-center shrink-0">
							<BookOpen size={18} className="text-[#5f6368]" />
						</div>
						<span className="flex-1 text-left">Library</span>
						{isLibraryOpen ? (
							<ChevronUp size={16} className="text-[#9aa0a6] shrink-0" />
						) : (
							<ChevronDown size={16} className="text-[#9aa0a6] shrink-0" />
						)}
					</button>
					{isLibraryOpen && (
						<nav className="mt-1 space-y-1">
							{libraryItems.map((item) => {
								const activeClassSub = 'flex items-center pl-[48px] pr-4 py-2.5 rounded-xl font-normal text-sm bg-[#eef2ff] text-[#2d2f54]';
								const inactiveClassSub = 'flex items-center pl-[48px] pr-4 py-2.5 rounded-xl font-normal text-sm text-[#5f6368] hover:bg-[#f6f7fb] hover:text-[#2d2f54] transition-colors';
								return (
									<Link
										key={item.label}
										href={item.href}
										className={isActive(item.href) ? activeClassSub : inactiveClassSub}
									>
										<span>{item.label}</span>
									</Link>
								);
							})}
						</nav>
					)}
				</div>

				<nav className="space-y-1">
					{standaloneItems.map((item) => (
						<Link
							key={item.label}
							href={item.href}
							className={isActive(item.href) ? activeClass : inactiveClass}
						>
							<div className="w-5 h-5 flex items-center justify-center shrink-0">
								<item.icon size={18} />
							</div>
							<span className="flex-1">{item.label}</span>
							{item.hasDropdown && (
								<ChevronDown size={16} className="text-[#9aa0a6] shrink-0" />
							)}
						</Link>
					))}
				</nav>

				<div className="mt-auto">
					<Link
						href="/"
						className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fff7e8] text-[#c07a13] font-semibold text-sm"
					>
						<div className="w-5 h-5 flex items-center justify-center shrink-0">
							<Store size={18} />
						</div>
						<span>Visit Store</span>
					</Link>
				</div>
			</div>

			<div className="p-4 border-t border-[#f2f4f8] flex items-center justify-between">
				<div className="flex items-center gap-3 min-w-0">
					<div className="w-10 h-10 rounded-full bg-[#ff4d4f] flex items-center justify-center text-white font-semibold shrink-0">
						{user?.name ? user.name.charAt(0) : 'U'}
					</div>
					<div className="min-w-0">
						<p className="text-sm font-semibold text-[#111827] truncate">{user?.name || 'User'}</p>
						<p className="text-xs text-[#9aa0a6]">Student</p>
					</div>
				</div>
				<button
					onClick={() => logout()}
					className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
					title="Logout"
				>
					<LogOut size={20} />
				</button>
			</div>
		</aside>
	);
}

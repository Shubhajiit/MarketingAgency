"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import {
	BookOpen,
	Video,
	ChevronDown,
	ChevronUp,
	Store,
	LogOut,
	Settings,
	RefreshCw,
	Wallet,
	History,
	Bell,
	Calendar
} from 'lucide-react';

const libraryItems = [
	{ label: 'My Courses', href: '/dashboard/activecourse' },
	{ label: 'Workshops', href: '/dashboard/workshops' }
];

const standaloneItems = [
	{ label: 'Upcoming Workshops', href: '/dashboard/upcoming-workshops', icon: Calendar, hasDropdown: false },
	{ label: 'Browse Courses', href: '/all-course', icon: BookOpen, hasDropdown: false }
];

export default function UserDashboardSidebar() {
	const pathname = usePathname();
	const { user, clearAuth } = useAuthStore();
	const logout = () => {
		import('js-cookie').then(({ default: Cookies }) => Cookies.remove('refreshToken'));
		clearAuth();
	};
	const [isLibraryOpen, setIsLibraryOpen] = useState(true);
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const isActive = (href: string) => pathname === href;
	const activeClass = 'flex items-center gap-3 px-4 py-2.5 rounded-xl font-normal text-sm bg-[#eef2ff] text-[#2d2f54] transition-all duration-200';
	const inactiveClass = 'flex items-center gap-3 px-4 py-2.5 rounded-xl font-normal text-sm text-[#5f6368] hover:bg-[#f6f7fb] hover:text-[#2d2f54] transition-all duration-200';

	return (
		<>
			{isProfileOpen && (
				<div
					className="fixed inset-0 z-40 bg-transparent cursor-default"
					onClick={() => setIsProfileOpen(false)}
				/>
			)}

			{/* Desktop Profile Popup */}
			{isProfileOpen && (
				<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[420px] bg-white rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 z-50 p-7 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
					{/* Header */}
					<div className="flex items-center justify-between pb-4 border-b border-[#f2f4f8] shrink-0">
						<span className="text-lg font-bold text-[#111827] uppercase tracking-wider">My Profile</span>
						<button
							onClick={() => {
								setIsProfileOpen(false);
								logout();
							}}
							className="px-4 py-1.5 border border-[#c07a13] text-[#c07a13] hover:bg-[#fff7e8] rounded-none text-sm font-bold transition-colors cursor-pointer bg-white active:scale-95"
						>
							Log Out
						</button>
					</div>

					{/* User details */}
					<div className="flex items-center gap-4 py-3 shrink-0">
						<div className="w-14 h-14 rounded-none bg-[#eef4ff] flex items-center justify-center text-[#3b82f6] font-bold text-2xl shrink-0 select-none border border-slate-100">
							{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
						</div>
						<div className="min-w-0">
							<p className="text-base font-bold text-[#111827] truncate">{user?.name || 'User'}</p>
							<p className="text-xs text-[#9aa0a6] font-semibold uppercase tracking-wider">{user?.role || 'user'}</p>
						</div>
					</div>

					{/* Menu items */}
					<div className="flex flex-col gap-1.5 overflow-y-auto flex-1 py-2">
						<Link
							href="/dashboard/settings"
							onClick={() => setIsProfileOpen(false)}
							className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:text-[#111827] hover:bg-slate-50 cursor-pointer transition-all duration-150 rounded-none group active:scale-[0.99]"
						>
							<Settings size={20} className="text-[#9aa0a6] group-hover:text-slate-800" />
							<span className="text-sm font-bold">Account settings</span>
						</Link>
						<div className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:text-[#111827] hover:bg-slate-50 cursor-pointer transition-all duration-150 rounded-none group active:scale-[0.99]">
							<RefreshCw size={20} className="text-[#9aa0a6] group-hover:text-slate-800" />
							<span className="text-sm font-bold">Subscriptions</span>
						</div>
						<Link
							href="/dashboard/purchase-history"
							onClick={() => setIsProfileOpen(false)}
							className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:text-[#111827] hover:bg-slate-50 cursor-pointer transition-all duration-150 rounded-none group active:scale-[0.99]"
						>
							<History size={20} className="text-[#9aa0a6] group-hover:text-slate-800" />
							<span className="text-sm font-bold">Purchase History</span>
						</Link>
						<div className="flex items-center gap-4 px-4 py-2.5 text-slate-600 hover:text-[#111827] hover:bg-slate-50 cursor-pointer transition-all duration-150 rounded-none group active:scale-[0.99]">
							<Bell size={20} className="text-[#9aa0a6] group-hover:text-slate-800" />
							<span className="text-sm font-bold">Notifications</span>
						</div>
					</div>
				</div>
			)}

			<aside className="hidden md:flex w-64 bg-white border-r border-[#eef0f4] flex-col fixed h-full z-30">
				<div className="px-6 py-5 flex items-center justify-between">
					<Link href="/dashboard" className="flex items-center gap-2">
						<img src="/Logo/Logo.webp" alt="Logo" className="h-8 w-auto object-contain" />
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
									const activeClassSub = 'flex items-center pl-[48px] pr-4 py-2.5 rounded-xl font-normal text-sm bg-[#eef2ff] text-[#2d2f54] transition-all duration-200';
									const inactiveClassSub = 'flex items-center pl-[48px] pr-4 py-2.5 rounded-xl font-normal text-sm text-[#5f6368] hover:bg-[#f6f7fb] hover:text-[#2d2f54] transition-all duration-200';
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
							href="/store"
							className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fff7e8] text-[#c07a13] font-semibold text-sm"
						>
							<div className="w-5 h-5 flex items-center justify-center shrink-0">
								<Store size={18} />
							</div>
							<span>Visit Store</span>
						</Link>
					</div>
				</div>

				<div className="p-4 border-t border-[#f2f4f8] flex items-center justify-between relative">
					<div
						onClick={() => setIsProfileOpen(!isProfileOpen)}
						className="flex items-center gap-3 min-w-0 cursor-pointer hover:bg-slate-50 p-1.5 -ml-1.5 rounded-xl transition-colors flex-1"
					>
						<div className="w-10 h-10 rounded-full bg-[#ff4d4f] flex items-center justify-center text-white font-semibold shrink-0 select-none">
							{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
						</div>
						<div className="min-w-0">
							<p className="text-sm font-semibold text-[#111827] truncate">{user?.name || 'User'}</p>
							<p className="text-xs text-[#9aa0a6]">Student</p>
						</div>
					</div>
					<button
						onClick={() => logout()}
						className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors shrink-0 cursor-pointer bg-transparent border-0"
						title="Logout"
					>
						<LogOut size={20} />
					</button>
				</div>
			</aside>
		</>
	);
}

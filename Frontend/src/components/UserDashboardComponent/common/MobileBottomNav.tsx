"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import {
	Book,
	Presentation,
	Bookmark,
	Settings,
	RefreshCw,
	Wallet,
	History,
	Bell,
	Store,
	Compass,
	Calendar
} from 'lucide-react';

export default function MobileBottomNav() {
	const pathname = usePathname();
	const { user, clearAuth } = useAuthStore();
	const logout = () => {
		import('js-cookie').then(({ default: Cookies }) => Cookies.remove('refreshToken'));
		clearAuth();
	};
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	const isActive = (href: string) => pathname === href;

	React.useEffect(() => {
		if (isProfileOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isProfileOpen]);

	const tabs = [
		{ label: 'Courses', href: '/dashboard/activecourse', icon: Book },
		{ label: 'Workshops', href: '/dashboard/workshops', icon: Presentation },
		{ label: 'Upcoming', href: '/dashboard/upcoming-workshops', icon: Calendar },
		{ label: 'Explore', href: '/all-course', icon: Compass }
	];

	const menuItems = [
		{ label: 'Account settings', icon: Settings, href: '/dashboard/settings' },
		{ label: 'Subscriptions', icon: RefreshCw },
		{ label: 'Purchase History', icon: History, href: '/dashboard/purchase-history' },
		{ label: 'Notifications', icon: Bell }
	];

	return (
		<>
			{/* Profile Popup Overlay */}
			<div
				className={`fixed inset-0 pb-16 bg-white z-30 flex flex-col md:hidden transition-all duration-300 ease-in-out ${isProfileOpen
						? 'translate-y-0 opacity-100 pointer-events-auto'
						: 'translate-y-4 opacity-0 pointer-events-none'
					}`}
			>
				{/* Top Header */}
				<div className="h-[73px] px-6 border-b border-[#f2f4f8] flex items-center justify-between bg-[#f8f9fa] shrink-0">
					<span className="text-lg font-semibold text-slate-800">My Profile</span>
					<button
						onClick={() => {
							setIsProfileOpen(false);
							logout();
						}}
						className="px-4 py-1.5 border border-[#c07a13] text-[#c07a13] hover:bg-[#fff7e8] rounded-lg text-sm font-medium transition-colors"
					>
						Log Out
					</button>
				</div>

				{/* Popup Content */}
				<div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
					<div>
						{/* User Details */}
						<div className="flex items-center gap-4 mb-8">
							<div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
								{user?.name ? (
									<span className="text-xl font-semibold text-slate-700">{user.name.charAt(0)}</span>
								) : (
									<img
										src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
										alt="User Avatar"
										className="w-full h-full object-cover"
									/>
								)}
							</div>
							<div className="flex flex-col">
								<h2 className="text-lg font-medium text-slate-900 leading-tight">
									{user?.name || 'Shubhajit Basak'}
								</h2>
								<span className="text-sm text-slate-400 mt-1">
									{user?.role || 'Student'}
								</span>
							</div>
						</div>

						{/* Menu Items */}
						<div className="flex flex-col gap-7 pl-1">
							{menuItems.map((item) => {
								const Component = item.href ? Link : 'div';
								return (
									<Component
										key={item.label}
										href={item.href || '#'}
										onClick={() => setIsProfileOpen(false)}
										className="flex items-center gap-4 text-slate-500 cursor-pointer hover:text-slate-800 transition-colors"
									>
										<item.icon size={20} strokeWidth={1.5} className="text-[#9aa0a6]" />
										<span className="text-sm font-normal text-[#5f6368] tracking-wide">
											{item.label}
										</span>
									</Component>
								);
							})}
						</div>
					</div>

					{/* Visit Store Button */}
					<div className="mt-8">
						<Link
							href="/store"
							onClick={() => setIsProfileOpen(false)}
							className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#fff7e8] text-[#c07a13] font-medium text-sm transition-colors hover:bg-[#ffeecb]"
						>
							<Store size={18} strokeWidth={1.5} />
							<span>Visit Store</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Bottom Nav Bar */}
			<div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-40 md:hidden shadow-lg select-none">
				{tabs.map((tab) => {
					const active = !isProfileOpen && isActive(tab.href);
					return (
						<Link
							key={tab.label}
							href={tab.href}
							onClick={() => setIsProfileOpen(false)}
							className="relative flex flex-col items-center justify-center flex-1 h-full pt-1"
						>
							{active && (
								<div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-600" />
							)}
							<tab.icon size={20} className={active ? 'text-blue-600' : 'text-[#9aa0a6]'} />
							<span className={`text-[10px] mt-1.5 font-bold tracking-wider ${active ? 'text-blue-600' : 'text-[#9aa0a6]'}`}>
								{tab.label}
							</span>
						</Link>
					);
				})}

				{/* Profile Avatar Tab */}
				<button
					onClick={() => setIsProfileOpen(!isProfileOpen)}
					className="relative flex flex-col items-center justify-center flex-1 h-full focus:outline-none bg-transparent border-none cursor-pointer"
				>
					{isProfileOpen && (
						<div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-600" />
					)}
					<div className="relative shrink-0">
						{/* Red Notification Badge */}
						<div className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white z-10 animate-pulse" />

						{/* Circular Profile Pic */}
						<div className={`w-8 h-8 rounded-full overflow-hidden border ${isProfileOpen ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'} bg-slate-100 flex items-center justify-center`}>
							{user?.name ? (
								<span className="text-xs font-semibold text-slate-700">{user.name.charAt(0)}</span>
							) : (
								<img
									src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80"
									alt="User Avatar"
									className="w-full h-full object-cover"
								/>
							)}
						</div>
					</div>
				</button>
			</div>
		</>
	);
}

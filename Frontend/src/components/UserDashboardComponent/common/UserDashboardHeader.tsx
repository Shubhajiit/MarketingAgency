'use client';

import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';

interface UserDashboardHeaderProps {
	onMenuClick?: () => void;
	className?: string;
}

export default function UserDashboardHeader({ className }: UserDashboardHeaderProps) {
	const pathname = usePathname();

	const getTitle = (path: string) => {
		if (path.includes('/activecourse')) return 'Active Courses';
		if (path.includes('/all-course')) return 'Explore Courses';
		if (path.includes('/workshops')) return 'Workshops';
		if (path.includes('/videos')) return 'AI Avatar';
		if (path.includes('/settings')) return 'Account Settings';
		return 'Dashboard';
	};

	const title = getTitle(pathname);
	const { cartCount, openDrawer } = useCartStore();

	return (
		<header
			className={`bg-white px-6 md:px-12 sticky top-0 z-20 shrink-0 border-b border-[#f2f4f8] flex items-center justify-between h-[73px] w-full ${className || ''}`}
		>
			<h1 className="text-xl md:text-2xl font-bold text-[#111827]">{title}</h1>
			<div className="flex items-center gap-4">
				<button 
					onClick={openDrawer}
					className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
				>
					<ShoppingCart className="w-6 h-6 text-slate-700" />
					{cartCount > 0 && (
						<span className="absolute top-0 right-0 w-4 h-4 bg-[#0056d2] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
							{cartCount}
						</span>
					)}
				</button>
			</div>
		</header>
	);
}

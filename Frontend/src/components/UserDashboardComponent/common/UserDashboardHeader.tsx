'use client';

import { usePathname } from 'next/navigation';

interface UserDashboardHeaderProps {
	onMenuClick?: () => void;
	className?: string;
}

export default function UserDashboardHeader({ className }: UserDashboardHeaderProps) {
	const pathname = usePathname();

	const getTitle = (path: string) => {
		if (path.includes('/activecourse')) return 'Active Courses';
		if (path.includes('/workshops')) return 'Workshops';
		if (path.includes('/videos')) return 'AI Avatar';
		if (path.includes('/bookings')) return 'Bookmarks';
		if (path.includes('/community')) return 'Community';
		if (path.includes('/settings')) return 'Account Settings';
		return 'Dashboard';
	};

	const title = getTitle(pathname);

	return (
		<header
			className={`bg-white px-6 md:px-12 sticky top-0 z-20 shrink-0 border-b border-[#f2f4f8] flex items-center h-[73px] w-full ${className || ''}`}
		>
			<h1 className="text-xl md:text-2xl font-bold text-[#111827]">{title}</h1>
		</header>
	);
}

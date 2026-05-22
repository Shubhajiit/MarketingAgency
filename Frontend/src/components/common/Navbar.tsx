"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const { user, isAuthenticated } = useAuth();

    return (
        <>
            {/* Navbar */}
            <header className="bg-white border-b border-gray-100 py-3 px-4 md:px-36 flex justify-between items-center z-10 w-full">
                <div className="flex items-center">
                    <img src="/Logo/Logo.png" alt="Datamites Logo" className="h-12 w-auto object-contain" />
                </div>

                <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-gray-800 tracking-wide">
                    <a href="#" className="hover:text-[#009ee3]">HOME</a>
                    <a href="#" className="hover:text-[#009ee3] flex items-center gap-1">COURSES <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></a>
                    <a href="#" className="hover:text-[#009ee3] flex items-center gap-1">CLASSROOM <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></a>
                    <a href="#" className="hover:text-[#009ee3] flex items-center gap-1">PARTNERS <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></a>
                    <a href="#" className="hover:text-[#009ee3]">REVIEWS</a>
                    {isAuthenticated && user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-9 h-9 rounded-full bg-[#009ee3] text-white flex items-center justify-center font-semibold uppercase hover:bg-blue-600 transition-colors"
                            >
                                {user.email.charAt(0)}
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                                    <div className="px-4 py-2 border-b border-gray-100 text-sm text-gray-500 truncate">
                                        {user.email}
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#009ee3]"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        Go to dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="px-5 py-2 bg-[#009ee3] text-white rounded hover:bg-blue-600 transition-colors">Login</Link>
                    )}
                </nav>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-gray-800 focus:outline-none ml-auto p-1 hover:bg-gray-50 rounded"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </header>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-150 px-6 py-4 flex flex-col gap-3 text-xs font-semibold text-gray-800 tracking-wide transition-all duration-300 z-20 w-full">
                    <a href="#" className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between">HOME</a>
                    <a href="#" className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between">COURSES <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></a>
                    <a href="#" className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between">CLASSROOM <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></a>
                    <a href="#" className="hover:text-[#009ee3] py-2.5 border-b border-gray-100 flex items-center justify-between">PARTNERS <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></a>
                    <a href="#" className="hover:text-[#009ee3] py-2.5 flex items-center justify-between">REVIEWS</a>
                    {isAuthenticated && user ? (
                        <>
                            <div className="py-2.5 border-t border-gray-100 mt-2 flex justify-between items-center relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="w-8 h-8 rounded-full bg-[#009ee3] text-white flex items-center justify-center font-semibold uppercase"
                                >
                                    {user.email.charAt(0)}
                                </button>
                                <span className="text-gray-600 truncate ml-3 flex-1">{user.email}</span>
                            </div>
                            {isProfileOpen && (
                                <Link
                                    href="/dashboard"
                                    className="py-2.5 text-center bg-gray-50 text-[#009ee3] border border-gray-200 rounded hover:bg-gray-100 transition-colors mt-2 w-full"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Go to dashboard
                                </Link>
                            )}
                        </>
                    ) : (
                        <Link href="/login" className="py-2.5 text-center bg-[#009ee3] text-white rounded hover:bg-blue-600 transition-colors mt-2 w-full">Login</Link>
                    )}
                </div>
            )}
        </>
    );
}

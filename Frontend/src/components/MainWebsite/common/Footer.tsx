"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    // Hide footer on workshop detail pages
    if (pathname?.startsWith("/workshops/") || pathname?.startsWith("/one-day-workshop/") || pathname?.startsWith("/three-days-workshops/")) {
        return null;
    }

    return (
        <footer className="w-full bg-[#00031A] text-white py-12 px-4 font-sans border-t border-slate-900">
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-6">
                
                {/* Horizontal Links */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm md:text-[15px] font-medium text-slate-200">
                    <Link href="/contact" className="hover:text-[#F1AF19] transition-colors">
                        Contact Us
                    </Link>
                    <a 
                        href="https://aifortechies.in/terms-and-conditions/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-[#F1AF19] transition-colors"
                    >
                        Terms of Use
                    </a>
                    <a 
                        href="https://aifortechies.in/refund-and-cancellation-policy/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-[#F1AF19] transition-colors"
                    >
                        Refund Policy
                    </a>
                    <a 
                        href="https://aifortechies.in/privacy-policy/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-[#F1AF19] transition-colors"
                    >
                        Privacy Policy
                    </a>
                </div>

                {/* Social Icons (Golden-yellow color) */}
                <div className="flex items-center justify-center gap-5 my-1">
                    {/* LinkedIn */}
                    <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="LinkedIn"
                        className="text-[#F1AF19] hover:text-white transition-colors"
                    >
                        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </a>
                    {/* Facebook */}
                    <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Facebook"
                        className="text-[#F1AF19] hover:text-white transition-colors"
                    >
                        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                    </a>
                    {/* Instagram */}
                    <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Instagram"
                        className="text-[#F1AF19] hover:text-white transition-colors"
                    >
                        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                    {/* YouTube */}
                    <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="YouTube"
                        className="text-[#F1AF19] hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M23.498 6.163c-.272-1.022-1.074-1.824-2.096-2.096c-1.85-.5-9.402-.5-9.402-.5s-7.552 0-9.402.5c-1.022.272-1.824 1.074-2.096 2.096c-.5 1.85-.5 5.713-.5 5.713s0 3.863.5 5.713c.272 1.022 1.074 1.824 2.096 2.096c1.85.5 9.402.5 9.402.5s7.552 0 9.402-.5c1.022-.272 1.824-1.074 2.096-2.096c.5-1.85.5-5.713.5-5.713s0-3.863-.5-5.713zm-14.17 9.43v-6.837l6.517 3.418l-6.517 3.419z" />
                        </svg>
                    </a>
                </div>

                {/* Copyright */}
                <p className="text-xs md:text-sm text-slate-400 font-normal">
                    Copyright &copy; 2026 AI For Techies. All right reserved
                </p>
            </div>
        </footer>
    );
}

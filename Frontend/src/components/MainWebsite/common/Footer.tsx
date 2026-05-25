"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Footer() {
    const pathname = usePathname();
    const [email, setEmail] = React.useState("");
    const [subscribed, setSubscribed] = React.useState(false);

    // Hide footer on workshop detail pages
    if (pathname?.startsWith("/workshops/")) {
        return null;
    }

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    const footerLinks = [
        {
            title: "Learning",
            links: [
                { label: "Courses", href: "#" },
                { label: "Programs for Kids", href: "#" },
                { label: "Skill Tracks", href: "#" },
                { label: "Certifications", href: "#" },
                { label: "Learning Resources", href: "#" },
            ],
        },
        {
            title: "Company",
            links: [
                { label: "About Us", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Press", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Contact", href: "#" },
            ],
        },
        {
            title: "Support",
            links: [
                { label: "Contact Us", href: "#" },
                { label: "Help Center", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Conditions", href: "#" },
            ],
        },
    ];

    return (
        <footer className="w-full bg-white border-t border-slate-200 text-slate-900 pt-8 md:pt-16 pb-8 px-4 md:px-36 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-4 md:gap-8 pb-8 md:pb-16">
                    {/* Left Column: Brand & Subscription */}
                    <div className="col-span-5 flex flex-col gap-4 md:gap-6 pr-2 md:pr-12 border-r border-slate-200">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5">
                            <img
                                src="/Logo/Logo.png"
                                alt="AI Scale Logo"
                                className="h-6 md:h-10 w-auto object-contain"
                            />
                            {/* <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">AI Scale</span> */}
                        </div>

                        {/* Tagline */}
                        <h2 className="text-[10px] sm:text-xs md:text-3xl lg:text-4xl font-serif font-medium text-slate-800 leading-tight tracking-wide">
                            Helping minds grow through adaptive AI learning
                        </h2>

                        {/* Subscription Form */}
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 md:gap-2.5 mt-2 max-w-md w-full relative">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 bg-white text-slate-900 border border-slate-300 rounded px-2 py-1.5 text-[9px] md:text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-400 min-w-0"
                            />
                            <button
                                type="submit"
                                className="bg-[#FF2E00] hover:bg-[#D62400] active:bg-[#B31E00] text-white text-[9px] md:text-sm font-semibold px-3 py-1.5 rounded transition-all duration-200 shadow-sm whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                            {subscribed && (
                                <span className="absolute left-0 -bottom-5 text-[9px] md:text-xs text-green-600 font-medium">
                                    Thanks for subscribing!
                                </span>
                            )}
                        </form>
                    </div>

                    {/* Right Columns: Link Lists */}
                    <div className="col-span-7 grid grid-cols-3 gap-2 md:gap-8 pl-2 md:pl-12">
                        {footerLinks.map((section, idx) => (
                            <div key={idx} className="flex flex-col gap-2 md:gap-4">
                                <h3 className="text-[10px] md:text-sm font-semibold text-slate-900 tracking-wide uppercase">
                                    {section.title}
                                </h3>
                                <ul className="flex flex-col gap-1.5 md:gap-2.5">
                                    {section.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link
                                                href={link.href}
                                                className="text-[9px] md:text-sm text-slate-500 hover:text-slate-900 transition-colors block truncate"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-slate-200 pt-8 flex flex-row items-center justify-between gap-2 md:gap-6 flex-wrap md:flex-nowrap">
                    {/* Copyright */}
                    <p className="text-[10px] md:text-sm text-slate-500 font-normal whitespace-nowrap">
                        &copy; All right reserved @AI Scale-2025
                    </p>

                    {/* Core Footer Links */}
                    <div className="flex items-center gap-2 md:gap-6 text-[10px] md:text-sm text-slate-500">
                        <Link href="#" className="hover:text-slate-900 transition-colors">
                            Terms of Use
                        </Link>
                        <span className="text-slate-300 md:hidden">|</span>
                        <Link href="#" className="hover:text-slate-900 transition-colors">
                            Privacy
                        </Link>
                        <span className="text-slate-300 md:hidden">|</span>
                        <Link href="#" className="hover:text-slate-900 transition-colors">
                            Site Index
                        </Link>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-1 md:gap-2">
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="w-6 h-6 md:w-9 md:h-9 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="w-6 h-6 md:w-9 md:h-9 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            aria-label="Website"
                            className="w-6 h-6 md:w-9 md:h-9 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.001 22.064v-1.764c-1.32-.084-2.52-.768-3.444-1.92l1.584-1.584c.504.624 1.152.984 1.86.984h.001v-3.792c-1.896-.516-3.324-1.848-3.324-3.984 0-.828.228-1.572.636-2.184l-1.632-1.632c-.936.996-1.5 2.34-1.5 3.816 0 3.324 2.508 6.132 5.82 6.552v1.731c-1.884-.36-3.444-1.584-4.224-3.264h1.704c.432.888 1.152 1.572 2.052 1.908v-.049zm0-9.288h-.001v-3.768c.684.024 1.308.336 1.776.888l1.548-1.548c-.9-.984-2.076-1.584-3.324-1.668v-1.776c1.884.348 3.444 1.56 4.224 3.24h-1.68c-.432-.876-1.164-1.548-2.064-1.872v21.144c2.892-.612 5.076-3.18 5.076-6.264 0-1.284-.372-2.472-1.02-3.48l1.644-1.644c.828.996 1.32 2.268 1.32 3.648 0 3.108-2.196 5.724-5.184 6.372v1.644c3.48-.684 6-3.756 6-7.44 0-4.176-3.216-7.596-7.32-7.836v-.096z" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            aria-label="LinkedIn"
                            className="w-6 h-6 md:w-9 md:h-9 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

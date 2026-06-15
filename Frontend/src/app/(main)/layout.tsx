"use client";

import React from 'react';
import Navbar from "@/components/MainWebsite/common/Navbar";
import Footer from "@/components/MainWebsite/common/Footer";
import AnnoucementBar from "@/components/MainWebsite/common/AnnoucementBar";
import CartDrawer from "@/components/MainWebsite/common/CartDrawer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen font-sans flex flex-col bg-white">
            <div className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col bg-white">
                <AnnoucementBar />
                <Navbar />
            </div>

            {/* Spacer to prevent fixed header from overlapping main content */}
            <div
                className="h-[160px] md:h-[150px] shrink-0 bg-white"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px',
                }}
            />

            <main className="flex-1 flex flex-col">
                {children}
            </main>

            <Footer />
            <CartDrawer />
        </div>
    );
}

"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/MainWebsite/common/Navbar";
import Footer from "@/components/MainWebsite/common/Footer";
import AnnoucementBar from "@/components/MainWebsite/common/AnnoucementBar";
import CartDrawer from "@/components/MainWebsite/common/CartDrawer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen font-sans flex flex-col bg-white">
            <div className="sticky top-0 z-50 w-full flex flex-col bg-white">
                <AnnoucementBar />
                <Navbar />
            </div>

            <main className="flex-1 flex flex-col">
                {children}
            </main>

            <Footer />
            <CartDrawer />
        </div>
    );
}

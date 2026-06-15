import React from 'react';
import Navbar from "@/components/MainWebsite/common/Navbar";
import ConditionalFooter from "@/components/MainWebsite/common/ConditionalFooter";
import AnnoucementBar from "@/components/MainWebsite/common/AnnoucementBar";
import CartDrawer from "@/components/MainWebsite/common/CartDrawer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen font-sans flex flex-col">
            <div className="sticky top-0 z-50 w-full flex flex-col bg-white">
                <AnnoucementBar />

                <Navbar />
            </div>

            <main className="flex-1 flex flex-col">
                {children}
            </main>

            <ConditionalFooter />
            <CartDrawer />
        </div>
    );
}

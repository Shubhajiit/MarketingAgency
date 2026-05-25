import React from 'react';
import Navbar from "@/components/MainWebsite/common/Navbar";
import Footer from "@/components/MainWebsite/common/Footer";
import AnnoucementBar from "@/components/MainWebsite/common/AnnoucementBar";

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

            <Footer />
        </div>
    );
}

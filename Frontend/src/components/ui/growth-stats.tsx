import React from "react";

export default function GrowthStats() {
    const stats = [
        {
            value: "3x",
            title: "CONTENT OUTPUT",
            description: "Turn one idea into 50 assets — before competitors finish one post.",
        },
        {
            value: "60%",
            title: "LESS TIME ON CAMPAIGNS",
            description: "AI handles research, copy, creative, and scheduling — your team focuses on strategy.",
        },
        {
            value: "47",
            title: "MINUTES TO A LIVE DASHBOARD",
            description: "Build what consultants charge ₹2L for — live, without coding or tools.",
        },
        {
            value: "90",
            title: "DAYS TO A FULLY WIRED AI SYSTEM",
            description: "A system that runs your funnel, creates content, and tracks performance — automatically.",
        },
    ];

    return (
        <section className="w-full bg-white py-16 md:py-20 px-4 md:px-24 lg:px-32">
            <div className="max-w-[1200px] mx-auto text-center">
                {/* Header Section */}
                <h2 className="text-3xl md:text-[42px] font-bold text-gray-900 tracking-tight mb-3">
                    Unlock Real Growth For You & Your Business
                </h2>
                <p className="text-base md:text-[17px] text-gray-600 font-medium mb-12 max-w-3xl mx-auto">
                    Stop attending AI webinars. Start leaving with systems that make you money
                </p>

                {/* Stats Grid with borders exactly like the image */}
                <div className="grid grid-cols-1 md:grid-cols-4 border-t border-b border-l border-r md:border-l-0 md:border-r-0 border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="text-left py-5 md:py-10 px-6 md:px-8 flex flex-col justify-start"
                        >
                            {/* Value (brand blue color to match the button style) */}
                            <div className="text-4xl md:text-5xl font-extrabold text-[#0056d2] mb-3 md:mb-5 tracking-tight">
                                {stat.value}
                            </div>
                            {/* Title */}
                            <h3 className="text-sm font-bold text-gray-950 tracking-wider mb-2.5 md:mb-4 uppercase leading-snug min-h-0 md:min-h-[40px] flex items-center">
                                {stat.title}
                            </h3>
                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed font-normal">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

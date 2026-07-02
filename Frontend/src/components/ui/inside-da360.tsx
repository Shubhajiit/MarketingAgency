import React from "react";
import Image from "next/image";

interface PhotoInfo {
    src: string;
    label: string;
}

export default function InsideDA360() {
    const ALL_PHOTOS: PhotoInfo[] = [
        { src: "/LandingPage/InsideGallery/IMG_1388_converted.webp", label: "Cricket Turf Activity" },
        { src: "/LandingPage/InsideGallery/IMG_1389_converted.webp", label: "Student Outdoor Activity" },
        { src: "/LandingPage/InsideGallery/IMG_1393_converted.webp", label: "Classroom Presentation" },
        { src: "/LandingPage/InsideGallery/IMG_1413_converted.webp", label: "Interactive Session" },
        { src: "/LandingPage/InsideGallery/IMG_1414_converted.webp", label: "Active Learning Classroom" },
        { src: "/LandingPage/InsideGallery/IMG_1415_converted.webp", label: "Instructor Led Lecture" },
        { src: "/LandingPage/InsideGallery/IMG_1417_converted.webp", label: "Group Study Discussion" },
        { src: "/LandingPage/InsideGallery/IMG_1418_converted.webp", label: "Classroom Presentation View" },
        { src: "/LandingPage/InsideGallery/IMG_1419_converted.webp", label: "Students Attending Session" },
        { src: "/LandingPage/InsideGallery/IMG_1421_converted.webp", label: "Peer Learning Session" },
        { src: "/LandingPage/InsideGallery/IMG_1422_converted.webp", label: "Student Group Discussion" },
        { src: "/LandingPage/InsideGallery/IMG_1423_converted.webp", label: "Class Presentation and Discussion" },
        { src: "/LandingPage/InsideGallery/IMG_1424_converted.webp", label: "Mentorship Session" },
        { src: "/LandingPage/InsideGallery/IMG_1438_converted.webp", label: "Hands-on Practice" },
        { src: "/LandingPage/InsideGallery/IMG_1447_converted.webp", label: "Classroom Interaction" },
        { src: "/LandingPage/InsideGallery/IMG_1449_converted.webp", label: "Interactive Workshop" },
        { src: "/LandingPage/InsideGallery/IMG_1450_converted.webp", label: "Practical Workshop Training" },
        { src: "/LandingPage/InsideGallery/IMG_1649_converted.webp", label: "Group Brainstorming" },
        { src: "/LandingPage/InsideGallery/IMG_1651_converted.webp", label: "Students Collaboration" },
        { src: "/LandingPage/InsideGallery/IMG_1653_converted.webp", label: "Speaker Q&A Session" },
        { src: "/LandingPage/InsideGallery/IMG_1656_converted.webp", label: "Active Classroom Engagement" },
        { src: "/LandingPage/InsideGallery/IMG_1657_converted.webp", label: "Classroom Seminar" },
        { src: "/LandingPage/InsideGallery/IMG_1831(1)_converted.webp", label: "Fun Friday Festivities" },
        { src: "/LandingPage/InsideGallery/IMG_1831_converted.webp", label: "Fun Friday Activity" },
        { src: "/LandingPage/InsideGallery/IMG_1848_converted.webp", label: "Fun Friday Group Activity" },
        { src: "/LandingPage/InsideGallery/IMG_1849_converted.webp", label: "Fun Friday Team Event" },
        { src: "/LandingPage/InsideGallery/IMG_1850_converted.webp", label: "Fun Friday Celebration" },
        { src: "/LandingPage/InsideGallery/IMG_1852_converted.webp", label: "Fun Friday Games" },
        { src: "/LandingPage/InsideGallery/IMG_1853_converted.webp", label: "Fun Friday Gathering" },
        { src: "/LandingPage/InsideGallery/IMG_1854_converted.webp", label: "Fun Friday Indoor Games" },
        { src: "/LandingPage/InsideGallery/IMG_1855_converted.webp", label: "Fun Friday Recreation" },
        { src: "/LandingPage/InsideGallery/IMG_1856_converted.webp", label: "Fun Friday Teamwork Game" },
        { src: "/LandingPage/InsideGallery/IMG_1857_converted.webp", label: "Fun Friday Group Photo" },
        { src: "/LandingPage/InsideGallery/IMG_1859_converted.webp", label: "Fun Friday Social Gathering" },
        { src: "/LandingPage/InsideGallery/IMG_1861_converted.webp", label: "Fun Friday Group Event" },
        { src: "/LandingPage/InsideGallery/IMG_1862_converted.webp", label: "Fun Friday Celebration Setup" },
        { src: "/LandingPage/InsideGallery/IMG_1863_converted.webp", label: "Sports Court Matches" },
        { src: "/LandingPage/InsideGallery/IMG_1864_converted.webp", label: "Sports Activities Close-up" },
    ];

    const gridLayout = [
        { colSpan: "col-span-2 md:col-span-2", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-2 md:row-span-2", heightClass: "h-[372px] sm:h-[456px] md:h-[516px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-2 md:col-span-2", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        // Row 2
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
        { colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1", heightClass: "h-[180px] sm:h-[220px] md:h-[250px]" },
    ];

    const totalPages = 3;
    const [currentPage, setCurrentPage] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(newPage);
                setIsTransitioning(false);
            }, 300);
        }
    };

    const nextPage = () => handlePageChange(currentPage + 1);
    const prevPage = () => handlePageChange(currentPage - 1);

    const getPageItemsForIndex = (pageIdx: number) => {
        let pagePhotos: PhotoInfo[] = [];
        if (pageIdx === 0) pagePhotos = ALL_PHOTOS.slice(0, 15);
        else if (pageIdx === 1) pagePhotos = ALL_PHOTOS.slice(15, 30);
        else if (pageIdx === 2) pagePhotos = ALL_PHOTOS.slice(23, 38);

        return pagePhotos.map((photo, index) => ({
            ...photo,
            colSpan: gridLayout[index].colSpan,
            rowSpan: gridLayout[index].rowSpan,
            heightClass: gridLayout[index].heightClass,
        }));
    };

    return (
        <section className="w-full bg-black py-16 md:py-24 px-4 md:px-6 lg:px-8 text-white border-t border-b border-neutral-900">
            <div className="max-w-full mx-auto">
                {/* Header with Navigation Controls */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 md:mb-16">
                    <div className="text-left">
                        <h2 className="text-3xl md:text-5xl font-black italic tracking-wider text-white uppercase">
                            Inside DA360
                        </h2>
                        <p className="text-xs md:text-sm text-neutral-400 max-w-xl mt-4 font-normal tracking-wide leading-relaxed">
                            Student life at Digital Academy 360, a premier digital marketing school, is far from ordinary — it's extraordinary!
                        </p>
                    </div>

                    {/* Pagination Arrows */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                            onClick={prevPage}
                            type="button"
                            aria-label="Previous Page"
                            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-neutral-800 hover:border-neutral-700 transition-colors shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={currentPage === 0 || isTransitioning}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <button
                            onClick={nextPage}
                            type="button"
                            aria-label="Next Page"
                            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-neutral-800 hover:border-neutral-700 transition-colors shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={currentPage === totalPages - 1 || isTransitioning}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 6l6 6-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Bento Grid container with pre-rendered pages */}
                <div className="relative h-[372px] sm:h-[456px] md:h-[516px] w-full overflow-hidden">
                    {[0, 1, 2].map((pageIndex) => {
                        const pageItems = getPageItemsForIndex(pageIndex);
                        const isActive = pageIndex === currentPage;

                        return (
                            <div
                                key={pageIndex}
                                className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-3 md:gap-4 transition-all duration-500 absolute inset-0 w-full ${
                                    isActive
                                        ? "opacity-100 scale-100 pointer-events-auto z-10"
                                        : "opacity-0 scale-[0.98] pointer-events-none z-0"
                                }`}
                            >
                                {pageItems.map((item) => (
                                    <div
                                        key={item.src}
                                        className={`${item.colSpan} ${item.rowSpan} ${item.heightClass} relative group overflow-hidden bg-neutral-950 flex flex-col items-center justify-center`}
                                    >
                                        {/* Student Life Photo */}
                                        <Image
                                            src={item.src}
                                            alt={item.label}
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>

                {/* Page dots indicator */}
                <div className="flex items-center gap-2 mt-8 justify-center">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePageChange(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentPage ? "w-6 bg-indigo-500" : "bg-neutral-800 hover:bg-neutral-600"}`}
                            aria-label={`Go to page ${idx + 1}`}
                            disabled={isTransitioning}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

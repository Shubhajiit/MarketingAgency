'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Course, CourseCard } from '@/components/common/CoursesCardsUI';
import { useAuthStore } from '@/store/auth.store';

// Custom mock data to exactly match the screenshot
const mockActiveCourses: Course[] = [
  {
    id: "dsa-supreme-3-pop",
    title: "Data Structures & Algorithms Master Course [Supreme 3.0]",
    category: "popular",
    tag: "PACKAGE",
    hours: "120 Hours • Self-Paced",
    price: 0,
    originalPrice: 0,
    discount: "0%",
    bgGradient: "from-blue-600 to-indigo-600",
    primaryCtaText: "View Course",
    secondaryCtaText: "View Course",
    isPackage: true,
    thumbnailType: "dsa"
  },
  {
    id: "cpp-mock-test-pop",
    title: "C++ Language Mock Test",
    category: "popular",
    tag: "TEST",
    hours: "10 Hours • Self-Paced",
    price: 0,
    originalPrice: 0,
    discount: "0%",
    bgGradient: "from-slate-200 to-slate-300",
    primaryCtaText: "View Course",
    secondaryCtaText: "View Course",
    isMockTest: true,
    authorName: "Love Babbar",
    validityText: "Lifetime",
    thumbnailType: "cpp"
  }
];

export default function ActiveCoursesPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [launchMessage, setLaunchMessage] = useState<string | null>(null);

  // Map real enrolled courses to Course card structure
  const enrolledCourses: Course[] = (user?.enrolledCourses || []).map((c: any) => ({
    id: c._id || c.id,
    title: c.title,
    category: c.category || "popular",
    tag: c.tag || "DMI",
    hours: c.hours || "Self-Paced",
    price: c.price || 0,
    originalPrice: c.originalPrice || 0,
    discount: c.discount || "0%",
    bgGradient: c.bgGradient || "from-[#6366f1] to-[#8b5cf6]",
    primaryCtaText: c.primaryCtaText || "View Course",
    secondaryCtaText: c.secondaryCtaText || "View Course",
    isPackage: !c.isGraphicOnly,
    isMockTest: c.isMockTest || false,
    authorName: c.authorName || "",
    validityText: "Lifetime",
    thumbnailType: c.thumbnailType || undefined,
    circlesColor: c.circlesColor,
    thumbnail: c.thumbnail || c.instructorImage,
    instructorImage: c.instructorImage,
    isGraphicOnly: c.isGraphicOnly,
    graphicType: c.graphicType
  }));

  const allActiveCourses = [...enrolledCourses, ...mockActiveCourses];

  const filteredCourses = activeTab === 'active'
    ? allActiveCourses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.authorName && course.authorName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : [];

  const handleStartNow = (course: Course) => {
    setLaunchMessage(`Launching "${course.title}"... Enjoy your learning!`);
    setTimeout(() => {
      setLaunchMessage(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans pt-6">
      {/* Launch Toast Notification */}
      {launchMessage && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg z-50 text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2 border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          {launchMessage}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 w-full">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-12 text-base transition-all duration-200 outline-none border-b-[3px] -mb-[1px] ${
            activeTab === 'active'
              ? 'text-slate-900 font-bold border-[#4f46e5]'
              : 'text-slate-400 font-medium hover:text-slate-600 border-transparent'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`pb-3 px-12 text-base transition-all duration-200 outline-none border-b-[3px] -mb-[1px] ${
            activeTab === 'archived'
              ? 'text-slate-900 font-bold border-[#4f46e5]'
              : 'text-slate-400 font-medium hover:text-slate-600 border-transparent'
          }`}
        >
          Archived
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-full">
        <input
          type="text"
          placeholder="Search for a chapter, course or package"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors pr-10"
        />
        <Search className="w-5 h-5 text-slate-800 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPrimaryClick={handleStartNow}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">No courses found</h2>
          <p className="text-sm text-slate-500">
            {activeTab === 'archived'
              ? "You do not have any archived courses."
              : "We couldn't find any courses matching your search."
            }
          </p>
        </div>
      )}
    </div>
  );
}

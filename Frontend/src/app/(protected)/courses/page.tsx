'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Star, Search, Filter } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
  label: 'ui-design' | 'ux-design';
  labelName: string;
  rating: number;
  reviews: string;
  level: string;
  author: string;
  thumbnailType: 'figma-beginners' | 'fashion-lookbook' | 'info-design' | 'web-mobile' | 'web-design' | 'learn-figma';
}

const COURSES_DATA: Course[] = [
  {
    id: 'figma-beginners',
    title: 'Figma for Beginners: Fundamentals of Figma',
    category: 'Design',
    label: 'ui-design',
    labelName: 'UI Design',
    rating: 4.8,
    reviews: '1,200',
    level: 'Beginner',
    author: 'Richardino Gueva',
    thumbnailType: 'figma-beginners',
  },
  {
    id: 'fashion-lookbook',
    title: 'Fashion Lookbook: Design Croquis in Adobe Illustrator',
    category: 'Design',
    label: 'ux-design',
    labelName: 'UX Design',
    rating: 4.8,
    reviews: '1,200',
    level: 'Level Course',
    author: 'Richardino Gueva',
    thumbnailType: 'fashion-lookbook',
  },
  {
    id: 'info-design',
    title: 'Information Design: Storytelling with Data in Adobe Illustrator',
    category: 'Design',
    label: 'ui-design',
    labelName: 'UI Design',
    rating: 4.8,
    reviews: '1,200',
    level: 'Level Course',
    author: 'Richardino Gueva',
    thumbnailType: 'info-design',
  },
  {
    id: 'web-mobile-design',
    title: 'Complete Web & Mobile Designer in 2023: UI/UX, Figma, +more',
    category: 'Design',
    label: 'ui-design',
    labelName: 'UI Design',
    rating: 4.8,
    reviews: '1,200',
    level: 'Level Course',
    author: 'Richardino Gueva',
    thumbnailType: 'web-mobile',
  },
  {
    id: 'web-design-webflow',
    title: 'Complete Web Design: from Figma to Webflow to Freelancing',
    category: 'Design',
    label: 'ux-design',
    labelName: 'UX Design',
    rating: 4.8,
    reviews: '1,200',
    level: 'Level Course',
    author: 'Richardino Gueva',
    thumbnailType: 'web-design',
  },
  {
    id: 'learn-figma-essentials',
    title: 'Learn Figma: User Interface Design Essentials - UI/UX Design',
    category: 'Design',
    label: 'ui-design',
    labelName: 'UI Design',
    rating: 4.8,
    reviews: '1,200',
    level: 'Level Course',
    author: 'Richardino Gueva',
    thumbnailType: 'learn-figma',
  },
];

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const labelFilter = searchParams.get('label');
  const searchQuery = searchParams.get('search') || '';

  // Local state for interactive filters
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, boolean>>({});

  const handleEnroll = (courseId: string) => {
    setEnrolledCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // Filter courses based on label, search query, and level
  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesLabel = !labelFilter || course.label === labelFilter;
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === 'all' ||
      (selectedLevel === 'beginner' && course.level === 'Beginner') ||
      (selectedLevel === 'level-course' && course.level === 'Level Course');

    return matchesLabel && matchesSearch && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Breadcrumbs & Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <span
              onClick={() => router.push('/courses')}
              className="text-[#2db39b] hover:underline cursor-pointer"
            >
              All Courses
            </span>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-500">
              {labelFilter === 'ui-design'
                ? 'UI Design'
                : labelFilter === 'ux-design'
                ? 'UX Design'
                : 'Design'}
            </span>
          </div>

          {/* Page Title */}
          <h1 className="text-2xl font-bold text-[#0a192f] tracking-tight">
            {labelFilter === 'ui-design'
              ? 'UI Design Courses'
              : labelFilter === 'ux-design'
              ? 'UX Design Courses'
              : 'Design Courses'}
          </h1>
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-medium text-sm transition-all duration-200 ${
              showFilters || selectedLevel !== 'all'
                ? 'bg-[#2db39b] text-white border-[#2db39b] shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>

          {/* Filter Popover */}
          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl p-4 z-20 space-y-3">
              <h3 className="font-semibold text-sm text-[#0a192f] border-b pb-2">Filter Options</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</label>
                <div className="space-y-1.5">
                  {[
                    { label: 'All Levels', value: 'all' },
                    { label: 'Beginner', value: 'beginner' },
                    { label: 'Level Course', value: 'level-course' },
                  ].map((level) => (
                    <label key={level.value} className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="level"
                        checked={selectedLevel === level.value}
                        onChange={() => setSelectedLevel(level.value)}
                        className="rounded text-[#2db39b] focus:ring-[#2db39b]"
                      />
                      {level.label}
                    </label>
                  ))}
                </div>
              </div>

              {labelFilter && (
                <button
                  onClick={() => router.push('/courses')}
                  className="w-full text-center text-xs font-semibold text-red-500 hover:text-red-600 pt-2 border-t mt-2"
                >
                  Clear Category Filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info banner for search or label filters */}
      {(labelFilter || searchQuery) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#f0fcf9] border border-[#a2dcd1] rounded-xl px-4 py-3 text-sm text-gray-800 gap-2">
          <div className="flex items-center gap-2">
            <span>
              Showing {filteredCourses.length} courses matching{' '}
              {searchQuery && (
                <span>
                  search &quot;<strong className="text-gray-900">{searchQuery}</strong>&quot;
                </span>
              )}
              {searchQuery && labelFilter && ' and '}
              {labelFilter && (
                <span>
                  category <strong className="text-gray-900">{labelFilter === 'ui-design' ? 'UI Design' : 'UX Design'}</strong>
                </span>
              )}
            </span>
          </div>
          <button
            onClick={() => router.push('/courses')}
            className="text-xs font-bold text-[#2db39b] hover:underline self-start sm:self-auto shrink-0"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Main Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Custom SVG Mockup Thumbnail based on Type */}
              <div className="h-48 relative overflow-hidden flex items-center justify-center p-4 select-none">
                {course.thumbnailType === 'figma-beginners' && (
                  <div className="absolute inset-0 bg-[#ecf3fe] flex flex-col items-center justify-center p-4">
                    {/* Floating Figma Icon Badge */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md z-10">
                      <svg className="w-6 h-6" viewBox="0 0 16 24" fill="none">
                        <path d="M4 6a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" fill="#F24E1E" />
                        <path d="M12 6a4 4 0 0 1-4 4H8v4h4V6z" fill="#FF7262" />
                        <path d="M12 14a4 4 0 0 1-4 4H8v4h4v-8z" fill="#1ABC9C" />
                        <path d="M8 18a4 4 0 1 1-4-4h4v4z" fill="#0ACF83" />
                        <path d="M4 10a4 4 0 1 1 4-4v8H4z" fill="#A259FF" />
                      </svg>
                    </div>

                    {/* Browser Mockup */}
                    <div className="w-full max-w-[85%] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-6 transform group-hover:scale-105 transition-transform duration-300">
                      {/* Browser Window Bar */}
                      <div className="bg-gray-50 px-3 py-1.5 flex items-center gap-1.5 border-b border-gray-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                      </div>
                      {/* Browser Content */}
                      <div className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="text-[14px] font-black text-gray-900 leading-tight">
                          Nothing great is <br />
                          <span className="relative">
                            made alone.
                            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-yellow-400 rounded" />
                          </span>
                        </div>
                        <div className="text-[7px] text-gray-400 font-medium max-w-[90%]">
                          Figma connects everyone in the design process so you can deliver better products, faster.
                        </div>
                        <div className="w-16 h-3 bg-[#2db39b] rounded-full" />
                      </div>
                    </div>
                  </div>
                )}

                {course.thumbnailType === 'fashion-lookbook' && (
                  <div className="absolute inset-0 bg-[#fef4e8] flex flex-col items-center justify-center p-4">
                    {/* Illustrator Ai Logo Overlay */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-[#261300] border-2 border-[#ff9a00] flex items-center justify-center shadow-md z-10">
                      <span className="text-[#ff9a00] font-black text-lg font-sans">Ai</span>
                    </div>

                    {/* Sketch Lookbook Graphics */}
                    <div className="w-full max-w-[85%] bg-white rounded-xl shadow-lg border border-orange-50/50 p-3 mt-6 flex gap-3 transform group-hover:scale-105 transition-transform duration-300">
                      {/* Left Drawing Box */}
                      <div className="flex-1 bg-amber-50/40 border border-amber-100 rounded-lg p-2 flex flex-col items-center justify-between h-24">
                        <div className="w-full flex justify-between">
                          <div className="w-2 h-2 rounded bg-amber-200" />
                          <div className="w-6 h-1 bg-amber-200 rounded" />
                        </div>
                        {/* Dress Silhouette SVG */}
                        <svg className="w-10 h-16 text-amber-900/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2v6M9 8h6l-2 12H11L9 8z M10 20h4" strokeLinecap="round" />
                        </svg>
                      </div>

                      {/* Right Grid Sketches */}
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="bg-orange-50/40 border border-orange-100 rounded-md p-1 flex items-center justify-center h-11">
                          <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M16 4h4v4M8 20H4v-4 M4 4h4v4 M20 20h-4v-4" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="bg-amber-50/30 border border-amber-100 rounded-md p-1 flex items-center justify-center h-11">
                          <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {course.thumbnailType === 'info-design' && (
                  <div className="absolute inset-0 bg-[#edf5f4] flex flex-col items-center justify-center p-4">
                    {/* Illustrator Ai Logo Overlay */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#261300] border-2 border-[#ff9a00] flex items-center justify-center shadow-md z-10">
                      <span className="text-[#ff9a00] font-black text-lg font-sans">Ai</span>
                    </div>

                    {/* Chart/Dashboard Mockup */}
                    <div className="w-full max-w-[85%] bg-white rounded-xl shadow-lg border border-teal-50/50 p-3 mt-6 flex gap-3 transform group-hover:scale-105 transition-transform duration-300">
                      {/* Left: Graphic Pie Chart and list */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="w-12 h-2 bg-gray-200 rounded" />
                          <div className="w-16 h-1.5 bg-gray-100 rounded" />
                        </div>
                        {/* Interactive Data Layout */}
                        <div className="flex items-end gap-1 h-12 pt-2">
                          <div className="w-2.5 h-6 bg-[#2db39b] rounded-t" />
                          <div className="w-2.5 h-10 bg-teal-300 rounded-t" />
                          <div className="w-2.5 h-8 bg-amber-400 rounded-t" />
                          <div className="w-2.5 h-4 bg-gray-200 rounded-t" />
                        </div>
                      </div>
                      {/* Right: Pie Chart Layout */}
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-14 h-14 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
                          <div className="absolute inset-0 rounded-full border-8 border-[#2db39b] border-t-transparent border-l-transparent transform rotate-45" />
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                        </div>
                        <div className="w-12 h-1.5 bg-gray-100 rounded mt-2" />
                      </div>
                    </div>
                  </div>
                )}

                {course.thumbnailType === 'web-mobile' && (
                  <div className="absolute inset-0 bg-[#f5f3ff] flex flex-col items-center justify-center p-4">
                    {/* Floating Figma Icon Badge */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md z-10">
                      <svg className="w-6 h-6" viewBox="0 0 16 24" fill="none">
                        <path d="M4 6a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" fill="#F24E1E" />
                        <path d="M12 6a4 4 0 0 1-4 4H8v4h4V6z" fill="#FF7262" />
                        <path d="M12 14a4 4 0 0 1-4 4H8v4h4v-8z" fill="#1ABC9C" />
                        <path d="M8 18a4 4 0 1 1-4-4h4v4z" fill="#0ACF83" />
                        <path d="M4 10a4 4 0 1 1 4-4v8H4z" fill="#A259FF" />
                      </svg>
                    </div>

                    {/* Responsive Screens Mockup */}
                    <div className="w-full max-w-[85%] flex items-end justify-center gap-3 mt-6 transform group-hover:scale-105 transition-transform duration-300">
                      {/* Web Layout Mockup */}
                      <div className="flex-1 bg-white rounded-xl shadow-lg border border-purple-50 p-2.5 h-24">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-1.5 bg-purple-200 rounded" />
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-100" />
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-100" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="w-full h-8 bg-purple-50/50 rounded flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[8px] text-purple-400">UI</div>
                          </div>
                          <div className="w-12 h-1 bg-gray-200 rounded" />
                        </div>
                      </div>

                      {/* Mobile Layout Mockup */}
                      <div className="w-14 bg-white rounded-xl shadow-lg border border-purple-50 p-2 h-28 flex flex-col justify-between">
                        <div className="w-6 h-1 bg-gray-200 rounded-full mx-auto" />
                        <div className="flex-1 my-2 bg-purple-50/40 rounded p-1 flex flex-col justify-between">
                          <div className="w-3 h-3 rounded-full bg-purple-200" />
                          <div className="space-y-1">
                            <div className="w-full h-1 bg-purple-100 rounded" />
                            <div className="w-6 h-1 bg-purple-100 rounded" />
                          </div>
                        </div>
                        <div className="w-5 h-2 bg-purple-600 rounded-full mx-auto" />
                      </div>
                    </div>
                  </div>
                )}

                {course.thumbnailType === 'web-design' && (
                  <div className="absolute inset-0 bg-[#ecf7ff] flex flex-col items-center justify-center p-4">
                    {/* Webflow W Logo Overlay */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#4353ff] flex items-center justify-center shadow-md z-10 text-white font-extrabold text-lg italic">
                      W
                    </div>

                    {/* Editor Layout Mockup */}
                    <div className="w-full max-w-[85%] bg-white rounded-xl shadow-lg border border-blue-50/50 mt-6 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                      {/* Top Controls */}
                      <div className="bg-gray-900 text-white px-2 py-1 flex items-center justify-between text-[6px]">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4353ff]" />
                          <span>Navigator</span>
                        </div>
                        <div className="flex gap-1.5">
                          <div className="w-4 h-1.5 bg-gray-700 rounded-sm" />
                          <div className="w-4 h-1.5 bg-gray-700 rounded-sm" />
                        </div>
                      </div>
                      {/* Editor Grid */}
                      <div className="p-3 flex gap-2 h-20 bg-gray-50">
                        {/* Sidebar */}
                        <div className="w-10 bg-white border border-gray-100 rounded p-1 flex flex-col gap-1.5">
                          <div className="w-full h-2 bg-blue-100 rounded-sm" />
                          <div className="w-full h-1 bg-gray-200 rounded-sm" />
                          <div className="w-full h-1 bg-gray-200 rounded-sm" />
                          <div className="w-full h-1 bg-gray-200 rounded-sm" />
                        </div>
                        {/* Canvas */}
                        <div className="flex-1 bg-white border border-gray-100 rounded p-1.5 flex flex-col justify-between">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded bg-purple-500" />
                            <div className="w-10 h-1.5 bg-gray-200 rounded" />
                          </div>
                          <div className="w-full h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-[6px] text-white font-bold">
                            WEBLOW
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {course.thumbnailType === 'learn-figma' && (
                  <div className="absolute inset-0 bg-[#f3f4f6] flex flex-col items-center justify-center p-4">
                    {/* Floating Figma Icon Badge */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md z-10">
                      <svg className="w-6 h-6" viewBox="0 0 16 24" fill="none">
                        <path d="M4 6a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" fill="#F24E1E" />
                        <path d="M12 6a4 4 0 0 1-4 4H8v4h4V6z" fill="#FF7262" />
                        <path d="M12 14a4 4 0 0 1-4 4H8v4h4v-8z" fill="#1ABC9C" />
                        <path d="M8 18a4 4 0 1 1-4-4h4v4z" fill="#0ACF83" />
                        <path d="M4 10a4 4 0 1 1 4-4v8H4z" fill="#A259FF" />
                      </svg>
                    </div>

                    {/* Figma Canvas Mockup */}
                    <div className="w-full max-w-[85%] bg-white rounded-xl shadow-lg border border-gray-100 mt-6 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                      {/* Toolbar */}
                      <div className="bg-[#2c2c2c] text-white py-1 px-2.5 flex items-center gap-1.5 text-[6px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <div className="w-3 h-1.5 bg-gray-700 rounded-sm" />
                        <div className="w-3 h-1.5 bg-gray-700 rounded-sm" />
                        <div className="w-3 h-1.5 bg-gray-700 rounded-sm" />
                        <div className="w-3 h-1.5 bg-gray-700 rounded-sm" />
                      </div>
                      {/* Workspace */}
                      <div className="flex h-20 text-[6px]">
                        {/* Layers Sidebar */}
                        <div className="w-12 border-r border-gray-100 p-1 bg-gray-50 flex flex-col gap-1">
                          <div className="font-semibold text-gray-500">Layers</div>
                          <div className="w-full h-1 bg-gray-200 rounded" />
                          <div className="w-full h-1 bg-gray-200 rounded" />
                          <div className="w-full h-1 bg-gray-200 rounded" />
                        </div>
                        {/* Canvas Area */}
                        <div className="flex-1 bg-[#f0f0f0] relative flex items-center justify-center p-2">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                            <svg className="w-5 h-5" viewBox="0 0 16 24" fill="none">
                              <path d="M4 6a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" fill="#F24E1E" />
                              <path d="M12 6a4 4 0 0 1-4 4H8v4h4V6z" fill="#FF7262" />
                              <path d="M12 14a4 4 0 0 1-4 4H8v4h4v-8z" fill="#1ABC9C" />
                              <path d="M8 18a4 4 0 1 1-4-4h4v4z" fill="#0ACF83" />
                              <path d="M4 10a4 4 0 1 1 4-4v8H4z" fill="#A259FF" />
                            </svg>
                          </div>
                        </div>
                        {/* Properties Panel */}
                        <div className="w-12 border-l border-gray-100 p-1 bg-gray-50 flex flex-col gap-1">
                          <div className="font-semibold text-gray-500">Design</div>
                          <div className="w-8 h-1.5 bg-gray-200 rounded-sm" />
                          <div className="w-8 h-1.5 bg-gray-200 rounded-sm" />
                          <div className="w-full border-t border-gray-100 my-0.5" />
                          <div className="w-8 h-1.5 bg-[#2db39b] rounded-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1 bg-white space-y-4">
                {/* Category tag */}
                <div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {course.category}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="font-bold text-[#0a192f] text-base leading-snug line-clamp-2 min-h-[2.75rem] group-hover:text-[#2db39b] transition-colors">
                  {course.title}
                </h3>

                {/* Creator */}
                <p className="text-xs text-gray-400 font-medium">A Course by {course.author}</p>

                {/* Rating and Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pt-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="font-bold text-gray-800">{course.rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span>({course.reviews})</span>
                  <span className="text-gray-300">•</span>
                  <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100">
                    {course.level}
                  </span>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={() => handleEnroll(course.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 cursor-pointer ${
                    enrolledCourses[course.id]
                      ? 'bg-[#0a192f] text-white hover:bg-[#122847]'
                      : 'bg-[#2db39b] text-white hover:bg-[#239580] hover:shadow-md'
                  }`}
                >
                  {enrolledCourses[course.id] ? 'Enrolled ✅' : 'Enroll Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#0a192f]">No courses found</h2>
          <p className="text-sm text-gray-500">
            We couldn&apos;t find any courses matching your filters. Try search query, another category or reset filters.
          </p>
          <button
            onClick={() => {
              router.push('/courses');
              setSelectedLevel('all');
            }}
            className="bg-[#2db39b] hover:bg-[#239580] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExploreCoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin w-8 h-8 text-[#2db39b]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-gray-500">Loading courses...</p>
          </div>
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}

'use client';

import { useState, useCallback } from 'react';
import {
  Search,
  BookOpen,
  Loader2,
  PlayCircle,
  Clock,
  ChevronRight,
  Play,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

interface EnrolledCourse {
  id: string;
  title: string;
  instructorName?: string;
  thumbnailUrl?: string;
  mentorPicture?: string;
  instructorImage?: string;
  bgGradient?: string;
  metaDuration?: string;
  hours?: string;
  category?: string;
  videos?: any[];
}


export default function ActiveCoursesPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Parse enrolled courses from user store
  const enrolledCourses: EnrolledCourse[] = (user?.enrolledCourses || [])
    .filter((c: any) => c && typeof c === 'object' && c.title)
    .map((c: any) => ({
      id: c._id || c.id,
      title: c.title,
      instructorName: c.instructorName || c.authorName || '',
      thumbnailUrl: c.thumbnailUrl || c.mentorPicture || c.instructorImage || '',
      mentorPicture: c.mentorPicture,
      instructorImage: c.instructorImage,
      bgGradient: c.bgGradient || 'from-indigo-50 to-purple-600',
      metaDuration: c.metaDuration || '',
      hours: c.hours || '',
      category: c.category || '',
    }));

  const filteredCourses =
    activeTab === 'active'
      ? enrolledCourses.filter(
          (c) =>
            !searchQuery ||
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.instructorName || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const handlePlayCourse = useCallback((course: EnrolledCourse) => {
    router.push(`/dashboard/activecourses/${course.id}`);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const thumbnailSrc = (c: EnrolledCourse) =>
    c.thumbnailUrl || c.mentorPicture || c.instructorImage || '';

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 font-sans pt-6">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 w-full">
          {(['active', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-12 text-base transition-all duration-200 outline-none border-b-[3px] -mb-[1px] capitalize ${
                activeTab === tab
                  ? 'text-slate-900 font-bold border-[#4f46e5]'
                  : 'text-slate-400 font-medium hover:text-slate-600 border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for a course"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors pr-10"
          />
          <Search className="w-5 h-5 text-slate-800 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Course Thumbnail Cards Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-2">
            {filteredCourses.map((course) => {
              const imgSrc = thumbnailSrc(course);
              const duration = course.metaDuration
                ? `${course.metaDuration} hrs`
                : course.hours || '';

              return (
                <div
                  key={course.id}
                  onClick={() => handlePlayCourse(course)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
                >
                  {/* Thumbnail with play overlay */}
                  <div
                    className={`relative h-44 bg-gradient-to-br ${course.bgGradient || 'from-indigo-500 to-purple-600'} overflow-hidden`}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={course.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-14 h-14 text-white/30" />
                      </div>
                    )}

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                        <Play className="w-6 h-6 text-indigo-600 fill-indigo-600 ml-1" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    {duration && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" />
                        {duration}
                      </div>
                    )}
                  </div>

                  {/* Card info */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    {course.instructorName && (
                      <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[8px] font-bold shrink-0">
                          {course.instructorName.charAt(0).toUpperCase()}
                        </span>
                        {course.instructorName}
                      </p>
                    )}
                    <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-[11px] text-indigo-500 font-semibold">
                      <PlayCircle className="w-4 h-4" />
                      Continue Learning
                      <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="py-20 text-center max-w-md mx-auto space-y-5">
            <div className="w-24 h-24 flex items-center justify-center mx-auto">
              <img
                src="/UserDashBoard/empty-folder.png"
                alt="No courses"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {activeTab === 'archived'
                  ? 'No archived courses'
                  : enrolledCourses.length === 0
                  ? 'No courses yet'
                  : 'No courses found'}
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                {activeTab === 'archived'
                  ? 'You do not have any archived courses.'
                  : enrolledCourses.length === 0
                  ? "You haven't enrolled in any courses yet. Browse and buy a course to get started!"
                  : "We couldn't find any courses matching your search."}
              </p>
            </div>
            {activeTab === 'active' && enrolledCourses.length === 0 && (
              <button
                onClick={() => router.push('/all-course')}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors"
              >
                Browse Courses
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

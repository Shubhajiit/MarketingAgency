'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  PlayCircle,
  CheckCircle,
  Clock,
  BookOpen,
  AlertTriangle,
  Loader2,
  X,
  Play,
} from 'lucide-react';
import { coursesApi, CourseVideo } from '@/lib/api/courses';
import { useAuthStore } from '@/store/auth.store';

export default function CourseStudyPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const courseId = params?.id as string;

  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [courseInfo, setCourseInfo] = useState<{ title: string; instructorName?: string; metaType?: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchVideos = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await coursesApi.getCourseVideos(courseId);
      if (res.success) {
        setCourseInfo(res.data.course);
        setVideos(res.data.videos);
        if (res.data.videos.length > 0) {
          setSelectedVideo(res.data.videos[0]);
        }
      } else {
        setError(res.message || 'Could not load course videos.');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        setError('You are not enrolled in this course. Please purchase it to access the content.');
      } else if (status === 404) {
        setError('Course not found.');
      } else {
        setError('Failed to load course videos. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
      } else {
        fetchVideos();
      }
    }
  }, [authLoading, user, router, fetchVideos]);

  const handleVideoSelect = (video: CourseVideo) => {
    setSelectedVideo(video);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoEnded = () => {
    if (selectedVideo) {
      setWatchedIds((prev) => new Set([...prev, selectedVideo._id]));
      // Auto-advance to next video
      const currentIndex = videos.findIndex((v) => v._id === selectedVideo._id);
      if (currentIndex < videos.length - 1) {
        const next = videos[currentIndex + 1];
        setTimeout(() => handleVideoSelect(next), 500);
      }
    }
  };

  const progressPercent = videos.length > 0 ? Math.round((watchedIds.size / videos.length) * 100) : 0;

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading your course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center px-4 bg-black text-white font-sans">
        <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-white/60 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/all-course')}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Browse Courses
            </button>
            <button
              onClick={() => router.push('/dashboard/activecourse')}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-stretch bg-black overflow-hidden font-sans">
      {/* Close button */}
      <button
        onClick={() => router.push('/dashboard/activecourse')}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors lg:hidden"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main area */}
      <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden">
        {/* Video Player Side */}
        <div className="flex-1 flex flex-col bg-black min-h-0">
          {/* Video */}
          <div className="flex-1 flex items-center justify-center min-h-0 p-4 lg:p-6">
            {selectedVideo && selectedVideo.url ? (
              <video
                ref={videoRef}
                key={selectedVideo._id}
                className="w-full h-full max-h-[70vh] rounded-xl object-contain"
                controls
                controlsList="nodownload"
                autoPlay
                onEnded={handleVideoEnded}
              >
                <source src={selectedVideo.url} />
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/40 gap-4">
                <PlayCircle className="w-16 h-16" />
                <p className="text-sm">Select a video to start watching</p>
              </div>
            )}
          </div>

          {/* Now playing info */}
          {selectedVideo && (
            <div className="px-4 lg:px-6 pb-4 text-white shrink-0">
              <h2 className="text-base font-bold line-clamp-1">{selectedVideo.title}</h2>
              <p className="text-xs text-white/50 mt-0.5">{courseInfo?.title}</p>
              {selectedVideo.duration && (
                <div className="flex items-center gap-1 text-[11px] text-white/40 mt-1">
                  <Clock className="w-3 h-3" />
                  {selectedVideo.duration}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Lesson List */}
        <div className="w-full lg:w-[300px] shrink-0 bg-[#111] border-l border-white/10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 shrink-0 flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <h3 className="text-white text-sm font-bold truncate">{courseInfo?.title}</h3>
              <p className="text-white/40 text-xs mt-0.5">
                {videos.length} lessons
                {watchedIds.size > 0 && ` · ${watchedIds.size} watched`}
              </p>
            </div>
            {/* Close button inside sidebar header */}
            <button
              onClick={() => router.push('/dashboard/activecourse')}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lesson List */}
          <div className="flex-1 overflow-y-auto">
            {videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/30 gap-2">
                <BookOpen className="w-8 h-8" />
                <p className="text-xs text-center px-4">No videos uploaded yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {videos.map((video, idx) => {
                  const isSelected = selectedVideo?._id === video._id;
                  const isWatched = watchedIds.has(video._id);
                  const isLocked = !video.url;

                  return (
                    <li key={video._id}>
                      <button
                        onClick={() => !isLocked && handleVideoSelect(video)}
                        disabled={isLocked}
                        className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors
                          ${isSelected
                            ? 'bg-indigo-600/30 border-l-2 border-indigo-400'
                            : isLocked
                            ? 'opacity-40 cursor-not-allowed border-l-2 border-transparent'
                            : 'hover:bg-white/5 cursor-pointer border-l-2 border-transparent'
                            }`}
                      >
                        {/* Icon */}
                        <div className="mt-0.5 shrink-0">
                          {isWatched ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : isSelected ? (
                            <div className="w-4 h-4 rounded-full bg-indigo-400 flex items-center justify-center">
                              <Play className="w-2 h-2 text-white fill-white" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                              <span className="text-[9px] text-white/40 font-bold">{idx + 1}</span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-semibold leading-snug line-clamp-2 ${
                              isSelected ? 'text-white' : 'text-white/70'
                            }`}
                          >
                            {video.title}
                          </p>
                          {video.duration && (
                            <p className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {video.duration}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

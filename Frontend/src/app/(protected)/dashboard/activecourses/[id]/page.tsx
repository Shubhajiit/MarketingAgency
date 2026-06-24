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
  const [isClosing, setIsClosing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.push('/dashboard/activecourse');
    }, 200);
  };

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
    <div className={`fixed inset-0 z-[9999] flex items-stretch bg-black overflow-hidden font-sans ${isClosing ? 'animate-page-fade-out' : 'animate-page-fade-in'}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pageFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes sidebarSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes sidebarSlideOut {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        @keyframes playerScaleIn {
          from { opacity: 0; transform: scale(0.99); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes playerScaleOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.99); }
        }
        .animate-page-fade-in {
          animation: pageFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-page-fade-out {
          animation: pageFadeOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-sidebar-slide-in {
          animation: sidebarSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-sidebar-slide-out {
          animation: sidebarSlideOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-player-scale-in {
          animation: playerScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-player-scale-out {
          animation: playerScaleOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors lg:hidden"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main area */}
      <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden">
        {/* Video Player Side */}
        <div className={`flex-1 flex flex-col bg-black min-h-0 ${isClosing ? 'animate-player-scale-out' : 'animate-player-scale-in'}`}>
          {/* Video */}
          <div className="flex-1 flex items-center justify-center min-h-0 p-4 lg:p-6">
            {selectedVideo && selectedVideo.url ? (
              <video
                ref={videoRef}
                key={selectedVideo._id}
                className="w-full h-full max-h-[75vh] rounded-lg object-contain shadow-2xl border border-white/5"
                controls
                controlsList="nodownload"
                autoPlay
                onEnded={handleVideoEnded}
              >
                <source src={selectedVideo.url} />
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/40 gap-4">
                <PlayCircle className="w-16 h-16 text-white/20" />
                <p className="text-sm">Select a video to start watching</p>
              </div>
            )}
          </div>

          {/* Now playing info */}
          {selectedVideo && (
            <div className="px-4 lg:px-8 pb-6 text-white shrink-0">
              <h2 className="text-lg font-bold line-clamp-1">{selectedVideo.title}</h2>
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
        <div className={`w-full lg:w-[320px] shrink-0 bg-[#09090b] border-l border-zinc-800 flex flex-col overflow-hidden ${isClosing ? 'animate-sidebar-slide-out' : 'animate-sidebar-slide-in'}`}>
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 shrink-0 flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <h3 className="text-white text-sm font-bold truncate">{courseInfo?.title}</h3>
              <p className="text-white/40 text-xs mt-0.5">
                {videos.length} lessons
                {watchedIds.size > 0 && ` · ${watchedIds.size} watched`}
              </p>
            </div>
            {/* Close button inside sidebar header */}
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lesson List */}
          <div className="flex-1 overflow-y-auto py-2">
            {videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/30 gap-2">
                <BookOpen className="w-8 h-8" />
                <p className="text-xs text-center px-4">No videos uploaded yet.</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {videos.map((video, idx) => {
                  const isSelected = selectedVideo?._id === video._id;
                  const isWatched = watchedIds.has(video._id);
                  const isLocked = !video.url;

                  return (
                    <li key={video._id} className="px-2">
                      <button
                        onClick={() => !isLocked && handleVideoSelect(video)}
                        disabled={isLocked}
                        className={`w-full text-left px-3 py-2.5 flex items-start gap-3 rounded-lg transition-all duration-200
                          ${isSelected
                            ? 'bg-[#1b2a60] text-white shadow-sm'
                            : isLocked
                            ? 'opacity-30 cursor-not-allowed text-white/40'
                            : 'hover:bg-white/5 cursor-pointer text-white/70 hover:text-white'
                            }`}
                      >
                        {/* Icon */}
                        <div className="mt-0.5 shrink-0">
                          {isWatched ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : isSelected ? (
                            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                              <Play className="w-2 h-2 text-[#1b2a60] fill-[#1b2a60]" />
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
                              isSelected ? 'text-white font-bold' : 'text-white/80'
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

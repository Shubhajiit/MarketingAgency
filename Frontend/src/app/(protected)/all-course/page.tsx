'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, Star, Clock, ShoppingCart, CheckCircle, Loader2, Zap, Lock } from 'lucide-react';
import { coursesApi } from '@/lib/api/courses';
import { Course } from '@/components/common/CoursesCardsUI';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api/auth';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const TABS = [
  { id: 'all', label: 'All Courses' },
  { id: 'popular', label: 'Popular' },
  { id: 'pro-specialist', label: 'Pro & Specialist' },
  { id: 'short', label: 'Short Courses' },
  { id: 'advanced', label: 'Advanced' },
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function AllCoursesPage() {
  const router = useRouter();
  const { user, setAuth, token } = useAuthStore();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [payingCourseId, setPayingCourseId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    coursesApi.list().then((res) => {
      setCourses(res?.data?.courses || []);
      setLoading(false);
    });
  }, []);

  const isEnrolled = useCallback(
    (course: Course) => {
      const cid = (course as any)._id || course.id;
      return user?.enrolledCourses?.some((ec: any) => {
        const ecId = typeof ec === 'object' ? ec._id || ec.id : ec;
        return ecId?.toString() === cid?.toString();
      });
    },
    [user]
  );

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res?.data?.user) {
        setAuth(res.data.user, token || undefined);
      }
    } catch (_) {}
  }, [setAuth, token]);

  const handleBuyNow = async (course: Course) => {
    const cid = (course as any)._id || course.id;

    if (!user) {
      router.push('/login');
      return;
    }

    if (isEnrolled(course)) {
      router.push(`/dashboard/courses/${cid}`);
      return;
    }

    setPayingCourseId(cid);

    try {
      const orderRes = await coursesApi.createCourseOrder(cid);

      // Free course — auto enrolled
      if (orderRes.free) {
        await refreshUser();
        showToast('success', `✅ Enrolled in "${course.title}" successfully!`);
        setTimeout(() => router.push('/dashboard/activecourse'), 1500);
        return;
      }

      if (!orderRes.success || !orderRes.data?.orderId) {
        showToast('error', orderRes.message || 'Failed to create payment order.');
        return;
      }

      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        showToast('error', 'Razorpay failed to load. Please check your internet connection.');
        return;
      }

      const { orderId, amount, currency, enrollmentId, keyId, courseTitle, basePrice, gstAmount, totalAmount } =
        orderRes.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'AI Scale',
        description: courseTitle,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await coursesApi.verifyCoursePayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              enrollmentId: enrollmentId!,
            });

            if (verifyRes.success) {
              await refreshUser();
              showToast('success', `🎉 Payment successful! "${courseTitle}" is now in your dashboard.`);
              setTimeout(() => router.push('/dashboard/activecourse'), 2000);
            } else {
              showToast('error', 'Payment verification failed. Contact support.');
            }
          } catch (err) {
            showToast('error', 'Something went wrong verifying payment. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        notes: {
          courseTitle,
          enrollmentId,
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: async () => {
            await coursesApi.markCoursePaymentFailed(enrollmentId!);
            showToast('error', 'Payment cancelled.');
            setPayingCourseId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async (response: any) => {
        await coursesApi.markCoursePaymentFailed(enrollmentId!);
        showToast('error', `Payment failed: ${response.error?.description || 'Unknown error'}`);
        setPayingCourseId(null);
      });

      rzp.open();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to start enrollment. Please try again.';
      showToast('error', msg);
    } finally {
      setPayingCourseId(null);
    }
  };

  const filtered = courses.filter((c) => {
    const matchesTab = activeTab === 'all' || c.category === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.title?.toLowerCase().includes(q) ||
      (c.instructorName || '').toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pb-16">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm
            ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'}`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <Zap className="w-4 h-4 shrink-0" />}
          {toast.message}
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 text-white py-14 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Professional Certification Courses
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            Learn. Grow. <span className="text-yellow-300">Succeed.</span>
          </h1>
          <p className="text-white/80 text-base md:text-lg font-medium mb-8">
            Industry-recognised courses taught by top professionals. Lifetime access to videos once enrolled.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-sm font-medium shadow-lg outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} courses</span>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No courses found</h3>
            <p className="text-sm text-slate-400 mt-1">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((course) => {
              const cid = (course as any)._id || course.id;
              const enrolled = isEnrolled(course);
              const isPaying = payingCourseId === cid;
              const courseImg = course.mentorPicture || course.instructorImage;

              return (
                <div
                  key={cid}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Thumbnail */}
                  <div
                    className={`relative h-44 bg-gradient-to-br ${course.bgGradient || 'from-indigo-500 to-purple-600'} overflow-hidden`}
                  >
                    {courseImg ? (
                      <img
                        src={courseImg}
                        alt={course.title}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[95%] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-30">
                        <BookOpen className="w-14 h-14 text-white" />
                      </div>
                    )}

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      {course.tag || course.category}
                    </div>

                    {/* Enrolled badge */}
                    {enrolled && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Enrolled
                      </div>
                    )}

                    {/* Discount pill */}
                    {course.discount && course.discount !== '0%' && (
                      <div className="absolute bottom-3 right-3 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                        {course.discount} OFF
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 flex-1">
                      {course.title}
                    </h3>

                    {course.instructorName && (
                      <p className="text-xs text-slate-500 mt-1 truncate">{course.instructorName}</p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      {course.hours && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {course.hours}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        {(course as any).metaRating || '4.8'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-xl font-black text-slate-900">
                        {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString('en-IN')}`}
                      </span>
                      {course.originalPrice > 0 && course.originalPrice !== course.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleBuyNow(course)}
                      disabled={isPaying}
                      className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2
                        ${enrolled
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                          : course.price === 0
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-200'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : enrolled ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Continue Learning
                        </>
                      ) : course.price === 0 ? (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          Enroll Free
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Buy Now · ₹{course.price.toLocaleString('en-IN')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Banner */}
        {!user && (
          <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-base">Login to Enroll</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Sign in to purchase courses and access your private video library.
              </p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shrink-0"
            >
              Login / Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { workshopApi, Workshop } from '@/lib/api/workshops';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  jobTitle: string;
  workExperience: string;
  city: string;
}

interface FormErrors {
  firstName?: boolean;
  lastName?: boolean;
  email?: boolean;
  phone?: boolean;
  jobTitle?: boolean;
  workExperience?: boolean;
  city?: boolean;
}

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
];

// ─── 404 Component ──────────────────────────────────────────
function WorkshopNotFound() {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Workshop Not Found</h1>
          <p className="text-gray-500 mb-6">The workshop you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold py-2.5 px-6 rounded text-sm transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── High-Fidelity Workshop Skeleton Loader ──────────────────
function WorkshopSkeleton() {
  return (
    <div className="flex-1 flex flex-col bg-white animate-pulse">
      <main className="flex-1 flex flex-col">
        {/* Hero Section Skeleton */}
        <section className="bg-white pt-3 md:pt-5 pb-1 md:pb-2 px-4 md:px-8 w-full flex items-center justify-center">
          <div className="max-w-8xl mx-auto w-full bg-[#FCF8F5] rounded-3xl border border-[#F2ECE4]/70 p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch min-h-[480px]">
            {/* Left: Workshop Image Box */}
            <div className="w-full lg:w-[50%] flex items-center justify-center">
              <div className="bg-white border border-[#EADFD3] rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[4/3] max-w-full lg:max-w-[520px] w-full min-h-[160px] sm:min-h-[200px] md:min-h-[300px] shadow-xs flex items-center justify-center bg-slate-200/40" />
            </div>

            {/* Right: Content details */}
            <div className="w-full lg:w-[55%] flex flex-col justify-between py-2 text-left">
              <div className="flex flex-col items-start gap-4">
                <div className="h-6 bg-slate-200/60 rounded-full w-28 border border-gray-200/20" />
                <div className="h-10 bg-slate-200/60 rounded w-4/5" />
                <div className="h-4 bg-slate-200/60 rounded w-full" />
                <div className="h-4 bg-slate-200/60 rounded w-5/6" />

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-4 md:gap-8 w-full border-t border-b border-[#E5DCD3]/50 py-4 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="h-3 bg-slate-200/60 rounded w-1/2" />
                      <div className="h-5 bg-slate-200/60 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5DCD3]/50 pt-5 mt-6 w-full">
                <div className="h-12 bg-slate-200/60 rounded-lg w-full sm:w-[280px]" />
                <div className="h-8 bg-slate-200/60 rounded w-28" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats / Details Bar Skeleton */}
        <section className="border-t border-b border-gray-200 bg-[#f8f8f8] py-8 px-4 md:px-16 w-full">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:divide-x divide-gray-300">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-start gap-3 md:px-8 first:pl-0">
                <div className="h-3 bg-slate-200/60 rounded w-1/3" />
                <div className="h-5 bg-slate-200/60 rounded w-2/3" />
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic section spacer */}
        <section className="bg-white py-16 px-4 md:px-16 w-full border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="h-8 bg-slate-200/60 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#f8f9fa] p-8 rounded-lg h-36 border border-gray-50/60" />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ─── Main Dynamic Workshop Page ─────────────────────────────
export default function DynamicWorkshopPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [showStickyBar, setShowStickyBar] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [activeModule, setActiveModule] = useState<number | null>(0);

  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+91',
    phone: '',
    jobTitle: '',
    workExperience: '',
    city: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch workshop data
  useEffect(() => {
    if (!slug) return;
    const fetchWorkshop = async () => {
      try {
        setLoading(true);
        const res = await workshopApi.getBySlug(slug);
        setWorkshop(res.data.workshop);

        // Update SEO
        document.title = `${res.data.workshop.title} - Live Workshop | AI Scale`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute("content", res.data.workshop.description?.substring(0, 160) || '');
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [slug]);

  // Scroll handler for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown timer
  useEffect(() => {
    const savedTarget = sessionStorage.getItem('workshop_timer_target');
    let targetTime: number;
    if (savedTarget) {
      targetTime = parseInt(savedTarget, 10);
    } else {
      targetTime = Date.now() + 10 * 60 * 1000;
      sessionStorage.setItem('workshop_timer_target', targetTime.toString());
    }
    const updateTimer = () => {
      const difference = targetTime - Date.now();
      if (difference <= 0) {
        const newTarget = Date.now() + 10 * 60 * 1000;
        sessionStorage.setItem('workshop_timer_target', newTarget.toString());
        setTimeLeft(600);
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => ({
    mins: Math.floor(seconds / 60).toString().padStart(2, '0'),
    secs: (seconds % 60).toString().padStart(2, '0'),
  });
  const formattedTime = formatTime(timeLeft);

  const handleScrollToBook = () => {
    setIsRegisterModalOpen(true);
  };

  const selectedCountry = countryCodes.find(c => c.code === formData.phoneCode) || countryCodes[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const selectPhoneCode = (code: string) => {
    setFormData(prev => ({ ...prev, phoneCode: code }));
    setIsCountrySelectOpen(false);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    if (!formData.firstName.trim()) { newErrors.firstName = true; isValid = false; }
    if (!formData.lastName.trim()) { newErrors.lastName = true; isValid = false; }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = true; isValid = false; }
    if (!formData.phone.trim() || !/^\d{7,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) { newErrors.phone = true; isValid = false; }
    if (!formData.jobTitle.trim()) { newErrors.jobTitle = true; isValid = false; }
    if (!formData.workExperience) { newErrors.workExperience = true; isValid = false; }
    if (!formData.city.trim()) { newErrors.city = true; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const triggerBrochureDownload = () => {
    if (workshop?.brochureUrl) {
      const link = document.createElement('a');
      link.href = workshop.brochureUrl;
      link.target = '_blank';
      link.download = `${workshop.title}_Brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Auto-generated text brochure
    const brochureText = `
=========================================
${(workshop?.title || 'Workshop').toUpperCase()}
=========================================
${workshop?.batchNumber || ''} ${workshop?.startDate ? '- Starts ' + new Date(workshop.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}

Congratulations ${formData.firstName} ${formData.lastName}!
Thank you for downloading the brochure.

-----------------------------------------
PROGRAMME HIGHLIGHTS:
-----------------------------------------
${workshop?.highlights?.map((h, i) => `${i + 1}. ${h.title}`).join('\n') || 'Details coming soon.'}

-----------------------------------------
PROGRAMME DETAILS:
-----------------------------------------
* Duration: ${workshop?.duration || 'TBD'}
* Fees: ${workshop?.fee || 'TBD'}
* Eligibility: ${workshop?.eligibility || 'TBD'}

Contact us: 1800 4122 6965
Email: contact@aiscale.com
=========================================
    `;
    const blob = new Blob([brochureText.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workshop?.title || 'Workshop'}_Brochure_${formData.firstName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessModal(true);
        setIsRegisterModalOpen(false);
        if (workshop?.hasBrochure !== false) {
          triggerBrochureDownload();
        }
      }, 1200);
    }
  };

  const handleToggleModule = (index: number) => {
    setActiveModule(activeModule === index ? null : index);
  };

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (notFound) return <WorkshopNotFound />;
  if (loading || !workshop) return <WorkshopSkeleton />;

  const checkmarkItems = workshop?.highlights?.slice(0, 4) || [];

  return (
    <div className={`flex-1 flex flex-col bg-white transition-all duration-300 ${showStickyBar ? 'pb-[130px] sm:pb-[90px]' : ''}`}>
      <main className="flex-1 flex flex-col">
        {/* Hero Section — White Card UI (dynamic from DB) */}
        {!loading && workshop && (
          <section className="bg-white pt-3 md:pt-5 pb-1 md:pb-2 px-4 md:px-8 w-full flex items-center justify-center font-sans" id="workshop-hero-section">
            <div className="max-w-8xl mx-auto w-full bg-[#FCF8F5] rounded-3xl border border-[#F2ECE4]/70 p-6 md:p-10 lg:p-12 shadow-[0_-20px_40px_rgba(255,255,255,1)] flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

              {/* Left: Workshop Image */}
              <div className="w-full lg:w-[50%] flex items-center justify-center">
                <div className="bg-transparent border-0 border-b border-gray-200/80 rounded-none overflow-hidden aspect-auto max-w-full lg:max-w-[520px] w-full h-[200px] sm:h-[240px] md:h-auto min-h-0 shadow-[0_6px_12px_rgba(255,255,255,0.95)] flex items-center justify-center md:bg-white md:border md:border-[#EADFD3] md:rounded-2xl md:aspect-[4/3] md:min-h-[300px] md:shadow-xs">
                  {workshop.thumbnail ? (
                    <img
                      src={workshop.thumbnail}
                      alt={workshop.title}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-[#C4B5A5]">
                      <svg className="w-14 h-14 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-semibold tracking-wide opacity-60">Image coming soon</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Content */}
              <div className="w-full lg:w-[55%] flex flex-col justify-between py-2 text-left font-sans gap-y-4">
                {/* Section 1: Title, Subtitle, Metadata Grid */}
                <div className="flex flex-col items-start w-full order-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#111827] leading-[1.15] tracking-tight mb-2 w-full">
                    {workshop.title}
                  </h1>
                  {workshop.subtitle && (
                    <p className="text-gray-600 text-sm md:text-[15px] font-medium leading-relaxed mb-6">
                      {workshop.subtitle}
                    </p>
                  )}

                  {/* Metadata Grid: Date / Time / Duration */}
                  <div className="grid grid-cols-3 gap-4 md:gap-8 w-full border-t border-b border-[#E5DCD3]/50 py-4 mb-2">
                    <div>
                      <span className="text-[10px] md:text-[11px] font-bold text-[#64748B] tracking-wider uppercase mb-1 block">Date</span>
                      <span className="text-sm md:text-base font-extrabold text-[#1E293B] block">
                        {workshop.startDate
                          ? new Date(workshop.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Coming Soon'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] md:text-[11px] font-bold text-[#64748B] tracking-wider uppercase mb-1 block">Time</span>
                      <span className="text-sm md:text-base font-extrabold text-[#1E293B] block">
                        {(workshop as Workshop & { workshopTime?: string }).workshopTime || 'TBD'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] md:text-[11px] font-bold text-[#64748B] tracking-wider uppercase mb-1 block">Duration</span>
                      <span className="text-sm md:text-base font-extrabold text-[#1E293B] block">
                        {workshop.duration || 'TBD'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Experts / Mentors */}
                {workshop.experts && workshop.experts.length > 0 && (
                  <div className="w-full mb-2 order-3 md:order-2 border-t md:border-t-0 border-[#E5DCD3]/30 pt-4 md:pt-0">
                    <span className="text-[10px] md:text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3.5 block">Mentors</span>
                    <div className="flex flex-wrap items-center gap-5 md:gap-8">
                      {workshop.experts.slice(0, 2).map((expert, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {expert.image ? (
                            <img
                              src={expert.image}
                              alt={expert.name}
                              className="w-10 h-10 rounded-full object-cover border border-[#E5DCD3] shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-sm font-bold shrink-0 border border-[#E5DCD3]">
                              {expert.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col text-left">
                            <span className="text-xs md:text-sm font-bold text-gray-900 leading-tight">{expert.name}</span>
                            <span className="text-[10px] md:text-[11px] font-medium text-gray-500 leading-none mt-0.5">{expert.role}</span>
                          </div>
                        </div>
                      ))}
                      {workshop.experts.length > 2 && (
                        <span className="text-xs md:text-sm font-bold text-gray-500 hover:text-gray-950 transition-colors cursor-pointer hover:underline">
                          +{workshop.experts.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Section 3: Register button + Price */}
                <div className="flex flex-row items-center justify-between gap-3 sm:gap-4 border-t-0 md:border-t border-[#E5DCD3]/50 pt-2 md:pt-5 mt-1 md:mt-2 w-full font-sans order-2 md:order-3">
                  <div className="flex items-center gap-1.5 sm:gap-3 font-sans shrink-0">
                    {workshop.fee ? (
                      <>
                        <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-sans">{workshop.fee}</span>
                        {workshop.feeNote && <span className="text-[10px] sm:text-xs font-semibold text-gray-400">{workshop.feeNote}</span>}
                      </>
                    ) : workshop.price > 0 ? (
                      <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-sans">
                        {workshop.currency === 'INR' ? '₹' : workshop.currency}{workshop.price.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-2xl sm:text-3xl font-black text-[#22c55e] tracking-tight font-sans">FREE</span>
                    )}
                  </div>

                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    id="workshop-register-btn"
                    className="bg-[#7CD19B] hover:bg-[#6ec289] active:scale-[0.98] text-[#134F2C] text-xs sm:text-sm md:text-base font-extrabold py-2.5 md:py-4 px-4 sm:px-8 rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer w-auto sm:w-[280px] justify-center font-sans shrink-0"
                  >
                    Register Now
                    <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          </section>
        )}

        {!loading && workshop && (
          <>
            {/* Stats / Details Bar */}
            <section className="border-t border-b border-gray-200 bg-[#f8f8f8] py-5 md:py-8 px-4 md:px-16 w-full z-10 font-sans" id="workshop-details-grid-bar">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-gray-300">
                <div className="flex flex-col items-start md:px-8 first:pl-0">
                  <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">STARTS ON</span>
                  <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block">
                    {formatDisplayDate(workshop.startDate) || 'TBD'}
                  </span>
                </div>
                <div className="flex flex-col items-start md:px-8">
                  <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">DURATION</span>
                  <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block mb-1">{workshop.duration || 'TBD'}</span>
                  {workshop.durationDetail && <span className="text-xs font-medium text-gray-500 leading-normal block">{workshop.durationDetail}</span>}
                </div>
                <div className="flex flex-col items-start md:px-8">
                  <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">PROGRAMME FEE</span>
                  <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block mb-1">{workshop.fee || `${workshop.currency === 'INR' ? '₹' : '$'}${workshop.price.toLocaleString()}`}</span>
                  {workshop.feeNote && <span className="text-xs font-medium text-gray-500 leading-normal block mb-1.5">{workshop.feeNote}</span>}
                  <a href="#" className="text-xs font-semibold text-gray-600 hover:text-gray-900 hover:underline leading-relaxed block transition-colors">
                    Flexible Payment Options Available
                  </a>
                </div>
                <div className="flex flex-col items-start md:pl-8 md:pr-0">
                  <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">ELIGIBILITY</span>
                  <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block mb-1.5">{workshop.eligibility || 'Open to all'}</span>
                  {workshop.eligibilityDetail && <span className="text-xs font-medium text-gray-500 leading-relaxed block">{workshop.eligibilityDetail}</span>}
                </div>
              </div>
            </section>

            {/* Application Deadline */}
            {workshop.applicationDeadline && (
              <section className="bg-white py-4 md:py-12 px-4 md:px-16 w-full flex justify-center z-10" id="workshop-application-deadline">
                <div className="w-full max-w-4xl bg-[#f5f5f5] py-6 md:py-8 px-6 text-center border border-gray-100">
                  <h2 className="text-[#444444] text-[32px] font-bold tracking-tight mb-3">Application Deadline</h2>
                  <p className="text-gray-600 text-sm md:text-base font-normal">
                    Apply by <span className="font-bold text-gray-800">{formatDisplayDate(workshop.applicationDeadline)}</span> at 11:59 PM
                  </p>
                </div>
              </section>
            )}

            {/* Who is this Programme For */}
            {workshop.targetAudience && workshop.targetAudience.length > 0 && (
              <section className="bg-white py-8 md:py-16 px-4 md:px-16 w-full border-t border-gray-100 font-sans" id="who-is-this-programme-for">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">
                  <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-tight">Who is this Programme For</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {workshop.targetAudience.map((ta, i) => (
                      <div key={i} className="bg-[#f8f9fa] p-6 md:p-8 rounded-lg flex flex-col gap-3 border border-gray-50/60 shadow-xs">
                        <h3 className="text-lg md:text-xl font-bold text-gray-950 tracking-tight">{ta.title}</h3>
                        <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed font-medium">{ta.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Programme Highlights */}
            {workshop.highlights && workshop.highlights.length > 0 && (
              <section className="bg-slate-50 py-8 md:py-16 px-4 md:px-16 w-full border-t border-b border-slate-100 font-sans" id="programme-highlights">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">
                  <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-tight">Programme Highlights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-6">
                    {workshop.highlights.map((hl, i) => (
                      <div key={i} className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                          <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <h4 className="text-sm font-bold text-gray-900 leading-tight">{hl.title}</h4>
                          {hl.description && <p className="text-gray-500 text-xs leading-relaxed font-medium">{hl.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Learning Outcomes */}
            {workshop.learningOutcomes && workshop.learningOutcomes.length > 0 && (
              <section className="bg-white py-8 md:py-16 px-4 md:px-16 w-full border-t border-gray-100 font-sans" id="learning-outcomes">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">
                  <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-tight">Learning Outcome</h2>
                  <div className="flex flex-col divide-y divide-gray-100">
                    {workshop.learningOutcomes.map((lo, i) => (
                      <div key={i} className="py-4.5 first:pt-0 last:pb-0">
                        <p className="text-gray-700 text-sm md:text-[15px] font-medium leading-relaxed">{lo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Expert Masterclasses */}
            {workshop.experts && workshop.experts.length > 0 && (
              <section className="bg-slate-50 py-8 md:py-16 px-4 md:px-16 w-full border-t border-b border-slate-100 font-sans" id="expert-masterclasses">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">
                  <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-tight">Masterclasses with Subject Matter Experts</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {workshop.experts.map((exp, i) => (
                      <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200/60 shadow-xs flex flex-row items-stretch hover:shadow-md transition-all duration-300 min-h-[140px] md:min-h-[160px]">
                        <div className="w-[120px] md:w-[150px] shrink-0 relative bg-gray-100">
                          {exp.image ? (
                            <img src={exp.image} alt={exp.name} className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-3xl font-bold">
                              {exp.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col justify-center gap-2 flex-1">
                          <h3 className="text-base md:text-lg font-bold text-gray-950 leading-snug">{exp.name}</h3>
                          {exp.role && <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">{exp.role}</p>}
                          <a href="#" className="text-[#cc0000] hover:text-[#b30000] text-xs font-bold uppercase tracking-wider flex items-center gap-1 mt-1 transition-colors hover:underline">
                            View Profile <span className="text-sm">→</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Programme Modules */}
            {workshop.modules && workshop.modules.length > 0 && (
              <section className="bg-white py-8 md:py-16 px-4 md:px-16 w-full border-t border-gray-100 font-sans" id="programme-modules">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">
                  <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-tight mb-2">Programme Modules</h2>
                  <div className="flex flex-col gap-3.5 w-full">
                    {workshop.modules.map((mod, idx) => {
                      const isOpen = activeModule === idx;
                      return (
                        <div key={idx} className="border border-gray-200/80 rounded-lg overflow-hidden bg-white shadow-xs">
                          <button
                            onClick={() => handleToggleModule(idx)}
                            className="w-full flex items-center justify-between p-5 bg-[#fcfcfc] hover:bg-[#f5f5f5] text-left transition-colors font-semibold text-gray-900 text-sm md:text-base cursor-pointer"
                          >
                            <span>{mod.title}</span>
                            <svg className={`w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] border-t border-gray-100' : 'max-h-0'}`}>
                            <div className="p-6 bg-white flex flex-col gap-3">
                              {mod.content.map((point, pIdx) => (
                                <div key={pIdx} className="flex items-start gap-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed font-medium">{point}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Download Brochure CTA */}
                  {workshop?.hasBrochure !== false && (
                    <div className="mt-8 flex flex-col items-center gap-6">
                      <p className="text-gray-500 text-xs md:text-sm text-center max-w-4xl leading-relaxed font-medium">
                        <span className="font-bold text-gray-700">Note:</span> Modules/topics are indicative only, and the suggested time and sequence may be dropped, modified, or adapted to fit the total programme hours
                      </p>
                      <button
                        onClick={handleScrollToBook}
                        className="bg-[#222222] hover:bg-black text-white font-bold py-3.5 px-8 flex items-center gap-2.5 transition-all duration-200 uppercase tracking-wider text-xs md:text-sm cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] border border-transparent rounded-sm"
                      >
                        Download Programme Brochure
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowSuccessModal(false)}></div>
          <div className="relative bg-white rounded-lg p-8 shadow-2xl max-w-md w-full border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-5 text-[#22c55e]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">
              {workshop?.hasBrochure !== false ? 'Brochure Downloaded Successfully!' : 'Registered Successfully!'}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">
              Thank you, <strong className="text-gray-900 font-semibold">{formData.firstName}</strong>.
              {workshop?.hasBrochure !== false ? (
                <> The brochure has been generated and downloaded to your device.</>
              ) : (
                <> You have successfully registered for the workshop.</>
              )}
              {workshop?.startDate && (
                <> We have also emailed you details about the upcoming batch starting on <strong className="text-gray-900 font-semibold">{formatDisplayDate(workshop.startDate)}</strong>.</>
              )}
            </p>
            <button onClick={() => setShowSuccessModal(false)} className="bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-8 rounded text-sm transition-colors w-full focus:outline-none">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Register / Brochure Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsRegisterModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl p-5 md:p-6 shadow-2xl max-w-[480px] w-full border border-gray-100 flex flex-col animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg md:text-xl font-black tracking-tight text-gray-900 mb-1 font-sans">
              {workshop?.hasBrochure !== false ? 'Register & Get Brochure' : 'Register for Workshop'}
            </h2>
            <p className="text-xs text-gray-500 font-medium mb-4">
              {workshop?.hasBrochure !== false
                ? 'Fill in your details to register and download the programme brochure.'
                : 'Fill in your details to register and book your slot.'}
            </p>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 text-left">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} id="brochure-firstName-input"
                    className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900'}`} />
                  {errors.firstName && <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1"><span className="text-xs">⚠️</span> Required</span>}
                </div>
                <div className="flex flex-col">
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} id="brochure-lastName-input"
                    className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900'}`} />
                  {errors.lastName && <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1"><span className="text-xs">⚠️</span> Required</span>}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} id="brochure-email-input"
                  className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900'}`} />
                {errors.email && <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1"><span className="text-xs">⚠️</span> Required</span>}
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <div className="flex flex-row relative">
                  <button type="button" onClick={() => setIsCountrySelectOpen(!isCountrySelectOpen)} id="phone-code-select-toggle"
                    className="flex items-center gap-1 px-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l hover:bg-gray-100 transition-colors select-none text-sm shrink-0 min-w-[70px] justify-between cursor-pointer">
                    <span className="text-base">{selectedCountry.flag}</span>
                    <svg className={`w-3 h-3 text-gray-500 transition-transform ${isCountrySelectOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isCountrySelectOpen && (
                    <div className="absolute bottom-full left-0 mb-1 w-48 bg-white border border-gray-200 rounded shadow-lg py-1 z-50 max-h-56 overflow-y-auto">
                      {countryCodes.map((c) => (
                        <button key={c.code} type="button" onClick={() => selectPhoneCode(c.code)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2.5 text-gray-700 cursor-pointer">
                          <span className="text-base shrink-0">{c.flag}</span>
                          <span className="font-semibold text-gray-900 w-10">{c.code}</span>
                          <span className="text-gray-500 truncate">{c.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none select-none text-xs text-gray-400 font-bold">
                      {formData.phoneCode}
                    </div>
                    <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} id="brochure-phone-input"
                      className={`w-full text-sm pl-12 pr-3 py-2 border rounded-r focus:outline-none transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 border-l' : 'border-gray-300 focus:border-gray-900 border-l'}`} />
                  </div>
                </div>
                {errors.phone && <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1"><span className="text-xs">⚠️</span> Required</span>}
              </div>

              {/* Job Title & Work Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleInputChange} id="brochure-jobTitle-input"
                    className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${errors.jobTitle ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900'}`} />
                  {errors.jobTitle && <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1"><span className="text-xs">⚠️</span> Required</span>}
                </div>
                <div className="flex flex-col relative">
                  <select name="workExperience" value={formData.workExperience} onChange={handleInputChange} id="brochure-workExperience-select"
                    className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors appearance-none bg-white pr-8 cursor-pointer ${errors.workExperience ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900'}`}>
                    <option value="" disabled hidden>Work Experience</option>
                    <option value="Entry Level">Entry Level (0-2 years)</option>
                    <option value="Mid Level">Mid Level (3-5 years)</option>
                    <option value="Senior Level">Senior Level (5-10 years)</option>
                    <option value="Executive Level">Executive Level (10+ years)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {errors.workExperience && <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1"><span className="text-xs">⚠️</span> Required</span>}
                </div>
              </div>

              {/* City */}
              <div className="flex flex-col">
                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} id="brochure-city-input"
                  className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${errors.city ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-gray-900'}`} />
                {errors.city && <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1"><span className="text-xs">⚠️</span> Required</span>}
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] leading-relaxed text-gray-500 mt-0.5 select-none font-medium">
                By clicking the button below, you agree to receive communications via Email/Call/WhatsApp/SMS from MICA &amp;{' '}
                <a href="#" className="underline font-semibold text-gray-600 hover:text-gray-900">Emeritus</a> about this programme. <a href="#" className="underline font-semibold text-gray-600 hover:text-gray-900">Privacy Policy</a>.
              </p>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting} id="brochure-submit-button"
                className="mt-1 bg-[#cc0000] hover:bg-[#b30000] text-white text-center font-bold py-3 px-5 rounded uppercase tracking-wider text-xs md:text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 w-full flex items-center justify-center gap-2 cursor-pointer">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {workshop?.hasBrochure !== false ? 'Downloading...' : 'Registering...'}
                  </>
                ) : (
                  workshop?.hasBrochure !== false ? 'REGISTER & DOWNLOAD BROCHURE' : 'REGISTER NOW'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      {!loading && workshop && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 bg-[#eef9ff]/95 backdrop-blur-md border-t border-blue-100 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 ease-in-out transform ${showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 158, 227, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 158, 227, 0.04) 1px, transparent 1px)`,
            backgroundSize: '14px 14px',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
          <div className="max-w-7xl mx-auto px-4 md:px-16 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 md:gap-6">
            <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-3 w-full sm:w-auto">
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 items-center justify-center text-emerald-600 shrink-0 shadow-sm hidden sm:flex">
                <svg className="w-4.5 h-4.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-row items-center gap-2">
                <span className="text-[13px] md:text-sm font-semibold text-emerald-800 tracking-tight">Free Access Ends in</span>
                <span className="text-[13px] md:text-sm font-bold text-amber-500 tracking-wide bg-amber-50 px-2 py-0.5 rounded border border-amber-100/60 shadow-sm whitespace-nowrap">
                  {formattedTime.mins} mins {formattedTime.secs} secs
                </span>
              </div>
            </div>
            <button onClick={handleScrollToBook}
              className="relative group overflow-hidden bg-[#007f00] hover:bg-[#006600] active:scale-[0.98] text-white text-[13px] md:text-sm font-bold py-3 px-4 md:px-7 rounded shadow-[0_4px_14px_rgba(0,127,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,127,0,0.35)] transition-all duration-200 shrink-0 w-full sm:w-auto flex justify-center">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
                Book your Seat Now for
                <span className="line-through text-green-200 font-semibold">₹2,999</span>
                <span className="text-yellow-300 font-extrabold uppercase animate-bounce-slow">FREE</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

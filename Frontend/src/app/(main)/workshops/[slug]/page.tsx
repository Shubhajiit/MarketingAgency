"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const outcomesRef = useRef<HTMLDivElement | null>(null);

  const scrollOutcomes = (direction: "left" | "right") => {
    const container = outcomesRef.current;
    if (!container) return;
    const firstCard = container.firstElementChild as HTMLElement;
    const scrollAmount = firstCard ? firstCard.offsetWidth + 32 : Math.max(280, Math.floor(container.clientWidth * 0.48));
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    if (slug !== 'executive-programme-in-generative-ai-business-innovation') return;
    const container = outcomesRef.current;
    if (!container) return;

    let direction: 'right' | 'left' = 'right';
    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      if (direction === 'right' && scrollLeft + clientWidth >= scrollWidth - 25) {
        direction = 'left';
      } else if (direction === 'left' && scrollLeft <= 25) {
        direction = 'right';
      }

      const firstCard = container.firstElementChild as HTMLElement;
      const cardWidth = firstCard ? firstCard.offsetWidth + 32 : Math.floor(clientWidth * 0.48);

      container.scrollBy({
        left: direction === 'right' ? cardWidth : -cardWidth,
        behavior: "smooth"
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [slug]);

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
    if ((workshop as any)?.brochureUrl) {
      const link = document.createElement('a');
      link.href = (workshop as any).brochureUrl;
      link.target = '_blank';
      link.download = `${workshop?.title || 'Workshop'}_Brochure.pdf`;
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
${(workshop as any)?.batchNumber || ''} ${(workshop as any)?.startDate ? '- Starts ' + new Date((workshop as any).startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}

Congratulations ${formData.firstName} ${formData.lastName}!
Thank you for downloading the brochure.

-----------------------------------------
PROGRAMME HIGHLIGHTS:
-----------------------------------------
${workshop?.highlights?.map((h, i) => `${i + 1}. ${h.title}`).join('\n') || 'Details coming soon.'}

-----------------------------------------
PROGRAMME DETAILS:
-----------------------------------------
* Duration: ${(workshop as any)?.duration || 'TBD'}
* Fees: ${(workshop as any)?.fee || 'TBD'}
* Eligibility: ${(workshop as any)?.eligibility || 'TBD'}

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
        if ((workshop as any)?.hasBrochure !== false) {
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

  const getCleanedTitle = () => {
    if (!workshop) return "";
    return workshop.title
      .replace(/Executive Programme in/gi, "")
      .replace(/Executive Program in/gi, "")
      .replace(/Programme in/gi, "")
      .replace(/Program in/gi, "")
      .trim();
  };

  const cleanedName = getCleanedTitle();
  const buttonPrefix = cleanedName.toLowerCase().startsWith("become") ? "" : "Become A ";
  const buttonSuffix = cleanedName.toLowerCase().endsWith("expert") ? " Now At" : " Expert Now At";

  return (
    <div className={`flex-1 flex flex-col bg-white transition-all duration-300 ${showStickyBar ? 'pb-[130px] sm:pb-[90px]' : ''}`}>
      <main className="flex-1 flex flex-col">
        {/* Hero Section — White Card UI (dynamic from DB) */}
        {!loading && workshop && (
          slug === 'executive-programme-in-generative-ai-business-innovation' ? (
            <section
              className="relative bg-white pt-4 md:pt-12 pb-24 md:pb-36 px-2 sm:px-4 md:px-8 w-full flex flex-col items-center justify-center font-sans overflow-hidden"
              id="workshop-hero-section"
              style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Centered Top Content */}
              <div className="max-w-7xl mx-auto text-center mb-6 md:mb-8 flex flex-col items-center gap-2 md:gap-3 px-1 sm:px-4 w-full">
                <h1 className="text-3xl md:text-[45px] font-semibold text-gray-900 tracking-tight leading-tight [&_u]:no-underline [&_u]:border-b-[5px] [&_u]:border-[#0052FF] [&_u]:pb-1 [&_u]:inline-block w-full max-w-none animate-fade-in">
                  One Day <span className="text-[#0052FF] font-extrabold">AI</span> <span className="">MasterClass</span>
                </h1>
                <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed max-w-3xl">
                  Learn. Implement. Grow. Master AI. Save time.
                </p>
                <p className="text-xs md:text-sm font-semibold text-black leading-relaxed max-w-4xl mt-1">
                  Take your Python skills to the next level with our intensive 30-day cohort. Learn from industry experts, work on real-world projects, and become a proficient Python developer in just one month!
                </p>
              </div>

              {/* Main Blue Bordered Card */}
              <div className="max-w-5xl mx-auto w-full bg-white rounded-2xl border-[3px] border-[#0052FF] p-5 md:p-6 lg:p-8 shadow-[6px_6px_0px_#0052FF] relative z-10 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
                {/* Left Column: Image & Logos */}
                <div className="w-full lg:w-[50%] flex flex-col justify-between gap-6">
                  <div>

                    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden aspect-[16/9] shadow-sm flex items-center justify-center">
                      <img
                        src={workshop.thumbnail || "https://res.cloudinary.com/dppgindsc/image/upload/v1780774475/workshops/lqcuatyi3elxhrqbtkdn.png"}
                        alt="0 to Hero In Python Banner"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Logos marquee: continuously scrolls right-to-left */}
                    <div className="pt-6 mt-6 px-2">
                      <div className="relative overflow-hidden">
                        <div className="marquee flex items-center gap-6" aria-hidden>
                          <div className="flex items-center gap-6">
                            <span className="text-gray-400 font-bold text-sm tracking-wider">igravity</span>
                            <img src="/Logo/ScrollingLogo/ChatGPT.png" alt="ChatGPT" className="h-6 object-contain" />
                            <img src="/Logo/ScrollingLogo/ClaudeAI.png" alt="Claude" className="h-6 object-contain" />
                            <img src="/Logo/ScrollingLogo/Gemini.png" alt="Gemini" className="h-6 object-contain" />
                            <div className="flex items-center gap-1.5">
                              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
                                <path d="M17.5 7.5C15.3 7.5 13.5 9 12 10.5C10.5 9 8.7 7.5 6.5 7.5C3.5 7.5 1 10 1 13C1 16 3.5 18.5 6.5 18.5C8.7 18.5 10.5 17 12 15.5C13.5 17 15.3 18.5 17.5 18.5C20.5 18.5 23 16 23 13C23 10 20.5 7.5 17.5 7.5ZM6.5 16C4.8 16 3.5 14.7 3.5 13C3.5 11.3 4.8 10 6.5 10C7.7 10 8.9 10.9 9.8 11.8C9.2 12.6 8.2 13.7 7.5 14.5C7.2 14.9 6.8 15.3 6.5 16ZM17.5 16C16.8 16 16.4 15.6 16.1 15.2C15.5 14.5 14.5 13.4 13.8 12.6C14.8 11.5 16 10 17.5 10C19.2 10 20.5 11.3 20.5 13C20.5 14.7 19.2 16 17.5 16Z" fill="#F97316" />
                              </svg>
                              <span className="text-[#F97316] font-bold text-sm tracking-wider">colab</span>
                            </div>
                          </div>

                          {/* duplicate for seamless loop */}
                          <div className="flex items-center gap-6">
                            <span className="text-gray-400 font-bold text-sm tracking-wider">igravity</span>
                            <img src="/Logo/ScrollingLogo/ChatGPT.png" alt="ChatGPT" className="h-6 object-contain" />
                            <img src="/Logo/ScrollingLogo/ClaudeAI.png" alt="Claude" className="h-6 object-contain" />
                            <img src="/Logo/ScrollingLogo/Gemini.png" alt="Gemini" className="h-6 object-contain" />
                            <div className="flex items-center gap-1.5">
                              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
                                <path d="M17.5 7.5C15.3 7.5 13.5 9 12 10.5C10.5 9 8.7 7.5 6.5 7.5C3.5 7.5 1 10 1 13C1 16 3.5 18.5 6.5 18.5C8.7 18.5 10.5 17 12 15.5C13.5 17 15.3 18.5 17.5 18.5C20.5 18.5 23 16 23 13C23 10 20.5 7.5 17.5 7.5ZM6.5 16C4.8 16 3.5 14.7 3.5 13C3.5 11.3 4.8 10 6.5 10C7.7 10 8.9 10.9 9.8 11.8C9.2 12.6 8.2 13.7 7.5 14.5C7.2 14.9 6.8 15.3 6.5 16ZM17.5 16C16.8 16 16.4 15.6 16.1 15.2C15.5 14.5 14.5 13.4 13.8 12.6C14.8 11.5 16 10 17.5 10C19.2 10 20.5 11.3 20.5 13C20.5 14.7 19.2 16 17.5 16Z" fill="#F97316" />
                              </svg>
                              <span className="text-[#F97316] font-bold text-sm tracking-wider">colab</span>
                            </div>
                          </div>
                        </div>

                        <style jsx>{`
                          @keyframes marquee {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                          }
                          .marquee {
                            display: flex;
                            gap: 8rem;
                            align-items: center;
                            min-width: 200%;
                            animation: marquee 16s linear infinite;
                          }
                        `}</style>
                      </div>
                    </div>
                  </div>

                  {/* Ratings Row under Logos strip */}
                  <div className="flex flex-row flex-wrap items-center gap-5 px-2 mt-2 w-full">
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center justify-start gap-4 shadow-sm w-44 md:w-52 min-h-[64px]">
                      <img src="/Rating/TrustStar.png" alt={(workshop as any).rating1Platform || "Trustpilot"} className="w-8 h-8 shrink-0 object-contain" />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-sm font-bold text-gray-900 mb-0.5">
                          {((workshop as any).rating1Value || "4.5/5")} {((workshop as any).rating1Count || "(725)")}
                        </span>
                        <span className="text-[13px] font-semibold text-gray-900 tracking-tight">
                          {((workshop as any).rating1Platform || "Trustpilot")}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center justify-start gap-4 shadow-sm w-44 md:w-52 min-h-[64px]">
                      <img src="/Rating/ReviewStar.png" alt={(workshop as any).rating2Platform || "Rating Facts"} className="w-8 h-8 shrink-0 object-contain" />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-sm font-bold text-gray-900 mb-0.5">
                          {((workshop as any).rating2Value || "4.07/5")} {((workshop as any).rating2Count || "(88)")}
                        </span>
                        <span className="text-[13px] font-semibold text-gray-900 tracking-tight">
                          {((workshop as any).rating2Platform || "Rating Facts")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Bullets, Button, Deadline */}
                <div className="w-full lg:w-[50%] flex flex-col justify-start gap-4">
                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {((workshop as any).heroPoints && (workshop as any).heroPoints.length > 0
                      ? (workshop as any).heroPoints
                      : [
                        "25 Lessons With Case Studies",
                        "Mega Webinar on Jun 14, 2026",
                        "Get Certificate Of Completion",
                        "No prior knowledge of python or AI required"
                      ]
                    ).map((text: string, idx: number) => (
                      <div key={idx} className="bg-blue-50/60 border border-blue-100/30 rounded-xl p-4 flex items-center gap-3 shadow-xs">
                        <img src="/WorkshopHeroTick/check.png" alt="check" className="w-6 h-6 object-contain shrink-0" />
                        <span className="text-xs md:text-sm font-bold text-gray-800 leading-snug">{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Yellow Button & Deadline Group */}
                  <div className="flex flex-col items-center w-full">
                    <button
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="w-full bg-[#FCD12A] hover:bg-[#E6BD22] active:scale-[0.99] text-gray-900 font-extrabold py-3 px-6 rounded-xl shadow-[0_4px_14px_rgba(252,209,42,0.35)] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                    >
                      <span className="font-semibold text-sm md:text-[17px] tracking-tight">
                        {(workshop as any).priceCaption || "Become A Python Using AI Expert Now At"}
                      </span>
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <span className="line-through text-gray-700 text-sm md:text-base font-semibold">
                          ₹{(workshop as any).originalPrice || 1999}
                        </span>
                        <span className="text-gray-900 text-lg md:text-xl font-semibold">
                          ₹{workshop.price || 199}/-
                        </span>
                      </span>
                    </button>

                    <p className="text-xs md:text-sm font-bold text-gray-800 text-center mt-3 tracking-tight">
                      {(workshop as any).bonusDeadlineText || "Register Before June 07, 2026 To Unlock All Bonuses Worth Rs. 12300"}
                    </p>

                    <div className="mt-7 w-full flex flex-col items-center">
                      <h4 className="text-sm md:text-base font-extrabold text-gray-900 tracking-wide uppercase mb-3 border-b-2 border-[#0052FF] pb-1">
                        Held On
                      </h4>
                      {(() => {
                        const datesList = (workshop as any).workshopDates && (workshop as any).workshopDates.length > 0
                          ? (workshop as any).workshopDates
                          : [
                            new Date('2026-06-03T10:00:00Z'),
                            new Date('2026-06-04T10:00:00Z'),
                            new Date('2026-06-05T10:00:00Z')
                          ];
                        const gridColsClass = datesList.length === 1
                          ? 'grid-cols-1 max-w-[150px]'
                          : datesList.length === 2
                            ? 'grid-cols-2 max-w-[320px]'
                            : 'grid-cols-3 max-w-[490px]';

                        return (
                          <div className={`grid ${gridColsClass} gap-3 md:gap-4 w-full justify-center justify-items-center`}>
                            {datesList.map((dateVal: string | Date, idx: number) => {
                              const dateObj = new Date(dateVal);
                              const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                              const dayMonth = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

                              return (
                                <div
                                  key={idx}
                                  className="w-[130px] sm:w-[150px] min-h-[72px] border-[2px] rounded-xl px-3 md:px-4 py-3 flex flex-row items-center justify-center gap-2.5 cursor-pointer transition-all bg-white border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#0052FF] hover:bg-blue-50/50 hover:shadow-[0_2px_8px_rgba(0,82,255,0.15)] hover:scale-[1.02] group"
                                >
                                  <img src="/Dates/calendar.png" alt="calendar" className="w-6 h-6 object-contain" />
                                  <div className="flex flex-col items-start text-left leading-none">
                                    <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider mb-0.5 text-gray-500 group-hover:text-[#0052FF]">
                                      {weekday}
                                    </span>
                                    <span className="text-xs md:text-sm font-semibold text-gray-900 leading-none">
                                      {dayMonth}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Spacer */}
              <div className="h-12 w-full"></div>

              {/* Instructor Card */}
              <div className="max-w-2xl w-full mx-auto flex justify-center z-10 px-4">
                <div className="w-full max-w-xl bg-white border-[2.5px] border-[#0052FF] rounded-2xl p-5 md:p-6 shadow-[6px_6px_0px_#0052FF] flex flex-row items-center gap-5">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden border-2 border-black bg-slate-900 flex items-center justify-center">
                    <img
                      src={(workshop as any).instructorImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"}
                      alt={workshop.instructor || "Aman Saurav"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] md:text-xs font-black tracking-widest text-black">INSTRUCTOR</span>
                    <h3 className="text-base md:text-[19px] font-black text-gray-950 mt-0.5 leading-tight">{workshop.instructor || "Aman Saurav"}</h3>
                    {((workshop as any).instructorDescription || "(IIT Delhi) Senior Data Analyst\nDirector at AI for Techies")
                      .split("\n")
                      .map((line: string, idx: number) => (
                        <p key={idx} className={`text-xs md:text-sm text-gray-800 font-bold leading-snug ${idx === 0 ? 'mt-1.5' : 'mt-0.5'}`}>
                          {line}
                        </p>
                      ))}
                  </div>
                </div>
              </div>

              {/* Checkmarks Grid */}
              <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6 mt-10 mb-8 z-10 px-4">
                {(workshop.learningOutcomes && workshop.learningOutcomes.length > 0
                  ? workshop.learningOutcomes
                  : [
                    "Learn Python from basic",
                    "Debug python code in seconds using AI",
                    "Create interactive visualisations in Python in minutes",
                    "Create website in Python using AI while saving 95% of time",
                    "Solve real-world case studies",
                    "Write code in python by using AI in seconds"
                  ]
                ).map((text, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <svg className="w-6.5 h-6.5 text-[#22C55E] shrink-0" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm md:text-base font-bold text-gray-800 leading-snug text-left">{text}</span>
                  </div>
                ))}
              </div>

              {/* Blue Registration CTA Button */}
              <div className="max-w-2xl w-full mx-auto mt-4 mb-6 z-10 px-4">
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="w-full bg-[#0052FF] hover:bg-[#0040D9] active:scale-[0.99] text-white font-extrabold py-3.5 px-6 rounded-lg shadow-[0_4px_14px_rgba(0,82,255,0.3)] transition-all flex flex-row items-center justify-center gap-2.5 cursor-pointer text-center text-sm md:text-lg tracking-wide"
                >
                  <span className="font-semibold">
                    {(workshop as any).priceCaption || "Become A Python Using AI Expert Now At"}
                  </span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="line-through text-blue-200 text-xs md:text-sm font-semibold">
                      ₹{(workshop as any).originalPrice || 1999}
                    </span>
                    <span className="text-white text-base md:text-xl font-black">
                      ₹{workshop.price || 199}/-
                    </span>
                  </span>
                </button>
              </div>

              {/* Natural Wavy SVG Separator */}
              <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
                <svg
                  viewBox="0 0 1440 120"
                  preserveAspectRatio="none"
                  className="relative block w-full h-[60px] md:h-[100px] lg:h-[120px]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="curve-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0052FF" stopOpacity={0.8} />
                      <stop offset="35%" stopColor="#0EA5E9" stopOpacity={0.7} />
                      <stop offset="70%" stopColor="#38BDF8" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.9} />
                    </linearGradient>
                    <linearGradient id="curve-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="#93C5FD" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#0052FF" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>

                  {/* Base white fill to cleanly mask/transition the dot background */}
                  <path
                    d="M0,80 C360,130 720,30 1080,105 C1260,130 1440,90 1440,90 L1440,120 L0,120 Z"
                    fill="#FFFFFF"
                  />

                  {/* Thin strokes representing the curves in the image */}
                  <path
                    d="M0,75 C360,125 720,25 1080,100 C1260,125 1440,85 1440,85"
                    fill="none"
                    stroke="url(#curve-grad-1)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,90 C400,130 800,40 1200,110 C1320,120 1440,95 1440,95"
                    fill="none"
                    stroke="#0052FF"
                    strokeWidth="0.75"
                    strokeOpacity={0.4}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </section>
          ) : (
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
                          {(workshop as any).startDate
                            ? new Date((workshop as any).startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Coming Soon'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] md:text-[11px] font-bold text-[#64748B] tracking-wider uppercase mb-1 block">Time</span>
                        <span className="text-sm md:text-base font-extrabold text-[#1E293B] block">
                          {(workshop as any).workshopTime || 'TBD'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] md:text-[11px] font-bold text-[#64748B] tracking-wider uppercase mb-1 block">Duration</span>
                        <span className="text-sm md:text-base font-extrabold text-[#1E293B] block">
                          {(workshop as any).duration || 'TBD'}
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
                      {(workshop as any).fee ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-sans">{(workshop as any).fee}</span>
                          {(workshop as any).feeNote && <span className="text-[10px] sm:text-xs font-semibold text-gray-400">{(workshop as any).feeNote}</span>}
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
          )
        )}

        {!loading && workshop && (
          <>
            {/* Stats / Details Bar */}
            {slug !== 'executive-programme-in-generative-ai-business-innovation' && (
              <section className="border-t border-b border-gray-200 bg-[#f8f8f8] py-5 md:py-8 px-4 md:px-16 w-full z-10 font-sans" id="workshop-details-grid-bar">
                <div className={`max-w-7xl mx-auto grid grid-cols-1 ${slug === 'executive-programme-in-generative-ai-business-innovation' ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-8 md:gap-0 md:divide-x divide-gray-300`}>
                  <div className="flex flex-col items-start md:px-8 first:pl-0">
                    <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">STARTS ON</span>
                    <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block">
                      {slug === 'executive-programme-in-generative-ai-business-innovation' ? '26 May 2026' : (formatDisplayDate((workshop as any).startDate) || 'TBD')}
                    </span>
                  </div>
                  <div className="flex flex-col items-start md:px-8">
                    <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">DURATION</span>
                    <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block mb-1">
                      {slug === 'executive-programme-in-generative-ai-business-innovation' ? '2 Weeks' : ((workshop as any).duration || 'TBD')}
                    </span>
                    {(slug === 'executive-programme-in-generative-ai-business-innovation' || (workshop as any).durationDetail) && (
                      <span className="text-xs font-medium text-gray-500 leading-normal block">
                        {slug === 'executive-programme-in-generative-ai-business-innovation' ? '3-4 hours/week' : (workshop as any).durationDetail}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start md:px-8">
                    <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">PROGRAMME FEE</span>
                    <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block mb-1 font-sans">
                      {slug === 'executive-programme-in-generative-ai-business-innovation' ? '₹149,999' : ((workshop as any).fee || `${workshop.currency === 'INR' ? '₹' : '$'}${workshop.price.toLocaleString()}`)}
                    </span>
                    {(slug === 'executive-programme-in-generative-ai-business-innovation' || (workshop as any).feeNote) && (
                      <span className="text-xs font-medium text-gray-500 leading-normal block mb-1.5">
                        {slug === 'executive-programme-in-generative-ai-business-innovation' ? 'NO GST' : (workshop as any).feeNote}
                      </span>
                    )}
                    <a href="#" className="text-xs font-semibold text-gray-600 hover:text-gray-900 hover:underline leading-relaxed block transition-colors">
                      Flexible Payment Options Available
                    </a>
                  </div>
                  {slug !== 'executive-programme-in-generative-ai-business-innovation' && (
                    <div className="flex flex-col items-start md:pl-8 md:pr-0">
                      <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">ELIGIBILITY</span>
                      <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block mb-1.5">
                        {(workshop as any).eligibility || 'Open to all'}
                      </span>
                      {(workshop as any).eligibilityDetail && (
                        <span className="text-xs font-medium text-gray-500 leading-relaxed block">
                          {(workshop as any).eligibilityDetail}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* What You'll Learn Section */}
            {((workshop.whatYouWillLearn && workshop.whatYouWillLearn.length > 0) || slug === 'executive-programme-in-generative-ai-business-innovation') && (
              <section className="bg-white py-12 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans border-b border-gray-100" id="workshop-cohort-syllabus">
                <div className="max-w-7xl w-full mx-auto flex flex-col items-center text-center">
                  <h2 className="text-2xl sm:text-[32px] font-black text-gray-900 tracking-tight leading-tight">
                    What You&apos;ll Learn
                  </h2>
                  <p className="text-gray-600 text-sm md:text-[15px] font-semibold mt-2.5 mb-10">
                    Starts from Jun 14, 2026
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 w-full text-left">
                    {(workshop.whatYouWillLearn && workshop.whatYouWillLearn.length > 0
                      ? workshop.whatYouWillLearn.map((step, idx) => ({
                        step: `Step ${idx + 1}`,
                        title: step.title,
                        tags: [step.description]
                      }))
                      : [
                        {
                          step: "Step 1",
                          title: "Social Media Handling with AI",
                          tags: [
                            "Create, schedule, analyze & grow your social media using powerful AI tools."
                          ]
                        },
                        {
                          step: "Step 2",
                          title: "Video Editing with AI",
                          tags: [
                            "Edit stunning videos, add effects, captions, transitions & more using AI."
                          ]
                        },
                        {
                          step: "Step 3",
                          title: "Thumbnail Making with AI",
                          tags: [
                            "Design eye-catching thumbnails that get more clicks using AI."
                          ]
                        },
                        {
                          step: "Step 4",
                          title: "Platform Growth with AI",
                          tags: [
                            "Use AI strategies to grow followers, increase engagement & reach."
                          ]
                        },
                        {
                          step: "Step 5",
                          title: "WhatsApp Campaigning with AI",
                          tags: [
                            "Automate messaging, build list, run campaigns & boost leads using AI."
                          ]
                        },
                        {
                          step: "Step 6",
                          title: "20 AI Tools You Must Know",
                          tags: [
                            "Hands-on with 20 powerful AI tools to simplify your workflow & boost productivity."
                          ]
                        }
                      ]
                    ).map((stepObj, idx) => {
                      const isEven = idx % 2 === 1;
                      return (
                        <div
                          key={idx}
                          className={`${isEven ? "bg-[#EAFBF0]" : "bg-[#FCF5F0]"
                            } border border-[#0052FF] shadow-[6px_6px_0px_#0052FF] rounded-2xl px-4 py-5 md:px-5 md:py-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#0052FF] transition-all duration-300`}
                        >
                          <div className="flex flex-col gap-1">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{stepObj.step}</h3>
                            <h4 className={`text-sm md:text-base font-semibold leading-snug ${isEven ? "text-[#1E7F46]" : "text-blue-600"}`}>{stepObj.title}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {stepObj.tags.filter(Boolean).map((item, i) => (
                              <div key={i} className="bg-white border border-gray-200/50 rounded-lg px-3 py-1.5 text-xs md:text-sm font-semibold text-gray-800 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:bg-gray-50 hover:scale-[1.02] transition-all duration-200 cursor-default select-none">
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Application Deadline */}
            {((workshop as any).applicationDeadline || slug === 'executive-programme-in-generative-ai-business-innovation') && (
              <section className="bg-white py-4 md:py-12 px-4 md:px-16 w-full flex justify-center z-10" id="workshop-application-deadline">
                <div className="w-full max-w-4xl p-[3px] rounded-2xl bg-gradient-to-r from-[#FF007A] via-[#7F00FF] via-[#001AFF] to-[#00E080] shadow-[0_0_30px_rgba(255,0,122,0.18),0_0_30px_rgba(0,26,255,0.18),0_0_30px_rgba(0,224,128,0.18)]">
                  <div className="w-full bg-[#f5f5f5] py-6 md:py-8 px-6 text-center rounded-[13px]">
                    <h2 className="text-[#444444] text-[32px] font-bold tracking-tight mb-3">Application <span className="text-[#0052FF]">Deadline</span></h2>
                    <p className="text-gray-600 text-sm md:text-base font-normal">
                      Apply by <span className="font-bold text-[#0052FF]">
                        {slug === 'executive-programme-in-generative-ai-business-innovation' ? '28 May 2026' : formatDisplayDate((workshop as any).applicationDeadline)}
                      </span> at 11:59 PM
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* What you'll learn in this Cohort Section */}
            {((workshop.courseOutcomes && workshop.courseOutcomes.length > 0) || slug === 'executive-programme-in-generative-ai-business-innovation') && (
              <section className="w-full bg-[#EBF5FF] pb-16 md:pb-24 relative font-sans" id="workshop-what-you-learn">
                {/* SVG Curve transition from white to light-blue */}
                <div className="w-full bg-white leading-none">
                  <svg
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                    className="w-full h-[40px] md:h-[60px] lg:h-[80px]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,40 C320,90 960,-10 1440,40 L1440,100 L0,100 Z"
                      fill="#EBF5FF"
                    />
                  </svg>
                </div>

                <div className="max-w-6xl w-full mx-auto flex flex-col px-4 md:px-8 mt-6 md:mt-10">
                  <div className="flex flex-row justify-between items-center mb-10 w-full">
                    <h2 className="text-[26px] md:text-[36px] font-bold text-gray-900 tracking-tight text-left">
                      All the details of Course Outcomes
                    </h2>

                    {/* Navigation Buttons (similar to testimonials) */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => scrollOutcomes("left")}
                        className="w-9 h-9 rounded-full border border-[#0052FF] text-[#0052FF] bg-white hover:bg-[#0052FF] hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-sm active:scale-[0.95]"
                        aria-label="Scroll outcomes left"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.78 4.22a.75.75 0 010 1.06L8.06 10l4.72 4.72a.75.75 0 11-1.06 1.06l-5.25-5.25a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollOutcomes("right")}
                        className="w-9 h-9 rounded-full border border-[#0052FF] text-[#0052FF] bg-white hover:bg-[#0052FF] hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-sm active:scale-[0.95]"
                        aria-label="Scroll outcomes right"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.22 15.78a.75.75 0 010-1.06L11.94 10 7.22 5.28a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 01-1.06 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div
                    ref={outcomesRef}
                    className="flex gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatory w-full scroll-smooth pb-4"
                  >
                    {(workshop.courseOutcomes && workshop.courseOutcomes.length > 0
                      ? workshop.courseOutcomes
                      : [
                          {
                            image: "/DemoPicture/workdetails1.png",
                            title: "Generate Codes in any language with AI",
                            description: "Discover how AI streamlines data processing, transforming raw data into actionable insights swiftly."
                          },
                          {
                            image: "/DemoPicture/workdetails2.png",
                            title: "Manage data efficiently with AI",
                            description: "Discover how AI streamlines data processing, transforming raw data into actionable insights swiftly."
                          },
                          {
                            image: "/DemoPicture/workdetails1.png",
                            title: "Generate Codes in any language with AI",
                            description: "Discover how AI streamlines data processing, transforming raw data into actionable insights swiftly."
                          },
                          {
                            image: "/DemoPicture/workdetails2.png",
                            title: "Manage data efficiently with AI",
                            description: "Discover how AI streamlines data processing, transforming raw data into actionable insights swiftly."
                          }
                        ]
                    ).map((outcome, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center w-[85%] md:w-[48%] shrink-0 snap-start">
                        <div className="w-full bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-2">
                          <img
                            src={outcome.image || "/DemoPicture/workdetails1.png"}
                            alt={outcome.title}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                        <h3 className="text-lg md:text-xl lg:text-[22px] font-bold text-gray-950 mt-6 mb-3 px-2">
                          {outcome.title}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed max-w-sm px-2">
                          {outcome.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* What is this program for Section */}
            {slug === 'executive-programme-in-generative-ai-business-innovation' && (
              <section className="bg-white py-12 md:py-16 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans border-b border-gray-100" id="workshop-program-for">
                <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center">
                  <h2 className="text-[26px] md:text-[36px] font-bold text-gray-900 tracking-tight mb-12">
                    What is this program for?
                  </h2>

                  {/* 3 Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-4xl justify-center items-start mb-12">
                    {/* Student */}
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-40 h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                        <img
                          src="/LandingPage/student_3d.png"
                          alt="Student"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-lg md:text-xl font-bold text-gray-800">Student</span>
                    </div>

                    {/* Working Professionals */}
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-40 h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                        <img
                          src="/LandingPage/professional_3d.png"
                          alt="Working Professionals"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-lg md:text-xl font-bold text-gray-800">Working Professionals</span>
                    </div>

                    {/* Job Seekers */}
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-40 h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                        <img
                          src="/LandingPage/job_seeker_3d.png"
                          alt="Job Seekers"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-lg md:text-xl font-bold text-gray-800">Job Seekers</span>
                    </div>
                  </div>

                  {/* Blue CTA Button */}
                  <div className="max-w-2xl w-full mx-auto z-10 px-4">
                    <button
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="w-full bg-[#0052FF] hover:bg-[#0040D9] active:scale-[0.99] text-white font-extrabold py-4 px-6 rounded-xl shadow-[0_4px_14px_rgba(0,82,255,0.3)] transition-all flex flex-row items-center justify-center gap-2 cursor-pointer text-center text-sm md:text-lg tracking-wide"
                    >
                      <span className="font-semibold">{(workshop as any).priceCaption || "Become A Python Using AI Expert Now At"}</span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="line-through text-blue-200 text-xs md:text-sm font-semibold">₹{(workshop as any).originalPrice || 1999}</span>
                        <span className="text-white text-base md:text-xl font-semibold">₹{workshop.price || 199}/-</span>
                      </span>
                    </button>

                    <p className="text-xs md:text-sm font-bold text-gray-800 text-center mt-4 tracking-tight">
                      {(workshop as any).bonusDeadlineText || "Register Before June 07, 2026 To Unlock All Bonuses Worth Rs. 12300"}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Did You Know? Section */}
            {slug === 'executive-programme-in-generative-ai-business-innovation' && (
              <section className="bg-[#EBF5FF]/50 py-12 md:py-16 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans border-b border-blue-100" id="workshop-did-you-know">
                <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center">
                  <h2 className="text-[26px] md:text-[36px] font-black text-gray-900 tracking-tight mb-2">
                    Did You Know?
                  </h2>
                  <p className="text-gray-800 text-sm md:text-[17px] font-bold max-w-2xl leading-relaxed mb-10 px-2">
                    You can upskill yourself in AI and switch from service-based company to product-based company with minimum of 180% salary hike
                  </p>

                  {/* 3 Salary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl justify-center items-stretch mb-10">
                    {/* Card 1: 4 LPA */}
                    <div className="bg-white rounded-xl border-[1.5px] border-slate-500 p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-300">
                      <span className="text-4xl md:text-5xl font-black text-gray-950 mb-3 tracking-tight">4 LPA</span>
                      <p className="text-gray-700 text-sm md:text-[15px] font-bold leading-relaxed max-w-xs">
                        Average salary of a Python Developer
                      </p>
                    </div>

                    {/* Card 2: 8 LPA */}
                    <div className="bg-white rounded-xl border-[1.5px] border-slate-500 p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-300">
                      <span className="text-4xl md:text-5xl font-black text-gray-950 mb-3 tracking-tight">8 LPA</span>
                      <p className="text-gray-700 text-sm md:text-[15px] font-bold leading-relaxed max-w-xs">
                        Average salary of a Python Developer with 3 years of experience
                      </p>
                    </div>

                    {/* Card 3: 21 LPA */}
                    <div className="bg-white rounded-xl border-[1.5px] border-slate-500 p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-300">
                      <span className="text-4xl md:text-5xl font-black text-gray-950 mb-3 tracking-tight">21 LPA</span>
                      <p className="text-gray-700 text-sm md:text-[15px] font-bold leading-relaxed max-w-xs">
                        Average salary of a Python Developer with 3 years of experience who uses AI
                      </p>
                    </div>
                  </div>

                  {/* Blue CTA Button */}
                  <div className="max-w-2xl w-full mx-auto z-10 px-4">
                    <button
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="w-full bg-[#0052FF] hover:bg-[#0040D9] active:scale-[0.99] text-white font-extrabold py-4 px-6 rounded-xl shadow-[0_4px_14px_rgba(0,82,255,0.3)] transition-all flex flex-row items-center justify-center gap-2 cursor-pointer text-center text-sm md:text-lg tracking-wide"
                    >
                      <span className="font-semibold">{(workshop as any).priceCaption || "Become A Python Using AI Expert Now At"}</span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="line-through text-blue-200 text-xs md:text-sm font-semibold">₹{(workshop as any).originalPrice || 1999}</span>
                        <span className="text-white text-base md:text-xl font-semibold">₹{workshop.price || 199}/-</span>
                      </span>
                    </button>

                    <p className="text-xs md:text-sm font-bold text-gray-800 text-center mt-4 tracking-tight">
                      {(workshop as any).bonusDeadlineText || "Register Before June 07, 2026 To Unlock All Bonuses Worth Rs. 12300"}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Meet your Mentors Section */}
            {slug === 'executive-programme-in-generative-ai-business-innovation' && (
              <section className="bg-white py-12 md:py-16 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans border-b border-gray-100" id="workshop-meet-mentors">
                <div className="max-w-6xl w-full mx-auto flex flex-col items-center">
                  <h2 className="text-[26px] md:text-[36px] font-semibold text-gray-900 tracking-tight text-center mb-12">
                    Meet your Mentors
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-5xl">
                    {/* Left Column: Image and Name */}
                    <div className="md:col-span-5 flex flex-col items-center">
                      <div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden p-1.5 bg-gradient-to-tr from-blue-700 via-blue-500 to-indigo-900 shadow-lg">
                        <img
                          src="/LandingPage/aman_saurav.png"
                          alt="Aman Saurav"
                          className="w-full h-full object-cover rounded-[10px]"
                        />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-4 text-center">
                        Aman Saurav
                      </h3>
                    </div>

                    {/* Right Column: Details */}
                    <div className="md:col-span-7 flex flex-col items-start text-left font-sans text-gray-800">
                      {/* Checkmarks list */}
                      <div className="flex flex-col gap-3 mb-6">
                        {[
                          "IIT Delhi Alumni",
                          "Director of AI for Techies",
                          "Senior Data Analyst"
                        ].map((text, idx) => (
                          <div key={idx} className="flex items-center gap-2.5">
                            <span className="text-gray-900 font-extrabold text-sm md:text-base">✓</span>
                            <span className="text-sm md:text-base font-bold text-gray-900 leading-snug">{text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Paragraphs */}
                      <p className="text-sm md:text-[15px] font-semibold leading-relaxed mb-4 text-gray-700">
                        Hello, I'm a graduate of{" "}
                        <span className="text-blue-600 underline font-bold cursor-pointer">
                          IIT Delhi
                        </span>{" "}
                        and currently work as a{" "}
                        <span className="text-blue-600 underline font-bold cursor-pointer">
                          Senior Data Analyst
                        </span>{" "}
                        and Program{" "}
                        <span className="text-blue-600 underline font-bold italic cursor-pointer">
                          Director at AI for Techies
                        </span>
                        . With over a decade of experience in the field, I've been teaching and mentoring learners in AI/ML, data analysis, Python, Excel, SQL, and related technologies.
                      </p>

                      <p className="text-sm md:text-[15px] font-semibold leading-relaxed text-gray-700">
                        I've had the privilege of guiding{" "}
                        <span className="text-blue-600 underline font-bold cursor-pointer">
                          over 20,000 students
                        </span>{" "}
                        and{" "}
                        <span className="text-blue-600 underline font-bold cursor-pointer">
                          professionals
                        </span>{" "}
                        through their data and AI journeys. Passionate about simplifying complex concepts and building real-world skills, I aim to empower individuals to confidently step into the world of data and technology.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Frequently Asked Questions (FAQs) Section */}
            {slug === 'executive-programme-in-generative-ai-business-innovation' && (
              <section className="bg-[#EBF5FF]/30 py-12 md:py-16 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans border-b border-blue-50" id="workshop-faqs">
                <div className="max-w-5xl w-full mx-auto flex flex-col items-center text-center">
                  <h2 className="text-[26px] md:text-[36px] font-black text-gray-900 tracking-tight mb-2">
                    Frequently Asked Questions (FAQs)
                  </h2>
                  <p className="text-gray-700 text-sm md:text-base font-semibold leading-relaxed px-2">
                    We&apos;ve tried our best to answer all common queries that you might have.
                  </p>
                  <p className="text-gray-700 text-sm md:text-base font-semibold leading-relaxed mb-6 px-2">
                    For further queries, please email us at{" "}
                    <a href="mailto:hello@aifortechies.in" className="text-blue-600 underline font-bold hover:text-blue-800 transition-colors">
                      hello@aifortechies.in
                    </a>
                  </p>

                  <h3 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight mb-6 flex items-center gap-1.5 uppercase">
                    SEE YOU INSIDE THE COHORT <span>😛</span>
                  </h3>

                  {/* Blue CTA Button */}
                  <div className="max-w-2xl w-full mx-auto z-10 px-4 mb-10">
                    <button
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="w-full bg-[#0052FF] hover:bg-[#0040D9] active:scale-[0.99] text-white font-extrabold py-4 px-6 rounded-xl shadow-[0_4px_14px_rgba(0,82,255,0.3)] transition-all flex flex-row items-center justify-center gap-2 cursor-pointer text-center text-sm md:text-lg tracking-wide"
                    >
                      <span className="font-semibold">Become A Python Using AI Expert Now At</span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="line-through text-blue-200 text-xs md:text-sm font-semibold">₹1999</span>
                        <span className="text-white text-base md:text-xl font-semibold">₹199/-</span>
                      </span>
                    </button>
                  </div>

                  {/* Accordion Questions List */}
                  <div className="w-full flex flex-col gap-3.5 max-w-5xl text-left mt-4">
                    {[
                      {
                        q: "When will the cohort start?",
                        a: "The cohort starts on June 14, 2026. All live session timings and links will be shared via email and WhatsApp groups after registration."
                      },
                      {
                        q: "Is there any prerequisite required?",
                        a: "No prior coding or programming experience is required. We start completely from scratch (0 to Hero level) and guide you step-by-step."
                      },
                      {
                        q: "Is it a certified cohort?",
                        a: "Yes, you will receive a verified Certificate of Completion upon successfully finishing all modules and projects."
                      },
                      {
                        q: "Do you get notes & assignments to practice?",
                        a: "Yes, all lessons are accompanied by detailed notes, AI prompts, practice code notebooks, and hands-on assignments."
                      },
                      {
                        q: "Is there any age limit for the cohort?",
                        a: "There is no age limit. Whether you are a school student, college student, working professional, or career switcher, this program is designed for everyone."
                      }
                    ].map((item, idx) => {
                      const isOpen = openFaq === idx;
                      return (
                        <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs transition-all duration-300">
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between p-5 text-left transition-colors font-bold text-gray-900 text-sm md:text-base cursor-pointer bg-white hover:bg-slate-50/50"
                          >
                            <span>{item.q}</span>
                            <svg className={`w-4 h-4 text-gray-800 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                            </svg>
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 text-gray-600 text-sm md:text-[15px] font-medium border-t border-slate-100 bg-white leading-relaxed">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

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
              {(workshop as any)?.hasBrochure !== false ? 'Brochure Downloaded Successfully!' : 'Registered Successfully!'}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">
              Thank you, <strong className="text-gray-900 font-semibold">{formData.firstName}</strong>.
              {(workshop as any)?.hasBrochure !== false ? (
                <> The brochure has been generated and downloaded to your device.</>
              ) : (
                <> You have successfully registered for the workshop.</>
              )}
              {(workshop as any)?.startDate && (
                <> We have also emailed you details about the upcoming batch starting on <strong className="text-gray-900 font-semibold">{formatDisplayDate((workshop as any).startDate)}</strong>.</>
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
              {(workshop as any)?.hasBrochure !== false ? 'Register & Get Brochure' : 'Register for Workshop'}
            </h2>
            <p className="text-xs text-gray-500 font-medium mb-4">
              {(workshop as any)?.hasBrochure !== false
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
                    {(workshop as any)?.hasBrochure !== false ? 'Downloading...' : 'Registering...'}
                  </>
                ) : (
                  (workshop as any)?.hasBrochure !== false ? 'REGISTER & DOWNLOAD BROCHURE' : 'REGISTER NOW'
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

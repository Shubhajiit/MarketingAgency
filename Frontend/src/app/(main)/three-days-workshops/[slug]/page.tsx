"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { workshopApi, Workshop } from '@/lib/api/workshops';
import { X, Plus, Minus, FileText, CheckSquare, CheckCircle2, Radio, ClipboardList, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

// Import logos from WorkshopsAILogos
import AdobeFirefly from '../../../../../public/WorkshopsAILogos/AdobeFirefly.png';
import Canva from '../../../../../public/WorkshopsAILogos/Canva.png';
import ChatGPT from '../../../../../public/WorkshopsAILogos/ChatGPT.webp';
import DescriptAI from '../../../../../public/WorkshopsAILogos/DescriptAI.png';
import ElevenLabs from '../../../../../public/WorkshopsAILogos/ElevenLabs.webp';
import Grammerly from '../../../../../public/WorkshopsAILogos/Grammerly.png';
import Jasper from '../../../../../public/WorkshopsAILogos/Jasper.png';
import Lumen5 from '../../../../../public/WorkshopsAILogos/Lumen5.png';
import MidJourney from '../../../../../public/WorkshopsAILogos/MidJourney.jpg';
import NotionAI from '../../../../../public/WorkshopsAILogos/NotionAI.png';
import OpusClip from '../../../../../public/WorkshopsAILogos/OpusClip.png';
import PeechAI from '../../../../../public/WorkshopsAILogos/PeechAI.jpg';
import PictoryAI from '../../../../../public/WorkshopsAILogos/PictoryAI.png';
import QuillBot from '../../../../../public/WorkshopsAILogos/QuillBot.png';
import Runway from '../../../../../public/WorkshopsAILogos/Runway.png';
import SurferAI from '../../../../../public/WorkshopsAILogos/SurferAI.webp';
import Synthesia from '../../../../../public/WorkshopsAILogos/Synthesia.webp';
import TomeAI from '../../../../../public/WorkshopsAILogos/TomeAI.webp';
import CopyAI from '../../../../../public/WorkshopsAILogos/copyAI.png';

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

const formatThreeDaysRange = (dateVal: string | Date | null) => {
  if (!dateVal) return '';
  const dateObj = new Date(dateVal);
  const date2Obj = new Date(dateObj.getTime() + 86400000);
  const date3Obj = new Date(dateObj.getTime() + 172800000);

  const d1 = dateObj.getDate();
  const d2 = date2Obj.getDate();
  const d3 = date3Obj.getDate();

  const m1 = dateObj.toLocaleDateString('en-IN', { month: 'short' });
  const m2 = date2Obj.toLocaleDateString('en-IN', { month: 'short' });
  const m3 = date3Obj.toLocaleDateString('en-IN', { month: 'short' });

  const getSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  if (m1 === m3) {
    return `${d1}, ${d2}, ${d3}${getSuffix(d3)} ${m1}`;
  } else if (m1 === m2) {
    return `${d1}, ${d2} ${m1} - ${d3}${getSuffix(d3)} ${m3}`;
  } else {
    return `${d1} ${m1} - ${d3}${getSuffix(d3)} ${m3}`;
  }
};

const getCohortStartDates = (dates: any[]) => {
  if (!dates || dates.length === 0) return [];

  // Parse all dates, filter out invalid ones, and sort them ascending
  const sortedDates = dates
    .map(d => {
      const dateVal = typeof d === 'string' || d instanceof Date ? d : d?.date || '';
      return new Date(dateVal);
    })
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  const startDates: string[] = [];

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    if (startDates.length === 0) {
      startDates.push(currentDate.toISOString());
    } else {
      const prevStartDate = new Date(startDates[startDates.length - 1]);
      const diffTime = currentDate.getTime() - prevStartDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays > 2.5) {
        startDates.push(currentDate.toISOString());
      }
    }
  }

  return startDates;
};


const DEMO_WORKSHOP: Workshop = {
  _id: "6a114b654c96c6ea680ddd1c",
  title: "Three Days AI Workshops",
  subtitle: "Learn. Implement. Grow. Master AI. Save time.",
  description: "Join the Three Days AI Workshops to learn the fundamentals of Artificial Intelligence and explore powerful AI tools through practical demonstrations. Gain hands-on knowledge to boost productivity, automate tasks, and accelerate your growth in the AI-driven world.\n",
  instructor: "Mr. Demo Name",
  price: 8000,
  currency: "INR",
  thumbnail: "https://res.cloudinary.com/dppgindsc/image/upload/v1780912666/workshops/bkmmb72rmnn7hwzujew1.png",
  tags: ["generative-ai", "business-innovation", "automation", "prompt-engineering", "ai-tools", "digital-transformation"],
  isActive: true,
  createdAt: "2026-05-23T06:38:29.205Z",
  originalPrice: 150000,
  priceCaption: "Become Successful Using AI Expert Now At",
  bonusDeadlineText: "Register Before June 07, 2026 ",
  heroPoints: [
    "AI Fundamentals Understand the basics of Artificial Intelligence",
    "Hands-on AI Tools Learn and use popular AI platforms.",
    "Productivity Boost Automate tasks and save valuable time.",
    "Real-World Applications Apply AI skills to projects and careers."
  ],
  workshopDates: ["2026-07-16T00:00:00.000Z", "2026-06-18T00:00:00.000Z", "2026-06-19T00:00:00.000Z"],
  highlights: [
    { title: "Hands-on Capstone Project", description: "Build a real-world AI application from scratch using the tools learned." },
    { title: "Exclusive AI Toolkits", description: "Get access to premium templates, prompts, and automation scripts." },
    { title: "Direct Mentor Support", description: "Weekly live Q&A sessions with industry-leading AI experts from top tech companies." }
  ],
  modules: [
    {
      title: "Introduction to Generative AI for Business",
      content: [
        "The evolution of Generative AI and its impact on modern business ecosystems.",
        "The evolution of Generative AI and its impact on modern business ecosystems.",
        "The evolution of Generative AI and its impact on modern business ecosystems.",
        "The evolution of Generative AI and its impact on modern business ecosystems."
      ]
    },
    {
      title: "Advanced Prompt Engineering & Workflows",
      content: [
        "Mastering zero-shot, few-shot, and chain-of-thought prompting techniques.",
        "Mastering zero-shot, few-shot, and chain-of-thought prompting techniques.",
        "Mastering zero-shot, few-shot, and chain-of-thought prompting techniques.",
        "Mastering zero-shot, few-shot, and chain-of-thought prompting techniques."
      ]
    },
    {
      title: "AI Strategy & Ethical Governance",
      content: [
        "Building an AI-first culture: Change management and talent strategy."
      ]
    }
  ],
  targetAudience: [
    { title: "C-Suite Executives", description: "Leaders looking to integrate AI into their business strategy and operations." },
    { title: "Marketing Professionals", description: "Marketers aiming to automate content creation and optimize campaign performance." },
    { title: "Product Managers", description: "PMs designing AI-powered features and managing AI product lifecycles." }
  ],
  learningOutcomes: [
    "Develop a comprehensive AI implementation roadmap for your business.",
    "Master advanced prompt engineering to solve complex business problems.",
    "Understand the ethical implications and governance of AI in the enterprise."
  ],
  courseOutcomes: [
    { title: "Social Media", description: "Discover how AI streamlines data processing, transforming raw data into actionable insights swiftly.", image: "https://res.cloudinary.com/dppgindsc/image/upload/v1780865414/workshops/t0zsgq6hcazxdwyhbacq.png" },
    { title: "Social Media", description: "Discover how AI streamlines data processing, transforming raw data into actionable insights swiftly.", image: "https://res.cloudinary.com/dppgindsc/image/upload/v1780913172/workshops/czwkbrmcflrcwjrnzei1.png" },
    { title: "Social Media", description: "Discover how AI streamlines data processing, transforming raw data into actionable insights swiftly.", image: "https://res.cloudinary.com/dppgindsc/image/upload/v1780913203/workshops/yb7ljs7vom2vco8waumo.png" }
  ],
  experts: [
    { name: "Dr. Jane Doe", role: "Chief AI Scientist @ OpenAI", image: "https://avatar.iran.liara.run/public/64" }
  ],
  instructorDescription: "Senior AI & Data Analyst at Techies Lab",
  instructorImage: "https://res.cloudinary.com/dppgindsc/image/upload/v1780913044/workshops/zipjymxh5m4mazqos9nx.jpg",
  slug: "three-days-workshops",
  rating1Count: "(725)",
  rating1Platform: "Trustpilot",
  rating1Value: "4.5/5",
  rating2Count: "(88)",
  rating2Platform: "Rating Facts",
  rating2Value: "4.07/5"
};

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
        {/* Centered Top Content Skeleton */}
        <section className="relative bg-white pt-4 md:pt-12 pb-16 md:pb-36 px-2 sm:px-4 md:px-8 w-full flex flex-col items-center justify-center font-sans overflow-hidden">
          <div className="max-w-7xl mx-auto text-center mb-6 md:mb-8 flex flex-col items-center gap-3 px-1 sm:px-4 w-full">
            <div className="h-10 bg-slate-200/60 rounded w-72 md:w-96" />
            <div className="h-5 bg-slate-200/60 rounded w-64 md:w-80 mt-1" />
            <div className="h-4 bg-slate-200/40 rounded w-5/6 max-w-2xl mt-2 hidden md:block" />
          </div>

          {/* Main Blue Bordered Card Skeleton */}
          <div className="max-w-5xl mx-auto w-full bg-white rounded-2xl border-[3px] border-[#0052FF] p-5 md:p-6 lg:p-8 shadow-[6px_6px_0px_#0052FF] relative z-10 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">

            {/* Left Column Skeleton */}
            <div className="w-full lg:w-[50%] flex flex-col justify-between gap-4 lg:gap-6">
              <div>
                <div className="bg-slate-200/40 border border-gray-200 rounded-2xl overflow-hidden aspect-[16/9] w-full" />
                {/* Logos marquee placeholder */}
                <div className="pt-3 mt-3 md:pt-6 md:mt-6 px-2">
                  <div className="h-6 bg-slate-200/30 rounded w-full" />
                </div>
              </div>

              {/* Ratings Row Skeleton */}
              <div className="grid grid-cols-2 gap-3 md:flex md:flex-row md:gap-5 px-2 mt-2 w-full">
                <div className="bg-slate-200/30 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-start gap-2 sm:gap-4 shadow-sm w-full md:w-52 min-h-[60px] md:min-h-[64px]">
                  <div className="w-8 h-8 rounded-full bg-slate-200/60 shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3.5 bg-slate-200/60 rounded w-16" />
                    <div className="h-3 bg-slate-200/40 rounded w-12" />
                  </div>
                </div>
                <div className="bg-slate-200/30 border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-start gap-2 sm:gap-4 shadow-sm w-full md:w-52 min-h-[60px] md:min-h-[64px]">
                  <div className="w-8 h-8 rounded-full bg-slate-200/60 shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3.5 bg-slate-200/60 rounded w-16" />
                    <div className="h-3 bg-slate-200/40 rounded w-12" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="w-full lg:w-[50%] flex flex-col justify-start gap-4">
              {/* Highlights Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-slate-200/20 border border-slate-200/40 rounded-xl p-4 flex items-center gap-3 h-[64px]">
                    <div className="w-6 h-6 rounded-full bg-slate-200/60 shrink-0" />
                    <div className="h-3.5 bg-slate-200/50 rounded w-28 flex-1" />
                  </div>
                ))}
              </div>

              {/* Button & Deadline Skeleton */}
              <div className="flex flex-col items-center w-full">
                <div className="w-full bg-slate-200/60 rounded-xl h-16" />
                <div className="h-4 bg-slate-200/40 rounded w-3/4 mt-4" />

                {/* Dates Selection Skeleton */}
                <div className="mt-7 w-full flex flex-col items-center">
                  <div className="h-5 bg-slate-200/60 rounded w-20 mb-3" />
                  <div className="grid grid-cols-3 gap-3 md:gap-4 w-full justify-center max-w-[490px]">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-[130px] sm:w-[150px] h-[72px] border border-gray-200 rounded-xl px-3 py-3 flex flex-row items-center justify-center gap-2 bg-slate-200/30"
                      >
                        <div className="w-6 h-6 rounded bg-slate-200/60 shrink-0" />
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="h-3 bg-slate-200/60 rounded w-8" />
                          <div className="h-4 bg-slate-200/60 rounded w-12" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Instructor Card Skeleton */}
          <div className="max-w-2xl w-full mx-auto flex justify-center mt-12 px-4">
            <div className="w-full max-w-xl bg-white border-[2.5px] border-[#0052FF] rounded-2xl p-5 md:p-6 shadow-[6px_6px_0px_#0052FF] flex flex-row items-center gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full bg-slate-200/60" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 bg-slate-200/60 rounded w-20" />
                <div className="h-5 bg-slate-200/60 rounded w-40" />
                <div className="h-3.5 bg-slate-200/40 rounded w-48 mt-1" />
                <div className="h-3.5 bg-slate-200/40 rounded w-40" />
              </div>
            </div>
          </div>

          {/* Checkmarks Grid Skeleton */}
          <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6 mt-10 mb-8 px-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200/60 shrink-0" />
                <div className="h-4 bg-slate-200/40 rounded w-5/6 flex-1" />
              </div>
            ))}
          </div>

          {/* Register CTA Button Skeleton */}
          <div className="max-w-2xl w-full mx-auto mt-4 mb-6 px-4">
            <div className="w-full bg-slate-200/60 rounded-lg h-14" />
          </div>

        </section>
      </main>
    </div>
  );
}

function ThreeDaysWorkshopsContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isCheckout = searchParams ? searchParams.get('checkout') === 'true' : false;
  const { user, isAuthenticated, login, register, checkAuth } = useAuth();

  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const isRegistered = isAuthenticated && user?.enrolledWorkshops?.some(
    (w: any) => typeof w === 'string' ? w === workshop?._id : w?._id === workshop?._id
  );

  // ─── Date Selection ──────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showNoDateToast, setShowNoDateToast] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  // ─── Auth Modal (inline login/register) ──────────────────────
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authShowPassword, setAuthShowPassword] = useState(false);

  // ─── Booking Modal ───────────────────────────────────────────
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingWhatsapp, setBookingWhatsapp] = useState('');
  const [bookingAge, setBookingAge] = useState('');
  const [bookingProfession, setBookingProfession] = useState('');
  const [bookingErrors, setBookingErrors] = useState<{ name?: boolean; email?: boolean; phone?: boolean; whatsapp?: boolean; age?: boolean; profession?: boolean }>({});
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'paying' | 'success' | 'confirm'>('form');
  const [paymentError, setPaymentError] = useState('');
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const [showStickyBar, setShowStickyBar] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [activeModule, setActiveModule] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  // Fetch workshop data
  useEffect(() => {
    if (!slug) return;
    const fetchWorkshop = async () => {
      try {
        setLoading(true);
        const res = await workshopApi.getBySlug(slug);
        if (res.data.workshop.type && res.data.workshop.type !== 'three-days') {
          setNotFound(true);
        } else {
          setWorkshop(res.data.workshop);

          // Update SEO
          document.title = `${res.data.workshop.title} - Live Workshop | AI Scale`;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute("content", res.data.workshop.description?.substring(0, 160) || '');
          }
        }
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [slug]);

  // Sync auth state to fetch latest enrolled workshops after login or page load
  useEffect(() => {
    if (isAuthenticated && checkAuth) {
      checkAuth(true);
    }
  }, [isAuthenticated, checkAuth]);

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

  const selectedCountry = countryCodes.find(c => c.code === formData.phoneCode) || countryCodes[0];

  const selectPhoneCode = (code: string) => {
    setFormData(prev => ({ ...prev, phoneCode: code }));
    setIsCountrySelectOpen(false);
  };

  // ─── Booking Flow Handlers ──────────────────────────────────

  const handlePriceButtonClick = () => {
    if (!workshop) return;
    const rawDates = (workshop as any)?.workshopDates || [];
    const datesList = getCohortStartDates(rawDates);
    const hasMultipleDates = datesList && datesList.length > 1;

    if (hasMultipleDates && !selectedDate) {
      setShowDatePickerModal(true);
      return;
    }

    const dateToUse = selectedDate || (datesList && datesList.length > 0 ? datesList[0] : new Date().toISOString());
    if (!selectedDate) setSelectedDate(dateToUse);

    if (!isAuthenticated) {
      sessionStorage.setItem('pending_booking_workshop_id', workshop._id);
      sessionStorage.setItem('pending_booking_date', dateToUse);
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + '?checkout=true')}`);
    } else {
      router.push(`${window.location.pathname}?checkout=true`);
    }
  };

  const openBookingModal = () => {
    if (user) {
      setBookingName(user.name || '');
      setBookingEmail(user.email || '');
      setBookingPhone((user as any).phoneNumber || '');
      setBookingWhatsapp((user as any).whatsappNumber || '');
    }
    setPaymentStep('form');
    setBookingErrors({});
    setShowBookingModal(true);
    setShowAuthModal(false);
  };

  // Auto-resume booking flow if returning from login page
  useEffect(() => {
    if (isAuthenticated && workshop) {
      const pendingWorkshopId = sessionStorage.getItem('pending_booking_workshop_id');
      const pendingDate = sessionStorage.getItem('pending_booking_date');

      if (pendingWorkshopId === workshop._id) {
        if (pendingDate) {
          setSelectedDate(pendingDate);
        }
        sessionStorage.removeItem('pending_booking_workshop_id');
        sessionStorage.removeItem('pending_booking_date');
        router.push(`${window.location.pathname}?checkout=true`);
      }
    }
  }, [isAuthenticated, workshop]);

  // Prefill booking form when checkout page is opened and user is logged in
  useEffect(() => {
    if (isCheckout && user) {
      setBookingName(prev => prev || user.name || '');
      setBookingEmail(prev => prev || user.email || '');
      setBookingPhone(prev => prev || (user as any).phoneNumber || '');
      setBookingWhatsapp(prev => prev || (user as any).whatsappNumber || '');
    }
  }, [isCheckout, user]);

  // Booking form validation & submission — now shows confirmation popup
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { name?: boolean; email?: boolean; phone?: boolean; whatsapp?: boolean; age?: boolean; profession?: boolean } = {};
    if (!bookingName.trim()) errs.name = true;
    if (!bookingEmail.trim() || !/\S+@\S+\.\S+/.test(bookingEmail)) errs.email = true;
    if (!bookingPhone.trim() || !/^\d{7,15}$/.test(bookingPhone.replace(/[\s\-()]/g, ''))) errs.phone = true;
    if (!bookingWhatsapp.trim() || !/^\d{7,15}$/.test(bookingWhatsapp.replace(/[\s\-()]/g, ''))) errs.whatsapp = true;
    if (!bookingAge) errs.age = true;
    if (!bookingProfession) errs.profession = true;
    setBookingErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Show confirmation popup
    setPaymentError('');
    setPaymentStep('confirm');
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Called when user confirms in the confirmation popup
  const handleConfirmPayment = async () => {
    setBookingSubmitting(true);
    setPaymentStep('paying');
    setPaymentError('');

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setPaymentError('Failed to load payment gateway. Please check your internet connection.');
        setPaymentStep('form');
        setBookingSubmitting(false);
        return;
      }

      // 2. Create order on backend
      const orderRes = await workshopApi.createPaymentOrder({
        workshopId: workshop!._id,
        name: bookingName.trim(),
        email: bookingEmail.trim(),
        phone: bookingPhone.trim(),
        whatsappNumber: bookingWhatsapp.trim(),
        selectedDate: selectedDate || new Date().toISOString(),
        age: bookingAge || undefined,
        profession: bookingProfession || undefined,
      });

      const { orderId, amount, currency, registrationId: regId, keyId } = orderRes.data;
      setRegistrationId(regId);

      // 3. Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'AI Scale',
        description: workshop!.title,
        order_id: orderId,
        prefill: {
          name: bookingName.trim(),
          email: bookingEmail.trim(),
          contact: bookingPhone.trim(),
        },
        theme: {
          color: '#0052FF',
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            // 4. Verify payment on backend
            await workshopApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationId: regId,
            });
            if (checkAuth) {
              await checkAuth(true);
            }
            setPaymentStep('success');
          } catch {
            setPaymentError('Payment verification failed. Please contact support.');
            setPaymentStep('form');
          } finally {
            setBookingSubmitting(false);
          }
        },
        modal: {
          ondismiss: async () => {
            // User closed Razorpay without paying
            try {
              await workshopApi.markPaymentFailed(regId);
            } catch { /* silent */ }
            setPaymentStep('form');
            setBookingSubmitting(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', async () => {
        try {
          await workshopApi.markPaymentFailed(regId);
        } catch { /* silent */ }
        setPaymentError('Payment failed. Please try again.');
        setPaymentStep('form');
        setBookingSubmitting(false);
      });
      razorpayInstance.open();
    } catch (err: any) {
      setPaymentError(err?.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setPaymentStep('form');
      setBookingSubmitting(false);
    }
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

  if (isCheckout) {
    return (
      <div className="flex-1 flex flex-col bg-white min-h-screen">
        <div className="w-full bg-[#000000] text-center py-3 px-4 flex items-center justify-center min-h-[50px] shadow-sm">
          <p className="text-[#FCD12A] font-extrabold text-xs md:text-sm tracking-wide leading-snug uppercase">
            CONGRATS! YOU ARE JUST ONE STEP AWAY FROM MASTERING AI TOOLS FOR {cleanedName.toUpperCase()} USING AI
          </p>
        </div>

        <div className="flex-1 bg-white flex flex-col items-center justify-start py-8 px-4 font-sans">
          <h2 className="text-center text-gray-900 font-bold text-lg md:text-2xl tracking-tight max-w-2xl leading-snug">
            Anyone from any field can attend this workshop.
          </h2>
          <p className="text-center text-gray-800 text-sm md:text-lg font-medium mt-2 mb-8 text-black">
            Simply Pay <span className="line-through text-red-500 font-bold mx-1">₹{(workshop as any).originalPrice || 1999}</span>{" "}
            <span className="text-red-600 font-extrabold text-lg md:text-xl mx-1">₹{workshop.price || 199} + GST</span> and Get Started
          </p>

          <div className="w-full max-w-[500px] bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col mb-12">
            <div className="bg-[#0B132B] px-6 py-5 flex flex-col items-center justify-center relative">
              <button
                type="button"
                onClick={() => router.push(`${window.location.pathname}`)}
                className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer bg-transparent border-0"
                title="Go Back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-white text-xs font-semibold tracking-[0.12em] uppercase text-center max-w-[90%]">
                {cleanedName.toUpperCase()} USING AI WORKSHOP
              </span>
              {selectedDate && (
                <span className="text-white/95 text-[11px] font-bold tracking-[0.05em] uppercase mt-2 bg-white/10 px-3 py-0.5 rounded-full border border-white/15">
                  📅 {formatThreeDaysRange(selectedDate)}
                </span>
              )}
            </div>

            {paymentStep === 'success' ? (
              <div className="p-8 flex flex-col items-center text-center text-black">
                <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mb-5">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">🎉 Booking Confirmed!</h3>
                <p className="text-gray-500 text-sm font-medium mb-5 leading-relaxed">
                  Thank you, <strong className="text-gray-900">{bookingName}</strong>! You're registered for
                </p>
                <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 text-left mb-5">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Workshop</p>
                  <p className="text-sm font-bold text-gray-900 mb-2">{workshop.title}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm font-bold text-gray-900 mb-2">{selectedDate ? formatThreeDaysRange(selectedDate) : 'N/A'}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Amount Paid</p>
                  <p className="text-sm font-black text-green-600">₹{workshop.price?.toLocaleString('en-IN') || 0}/-</p>
                </div>
                <p className="text-xs text-gray-400 font-medium mb-5">Confirmation details sent to <strong className="text-gray-600">{bookingEmail}</strong> & on WhatsApp</p>
                <button
                  onClick={() => {
                    router.push(`${window.location.pathname}`);
                  }}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Go Back
                </button>
              </div>
            ) : paymentStep === 'paying' ? (
              <div className="p-10 flex flex-col items-center text-center text-black">
                <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center mb-6">
                  <svg className="animate-spin w-10 h-10 text-[#0052FF]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Opening Payment Gateway...</h3>
                <p className="text-gray-400 text-sm font-medium">Please wait, do not close this window</p>
                <div className="mt-6 w-full bg-gray-50 rounded-xl p-4 text-left">
                  <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1"><span>{workshop.title}</span><span>₹{workshop.price?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-xs text-gray-400"><span>Selected Date</span><span>{selectedDate ? formatThreeDaysRange(selectedDate) : 'N/A'}</span></div>
                </div>
              </div>
            ) : paymentStep === 'confirm' ? (
              <div className="p-6 md:p-8 flex flex-col items-center text-center text-black">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">Confirm Your Booking</h3>
                <p className="text-gray-400 text-sm font-medium mb-5">Please review your details before proceeding to payment</p>
                <div className="w-full bg-gray-50 rounded-xl p-4 text-left mb-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Name</span><span className="font-bold text-gray-900">{bookingName}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Email</span><span className="font-bold text-gray-900">{bookingEmail}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Phone</span><span className="font-bold text-gray-900">{bookingPhone}</span></div>
                  {bookingAge && <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Age</span><span className="font-bold text-gray-900">{bookingAge}</span></div>}
                  {bookingProfession && <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Profession</span><span className="font-bold text-gray-900">{bookingProfession}</span></div>}
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Workshop</span><span className="font-bold text-gray-900 text-right max-w-[60%] leading-tight">{workshop.title}</span></div>
                  {selectedDate && <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Date</span><span className="font-bold text-gray-900">{formatThreeDaysRange(selectedDate)}</span></div>}
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Workshop Fee</span><span className="font-bold text-gray-900">₹{workshop.price?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">GST (18%)</span><span className="font-bold text-gray-900">₹{Math.round((workshop.price || 0) * 0.18).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-sm font-bold pt-1 border-t border-gray-200"><span className="text-gray-900">Total</span><span className="text-green-600 font-extrabold">₹{((workshop.price || 0) + Math.round((workshop.price || 0) * 0.18)).toLocaleString('en-IN')}</span></div>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setPaymentStep('form')}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    ← Go Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={bookingSubmitting}
                    className="flex-[2] py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 border-0"
                  >
                    <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Confirm & Pay ₹{((workshop.price || 0) + Math.round((workshop.price || 0) * 0.18)).toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="p-5 md:p-6 flex flex-col gap-3 text-black">
                {paymentError && (
                  <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-semibold flex items-start gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    <span>{paymentError}</span>
                  </div>
                )}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-bold text-gray-800 tracking-wide uppercase">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={e => { setBookingName(e.target.value); setBookingErrors(p => ({ ...p, name: false })); }}
                    placeholder="Your Name"
                    className={`w-full text-sm text-black px-4 py-2.5 border rounded-xl focus:outline-none transition-colors ${bookingErrors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-black'}`}
                  />
                  {bookingErrors.name && <p className="text-[10px] text-red-500 font-semibold">⚠️ Required</p>}
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-bold text-gray-800 tracking-wide uppercase">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingEmail}
                    onChange={e => { setBookingEmail(e.target.value); setBookingErrors(p => ({ ...p, email: false })); }}
                    placeholder="example@example.com"
                    className={`w-full text-sm text-black px-4 py-2.5 border rounded-xl focus:outline-none transition-colors ${bookingErrors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-black'}`}
                  />
                  {bookingErrors.email && <p className="text-[10px] text-red-500 font-semibold">⚠️ Valid email required</p>}
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-bold text-gray-800 tracking-wide uppercase">
                    Mobile Number (WhatsApp Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 relative">
                    <div
                      onClick={() => setIsCountrySelectOpen(!isCountrySelectOpen)}
                      className="flex items-center gap-1 px-3 py-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer select-none text-sm text-black font-semibold hover:border-gray-400 transition-colors"
                    >
                      <span>{selectedCountry.flag}</span>
                      <span className="text-black">{selectedCountry.code}</span>
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {isCountrySelectOpen && (
                      <div className="absolute top-[105%] left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-[220px] max-h-[200px] overflow-y-auto py-1">
                        {countryCodes.map((c) => (
                          <div
                            key={c.code}
                            onClick={() => selectPhoneCode(c.code)}
                            className="px-4 py-2 hover:bg-slate-50 text-sm flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span className="font-semibold text-black">{c.code}</span>
                            </div>
                            <span className="text-xs text-gray-400">{c.country}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={e => {
                        const val = e.target.value;
                        setBookingPhone(val);
                        setBookingWhatsapp(val);
                        setBookingErrors(p => ({ ...p, phone: false, whatsapp: false }));
                      }}
                      placeholder="9876543210"
                      className={`flex-1 text-sm text-black px-4 py-2.5 border rounded-xl focus:outline-none transition-colors ${bookingErrors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-black'}`}
                    />
                  </div>
                  {bookingErrors.phone && <p className="text-[10px] text-red-500 font-semibold">⚠️ Required</p>}
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-bold text-gray-800 tracking-wide uppercase">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={bookingAge}
                    onChange={e => { setBookingAge(e.target.value); setBookingErrors(p => ({ ...p, age: false })); }}
                    className={`w-full text-sm text-black px-4 py-2.5 border rounded-xl bg-white focus:outline-none focus:border-black transition-colors ${bookingErrors.age ? 'border-red-400 focus:border-red-500' : 'border-gray-200'}`}
                  >
                    <option value="" disabled className="text-gray-400">Select your age group</option>
                    <option value="Under 18" className="text-black">Under 18</option>
                    <option value="18-24" className="text-black">18-24</option>
                    <option value="25-34" className="text-black">25-34</option>
                    <option value="35-44" className="text-black">35-44</option>
                    <option value="45-54" className="text-black">45-54</option>
                    <option value="55+" className="text-black">55+</option>
                  </select>
                  {bookingErrors.age && <p className="text-[10px] text-red-500 font-semibold">⚠️ Required</p>}
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[11px] font-bold text-gray-800 tracking-wide uppercase">
                    Profession <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={bookingProfession}
                    onChange={e => { setBookingProfession(e.target.value); setBookingErrors(p => ({ ...p, profession: false })); }}
                    className={`w-full text-sm text-black px-4 py-2.5 border rounded-xl bg-white focus:outline-none focus:border-black transition-colors ${bookingErrors.profession ? 'border-red-400 focus:border-red-500' : 'border-gray-200'}`}
                  >
                    <option value="" disabled className="text-gray-400">Select your profession</option>
                    <option value="Student" className="text-black">Student</option>
                    <option value="Working Professional" className="text-black">Working Professional</option>
                    <option value="Job Seeker" className="text-black">Job Seeker</option>
                    <option value="Business Owner / Entrepreneur" className="text-black">Business Owner / Entrepreneur</option>
                    <option value="Others" className="text-black">Others</option>
                  </select>
                  {bookingErrors.profession && <p className="text-[10px] text-red-500 font-semibold">⚠️ Required</p>}
                </div>

                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="w-full bg-black hover:bg-neutral-900 active:scale-[0.99] text-white font-extrabold py-3.5 rounded-xl text-sm md:text-base tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-[0_4px_12px_rgba(0,0,0,0.15)] mt-2 border-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pay Now & Register — ₹{workshop.price || 199} + GST
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-white transition-all duration-300 ${showStickyBar ? 'pb-[130px] sm:pb-[90px]' : ''}`}>
      <main className="flex-1 flex flex-col">
        {/* Hero Section — White Card UI (dynamic from DB) */}
        {!loading && workshop && (
          <section
            className="relative bg-white pt-4 md:pt-12 pb-16 md:pb-36 px-2 sm:px-4 md:px-8 w-full flex flex-col items-center justify-center font-sans overflow-hidden"
            id="workshop-hero-section"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* Centered Top Content */}
            <div className="max-w-7xl mx-auto text-center mb-6 md:mb-8 flex flex-col items-center gap-2 md:gap-3 px-1 sm:px-4 w-full">
              <h1
                className="text-3xl md:text-[45px] font-semibold text-gray-900 tracking-tight leading-tight [&_u]:no-underline [&_u]:border-b-[5px] [&_u]:border-[#0052FF] [&_u]:pb-1 [&_u]:inline-block w-full max-w-none animate-fade-in"
                dangerouslySetInnerHTML={{ __html: workshop.title }}
              />
              {workshop.subtitle && (
                <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed max-w-3xl">
                  {workshop.subtitle}
                </p>
              )}
              {workshop.description && (
                <p className="hidden md:block text-xs md:text-sm font-semibold text-black leading-relaxed max-w-4xl mt-1">
                  {workshop.description}
                </p>
              )}
            </div>

            {/* Main Blue Bordered Card */}
            <div className="max-w-5xl mx-auto w-full bg-white rounded-2xl border-[3px] border-[#0052FF] p-5 md:p-6 lg:p-8 shadow-[6px_6px_0px_#0052FF] relative z-10 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
              {/* Left Column: Image & Logos */}
              <div className="w-full lg:w-[50%] flex flex-col justify-start lg:justify-between gap-4 lg:gap-6">
                <div>

                  <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden aspect-[16/9] shadow-sm flex items-center justify-center">
                    <img
                      src={workshop.thumbnail || "https://res.cloudinary.com/dppgindsc/image/upload/v1780774475/workshops/lqcuatyi3elxhrqbtkdn.png"}
                      alt={workshop.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Logos marquee: continuously scrolls right-to-left */}
                  <div className="mt-3 md:mt-4 px-2">
                    <div className="relative overflow-hidden">
                      <div className="flex w-max select-none">
                        <div className="marquee flex shrink-0 items-center gap-8 pr-8">
                          <img src="/Logo/ScrollingLogo/ChatGPT.png" alt="ChatGPT" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/ClaudeAI.png" alt="Claude" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/Gemini.png" alt="Gemini" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/CanvaLogo.webp" alt="Canva" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/PictoryAI.webp" alt="Pictory AI" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/copyAI.png" alt="Copy AI" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/invideoAI.png" alt="InVideo AI" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/jasperAI.png" alt="Jasper AI" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/DescriptAI.webp" alt="Descript AI" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/ZapierLogo.png" alt="Zapier" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/notionLOGO.png" alt="Notion" className="h-7 object-contain shrink-0" />
                        </div>

                        {/* duplicate for seamless loop */}
                        <div className="marquee flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
                          <img src="/Logo/ScrollingLogo/ChatGPT.png" alt="ChatGPT" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/ClaudeAI.png" alt="Claude" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/Gemini.png" alt="Gemini" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/CanvaLogo.webp" alt="Canva" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/PictoryAI.webp" alt="Pictory AI" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/copyAI.png" alt="Copy AI" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/invideoAI.png" alt="InVideo AI" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/jasperAI.png" alt="Jasper AI" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/DescriptAI.webp" alt="Descript AI" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/ZapierLogo.png" alt="Zapier" className="h-7 object-contain shrink-0" />
                          <img src="/Logo/ScrollingLogo/notionLOGO.png" alt="Notion" className="h-7 object-contain shrink-0" />
                        </div>
                      </div>

                      <style jsx>{`
                        @keyframes marquee {
                          0% { transform: translateX(0%); }
                          100% { transform: translateX(-100%); }
                        }
                        .marquee {
                          animation: marquee 25s linear infinite;
                        }
                      `}</style>
                    </div>
                  </div>
                </div>

                {/* Ratings Row under Logos strip */}
                {((workshop as any).rating1Value || (workshop as any).rating2Value) && (
                  <div className="grid grid-cols-2 gap-3 md:flex md:flex-row md:gap-5 px-2 mt-2 w-full text-black">
                    {(workshop as any).rating1Value && (
                      <div className="bg-white border border-gray-200 rounded-xl px-2.5 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-start gap-2 sm:gap-4 shadow-sm w-full md:w-52 min-h-[60px] md:min-h-[64px]">
                        <img src="/Rating/TrustStar.png" alt={workshop.rating1Platform || "Trustpilot"} className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 object-contain" />
                        <div className="flex flex-col items-start leading-tight">
                          <span className="text-[11px] sm:text-sm font-bold text-gray-900 mb-0.5">
                            {workshop.rating1Value} {workshop.rating1Count}
                          </span>
                          <span className="text-[10px] sm:text-[13px] font-semibold text-gray-900 tracking-tight">
                            {workshop.rating1Platform || "Trustpilot"}
                          </span>
                        </div>
                      </div>
                    )}

                    {(workshop as any).rating2Value && (
                      <div className="bg-white border border-gray-200 rounded-xl px-2.5 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-start gap-2 sm:gap-4 shadow-sm w-full md:w-52 min-h-[60px] md:min-h-[64px]">
                        <img src="/Rating/ReviewStar.png" alt={workshop.rating2Platform || "Rating Facts"} className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 object-contain" />
                        <div className="flex flex-col items-start leading-tight">
                          <span className="text-[11px] sm:text-sm font-bold text-gray-900 mb-0.5">
                            {workshop.rating2Value} {workshop.rating2Count}
                          </span>
                          <span className="text-[10px] sm:text-[13px] font-semibold text-gray-900 tracking-tight">
                            {workshop.rating2Platform || "Rating Facts"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Bullets, Button, Deadline */}
              <div className="w-full lg:w-[50%] flex flex-col justify-start gap-4">
                {/* Highlights Grid */}
                {(() => {
                  const activePoints = (workshop.heroPoints || []).filter((pt: string) => pt && pt.trim() !== "");
                  if (activePoints.length === 0) return null;
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activePoints.map((text: string, idx: number) => (
                        <div key={idx} className="bg-blue-50/60 border border-blue-100/30 rounded-xl p-4 flex items-center gap-3 shadow-xs">
                          <img src="/WorkshopHeroTick/check.png" alt="check" className="w-6 h-6 object-contain shrink-0" />
                          <span className="text-xs md:text-sm font-bold text-gray-800 leading-snug">{text}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Yellow Button & Deadline Group */}
                {isRegistered ? (
                  <div className="flex flex-col items-center justify-center py-6 px-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl shadow-sm text-center w-full">
                    <img src="/WorkshopHeroTick/check-mark.png" alt="Success" className="w-12 h-12 object-contain mb-3" />
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Successfully Registered</span>
                    <Link
                      href="/dashboard/workshops"
                      className="text-[#0052FF] hover:text-[#0040D9] font-bold text-sm tracking-wide mt-2 hover:underline inline-block"
                    >
                      View Details
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <button
                      onClick={handlePriceButtonClick}
                      className="w-full active:scale-[0.99] text-gray-900 font-extrabold py-3 px-6 rounded-xl shadow-[0_4px_14px_rgba(252,209,42,0.35)] transition-all hover:brightness-105 flex flex-col items-center justify-center gap-1 cursor-pointer text-center border-0"
                      style={{ backgroundImage: 'linear-gradient(157deg, #F2E829 0%, #FDBD1A 100%)' }}
                    >
                      <span className="font-semibold text-sm md:text-[17px] tracking-tight">
                        {workshop.priceCaption || "Pay"}
                      </span>
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <span className="line-through text-gray-700 text-sm md:text-base font-semibold">
                          ₹{workshop.originalPrice || 1999}
                        </span>
                        <span className="text-gray-900 text-lg md:text-xl font-semibold">
                          ₹{workshop.price || 199}/-
                        </span>
                      </span>
                    </button>

                    {workshop.bonusDeadlineText && (
                      <p className="text-xs md:text-sm font-bold text-gray-800 text-center mt-3 tracking-tight">
                        {workshop.bonusDeadlineText}
                      </p>
                    )}

                    <div className="mt-7 w-full flex flex-col items-center">
                      <button
                        onClick={() => setShowDatePickerModal(true)}
                        className="w-full max-w-[280px] bg-white hover:bg-gray-50 border-2 border-dashed border-[#0052FF] text-[#0052FF] hover:text-[#0040D9] font-extrabold py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide"
                      >
                        <img src="/Dates/calendar.png" alt="calendar" className="w-5 h-5 object-contain" />
                        {selectedDate ? (
                          <span>Date: {formatThreeDaysRange(selectedDate)}</span>
                        ) : (
                          <span>Select Date</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Spacer */}
            <div className="h-12 w-full"></div>

            {/* Instructor Card */}
            {workshop.instructor && (
              <div className="max-w-2xl w-full mx-auto flex justify-center z-10 px-4 text-black">
                <div className="w-full max-w-xl bg-white border-[2.5px] border-[#0052FF] rounded-2xl p-5 md:p-6 shadow-[6px_6px_0px_#0052FF] flex flex-row items-center gap-5">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden border-2 border-black bg-slate-900 flex items-center justify-center">
                    <img
                      src={workshop.instructorImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80"}
                      alt={workshop.instructor}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] md:text-xs font-black tracking-widest text-black">INSTRUCTOR</span>
                    <h3 className="text-base md:text-[19px] font-black text-gray-950 mt-0.5 leading-tight">{workshop.instructor}</h3>
                    {workshop.instructorDescription && workshop.instructorDescription
                      .split("\n")
                      .map((line: string, idx: number) => (
                        <p key={idx} className={`text-xs md:text-sm text-gray-800 font-bold leading-snug ${idx === 0 ? 'mt-1.5' : 'mt-0.5'}`}>
                          {line}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Checkmarks Grid */}
            {workshop.learningOutcomes && workshop.learningOutcomes.length > 0 && (
              <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6 mt-10 mb-8 z-10 px-4">
                {workshop.learningOutcomes.map((text, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img src="/WorkshopHeroTick/GreenTick.png" alt="check" className="w-6.5 h-6.5 object-contain shrink-0" />
                    <span className="text-sm md:text-base font-bold text-gray-800 leading-snug text-left">{text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Blue Registration CTA Button */}
            <div className="max-w-2xl w-full mx-auto mt-4 mb-6 z-10 px-4">
              {isRegistered ? (
                <div className="flex flex-col items-center justify-center py-4 px-4 bg-emerald-50 border border-emerald-400 rounded-xl text-center max-w-md mx-auto">
                  <span className="text-base font-bold text-gray-900">Successfully Registered</span>
                  <Link href="/dashboard/workshops" className="text-blue-600 hover:text-blue-700 font-bold text-xs tracking-wide mt-1 hover:underline">
                    View Details
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handlePriceButtonClick}
                  className="w-full bg-[#0052FF] hover:bg-[#0040D9] active:scale-[0.99] text-white font-extrabold py-3.5 px-4 md:px-6 rounded-lg shadow-[0_4px_14px_rgba(0,82,255,0.3)] transition-all flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2.5 cursor-pointer text-center text-sm sm:text-base md:text-lg tracking-wide border-0"
                >
                  <span className="font-semibold leading-tight">
                    {workshop.priceCaption || "Pay"}
                  </span>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="line-through text-blue-200 text-sm md:text-base font-semibold">
                      ₹{workshop.originalPrice || 1999}
                    </span>
                    <span className="text-white text-lg md:text-xl font-semibold md:font-black">
                      ₹{workshop.price || 199}/-
                    </span>
                  </span>
                </button>
              )}
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
        )}

        {!loading && workshop && (
          <>
            {/* Key Highlights Section */}
            <section className="bg-white pt-12 pb-6 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans" id="workshop-highlights-skills">
              <div className="max-w-5xl w-full mx-auto flex flex-col items-start text-left">
                <h2 className="text-2xl md:text-[48px] font-extrabold md:font-black italic text-left text-gray-900 leading-tight">
                  {(() => {
                    const isDM = workshop.title?.toLowerCase().includes("digital marketing") || workshop.title?.toLowerCase().includes("foundation");
                    return isDM
                      ? "Key Highlights of Our AI-Driven Digital Marketing Program for Entrepreneurs"
                      : `Key Highlights of Our ${workshop.title}`;
                  })()}
                </h2>
                <p className="text-blue-900 text-sm md:text-base font-bold text-left mt-3 mb-8">
                  {(() => {
                    const isDM = workshop.title?.toLowerCase().includes("digital marketing") || workshop.title?.toLowerCase().includes("foundation");
                    return isDM
                      ? "Digital Marketing Leadership Skills You'll Master to Lead the Future"
                      : "Leadership Skills You'll Master to Lead the Future";
                  })()}
                </p>

                <div className="flex flex-wrap gap-3 w-full">
                  {(() => {
                    const pills = (workshop.highlights && workshop.highlights.length > 0)
                      ? workshop.highlights.map(h => typeof h === 'string' ? h : h.title || '')
                      : [
                        "Digital Marketing", "WordPress Website Designing", "Ad Copy Writing", "Creative Designing", "Affiliate Marketing",
                        "Content Marketing", "SEO Auditing", "Google Ads", "Bing Ads", "Mobile App Advertising", "Remarketing",
                        "SEO", "Facebook", "Linkedin", "Instagram", "Youtube", "Quora", "Adsense", "Twitter",
                        "Email Marketing", "Google Analytics", "Marketing Automation", "Whatsapp Marketing"
                      ];
                    return pills.map((pill, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex items-center gap-2 px-4 py-2 border border-black rounded-full bg-white text-xs sm:text-sm font-semibold text-gray-900 select-none shadow-[1.5px_1.5px_0px_#000000]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {pill}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </section>

            {/* What You'll Learn Section */}
            {workshop.modules && workshop.modules.length > 0 && (
              <section className="bg-white pt-6 pb-12 md:py-16 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans border-b border-gray-100" id="workshop-cohort-syllabus">
                <div className="max-w-5xl w-full mx-auto flex flex-col items-start text-left">
                  <h2 className="text-2xl md:text-[48px] font-extrabold md:font-black italic text-left text-gray-900 leading-tight">
                    What you will learn in this course.
                  </h2>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base font-medium text-left max-w-3xl mt-4 leading-relaxed">
                    Master advanced curriculum approved by industry leaders at our AI digital marketing leadership course for entrepreneurs. We combine expert-led training with a syllabus recognized by top professionals to ensure you are job ready.
                  </p>

                  <hr className="w-full border-gray-200 my-6" />

                  <div className="flex flex-wrap gap-x-12 gap-y-3 text-left w-full mb-8 text-sm">
                    <div>
                      <span className="text-gray-500 font-bold block text-xs uppercase tracking-wider mb-0.5">Learning Mode</span>
                      <span className="font-extrabold text-gray-900 italic">Offline</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold block text-xs uppercase tracking-wider mb-0.5">Batch Timings</span>
                      <span className="font-extrabold text-gray-900 italic">9:00AM to 11:00AM | 11:30 AM to 1:00 PM</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 w-full text-left">
                    {workshop.modules.map((moduleItem, idx) => {
                      const isOpen = activeModule === idx;
                      const liveSessions = idx === 0 ? 5 : idx === 1 ? 10 : idx === 2 ? 8 : idx === 3 ? 6 : 5;
                      const assignments = 2;
                      const caseStudies = 3;
                      const assessments = 1;

                      return (
                        <div
                          key={idx}
                          className={`w-full border-[1.5px] border-black rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'bg-[#E5DEFF] shadow-[4px_4px_0px_#000000]' : 'bg-white shadow-[4px_4px_0px_#000000]'}`}
                        >
                          {/* Header */}
                          <div
                            onClick={() => setActiveModule(isOpen ? null : idx)}
                            className="flex items-center justify-between p-6 sm:p-8 cursor-pointer select-none hover:bg-gray-50/50 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 flex-1 min-w-0">
                              {/* Desktop-only Module Badge */}
                              <div className="hidden sm:flex flex-col items-start leading-none shrink-0">
                                <span className="text-[11px] font-bold text-gray-500 italic uppercase tracking-wider mb-0.5">Module</span>
                                <span className="text-4xl sm:text-5xl font-black italic text-purple-700">{idx + 1}</span>
                              </div>

                              {/* Content area */}
                              <div className="flex-1 min-w-0 text-left">
                                {/* Mobile-only Inline Title */}
                                <h3 className="block sm:hidden text-base font-bold text-[#0a2540] pr-4 mb-3 leading-snug">
                                  <span className="italic text-gray-900 font-medium mr-1.5">Module</span>
                                  <span className="text-purple-700 font-black italic mr-2">{idx + 1}</span>
                                  <span className="text-gray-450 font-bold mx-1.5">—</span>
                                  <span className="text-gray-950 font-extrabold">{moduleItem.title}</span>
                                </h3>

                                {/* Desktop-only Heading */}
                                <h3 className="hidden sm:block text-lg sm:text-xl md:text-2xl font-bold text-[#0a2540] pr-4 mb-2">
                                  {moduleItem.title}
                                </h3>

                                {/* Badges */}
                                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 text-xs font-semibold text-gray-800 w-full sm:w-auto">
                                  <span className="flex items-center gap-1.5 px-3 py-1 border border-black rounded-full bg-white select-none">
                                    <Radio className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                                    <span>{liveSessions} Live Sessions</span>
                                  </span>
                                  <span className="flex items-center gap-1.5 px-3 py-1 border border-black rounded-full bg-white select-none">
                                    <ClipboardList className="w-3.5 h-3.5 shrink-0" />
                                    <span>{assignments} Assignments</span>
                                  </span>
                                  <span className="flex items-center gap-1.5 px-3 py-1 border border-black rounded-full bg-white select-none">
                                    <FileText className="w-3.5 h-3.5 shrink-0" />
                                    <span>{caseStudies} Case Study</span>
                                  </span>
                                  <span className="flex items-center gap-1.5 px-3 py-1 border border-black rounded-full bg-white select-none">
                                    <ClipboardCheck className="w-3.5 h-3.5 shrink-0" />
                                    <span>{assessments} Assessments</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Collapse indicator */}
                            <div className="shrink-0 ml-4">
                              {isOpen ? (
                                <Minus className="w-6 h-6 sm:w-8 sm:h-8 text-black stroke-[2.5]" />
                              ) : (
                                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-black stroke-[2.5]" />
                              )}
                            </div>
                          </div>

                          {/* Collapsible content */}
                          {isOpen && (
                            <div className="border-t-[1.5px] border-black p-6 sm:p-8">
                              {(() => {
                                const points = moduleItem.content || [];

                                if (points.length > 0) {
                                  return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                      {points.map((point, pIdx) => (
                                        <div key={pIdx} className="flex items-start gap-2.5">
                                          <span className="text-gray-900 font-black text-sm mt-0.5 shrink-0">✓</span>
                                          <span className="text-xs sm:text-sm md:text-[14px] text-gray-900 font-bold leading-relaxed">
                                            {point}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Tools You'll Master Section */}
            <section className="bg-white pt-6 pb-8 md:pt-10 md:pb-16 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans border-b border-gray-100" id="workshop-tools-mastered">
              <div className="max-w-5xl w-full mx-auto flex flex-col items-start text-left">
                <h2 className="text-2xl md:text-[48px] font-extrabold md:font-black italic text-left text-gray-900 leading-tight">
                  {(() => {
                    const isDM = workshop.title?.toLowerCase().includes("digital marketing") || workshop.title?.toLowerCase().includes("foundation");
                    return isDM
                      ? "Digital Marketing Leadership Tools You'll Master"
                      : `${workshop.title} Tools You'll Master`;
                  })()}
                </h2>
                <p className="text-gray-700 text-sm md:text-base font-semibold text-left mt-4 mb-10 max-w-3xl leading-relaxed">
                  Work with the most in-demand platforms every day with AI Scale&apos;s AI-led digital marketing programs.
                </p>

                <div className="flex flex-wrap gap-8 md:gap-12 items-center justify-start w-full py-4">
                  {/* Google Analytics */}
                  <img src="/WorkshopsAILogos/Tool/GoogleAnalytics.jpg" alt="Google Analytics" className="h-16 md:h-20 w-auto object-contain shrink-0 rounded-xl hover:scale-105 transition-transform duration-200" />

                  {/* Google Ads */}
                  <img src="/WorkshopsAILogos/Tool/Google-Ads.webp" alt="Google Ads" className="h-16 md:h-20 w-auto object-contain shrink-0 hover:scale-105 transition-transform duration-200" />

                  {/* Meta Ads */}
                  <img src="/WorkshopsAILogos/Tool/Meta-Ads.webp" alt="Meta Ads" className="h-16 md:h-20 w-auto object-contain shrink-0 hover:scale-105 transition-transform duration-200" />

                  {/* WhatsApp */}
                  <img src="/WorkshopsAILogos/Tool/WhatsApp.webp" alt="WhatsApp" className="h-16 md:h-20 w-auto object-contain shrink-0 hover:scale-105 transition-transform duration-200" />
                </div>
              </div>
            </section>

            {/* Next-Gen AI-Powered Tools Section */}
            <section className="bg-white pt-6 pb-8 md:pt-10 md:pb-16 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans border-b border-gray-100" id="workshop-ai-tools">
              <div className="max-w-5xl w-full mx-auto flex flex-col items-start text-left">
                <h2 className="text-2xl md:text-[48px] font-extrabold md:font-black italic text-left text-gray-900 leading-tight">
                  Next-Gen AI-Powered Tools
                </h2>
                <p className="text-gray-700 text-sm md:text-base font-semibold text-left mt-4 mb-8 max-w-3xl leading-relaxed">
                  AI empowers modern marketers to blend creativity with performance in this digital marketing leadership program.
                </p>

                {/* Filter Tabs */}
                <div className="flex overflow-x-auto no-scrollbar w-full gap-2.5 mb-8 pb-1 md:pb-0 md:flex-wrap md:overflow-visible">
                  {["All", "Design", "Website", "Writing", "Video"].map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer shrink-0 ${isActive
                          ? "border-red-500 text-red-500 bg-red-50/50"
                          : "border-gray-300 text-gray-700 hover:border-gray-900 bg-white"
                          }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 w-full">
                  {(() => {
                    const aiTools = [
                      { name: "AdobeFirefly", cat: "Design", icon: AdobeFirefly.src },
                      { name: "Canva", cat: "Design", icon: Canva.src },
                      { name: "ChatGPT", cat: "Writing", icon: ChatGPT.src },
                      { name: "ClaudeAI", cat: "Writing", icon: "/Logo/ScrollingLogo/ClaudeAI.png" },
                      { name: "DescriptAI", cat: "Video", icon: DescriptAI.src },
                      { name: "ElevenLabs", cat: "Video", icon: ElevenLabs.src },
                      { name: "Gemini", cat: "Writing", icon: "/Logo/ScrollingLogo/Gemini.png" },
                      { name: "Grammerly", cat: "Writing", icon: Grammerly.src },
                      { name: "InVideo AI", cat: "Video", icon: "/Logo/ScrollingLogo/invideoAI.png" },
                      { name: "Jasper", cat: "Writing", icon: Jasper.src },
                      { name: "Lumen5", cat: "Video", icon: Lumen5.src },
                      { name: "MidJourney", cat: "Design", icon: MidJourney.src },
                      { name: "NotionAI", cat: "Writing", icon: NotionAI.src },
                      { name: "OpusClip", cat: "Video", icon: OpusClip.src },
                      { name: "PeechAI", cat: "Video", icon: PeechAI.src },
                      { name: "PictoryAI", cat: "Video", icon: PictoryAI.src },
                      { name: "QuillBot", cat: "Writing", icon: QuillBot.src },
                      { name: "Runway", cat: "Video", icon: Runway.src },
                      { name: "SurferAI", cat: "Writing", icon: SurferAI.src },
                      { name: "TomeAI", cat: "Design", icon: TomeAI.src },
                      { name: "copyAI", cat: "Writing", icon: CopyAI.src },
                      { name: "Synthesia", cat: "Video", icon: Synthesia.src },
                      { name: "Zapier", cat: "Website", icon: "/Logo/ScrollingLogo/ZapierLogo.png" }
                    ];

                    const filtered = selectedCategory === "All"
                      ? aiTools
                      : aiTools.filter(t => t.cat === selectedCategory);

                    return filtered.map((tool, idx) => (
                      <img
                        key={idx}
                        src={tool.icon}
                        alt={tool.name}
                        className="h-20 w-full object-contain hover:scale-[1.03] transition-all select-none cursor-default"
                      />
                    ));
                  })()}
                </div>
              </div>
            </section>

            {/* Application Deadline */}
            {(workshop as any).applicationDeadline && (
              <section className="bg-white py-4 md:py-12 px-4 md:px-16 w-full flex justify-center z-10" id="workshop-application-deadline">
                <div className="w-full max-w-4xl p-[3px] rounded-2xl bg-gradient-to-r from-[#FF007A] via-[#7F00FF] via-[#001AFF] to-[#00E080] shadow-[0_0_30px_rgba(255,0,122,0.18),0_0_30px_rgba(0,26,255,0.18),0_0_30px_rgba(0,224,128,0.18)]">
                  <div className="w-full bg-[#f5f5f5] py-6 md:py-8 px-6 text-center rounded-[13px]">
                    <h2 className="text-[#444444] text-[32px] font-bold tracking-tight mb-3">Application <span className="text-[#0052FF]">Deadline</span></h2>
                    <p className="text-gray-600 text-sm md:text-base font-normal">
                      Apply by <span className="font-bold text-[#0052FF]">
                        {new Date((workshop as any).applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span> at 11:59 PM
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* What you'll learn in this Cohort Section */}
            {workshop.courseOutcomes && workshop.courseOutcomes.length > 0 && (
              <section className="w-full bg-[#EBF5FF] pb-8 md:pb-10 relative font-sans" id="workshop-what-you-learn">
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
                    <h2 className="text-[26px] md:text-[36px] font-bold text-gray-950 tracking-tight text-left">
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
                    {workshop.courseOutcomes.map((outcome, idx) => (
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

                  {/* Download Brochure Button */}
                  <div className="flex justify-center mt-6 mb-0">
                    <button
                      onClick={() => alert("Brochure download starting shortly...")}
                      className="px-5 py-2.5 sm:px-8 sm:py-3.5 bg-white border-2 border-black rounded-full font-bold text-gray-900 text-xs sm:text-sm md:text-base flex items-center gap-2 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[0px_0px_0px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-150 active:scale-[0.98] cursor-pointer"
                    >
                      Download Workshop Details Brochure
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-black shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* What is this program for Section */}
            <section className="bg-white py-12 md:py-16 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans border-b border-gray-100" id="workshop-program-for">
              <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center">
                <h2 className="text-[26px] md:text-[36px] font-bold text-gray-900 tracking-tight mb-12">
                  What is this program for?
                </h2>

                {/* 3 Columns */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-12 w-full max-w-4xl justify-center items-start mb-12">
                  {/* Student */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                      <img
                        src="/LandingPage/student_3d.png"
                        alt="Student"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs sm:text-base md:text-xl font-bold text-gray-800">Student</span>
                  </div>

                  {/* Working Professionals */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                      <img
                        src="/LandingPage/professional_3d.png"
                        alt="Working Professionals"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs sm:text-base md:text-xl font-bold text-gray-800">Working Professionals</span>
                  </div>

                  {/* Job Seekers */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                      <img
                        src="/LandingPage/job_seeker_3d.png"
                        alt="Job Seekers"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs sm:text-base md:text-xl font-bold text-gray-800">Job Seekers</span>
                  </div>
                </div>

                {/* Blue CTA Button */}
                <div className="max-w-2xl w-full mx-auto z-10 px-4">
                  {isRegistered ? (
                    <div className="flex flex-col items-center justify-center py-4 px-4 bg-emerald-50 border border-emerald-400 rounded-xl text-center max-w-md mx-auto">
                      <span className="text-base font-bold text-gray-900">Successfully Registered</span>
                      <Link href="/dashboard/workshops" className="text-blue-600 hover:text-blue-700 font-bold text-xs tracking-wide mt-1 hover:underline">
                        View Details
                      </Link>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handlePriceButtonClick}
                        className="w-full bg-[#0052FF] hover:bg-[#0040D9] active:scale-[0.99] text-white font-extrabold py-4 px-4 md:px-6 rounded-xl shadow-[0_4px_14px_rgba(0,82,255,0.3)] transition-all flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 cursor-pointer text-center text-sm sm:text-base md:text-lg tracking-wide border-0"
                      >
                        <span className="font-semibold leading-tight">{workshop.priceCaption || "Become A Python Using AI Expert Now At"}</span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="line-through text-blue-200 text-sm md:text-base font-semibold">₹{workshop.originalPrice || 1999}</span>
                          <span className="text-white text-lg md:text-xl font-semibold md:font-black">₹{workshop.price || 199}/-</span>
                        </span>
                      </button>

                      <p className="text-xs md:text-sm font-bold text-gray-800 text-center mt-4 tracking-tight">
                        {workshop.bonusDeadlineText || "Register Before June 07, 2026 To Unlock All Bonuses Worth Rs. 12300"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Did You Know? Section */}
            <section className="bg-[#EBF5FF]/50 py-12 md:py-16 px-4 md:px-8 w-full flex flex-col items-center z-10 font-sans border-b border-blue-100" id="workshop-did-you-know">
              <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center">
                <h2 className="text-[26px] md:text-[36px] font-black text-gray-900 tracking-tight mb-2">
                  Did You Know?
                </h2>
                <p className="text-gray-800 text-sm md:text-[17px] font-bold max-w-2xl leading-relaxed mb-10 px-2">
                  You can upskill yourself in AI and switch from service-based company to product-based company with minimum of 180% salary hike
                </p>

                {/* 3 Salary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl justify-center items-stretch mb-10 text-black">
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
                  {isRegistered ? (
                    <div className="flex flex-col items-center justify-center py-4 px-4 bg-emerald-50 border border-emerald-400 rounded-xl text-center max-w-md mx-auto">
                      <span className="text-base font-bold text-gray-900">Successfully Registered</span>
                      <Link href="/dashboard/workshops" className="text-blue-600 hover:text-blue-700 font-bold text-xs tracking-wide mt-1 hover:underline">
                        View Details
                      </Link>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handlePriceButtonClick}
                        className="w-full bg-[#0052FF] hover:bg-[#0040D9] active:scale-[0.99] text-white font-extrabold py-4 px-4 md:px-6 rounded-xl shadow-[0_4px_14px_rgba(0,82,255,0.3)] transition-all flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 cursor-pointer text-center text-sm sm:text-base md:text-lg tracking-wide border-0"
                      >
                        <span className="font-semibold leading-tight">{workshop.priceCaption || "Become A Python Using AI Expert Now At"}</span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="line-through text-blue-200 text-sm md:text-base font-semibold">₹{workshop.originalPrice || 1999}</span>
                          <span className="text-white text-lg md:text-xl font-semibold md:font-black">₹{workshop.price || 199}/-</span>
                        </span>
                      </button>

                      <p className="text-xs md:text-sm font-bold text-gray-800 text-center mt-4 tracking-tight">
                        {workshop.bonusDeadlineText || "Register Before June 07, 2026 To Unlock All Bonuses Worth Rs. 12300"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Sticky Bottom Bar */}
      {showStickyBar && workshop && !isCheckout && !isRegistered && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 bg-[#eef9ff]/95 backdrop-blur-md border-t border-blue-100 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 ease-in-out transform translate-y-0 opacity-100`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 158, 227, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 158, 227, 0.04) 1px, transparent 1px)`,
            backgroundSize: '14px 14px',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
          <div className="max-w-7xl mx-auto px-4 md:px-16 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 md:gap-6">
            <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-3 w-full sm:w-auto">
              <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 items-center justify-center text-red-600 shrink-0 shadow-sm hidden sm:flex">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col items-start leading-tight text-left">
                <span className="text-[11px] md:text-sm font-bold text-red-600 tracking-tight">
                  {workshop.bonusDeadlineText || "Register Before June 07, 2026 To Unlock All Bonuses Worth Rs. 12300"}
                </span>
                {selectedDate && (
                  <span className="text-[10px] md:text-xs font-semibold text-gray-500 mt-0.5">
                    Selected Date: {formatThreeDaysRange(selectedDate)}
                  </span>
                )}
              </div>
            </div>
            <button onClick={handlePriceButtonClick}
              className="relative group overflow-hidden bg-[#007f00] hover:bg-[#006600] active:scale-[0.98] text-white text-[13px] md:text-sm font-bold py-3 px-4 md:px-7 rounded shadow-[0_4px_14px_rgba(0,127,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,127,0,0.35)] transition-all duration-200 shrink-0 w-full sm:w-auto flex justify-center cursor-pointer border-0">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
                Book your Seat Now for
                <span className="line-through text-green-200 font-semibold">₹{workshop.originalPrice?.toLocaleString('en-IN') || '1,50,000'}</span>
                <span className="text-yellow-300 font-extrabold">₹{workshop.price?.toLocaleString('en-IN') || '8,000'}/-</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Booking Form Modal Overlay */}
      {showBookingModal && workshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => paymentStep === 'form' && setShowBookingModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in duration-200">

            {paymentStep === 'success' ? (
              /* ─ Success Screen ─ */
              <div className="p-8 flex flex-col items-center text-center text-black">
                <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mb-5">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">🎉 Booking Confirmed!</h3>
                <p className="text-gray-500 text-sm font-medium mb-5 leading-relaxed">
                  Thank you, <strong className="text-gray-900">{bookingName}</strong>! You're registered for
                </p>
                <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 text-left mb-5">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Workshop</p>
                  <p className="text-sm font-bold text-gray-900 mb-2">{workshop.title}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Date</p>
                  <p className="text-sm font-bold text-gray-900 mb-2">{selectedDate ? formatThreeDaysRange(selectedDate) : 'N/A'}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Amount Paid</p>
                  <p className="text-sm font-black text-green-600">₹{((workshop.price || 0) + Math.round((workshop.price || 0) * 0.18)).toLocaleString('en-IN')}/-</p>
                </div>
                <p className="text-xs text-gray-400 font-medium mb-5">Confirmation details sent to <strong className="text-gray-600">{bookingEmail}</strong> & on WhatsApp</p>
                <button onClick={() => setShowBookingModal(false)} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer border-0">
                  Close
                </button>
              </div>
            ) : paymentStep === 'paying' ? (
              /* ─ Payment Processing Screen ─ */
              <div className="p-10 flex flex-col items-center text-center text-black">
                <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center mb-6">
                  <svg className="animate-spin w-10 h-10 text-[#0052FF]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Opening Payment Gateway...</h3>
                <p className="text-gray-400 text-sm font-medium">Please wait, do not close this window</p>
                <div className="mt-6 w-full bg-gray-50 rounded-xl p-4 text-left">
                  <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1"><span>{workshop.title}</span><span>₹{workshop.price?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-xs text-gray-400"><span>Selected Date</span><span>{selectedDate ? formatThreeDaysRange(selectedDate) : 'N/A'}</span></div>
                </div>
              </div>
            ) : paymentStep === 'confirm' ? (
              /* ─ Confirm Screen ─ */
              <div className="p-6 md:p-8 flex flex-col items-center text-center text-black">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">Confirm Your Booking</h3>
                <p className="text-gray-400 text-sm font-medium mb-5">Please review your details before proceeding to payment</p>
                <div className="w-full bg-gray-50 rounded-xl p-4 text-left mb-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Name</span><span className="font-bold text-gray-900">{bookingName}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Email</span><span className="font-bold text-gray-900">{bookingEmail}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Phone</span><span className="font-bold text-gray-900">{bookingPhone}</span></div>
                  {bookingAge && <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Age</span><span className="font-bold text-gray-900">{bookingAge}</span></div>}
                  {bookingProfession && <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Profession</span><span className="font-bold text-gray-900">{bookingProfession}</span></div>}
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Workshop</span><span className="font-bold text-gray-900 text-right max-w-[60%] leading-tight">{workshop.title}</span></div>
                  {selectedDate && <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Date</span><span className="font-bold text-gray-900">{formatThreeDaysRange(selectedDate)}</span></div>}
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Workshop Fee</span><span className="font-bold text-gray-900">₹{workshop.price?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">GST (18%)</span><span className="font-bold text-gray-900">₹{Math.round((workshop.price || 0) * 0.18).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-sm font-bold pt-1 border-t border-gray-200"><span className="text-gray-900">Total</span><span className="text-green-600 font-extrabold">₹{((workshop.price || 0) + Math.round((workshop.price || 0) * 0.18)).toLocaleString('en-IN')}</span></div>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => setPaymentStep('form')}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    ← Go Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={bookingSubmitting}
                    className="flex-[2] py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 border-0"
                  >
                    <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Confirm & Pay ₹{((workshop.price || 0) + Math.round((workshop.price || 0) * 0.18)).toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            ) : (
              /* ─ Booking Form ─ */
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0052FF] to-[#0EA5E9] px-6 pt-6 pb-7 text-white">
                  <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer bg-transparent border-0" title="Close">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </div>
                    <div>
                      <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Step 2 of 2</p>
                      <h2 className="text-white font-black text-lg tracking-tight">Complete Your Registration</h2>
                    </div>
                  </div>
                  {/* Order Summary Pill */}
                  <div className="bg-white/10 rounded-xl p-3 mt-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Workshop</p>
                        <p className="text-white text-xs font-bold leading-snug mt-0.5 max-w-[200px]">{workshop.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Date</p>
                        <p className="text-white text-xs font-bold mt-0.5">{selectedDate ? formatThreeDaysRange(selectedDate) : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="border-t border-white/20 mt-2 pt-2 flex justify-between items-center">
                      <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Amount</span>
                      <span className="text-white font-black text-base">₹{workshop.price?.toLocaleString('en-IN') || 0}/-</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleBookingSubmit} className="px-6 py-5 flex flex-col gap-3 text-black">
                  {paymentError && (
                    <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-semibold flex items-start gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                      <span>{paymentError}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 font-semibold -mb-1">All fields are mandatory</p>

                  {/* Name */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={bookingName}
                      onChange={e => { setBookingName(e.target.value); setBookingErrors(p => ({ ...p, name: false })); }}
                      placeholder="Your full name"
                      className={`w-full text-sm px-3 py-2.5 border rounded-lg focus:outline-none transition-colors ${bookingErrors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#0052FF]'}`}
                    />
                    {bookingErrors.name && <p className="text-[10px] text-red-500 font-semibold mt-0.5">⚠️ Required</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">Email Address</label>
                    <input
                      type="email"
                      value={bookingEmail}
                      onChange={e => { setBookingEmail(e.target.value); setBookingErrors(p => ({ ...p, email: false })); }}
                      placeholder="your@email.com"
                      className={`w-full text-sm px-3 py-2.5 border rounded-lg focus:outline-none transition-colors ${bookingErrors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#0052FF]'}`}
                    />
                    {bookingErrors.email && <p className="text-[10px] text-red-500 font-semibold mt-0.5">⚠️ Valid email required</p>}
                  </div>

                  {/* Phone + WhatsApp */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Phone Number</label>
                      <input
                        type="tel"
                        value={bookingPhone}
                        onChange={e => { setBookingPhone(e.target.value); setBookingErrors(p => ({ ...p, phone: false })); }}
                        placeholder="9876543210"
                        className={`w-full text-sm px-3 py-2.5 border rounded-lg focus:outline-none transition-colors ${bookingErrors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#0052FF]'}`}
                      />
                      {bookingErrors.phone && <p className="text-[10px] text-red-500 font-semibold mt-0.5">⚠️ Required</p>}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">WhatsApp Number</label>
                      <input
                        type="tel"
                        value={bookingWhatsapp}
                        onChange={e => { setBookingWhatsapp(e.target.value); setBookingErrors(p => ({ ...p, whatsapp: false })); }}
                        placeholder="9876543210"
                        className={`w-full text-sm px-3 py-2.5 border rounded-lg focus:outline-none transition-colors ${bookingErrors.whatsapp ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#0052FF]'}`}
                      />
                      {bookingErrors.whatsapp && <p className="text-[10px] text-red-500 font-semibold mt-0.5">⚠️ Required</p>}
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 font-medium">
                    By registering, you agree to receive updates via Email, Phone & WhatsApp about this workshop.
                  </p>

                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    id="pay-and-register-btn"
                    className="w-full bg-[#0052FF] hover:bg-[#0040D9] active:scale-[0.99] text-white font-black py-3.5 rounded-xl text-sm md:text-base tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-[0_4px_14px_rgba(0,82,255,0.3)] border-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Pay Now & Register — ₹{workshop.price?.toLocaleString('en-IN') || 0}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Date Selection Popup Modal */}
      {showDatePickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDatePickerModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-2xl max-w-[320px] sm:max-w-sm w-full flex flex-col items-center text-center text-black border-[3px] border-[#0052FF]">
            {/* Close Button */}
            <button
              onClick={() => setShowDatePickerModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer"
              title="Close"
            >
              <X size={20} />
            </button>

            <h4 className="text-base md:text-lg font-black text-gray-955 tracking-wider uppercase mb-5 border-b-2 border-[#0052FF] pb-1">
              Select Workshop Date
            </h4>

            {(() => {
              const rawDates: any[] = workshop.workshopDates && workshop.workshopDates.length > 0
                ? workshop.workshopDates
                : [
                  '2026-06-03T10:00:00Z',
                  '2026-06-04T10:00:00Z',
                  '2026-06-05T10:00:00Z'
                ];
              const dateStringsOnly = rawDates.map((d: any) => {
                return typeof d === 'string' || d instanceof Date ? d : d?.date || '';
              }).filter(Boolean);
              const datesList = getCohortStartDates(dateStringsOnly);

              return (
                <div className="flex flex-col gap-3 w-full items-center mb-6">
                  {datesList.map((dateVal: string | Date, idx: number) => {
                    const dateObj = new Date(dateVal);
                    const isoStr = dateObj.toISOString();
                    const displayRange = formatThreeDaysRange(dateObj);

                    const w1 = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const w3 = new Date(dateObj.getTime() + 172800000).toLocaleDateString('en-US', { weekday: 'short' });
                    const displayWeekdays = `${w1} - ${w3}`;

                    const isSelected = selectedDate === isoStr;

                    const matchedDateObj = rawDates.find((d: any) => {
                      const dStr = typeof d === 'string' || d instanceof Date ? d : d?.date || '';
                      try {
                        return new Date(dStr).toISOString() === isoStr;
                      } catch {
                        return false;
                      }
                    });
                    const place = typeof matchedDateObj === 'string' || matchedDateObj instanceof Date || !matchedDateObj
                      ? ''
                      : matchedDateObj?.place || '';

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedDate(isoStr);
                          setShowDatePickerModal(false); // Auto-close on select
                        }}
                        className={`w-full max-w-[280px] min-h-[72px] border-[2px] rounded-xl px-5 py-3 flex flex-row items-center justify-center gap-4 cursor-pointer transition-[transform,colors,shadow] duration-200 ease-out group ${isSelected
                          ? 'border-[#0052FF] bg-[#0052FF] shadow-[0_2px_12px_rgba(0,82,255,0.3)] scale-[1.03]'
                          : 'bg-white border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#0052FF] hover:bg-blue-50/50 hover:shadow-[0_2px_8px_rgba(0,82,255,0.15)] hover:scale-[1.02]'
                          }`}
                      >
                        <img src="/Dates/calendar.png" alt="calendar" className="w-6 h-6 object-contain" />
                        <div className="flex flex-col items-start text-left leading-none">
                          <span className={`text-[10px] md:text-[11px] font-semibold uppercase tracking-wider mb-0.5 ${isSelected ? 'text-blue-100' : 'text-gray-500 group-hover:text-[#0052FF]'}`}>
                            {displayWeekdays}
                          </span>
                          <span className={`text-xs md:text-sm font-semibold leading-none ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {displayRange}
                          </span>
                          {place && (
                            <span className={`text-[9px] md:text-[10px] mt-1 font-medium leading-none ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>
                              📍 {place}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <button
              onClick={() => setShowDatePickerModal(false)}
              className="w-full bg-black hover:bg-neutral-900 text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Confirm Date
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ThreeDaysWorkshopsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-white">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#009ee3] rounded-full animate-spin" />
      </div>
    }>
      <ThreeDaysWorkshopsContent />
    </Suspense>
  );
}

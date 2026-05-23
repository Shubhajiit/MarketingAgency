"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/common/Navbar";

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

const modulesData = [
  {
    title: "Module 1: Digital Marketing Landscape",
    content: [
      "Introduction to traditional vs. digital channels and core concepts.",
      "Developing a holistic digital marketing blueprint for modern businesses.",
      "Key metrics and success indicators for digital campaign performance."
    ]
  },
  {
    title: "Module 2: Understanding the Consumer & AI",
    content: [
      "Analyzing consumer journeys using digital footprints and data analytics.",
      "Leveraging AI modeling to predict customer behavior and intent.",
      "Creating hyper-personalized consumer profiles and dynamic targeting strategies."
    ]
  },
  {
    title: "Module 3: MarTech & AI Strategy",
    content: [
      "Module 1: Framework of MarTech Stack (Email, Mobile, SEO/SEM)",
      "Module 2: Lead Generation, Nurture & Retention Framework",
      "Module 3: Tools: Hubspot, Salesforce, Mailchimp, CRM",
      "Module 4: Analytics: Hotjar, Google Analytics, Firebase"
    ]
  },
  {
    title: "Module 4: AI, Gen AI and Agentic AI in Marketing",
    content: [
      "Introduction to generative models for text, image, and dynamic media creation.",
      "Agentic AI workflows: automated content creation, strategy planning, and operations.",
      "Ethical guidelines and scaling efficiency with AI agents in marketing departments."
    ]
  },
  {
    title: "Module 5: Leveraging Technologies for Scaling",
    content: [
      "Implementing marketing automation platforms at enterprise scale.",
      "Data synchronization across multiple touchpoints and customer data platforms (CDPs).",
      "Performance optimization and scale strategies for growing digital budgets."
    ]
  },
  {
    title: "Module 6: MarTech & Tech Stack Implementation",
    content: [
      "Deploying, testing, and launching complete MarTech stacks without down-time.",
      "Integration patterns, APIs, and rate limit management for data flows.",
      "Hands-on case studies of successful stack implementations in leading enterprises."
    ]
  }
];

export default function SocialMediaMarketingWorkshop() {
  // Dynamic SEO title and description updates
  useEffect(() => {
    document.title = "Executive Programme in MarTech & AI - Live Workshop | AI Scale";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Grab the social media landscape with our Executive Programme in MarTech & AI. Get certified with industry-leading tool coverage, hands-on demonstrations, and alumni status."
      );
    }
  }, []);

  const [showStickyBar, setShowStickyBar] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [activeModule, setActiveModule] = useState<number | null>(2);

  const handleToggleModule = (index: number) => {
    setActiveModule(activeModule === index ? null : index);
  };


  // Scroll handler for sticky booking bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown timer with persistence in sessionStorage
  useEffect(() => {
    const savedTarget = sessionStorage.getItem('workshop_timer_target');
    let targetTime: number;

    if (savedTarget) {
      targetTime = parseInt(savedTarget, 10);
    } else {
      targetTime = Date.now() + 10 * 60 * 1000; // 10 mins from now
      sessionStorage.setItem('workshop_timer_target', targetTime.toString());
    }

    const updateTimer = () => {
      const now = Date.now();
      const difference = targetTime - now;
      if (difference <= 0) {
        // Reset to another 10 mins to maintain urgency
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      mins: mins.toString().padStart(2, '0'),
      secs: secs.toString().padStart(2, '0')
    };
  };

  const formattedTime = formatTime(timeLeft);

  const handleScrollToBook = () => {
    const formElement = document.getElementById('brochure-firstName-input');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        formElement.focus();
      }, 800);
    }
  };

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

  const selectedCountry = countryCodes.find(c => c.code === formData.phoneCode) || countryCodes[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field as the user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const selectPhoneCode = (code: string) => {
    setFormData(prev => ({
      ...prev,
      phoneCode: code,
    }));
    setIsCountrySelectOpen(false);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = true;
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = true;
      isValid = false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = true;
      isValid = false;
    }
    if (!formData.phone.trim() || !/^\d{7,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = true;
      isValid = false;
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = true;
      isValid = false;
    }
    if (!formData.workExperience) {
      newErrors.workExperience = true;
      isValid = false;
    }
    if (!formData.city.trim()) {
      newErrors.city = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate brochure submission and download
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessModal(true);
        triggerBrochureDownload();
      }, 1200);
    }
  };

  const triggerBrochureDownload = () => {
    // Generate a mock text brochure file and trigger browser download
    const brochureText = `
=========================================
EXECUTIVE PROGRAMME IN MARTECH & AI
=========================================
Batch 3 - Starts June 23, 2026

Congratulations ${formData.firstName} ${formData.lastName}!
Thank you for downloading the brochure for our Executive Programme.

-----------------------------------------
PROGRAMME HIGHLIGHTS:
-----------------------------------------
1. Executive Alumni Status
2. Live Masterclasses by Industry Experts
3. Hands-on Tools Demo
4. Complete Tool Coverage: MarTech, Gen AI & Agentic AI

-----------------------------------------
PROGRAMME DETAILS:
-----------------------------------------
* Duration: 26 weeks, Online (4-6 hours weekly)
* Fees: ₹1,26,500 + GST
* Eligibility: Bachelor's Degree or 10+2+3 in any discipline

Contact us: 1800 4122 6965
Email: contact@aiscale.com
=========================================
    `;
    const blob = new Blob([brochureText.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MarTech_AI_Brochure_${formData.firstName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col bg-white transition-all duration-300 ${showStickyBar ? 'pb-[76px] sm:pb-[80px]' : ''}`}>
      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-50 w-full flex flex-col bg-white shadow-sm">
        {/* Top Banner 1 - Dark */}
        <div className="bg-[#333333] text-white text-[11px] md:text-sm py-2 overflow-hidden flex items-center">
          <div className="animate-marquee whitespace-nowrap flex min-w-max">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-4 text-blue-100 font-semibold tracking-wider">
                ★ HURRY! UPTO 50% OFF ON ALL WORKSHOP BOOKINGS ★
              </span>
            ))}
          </div>
        </div>

        {/* Top Banner 2 - Orange */}
        <div className="bg-[#fca130] py-1.5 px-4 md:px-16 text-white text-xs md:text-sm flex flex-row justify-between md:justify-end gap-4 md:gap-6 font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
          <a href="#" className="flex items-center gap-1.5 hover:underline shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Refer & Earn
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:underline shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Bootcamp
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:underline shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Demo Class
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:underline font-bold shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            1800 4122 6965
          </a>
        </div>

        {/* Navbar */}
        <Navbar />
      </div>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section
          className="relative bg-zinc-950 text-white min-h-[360px] lg:min-h-[400px] flex items-center py-8 md:py-9 overflow-hidden w-full"
          id="workshop-hero-section"
        >
          {/* Background image & overlay */}
          <div className="absolute inset-0 z-0 w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="MarTech and AI Workshop Presentation Lecture"
              className="w-full h-full object-cover object-center opacity-30 select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/85 md:to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-6">
              {/* Batch Tag */}
              <div className="bg-[#1e1e1e] border border-gray-700/60 text-gray-300 font-bold tracking-widest text-[10px] md:text-xs py-0.5 px-2.5 rounded mb-3.5 uppercase">
                BATCH 3
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-[46px] font-semibold tracking-tight leading-[1.1] mb-3.5 font-sans">
                Executive Programme in MarTech & AI
              </h1>

              {/* Subtitle */}
              <p className="text-gray-300 text-sm md:text-base lg:text-lg font-medium leading-relaxed mb-5 max-w-2xl">
                From strategy to stack – your roadmap to marketing in the era of AI
              </p>

              {/* Checkmark Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 w-full">
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm md:text-[15px] lg:text-[16px] text-gray-200 font-semibold leading-snug">Executive Alumni Status</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm md:text-[15px] lg:text-[16px] text-gray-200 font-semibold leading-snug">Live Masterclasses by Industry Experts</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm md:text-[15px] lg:text-[16px] text-gray-200 font-semibold leading-snug">Hands-on Tools Demo</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm md:text-[15px] lg:text-[16px] text-gray-200 font-semibold leading-snug">Complete Tool Coverage: Martech, Gen AI & Agentic AI</span>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-start">
              <div className="bg-white text-gray-900 rounded shadow-2xl p-5 md:p-6 w-full max-w-[480px] border border-gray-100 relative">

                <h2 className="text-lg md:text-xl font-black tracking-tight text-gray-900 mb-4 font-sans">
                  Get Your Brochure
                </h2>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        id="brochure-firstName-input"
                        className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${errors.firstName
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-gray-300 focus:border-gray-900'
                          }`}
                      />
                      {errors.firstName && (
                        <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <span className="text-xs">⚠️</span> Required
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        id="brochure-lastName-input"
                        className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${errors.lastName
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-gray-300 focus:border-gray-900'
                          }`}
                      />
                      {errors.lastName && (
                        <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <span className="text-xs">⚠️</span> Required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      id="brochure-email-input"
                      className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${errors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-gray-300 focus:border-gray-900'
                        }`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                        <span className="text-xs">⚠️</span> Required
                      </span>
                    )}
                  </div>

                  {/* Phone (Flag Select + Code + Input) */}
                  <div className="flex flex-col">
                    <div className="flex flex-row relative">
                      {/* Flag selector toggle */}
                      <button
                        type="button"
                        onClick={() => setIsCountrySelectOpen(!isCountrySelectOpen)}
                        id="phone-code-select-toggle"
                        className="flex items-center gap-1 px-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l hover:bg-gray-100 transition-colors select-none text-sm shrink-0 min-w-[70px] justify-between"
                      >
                        <span className="text-base">{selectedCountry.flag}</span>
                        <svg className={`w-3 h-3 text-gray-500 transition-transform ${isCountrySelectOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Options */}
                      {isCountrySelectOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg py-1 z-30 max-h-56 overflow-y-auto">
                          {countryCodes.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => selectPhoneCode(c.code)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2.5 text-gray-700"
                            >
                              <span className="text-base shrink-0">{c.flag}</span>
                              <span className="font-semibold text-gray-900 w-10">{c.code}</span>
                              <span className="text-gray-500 truncate">{c.country}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Phone Code indicator & input */}
                      <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none select-none text-xs text-gray-400 font-bold">
                          {formData.phoneCode}
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          id="brochure-phone-input"
                          className={`w-full text-sm pl-12 pr-3 py-2 border rounded-r focus:outline-none transition-colors ${errors.phone
                              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 border-l'
                              : 'border-gray-300 focus:border-gray-900 border-l'
                            }`}
                        />
                      </div>
                    </div>
                    {errors.phone && (
                      <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                        <span className="text-xs">⚠️</span> Required
                      </span>
                    )}
                  </div>

                  {/* Job Title & Work Experience */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <input
                        type="text"
                        name="jobTitle"
                        placeholder="Job Title"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        id="brochure-jobTitle-input"
                        className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${errors.jobTitle
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-gray-300 focus:border-gray-900'
                          }`}
                      />
                      {errors.jobTitle && (
                        <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <span className="text-xs">⚠️</span> Required
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col relative">
                      <select
                        name="workExperience"
                        value={formData.workExperience}
                        onChange={handleInputChange}
                        id="brochure-workExperience-select"
                        className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors appearance-none bg-white pr-8 ${errors.workExperience
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-gray-300 focus:border-gray-900'
                          }`}
                      >
                        <option value="" disabled hidden>Work Experience</option>
                        <option value="Entry Level">Entry Level (0-2 years)</option>
                        <option value="Mid Level">Mid Level (3-5 years)</option>
                        <option value="Senior Level">Senior Level (5-10 years)</option>
                        <option value="Executive Level">Executive Level (10+ years)</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {errors.workExperience && (
                        <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <span className="text-xs">⚠️</span> Required
                        </span>
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div className="flex flex-col">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      id="brochure-city-input"
                      className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${errors.city
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-gray-300 focus:border-gray-900'
                        }`}
                    />
                    {errors.city && (
                      <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                        <span className="text-xs">⚠️</span> Required
                      </span>
                    )}
                  </div>

                  {/* Disclaimer Consent text */}
                  <p className="text-[10px] leading-relaxed text-gray-500 mt-0.5 select-none font-medium">
                    By clicking the button below, you agree to receive communications via Email/Call/WhatsApp/SMS from MICA &amp;{' '}
                    <a href="#" className="underline font-semibold text-gray-600 hover:text-gray-900">Emeritus</a> about this programme and other relevant programs. <a href="#" className="underline font-semibold text-gray-600 hover:text-gray-900">Privacy Policy</a>.
                  </p>

                  {/* Download Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="brochure-submit-button"
                    className="mt-1 bg-[#cc0000] hover:bg-[#b30000] text-white text-center font-bold py-3 px-5 rounded uppercase tracking-wider text-xs md:text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 w-full flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      'DOWNLOAD BROCHURE'
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </section>

        {/* Stats / Details Horizontal Grid Bar */}
        <section
          className="border-t border-b border-gray-200 bg-[#f8f8f8] py-8 px-4 md:px-16 w-full z-10 font-sans"
          id="workshop-details-grid-bar"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-gray-300">
            {/* Starts On */}
            <div className="flex flex-col items-start md:px-8 first:pl-0">
              <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">
                STARTS ON
              </span>
              <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block">
                June 23, 2026
              </span>
            </div>

            {/* Duration */}
            <div className="flex flex-col items-start md:px-8">
              <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">
                DURATION
              </span>
              <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block mb-1">
                26 weeks, Online
              </span>
              <span className="text-xs font-medium text-gray-500 leading-normal block">
                4-6 hours of weekly
              </span>
            </div>

            {/* Fee */}
            <div className="flex flex-col items-start md:px-8">
              <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">
                PROGRAMME FEE
              </span>
              <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block mb-1">
                ₹1,26,500
              </span>
              <span className="text-xs font-medium text-gray-500 leading-normal block mb-1.5">
                GST will be charged at checkout
              </span>
              <a
                href="#"
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 hover:underline leading-relaxed block transition-colors"
              >
                Flexible Payment Options Available
              </a>
            </div>

            {/* Eligibility */}
            <div className="flex flex-col items-start md:pl-8 md:pr-0">
              <span className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2 block">
                ELIGIBILITY
              </span>
              <span className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight block mb-1.5">
                Bachelor's Degree or 10+2+3 in any discipline
              </span>
              <span className="text-xs font-medium text-gray-500 leading-relaxed block">
                Any Graduate (10+2+3) from a recognised university in any discipline.
              </span>
            </div>
          </div>
        </section>

        {/* Application Deadline Section */}
        <section
          className="bg-white py-12 px-4 md:px-16 w-full flex justify-center z-10"
          id="workshop-application-deadline"
        >
          <div className="w-full max-w-4xl bg-[#f5f5f5] py-8 px-6 text-center border border-gray-100">
            <h2 className="text-[#444444] text-[32px] font-bold tracking-tight mb-3">
              Application Deadline
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-normal">
              Apply by <span className="font-bold text-gray-800">May 27, 2026</span> at 11:59 PM
            </p>
          </div>
        </section>

        {/* Who is this Programme For Section */}
        <section className="bg-white py-16 px-4 md:px-16 w-full border-t border-gray-100 font-sans" id="who-is-this-programme-for">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-tight">
              Who is this Programme For
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-5xl">
              <strong className="text-gray-950 font-bold">For Visionaries Ready to Lead the AI-Marketing Evolution</strong> This programme is designed for professionals navigating the intersection of marketing and technology. As AI and automation redefine the customer journey, leaders must evolve from campaign execution to strategy, and from content creation to systems thinking data analytics. This programme empowers those ready to drive that shift.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-[#f8f9fa] p-6 md:p-8 rounded-lg flex flex-col gap-3 border border-gray-50/60 shadow-xs">
                <h3 className="text-lg md:text-xl font-bold text-gray-950 tracking-tight">
                  Senior Managers and Leaders
                </h3>
                <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed font-medium">
                  who are driving digital transformation in their organisations. Whether you're leading teams, influencing business strategy, or delivering high-stakes ROI and CX outcomes, this course equips you with the AI-driven MarTech acumen required to scale impact and performance.
                </p>
              </div>
              <div className="bg-[#f8f9fa] p-6 md:p-8 rounded-lg flex flex-col gap-3 border border-gray-50/60 shadow-xs">
                <h3 className="text-lg md:text-xl font-bold text-gray-955 tracking-tight">
                  Emerging Leaders and Strategic Marketers
                </h3>
                <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed font-medium">
                  who are at the cusp of marketing leadership, this programme builds a strategic foundation in MarTech and AI while deepening tool proficiency. Ideal for those seeking to shift from execution to decision-making roles, it offers the competitive edge to stand out in a rapidly digitising industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Programme Highlights Section */}
        <section className="bg-slate-50 py-16 px-4 md:px-16 w-full border-t border-b border-slate-100 font-sans" id="programme-highlights">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-tight">
              Programme Highlights
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-5xl">
              This executive programme provides a focus on MarTech and AI tools and applications to help professionals navigate the rapidly evolving industry landscape. With a blend of hands-on tools demo, live sessions, and case studies, participants will develop marketing and decision-making capabilities to lead and coordinate marketing initiatives in the AI era.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-6">
              {/* 1 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                    <polygon points="10 8 15 11 10 14" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Pre-recorded Video Lectures</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">Learn at your own pace with quality pre-recorded sessions.</p>
                </div>
              </div>

              {/* 2 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    <circle cx="8" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Live Sessions</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">Masterclasses by industry stalwarts for real-world insights.</p>
                </div>
              </div>

              {/* 3 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Tools & Libraries</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">Learn and practice with standard tools and frameworks.</p>
                </div>
              </div>

              {/* 4 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Sessions with Industry Experts</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">Interactive sessions for hands-on application of concepts.</p>
                </div>
              </div>

              {/* 5 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Capstone Project</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">Work on a real-world problem and design a solution.</p>
                </div>
              </div>

              {/* 6 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Co-learning Community</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">Interact with other learners globally on co-learning.</p>
                </div>
              </div>

              {/* 7 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Quizzes</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">Evaluate your understanding with regular short tests.</p>
                </div>
              </div>

              {/* 8 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Discussion Forums</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">Engage in peer-to-peer discussions on various topics.</p>
                </div>
              </div>

              {/* 9 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Real-world Case Studies</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">Analyse real marketing challenges faced by brands.</p>
                </div>
              </div>

              {/* 10 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-xs flex flex-col items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg className="w-5.5 h-5.5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="7" />
                    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">Alumni Status</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">Gain the prestigious alumni status upon completion.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Outcome Section */}
        <section className="bg-white py-16 px-4 md:px-16 w-full border-t border-gray-100 font-sans" id="learning-outcomes">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-tight">
              Learning Outcome
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-5xl mb-4 font-medium">
              This program empowers leaders with tools, skills, and conceptual frameworks. Become a marketing specialist who can steer growth, optimize budgets, and improve customer retention through adaptive AI tools and models.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left List Column */}
              <div className="lg:col-span-7 flex flex-col divide-y divide-gray-100">
                <div className="py-4.5 first:pt-0">
                  <p className="text-gray-700 text-sm md:text-[15px] font-medium leading-relaxed">
                    Recognise AI tools and applications to automate marketing campaigns and enhance customer experience.
                  </p>
                </div>
                <div className="py-4.5">
                  <p className="text-gray-700 text-sm md:text-[15px] font-medium leading-relaxed">
                    Understand the principles of database marketing and leverage data analytics for data-driven decisions.
                  </p>
                </div>
                <div className="py-4.5">
                  <p className="text-gray-700 text-sm md:text-[15px] font-medium leading-relaxed">
                    Deploy advanced marketing stacks and technologies to run and monitor marketing campaigns.
                  </p>
                </div>
                <div className="py-4.5">
                  <p className="text-gray-700 text-sm md:text-[15px] font-medium leading-relaxed">
                    Plan digital transformation strategies to scale business growth and ROI of marketing campaigns.
                  </p>
                </div>
                <div className="py-4.5">
                  <p className="text-gray-700 text-sm md:text-[15px] font-medium leading-relaxed">
                    Evaluate emerging MarTech trends and tools like Generative AI and Agentic AI to drive business growth.
                  </p>
                </div>
                <div className="py-4.5 last:pb-0">
                  <p className="text-gray-700 text-sm md:text-[15px] font-medium leading-relaxed">
                    Build a framework for continuous learning and adaptation to stay ahead in a rapidly changing marketing landscape.
                  </p>
                </div>
              </div>

              {/* Right Image Column */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <img
                  src="/learning_outcome.png"
                  alt="Marketing professionals collaborating in creative workspace"
                  className="rounded-2xl object-cover w-full h-full min-h-[300px] max-h-[460px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Masterclasses Section */}
        <section className="bg-slate-50 py-16 px-4 md:px-16 w-full border-t border-b border-slate-100 font-sans" id="expert-masterclasses">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-tight">
              Masterclasses with Subject Matter Experts
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-5xl">
              Learn directly from active industry leaders that design modern campaigns. Gain real-world perspectives on tools, workflows, and tactics that drive performance at scale across different industries.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Card 1 */}
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200/60 shadow-xs flex flex-row items-stretch hover:shadow-md transition-all duration-300 min-h-[140px] md:min-h-[160px]">
                <div className="w-[120px] md:w-[150px] shrink-0 relative">
                  <img
                    src="/expert_female.png"
                    alt="Prof. Falguni Vasavada"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col justify-center gap-2 flex-1">
                  <h3 className="text-base md:text-lg font-bold text-gray-950 leading-snug">
                    Prof. Falguni Vasavada
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">
                    Professor, Promo &amp; Director, MICA - Online Programmes
                  </p>
                  <a
                    href="#"
                    className="text-[#cc0000] hover:text-[#b30000] text-xs font-bold uppercase tracking-wider flex items-center gap-1 mt-1 transition-colors hover:underline"
                  >
                    View Profile <span className="text-sm">→</span>
                  </a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200/60 shadow-xs flex flex-row items-stretch hover:shadow-md transition-all duration-300 min-h-[140px] md:min-h-[160px]">
                <div className="w-[120px] md:w-[150px] shrink-0 relative">
                  <img
                    src="/expert_male.png"
                    alt="Prof. Siddharth Deshmukh"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col justify-center gap-2 flex-1">
                  <h3 className="text-base md:text-lg font-bold text-gray-955 leading-snug">
                    Prof. Siddharth Deshmukh
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">
                    Adjunct Faculty, Former Associate Dean, Industry Relations, MICA
                  </p>
                  <a
                    href="#"
                    className="text-[#cc0000] hover:text-[#b30000] text-xs font-bold uppercase tracking-wider flex items-center gap-1 mt-1 transition-colors hover:underline"
                  >
                    View Profile <span className="text-sm">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programme Modules Section */}
        <section className="bg-white py-16 px-4 md:px-16 w-full border-t border-gray-100 font-sans" id="programme-modules">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 tracking-tight leading-tight mb-2">
              Programme Modules
            </h2>

            <div className="flex flex-col gap-3.5 w-full">
              {modulesData.map((module, idx) => {
                const isOpen = activeModule === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-200/80 rounded-lg overflow-hidden bg-white shadow-xs"
                  >
                    {/* Header */}
                    <button
                      onClick={() => handleToggleModule(idx)}
                      className="w-full flex items-center justify-between p-5 bg-[#fcfcfc] hover:bg-[#f5f5f5] text-left transition-colors font-semibold text-gray-900 text-sm md:text-base cursor-pointer"
                    >
                      <span>{module.title}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Content Body */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-[500px] border-t border-gray-100' : 'max-h-0'
                      }`}
                    >
                      <div className="p-6 bg-white flex flex-col gap-3">
                        {module.content.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-3">
                            {/* Blue Accent Bullet Dot */}
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                            <p className="text-gray-700 text-xs md:text-sm leading-relaxed font-medium">
                              {point}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note & Download Button */}
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
          </div>
        </section>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowSuccessModal(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-lg p-8 shadow-2xl max-w-md w-full border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            {/* Success icon */}
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-5 text-[#22c55e]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">
              Brochure Downloaded Successfully!
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">
              Thank you, <strong className="text-gray-900 font-semibold">{formData.firstName}</strong>.
              The brochure has been generated and downloaded to your device. We have also emailed you details about the upcoming batch starting on <strong className="text-gray-900 font-semibold">June 23, 2026</strong>.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-8 rounded text-sm transition-colors w-full focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}



      {/* Sticky Book Seat Bottom Floating Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-[#eef9ff]/95 backdrop-blur-md border-t border-blue-100 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 ease-in-out transform ${
          showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 158, 227, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 158, 227, 0.04) 1px, transparent 1px)`,
          backgroundSize: '14px 14px',
        }}
      >
        {/* Neon Gradient Accent Line on Top */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />

        <div className="max-w-7xl mx-auto px-4 md:px-16 py-3.5 flex flex-row items-center justify-between gap-3 md:gap-6">
          {/* Left Side: Countdown Timer */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Clock Icon */}
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
              <svg className="w-4.5 h-4.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-[11px] md:text-sm font-semibold text-emerald-800 tracking-tight">
                Free Access Ends in
              </span>
              <span className="text-xs md:text-sm font-bold text-amber-500 tracking-wide bg-amber-50 px-2 py-0.5 rounded border border-amber-100/60 shadow-sm whitespace-nowrap">
                {formattedTime.mins} mins {formattedTime.secs} secs
              </span>
            </div>
          </div>

          {/* Right Side: CTA Button */}
          <button
            onClick={handleScrollToBook}
            className="relative group overflow-hidden bg-[#007f00] hover:bg-[#006600] active:scale-[0.98] text-white text-[11px] md:text-sm font-bold py-2.5 px-4 md:px-7 rounded shadow-[0_4px_14px_rgba(0,127,0,0.25)] hover:shadow-[0_6px_20px_rgba(0,127,0,0.35)] transition-all duration-200 shrink-0"
          >
            {/* Subtle gloss shimmer effect on hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span className="flex items-center gap-1.5 md:gap-2">
              Book your Seat Now for 
              <span className="line-through text-green-200 font-semibold">₹2,999</span> 
              <span className="text-yellow-300 font-extrabold uppercase animate-bounce-slow">FREE</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

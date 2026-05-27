"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getSyllabusModules } from "@/components/MainWebsite/Courses/certification-courses";
import { Course } from "@/components/common/CoursesCardsUI";
import { coursesApi } from "@/lib/api/courses";

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
];

const getCourseDetailMeta = (course: Course) => {
  const metaMap: Record<string, {
    instructorName: string;
    instructorBio: string;
    enrolledCount: string;
    rating: string;
    reviewsCount: string;
    level: string;
    type: string;
    typeSubtitle: string;
    whatYoullLearn: string[];
    skills: string[];
    tools: string[];
  }> = {
    "social-media-marketing-pop": {
      instructorName: "Elena R.",
      instructorBio: "Brand Manager & Social Strategist with 10+ years of experience scaling SaaS and retail brands.",
      enrolledCount: "128,450",
      rating: "4.8",
      reviewsCount: "12,482",
      level: "Beginner level",
      type: "Specialization",
      typeSubtitle: "Build job-ready social media skills with top brand experts",
      whatYoullLearn: [
        "Define your target audience and position your brand strategy for multi-channel growth.",
        "Produce high-converting creative assets and write engaging, algorithm-optimized copies.",
        "Launch and track paid acquisition campaigns across Meta, TikTok, and LinkedIn."
      ],
      skills: ["Social Strategy", "Paid Ads", "Content Creation", "Social Analytics", "Copywriting"],
      tools: ["Meta Ads Manager", "TikTok Business", "LinkedIn Ads", "Hootsuite"]
    },
    "advanced-ai-pop": {
      instructorName: "Dr. Sarah Jenkins",
      instructorBio: "AI Research Director & Growth Lead. Focuses on NLP models and marketing workflow automation.",
      enrolledCount: "85,920",
      rating: "4.9",
      reviewsCount: "5,301",
      level: "Intermediate level",
      type: "DMI Track",
      typeSubtitle: "Master advanced AI prompting and workflow automation",
      whatYoullLearn: [
        "Develop advanced prompting systems for generative AI assistants like ChatGPT and Claude.",
        "Build no-code automation pipelines to connect martech stacks with AI systems.",
        "Deploy machine learning tools for predictive churn analysis and predictive segmentation."
      ],
      skills: ["Prompt Engineering", "Workflow Automation", "No-code AI Integration", "Predictive Analytics", "Generative AI"],
      tools: ["ChatGPT", "Claude API", "Zapier", "Make.com", "Perplexity"]
    },
    "digital-marketing-diploma-pop": {
      instructorName: "Paula Del Rey",
      instructorBio: "Senior Digital Strategist & Lecturer. Passionate about marketing analytics and customer retention.",
      enrolledCount: "384,768",
      rating: "4.7",
      reviewsCount: "4,745",
      level: "Intermediate level",
      type: "Guided Project",
      typeSubtitle: "Learn, practice, and apply job-ready skills with expert guidance",
      whatYoullLearn: [
        "Create an account with Microsoft Office 365 online and upload a document.",
        "Use functions such as IF, VLOOKUP and create PivotTables to perform more advanced data analysis.",
        "Use sorting and filtering tools to perform simple data analysis."
      ],
      skills: ["Excel Formulas", "Pivot Tables And Charts", "Data Analysis", "Data Mining", "Data Manipulation"],
      tools: ["Microsoft Excel", "Microsoft Office"]
    },
    "search-marketing-pop": {
      instructorName: "Arjun M.",
      instructorBio: "Marketing Director & Search Lead. Specialist in SEO, SEM, and high-performance PPC campaigns.",
      enrolledCount: "94,150",
      rating: "4.8",
      reviewsCount: "3,110",
      level: "Intermediate level",
      type: "Specialization",
      typeSubtitle: "Master SEO and PPC search marketing systems",
      whatYoullLearn: [
        "Understand search engine architectures to perform advanced keyword targeting.",
        "Optimize on-page and technical SEO setups to boost organic search presence.",
        "Design, manage, and scale Google Search Ads and paid search bidding structures."
      ],
      skills: ["Keyword Research", "Technical SEO", "Google Ads", "SEM Strategy", "Web Analytics"],
      tools: ["Google Search Console", "Google Ads", "Ahrefs", "Google Analytics 4"]
    },
    "dmi-pro-spec": {
      instructorName: "Paula Del Rey",
      instructorBio: "Senior Digital Strategist & Lecturer. Passionate about marketing analytics and customer retention.",
      enrolledCount: "154,230",
      rating: "4.7",
      reviewsCount: "2,210",
      level: "Intermediate level",
      type: "Specialization",
      typeSubtitle: "Master modern multi-channel digital campaign frameworks",
      whatYoullLearn: [
        "Formulate multi-channel acquisition funnels to optimize acquisition costs.",
        "Execute automated email nurture sequences to drive conversion metrics.",
        "Configure web tracking tags to identify digital sales bottlenecks."
      ],
      skills: ["Acquisition Funnels", "Email Automation", "GTM Setup", "Campaign Analytics", "Conversion Rate Optimization"],
      tools: ["Mailchimp", "Google Tag Manager", "Hotjar", "Google Analytics"]
    },
    "search-marketing-spec": {
      instructorName: "Arjun M.",
      instructorBio: "Marketing Director & Search Lead. Specialist in SEO, SEM, and high-performance PPC campaigns.",
      enrolledCount: "74,100",
      rating: "4.8",
      reviewsCount: "1,550",
      level: "Intermediate level",
      type: "Specialization",
      typeSubtitle: "Master SEO and PPC search marketing systems",
      whatYoullLearn: [
        "Deploy advanced keyword planning to target commercial intent searchers.",
        "Audit site speeds, schema tags, and mobile accessibility parameters.",
        "Optimize Google Search Ads and Paid Search (PPC) budgeting mix."
      ],
      skills: ["PPC Strategy", "Technical SEO Audits", "Keyword Targeting", "Google Ads Editor", "Conversion Attribution"],
      tools: ["Google Ads", "Screaming Frog", "Semrush", "GA4"]
    },
    "social-media-marketing-spec": {
      instructorName: "Elena R.",
      instructorBio: "Brand Manager & Social Strategist with 10+ years of experience scaling SaaS and retail brands.",
      enrolledCount: "92,400",
      rating: "4.8",
      reviewsCount: "3,420",
      level: "Beginner level",
      type: "Specialization",
      typeSubtitle: "Build job-ready social media skills with top brand experts",
      whatYoullLearn: [
        "Develop an integrated social media calendar aligning content to customer segments.",
        "Leverage social listening metrics to monitor brand sentiment trends.",
        "Utilize creator tools to run high-converting UGC campaigns."
      ],
      skills: ["Content Calendars", "UGC Production", "Social Listening", "Influencer Strategy", "Meta Ads Manager"],
      tools: ["Meta Business Suite", "TikTok Studio", "Brandwatch", "Canva Pro"]
    },
    "strategy-leadership-spec": {
      instructorName: "James R.",
      instructorBio: "Agency Founder & Leadership Coach. Advises Fortune 500 teams on digital transformation.",
      enrolledCount: "63,800",
      rating: "4.9",
      reviewsCount: "1,180",
      level: "Advanced level",
      type: "Specialization",
      typeSubtitle: "Formulate digital-first business strategies and drive high-tempo growth",
      whatYoullLearn: [
        "Develop digital-first operational roadmaps that align cross-functional teams.",
        "Construct customer journey maps to orchestrate seamless customer pathways.",
        "Optimize budget allocations across paid, organic, and earned martech layers."
      ],
      skills: ["Strategic Roadmaps", "Omnichannel Funnels", "Budget Optimization", "Martech Operations", "Agile Leadership"],
      tools: ["Miro", "Jira", "Tableau", "Salesforce Marketing Cloud"]
    }
  };

  const defaultMeta = {
    instructorName: course.authorName || "Paula Del Rey",
    instructorBio: "Industry Certified Expert with years of hands-on strategy and execution experience.",
    enrolledCount: "210,000",
    rating: "4.8",
    reviewsCount: "3,150",
    level: course.category === "advanced" ? "Advanced level" : course.category === "short" ? "Beginner level" : "Intermediate level",
    type: "Professional Certification",
    typeSubtitle: "Learn, practice, and apply job-ready skills with expert guidance",
    whatYoullLearn: [
      "Explain the fundamental theories and acquisition tools mapped to this certification.",
      "Execute hands-on laboratory exercises mirroring real-world organizational challenges.",
      "Construct a deployment-ready case study project to display on your professional resume."
    ],
    skills: ["Practical Analytics", "Industry Workflows", "Campaign Systems", "Critical Strategy", "Execution Details"],
    tools: ["Google Workspace", "Figma", "Trello"]
  };

  const cid = (course as any)._id || course.id;
  return metaMap[cid] || defaultMeta;
};

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Sticky header state
  const [isSticky, setIsSticky] = useState(false);
  const [hasStickyMeasured, setHasStickyMeasured] = useState(false);
  // Recommended courses state
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);

  // Active Tab state
  const [activeSubTab, setActiveSubTab] = useState<"about" | "outcomes" | "syllabus" | "testimonials" | "reviews">("about");

  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const testimonialsRef = useRef<HTMLDivElement | null>(null);

  // Form State
  const [enrollForm, setEnrollForm] = useState({
    name: "",
    email: "",
    phoneCode: "+91",
    phone: "",
  });
  const [enrollErrors, setEnrollErrors] = useState<Record<string, boolean>>({});
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.get(id);
        setCourse(res.data.course);
      } catch (err) {
        console.error("Failed to load course details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await coursesApi.list();
        if (res?.data?.courses) {
          const filtered = res.data.courses
            .filter((c: any) => (c._id || c.id) !== id)
            .slice(0, 3);
          setRecommendedCourses(filtered);
        }
      } catch (err) {
        console.error("Failed to load recommended courses:", err);
      }
    };
    fetchRecommendations();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const tabsEl = document.getElementById("main-content-tabs");
      if (tabsEl) {
        const rect = tabsEl.getBoundingClientRect();
        if (rect.height > 0) {
          // Show sticky header only when the main navigation tabs have completely scrolled out of view
          setIsSticky(rect.bottom <= 0);
          setHasStickyMeasured(true);
        }
      } else if (window.scrollY > 0) {
        setIsSticky(window.scrollY > 600);
        setHasStickyMeasured(true);
      }
    };

    const rafId = window.requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-white text-gray-900">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-[#0056d2]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-slate-500 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-white text-gray-900 px-4">
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          The course with ID "{id}" could not be located in our certification course directory.
        </p>
        <Link
          href="/courses"
          className="px-6 py-2.5 bg-[#0056d2] text-white font-semibold rounded hover:bg-[#00419e] transition-colors"
        >
          View All Courses
        </Link>
      </div>
    );
  }

  const detailMeta = getCourseDetailMeta(course);
  const modules = getSyllabusModules(course.title);

  const handleEnrollInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEnrollForm((prev) => ({ ...prev, [name]: value }));
    if (enrollErrors[name]) {
      setEnrollErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateEnrollForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;
    if (!enrollForm.name.trim()) { newErrors.name = true; isValid = false; }
    if (!enrollForm.email.trim() || !/\S+@\S+\.\S+/.test(enrollForm.email)) { newErrors.email = true; isValid = false; }
    if (!enrollForm.phone.trim() || !/^\d{7,15}$/.test(enrollForm.phone.replace(/[\s-()]/g, ""))) { newErrors.phone = true; isValid = false; }
    setEnrollErrors(newErrors);
    return isValid;
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEnrollForm()) {
      setIsEnrolling(true);
      setTimeout(() => {
        setIsEnrolling(false);
        setEnrollSuccess(true);
      }, 1200);
    }
  };

  const scrollTestimonials = (direction: "left" | "right") => {
    const container = testimonialsRef.current;
    if (!container) return;
    const scrollAmount = Math.max(240, Math.floor(container.clientWidth * 0.85));
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white text-gray-900 relative">

      {/* Sticky Top Header on Scroll (Bottom Sticky on Mobile) */}
      <div
        className={`fixed left-0 right-0 bg-white z-[60] transform
          ${hasStickyMeasured ? "transition-all duration-300" : "transition-none"}
          md:top-0 md:bottom-auto md:border-b md:border-slate-200 md:shadow-md
          bottom-0 top-auto border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]
          ${!hasStickyMeasured
            ? "md:-translate-y-full translate-y-full opacity-0 pointer-events-none"
            : isSticky
              ? "translate-y-0 opacity-100"
              : "md:-translate-y-full translate-y-full opacity-0 pointer-events-none"
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          {/* Row 1: Logo, Course Title and CTA */}
          <div className="flex items-center justify-start md:justify-between py-3 border-b-0 md:border-b border-slate-100">
            <div className="hidden md:flex items-center gap-3">
              {/* Stylized "courses" badge */}
              <div className="flex items-center gap-1 bg-[#ebf3fc] text-[#0056d2] px-2 py-0.5 rounded text-[10px] font-normal tracking-wider uppercase border border-[#0056d2]/15 shrink-0">
                <span>courses</span>
              </div>

              {/* Course Title */}
              <span className="font-bold text-slate-800 text-base md:text-[18px] line-clamp-1 max-w-[150px] sm:max-w-[320px] md:max-w-xl lg:max-w-3xl">
                {course.title}
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                const formEl = document.getElementById("enrollment-form");
                if (formEl) {
                  formEl.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-[#0056d2] hover:bg-[#00419e] active:scale-[0.99] text-white text-sm font-semibold py-3.5 px-6 rounded-md shadow-sm transition-all normal-case tracking-wider cursor-pointer shrink-0"
            >
              Contact sales
            </button>
          </div>

          {/* Row 2: Sub-navigation Tabs */}
          <div className="hidden md:flex gap-2 sm:gap-6 overflow-x-auto whitespace-nowrap scrollbar-none py-1.5 select-none items-center">
            {[
              { id: "about", label: "About" },
              { id: "outcomes", label: "Outcomes" },
              { id: "syllabus", label: "Project details" },
              { id: "testimonials", label: "Testimonials" },
              { id: "reviews", label: "Reviews" },
              { id: "recommendations", label: "Recommendations" }
            ].map((tab) => {
              const isActive = tab.id === "reviews" || tab.id === "recommendations" ? false : activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "recommendations") {
                      const recEl = document.getElementById("recommendations-section");
                      if (recEl) {
                        recEl.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    } else if (tab.id === "reviews") {
                      const revEl = document.getElementById("reviews-section");
                      if (revEl) {
                        revEl.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    } else {
                      setActiveSubTab(tab.id as any);
                      const mainEl = document.getElementById("main-content-tabs");
                      if (mainEl) {
                        mainEl.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
                  className={`px-3 py-1.5 text-[14.5px] font-normal transition-all cursor-pointer relative ${isActive
                    ? "text-[#0056d2]"
                    : "text-black hover:text-[#0056d2]"
                    }`}
                >
                  {tab.label}
                  {/* Underline for active tab */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0056d2] rounded-t-sm" />
                  )}
                  {/* Subtle background block for active tab */}
                  {isActive && (
                    <span className="absolute inset-0 bg-[#f0f4f9]/50 -z-10 rounded-md" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Breadcrumbs Trail */}
      <div className="max-w-7xl w-full mx-auto px-4 pt-2 flex items-center gap-2 text-[13px] text-slate-500 font-medium select-none">
        <Link href="/" className="hover:text-[#0056d2] transition-colors">
          <svg className="w-4 h-4 shrink-0 text-slate-500 hover:text-[#0056d2]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M9.293 1.5a1 1 0 011.414 0l7.5 7.5A1 1 0 0117.5 10H16v6a1 1 0 01-1 1h-3.5a1 1 0 01-1-1v-3H9v3a1 1 0 01-1 1H4.5a1 1 0 01-1-1v-6H2.5a1 1 0 01-.707-1.707l7.5-7.5z" />
          </svg>
        </Link>
        <span className="text-slate-350 text-[11px] font-bold">&gt;</span>
        <Link href="/courses" className="hover:text-[#0056d2] transition-colors">Courses</Link>
        <span className="text-slate-350 text-[11px] font-bold">&gt;</span>
        <span className="text-slate-400 font-semibold">Course details</span>
      </div>

      {/* 1. Header Section */}
      <header className="relative w-full mt-2 bg-[#f8fafd] border-y border-slate-100 overflow-hidden pt-6 pb-12 md:pt-10 md:pb-28">

        {/* Dynamic Arcs SVG (Concentric Coursera branding geometry) */}
        <div className="absolute right-0 bottom-0 top-0 w-full md:w-[45%] overflow-hidden pointer-events-none select-none z-0 flex items-center justify-end">
          <svg className="w-[120%] h-[120%] translate-x-[20%] translate-y-[5%] text-[#0056d2]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.04" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="2" strokeOpacity="0.06" strokeDasharray="300 100" strokeDashoffset="45" />
            <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="3" strokeOpacity="0.08" strokeDasharray="200 50" />
            <path d="M 100,100 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 0,1 -80,0" stroke="currentColor" strokeWidth="15" strokeOpacity="0.05" strokeDasharray="180 80" strokeDashoffset="20" strokeLinecap="round" />
            <path d="M 100,100 m -25,0 a 25,25 0 1,0 50,0 a 25,25 0 0,0 -50,0" stroke="currentColor" strokeWidth="20" strokeOpacity="0.06" strokeDasharray="100 60" strokeDashoffset="80" strokeLinecap="round" />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4">

          {/* Brand Logo */}
          <div className="flex items-center gap-2 mb-4 font-sans">
            <span className="text-[#0056d2] text-xl font-bold tracking-tight select-none">AIScale</span>
          </div>

          {/* Course Name */}
          <h1 className="text-2xl sm:text-3xl md:text-[42px] font-bold text-[#0c102a] tracking-tight leading-tight max-w-3xl mb-5">
            {course.title}
          </h1>

          {/* Instructor Block */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <img
                src={course.thumbnail || course.instructorImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"}
                alt={detailMeta.instructorName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[13px] font-medium text-slate-700">
              Instructor: <span className="text-[#0056d2] underline hover:text-[#00419e] cursor-pointer font-bold">{detailMeta.instructorName}</span>
            </span>
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                const formEl = document.getElementById("enrollment-form");
                if (formEl) {
                  formEl.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-[#0056d2] hover:bg-[#00419e] active:scale-[0.99] text-white text-sm font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all w-fit uppercase tracking-wide cursor-pointer"
            >
              Contact sales
            </button>

            {/* Enrollment subtext */}
            <div className="flex flex-col gap-1.5 text-[13px] text-slate-500 font-medium">
              <span className="text-slate-800 font-bold">
                {detailMeta.enrolledCount} already enrolled
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                Included with <span className="text-[#0056d2] font-normal tracking-tight">all strategies</span> <span className="mx-1.5 text-slate-300">•</span> <span className="text-[#0056d2] underline hover:text-[#00419e] cursor-pointer">Learn more</span>
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Floating White Summary Card */}
      <section className="relative z-20 max-w-[1440px] w-full mx-auto px-4 md:px-10">
        <div className="bg-transparent md:bg-white rounded-none md:rounded-xl border-none md:border md:border-slate-100/70 shadow-none md:shadow-[0_15px_35px_rgba(0,0,0,0.18)] mt-8 md:-mt-12 p-0 md:p-7">
          <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:gap-4 divide-y-0 md:divide-x divide-slate-100 text-left">

            {/* 1. Guided Project Type */}
            <div className="flex flex-col pr-2">
              <span className="font-bold text-slate-800 text-[18px] underline hover:underline cursor-pointer">
                {detailMeta.type}
              </span>
              <span className="text-[14px] text-slate-500 font-medium mt-1 leading-relaxed">
                {detailMeta.typeSubtitle}
              </span>
            </div>

            {/* 2. Rating */}
            <div
              onClick={() => {
                const reviewsEl = document.getElementById("reviews-section");
                if (reviewsEl) {
                  reviewsEl.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className="flex flex-row md:flex-col items-baseline md:items-start gap-1.5 md:gap-0 md:pl-5 cursor-pointer group shrink-0"
            >
              <span className="font-bold text-slate-800 text-[18px] flex items-center gap-1 group-hover:text-[#0056d2] transition-colors">
                {detailMeta.rating} <span className="text-[#0056d2] text-sm">★</span>
              </span>
              <span className="text-[14px] text-slate-500 font-medium md:mt-1 group-hover:underline">
                ({detailMeta.reviewsCount} reviews)
              </span>
            </div>

            {/* 3. Level */}
            <div className="flex flex-col md:pl-5">
              <span className="font-bold text-slate-800 text-[18px]">
                {detailMeta.level}
              </span>
              <span className="text-[14px] text-slate-500 font-medium mt-1 flex items-center gap-1 cursor-pointer group">
                Recommended experience
                <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>

            {/* 4. Duration */}
            <div className="flex flex-col md:pl-5">
              <span className="font-bold text-slate-800 text-[18px]">
                {course.hours.split("•")[0].trim() || "30 Hours"}
              </span>
              <span className="text-[14px] text-slate-500 font-medium mt-1">
                Learn at your own pace
              </span>
            </div>

            {/* 5. Hands-on Learning */}
            <div className="flex flex-col md:pl-5">
              <span className="font-bold text-slate-800 text-[18px]">
                Hands-on learning
              </span>
              <span className="text-[14px] text-[#0056d2] underline hover:text-[#00419e] mt-1 font-semibold cursor-pointer">
                Learn more
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Content Details & Registration Area */}
      <main className="max-w-[1440px] w-full mx-auto px-4 md:px-10 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

        {/* Left Column: Syllabus & About */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Horizontal Navigation Tabs */}
          <div id="main-content-tabs" className="border-b border-slate-200 flex gap-6 pb-2 mb-2 overflow-x-auto whitespace-nowrap scrollbar-none select-none scroll-mt-28">
            {[
              { id: "about", label: "About" },
              { id: "outcomes", label: "Outcomes" },
              { id: "syllabus", label: "Project details" },
              { id: "testimonials", label: "Testimonials" },
              { id: "reviews", label: "Reviews" },
              { id: "recommendations", label: "Recommendations" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "recommendations") {
                    const recEl = document.getElementById("recommendations-section");
                    if (recEl) {
                      recEl.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  } else if (tab.id === "reviews") {
                    const revEl = document.getElementById("reviews-section");
                    if (revEl) {
                      revEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  } else {
                    setActiveSubTab(tab.id as any);
                  }
                }}
                className={`px-3.5 py-2 text-[14.5px] font-semibold transition-all cursor-pointer rounded-md ${(tab.id === "reviews" || tab.id === "recommendations" ? false : activeSubTab === tab.id)
                  ? "bg-[#ebf3fc] text-[#0056d2] font-bold"
                  : "text-black hover:text-[#0056d2] hover:bg-slate-50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conditional Rendering based on selected Tab */}
          {activeSubTab === "about" && (
            <div className="flex flex-col gap-6 md:gap-10 animate-in fade-in duration-200">
              {/* What you'll learn section */}
              <section className="flex flex-col gap-4">
                <h3 className="text-[19px] font-bold text-slate-900 tracking-tight">
                  What you'll learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {detailMeta.whatYoullLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-slate-800 text-[14px] mt-0.5 shrink-0 font-bold">✓</span>
                      <span className="text-[14px] text-slate-700 leading-relaxed font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills you'll practice section */}
              <section className="flex flex-col gap-4 border-t border-slate-100 pt-5 md:pt-8">
                <h3 className="text-[19px] font-bold text-slate-900 tracking-tight">
                  Skills you'll practice
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {detailMeta.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4.5 py-2 bg-[#ebf3fc]/80 text-[#0056d2] text-[13.5px] font-bold rounded-full hover:bg-[#ebf3fc] transition-colors cursor-pointer select-none"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Tools you'll use section */}
              <section className="flex flex-col gap-4 border-t border-slate-100 pt-5 md:pt-8">
                <h3 className="text-[19px] font-bold text-slate-900 tracking-tight">
                  Tools you'll use
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {detailMeta.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-4.5 py-2 bg-[#f2f4f8] text-slate-700 text-[13.5px] font-bold rounded-full hover:bg-slate-200 transition-colors cursor-pointer select-none"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              {/* Details to know grid */}
              <section className="flex flex-col gap-5 border-t border-slate-100 pt-5 md:pt-8">
                <h3 className="text-[19px] font-bold text-slate-900 tracking-tight">
                  Details to know
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 mt-2">

                  {/* shareable certificate */}
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[#0077b5] text-2xl select-none mb-1">
                      <svg className="w-7 h-7 fill-[#0077b5]" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </span>
                    <span className="font-bold text-slate-800 text-[14.5px]">Shareable certificate</span>
                    <span className="text-[12.5px] text-slate-500 font-medium">Add to your LinkedIn profile</span>
                  </div>

                  {/* Taught in English */}
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-slate-650 text-2xl select-none mb-1">
                      <svg className="w-7 h-7 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </span>
                    <span className="font-bold text-slate-800 text-[14.5px]">Taught in English</span>
                    <span className="text-[12.5px] text-[#0056d2] underline hover:text-[#00419e] cursor-pointer font-bold">5 languages available</span>
                  </div>

                  {/* No downloads required */}
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-slate-650 text-2xl select-none mb-1">
                      <svg className="w-7 h-7 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="font-bold text-slate-800 text-[14.5px]">No downloads or installation required</span>
                    <span className="text-[12.5px] text-slate-500 font-medium">Only available on desktop</span>
                  </div>

                </div>
              </section>

              {/* About this Guided Project Section */}
              <section className="flex flex-col gap-6 w-full mt-12 border-t border-slate-100 pt-10 text-left">
                <div className="flex flex-col gap-3">
                  <h3 className="text-[21px] font-bold text-slate-900 tracking-tight">
                    About this Guided Project
                  </h3>
                  <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                    In this project, you will learn the foundation of data analysis with Microsoft Excel using sales data from a sample company. You will learn how to use sorting and filtering tools to reorganize your data and access specific information about your data. You will also learn about the use of functions like IF and VLOOKUP functions to create new data and relate data from different tables. Finally, you...
                  </p>
                  <button className="text-[13.5px] text-[#0056d2] font-bold hover:underline self-start">
                    Read more
                  </button>
                </div>

                {/* Learn step-by-step (Full width of left column) */}
                <div className="w-full mt-4 border border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[17px] font-bold text-slate-900">
                      Learn step-by-step
                    </h4>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                      In a video that plays in a split-screen with your work area, your instructor will walk you through these steps:
                    </p>
                  </div>

                  <ol className="flex flex-col gap-3.5 text-[13.5px] text-slate-700 font-medium">
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#0056d2] font-bold shrink-0">1 .</span>
                      <span>Upload a document using the free online version of Microsoft Office 365.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#0056d2] font-bold shrink-0">2 .</span>
                      <span>Perform data analysis using sorting and filtering tools.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#0056d2] font-bold shrink-0">3 .</span>
                      <span>Perform data mining using the IF function.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#0056d2] font-bold shrink-0">4 .</span>
                      <span>Create references between tables and search for information with VLOOKUP.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#0056d2] font-bold shrink-0">5 .</span>
                      <span>Perform data analysis using PivotTables.</span>
                    </li>
                  </ol>

                  <div className="border-t border-slate-100 pt-5 flex flex-col gap-1.5">
                    <h5 className="text-[13.5px] font-bold text-slate-900">
                      Recommended experience
                    </h5>
                    <p className="text-[13px] text-slate-600 font-medium">
                      Basic knowledge of spreadsheets and data analysis
                    </p>
                  </div>
                </div>
              </section>

            </div>
          )}

          {activeSubTab === "outcomes" && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-200">
              <section className="flex flex-col gap-3">
                <h3 className="text-[19px] font-bold text-slate-900 tracking-tight">Career Outcomes</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  According to surveys of graduates who completed these certifications, they achieved key career accelerations shortly after graduation:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                  <div className="border border-slate-100 rounded-lg p-5 bg-[#f8fafd] flex flex-col items-center text-center shadow-xs">
                    <span className="text-3xl font-black text-[#0056d2]">94%</span>
                    <span className="text-xs text-slate-700 font-bold mt-2">Career Benefits</span>
                    <span className="text-[11px] text-slate-500 font-medium mt-1 leading-normal">Reported salary increase, promotions, or job offers</span>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-5 bg-[#f8fafd] flex flex-col items-center text-center shadow-xs">
                    <span className="text-3xl font-black text-[#0056d2]">35%</span>
                    <span className="text-xs text-slate-700 font-bold mt-2">Salary Increase</span>
                    <span className="text-[11px] text-slate-500 font-medium mt-1 leading-normal">Average salary raise reported by participants</span>
                  </div>
                  <div className="border border-slate-100 rounded-lg p-5 bg-[#f8fafd] flex flex-col items-center text-center shadow-xs">
                    <span className="text-3xl font-black text-[#0056d2]">1 in 5</span>
                    <span className="text-xs text-slate-700 font-bold mt-2">Started Agency</span>
                    <span className="text-[11px] text-slate-500 font-medium mt-1 leading-normal">Launched their own marketing agency operations</span>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-3 border-t border-slate-100 pt-8 mt-2">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider">Top Companies Hiring Our Alumni</h3>
                <div className="flex flex-wrap gap-6 items-center mt-2 opacity-65 grayscale hover:grayscale-0 transition-all">
                  {/* Styled mock text logos */}
                  <span className="font-sans font-black text-slate-700 text-lg">Google</span>
                  <span className="font-sans font-black text-slate-700 text-lg">Meta</span>
                  <span className="font-sans font-black text-slate-700 text-lg">Microsoft</span>
                  <span className="font-sans font-black text-slate-700 text-lg">Amazon</span>
                  <span className="font-sans font-black text-slate-700 text-lg">Adobe</span>
                </div>
              </section>
            </div>
          )}

          {activeSubTab === "syllabus" && (
            <div className="flex flex-col gap-10 animate-in fade-in duration-200">
              {/* Curriculum / Syllabus section */}
              <section className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <h3 className="text-[19px] font-bold text-slate-900 tracking-tight">
                    Course Syllabus
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Review the core training phases covered under this program:
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 mt-2">
                  {modules.map((module, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-lg p-5 bg-[#fcfdfe] hover:bg-slate-50/50 transition-all shadow-xs">
                      <h4 className="text-sm font-extrabold text-[#0c102a] leading-snug">
                        {module.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                        {module.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Instructor Bio detailed */}
              <section className="border-t border-slate-100 pt-8">
                <h3 className="text-[19px] font-bold text-[#0c102a] tracking-tight">
                  Your Instructor
                </h3>
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <img
                      src={course.thumbnail || course.instructorImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"}
                      alt={detailMeta.instructorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <h4 className="font-bold text-[#0056d2] text-base underline hover:text-[#00419e] cursor-pointer">
                      {detailMeta.instructorName}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      Lead Academy Advisor
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1">
                      {detailMeta.instructorBio}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeSubTab === "testimonials" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <h3 className="text-[19px] font-bold text-slate-900 tracking-tight">Student Testimonials</h3>
              {[
                { author: "James R.", role: "Digital Agency Lead", text: "A lot of online workshops, but this one actually delivered. Practical, no fluff, and I left with tools I could use the very next day. Worth every minute." },
                { author: "Sarah K.", role: "Growth Lead", text: "The session on AI-driven SEO alone saved my team weeks of manual research. This isn't just theory—it's highly actionable systems that produce real growth." },
                { author: "Arjun M.", role: "Marketing Director", text: "Excellent value. The instructor walked through a live setup of a lead generation funnel without any complex coding. A game-changer for our agency." }
              ].map((t, idx) => (
                <div key={idx} className="border border-slate-100 rounded-lg p-5 bg-[#fffdf8] shadow-xs">
                  <div className="flex text-[#fca130] text-sm mb-2.5">★★★★★</div>
                  <p className="text-slate-600 text-[13.5px] leading-relaxed italic">"{t.text}"</p>
                  <div className="text-[12.5px] font-bold text-slate-800 mt-3">{t.author} — <span className="text-slate-400 font-normal">{t.role}</span></div>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === "reviews" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <p className="text-slate-550 text-sm font-medium text-left">
                Scroll down or click <button onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })} className="text-[#0056d2] underline font-bold">here</button> to view the full student reviews.
              </p>
            </div>
          )}



        </div>

        {/* Right Column: Pricing & Enrollment form */}
        <div className="hidden lg:block lg:col-span-4">
          <div id="enrollment-form" className="border border-slate-150 rounded-xl bg-white shadow-[0_5px_22px_rgba(0,0,0,0.03)] p-6 md:p-7 sticky top-28 flex flex-col gap-5">

            {/* Header info */}
            <div>
              <span className="text-[10px] font-extrabold text-[#0056d2] tracking-widest uppercase block mb-1">
                Course Tuition Fee
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-bold text-[#0c102a]">
                  ₹{course.price}
                </span>
                <span className="text-slate-400 text-base line-through font-semibold">
                  ₹{course.originalPrice}
                </span>
                <span className="bg-[#a3ff12] text-[#0c102a] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                  {course.discount} OFF
                </span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Enrollment form body */}
            {enrollSuccess ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5 text-center flex flex-col items-center gap-3 animate-in fade-in duration-200">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg font-bold">
                  ✓
                </div>
                <h4 className="text-base font-bold text-emerald-950">
                  Enquiry Received!
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Thank you, <strong className="text-emerald-950 font-bold">{enrollForm.name}</strong>. Your enquiry for <strong className="text-emerald-950 font-bold">{course.title}</strong> has been submitted. A study advisor will contact you within 24 hours at <strong className="text-emerald-950 font-bold">{enrollForm.email}</strong> to assist with enrolment details.
                </p>
                <button
                  onClick={() => setEnrollSuccess(false)}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase mb-1">
                    Secure Your Seat
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Submit your application details below. No upfront payment required to register.
                  </p>
                </div>

                {/* Name */}
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={enrollForm.name}
                    onChange={handleEnrollInputChange}
                    className={`w-full text-xs px-3.5 py-2.5 border rounded-lg focus:outline-none transition-colors ${enrollErrors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-200 focus:border-[#0056d2]"
                      }`}
                  />
                  {enrollErrors.name && (
                    <span className="text-[10px] text-red-600 font-bold mt-1">⚠️ Name is required</span>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="email"
                    placeholder="Work/Personal Email"
                    value={enrollForm.email}
                    onChange={handleEnrollInputChange}
                    className={`w-full text-xs px-3.5 py-2.5 border rounded-lg focus:outline-none transition-colors ${enrollErrors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-200 focus:border-[#0056d2]"
                      }`}
                  />
                  {enrollErrors.email && (
                    <span className="text-[10px] text-red-600 font-bold mt-1">⚠️ Valid email is required</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <div className="flex flex-row relative">
                    <button
                      type="button"
                      onClick={() => setIsCountrySelectOpen(!isCountrySelectOpen)}
                      className="flex items-center gap-1 px-2.5 border border-r-0 border-gray-200 bg-slate-50 rounded-l-lg hover:bg-slate-100 transition-colors select-none text-xs shrink-0 min-w-[70px] justify-between cursor-pointer"
                    >
                      <span className="text-sm">
                        {countryCodes.find((c) => c.code === enrollForm.phoneCode)?.flag || "🇮🇳"}
                      </span>
                      <svg
                        className={`w-2.5 h-2.5 text-gray-500 transition-transform ${isCountrySelectOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isCountrySelectOpen && (
                      <div className="absolute bottom-full left-0 mb-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-30 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-bottom-1 duration-150">
                        {countryCodes.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setEnrollForm((prev) => ({ ...prev, phoneCode: c.code }));
                              setIsCountrySelectOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-[11px] hover:bg-gray-50 flex items-center gap-2 text-gray-700 cursor-pointer"
                          >
                            <span className="text-sm shrink-0">{c.flag}</span>
                            <span className="font-bold text-gray-900 w-8">{c.code}</span>
                            <span className="text-gray-450 truncate">{c.country}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none select-none text-[11px] text-gray-400 font-bold">
                        {enrollForm.phoneCode}
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={enrollForm.phone}
                        onChange={handleEnrollInputChange}
                        className={`w-full text-xs pl-12 pr-3.5 py-2.5 border rounded-r-lg focus:outline-none transition-colors ${enrollErrors.phone
                          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 border-l"
                          : "border-gray-200 focus:border-[#0056d2] border-l"
                          }`}
                      />
                    </div>
                  </div>
                  {enrollErrors.phone && (
                    <span className="text-[10px] text-red-600 font-bold mt-1">⚠️ Valid phone is required</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isEnrolling}
                  className="bg-[#0056d2] hover:bg-[#00419e] active:scale-[0.99] transition-all disabled:bg-slate-300 text-white font-bold text-xs py-3 px-4 rounded-lg w-full uppercase tracking-wider cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2"
                >
                  {isEnrolling ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending details...
                    </>
                  ) : (
                    "Apply & Enroll Now"
                  )}
                </button>
              </form>
            )}

            {/* Info guarantee badge */}
            <div className="flex items-start gap-2 text-[10px] text-slate-400 font-medium leading-relaxed select-none">
              <svg className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure checkout. Your information is protected under industry encryption protocols and only shared with admissions staff.</span>
            </div>

          </div>

          {/* Instructor & Offered by card removed as requested */}
        </div>

      </main>

      {/* How You'll Learn Section (Full Width, Large Text) */}
      {activeSubTab === "about" && (
        <section className="w-full bg-[#f8fafd] border-y border-slate-100 py-8 md:py-16 mt-6 md:mt-8">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Backdrop light blue circle graphic */}
            <div className="absolute right-0 top-0 translate-x-[20%] -translate-y-[20%] w-[450px] h-[450px] rounded-full bg-[#ebf3fc] opacity-60 pointer-events-none select-none z-0" />

            {/* Left Column: List with Icons */}
            <div className="flex-1 flex flex-col gap-8 z-10 text-left">
              <h3 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight">
                How you'll learn
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {/* Item 1 */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-[#0056d2] shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[17px] md:text-[19px] text-slate-900">100% online learning</span>
                    <span className="text-[14px] md:text-[15.5px] text-slate-500 font-medium leading-relaxed mt-1">Start instantly and learn at your own schedule.</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-[#0056d2] shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[17px] md:text-[19px] text-slate-900">Flexible deadlines</span>
                    <span className="text-[14px] md:text-[15.5px] text-slate-500 font-medium leading-relaxed mt-1">Reset deadlines in accordance with your schedule.</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-[#0056d2] shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[17px] md:text-[19px] text-slate-900">Shareable Certificate</span>
                    <span className="text-[14px] md:text-[15.5px] text-slate-500 font-medium leading-relaxed mt-1">Earn a Certificate upon completion to share with employers.</span>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-[#0056d2] shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 0H3m3 0a17.96 17.96 0 002.818 6.158m1.582-1.582a17.96 17.96 0 01-5.18-4.577m0 0a18.01 18.01 0 013.418-5.085L9 5" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[17px] md:text-[19px] text-slate-900">English</span>
                    <span className="text-[14px] md:text-[15.5px] text-slate-500 font-medium leading-relaxed mt-1">Taught in English. Subtitles available in 5 languages.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Decorative Graphic Mockup */}
            <div className="hidden md:flex w-full md:w-[35%] items-center justify-center z-10 shrink-0">
              <div className="w-full bg-white rounded-xl border border-slate-150 shadow-lg overflow-hidden flex flex-col aspect-[4/3] max-w-[360px] transform hover:scale-[1.02] transition-transform">
                {/* Window Header */}
                <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>

                {/* Window Content */}
                <div className="flex-1 grid grid-cols-12">
                  {/* Mock Left Sidebar */}
                  <div className="col-span-5 bg-[#ebf3fc]/40 border-r border-slate-100 p-4 flex flex-col gap-2.5">
                    <div className="h-3.5 w-10/12 bg-[#0056d2]/15 rounded-md" />
                    <div className="h-2.5 w-7/12 bg-slate-200 rounded-md" />
                    <div className="h-2.5 w-8/12 bg-slate-200 rounded-md" />
                    <div className="h-2.5 w-6/12 bg-slate-200 rounded-md" />
                  </div>
                  {/* Mock Main Pane */}
                  <div className="col-span-7 p-4 flex flex-col items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-lg border border-slate-150 flex items-center justify-center bg-slate-50 text-[#0056d2]">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>

                    {/* Progress Line */}
                    <div className="w-10/12 flex flex-col gap-1.5 items-center">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-[#0056d2] h-full w-[65%]" />
                      </div>
                      <div className="flex justify-between w-full text-[10px] text-slate-400 font-bold">
                        <span>30m elapsed</span>
                        <span>65%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Why people choose AIScale for their career (Full Width, White Background) */}
      <section className="w-full bg-white py-10 md:py-16 border-t border-b border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 text-left">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-8">
            Why people choose AIScale for their career
          </h3>

          <div className="relative">
            <div className="flex md:hidden items-center gap-2 mb-4 justify-end">
              <button
                type="button"
                onClick={() => scrollTestimonials("left")}
                className="w-9 h-9 rounded-full border border-[#0056d2] text-[#0056d2] bg-white hover:bg-[#0056d2] hover:text-white transition-colors flex items-center justify-center"
                aria-label="Scroll testimonials left"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.78 4.22a.75.75 0 010 1.06L8.06 10l4.72 4.72a.75.75 0 11-1.06 1.06l-5.25-5.25a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollTestimonials("right")}
                className="w-9 h-9 rounded-full border border-[#0056d2] text-[#0056d2] bg-white hover:bg-[#0056d2] hover:text-white transition-colors flex items-center justify-center"
                aria-label="Scroll testimonials right"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.22 15.78a.75.75 0 010-1.06L11.94 10 7.22 5.28a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 01-1.06 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div
              ref={testimonialsRef}
              className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible scrollbar-none snap-x snap-mandatory"
            >
            {/* Card 1 */}
              <div className="border border-slate-200 rounded-none p-6 bg-white flex flex-col gap-4 w-[86%] sm:w-auto shrink-0 snap-start">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                    alt="Priya S."
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-[15px]">Priya S.</span>
                  <span className="text-[12px] text-slate-400 font-semibold">Learner since 2021</span>
                </div>
              </div>
              <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                "The material was highly practical and structured. I was able to automate my marketing workflows within a week!"
              </p>
            </div>

            {/* Card 2 */}
              <div className="border border-slate-200 rounded-none p-6 bg-white flex flex-col gap-4 w-[86%] sm:w-auto shrink-0 snap-start">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="James K."
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-[15px]">James K.</span>
                  <span className="text-[12px] text-slate-400 font-semibold">Learner since 2022</span>
                </div>
              </div>
              <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                "The hands-on projects helped me build a portfolio that landed me a growth lead job."
              </p>
            </div>

            {/* Card 3 */}
              <div className="border border-slate-200 rounded-none p-6 bg-white flex flex-col gap-4 w-[86%] sm:w-auto shrink-0 snap-start">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                    alt="David L."
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-[15px]">David L.</span>
                  <span className="text-[12px] text-slate-400 font-semibold">Learner since 2023</span>
                </div>
              </div>
              <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                "Outstanding templates. Using Make.com and Claude APIs transformed our agency operations completely."
              </p>
            </div>

            {/* Card 4 */}
              <div className="border border-slate-200 rounded-none p-6 bg-white flex flex-col gap-4 w-[86%] sm:w-auto shrink-0 snap-start">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="Michael A."
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-[15px]">Michael A.</span>
                  <span className="text-[12px] text-slate-400 font-semibold">Learner since 2024</span>
                </div>
              </div>
              <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                "Highly recommended. The certification is recognized and respected across the digital marketing space."
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learner Reviews Section (Recreated exactly to match image) */}
      <section id="reviews-section" className="w-full bg-white py-10 md:py-16 border-t border-slate-100 scroll-mt-28">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Summary */}
            <div className="lg:col-span-4 flex flex-col">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-8">
                Learner reviews
              </h3>

              <div className="flex items-center gap-1 mb-1">
                <span className="text-[#0056d2] text-sm font-bold">★</span>
                <span className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">4.7</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mb-6">4,748 reviews</span>

              {/* Progress Rows */}
              <div className="flex flex-col gap-2.5 max-w-[280px]">
                {[
                  { label: "5 stars", pct: "76.25%" },
                  { label: "4 stars", pct: "18.37%" },
                  { label: "3 stars", pct: "2.90%" },
                  { label: "2 stars", pct: "0.67%" },
                  { label: "1 star", pct: "1.78%" }
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center gap-3 w-full text-sm font-bold text-slate-800">
                    <span className="w-14 text-left shrink-0">{row.label}</span>
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#0056d2] h-full rounded-full" style={{ width: row.pct }} />
                    </div>
                    <span className="w-12 text-right font-semibold text-slate-500 shrink-0">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Reviews Cards */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="text-xs text-slate-400 font-medium self-start mb-2">
                Showing 3 of 4748
              </div>

              {/* Reviews List */}
              <div className="flex flex-col gap-5">
                {[
                  {
                    initial: "L",
                    name: "LH",
                    rating: 5,
                    date: "Oct 25, 2022",
                    text: "Very informative - just need more practise for myself and I think ill be able to master it. Overall was a clear introduction to data analysis in excel"
                  },
                  {
                    initial: "D",
                    name: "DW",
                    rating: 5,
                    date: "Mar 30, 2025",
                    text: "Great for a beginner in excel who wants to learn more about the VLOOKUP and IF Functions in particular, and applying those to real world applications."
                  },
                  {
                    initial: "F",
                    name: "FF",
                    rating: 5,
                    date: "Sep 23, 2024",
                    text: "It´s a small bite-sized course that explain super important excel functions in an easy to follow way. Clear instructions and examples. Highly recommended!"
                  }
                ].map((r, idx) => (
                  <div key={idx} className="border border-[#e2edf8] rounded-xl p-5 md:p-6 bg-white shadow-xs hover:border-[#b9d5f8] transition-colors">
                    <div className="flex flex-col md:flex-row md:gap-4 md:items-start">
                      {/* Avatar Circle & Name (desktop) / Initials (mobile) */}
                      <div className="flex items-center gap-3.5 shrink-0 md:min-w-[95px]">
                        <span className="md:hidden font-extrabold text-slate-900 text-[14px]">
                          {r.name}
                        </span>
                        <div className="hidden md:flex w-12 h-12 rounded-full bg-[#003c8f] items-center justify-center text-white font-extrabold text-base select-none">
                          {r.initial}
                        </div>
                        <span className="hidden md:inline font-extrabold text-slate-900 text-[15px]">{r.name}</span>
                      </div>

                      {/* Review details */}
                      <div className="flex-1 flex flex-col gap-2 mt-2 md:mt-0">
                        <div className="flex items-center gap-1.5 text-[13px] md:text-sm">
                          <span className="text-[#0056d2] font-black flex items-center gap-1">★ {r.rating}</span>
                          <span className="text-slate-300 font-bold">•</span>
                          <span className="text-slate-500 font-medium">Reviewed on {r.date}</span>
                        </div>
                        <p className="text-[13px] md:text-[13px] text-slate-800 leading-relaxed font-medium">
                          {r.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="w-full bg-[#f8fafd]/40 py-10 md:py-16 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 text-left">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-8">
            Frequently asked questions
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Box: Accordion list */}
            <div className="lg:col-span-8 bg-white border border-[#e2edf8] rounded-xl p-6 md:p-8 shadow-xs">
              <div className="flex flex-col divide-y divide-slate-100">
                {[
                  {
                    q: "Are Guided Projects available on desktop and mobile?",
                    a: "Guided Projects are designed to be completed on a desktop web browser for the best learning experience. Mobile access may be limited since they involve interactive coding workspaces and complex laboratory simulations."
                  },
                  {
                    q: "Who are the instructors for Guided Projects?",
                    a: "Our Guided Projects are created and led by certified industry experts and technical advisors with extensive hands-on experience in cloud integrations and marketing analytics."
                  },
                  {
                    q: "Can I download the work from my Guided Project after I complete it?",
                    a: "Yes! Once you complete the Guided Project workspace, you have full access to download all your project files, reports, and assets to showcase in your personal portfolio."
                  },
                  {
                    q: "Is there a certificate provided upon completion?",
                    a: "Yes, you receive a shareable digital certificate from AIScale upon successfully passing the laboratory checkmarks, which you can add directly to your LinkedIn profile."
                  },
                  {
                    q: "Do I need to install any software?",
                    a: "No, everything runs directly in your web browser. No downloads or installations are required to complete the hands-on workspaces."
                  },
                  {
                    q: "How long do I have to complete the project?",
                    a: "AIScale courses and projects are fully self-paced. You have lifetime access to the materials and can work at your own schedule."
                  }
                ].slice(0, showAllFaqs ? 6 : 3).map((faq, idx) => (
                  <details key={idx} className="group py-5 first:pt-2 last:pb-2 border-b border-slate-100 last:border-0">
                    <summary className="flex items-center gap-3 font-semibold text-slate-800 cursor-pointer list-none select-none text-[14.5px] hover:text-[#0056d2] transition-colors [&::-webkit-details-marker]:hidden">
                      <svg className="w-3.5 h-3.5 text-slate-500 group-open:rotate-180 transition-transform duration-200 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>{faq.q}</span>
                    </summary>
                    <div className="mt-3 pl-7 text-[13.5px] text-slate-600 leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>

              {/* Show All Toggle button */}
              <div className="mt-6 flex justify-center border-t border-slate-100 pt-5">
                <button
                  onClick={() => setShowAllFaqs(!showAllFaqs)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-[#0056d2] transition-colors cursor-pointer select-none"
                >
                  <span>{showAllFaqs ? "Show fewer questions" : "Show all 6 frequently asked questions"}</span>
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showAllFaqs ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Box: More questions */}
            <div className="lg:col-span-4 bg-white border border-[#e2edf8] rounded-xl p-6 md:p-8 flex flex-col items-start text-left shadow-xs min-h-[160px] justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-700 text-sm mb-4 select-none">
                <span className="font-bold">?</span>
              </div>
              <h4 className="font-bold text-slate-800 text-base mb-1">
                More questions
              </h4>
              <a
                href="mailto:support@aiscale.com"
                className="text-xs font-bold text-[#0056d2] hover:underline transition-all"
              >
                Visit the learner help center
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Courses Section */}
      {recommendedCourses.length > 0 && (
        <section id="recommendations-section" className="w-full bg-slate-50 py-10 md:py-16 border-t border-slate-100 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-left">
            <h3 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight mb-2">
              Recommended Courses
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-8">
              People who took this course also explored these top programs:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedCourses.map((c) => {
                const cid = (c as any)._id || c.id;
                return (
                  <Link
                    key={cid}
                    href={`/coursedetails/${cid}`}
                    className="bg-white rounded-xl border border-slate-150 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col cursor-pointer group"
                  >
                    {/* Thumbnail / Image */}
                    <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                      <img
                        src={c.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {c.tag && (
                        <div className="absolute top-3 left-3 bg-[#0056d2] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                          {c.tag}
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col gap-3 justify-between">
                      <div className="flex flex-col gap-2">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                          {c.category ? c.category.replace("-", " ") : "Course"}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-[#0056d2] transition-colors line-clamp-2">
                          {c.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2 text-xs font-bold text-slate-650">
                        <span>{c.hours || "Flexible Hours"}</span>
                        <span className="text-[#0056d2] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Explore Page <span>→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Floating Help Button (Coursera style support icon) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => alert("How can we help you? Feel free to reach out to study support at contact@aiscale.com.")}
          className="w-12 h-12 rounded-full bg-[#0056d2] hover:bg-[#00419e] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
          aria-label="Support Help Center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

    </div>
  );
}

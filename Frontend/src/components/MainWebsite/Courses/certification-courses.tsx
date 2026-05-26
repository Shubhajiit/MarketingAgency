"use client";

import React, { useState, useEffect } from "react";
import { Course, CourseCard, ConcentricRings } from "@/components/common/CoursesCardsUI";
import { useRouter } from "next/navigation";
import { coursesApi } from "@/lib/api/courses";

export const coursesData: Course[] = [];

const tabs = [
  { id: "popular", label: "Popular Courses" },
  { id: "pro-specialist", label: "Pro & Specialist Courses" },
  { id: "short", label: "Short Courses" },
  { id: "advanced", label: "Advanced Courses" }
];

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
];

export const getSyllabusModules = (courseTitle: string) => {
  if (courseTitle.includes("Social Media")) {
    return [
      { title: "Module 1: Social Media Strategy & Brand Positioning", description: "Learn how to define your audience, select the right platforms, and position your brand for growth." },
      { title: "Module 2: Creative Content Production & Copywriting", description: "Design high-converting visual assets and write engaging copy tailored to social algorithms." },
      { title: "Module 3: Paid Social Campaigns & Audience Targeting", description: "Master paid advertising on Meta, LinkedIn, and TikTok, from custom audiences to bidding strategies." },
      { title: "Module 4: Social Commerce, Community & Social Listening", description: "Build an active community, manage brand reputation, and leverage direct social sales." },
      { title: "Module 5: Social Media Analytics & ROI Measurement", description: "Analyze performance metrics, attribute conversions, and optimize campaign returns." }
    ];
  }
  if (courseTitle.includes("AI")) {
    return [
      { title: "Module 1: AI Foundations in Modern Marketing", description: "Discover the paradigm shift of generative AI and its direct applications in marketing workflows." },
      { title: "Module 2: Advanced Prompt Engineering & Creative Copy", description: "Learn systematic frameworks to prompt LLMs for copy, strategy, and messaging." },
      { title: "Module 3: AI-Driven SEO & Content Scaling", description: "Scale content production safely while maintaining SEO dominance using AI assistants." },
      { title: "Module 4: Workflow Automation & No-Code AI Integrations", description: "Integrate tools like Zapier, Make, and Claude APIs to automate marketing pipelines." },
      { title: "Module 5: Predictive Analytics & Customer Segmentation", description: "Leverage machine learning tools for churn prediction, lifetime value analysis, and personalization." }
    ];
  }
  if (courseTitle.includes("Search") || courseTitle.includes("SEO") || courseTitle.includes("PPC")) {
    return [
      { title: "Module 1: Search Engine Architecture & Keyword Research", description: "Understand how Google crawls, indexes, and ranks pages, and discover high-intent keywords." },
      { title: "Module 2: On-Page & Technical SEO Optimization", description: "Optimize page elements, site speed, schema markup, and mobile friendliness." },
      { title: "Module 3: Backlink Strategy & Content Authority", description: "Build natural backlinks and develop content hubs to establish domain authority." },
      { title: "Module 4: Google Ads & Paid Search (PPC) Architecture", description: "Set up campaigns, write compelling ad copy, and master bidding and budget allocation." },
      { title: "Module 5: Web Analytics, Tracking & Reporting", description: "Configure GA4 and GTM to track conversions, evaluate user behavior, and report search growth." }
    ];
  }
  if (courseTitle.includes("Strategy") || courseTitle.includes("Leadership")) {
    return [
      { title: "Module 1: Digital Transformation & Leadership Strategy", description: "Formulate digital-first business strategies and drive team alignment during transformation." },
      { title: "Module 2: Customer Journey Mapping & Omnichannel Funnels", description: "Design seamless omnichannel experiences that move prospects from awareness to advocacy." },
      { title: "Module 3: Budgeting, Resource Allocation & Marketing Mix", description: "Allocate budgets dynamically across organic, paid, and earned channels to optimize CAC." },
      { title: "Module 4: Marketing Tech Stack & Data Governance", description: "Select, integrate, and scale marketing tools while ensuring privacy and compliance." },
      { title: "Module 5: Agile Marketing & Performance Leadership", description: "Run high-tempo testing cycles, manage cross-functional growth squads, and lead with KPIs." }
    ];
  }
  return [
    { title: "Module 1: Introduction to Digital Marketing Foundations", description: "Understand the core principles of customer acquisition and modern digital channels." },
    { title: "Module 2: Content Marketing & Strategy", description: "Develop and execute a content strategy that engages prospects and drives organic search traffic." },
    { title: "Module 3: Paid Advertising & Media Buying", description: "Learn the fundamentals of running campaigns on search engines and social platforms." },
    { title: "Module 4: Email Marketing & Marketing Automation", description: "Design automated nurturing sequences and build long-term relationships with subscribers." },
    { title: "Module 5: Analytics & Continuous Optimization", description: "Analyze performance data to identify bottlenecks and optimize conversion rates." }
  ];
};

export default function CertificationCoursesSection({ bgColor = "bg-slate-50/50" }: { bgColor?: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("popular");
  const [selectedBrochureCourse, setSelectedBrochureCourse] = useState<Course | null>(null);
  const [selectedViewCourse, setSelectedViewCourse] = useState<Course | null>(null);
  const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await coursesApi.list();
        setCourses(res.data.courses);
      } catch (err) {
        console.error("Failed to load dynamic courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Brochure Request Form State
  const [brochureForm, setBrochureForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+91",
    phone: "",
    jobTitle: "",
    workExperience: "",
    city: "",
  });
  const [brochureErrors, setBrochureErrors] = useState<Record<string, boolean>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  // Course Enrollment Form State
  const [enrollForm, setEnrollForm] = useState({
    name: "",
    email: "",
    phoneCode: "+91",
    phone: "",
  });
  const [enrollErrors, setEnrollErrors] = useState<Record<string, boolean>>({});
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const handleBrochureInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBrochureForm((prev) => ({ ...prev, [name]: value }));
    if (brochureErrors[name]) {
      setBrochureErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateBrochureForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;
    if (!brochureForm.firstName.trim()) { newErrors.firstName = true; isValid = false; }
    if (!brochureForm.lastName.trim()) { newErrors.lastName = true; isValid = false; }
    if (!brochureForm.email.trim() || !/\S+@\S+\.\S+/.test(brochureForm.email)) { newErrors.email = true; isValid = false; }
    if (!brochureForm.phone.trim() || !/^\d{7,15}$/.test(brochureForm.phone.replace(/[\s-()]/g, ""))) { newErrors.phone = true; isValid = false; }
    if (!brochureForm.jobTitle.trim()) { newErrors.jobTitle = true; isValid = false; }
    if (!brochureForm.workExperience) { newErrors.workExperience = true; isValid = false; }
    if (!brochureForm.city.trim()) { newErrors.city = true; isValid = false; }
    setBrochureErrors(newErrors);
    return isValid;
  };

  const handleBrochureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrochureCourse) return;
    if (validateBrochureForm()) {
      setIsDownloading(true);
      setTimeout(() => {
        setIsDownloading(false);
        const course = selectedBrochureCourse;
        setSelectedBrochureCourse(null);
        setShowSuccessModal(true);

        const brochureText = `
==================================================
${course.title.toUpperCase()} — PROGRAMME BROCHURE
==================================================
Sponsor/Academy: AI Scale
Certification: DMI Certification Track
Category Tag: ${course.tag}
Duration: ${course.hours}

Congratulations ${brochureForm.firstName} ${brochureForm.lastName}!
Thank you for downloading the official syllabus brochure.

--------------------------------------------------
WHAT YOU WILL LEARN IN THIS CERTIFICATION:
--------------------------------------------------
${getSyllabusModules(course.title).map((m, i) => `${i + 1}. ${m.title}\n   ${m.description}`).join('\n\n')}

--------------------------------------------------
PROGRAMME INVESTMENT:
--------------------------------------------------
* Full Tuition Fee: ₹${course.price}
* Original Price: ₹${course.originalPrice}
* Savings: ${course.discount} OFF (₹${course.originalPrice - course.price} saved)

--------------------------------------------------
APPLICANT INFORMATION:
--------------------------------------------------
* Name: ${brochureForm.firstName} ${brochureForm.lastName}
* Email: ${brochureForm.email}
* Phone: ${brochureForm.phoneCode} ${brochureForm.phone}
* Job Title: ${brochureForm.jobTitle}
* Experience: ${brochureForm.workExperience}
* City: ${brochureForm.city}

Contact us: 1800 4122 6965
Email: contact@aiscale.com
==================================================
`;
        const blob = new Blob([brochureText.trim()], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${course.title.replace(/\s+/g, "_")}_Brochure.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1200);
    }
  };

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

  const displayCourses = courses.length > 0 ? courses : coursesData;
  const filteredCourses = displayCourses.filter(
    (course) => course.category === activeTab
  );

  return (
    <section className={`w-full ${bgColor} py-8 md:py-16 px-4 md:px-36`}>
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header */}
        <h2 className="text-xl sm:text-2xl md:text-[38px] font-semibold text-[#1e2245] tracking-tight text-center mb-5 md:mb-8">
          Explore Our Certification Courses
        </h2>

        {/* Interactive Navigation Tabs */}
        <div className="w-full border-b border-slate-100 flex justify-center mb-10 overflow-x-auto whitespace-nowrap scrollbar-none pb-[2px]">
          <nav className="flex gap-8 md:gap-12 px-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 text-[13px] md:text-sm tracking-wide transition-all duration-200 border-b-2 -mb-[2px] cursor-pointer select-none ${isActive
                    ? "text-[#1e2245] border-[#00c58d] font-semibold"
                    : "text-slate-400 hover:text-slate-600 border-transparent font-normal"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Grid of Course Cards */}
        {filteredCourses.length > 0 ? (
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredCourses.map((course) => {
              const cid = (course as any)._id || course.id;
              return (
                <CourseCard
                  key={cid}
                  course={course}
                  onPrimaryClick={(course) => {
                    if (course.primaryCtaText === "Download Brochure") {
                      setSelectedBrochureCourse(course);
                    } else {
                      router.push(`/coursedetails/${cid}`);
                    }
                  }}
                  onSecondaryClick={(course) => {
                    router.push(`/coursedetails/${cid}`);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="w-full py-16 text-center space-y-3 px-6">
            <div className="w-12 h-12 rounded-full bg-slate-200/50 flex items-center justify-center mx-auto text-slate-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Certification Courses Available</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-normal">
              We couldn't find any active courses in this category at the moment. Please check back later!
            </p>
          </div>
        )}
      </div>

      {/* Course Brochure Modal */}
      {selectedBrochureCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedBrochureCourse(null)}
          />
          <div className="relative bg-white text-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-[500px] border border-gray-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 z-10">
            <button
              onClick={() => setSelectedBrochureCourse(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-xl font-black tracking-tight text-[#0c102a] mb-1 font-sans">
              Get Programme Brochure
            </h2>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Download the comprehensive syllabus for <strong className="text-slate-800">{selectedBrochureCourse.title}</strong>
            </p>
            <form onSubmit={handleBrochureSubmit} className="flex flex-col gap-3">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={brochureForm.firstName}
                    onChange={handleBrochureInputChange}
                    className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${brochureErrors.firstName
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-300 focus:border-gray-900"
                      }`}
                  />
                  {brochureErrors.firstName && (
                    <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      ⚠️ Required
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={brochureForm.lastName}
                    onChange={handleBrochureInputChange}
                    className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${brochureErrors.lastName
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-300 focus:border-gray-900"
                      }`}
                  />
                  {brochureErrors.lastName && (
                    <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      ⚠️ Required
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
                  value={brochureForm.email}
                  onChange={handleBrochureInputChange}
                  className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${brochureErrors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:border-gray-900"
                    }`}
                />
                {brochureErrors.email && (
                  <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    ⚠️ Valid email required
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <div className="flex flex-row relative">
                  <button
                    type="button"
                    onClick={() => setIsCountrySelectOpen(!isCountrySelectOpen)}
                    className="flex items-center gap-1 px-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l hover:bg-gray-100 transition-colors select-none text-sm shrink-0 min-w-[70px] justify-between cursor-pointer"
                  >
                    <span className="text-base">
                      {countryCodes.find((c) => c.code === brochureForm.phoneCode)?.flag || "🇮🇳"}
                    </span>
                    <svg
                      className={`w-3 h-3 text-gray-500 transition-transform ${isCountrySelectOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isCountrySelectOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg py-1 z-30 max-h-52 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                      {countryCodes.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setBrochureForm((prev) => ({ ...prev, phoneCode: c.code }));
                            setIsCountrySelectOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2.5 text-gray-700 cursor-pointer"
                        >
                          <span className="text-base shrink-0">{c.flag}</span>
                          <span className="font-semibold text-gray-900 w-10">{c.code}</span>
                          <span className="text-gray-500 truncate">{c.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none select-none text-xs text-gray-400 font-bold">
                      {brochureForm.phoneCode}
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={brochureForm.phone}
                      onChange={handleBrochureInputChange}
                      className={`w-full text-sm pl-12 pr-3 py-2 border rounded-r focus:outline-none transition-colors ${brochureErrors.phone
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 border-l"
                        : "border-gray-300 focus:border-gray-900 border-l"
                        }`}
                    />
                  </div>
                </div>
                {brochureErrors.phone && (
                  <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    ⚠️ Valid phone required
                  </span>
                )}
              </div>

              {/* Job Title & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={brochureForm.jobTitle}
                    onChange={handleBrochureInputChange}
                    className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${brochureErrors.jobTitle
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-300 focus:border-gray-900"
                      }`}
                  />
                  {brochureErrors.jobTitle && (
                    <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      ⚠️ Required
                    </span>
                  )}
                </div>
                <div className="flex flex-col relative">
                  <select
                    name="workExperience"
                    value={brochureForm.workExperience}
                    onChange={handleBrochureInputChange}
                    className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors appearance-none bg-white pr-8 ${brochureErrors.workExperience
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-gray-300 focus:border-gray-900"
                      }`}
                  >
                    <option value="" disabled hidden>
                      Work Experience
                    </option>
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
                  {brochureErrors.workExperience && (
                    <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      ⚠️ Required
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
                  value={brochureForm.city}
                  onChange={handleBrochureInputChange}
                  className={`w-full text-sm px-3 py-2 border rounded focus:outline-none transition-colors ${brochureErrors.city
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-300 focus:border-gray-900"
                    }`}
                  />
                {brochureErrors.city && (
                  <span className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    ⚠️ Required
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isDownloading}
                className="mt-2 bg-[#cc0000] hover:bg-[#b30000] text-white text-center font-bold py-3 px-5 rounded uppercase tracking-wider text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 w-full flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Downloading...
                  </>
                ) : (
                  "DOWNLOAD BROCHURE"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Brochure Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}></div>
          <div className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-5 text-[#22c55e]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">Brochure Downloaded Successfully!</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">
              Thank you, <strong className="text-gray-900 font-semibold">{brochureForm.firstName}</strong>.
              The brochure has been generated and downloaded to your device. Our program advisors will contact you shortly to answer any questions about the curriculum.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-[#0c102a] hover:bg-slate-800 text-white font-bold py-2.5 px-8 rounded-lg text-sm transition-colors w-full focus:outline-none cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Course View / Details Modal */}
      {selectedViewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => {
              setSelectedViewCourse(null);
              setEnrollSuccess(false);
            }}
          />
          <div className="relative bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-[850px] border border-gray-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 z-10 flex flex-col">
            {/* Top gradient banner */}
            <div className={`bg-gradient-to-tr ${selectedViewCourse.bgGradient} p-6 md:p-8 text-white relative overflow-hidden shrink-0`}>
              {selectedViewCourse.circlesColor && (
                <div className="absolute right-[-10px] top-[-10px] w-36 h-36 opacity-30 pointer-events-none">
                  <ConcentricRings color={selectedViewCourse.circlesColor} />
                </div>
              )}
              <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[9px] font-extrabold px-2.5 py-1 uppercase rounded tracking-wider mb-3 select-none">
                {selectedViewCourse.tag}
              </span>
              <h2 className="text-xl md:text-3xl font-black tracking-tight leading-tight max-w-[90%]">
                {selectedViewCourse.title}
              </h2>
              <p className="text-xs md:text-sm text-white/80 font-medium tracking-wide mt-2">
                {selectedViewCourse.hours}
              </p>
              <button
                onClick={() => {
                  setSelectedViewCourse(null);
                  setEnrollSuccess(false);
                }}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Split Content layout */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 overflow-y-auto">
              {/* Left Column: Syllabus Modules */}
              <div className="md:col-span-7 flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-black text-[#0c102a] tracking-tight mb-2">
                    Course Syllabus Overview
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    This curriculum is crafted by industry experts to bring you up to speed with global standard certification requirements.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {getSyllabusModules(selectedViewCourse.title).map((module, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-all">
                      <h4 className="text-[13.5px] font-extrabold text-[#0c102a] leading-snug">
                        {module.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                        {module.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Enrollment Card */}
              <div className="md:col-span-5">
                <div className="border border-slate-100 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-5 md:p-6 sticky top-0 flex flex-col gap-5">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#009ee3] tracking-widest uppercase block mb-1">
                      Programme Investment
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#0c102a]">
                        ₹{selectedViewCourse.price}
                      </span>
                      <span className="text-slate-400 text-sm line-through font-semibold">
                        ₹{selectedViewCourse.originalPrice}
                      </span>
                      <span className="bg-[#a3ff12] text-[#0c102a] text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                        {selectedViewCourse.discount} OFF
                      </span>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {enrollSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-center flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold">
                        ✓
                      </div>
                      <h4 className="text-sm font-bold text-emerald-950">
                        Enrollment Request Received!
                      </h4>
                      <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                        Congratulations! You have successfully submitted your application for <strong className="text-emerald-950 font-semibold">{selectedViewCourse.title}</strong>. Our admissions officer will contact you within 24 hours with onboarding and payment link details.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleEnrollSubmit} className="flex flex-col gap-3.5">
                      <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase mb-1">
                        Secure Your Seat Now
                      </h4>

                      <div className="flex flex-col">
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={enrollForm.name}
                          onChange={handleEnrollInputChange}
                          className={`w-full text-xs px-3 py-2 border rounded focus:outline-none transition-colors ${enrollErrors.name
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-gray-200 focus:border-[#009ee3]"
                            }`}
                        />
                        {enrollErrors.name && (
                          <span className="text-[9px] text-red-600 font-semibold mt-1">⚠️ Name is required</span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <input
                          type="text"
                          name="email"
                          placeholder="Your Email"
                          value={enrollForm.email}
                          onChange={handleEnrollInputChange}
                          className={`w-full text-xs px-3 py-2 border rounded focus:outline-none transition-colors ${enrollErrors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-gray-200 focus:border-[#009ee3]"
                            }`}
                        />
                        {enrollErrors.email && (
                          <span className="text-[9px] text-red-600 font-semibold mt-1">⚠️ Valid email is required</span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex flex-row">
                          <span className="flex items-center justify-center px-2.5 border border-r-0 border-gray-200 bg-slate-50 text-slate-500 text-xs rounded-l select-none shrink-0 font-semibold min-w-[45px]">
                            {enrollForm.phoneCode}
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={enrollForm.phone}
                            onChange={handleEnrollInputChange}
                            className={`w-full text-xs px-3 py-2 border rounded-r focus:outline-none transition-colors ${enrollErrors.phone
                              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 border-l"
                              : "border-gray-200 focus:border-[#009ee3] border-l"
                              }`}
                          />
                        </div>
                        {enrollErrors.phone && (
                          <span className="text-[9px] text-red-600 font-semibold mt-1">⚠️ Valid phone is required</span>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isEnrolling}
                        className="bg-[#009ee3] hover:bg-blue-600 active:scale-[0.99] transition-all disabled:bg-gray-400 text-white font-extrabold text-[12px] py-2.5 px-4 rounded w-full uppercase tracking-wider cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        {isEnrolling ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Apply & Enroll Now"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

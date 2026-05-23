'use client';

import { useState } from 'react';
import { Calendar, Clock, ChevronDown, Plus } from 'lucide-react';

interface Workshop {
  id: number;
  graphicTitle: string;
  displayTitle: string;
  category: string;
  presenter: string;
  date: string;
  time: string;
  bgColor: string;
  gridColor: string;
  avatarId: number;
}

const WORKSHOPS_DATA: Workshop[] = [
  {
    id: 1,
    graphicTitle: 'How to Start a Business From Idea',
    displayTitle: 'How To Start A Business From Business Idea',
    category: 'Business',
    presenter: 'A webinar by Richardino Gueva',
    date: 'Dec 20, 2022',
    time: '09.00 - 12.00',
    bgColor: 'bg-[#FFF8F0]', // Soft cream-orange
    gridColor: 'rgba(180, 83, 9, 0.06)', // Amber grid
    avatarId: 1,
  },
  {
    id: 2,
    graphicTitle: 'How To Raise Venture Capital',
    displayTitle: 'The "Best" Startup Pitch Deck - How To Raise Venture Capital',
    category: 'Finance & Accounting',
    presenter: 'A webinar by Richardino Gueva',
    date: 'Dec 20, 2022',
    time: '09.00 - 12.00',
    bgColor: 'bg-[#EBF7FF]', // Soft blue
    gridColor: 'rgba(2, 132, 199, 0.06)', // Sky grid
    avatarId: 2,
  },
  {
    id: 3,
    graphicTitle: 'UI UX Apprentice Tips and Tricks',
    displayTitle: 'UI UX Apprentice Tips and Tricks',
    category: 'Design',
    presenter: 'A webinar by Richardino Gueva',
    date: 'Dec 20, 2022',
    time: '09.00 - 12.00',
    bgColor: 'bg-[#F1F5F9]', // Soft slate
    gridColor: 'rgba(71, 85, 105, 0.06)', // Slate grid
    avatarId: 3,
  },
  {
    id: 4,
    graphicTitle: 'An Amazing way to learn UI UX Design',
    displayTitle: 'An Amazing Way to Learn UI UX Design',
    category: 'Design',
    presenter: 'A webinar by Richardino Gueva',
    date: 'Dec 20, 2022',
    time: '09.00 - 12.00',
    bgColor: 'bg-[#FAF5FF]', // Soft purple
    gridColor: 'rgba(147, 51, 234, 0.06)', // Purple grid
    avatarId: 4,
  },
  {
    id: 5,
    graphicTitle: 'How to Attract More Traffic to our Website',
    displayTitle: 'How to Attract More Traffic to our Website',
    category: 'Marketing',
    presenter: 'A webinar by Richardino Gueva',
    date: 'Dec 20, 2022',
    time: '09.00 - 12.00',
    bgColor: 'bg-[#F0FDF4]', // Soft green
    gridColor: 'rgba(22, 163, 74, 0.06)', // Green grid
    avatarId: 5,
  },
  {
    id: 6,
    graphicTitle: 'Introduce Low-code trends',
    displayTitle: 'Introduce low-code trends and the use cases',
    category: 'Development',
    presenter: 'A webinar by Richardino Gueva',
    date: 'Dec 20, 2022',
    time: '09.00 - 12.00',
    bgColor: 'bg-[#F0FDFA]', // Soft mint
    gridColor: 'rgba(13, 148, 136, 0.06)', // Teal grid
    avatarId: 6,
  },
  {
    id: 7,
    graphicTitle: 'Starting Career as Web Developer',
    displayTitle: 'Starting Career As Web Developer',
    category: 'Development',
    presenter: 'A webinar by Richardino Gueva',
    date: 'Dec 20, 2022',
    time: '09.00 - 12.00',
    bgColor: 'bg-[#FFF1F2]', // Soft rose
    gridColor: 'rgba(225, 29, 72, 0.06)', // Rose grid
    avatarId: 7,
  },
  {
    id: 8,
    graphicTitle: 'Metrics that Matters in Software Engineering',
    displayTitle: 'Webinar - Metrics that Matters in Software Engineering',
    category: 'IT & Software',
    presenter: 'A webinar by Richardino Gueva',
    date: 'Dec 20, 2022',
    time: '09.00 - 12.00',
    bgColor: 'bg-[#ECFEFF]', // Soft cyan
    gridColor: 'rgba(8, 145, 178, 0.06)', // Cyan grid
    avatarId: 8,
  },
];

const CATEGORIES = [
  'All Categories',
  'Business',
  'Design',
  'Development',
  'Finance & Accounting',
  'Health & Fitness',
  'IT & Software',
  'Marketing',
  'Music',
  'Office Productivity',
];

// Helper to draw premium, stylized vector avatars matching the grayscale portraits
function WorkshopAvatar({ id }: { id: number }) {
  // Common container props
  const className = "w-full h-full text-[#334155]";

  switch (id) {
    case 1:
      // Guy with glasses, hand near chin / thoughtful look
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <circle cx="50" cy="40" r="18" fill="#CBD5E1" />
          {/* Hair */}
          <path d="M30 38c0-12 8-18 20-18s20 6 20 18c0 2-4 0-4-4 0-8-6-10-16-10s-16 2-16 10c0 4-4 4-4 4z" fill="#1E293B" />
          {/* Glasses */}
          <rect x="37" y="36" width="10" height="6" rx="2" stroke="#1E293B" strokeWidth="2" />
          <rect x="53" y="36" width="10" height="6" rx="2" stroke="#1E293B" strokeWidth="2" />
          <line x1="47" y1="39" x2="53" y2="39" stroke="#1E293B" strokeWidth="2" />
          {/* Body/Shirt */}
          <path d="M22 85c0-12 10-22 28-22s28 10 28 22H22z" fill="#1E293B" />
          {/* Collar */}
          <path d="M42 63l8 8 8-8" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          {/* Hand/Arm silhouette (thoughtful pose) */}
          <path d="M60 85c-1-6-4-10-8-12 2-2 4-5 4-8v-3c0-2-1-3-3-3s-3 1-3 3v3c0 2 1 4 3 6-4 2-6 6-7 12h14z" fill="#94A3B8" />
        </svg>
      );
    case 2:
      // Guy with short hair, clean cut, smiling
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <circle cx="50" cy="42" r="18" fill="#CBD5E1" />
          <path d="M32 40c0-12 6-16 18-16s18 4 18 16c0 2-3 0-3-4 0-8-5-8-15-8s-15 0-15 8c0 4-3 4-3 4z" fill="#334155" />
          {/* Glasses */}
          <rect x="38" y="38" width="9" height="6" rx="1.5" stroke="#1E293B" strokeWidth="2" />
          <rect x="53" y="38" width="9" height="6" rx="1.5" stroke="#1E293B" strokeWidth="2" />
          <line x1="47" y1="41" x2="53" y2="41" stroke="#1E293B" strokeWidth="1.5" />
          {/* Smile */}
          <path d="M46 50c2 2 6 2 8 0" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 85c0-10 10-18 26-18s26 8 26 18H24z" fill="#475569" />
          <path d="M45 67l5 5 5-5" stroke="#E2E8F0" strokeWidth="2" />
        </svg>
      );
    case 3:
      // Guy with neat side sweep hair, simple t-shirt
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <circle cx="50" cy="40" r="18" fill="#94A3B8" />
          <path d="M30 35c2-10 10-15 20-15s18 4 20 12c2 8-5 5-5 1 0-8-5-10-15-10s-15 3-17 9c-1 3-3 3-3 3z" fill="#0F172A" />
          <path d="M22 85c0-14 11-24 28-24s28 10 28 24H22z" fill="#334155" />
          <circle cx="50" cy="61" r="5" fill="#94A3B8" />
        </svg>
      );
    case 4:
      // Guy with neat hair, glasses, hoodie
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <circle cx="50" cy="41" r="17" fill="#CBD5E1" />
          <path d="M33 38c0-12 6-15 17-15s17 3 17 15c0 2-3 0-3-4 0-7-5-7-14-7s-14 0-14 7c0 4-3 4-3 4z" fill="#1E293B" />
          <rect x="38" y="37" width="9" height="6" rx="1" stroke="#0F172A" strokeWidth="2" />
          <rect x="53" y="37" width="9" height="6" rx="1" stroke="#0F172A" strokeWidth="2" />
          <line x1="47" y1="40" x2="53" y2="40" stroke="#0F172A" strokeWidth="1.5" />
          {/* Hoodie */}
          <path d="M24 85c0-12 10-20 26-20s26 8 26 20H24z" fill="#0F172A" />
          <path d="M36 65c4 4 8 10 14 10s10-6 14-10" fill="none" stroke="#334155" strokeWidth="3" />
        </svg>
      );
    case 5:
      // Guy with glasses, smile, hoodie
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <circle cx="50" cy="41" r="17" fill="#CBD5E1" />
          <path d="M33 36c1-10 6-13 17-13s16 3 17 13c0 2-3 0-3-3 0-6-5-7-14-7s-14 1-14 7c0 3-3 3-3 3z" fill="#334155" />
          <rect x="38" y="37" width="9" height="6" rx="1" stroke="#1E293B" strokeWidth="2" />
          <rect x="53" y="37" width="9" height="6" rx="1" stroke="#1E293B" strokeWidth="2" />
          <line x1="47" y1="40" x2="53" y2="40" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M24 85c0-12 10-20 26-20s26 8 26 20H24z" fill="#1E293B" />
          <path d="M35 65l15 12 15-12" fill="none" stroke="#475569" strokeWidth="2.5" />
        </svg>
      );
    case 6:
      // Curly wild hair portrait
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <circle cx="50" cy="43" r="17" fill="#CBD5E1" />
          {/* Massive curly hair */}
          <path d="M28 40c-3-3-5-8-3-13s7-7 12-5c2-4 7-6 12-4s7 4 7 8c3-3 9-3 12 1s2 9-1 12c3 2 4 7 2 11s-7 5-11 3c-1 4-5 6-9 5s-6-4-6-8c-3 2-8 1-10-3s-2-8 3-7z" fill="#0F172A" />
          {/* Beard */}
          <path d="M33 45c2 12 8 18 17 18s15-6 17-18H33z" fill="#0F172A" opacity="0.9" />
          <circle cx="50" cy="43" r="16" fill="#CBD5E1" />
          <path d="M33 45c0 6 3 12 17 12s17-6 17-12" fill="#0F172A" />
          <path d="M24 85c0-12 10-18 26-18s26 6 26 18H24z" fill="#1E293B" />
        </svg>
      );
    case 7:
      // Guy with curly shorter hair & glasses
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <circle cx="50" cy="40" r="17" fill="#E2E8F0" />
          <path d="M32 35c2-6 8-10 18-10s16 4 18 10c0 4-4 2-6-1-2-4-6-5-12-5s-10 1-12 5c-2 3-6 5-6 2z" fill="#1E293B" />
          <circle cx="34" cy="30" r="4" fill="#1E293B" />
          <circle cx="42" cy="24" r="5" fill="#1E293B" />
          <circle cx="52" cy="23" r="4" fill="#1E293B" />
          <circle cx="62" cy="26" r="5" fill="#1E293B" />
          <circle cx="67" cy="32" r="4" fill="#1E293B" />
          <rect x="38" y="36" width="9" height="6" rx="1.5" stroke="#1E293B" strokeWidth="2" />
          <rect x="53" y="36" width="9" height="6" rx="1.5" stroke="#1E293B" strokeWidth="2" />
          <line x1="47" y1="39" x2="53" y2="39" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M24 85c0-12 10-20 26-20s26 8 26 20H24z" fill="#0F172A" />
          <path d="M42 65l8 6 8-6" stroke="#475569" strokeWidth="2" fill="none" />
        </svg>
      );
    case 8:
      // Guy looking straight, simple shirt
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none">
          <circle cx="50" cy="42" r="18" fill="#CBD5E1" />
          <path d="M33 38c0-10 6-14 17-14s17 4 17 14c0 2-3 0-3-4 0-6-5-6-14-6s-14 0-14 6c0 4-3 4-3 4z" fill="#334155" />
          <path d="M24 85c0-12 10-20 26-20s26 8 26 20H24z" fill="#E2E8F0" />
          <path d="M42 65l8 5 8-5" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

export default function WorkshopsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const filteredWorkshops = selectedCategory === 'All Categories'
    ? WORKSHOPS_DATA
    : WORKSHOPS_DATA.filter(w => {
      if (selectedCategory === 'Business') {
        return w.category === 'Business' || w.category === 'Finance & Accounting';
      }
      return w.category.toLowerCase().includes(selectedCategory.toLowerCase());
    });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 w-full overflow-hidden">
      {/* Category Selection Filter Bar */}
      <div className="w-full overflow-x-auto pb-4 no-scrollbar scroll-smooth">
        <div className="flex items-center gap-3">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-[#0a192f] text-white border-[#0a192f] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Workshop Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWorkshops.map((workshop) => (
          <div
            key={workshop.id}
            className="bg-white border border-gray-100 rounded-[28px] overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Card Header Illustration Part */}
            <div className="h-[210px] w-full relative overflow-hidden flex flex-col justify-between">
              {/* Colored Grid background */}
              <div
                className={`absolute inset-0 ${workshop.bgColor}`}
                style={{
                  backgroundImage: `linear-gradient(to right, ${workshop.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${workshop.gridColor} 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Header Texts */}
              <div className="relative z-10 p-5 flex flex-col items-center text-center space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Sharecourse
                </span>
                <h3 className="font-bold text-[#0a192f] text-[15px] leading-tight max-w-[85%]">
                  {workshop.graphicTitle}
                </h3>
              </div>

              {/* Overlapping Grayscale Avatar Portrait */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[120px] w-[120px] z-10 flex items-end justify-center">
                <div className="w-[100px] h-[100px] relative overflow-visible">
                  <WorkshopAvatar id={workshop.avatarId} />
                </div>
              </div>
            </div>

            {/* Card Body Information Part */}
            <div className="p-5 pt-0 flex flex-col flex-1 bg-white">
              {/* Description Headline */}
              <h4 className="font-bold text-[#0a192f] text-sm leading-snug min-h-[2.5rem] line-clamp-2 mt-4 hover:text-[#2db39b] transition-colors">
                {workshop.displayTitle}
              </h4>

              {/* Webinar Host */}
              <p className="text-xs text-gray-400 font-semibold mt-1">
                {workshop.presenter}
              </p>

              {/* Separator line */}
              <div className="h-[1px] bg-gray-50 my-4" />

              {/* Footer Time and Date */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold mt-auto">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{workshop.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

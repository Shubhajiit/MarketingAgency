'use client';

import Link from 'next/link';

export default function DashboardPage() {

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Course Overview */}
      <section>
        <h2 className="text-2xl font-bold text-[#0a192f] mb-6 tracking-tight">Course Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-[#e8f6f3] border border-[#a2dcd1] rounded-2xl p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#2db39b]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0a192f]">10</p>
                <p className="text-sm font-medium text-gray-500">Total Course</p>
              </div>
            </div>
            <Link href="/courses" className="text-sm font-semibold text-[#2db39b] flex items-center gap-1 mt-auto relative z-10">
              See Details
              <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f0edff] border border-[#beb0ff] rounded-2xl p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#7e5bff]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0a192f]">4</p>
                <p className="text-sm font-medium text-gray-500">Total Workshop</p>
              </div>
            </div>
            <Link href="/workshops" className="text-sm font-semibold text-[#7e5bff] flex items-center gap-1 mt-auto relative z-10">
              See Details
              <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-[#fff3e7] border border-[#fbd3b1] rounded-2xl p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#ff9838]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0a192f]">8/10</p>
                <p className="text-sm font-medium text-gray-500">Average Quiz Score</p>
              </div>
            </div>
            <Link href="#" className="text-sm font-semibold text-[#ff9838] flex items-center gap-1 mt-auto relative z-10">
              See Details
              <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-[#eaf4ff] border border-[#a8d3ff] rounded-2xl p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#2b96ff]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0a192f]">3</p>
                <p className="text-sm font-medium text-gray-500">Total Certificates</p>
              </div>
            </div>
            <Link href="#" className="text-sm font-semibold text-[#2b96ff] flex items-center gap-1 mt-auto relative z-10">
              See Details
              <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Enrolled Course */}
      <section className="bg-white border text-[#0a192f] border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Recent Enrolled Course (12)</h2>
          <Link href="#" className="bg-[#f2fcf9] text-[#2db39b] font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#e6f9f4] transition-colors">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Item 1 */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-shadow">
            <div className="bg-[#f6f7fb] h-40 flex items-center justify-center relative p-4">
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 bg-red-400 rounded-full" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">Nothing great is</p>
                <p className="text-xs text-gray-500">made alone.</p>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1 bg-white">
              <p className="text-xs font-medium text-gray-500 mb-2">A Course by Richardino Gueva</p>
              <h3 className="font-bold text-gray-900 mb-6 leading-snug line-clamp-2">Figma for Beginners: Fundamentals of Figma App</h3>
              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm font-bold text-[#2db39b] mb-2">
                  <span>25%</span>
                  <span className="text-gray-400 font-medium text-xs border border-gray-100 py-[2px] px-2 rounded-full">4/20 lessons</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2db39b] h-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-shadow">
            <div className="bg-[#f6f7fb] h-40 flex items-center justify-center relative p-4">
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 bg-blue-500 rounded-sm" />
              </div>
              <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex gap-2 p-2">
                <div className="flex-1 bg-gray-200 rounded"></div>
                <div className="flex-1 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1 bg-white">
              <p className="text-xs font-medium text-gray-500 mb-2">A Course by Richardino Gueva</p>
              <h3 className="font-bold text-gray-900 mb-6 leading-snug line-clamp-2">Complete Web Design: from Figma to Webflow</h3>
              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm font-bold text-[#2db39b] mb-2">
                  <span>50%</span>
                  <span className="text-gray-400 font-medium text-xs border border-gray-100 py-[2px] px-2 rounded-full">10/20 lessons</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2db39b] h-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-shadow">
            <div className="bg-[#f6f7fb] h-40 flex items-center justify-center relative p-4">
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 bg-red-400 rounded-full" />
              </div>
              <div className="bg-white border shadow-sm p-4 w-full max-w-[80%] text-center rounded">
                <p className="text-xs font-bold text-gray-800">Become UI Designer in 3 Months</p>
                <div className="w-16 h-3 bg-[#2db39b] mx-auto mt-2 rounded-sm" />
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1 bg-white">
              <p className="text-xs font-medium text-gray-500 mb-2">A Course by Richardino Gueva</p>
              <h3 className="font-bold text-gray-900 mb-6 leading-snug line-clamp-2">Figma 2023: The Absolute Beginner to Pro Class in und...</h3>
              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm font-bold text-[#2db39b] mb-2">
                  <span>89%</span>
                  <span className="text-gray-400 font-medium text-xs border border-gray-100 py-[2px] px-2 rounded-full">29/30 lessons</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2db39b] h-full" style={{ width: '89%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-shadow">
            <div className="bg-[#f6f7fb] h-40 flex items-center justify-center relative p-4">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 bg-black rounded" />
              </div>
              <div className="bg-white border rounded shadow-sm p-3 w-full h-full flex flex-col items-center justify-center">
                 <div className="flex gap-1 mb-2">
                   <div className="w-3 h-6 bg-gray-800 rounded-sm"></div>
                   <div className="w-3 h-6 bg-gray-800 rounded-sm"></div>
                   <div className="w-3 h-6 bg-gray-800 rounded-sm"></div>
                 </div>
                 <p className="text-[10px] font-bold">Notion for everyone</p>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1 bg-white">
              <p className="text-xs font-medium text-gray-500 mb-2">A Course by Richardino Gueva</p>
              <h3 className="font-bold text-gray-900 mb-6 leading-snug line-clamp-2">Mastering Managing Project with Notion</h3>
              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm font-bold text-[#2db39b] mb-2">
                  <span>80%</span>
                  <span className="text-gray-400 font-medium text-xs border border-gray-100 py-[2px] px-2 rounded-full">8/10 lessons</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2db39b] h-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Enrolled Webinar */}
      <section className="bg-white border text-[#0a192f] border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Recent Enrolled Webinar (8)</h2>
          <Link href="#" className="bg-[#f2fcf9] text-[#2db39b] font-medium text-sm px-4 py-2 rounded-lg hover:bg-[#e6f9f4] transition-colors">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Webinar 1 */}
          <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#eaf4ff] rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 relative">
                <p className="text-[8px] font-bold text-blue-900 text-center leading-tight mb-2">Getting Started with Wireframing</p>
                <div className="w-5 h-5 bg-gray-300 rounded-full absolute bottom-1"></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8b5cf6] mb-1">UX Design <span className="text-gray-400 font-medium mx-1">• By Richardino Gueva</span></p>
                <h3 className="font-bold text-gray-900 mb-1">Getting started design with Wireframing</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Dec 16, 2022
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    09.00 - 12.00
                  </span>
                </div>
              </div>
            </div>
            <button className="bg-[#2db39b] hover:bg-[#259b86] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
              Join Now
            </button>
          </div>

          {/* Webinar 2 */}
          <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#ebf7d3] rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 relative">
                <p className="text-[8px] font-bold text-green-900 text-center leading-tight mb-2 max-w-[40px]">UI Designer Tasks and Functions</p>
                <div className="w-5 h-5 bg-gray-300 rounded-full absolute bottom-1"></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2db39b] mb-1">UI Design <span className="text-gray-400 font-medium mx-1">• By Richardino Gueva</span></p>
                <h3 className="font-bold text-gray-900 mb-1">UI Designer Tasks and Functions</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Dec 20, 2022
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    09.00 - 12.00
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 bg-[#0a192f] text-white rounded-lg text-sm font-bold tracking-wider">
              <span>12</span>:<span>03</span>:<span>49</span>
            </div>
          </div>

          {/* Webinar 3 */}
          <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#f6f7fb] rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 relative">
                <p className="text-[8px] font-bold text-gray-900 text-center leading-tight mb-2 max-w-[40px]">Starting Career as an UX Writer</p>
                <div className="w-5 h-5 bg-gray-300 rounded-full absolute bottom-1"></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#8b5cf6] mb-1">UX Design <span className="text-gray-400 font-medium mx-1">• By Richardino Gueva</span></p>
                <h3 className="font-bold text-gray-900 mb-1">Starting Career as an UX Writer</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Dec 19, 2022
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    09.00 - 12.00
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 bg-[#0a192f] text-white rounded-lg text-sm font-bold tracking-wider">
              <span>12</span>:<span>03</span>:<span>49</span>
            </div>
          </div>

          {/* Webinar 4 */}
          <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#e8f6f3] rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 relative">
                <p className="text-[8px] font-bold text-green-900 text-center leading-tight mb-2 max-w-[40px]">How to become UI Designer</p>
                <div className="w-5 h-5 bg-gray-300 rounded-full absolute bottom-1"></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2db39b] mb-1">UI Design <span className="text-gray-400 font-medium mx-1">• By Richardino Gueva</span></p>
                <h3 className="font-bold text-gray-900 mb-1">How to become UI Designer</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Dec 22, 2022
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    09.00 - 12.00
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 bg-[#0a192f] text-white rounded-lg text-sm font-bold tracking-wider">
              <span>12</span>:<span>03</span>:<span>49</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

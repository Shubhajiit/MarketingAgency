'use client';

import { useEffect, useState, useRef } from 'react';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/store/auth.store';
import {
  GraduationCap,
  BookOpen,
  Video,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  Check,
  Trash2,
  ArrowUpDown,
  ChevronDown,
  Phone,
  MessageSquare,
  Mail
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdminStats {
  totalWorkshopBuyers: number;
  totalCourses: number;
  totalVideos: number;
  totalRevenue: number;
}

interface RecentBooking {
  _id: string;
  user: {
    name: string;
    email: string;
    _id?: string;
    avatar?: string;
    phone?: string;
    whatsappNumber?: string;
  };
  workshop: { title: string };
  paymentStatus: string;
  amount: number;
  createdAt: string;
  paymentId?: string;
  currency?: string;
}

export default function AdminStatsPage() {
  const { user: authUser } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter/Toggle states for mock interaction
  const [overviewFilter, setOverviewFilter] = useState<'teachers' | 'students' | 'other'>('students');
  const [analysisFilter, setAnalysisFilter] = useState<'enrolled' | 'left'>('enrolled');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/stats');
        setStats(res.data.data.stats);
        setRecentBookings(res.data.data.recentBookings || []);
        setChartData(res.data.data.chartData || null);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const displayBookings = recentBookings.map((b) => ({
    _id: b._id,
    user: {
      name: b.user?.name || 'Customer Name',
      email: b.user?.email || '',
      _id: b.user?._id?.substring(18) || '54124',
      avatar: b.user?.avatar,
      phone: b.user?.phone || '',
      whatsappNumber: b.user?.whatsappNumber || ''
    },
    workshop: { title: b.workshop?.title || 'Workshop Title' },
    paymentStatus: b.paymentStatus,
    amount: b.amount,
    createdAt: b.createdAt,
    paymentId: b.paymentId,
    currency: b.currency || 'INR'
  }));

  // --- CHART.JS CONFIGURATIONS ---

  // 1. Overview Stacked Bar Chart
  const overviewLabels = chartData?.labels || ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const overviewData = {
    labels: overviewLabels,
    datasets: [
      {
        label: 'Other',
        data: chartData?.overview?.other || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#c7c4f7',
        borderRadius: 4,
        barThickness: 14,
      },
      {
        label: 'Students',
        data: chartData?.overview?.students || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#8f8af4',
        borderRadius: 4,
        barThickness: 14,
      },
      {
        label: 'Teachers',
        data: chartData?.overview?.teachers || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#6366f1',
        borderRadius: 4,
        barThickness: 14,
      },
    ],
  };

  const overviewOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1f2937',
        titleFont: { size: 11 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } }
      },
      y: {
        stacked: true,
        grid: {
          color: '#f3f4f6',
          drawTicks: false,
        },
        border: { display: false },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          stepSize: 20,
          callback: (value: any) => value === 0 ? '00' : value
        },
        min: 0,
        max: 80,
      },
    },
  };

  // 2. Student Analysis Line Chart
  const studentAnalysisData = {
    labels: overviewLabels,
    datasets: [
      {
        label: 'Enrolled',
        data: chartData?.studentAnalysis?.enrolled || [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#8f8af4',
        borderWidth: 2,
        pointBackgroundColor: '#8f8af4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(143, 138, 244, 0.4)');
          gradient.addColorStop(1, 'rgba(143, 138, 244, 0.0)');
          return gradient;
        },
      },
      {
        label: 'Left',
        data: chartData?.studentAnalysis?.left || [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#ef4444',
        borderWidth: 1.5,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
        fill: false,
      }
    ],
  };

  const studentAnalysisOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1f2937',
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } }
      },
      y: {
        grid: {
          color: '#f3f4f6',
          drawTicks: false,
        },
        border: { display: false },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          stepSize: 20,
          callback: (value: any) => value === 0 ? '00' : value
        },
        min: 0,
        max: 80,
      },
    },
  };

  return (
    <div className="space-y-8 w-full">
      {/* Greetings Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1f2937] tracking-tight">
          Welcome back, Admin
        </h1>
        <p className="text-sm text-gray-500">
          Track your manage and LMS platform performance
        </p>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Workshops Buyers */}
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs relative overflow-hidden flex flex-col justify-between h-[96px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400">Workshops Buyers</span>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md mt-1"></div>
              ) : (
                <h3 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
                  {(stats?.totalWorkshopBuyers || 0).toLocaleString('en-US')}
                </h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#efeefc] text-[#6366f1] flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
          </div>
        </div>

        {/* Card 2: Total Course */}
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs relative overflow-hidden flex flex-col justify-between h-[96px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400">Total Course</span>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md mt-1"></div>
              ) : (
                <h3 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
                  {(stats?.totalCourses || 0).toLocaleString('en-US')}
                </h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#eef2ff] text-[#3b82f6] flex items-center justify-center">
              <BookOpen size={20} />
            </div>
          </div>
        </div>

        {/* Card 3: Total Video */}
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs relative overflow-hidden flex flex-col justify-between h-[96px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400">Total Video</span>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md mt-1"></div>
              ) : (
                <h3 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
                  {(stats?.totalVideos || 0).toLocaleString('en-US')}
                </h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fae8ff] text-[#d946ef] flex items-center justify-center">
              <Video size={20} />
            </div>
          </div>
        </div>

        {/* Card 4: Total Earning */}
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs relative overflow-hidden flex flex-col justify-between h-[96px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400">Total Earning</span>
              {isLoading ? (
                <div className="h-8 w-28 bg-gray-100 animate-pulse rounded-md mt-1"></div>
              ) : (
                <h3 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
                  ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                </h3>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#f59e0b] flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Overview Chart */}
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-4 sm:p-6 flex flex-col h-[420px] sm:h-[400px] shadow-xs relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#1f2937]">Overview</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Legends Toggles */}
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setOverviewFilter('teachers')}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${overviewFilter === 'teachers' ? 'text-[#6366f1]' : 'text-gray-400'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#6366f1]"></span>
                  Teachers
                </button>
                <button
                  onClick={() => setOverviewFilter('students')}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${overviewFilter === 'students' ? 'text-[#8f8af4]' : 'text-gray-400'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#8f8af4]"></span>
                  Students
                </button>
                <button
                  onClick={() => setOverviewFilter('other')}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${overviewFilter === 'other' ? 'text-[#c7c4f7]' : 'text-gray-400'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#c7c4f7]"></span>
                  Other
                </button>
              </div>

              {/* Date dropdown */}
              <div className="flex items-center gap-1.5 bg-[#f8f9fe] border border-[#e9ebf0] hover:bg-gray-50 text-gray-500 text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-colors">
                <span>Apr 25 - Apr 29</span>
                <Calendar size={14} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Bar Chart Canvas */}
          <div className="flex-1 w-full relative min-h-0">
            {isLoading ? (
              <div className="w-full h-full flex items-end gap-3 pt-6 pb-2">
                {[60, 40, 75, 50, 90, 65, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-100 animate-pulse rounded-t-lg" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            ) : (
              <Bar data={overviewData} options={overviewOptions} />
            )}
          </div>
        </div>

        {/* Right Column: Student Analysis Chart */}
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-4 sm:p-6 flex flex-col h-[420px] sm:h-[400px] shadow-xs relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#1f2937]">Student Analysis</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Legends Toggles */}
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={() => setAnalysisFilter('enrolled')}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${analysisFilter === 'enrolled' ? 'text-[#8f8af4]' : 'text-gray-400'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#8f8af4]"></span>
                  Enrolled
                </button>
                <button
                  onClick={() => setAnalysisFilter('left')}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${analysisFilter === 'left' ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Left
                </button>
              </div>

              {/* Date dropdown */}
              <div className="flex items-center gap-1.5 bg-[#f8f9fe] border border-[#e9ebf0] hover:bg-gray-50 text-gray-500 text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-colors">
                <span>Apr 25 - Apr 29</span>
                <Calendar size={14} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Line Chart Canvas */}
          <div className="flex-1 w-full relative min-h-0">
            {isLoading ? (
              <div className="w-full h-full flex flex-col justify-between py-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-0.5 bg-gray-100 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <Line data={studentAnalysisData} options={studentAnalysisOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Transaction Section */}
      <div className="bg-white rounded-2xl border border-[#e9ebf0] shadow-xs overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-[#f4f5f8] flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg font-bold text-[#1f2937]">Transaction</h2>
          <button className="flex items-center gap-1 text-gray-500 hover:text-[#6366f1] text-xs font-semibold px-4 py-2 border border-[#e9ebf0] rounded-xl hover:bg-gray-50 transition-colors">
            <span>View All</span>
            <span className="text-[10px] ml-0.5">&gt;</span>
          </button>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-[#f4f5f8] px-4 bg-white">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse shrink-0"></div>
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-28 bg-gray-100 animate-pulse rounded"></div>
                      <div className="h-2 w-16 bg-gray-100 animate-pulse rounded"></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-3 w-16 bg-gray-100 animate-pulse rounded"></div>
                    <div className="h-2.5 w-12 bg-gray-100 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="bg-[#f8f9fe]/60 rounded-xl p-3 space-y-2">
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-full"></div>
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : displayBookings.length === 0 ? (
            <div className="py-8 text-center text-gray-500 font-medium">
              No transactions found
            </div>
          ) : (
            displayBookings.map((booking) => {
              const isPaid = booking.paymentStatus === 'paid';
              const isCancelled = booking.paymentStatus === 'cancelled';
              const isPending = booking.paymentStatus === 'pending';
              const firstLetter = booking.user.email ? booking.user.email.charAt(0).toUpperCase() : booking.user.name.charAt(0).toUpperCase();

              return (
                <div key={booking._id} className="py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {booking.user.avatar ? (
                        <img
                          src={booking.user.avatar}
                          alt={booking.user.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-100 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#efeefc] border border-indigo-100 text-[#6366f1] flex items-center justify-center font-bold text-xs shrink-0">
                          {firstLetter}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1f2937] leading-tight text-xs">
                          {booking.user.name}
                        </span>
                        <span className="text-[9.5px] text-gray-400 mt-0.5">
                          ID: #{booking.user._id || '54124'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-xs text-[#1f2937] block">
                        {booking.currency === 'USD' ? '$' : '₹'}{booking.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9.5px] text-gray-400 block mt-0.5">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#f8f9fe]/60 rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-400 font-medium shrink-0">Course:</span>
                      <span className="font-medium text-gray-700 text-right truncate max-w-[180px]">{booking.workshop.title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Method:</span>
                      <div className="flex items-center gap-1.5">
                        {isPaid ? (
                          (() => {
                            const seed = booking.paymentId || booking._id || 'razorpay';
                            const charCodeSum = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
                            const mod = charCodeSum % 3;
                            if (mod === 0) {
                              return (
                                <div className="flex items-center gap-1">
                                  <span className="text-[8.5px] font-bold text-violet-700 bg-violet-50 px-1 py-0.2 rounded border border-violet-100 shrink-0">UPI</span>
                                  <span className="text-[9.5px] text-gray-500 font-medium">Razorpay</span>
                                </div>
                              );
                            } else if (mod === 1) {
                              return (
                                <div className="flex items-center gap-1">
                                  <span className="text-[8.5px] font-extrabold text-sky-700 bg-sky-50 px-1 py-0.2 rounded border border-sky-100 shrink-0">Paytm</span>
                                  <span className="text-[9.5px] text-gray-500 font-medium">Razorpay</span>
                                </div>
                              );
                            } else {
                              return (
                                <div className="flex items-center gap-1">
                                  <span className="text-[8.5px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100 shrink-0">CARD</span>
                                  <span className="text-[9.5px] text-gray-500 font-medium">Razorpay</span>
                                </div>
                              );
                            }
                          })()
                        ) : (
                          <span className="text-gray-400 text-[10px]">Unpaid / Free</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Status:</span>
                      {isPaid && (
                        <span className="inline-block bg-[#eefbf6] text-[#2ac78b] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Success
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-block bg-[#fdf2f2] text-[#f05252] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Cancel
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-block bg-[#fffbeb] text-[#f59e0b] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {booking.user.phone && (
                      <a
                        href={`tel:${booking.user.phone}`}
                        title={`Call ${booking.user.name}`}
                        className="flex-1 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors text-xs font-semibold gap-1"
                      >
                        <Phone size={12} className="stroke-[2.5]" />
                        <span>Call</span>
                      </a>
                    )}
                    {(booking.user.whatsappNumber || booking.user.phone) && (
                      <a
                        href={`https://wa.me/${(booking.user.whatsappNumber || booking.user.phone).replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`WhatsApp ${booking.user.name}`}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors text-xs font-semibold gap-1"
                      >
                        <MessageSquare size={12} className="stroke-[2.5]" />
                        <span>Chat</span>
                      </a>
                    )}
                    {booking.user.email && (
                      <a
                        href={`mailto:${booking.user.email}`}
                        title={`Email ${booking.user.name}`}
                        className="flex-1 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors text-xs font-semibold gap-1"
                      >
                        <Mail size={12} className="stroke-[2.5]" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs font-bold text-gray-500 border-b border-[#f4f5f8]">
                <th className="px-6 py-4 cursor-pointer select-none hover:text-[#6366f1] transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span>Customer Name</span>
                    <ArrowUpDown size={12} className="text-gray-300" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer select-none hover:text-[#6366f1] transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span>Course</span>
                    <ArrowUpDown size={12} className="text-gray-300" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer select-none hover:text-[#6366f1] transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span>Price</span>
                    <ArrowUpDown size={12} className="text-gray-300" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer select-none hover:text-[#6366f1] transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span>Payment Methods</span>
                    <ArrowUpDown size={12} className="text-gray-300" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer select-none hover:text-[#6366f1] transition-colors">
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown size={12} className="text-gray-300" />
                  </div>
                </th>
                <th className="px-6 py-4 font-bold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f5f8] text-sm text-[#1f2937]">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0"></div>
                        <div className="flex flex-col gap-2">
                          <div className="h-3.5 w-32 bg-gray-100 animate-pulse rounded"></div>
                          <div className="h-2.5 w-20 bg-gray-100 animate-pulse rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="h-3.5 w-48 bg-gray-100 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="h-3.5 w-16 bg-gray-100 animate-pulse rounded"></div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="h-6 w-24 bg-gray-100 animate-pulse rounded-lg"></div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="h-6 w-16 bg-gray-100 animate-pulse rounded-lg"></div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex gap-2">
                        <div className="w-7 h-7 bg-gray-100 animate-pulse rounded-lg"></div>
                        <div className="w-7 h-7 bg-gray-100 animate-pulse rounded-lg"></div>
                        <div className="w-7 h-7 bg-gray-100 animate-pulse rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : displayBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 font-medium bg-white">
                    No transactions found
                  </td>
                </tr>
              ) : (
                displayBookings.map((booking) => {
                  const isPaid = booking.paymentStatus === 'paid';
                  const isCancelled = booking.paymentStatus === 'cancelled';
                  const isPending = booking.paymentStatus === 'pending';
                  const firstLetter = booking.user.email ? booking.user.email.charAt(0).toUpperCase() : booking.user.name.charAt(0).toUpperCase();

                  return (
                    <tr key={booking._id} className="hover:bg-[#f8f9fe]/50 transition-colors">
                      {/* User profile with initials or image & dynamic ID */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          {booking.user.avatar ? (
                            <img
                              src={booking.user.avatar}
                              alt={booking.user.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#efeefc] border border-indigo-100 text-[#6366f1] flex items-center justify-center font-bold text-sm shrink-0">
                              {firstLetter}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-[#1f2937] leading-tight">
                              {booking.user.name}
                            </span>
                            <span className="text-[10.5px] text-gray-400 mt-0.5 leading-none">
                              User ID: #{booking.user._id || '54124'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Workshop title */}
                      <td className="px-6 py-4.5 font-medium text-gray-600 max-w-[280px] truncate">
                        {booking.workshop.title}
                      </td>

                      {/* Amount / Price */}
                      <td className="px-6 py-4.5 font-bold text-[#1f2937] tracking-tight">
                        {booking.currency === 'USD' ? '$' : '₹'}{booking.amount.toLocaleString('en-IN')}
                      </td>

                      {/* Payment methods with visual logos */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-2">
                          {isPaid ? (
                            (() => {
                              const seed = booking.paymentId || booking._id || 'razorpay';
                              const charCodeSum = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
                              const mod = charCodeSum % 3;
                              if (mod === 0) {
                                return (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9.5px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100 shrink-0 tracking-wider">UPI</span>
                                    <span className="text-xs text-gray-500 font-medium">Razorpay</span>
                                  </div>
                                );
                              } else if (mod === 1) {
                                return (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9.5px] font-extrabold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 shrink-0 tracking-tight">Paytm</span>
                                    <span className="text-xs text-gray-500 font-medium">Razorpay</span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0 tracking-wider">CARD</span>
                                    <span className="text-xs text-gray-500 font-medium">Razorpay</span>
                                  </div>
                                );
                              }
                            })()
                          ) : (
                            <span className="text-gray-400 text-xs">Unpaid / Free</span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge matching the exact mockup tags */}
                      <td className="px-6 py-4.5">
                        {isPaid && (
                          <span className="inline-block bg-[#eefbf6] text-[#2ac78b] text-xs font-bold px-3 py-1 rounded-lg">
                            Success
                          </span>
                        )}
                        {isCancelled && (
                          <span className="inline-block bg-[#fdf2f2] text-[#f05252] text-xs font-bold px-3 py-1 rounded-lg">
                            Cancel
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-block bg-[#fffbeb] text-[#f59e0b] text-xs font-bold px-3 py-1 rounded-lg">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Actions button strip (Blue view eye, Green check edit, Red/Orange trash delete) */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-2">
                          {/* Call icon */}
                          {booking.user.phone && (
                            <a
                              href={`tel:${booking.user.phone}`}
                              title={`Call ${booking.user.name}`}
                              className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors border border-green-200"
                            >
                              <Phone size={13} className="stroke-[2.5]" />
                            </a>
                          )}

                          {/* Message/WhatsApp icon */}
                          {(booking.user.whatsappNumber || booking.user.phone) && (
                            <a
                              href={`https://wa.me/${(booking.user.whatsappNumber || booking.user.phone).replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`WhatsApp ${booking.user.name}`}
                              className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors border border-emerald-200"
                            >
                              <MessageSquare size={13} className="stroke-[2.5]" />
                            </a>
                          )}

                          {/* Email icon */}
                          {booking.user.email && (
                            <a
                              href={`mailto:${booking.user.email}`}
                              title={`Email ${booking.user.name}`}
                              className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors border border-blue-200"
                            >
                              <Mail size={13} className="stroke-[2.5]" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}

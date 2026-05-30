'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { adminApi, AdminUser } from '@/lib/api/admin';
import { Course } from '@/components/common/CoursesCardsUI';
import {
  Users,
  Search,
  Mail,
  Phone,
  MessageSquare,
  Copy,
  Check,
  Award,
  Loader2,
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

interface BuyerRow {
  userId: string;
  userName: string;
  userEmail: string;
  phoneNumber: string;
  whatsappNumber: string;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  coursePrice: number;
  joinedDate: string;
}

export default function CoursesBuyersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Fetch users from API
  const fetchBuyers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getUsers();
      if (res.success && res.data?.users) {
        setUsers(res.data.users);
      } else {
        setError('Failed to retrieve user directory.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading courses buyers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  // Copy to clipboard helper
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Process data into flat list of user course purchases
  const buyerRows: BuyerRow[] = [];
  users.forEach((user) => {
    if (user.enrolledCourses && user.enrolledCourses.length > 0) {
      user.enrolledCourses.forEach((course) => {
        buyerRows.push({
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          phoneNumber: user.phoneNumber || '',
          whatsappNumber: user.whatsappNumber || '',
          courseId: (course as any)._id || course.id,
          courseTitle: course.title,
          courseCategory: course.category || 'popular',
          coursePrice: course.price || 0,
          joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
        });
      });
    }
  });

  // Calculate statistics
  const totalEnrolledCourses = buyerRows.length;
  const uniqueBuyers = new Set(buyerRows.map(r => r.userId)).size;
  const totalRevenue = buyerRows.reduce((sum, row) => sum + row.coursePrice, 0);

  // Find popular course
  const courseCounts: Record<string, number> = {};
  buyerRows.forEach(row => {
    courseCounts[row.courseTitle] = (courseCounts[row.courseTitle] || 0) + 1;
  });
  let popularCourse = 'None';
  let maxCount = 0;
  Object.entries(courseCounts).forEach(([title, count]) => {
    if (count > maxCount) {
      maxCount = count;
      popularCourse = title;
    }
  });

  // Filter buyer list
  const filteredRows = buyerRows.filter((row) => {
    const query = searchQuery.toLowerCase();
    return (
      row.userName.toLowerCase().includes(query) ||
      row.userEmail.toLowerCase().includes(query) ||
      row.courseTitle.toLowerCase().includes(query) ||
      row.userId.toLowerCase().includes(query) ||
      row.phoneNumber.includes(query) ||
      row.whatsappNumber.includes(query)
    );
  });

  // Helper to format WhatsApp API link
  const getWhatsappLink = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    return `https://wa.me/${cleanNum}`;
  };

  return (
    <div className="space-y-8 w-full">
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1f2937] tracking-tight">Courses Buyers</h1>
        <p className="text-sm text-gray-500">
          Monitor users enrolled in certification courses, check payment totals, and verify contact details.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total Enrolled Purchases */}
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs flex flex-col justify-between h-[120px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400">Total Enrollments</span>
              <h3 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
                {totalEnrolledCourses}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#efeefc] text-[#6366f1] flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-500 font-semibold text-xs bg-green-50 px-2 py-0.5 rounded-full w-fit">
            <TrendingUp size={12} />
            <span>Course Purchases</span>
          </div>
        </div>

        {/* Metric 2: Unique Buyers */}
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs flex flex-col justify-between h-[120px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400">Unique Buyers</span>
              <h3 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
                {uniqueBuyers}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#eef2ff] text-[#3b82f6] flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Active studying accounts
          </div>
        </div>

        {/* Metric 3: Total Sales Revenue */}
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs flex flex-col justify-between h-[120px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400">Sales Value</span>
              <h3 className="text-2xl font-extrabold text-[#1f2937] tracking-tight">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#f59e0b] flex items-center justify-center">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Total course invoice values
          </div>
        </div>

        {/* Metric 4: Popular Course */}
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs flex flex-col justify-between h-[120px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1 min-w-0">
              <span className="text-xs font-semibold text-gray-400 block">Top Program</span>
              <h3 className="text-[14px] font-bold text-[#1f2937] truncate tracking-tight mt-1">
                {popularCourse}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fae8ff] text-[#d946ef] flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
          </div>
          <div className="text-xs text-[#d946ef] font-semibold">
            {maxCount > 0 ? `${maxCount} student purchases` : 'No data'}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-[#e9ebf0] shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-[#f4f5f8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, course or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#f8f9fe] border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-[#efeefc] focus:ring-2 focus:ring-[#6366f1]/10 transition-all placeholder-gray-400"
            />
          </div>
          <button
            onClick={fetchBuyers}
            className="flex items-center justify-center gap-1.5 text-gray-500 hover:text-[#6366f1] text-xs font-semibold px-4 py-2.5 border border-[#e9ebf0] rounded-xl hover:bg-gray-50 transition-colors"
          >
            Refresh List
          </button>
        </div>

        {/* Loader/Empty States */}
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3 bg-white">
            <Loader2 size={32} className="animate-spin text-[#6366f1]" />
            <span className="text-sm text-gray-500 font-medium">Loading buyers directory...</span>
          </div>
        ) : error ? (
          <div className="p-20 text-center text-red-500 bg-white">
            {error}
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3 text-slate-400 bg-white">
            <ShoppingBag size={40} className="stroke-[1.5] mb-2" />
            <p className="text-sm font-semibold text-slate-600">No buyer purchases found</p>
            <p className="text-xs text-slate-400 max-w-md text-center">
              {searchQuery ? 'Adjust your search terms to find records.' : 'No users have purchased courses yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/60 text-xs font-bold text-gray-500 border-b border-[#f4f5f8]">
                  <th className="px-6 py-4.5">User Info</th>
                  <th className="px-6 py-4.5">User ID</th>
                  <th className="px-6 py-4.5">Phone Number</th>
                  <th className="px-6 py-4.5">WhatsApp</th>
                  <th className="px-6 py-4.5">Course Purchased</th>
                  <th className="px-6 py-4.5">Category</th>
                  <th className="px-6 py-4.5">Price</th>
                  <th className="px-6 py-4.5 text-center">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f5f8] text-sm text-[#1f2937]">
                {filteredRows.map((row, idx) => (
                  <tr key={`${row.userId}-${row.courseId}-${idx}`} className="hover:bg-[#f8f9fe]/40 transition-colors">
                    {/* User profile details */}
                    <td className="px-6 py-4.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1f2937] leading-tight">
                          {row.userName}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                          <Mail size={10} className="shrink-0" />
                          {row.userEmail}
                        </span>
                      </div>
                    </td>

                    {/* Copyable User ID */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-gray-500">
                        <span>{row.userId.substring(18)}...</span>
                        <button
                          onClick={() => handleCopy(row.userId)}
                          className="text-gray-300 hover:text-[#6366f1] transition-colors p-1"
                          title="Copy Full User ID"
                        >
                          {copiedId === row.userId ? (
                            <Check size={12} className="text-green-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Phone Number */}
                    <td className="px-6 py-4.5 font-medium text-gray-600">
                      {row.phoneNumber || (
                        <span className="text-gray-300 italic text-xs">Not provided</span>
                      )}
                    </td>

                    {/* WhatsApp number with wa.me chat click */}
                    <td className="px-6 py-4.5 font-medium text-gray-600">
                      {row.whatsappNumber ? (
                        <a
                          href={getWhatsappLink(row.whatsappNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-600 hover:underline hover:text-emerald-700 font-semibold"
                          title="Open WhatsApp Chat"
                        >
                          <span>{row.whatsappNumber}</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-gray-300 italic text-xs">Not provided</span>
                      )}
                    </td>

                    {/* Purchased Course Title */}
                    <td className="px-6 py-4.5 font-bold text-gray-800">
                      {row.courseTitle}
                    </td>

                    {/* Course Category */}
                    <td className="px-6 py-4.5 capitalize text-xs font-semibold text-gray-500">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {row.courseCategory.replace('-', ' ')}
                      </span>
                    </td>

                    {/* Price Paid */}
                    <td className="px-6 py-4.5 font-extrabold text-[#1f2937]">
                      ₹{row.coursePrice.toLocaleString('en-IN')}
                    </td>

                    {/* Communication quick buttons */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`mailto:${row.userEmail}?subject=Regarding your enrolled course: ${row.courseTitle}`}
                          className="w-8 h-8 rounded-lg bg-[#efeefc] hover:bg-[#dbd9fb] text-[#5e35b1] flex items-center justify-center transition-colors"
                          title="Email Student"
                        >
                          <Mail size={14} />
                        </a>
                        {row.whatsappNumber && (
                          <a
                            href={getWhatsappLink(row.whatsappNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg bg-[#eefbf6] hover:bg-[#d5f6e8] text-[#2ac78b] flex items-center justify-center transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare size={14} />
                          </a>
                        )}
                        {row.phoneNumber && (
                          <a
                            href={`tel:${row.phoneNumber}`}
                            className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 flex items-center justify-center transition-colors"
                            title="Call Student"
                          >
                            <Phone size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

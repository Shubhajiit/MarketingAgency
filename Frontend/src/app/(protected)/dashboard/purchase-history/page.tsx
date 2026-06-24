"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, BookOpen, Presentation, Calendar, CreditCard, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { userApi } from '@/lib/api/user';
import { useAuth } from '@/lib/hooks/useAuth';

interface Purchase {
  _id: string;
  courseTitle?: string;
  workshopTitle?: string;
  amountPaid: number;
  currency: string;
  paymentStatus: string;
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  isCancelled?: boolean;
  refundStatus?: string;
}

export default function PurchaseHistoryPage() {
  const { checkAuth } = useAuth();
  const [courses, setCourses] = useState<Purchase[]>([]);
  const [workshops, setWorkshops] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (checkAuth) {
      checkAuth(true);
    }
    fetchHistory();
  }, [checkAuth]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await userApi.getPurchaseHistory();
      if (res.success) {
        setCourses(res.data.courses || []);
        setWorkshops(res.data.workshops || []);
      } else {
        setError(res.message || 'Failed to fetch purchase history.');
      }
    } catch (err) {
      console.error('Error fetching purchase history:', err);
      setError('An error occurred while loading your purchase history.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 font-sans pt-6 min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1b2a60] animate-spin" />
        <p className="text-slate-500 text-sm">Loading your transactions...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 font-sans pt-6 px-4 sm:px-0">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Link href="/dashboard" className="hover:text-[#1b2a60] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 font-medium">Purchase History</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-[#1b2a60]" />
            Purchase History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View details and receipts of all your courses and workshop enrollments
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Courses Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1b2a60]" />
          Course Purchases
        </h2>

        {courses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-sm">
            No course purchases found.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="p-4">Date</th>
                    <th className="p-4">Course Title</th>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {courses.map((purchase) => (
                    <tr key={purchase._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {formatDate(purchase.createdAt)}
                      </td>
                      <td className="p-4 font-semibold text-slate-900">
                        {purchase.courseTitle}
                      </td>
                      <td className="p-4 whitespace-nowrap text-xs font-mono text-slate-500">
                        {purchase.paymentId || 'N/A'}
                      </td>
                      <td className="p-4 whitespace-nowrap font-bold text-slate-900">
                        ₹{purchase.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Successful
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Workshops Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Presentation className="w-5 h-5 text-[#1b2a60]" />
          Workshop Purchases
        </h2>

        {workshops.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-sm">
            No workshop registrations found.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="p-4">Date</th>
                    <th className="p-4">Workshop Title</th>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                  {workshops.map((purchase) => (
                    <tr key={purchase._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {formatDate(purchase.createdAt)}
                      </td>
                      <td className="p-4 font-semibold text-slate-900">
                        {purchase.workshopTitle}
                      </td>
                      <td className="p-4 whitespace-nowrap text-xs font-mono text-slate-500">
                        {purchase.paymentId || 'N/A'}
                      </td>
                      <td className="p-4 whitespace-nowrap font-bold text-slate-900">
                        ₹{purchase.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {purchase.isCancelled ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                            {purchase.refundStatus === 'refunded' ? 'Cancelled & Refunded' : 'Cancelled'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Successful
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

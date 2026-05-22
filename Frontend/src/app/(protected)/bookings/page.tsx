'use client';

import { useMyBookings } from '@/lib/hooks/useBookings';

export default function BookingsPage() {
  const { data, isLoading } = useMyBookings();
  const bookings = data?.data?.bookings || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">View all your workshop bookings and their status.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin w-6 h-6 text-[#009ee3]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking: { _id: string; workshop: { title: string; instructor: string }; slotDate: string; slotTime: string; amount: number; currency: string; paymentStatus: string; createdAt: string }) => (
            <div key={booking._id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {booking.workshop?.title || 'Workshop'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    by {booking.workshop?.instructor || 'Instructor'}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(booking.slotDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {booking.slotTime}
                    </span>
                    <span className="font-semibold text-gray-700">
                      ₹{booking.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <span className={`inline-flex text-xs font-bold px-3 py-1.5 rounded-full self-start sm:self-center ${
                  booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                  booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {booking.paymentStatus?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

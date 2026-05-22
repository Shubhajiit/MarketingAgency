'use client';

import { useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  price: number;
  currency: string;
  onPurchase: () => void;
  isLoading?: boolean;
}

export default function PaywallModal({
  isOpen,
  onClose,
  title,
  price,
  currency,
  onPurchase,
  isLoading = false,
}: PaywallModalProps) {
  if (!isOpen) return null;

  const formattedPrice =
    currency === 'INR'
      ? `₹${price.toLocaleString('en-IN')}`
      : `$${price.toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#009ee3] to-[#0077b6] px-6 py-5">
          <h3 className="text-lg font-bold text-white">Unlock This Video</h3>
        </div>

        <div className="px-6 py-6 space-y-4">
          <h4 className="text-base font-semibold text-gray-900">{title}</h4>

          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-sm text-gray-500">One-time purchase</span>
            <span className="text-xl font-bold text-gray-900">{formattedPrice}</span>
          </div>

          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Lifetime access after purchase
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Available from your dashboard
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Secure payment via Razorpay/Stripe
            </li>
          </ul>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onPurchase}
              disabled={isLoading}
              className="flex-1 py-2.5 bg-[#009ee3] hover:bg-[#0088cc] disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Processing...' : `Pay ${formattedPrice}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { paymentApi } from '@/lib/api/payments';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

interface RazorpayButtonProps {
  type: 'booking' | 'video';
  referenceId: string;
  onSuccess?: (paymentId: string) => void;
  onFailure?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function RazorpayButton({
  type,
  referenceId,
  onSuccess,
  onFailure,
  className = '',
  children = 'Pay Now',
}: RazorpayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Create order on backend
      const response = await paymentApi.createOrder({
        type,
        referenceId,
        gateway: 'razorpay',
      });

      const { order } = response.data;

      // Load Razorpay SDK if not loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const razorpay = new window.Razorpay!({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'AI Scale',
        description: `Payment for ${type}`,
        handler: (response: { razorpay_payment_id: string }) => {
          onSuccess?.(response.razorpay_payment_id);
        },
        prefill: {},
        theme: {
          color: '#009ee3',
        },
      });

      razorpay.open();
    } catch (err) {
      onFailure?.('Payment initiation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`px-6 py-2.5 bg-[#009ee3] hover:bg-[#0088cc] disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg transition-all ${className}`}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
}

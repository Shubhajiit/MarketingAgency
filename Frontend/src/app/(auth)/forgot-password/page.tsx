'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="px-8 pt-8 pb-2 text-left">
        <Link href="/" className="inline-block mb-6">
          <img
            src="/Logo/Logo.svg"
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Reset Password
        </h1>
      </div>

      <div className="px-8 pb-8 pt-4">
        {sent ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Check your email</h2>
            <p className="text-sm text-slate-500">
              If an account exists with <strong>{email}</strong>, we&apos;ve sent a password reset link.
            </p>
            <Link href="/login" className="inline-block text-sm text-slate-950 hover:text-slate-800 font-bold underline mt-4">
              ← Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <p className="text-sm text-slate-500">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <div className="space-y-1.5">
              <label htmlFor="forgot-email" className="block text-sm font-normal text-slate-600">
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="anna@gmail.com"
                className="w-full h-12 px-5 bg-white border border-slate-200 rounded-full focus:border-slate-400 focus:ring-0 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-0 text-slate-900 placeholder-slate-400 outline-none transition-all shadow-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-full transition-all flex items-center justify-center shadow-none cursor-pointer"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-center text-sm text-slate-500 pt-2">
              <Link href="/login" className="text-slate-950 hover:text-slate-800 font-bold underline transition-colors">
                ← Back to login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

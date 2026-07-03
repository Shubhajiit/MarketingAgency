'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Reset token is missing or invalid.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
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
          Create New Password
        </h1>
      </div>

      <div className="px-8 pb-8 pt-4">
        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Password Reset Complete</h2>
            <p className="text-sm text-slate-500">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <Link href="/login" className="inline-block text-sm text-slate-950 hover:text-slate-800 font-bold underline mt-4">
              ← Go to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {!token && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl">
                Warning: Reset token is missing. Please make sure you followed the link from your email correctly.
              </div>
            )}

            <p className="text-sm text-slate-500">
              Please enter your new password below.
            </p>

            <div className="space-y-1.5">
              <label htmlFor="reset-password" className="block text-sm font-normal text-slate-600">
                New Password
              </label>
              <input
                id="reset-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-12 px-5 bg-white border border-slate-200 rounded-full focus:border-slate-400 focus:ring-0 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-0 text-slate-900 placeholder-slate-400 outline-none transition-all shadow-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="block text-sm font-normal text-slate-600">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-12 px-5 bg-white border border-slate-200 rounded-full focus:border-slate-400 focus:ring-0 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-0 text-slate-900 placeholder-slate-400 outline-none transition-all shadow-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full h-12 text-base font-semibold bg-slate-950 hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-full transition-all flex items-center justify-center shadow-none cursor-pointer"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center text-slate-500">
        Loading...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

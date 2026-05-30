'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { userApi } from '@/lib/api/user';
import { Save, User, Mail, ShieldAlert, Phone, MessageSquare } from 'lucide-react';

export default function SettingsPage() {
  const { user, setAuth } = useAuthStore();
  
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhoneNumber(user.phoneNumber || '');
      setWhatsappNumber(user.whatsappNumber || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setNotification(null);

    try {
      // Call update API
      const updatedUserResponse = await userApi.updateProfile({ 
        name,
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim()
      });
      
      // Update state in Zustand store
      if (user) {
        setAuth({
          ...user,
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          whatsappNumber: whatsappNumber.trim()
        });
      }

      setNotification('Profile settings updated successfully!');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-12 font-sans pt-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg z-50 text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2 border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          {notification}
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">
          Profile Information
        </h2>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-none text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                disabled={isSubmitting}
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Email Address - Read Only */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">Email Address (Read-only)</label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none text-sm text-slate-400 cursor-not-allowed outline-none select-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-none text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                disabled={isSubmitting}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">WhatsApp Number</label>
            <div className="relative">
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Enter your WhatsApp number"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-none text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                disabled={isSubmitting}
              />
              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Role - Read Only */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">Role</label>
            <div className="relative">
              <input
                type="text"
                value={user?.role || 'student'}
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none text-sm text-slate-400 cursor-not-allowed outline-none capitalize select-none"
              />
              <ShieldAlert className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0c102a] text-white hover:bg-slate-800 disabled:bg-slate-400 font-extrabold text-[12px] md:text-sm rounded-none transition-all duration-150 uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-sm select-none"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

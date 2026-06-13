"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workshopApi } from '@/lib/api/workshops';

export default function WorkshopsRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  useEffect(() => {
    if (!slug) {
      router.replace('/');
      return;
    }

    const checkAndRedirect = async () => {
      try {
        const res = await workshopApi.getBySlug(slug);
        const workshop = res.data?.workshop;
        
        if (workshop) {
          if (workshop.type === 'three-days') {
            router.replace(`/three-days-workshops/${slug}`);
          } else {
            router.replace(`/one-day-workshop/${slug}`);
          }
        } else {
          router.replace('/');
        }
      } catch (err) {
        console.error('Error finding workshop for redirect:', err);
        router.replace('/');
      }
    };

    checkAndRedirect();
  }, [slug, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        {/* Loading Spinner */}
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0052FF] rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-semibold tracking-wide">
          Redirecting to the correct workshop page...
        </p>
      </div>
    </div>
  );
}

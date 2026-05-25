"use client";

import React, { useEffect } from "react";
import CertificationCoursesSection from "@/components/MainWebsite/Courses/certification-courses";

export default function CoursesPage() {
  // Dynamic SEO Configuration
  useEffect(() => {
    document.title = "Explore Our Certification Courses | AI Scale";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Browse and explore our global standard digital marketing and AI certification courses, including DMI Pro, DMI Expert, Advanced AI, SEO, and PPC."
      );
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <CertificationCoursesSection />
    </div>
  );
}

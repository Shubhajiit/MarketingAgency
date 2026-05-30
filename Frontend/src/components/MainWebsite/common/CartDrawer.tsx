"use client";

import React, { useState, useEffect } from "react";
import { X, ShoppingCart, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { coursesApi } from "@/lib/api/courses";

export default function CartDrawer() {
  const { isOpen, cartCount, selectedCourse, closeDrawer, removeFromCart } = useCartStore();
  const { user, setAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "loading" | "success">("idle");
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Manage mount and transition classes
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Let the browser paint the mounted state before triggering transition
      const timer = setTimeout(() => {
        setVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300); // Matches transition duration (300ms)
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset checkout status when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setCheckoutStatus("idle");
    }
  }, [isOpen]);

  if (!mounted) return null;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      closeDrawer();
      router.push("/login?redirect=cart");
      return;
    }

    if (!selectedCourse) return;

    setCheckoutStatus("loading");
    try {
      const courseId = (selectedCourse as unknown as { _id?: string })._id || selectedCourse.id;
      await coursesApi.enroll(courseId);

      // Update state in Zustand store
      if (user) {
        const enrolled = user.enrolledCourses || [];
        const newCourseObj = {
          _id: courseId,
          title: selectedCourse.title,
          category: selectedCourse.category,
          hours: selectedCourse.hours,
          price: selectedCourse.price,
          originalPrice: selectedCourse.originalPrice,
          discount: selectedCourse.discount,
          thumbnail: selectedCourse.thumbnail,
          isActive: true
        };
        if (!enrolled.some((c: unknown) => {
          if (!c) return false;
          if (typeof c === 'string') return c === courseId;
          const courseItem = c as { _id?: string; id?: string };
          return courseItem._id === courseId || courseItem.id === courseId;
        })) {
          setAuth({
            ...user,
            enrolledCourses: [...enrolled, newCourseObj]
          });
        }
      }

      setCheckoutStatus("success");
      setTimeout(() => {
        removeFromCart();
        closeDrawer();
      }, 2200);
    } catch (error) {
      console.error("Failed to enroll in course:", error);
      setCheckoutStatus("idle");
      const err = error as { response?: { data?: { message?: string } } };
      const serverMsg = err.response?.data?.message;
      alert(serverMsg || "Enrollment failed. Please try again.");
    }
  };

  const getCleanDescription = (desc?: string) => {
    if (!desc) return "In this expert-led professional certification, you will learn hands-on, job-ready skills using industry-standard tools. The program includes comprehensive projects, real-world case studies, and mentor support to accelerate your career.";
    return desc;
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end font-sans">
      {/* Backdrop Overlay with smooth transition */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => checkoutStatus !== "loading" && closeDrawer()}
      />

      {/* Slide-out Sheet Panel with smooth transition */}
      <div
        className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <ShoppingCart className="w-4 h-4 text-[#0056d2]" />
            <h2 className="text-sm font-semibold text-slate-800">Shopping Cart</h2>
            {cartCount > 0 && (
              <span className="bg-[#ebf3fc] text-[#0056d2] text-[10.5px] font-medium px-2 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            disabled={checkoutStatus === "loading"}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col">
          {checkoutStatus === "success" ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3 border border-emerald-100">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 animate-bounce" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">Enrollment Successful!</h3>
              <p className="text-[12px] text-slate-500 max-w-xs mb-6">
                Thank you for your purchase. You are now enrolled in the course. Redirecting you...
              </p>
            </div>
          ) : !selectedCourse || cartCount === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
              <ShoppingCart className="w-10 h-10 mb-3 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-500">Your cart is empty</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                Browse our catalog and add a course to start learning.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 flex-1">
              
              {/* Course Item Card */}
              <div className="border border-slate-100 rounded-xl p-4 bg-[#f8fafd] relative group">
                <button
                  onClick={removeFromCart}
                  className="absolute top-3 right-3 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Tag at the top */}
                {selectedCourse.category && (
                  <span className="inline-block bg-[#ebf3fc] text-[#0056d2] text-[9.5px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider mb-1.5">
                    {selectedCourse.category}
                  </span>
                )}

                {/* Course title at the top */}
                <h3 className="font-semibold text-slate-800 text-sm leading-snug pr-7 mb-2">
                  {selectedCourse.title}
                </h3>

                {/* Instructor line with small circle image */}
                {selectedCourse.instructorName && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11.5px] font-medium text-slate-500">
                    <span>By</span>
                    {selectedCourse.thumbnail && (
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-white flex items-center justify-center">
                        <img
                          src={selectedCourse.thumbnail}
                          alt={selectedCourse.instructorName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-[#0056d2] font-semibold">{selectedCourse.instructorName}</span>
                  </div>
                )}

                {/* Hours & Price details */}
                <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-100/50">
                  <span className="text-[11px] font-normal text-slate-500">
                    {selectedCourse.hours || "Learn at your own pace"}
                  </span>
                  
                  <div className="flex items-baseline gap-1.5">
                    {selectedCourse.price ? (
                      <>
                        <span className="font-semibold text-slate-800 text-sm">
                          ₹{selectedCourse.price}
                        </span>
                        {selectedCourse.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{selectedCourse.originalPrice}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="font-semibold text-emerald-600 text-xs">Included in All Access</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Description */}
              <div className="flex flex-col gap-1.5">
                <h4 className="text-[11px] font-semibold text-slate-800 uppercase tracking-wider">
                  Course Description & Details
                </h4>
                <p className="text-[12.5px] text-slate-600 leading-relaxed font-normal bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {getCleanDescription(selectedCourse.instructorBio || selectedCourse.level)}
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {checkoutStatus !== "success" && selectedCourse && cartCount > 0 && (
          <div className="p-5 border-t border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Amount</span>
              <span className="text-lg font-bold text-slate-800">
                ₹{selectedCourse.price || "Free"}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutStatus === "loading"}
              className="w-full bg-[#0056d2] hover:bg-[#00419e] disabled:bg-slate-350 text-white font-semibold py-3 px-5 rounded-lg shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase tracking-wide"
            >
              {checkoutStatus === "loading" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processing Checkout...
                </>
              ) : (
                "Buy NOW"
              )}
            </button>
            
            <p className="text-[10px] text-slate-400 text-center mt-2.5">
              By completing purchase, you agree to our Terms of Service & Privacy Policy.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

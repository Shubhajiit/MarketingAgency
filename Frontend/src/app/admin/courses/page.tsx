'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { coursesApi } from '@/lib/api/courses';
import { Course } from '@/components/common/CoursesCardsUI';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  Search,
  BookOpen,
  Eye,
  Settings,
  Upload
} from 'lucide-react';

interface CourseFormData {
  title: string;
  instructorName: string;
  category: 'popular' | 'pro-specialist' | 'short' | 'advanced';
  tag: string;
  hours: string;
  price: number;
  originalPrice: number;
  discount: string;
  bgGradient: string;
  circlesColor: string;
  mentorPicture: string;
  instructorImage: string;
  isGraphicOnly: boolean;
  graphicType: 'ai' | 'seo' | 'ppc' | 'strategy' | '';
  primaryCtaText: 'Download Brochure' | 'View Course';
  secondaryCtaText: 'View Course' | 'Buy Now';
  isActive: boolean;

  // Metadata configuration fields
  metaType: string;
  metaTypeSubtitle: string;
  metaRating: string;
  metaReviewsCount: string;
  metaLevel: string;
  metaLevelSubtitle: string;
  metaDuration: string;
  metaDurationSubtitle: string;
  metaHandsOn: string;
  metaHandsOnSubtitle: string;
}

const defaultFormData: CourseFormData = {
  title: '',
  instructorName: '',
  category: 'popular',
  tag: '',
  hours: '',
  price: 0,
  originalPrice: 0,
  discount: '0%',
  bgGradient: 'from-[#6366f1] to-[#4f46e5]',
  circlesColor: '',
  mentorPicture: '',
  instructorImage: '',
  isGraphicOnly: false,
  graphicType: '',
  primaryCtaText: 'Download Brochure',
  secondaryCtaText: 'View Course',
  isActive: true,

  // Default metadata configurations
  metaType: 'Professional Certification',
  metaTypeSubtitle: 'Learn, practice, and apply job-ready skills with expert guidance',
  metaRating: '4.8',
  metaReviewsCount: '3,150',
  metaLevel: 'Intermediate level',
  metaLevelSubtitle: 'Recommended experience',
  metaDuration: '23',
  metaDurationSubtitle: 'Learn at your own pace',
  metaHandsOn: 'Hands-on learning',
  metaHandsOnSubtitle: 'Learn more',
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Manage mount and transition classes for slide-over drawer
  useEffect(() => {
    if (showModal) {
      setMounted(true);
      const timer = setTimeout(() => {
        setVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  // Fetch all courses (including inactive)
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await coursesApi.list({ all: true });
      setCourses(res?.data?.courses || []);
    } catch {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreate = () => {
    setEditingCourse(null);
    setFormData(defaultFormData);
    setShowModal(true);
    setError('');
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const res = await coursesApi.uploadImage(file);
      if (res.success && res.url) {
        updateField('mentorPicture', res.url);
        updateField('instructorImage', res.url);
      } else {
        setError('Upload failed: Invalid response from server');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      instructorName: course.instructorName || '',
      category: course.category || 'popular',
      tag: course.tag || '',
      hours: course.hours || '',
      price: course.price || 0,
      originalPrice: course.originalPrice || 0,
      discount: course.discount || '0%',
      bgGradient: course.bgGradient || 'from-[#6366f1] to-[#4f46e5]',
      circlesColor: course.circlesColor || '',
      mentorPicture: course.mentorPicture || '',
      instructorImage: course.instructorImage || '',
      isGraphicOnly: !!course.isGraphicOnly,
      graphicType: course.graphicType || '',
      primaryCtaText: course.primaryCtaText || 'Download Brochure',
      secondaryCtaText: course.secondaryCtaText || 'View Course',
      isActive: course.isActive !== false,

      // Metadata properties
      metaType: course.metaType || 'Professional Certification',
      metaTypeSubtitle: course.metaTypeSubtitle || 'Learn, practice, and apply job-ready skills with expert guidance',
      metaRating: course.metaRating || '4.8',
      metaReviewsCount: course.metaReviewsCount || '3,150',
      metaLevel: course.metaLevel || 'Intermediate level',
      metaLevelSubtitle: course.metaLevelSubtitle || 'Recommended experience',
      metaDuration: course.metaDuration || '23',
      metaDurationSubtitle: course.metaDurationSubtitle || 'Learn at your own pace',
      metaHandsOn: course.metaHandsOn || 'Hands-on learning',
      metaHandsOnSubtitle: course.metaHandsOnSubtitle || 'Learn more',
    });
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload: Partial<Course> = {
        title: formData.title.trim(),
        instructorName: formData.instructorName.trim(),
        category: formData.category,
        tag: formData.tag.trim(),
        hours: formData.hours.trim(),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discount: formData.discount.trim(),
        bgGradient: formData.bgGradient.trim(),
        circlesColor: formData.circlesColor.trim(),
        mentorPicture: formData.mentorPicture.trim(),
        instructorImage: formData.instructorImage.trim() || formData.mentorPicture.trim(),
        isGraphicOnly: formData.isGraphicOnly,
        graphicType: formData.graphicType || undefined,
        primaryCtaText: formData.primaryCtaText,
        secondaryCtaText: formData.secondaryCtaText,
        isActive: formData.isActive,

        // Metadata properties
        metaType: (formData.metaType || '').trim(),
        metaTypeSubtitle: (formData.metaTypeSubtitle || '').trim(),
        metaRating: (formData.metaRating || '').trim(),
        metaReviewsCount: (formData.metaReviewsCount || '').trim(),
        metaLevel: (formData.metaLevel || '').trim(),
        metaLevelSubtitle: (formData.metaLevelSubtitle || '').trim(),
        metaDuration: (formData.metaDuration || '').trim(),
        metaDurationSubtitle: (formData.metaDurationSubtitle || '').trim(),
        metaHandsOn: (formData.metaHandsOn || '').trim(),
        metaHandsOnSubtitle: (formData.metaHandsOnSubtitle || '').trim(),
      };

      if (editingCourse) {
        await coursesApi.update((editingCourse as any)._id || editingCourse.id, payload);
      } else {
        await coursesApi.create(payload);
      }

      setShowModal(false);
      fetchCourses();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save course';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await coursesApi.delete(id);
      setDeleteConfirm(null);
      fetchCourses();
    } catch {
      setError('Failed to delete course');
    }
  };

  const updateField = (field: keyof CourseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Certification Course Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage certification courses displayed in the main website in real-time.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-[#6366f1] hover:bg-[#5558e6] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-[#6366f1]/20 hover:shadow-md hover:shadow-[#6366f1]/30 active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus size={16} />
          Create Course
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search certification courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all placeholder-gray-400"
        />
      </div>

      {/* Table List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 size={28} className="animate-spin text-[#6366f1]" />
            <span className="text-sm text-gray-500 font-medium">Loading courses...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <BookOpen size={24} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {searchQuery ? 'No courses found matching your search' : 'No courses yet. Create one!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tag</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (INR)</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCourses.map((c) => {
                  const cid = (c as any)._id || c.id;
                  return (
                    <tr key={cid} className="hover:bg-[#f8f8ff] transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {c.mentorPicture || c.instructorImage ? (
                            <img src={c.mentorPicture || c.instructorImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />
                          ) : (
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${c.bgGradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                              {c.title.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{c.title}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{cid}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 capitalize">{c.category}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        <span className="text-[10px] font-bold text-[#6366f1] bg-[#efeefc] px-2 py-0.5 rounded tracking-wide uppercase">
                          {c.tag || 'DMI'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{c.hours}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        ₹{c.price} <span className="text-xs text-gray-400 line-through">₹{c.originalPrice}</span>
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.isActive !== false ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                          {c.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(c)}
                            className="p-2 rounded-lg text-gray-400 hover:text-[#6366f1] hover:bg-[#efeefc] transition-all"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(cid)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Deactivate Course?</h3>
            <p className="text-sm text-gray-500 mb-6">This will hide the course from the public certication courses list. You can reactivate it later.</p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Drawer */}
      {mounted && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Backdrop Overlay with smooth transition */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setShowModal(false)}
          />

          {/* Slide-out Panel (Full Screen) */}
          <div
            className={`relative bg-white w-screen h-screen shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-in-out ${
              visible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200 bg-white shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {editingCourse ? 'Edit Course' : 'Create Certification Course'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Configure the card design and metadata of your course.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden bg-white">
              {/* Form Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-7 md:p-10 space-y-6 w-full">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium flex items-center gap-2">
                    <AlertTriangle size={14} />
                    {error}
                  </div>
                )}

                <div className="pb-2 border-b border-gray-100 mb-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Course Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="e.g. Social Media Marketing Course"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Instructor Name</label>
                    <input
                      type="text"
                      value={formData.instructorName || ''}
                      onChange={(e) => updateField('instructorName', e.target.value)}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</label>
                    <select
                      value={formData.category || 'popular'}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all"
                    >
                      <option value="popular">Popular Courses</option>
                      <option value="pro-specialist">Pro & Specialist Courses</option>
                      <option value="short">Short Courses</option>
                      <option value="advanced">Advanced Courses</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount Text</label>
                    <input
                      type="text"
                      value={formData.discount || ''}
                      onChange={(e) => updateField('discount', e.target.value)}
                      placeholder="e.g. 30%"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Price (INR)</label>
                    <input
                      type="number"
                      value={formData.price ?? 0}
                      onChange={(e) => updateField('price', Number(e.target.value))}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Original Price (INR)</label>
                    <input
                      type="number"
                      value={formData.originalPrice ?? 0}
                      onChange={(e) => updateField('originalPrice', Number(e.target.value))}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Mentor picture</label>
                    
                    {/* Compact File Uploader Box */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                      {formData.mentorPicture || formData.instructorImage ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 group/preview bg-white shadow-xs">
                          <img
                            src={formData.mentorPicture || formData.instructorImage}
                            alt="Mentor picture preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateField('mentorPicture', '');
                              updateField('instructorImage', '');
                            }}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-200/50 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0 select-none">
                          <Upload size={18} />
                        </div>
                      )}

                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-3">
                          <label className="relative flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer shadow-xs active:scale-[0.98] transition-all">
                            {uploading ? (
                              <>
                                <Loader2 size={12} className="animate-spin text-gray-500" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={12} className="text-gray-500" />
                                <span>Upload Image</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploading}
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs text-gray-400 font-medium">PNG, JPG, SVG up to 5MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata Configuration Section */}
                <div className="pb-2 border-b border-gray-100 mb-2 mt-8">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Course Card & Page Metadata</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Column 1: Type & Subtitle */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Header / Certification Type</label>
                    <input
                      type="text"
                      value={formData.metaType || ''}
                      onChange={(e) => updateField('metaType', e.target.value)}
                      placeholder="e.g. Professional Certification"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-1 lg:col-span-3">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Certification Subtitle</label>
                    <input
                      type="text"
                      value={formData.metaTypeSubtitle || ''}
                      onChange={(e) => updateField('metaTypeSubtitle', e.target.value)}
                      placeholder="e.g. Learn, practice, and apply job-ready skills with expert guidance"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  {/* Column 2: Rating & Reviews */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</label>
                    <input
                      type="text"
                      value={formData.metaRating || ''}
                      onChange={(e) => updateField('metaRating', e.target.value)}
                      placeholder="e.g. 4.8"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Reviews Count</label>
                    <input
                      type="text"
                      value={formData.metaReviewsCount || ''}
                      onChange={(e) => updateField('metaReviewsCount', e.target.value)}
                      placeholder="e.g. 3,150"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  {/* Column 3: Level */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Level</label>
                    <input
                      type="text"
                      value={formData.metaLevel || ''}
                      onChange={(e) => updateField('metaLevel', e.target.value)}
                      placeholder="e.g. Intermediate level"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Level Subtitle</label>
                    <input
                      type="text"
                      value={formData.metaLevelSubtitle || ''}
                      onChange={(e) => updateField('metaLevelSubtitle', e.target.value)}
                      placeholder="e.g. Recommended experience"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  {/* Column 4: Duration */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration / Hours</label>
                    <input
                      type="text"
                      value={formData.metaDuration || ''}
                      onChange={(e) => updateField('metaDuration', e.target.value)}
                      placeholder="e.g. 23"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration Subtitle</label>
                    <input
                      type="text"
                      value={formData.metaDurationSubtitle || ''}
                      onChange={(e) => updateField('metaDurationSubtitle', e.target.value)}
                      placeholder="e.g. Learn at your own pace"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  {/* Column 5: Hands-on */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Hands-on Learning Title</label>
                    <input
                      type="text"
                      value={formData.metaHandsOn || ''}
                      onChange={(e) => updateField('metaHandsOn', e.target.value)}
                      placeholder="e.g. Hands-on learning"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Hands-on Link Text</label>
                    <input
                      type="text"
                      value={formData.metaHandsOnSubtitle || ''}
                      onChange={(e) => updateField('metaHandsOnSubtitle', e.target.value)}
                      placeholder="e.g. Learn more"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="px-7 py-5 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

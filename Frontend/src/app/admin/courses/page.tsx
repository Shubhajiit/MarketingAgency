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
  category: 'popular' | 'pro-specialist' | 'short' | 'advanced';
  tag: string;
  hours: string;
  price: number;
  originalPrice: number;
  discount: string;
  bgGradient: string;
  circlesColor: string;
  thumbnail: string;
  instructorImage: string;
  isGraphicOnly: boolean;
  graphicType: 'ai' | 'seo' | 'ppc' | 'strategy' | '';
  primaryCtaText: 'Download Brochure' | 'View Course';
  secondaryCtaText: 'View Course' | 'Buy Now';
  isActive: boolean;
}

const defaultFormData: CourseFormData = {
  title: '',
  category: 'popular',
  tag: '',
  hours: '',
  price: 0,
  originalPrice: 0,
  discount: '0%',
  bgGradient: 'from-[#6366f1] to-[#4f46e5]',
  circlesColor: '',
  thumbnail: '',
  instructorImage: '',
  isGraphicOnly: false,
  graphicType: '',
  primaryCtaText: 'Download Brochure',
  secondaryCtaText: 'View Course',
  isActive: true,
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
        updateField('thumbnail', res.url);
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
      category: course.category || 'popular',
      tag: course.tag || '',
      hours: course.hours || '',
      price: course.price || 0,
      originalPrice: course.originalPrice || 0,
      discount: course.discount || '0%',
      bgGradient: course.bgGradient || 'from-[#6366f1] to-[#4f46e5]',
      circlesColor: course.circlesColor || '',
      thumbnail: course.thumbnail || '',
      instructorImage: course.instructorImage || '',
      isGraphicOnly: !!course.isGraphicOnly,
      graphicType: course.graphicType || '',
      primaryCtaText: course.primaryCtaText || 'Download Brochure',
      secondaryCtaText: course.secondaryCtaText || 'View Course',
      isActive: course.isActive !== false,
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
        category: formData.category,
        tag: formData.tag.trim(),
        hours: formData.hours.trim(),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discount: formData.discount.trim(),
        bgGradient: formData.bgGradient.trim(),
        circlesColor: formData.circlesColor.trim(),
        thumbnail: formData.thumbnail.trim(),
        instructorImage: formData.instructorImage.trim() || formData.thumbnail.trim(),
        isGraphicOnly: formData.isGraphicOnly,
        graphicType: formData.graphicType || undefined,
        primaryCtaText: formData.primaryCtaText,
        secondaryCtaText: formData.secondaryCtaText,
        isActive: formData.isActive,
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
                          {c.thumbnail || c.instructorImage ? (
                            <img src={c.thumbnail || c.instructorImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#f8f9fc] rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 my-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200 bg-white rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  {editingCourse ? 'Edit Course' : 'Create Certification Course'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure the card design and metadata of your course.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-7 space-y-4 max-h-[70vh] overflow-y-auto bg-white rounded-b-2xl">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium flex items-center gap-2">
                  <AlertTriangle size={14} />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g. Social Media Marketing Course"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
                  >
                    <option value="popular">Popular Courses</option>
                    <option value="pro-specialist">Pro & Specialist Courses</option>
                    <option value="short">Short Courses</option>
                    <option value="advanced">Advanced Courses</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Tag / Badge</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => updateField('tag', e.target.value)}
                    placeholder="e.g. DMI PRO"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration / Format</label>
                  <input
                    type="text"
                    value={formData.hours}
                    onChange={(e) => updateField('hours', e.target.value)}
                    placeholder="e.g. 27 Hours • Self-Paced"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Price (INR)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateField('price', Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Original Price (INR)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => updateField('originalPrice', Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount Text</label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => updateField('discount', e.target.value)}
                    placeholder="e.g. 30%"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Background Gradient CSS</label>
                  <input
                    type="text"
                    value={formData.bgGradient}
                    onChange={(e) => updateField('bgGradient', e.target.value)}
                    placeholder="e.g. from-[#e52d6a] to-[#d81b60]"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Circles Accent Color</label>
                  <input
                    type="text"
                    value={formData.circlesColor}
                    onChange={(e) => updateField('circlesColor', e.target.value)}
                    placeholder="e.g. #00c58d"
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Thumbnail / Image</label>
                
                {/* File Uploader Box */}
                <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  {formData.thumbnail || formData.instructorImage ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0 group/preview bg-white">
                      <img
                        src={formData.thumbnail || formData.instructorImage}
                        alt="Course preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          updateField('thumbnail', '');
                          updateField('instructorImage', '');
                        }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-200/50 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0 select-none">
                      <Upload size={20} />
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-3">
                      <label className="relative flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer shadow-xs active:scale-[0.98] transition-all">
                        {uploading ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-gray-500" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={14} className="text-gray-500" />
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
                      <span className="text-[10px] text-gray-400 font-medium">PNG, JPG, SVG up to 5MB</span>
                    </div>

                    <input
                      type="text"
                      value={formData.thumbnail || formData.instructorImage}
                      onChange={(e) => {
                        updateField('thumbnail', e.target.value);
                        updateField('instructorImage', e.target.value);
                      }}
                      placeholder="Or paste external image URL here..."
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isGraphicOnly"
                    checked={formData.isGraphicOnly}
                    onChange={(e) => updateField('isGraphicOnly', e.target.checked)}
                    className="w-4 h-4 text-[#6366f1] focus:ring-[#6366f1] border-gray-300 rounded"
                  />
                  <label htmlFor="isGraphicOnly" className="text-xs font-bold text-gray-700">Display Minimalist Graphic Card Thumbnail (No Instructor Portrait)</label>
                </div>

                {formData.isGraphicOnly && (
                  <div className="flex flex-col gap-1.5 pl-6">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Graphic Thumbnail Type</label>
                    <select
                      value={formData.graphicType}
                      onChange={(e) => updateField('graphicType', e.target.value)}
                      className="w-full px-3.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                    >
                      <option value="">None / Custom</option>
                      <option value="ai">AI Graphic Theme</option>
                      <option value="seo">SEO Checkered Grid Theme</option>
                      <option value="ppc">PPC Graphic Theme</option>
                      <option value="strategy">Digital Strategy Theme</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Primary Button CTA</label>
                  <select
                    value={formData.primaryCtaText}
                    onChange={(e) => updateField('primaryCtaText', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="Download Brochure">Download Brochure</option>
                    <option value="View Course">View Course</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Secondary Link CTA</label>
                  <select
                    value={formData.secondaryCtaText}
                    onChange={(e) => updateField('secondaryCtaText', e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="View Course">View Course</option>
                    <option value="Buy Now">Buy Now</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => updateField('isActive', e.target.checked)}
                  className="w-4 h-4 text-[#6366f1] focus:ring-[#6366f1] border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-gray-700">Set Course as Active (Display on Main Website)</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
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

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { coursesApi, CourseVideo } from '@/lib/api/courses';
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
  category: string;
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
  primaryCtaText: string;
  secondaryCtaText: string;
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

  // Dynamic About Section lists
  whatYouWillLearn: string[];
  skillsYouWillPractice: string[];
  toolsYouWillUse: string[];

  // Course Details
  description: string;
  learnStepByStep: string[];
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
  primaryCtaText: 'Buy Now',
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

  // Dynamic lists
  whatYouWillLearn: [],
  skillsYouWillPractice: [],
  toolsYouWillUse: [],

  // Course Details
  description: '',
  learnStepByStep: [],
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

  // Compute unique categories from all courses plus defaults
  const existingCategories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
  const defaultCats = ['popular', 'pro-specialist', 'short', 'advanced'];
  const uniqueCats = Array.from(new Set([...defaultCats, ...existingCategories]));

  // Course videos states
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Dynamic About section input states
  const [newLearnPoint, setNewLearnPoint] = useState('');
  const [newSkillPoint, setNewSkillPoint] = useState('');
  const [newToolPoint, setNewToolPoint] = useState('');
  const [newStepPoint, setNewStepPoint] = useState('');

  // Category custom input states
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [customCategoryVal, setCustomCategoryVal] = useState('');

  const handleAddStepPoint = () => {
    if (!newStepPoint.trim()) return;
    setFormData(prev => ({
      ...prev,
      learnStepByStep: [...prev.learnStepByStep, newStepPoint.trim()]
    }));
    setNewStepPoint('');
  };

  const handleRemoveStepPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learnStepByStep: prev.learnStepByStep.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddLearnPoint = () => {
    if (!newLearnPoint.trim()) return;
    setFormData(prev => ({
      ...prev,
      whatYouWillLearn: [...prev.whatYouWillLearn, newLearnPoint.trim()]
    }));
    setNewLearnPoint('');
  };

  const handleRemoveLearnPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      whatYouWillLearn: prev.whatYouWillLearn.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddSkillPoint = () => {
    if (!newSkillPoint.trim()) return;
    setFormData(prev => ({
      ...prev,
      skillsYouWillPractice: [...prev.skillsYouWillPractice, newSkillPoint.trim()]
    }));
    setNewSkillPoint('');
  };

  const handleRemoveSkillPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skillsYouWillPractice: prev.skillsYouWillPractice.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddToolPoint = () => {
    if (!newToolPoint.trim()) return;
    setFormData(prev => ({
      ...prev,
      toolsYouWillUse: [...prev.toolsYouWillUse, newToolPoint.trim()]
    }));
    setNewToolPoint('');
  };

  const handleRemoveToolPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      toolsYouWillUse: prev.toolsYouWillUse.filter((_, idx) => idx !== index)
    }));
  };
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

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
    setVideos([]);
    setVideoTitle('');
    setVideoDuration('');
    setVideoDescription('');
    setVideoFile(null);
    setUploadProgress(0);
    setUploadError('');
    setNewLearnPoint('');
    setNewSkillPoint('');
    setNewToolPoint('');
    setNewStepPoint('');
    setShowCustomCategoryInput(false);
    setCustomCategoryVal('');
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

  const handleUploadVideo = async () => {
    if (!editingCourse || !videoFile || !videoTitle.trim()) return;

    const courseId = (editingCourse as any)._id || editingCourse.id;
    setVideoUploading(true);
    setUploadError('');
    setUploadProgress(0);

    try {
      const res = await coursesApi.uploadVideo(courseId, videoFile, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      if (res.success && res.s3Key) {
        const newVideo: CourseVideo = {
          _id: Math.random().toString(36).substring(7), // temporary local id
          title: videoTitle.trim(),
          s3Key: res.s3Key,
          duration: videoDuration.trim(),
          description: videoDescription.trim(),
          order: videos.length,
          url: ''
        };

        const updatedVideos = [...videos, newVideo];
        
        // Strip temporary _id from new video before saving to DB
        const videosPayload = updatedVideos.map((v) => {
          if (v._id && v._id.length !== 24) {
            const { _id, ...rest } = v;
            return rest;
          }
          return v;
        });

        // Persist immediately in DB
        const saveRes = await coursesApi.update(courseId, { videos: videosPayload });
        if (saveRes.success) {
          setVideos((saveRes.data.course as any).videos || []);
          // Clear upload fields
          setVideoTitle('');
          setVideoDuration('');
          setVideoDescription('');
          setVideoFile(null);
          setUploadProgress(0);
          // Refresh list
          fetchCourses();
        } else {
          setUploadError('Video uploaded, but failed to save metadata to course.');
        }
      } else {
        setUploadError('Failed to upload video to S3.');
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.response?.data?.message || 'Failed to upload video');
    } finally {
      setVideoUploading(false);
    }
  };

  const handleRemoveVideo = async (index: number) => {
    if (!editingCourse) return;
    if (!confirm('Are you sure you want to remove this video?')) return;

    const courseId = (editingCourse as any)._id || editingCourse.id;
    const updatedVideos = videos.filter((_, idx) => idx !== index);

    try {
      const res = await coursesApi.update(courseId, { videos: updatedVideos });
      if (res.success) {
        setVideos((res.data.course as any).videos || []);
        fetchCourses();
      } else {
        setError('Failed to update course videos');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to remove video');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setVideos((course as any).videos || []);
    setVideoTitle('');
    setVideoDuration('');
    setVideoDescription('');
    setVideoFile(null);
    setUploadProgress(0);
    setUploadError('');
    setNewLearnPoint('');
    setNewSkillPoint('');
    setNewToolPoint('');
    setNewStepPoint('');
    setShowCustomCategoryInput(false);
    setCustomCategoryVal('');
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
      primaryCtaText: course.primaryCtaText || 'Buy Now',
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

      // Dynamic About lists
      whatYouWillLearn: course.whatYouWillLearn || [],
      skillsYouWillPractice: course.skillsYouWillPractice || [],
      toolsYouWillUse: course.toolsYouWillUse || [],

      // Course Details
      description: course.description || '',
      learnStepByStep: (course as any).learnStepByStep || [],
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

        // Dynamic lists
        whatYouWillLearn: formData.whatYouWillLearn,
        skillsYouWillPractice: formData.skillsYouWillPractice,
        toolsYouWillUse: formData.toolsYouWillUse,

        // Course Details
        description: (formData.description || '').trim(),
        learnStepByStep: formData.learnStepByStep,
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
          <div className="w-full">
            <div className="flex border-b border-gray-100 bg-gray-50/60 px-5 py-3.5 gap-4">
              <div className="w-1/4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-1/6 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-1/6 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-1/6 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-1/6 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center border-b border-gray-50 px-5 py-4 gap-4">
                <div className="w-1/4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse shrink-0"></div>
                  <div className="flex flex-col gap-2 w-full max-w-[150px]">
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-2/3 h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-1/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/6 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/6 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
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

                {/* Course Videos (AWS S3) Section */}
                <div className="pb-2 border-b border-gray-100 mb-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Upload Course Video</h3>
                </div>

                {!editingCourse ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-800">Video Upload is Unavailable for New Courses</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        Please save and create the course first. Once the course is created, you can edit it to upload and stream videos.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* List of existing videos */}
                    {videos.length > 0 ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Uploaded Videos ({videos.length})</h4>
                        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-2">
                          {videos.map((vid, idx) => (
                            <div key={vid._id || idx} className="py-2.5 flex items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                  {idx + 1}. {vid.title}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono truncate">{vid.s3Key}</p>
                                {vid.duration && (
                                  <span className="text-[10px] bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded font-medium mt-1 inline-block">
                                    Duration: {vid.duration}
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveVideo(idx)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                title="Remove Video"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-400">
                        <BookOpen size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No videos uploaded yet</p>
                      </div>
                    )}

                    {/* Upload new video form */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-white shadow-xs">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Upload New Video</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Video Title *</label>
                          <input
                            type="text"
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            placeholder="e.g. Lesson 1: Introduction"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Duration (Optional)</label>
                          <input
                            type="text"
                            value={videoDuration}
                            onChange={(e) => setVideoDuration(e.target.value)}
                            placeholder="e.g. 12:34"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
                        <textarea
                          value={videoDescription}
                          onChange={(e) => setVideoDescription(e.target.value)}
                          placeholder="Brief description of the lesson content..."
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white resize-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Video File *</label>
                        <div className="flex flex-col sm:flex-row gap-4 items-center p-3.5 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex-1 w-full">
                            <div className="flex items-center gap-3">
                              <label className="relative flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer shadow-xs active:scale-[0.98] transition-all">
                                <Upload size={12} className="text-gray-500" />
                                <span>{videoFile ? 'Change Video' : 'Select Video File'}</span>
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setVideoFile(file);
                                      // If title is empty, prefill with filename without extension
                                      if (!videoTitle) {
                                        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                                        setVideoTitle(nameWithoutExt);
                                      }
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
                                {videoFile ? videoFile.name : 'No file selected (MP4, WebM, etc. up to 500MB)'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {videoUploading && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-slate-600">
                            <span>Uploading to AWS S3...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {uploadError && (
                        <div className="text-xs text-red-600 font-semibold bg-red-50 border border-red-100 rounded-lg p-2 flex items-center gap-1.5">
                          <AlertTriangle size={12} />
                          {uploadError}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleUploadVideo}
                        disabled={videoUploading || !videoFile || !videoTitle.trim()}
                        className="w-full py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {videoUploading ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Uploading video...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={12} />
                            <span>Upload & Add Video to Course</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="h-6" />

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

                  {showCustomCategoryInput ? (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">New Category Name</label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomCategoryInput(false);
                            updateField('category', uniqueCats[0] || 'popular');
                          }}
                          className="text-[10px] font-bold text-[#6366f1] hover:underline cursor-pointer"
                        >
                          Choose Existing
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={customCategoryVal}
                        onChange={(e) => {
                          setCustomCategoryVal(e.target.value);
                          updateField('category', e.target.value);
                        }}
                        placeholder="e.g. bootcamps, marketing-101"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</label>
                      <select
                        value={formData.category || 'popular'}
                        onChange={(e) => {
                          if (e.target.value === '__new__') {
                            setShowCustomCategoryInput(true);
                            setCustomCategoryVal('');
                            updateField('category', '');
                          } else {
                            updateField('category', e.target.value);
                          }
                        }}
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all"
                      >
                        {uniqueCats.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat === 'popular' ? 'Popular Courses' :
                             cat === 'pro-specialist' ? 'Pro & Specialist Courses' :
                             cat === 'short' ? 'Short Courses' :
                             cat === 'advanced' ? 'Advanced Courses' : cat}
                          </option>
                        ))}
                        <option value="__new__">➕ Add New Category...</option>
                      </select>
                    </div>
                  )}

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

                {/* Course About Section (Dynamic Lists) */}
                <div className="pb-2 border-b border-gray-100 mb-2 mt-8">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Course "About" Details</h3>
                </div>

                <div className="space-y-6">
                  {/* 1. What You'll Learn Section */}
                  <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-5 md:p-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">What You'll Learn Points</h4>
                      <p className="text-xs text-slate-500 mt-1">Add key topics or outcomes that students will achieve in this course.</p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newLearnPoint}
                        onChange={(e) => setNewLearnPoint(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddLearnPoint();
                          }
                        }}
                        placeholder="e.g. Define your target audience and position your brand strategy..."
                        className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddLearnPoint}
                        className="px-4 py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-1 shrink-0 active:scale-[0.98]"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>

                    {formData.whatYouWillLearn.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mt-3">
                        {formData.whatYouWillLearn.map((point, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-100 transition-all shadow-xs group">
                            <div className="flex items-start gap-2.5">
                              <span className="text-emerald-500 font-bold mt-0.5 text-sm">✓</span>
                              <span className="text-sm text-slate-700 leading-relaxed font-medium">{point}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveLearnPoint(idx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                              title="Delete Point"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No learn points added yet. Type a point and click Add.</p>
                    )}
                  </div>

                  {/* 2. Skills You'll Practice Section */}
                  <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-5 md:p-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Skills You'll Practice</h4>
                      <p className="text-xs text-slate-500 mt-1">Add specific technical skills or methodologies practiced in this course.</p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkillPoint}
                        onChange={(e) => setNewSkillPoint(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkillPoint();
                          }
                        }}
                        placeholder="e.g. Social Strategy, Prompt Engineering..."
                        className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkillPoint}
                        className="px-4 py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-1 shrink-0 active:scale-[0.98]"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>

                    {formData.skillsYouWillPractice.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.skillsYouWillPractice.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#efeefc] text-[#6366f1] text-xs font-bold rounded-lg border border-indigo-100 hover:border-indigo-250 transition-all select-none">
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkillPoint(idx)}
                              className="p-0.5 rounded-md hover:bg-[#dbdaf9] text-[#6366f1] hover:text-red-500 transition-colors"
                              title="Delete Skill"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No skills added yet. Type a skill and click Add.</p>
                    )}
                  </div>

                  {/* 3. Tools You'll Use Section */}
                  <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-5 md:p-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Tools You'll Use</h4>
                      <p className="text-xs text-slate-500 mt-1">Add software platforms, software products, frameworks, or APIs taught in this course.</p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newToolPoint}
                        onChange={(e) => setNewToolPoint(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddToolPoint();
                          }
                        }}
                        placeholder="e.g. Meta Ads Manager, Hootsuite, ChatGPT..."
                        className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddToolPoint}
                        className="px-4 py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-1 shrink-0 active:scale-[0.98]"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>

                    {formData.toolsYouWillUse.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.toolsYouWillUse.map((tool, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 hover:border-slate-350 transition-all select-none">
                            <span>{tool}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveToolPoint(idx)}
                              className="p-0.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors"
                              title="Delete Tool"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No tools added yet. Type a tool and click Add.</p>
                    )}
                  </div>
                </div>

                {/* Course Details Section (Description & Step-by-Step) */}
                <div className="pb-2 border-b border-gray-100 mb-2 mt-8">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Course Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="e.g. In this project, you will learn the foundation of data analysis with Microsoft Excel..."
                      rows={4}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white resize-y"
                    />
                  </div>

                  <div className="bg-slate-50/60 border border-slate-200 rounded-xl p-5 md:p-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Learn step-by-step</h4>
                      <p className="text-xs text-slate-500 mt-1">Add step-by-step guide points for what the student will learn.</p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newStepPoint}
                        onChange={(e) => setNewStepPoint(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddStepPoint();
                          }
                        }}
                        placeholder="e.g. Upload a document using the free online version..."
                        className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddStepPoint}
                        className="px-4 py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-1 shrink-0 active:scale-[0.98]"
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>

                    {formData.learnStepByStep && formData.learnStepByStep.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mt-3">
                        {formData.learnStepByStep.map((point, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-100 transition-all shadow-xs group">
                            <div className="flex items-start gap-2.5">
                              <span className="text-[#0056d2] font-bold mt-0.5 text-sm">{idx + 1}.</span>
                              <span className="text-sm text-slate-700 leading-relaxed font-medium">{point}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveStepPoint(idx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                              title="Delete Step"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No step-by-step points added yet. Type a point and click Add.</p>
                    )}
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

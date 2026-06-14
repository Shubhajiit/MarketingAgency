'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { workshopApi, Workshop, WorkshopWhatYouWillLearnStep, WorkshopCourseOutcome, WorkshopRegistration } from '@/lib/api/workshops';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Search,
} from 'lucide-react';

interface WorkshopFormData {
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  price: string;
  originalPrice: string;
  priceCaption: string;
  bonusDeadlineText: string;
  heroPoints: string[];
  workshopDates: string[];
  rating1Value: string;
  rating1Count: string;
  rating1Platform: string;
  rating2Value: string;
  rating2Count: string;
  rating2Platform: string;
  instructor: string;
  instructorImage: string;
  instructorDescription: string;
  learningOutcomes: string[];
  whatYouWillLearn: WorkshopWhatYouWillLearnStep[];
  courseOutcomes: WorkshopCourseOutcome[];
}

const defaultFormData: WorkshopFormData = {
  title: '',
  subtitle: '',
  description: '',
  thumbnail: '',
  price: '0',
  originalPrice: '0',
  priceCaption: '',
  bonusDeadlineText: '',
  heroPoints: ['', '', '', ''],
  workshopDates: [],
  rating1Value: '4.5/5',
  rating1Count: '(725)',
  rating1Platform: 'Trustpilot',
  rating2Value: '4.07/5',
  rating2Count: '(88)',
  rating2Platform: 'Rating Facts',
  instructor: '',
  instructorImage: '',
  instructorDescription: '',
  learningOutcomes: [],
  whatYouWillLearn: [],
  courseOutcomes: [],
};

// ─── Collapsible Section Component ──────────────────────────
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50/80 hover:bg-gray-100/80 transition-colors text-left"
      >
        <span className="text-sm font-bold text-gray-800 tracking-tight">{title}</span>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>
      {isOpen && <div className="p-5 border-t border-gray-100">{children}</div>}
    </div>
  );
}

// ─── Input Component ────────────────────────────────────────
function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  className = '',
}: {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white placeholder-gray-400"
      />
    </div>
  );
}

function FormTextArea({
  label,
  value,
  onChange,
  placeholder = '',
  rows = 3,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white placeholder-gray-400 resize-none"
      />
    </div>
  );
}

function ImageUploadInput({
  label,
  value,
  onChange,
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large (max 5MB)');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const data = await workshopApi.uploadImage(file);
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setError('Upload failed');
      }
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white shadow-xs">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors cursor-pointer text-[10px] font-semibold"
              title="Remove"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-lg border border-dashed border-gray-305 flex items-center justify-center shrink-0 bg-gray-50 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="flex-1 flex flex-col gap-1">
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'Paste URL or select file...'}
              className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-white placeholder-gray-400"
            />
            <label className="px-4 py-2 bg-gray-950 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center transition-colors shadow-sm select-none border border-transparent whitespace-nowrap active:scale-[0.98]">
              {uploading ? 'Uploading...' : 'Browse'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {error && <span className="text-[10px] text-red-500 font-semibold">{error}</span>}
        </div>
      </div>
    </div>
  );
}

const extractDateRanges = (dates: string[]) => {
  if (!dates || dates.length === 0) return [];
  
  // Sort dates ascending
  const sortedDates = [...dates]
    .map(d => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());
  
  const ranges: { startDate: string; endDate: string }[] = [];
  if (sortedDates.length === 0) return ranges;
  
  let currentStart = sortedDates[0];
  let currentEnd = sortedDates[0];
  
  for (let i = 1; i < sortedDates.length; i++) {
    const d = sortedDates[i];
    // Check if consecutive (difference of exactly 1 day or similar, using 24h threshold)
    const diff = d.getTime() - currentEnd.getTime();
    const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentEnd = d;
    } else {
      ranges.push({
        startDate: currentStart.toISOString().split('T')[0],
        endDate: currentEnd.toISOString().split('T')[0]
      });
      currentStart = d;
      currentEnd = d;
    }
  }
  
  ranges.push({
    startDate: currentStart.toISOString().split('T')[0],
    endDate: currentEnd.toISOString().split('T')[0]
  });
  
  return ranges;
};

interface WorkshopsManagerProps {
  type: 'one-day' | 'three-days';
}

export default function WorkshopsManager({ type }: WorkshopsManagerProps) {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState<WorkshopFormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [dateRanges, setDateRanges] = useState<{ startDate: string; endDate: string }[]>([]);

  // Generate consecutive dates between start and end date (inclusive)
  const generateConsecutiveDates = (start: string, end: string) => {
    if (!start || !end) return [];
    const dates: string[] = [];
    const sDate = new Date(start);
    const eDate = new Date(end);
    if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) return [];
    if (sDate > eDate) return [];

    const current = new Date(sDate);
    while (current <= eDate) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'workshops' | 'registrations'>('workshops');
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const [regSearch, setRegSearch] = useState('');

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

  // Update workshopDates in formData when dateRanges changes (for three-days workshops)
  useEffect(() => {
    if (type === 'three-days') {
      const allDates: string[] = [];
      dateRanges.forEach((range) => {
        const generated = generateConsecutiveDates(range.startDate, range.endDate);
        allDates.push(...generated);
      });
      const uniqueDates = Array.from(new Set(allDates));
      updateField('workshopDates', uniqueDates);
    }
  }, [dateRanges, type]);

  // Fetch workshops
  const fetchWorkshops = useCallback(async () => {
    try {
      setLoading(true);
      const res = await workshopApi.list({ limit: 100, type });
      setWorkshops(res.data.workshops);
    } catch {
      setError('Failed to load workshops');
    } finally {
      setLoading(false);
    }
  }, [type]);

  // Fetch registrations
  const fetchRegistrations = useCallback(async () => {
    try {
      setRegLoading(true);
      const res = await workshopApi.getWorkshopRegistrations();
      // Filter registrations based on workshop type
      const filtered = res.data.registrations.filter(r => {
        const wType = r.workshopId?.type || (r as any).workshopType || 'one-day';
        return wType === type;
      });
      setRegistrations(filtered);
    } catch {
      // silently fail
    } finally {
      setRegLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchRegistrations();
    }
  }, [activeTab, fetchRegistrations]);

  // Open create modal
  const handleCreate = () => {
    setEditingWorkshop(null);
    setFormData(defaultFormData);
    setDateRanges([{ startDate: '', endDate: '' }]);
    setShowModal(true);
    setError('');
  };

  // Open edit modal
  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);

    const sortedDates = workshop.workshopDates && workshop.workshopDates.length > 0
      ? [...workshop.workshopDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      : [];
    const dateStrings = sortedDates.map(d => new Date(d).toISOString().split('T')[0]);
    const ranges = extractDateRanges(dateStrings);
    setDateRanges(ranges.length > 0 ? ranges : [{ startDate: '', endDate: '' }]);

    setFormData({
      title: workshop.title || '',
      subtitle: workshop.subtitle || '',
      description: workshop.description || '',
      thumbnail: workshop.thumbnail || '',
      price: String(workshop.price || 0),
      originalPrice: String(workshop.originalPrice || 0),
      priceCaption: workshop.priceCaption || '',
      bonusDeadlineText: workshop.bonusDeadlineText || '',
      heroPoints: workshop.heroPoints && workshop.heroPoints.length > 0
        ? [...workshop.heroPoints, '', '', '', ''].slice(0, 4)
        : ['', '', '', ''],
      workshopDates: (workshop as any).workshopDates
        ? (workshop as any).workshopDates.map((d: string) => new Date(d).toISOString().split('T')[0])
        : [],
      rating1Value: (workshop as any).rating1Value || '4.5/5',
      rating1Count: (workshop as any).rating1Count || '(725)',
      rating1Platform: (workshop as any).rating1Platform || 'Trustpilot',
      rating2Value: (workshop as any).rating2Value || '4.07/5',
      rating2Count: (workshop as any).rating2Count || '(88)',
      rating2Platform: (workshop as any).rating2Platform || 'Rating Facts',
      instructor: workshop.instructor || '',
      instructorImage: (workshop as any).instructorImage || '',
      instructorDescription: (workshop as any).instructorDescription || '',
      learningOutcomes: workshop.learningOutcomes || [],
      whatYouWillLearn: workshop.whatYouWillLearn || [],
      courseOutcomes: workshop.courseOutcomes || [],
    });
    setShowModal(true);
    setError('');
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        thumbnail: formData.thumbnail,
        price: Number(formData.price) || 0,
        originalPrice: Number(formData.originalPrice) || 0,
        priceCaption: formData.priceCaption,
        bonusDeadlineText: formData.bonusDeadlineText,
        heroPoints: formData.heroPoints.filter(p => p.trim() !== ''),
        workshopDates: formData.workshopDates.filter(Boolean),
        rating1Value: formData.rating1Value,
        rating1Count: formData.rating1Count,
        rating1Platform: formData.rating1Platform,
        rating2Value: formData.rating2Value,
        rating2Count: formData.rating2Count,
        rating2Platform: formData.rating2Platform,
        instructor: formData.instructor,
        instructorImage: formData.instructorImage,
        instructorDescription: formData.instructorDescription,
        learningOutcomes: formData.learningOutcomes.filter(p => p.trim() !== ''),
        whatYouWillLearn: formData.whatYouWillLearn.filter(step => step.title.trim() !== '' || step.description.trim() !== ''),
        courseOutcomes: formData.courseOutcomes.filter(step => step.title.trim() !== '' || step.description.trim() !== ''),
        type, // Hardcode the type based on the page manager prop
      };

      if (editingWorkshop) {
        await workshopApi.update(editingWorkshop._id, payload);
      } else {
        await workshopApi.create(payload);
      }

      setShowModal(false);
      fetchWorkshops();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save workshop';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete workshop
  const handleDelete = async (id: string) => {
    try {
      await workshopApi.delete(id);
      setDeleteConfirm(null);
      fetchWorkshops();
    } catch {
      setError('Failed to delete workshop');
    }
  };

  // Update a form field
  const updateField = (field: keyof WorkshopFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Filter workshops by search
  const filteredWorkshops = workshops.filter((w) =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const managerTitle = type === 'three-days' ? 'Three Days Workshop Management' : 'One Day Workshop Management';
  const managerDescription = type === 'three-days' 
    ? 'Create and manage all 3-day workshops with dynamic detail pages' 
    : 'Create and manage all 1-day workshops with dynamic detail pages';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{managerTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{managerDescription}</p>
        </div>
        {activeTab === 'workshops' && (
          <button
            onClick={handleCreate}
            id="create-workshop-btn"
            className="flex items-center justify-center gap-2 bg-[#6366f1] hover:bg-[#5558e6] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-[#6366f1]/20 hover:shadow-md hover:shadow-[#6366f1]/30 active:scale-[0.98] w-full sm:w-auto cursor-pointer"
          >
            <Plus size={16} />
            Create Workshop
          </button>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('workshops')}
          className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'workshops' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Workshops
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'registrations' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Registrations
          {registrations.length > 0 && (
            <span className="text-[10px] font-black bg-[#6366f1] text-white px-1.5 py-0.5 rounded-full">{registrations.length}</span>
          )}
        </button>
      </div>

      {/* ─ Workshops Tab Content ─────────────────────────── */}
      {activeTab === 'workshops' && (
        <>
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search workshops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="workshop-search-input"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all placeholder-gray-400 text-black"
            />
          </div>

          {/* Workshops Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Workshop</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instructor</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`} className="">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-gray-200 rounded w-48" />
                              <div className="h-3 bg-gray-200 rounded w-16" />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-4 bg-gray-200 rounded w-36" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-4 bg-gray-200 rounded w-24" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="h-4 bg-gray-200 rounded w-20" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <div className="w-8 h-8 rounded-lg bg-gray-200" />
                            <div className="w-8 h-8 rounded-lg bg-gray-200" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredWorkshops.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                            <Calendar size={24} className="text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500 font-medium">
                            {searchQuery ? 'No workshops found matching your search' : 'No workshops yet. Create your first one!'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredWorkshops.map((w) => (
                      <tr
                        key={w._id}
                        className="hover:bg-[#f8f8ff] transition-colors group"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {w.thumbnail ? (
                              <img src={w.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {w.title.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-900 leading-tight">{w.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded font-mono">{w.slug || '—'}</code>
                            {w.slug && (
                              <a
                                href={w.type === 'three-days' ? `/three-days-workshops/${w.slug}` : `/one-day-workshop/${w.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#6366f1] transition-colors"
                              >
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{w.instructor}</td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-gray-900">
                            {w.currency === 'INR' ? '₹' : w.currency === 'USD' ? '$' : w.currency === 'EUR' ? '€' : '£'}
                            {w.price.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(w)}
                              className="p-2 rounded-lg text-gray-400 hover:text-[#6366f1] hover:bg-[#efeefc] transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(w._id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ─ Registrations Tab Content ─────────────────────── */}
      {activeTab === 'registrations' && (
        <>
          {/* Search Registrations */}
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search registrations..."
              value={regSearch}
              onChange={(e) => setRegSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all placeholder-gray-400 text-black"
            />
          </div>

          {/* Registrations Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Workshop</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Selected Date</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment ID</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {regLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={`reg-skeleton-${idx}`}>
                        <td colSpan={7} className="px-5 py-4">
                          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : registrations.filter(r => 
                      r.name?.toLowerCase().includes(regSearch.toLowerCase()) ||
                      r.email?.toLowerCase().includes(regSearch.toLowerCase()) ||
                      r.phone?.toLowerCase().includes(regSearch.toLowerCase()) ||
                      r.workshopTitle?.toLowerCase().includes(regSearch.toLowerCase())
                    ).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                            <Users size={24} className="text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500 font-medium">
                            No registrations found.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    registrations
                      .filter(r => 
                        r.name?.toLowerCase().includes(regSearch.toLowerCase()) ||
                        r.email?.toLowerCase().includes(regSearch.toLowerCase()) ||
                        r.phone?.toLowerCase().includes(regSearch.toLowerCase()) ||
                        r.workshopTitle?.toLowerCase().includes(regSearch.toLowerCase())
                      )
                      .map((r) => (
                        <tr key={r._id} className="hover:bg-[#f8f8ff] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-900">{r.name}</span>
                              <span className="text-xs text-gray-500">{r.email}</span>
                              <span className="text-xs text-gray-500">Phone: {r.phone}</span>
                              {r.whatsappNumber && (
                                <span className="text-xs text-gray-500">WhatsApp: {r.whatsappNumber}</span>
                              )}
                              {r.age && (
                                <span className="text-xs text-gray-500">Age: {r.age}</span>
                              )}
                              {r.profession && (
                                <span className="text-xs text-gray-500">Profession: {r.profession}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600 font-medium">
                            {r.workshopTitle || r.workshopId?.title || 'Unknown'}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">
                            {r.selectedDate ? formatDate(r.selectedDate) : '—'}
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                            {r.currency === 'INR' ? '₹' : r.currency === 'USD' ? '$' : r.currency === 'EUR' ? '€' : '£'}
                            {(r.amountPaid || 0).toLocaleString()}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              r.paymentStatus === 'paid'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : r.paymentStatus === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              {r.paymentStatus}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500 font-mono">
                            {r.paymentId || '—'}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {formatDate(r.createdAt)}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Workshop?</h3>
            <p className="text-sm text-gray-500 mb-6">This will deactivate the workshop and hide it from public view. This action can be reversed.</p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Delete
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
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={() => setShowModal(false)}
          />

          {/* Slide-out Panel (Full Screen) */}
          <div
            className={`relative bg-white w-screen h-screen shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'
              }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200 bg-white shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {editingWorkshop ? 'Edit Workshop' : (type === 'three-days' ? 'Create Three Days Workshop' : 'Create One Day Workshop')}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {editingWorkshop ? 'Update workshop details and content' : 'Fill in the details to create a new workshop with a dynamic page'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden bg-white text-black">
              {/* Form Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-7 md:p-10 space-y-6 w-full">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium flex items-center gap-2">
                    <AlertTriangle size={14} />
                    {error}
                  </div>
                )}

                {/* Basic Information */}
                <CollapsibleSection title="📋 Basic Information" defaultOpen={true}>
                  <div className="space-y-4">
                    <FormInput
                      label="Workshop Title"
                      value={formData.title}
                      onChange={(v) => updateField('title', v)}
                      placeholder="e.g. Executive Programme in Generative AI & Business Innovation"
                      required
                    />
                    <FormInput
                      label="Subtitle"
                      value={formData.subtitle}
                      onChange={(v) => updateField('subtitle', v)}
                      placeholder="e.g. Transform ideas into AI-powered business solutions – from fundamentals to deployment"
                    />
                    <FormTextArea
                      label="Description"
                      value={formData.description}
                      onChange={(v) => updateField('description', v)}
                      placeholder="Enter a clear and compelling description of the workshop..."
                      rows={4}
                      required
                    />
                  </div>
                </CollapsibleSection>

                {/* Main Section */}
                <CollapsibleSection title="⭐ Main Section">
                  <div className="space-y-6">
                    {/* Media */}
                    <div className="grid grid-cols-1 gap-4">
                      <ImageUploadInput
                        label="Workshop Thumbnail"
                        value={formData.thumbnail}
                        onChange={(v) => updateField('thumbnail', v)}
                      />
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Offer Price (INR)"
                        type="number"
                        value={formData.price}
                        onChange={(v) => updateField('price', v)}
                        placeholder="e.g. 199"
                        required
                      />
                      <FormInput
                        label="Original Price (INR)"
                        type="number"
                        value={formData.originalPrice}
                        onChange={(v) => updateField('originalPrice', v)}
                        placeholder="e.g. 1999"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Price Caption"
                        value={formData.priceCaption}
                        onChange={(v) => updateField('priceCaption', v)}
                        placeholder="e.g. Become A Python Using AI Expert Now At"
                      />
                      <FormInput
                        label="Bonus Deadline Text"
                        value={formData.bonusDeadlineText}
                        onChange={(v) => updateField('bonusDeadlineText', v)}
                        placeholder="e.g. Register Before June 07, 2026..."
                      />
                    </div>

                    {/* Ratings section */}
                    <div className="border-t border-gray-100 pt-4">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
                        ⭐ Trustpilot & Rating Facts Configuration
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <FormInput
                          label="Rating 1 Value (e.g. 4.5/5)"
                          value={formData.rating1Value}
                          onChange={(v) => updateField('rating1Value', v)}
                          placeholder="4.5/5"
                        />
                        <FormInput
                          label="Rating 1 Count (e.g. (725))"
                          value={formData.rating1Count}
                          onChange={(v) => updateField('rating1Count', v)}
                          placeholder="(725)"
                        />
                        <FormInput
                          label="Rating 1 Platform Name"
                          value={formData.rating1Platform}
                          onChange={(v) => updateField('rating1Platform', v)}
                          placeholder="Trustpilot"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput
                          label="Rating 2 Value (e.g. 4.07/5)"
                          value={formData.rating2Value}
                          onChange={(v) => updateField('rating2Value', v)}
                          placeholder="4.07/5"
                        />
                        <FormInput
                          label="Rating 2 Count (e.g. (88))"
                          value={formData.rating2Count}
                          onChange={(v) => updateField('rating2Count', v)}
                          placeholder="(88)"
                        />
                        <FormInput
                          label="Rating 2 Platform Name"
                          value={formData.rating2Platform}
                          onChange={(v) => updateField('rating2Platform', v)}
                          placeholder="Rating Facts"
                        />
                      </div>
                    </div>

                    {/* 4 Checkpoints */}
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">
                        Hero Checkpoints (Up to 4 points)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[0, 1, 2, 3].map((idx) => (
                          <FormInput
                            key={idx}
                            label={`Point ${idx + 1}`}
                            value={formData.heroPoints[idx] || ''}
                            onChange={(val) => {
                              const updated = [...formData.heroPoints];
                              updated[idx] = val;
                              updateField('heroPoints', updated);
                            }}
                            placeholder={`Checkpoint point ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Workshop Dates */}
                <CollapsibleSection title="📅 Workshop Dates">
                  <div className="space-y-4 text-black">
                    {type === 'three-days' ? (
                      <>
                        <span className="text-xs text-gray-500 font-medium block">
                          Select the Start Date and End Date. The system will automatically generate consecutive dates for the 3-day workshop.
                        </span>
                        <div className="space-y-4">
                          {dateRanges.map((range, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50/30 relative">
                              {dateRanges.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...dateRanges];
                                    updated.splice(idx, 1);
                                    setDateRanges(updated);
                                  }}
                                  className="absolute top-2 right-2 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1.5 rounded-lg border-0 cursor-pointer"
                                >
                                  Delete
                                </button>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1">Start Date</label>
                                  <input
                                    type="date"
                                    value={range.startDate}
                                    onChange={(e) => {
                                      const updated = [...dateRanges];
                                      updated[idx] = { ...updated[idx], startDate: e.target.value };
                                      setDateRanges(updated);
                                    }}
                                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white text-black"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-1">End Date</label>
                                  <input
                                    type="date"
                                    value={range.endDate}
                                    onChange={(e) => {
                                      const updated = [...dateRanges];
                                      updated[idx] = { ...updated[idx], endDate: e.target.value };
                                      setDateRanges(updated);
                                    }}
                                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white text-black"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setDateRanges([...dateRanges, { startDate: '', endDate: '' }]);
                          }}
                          className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98] cursor-pointer mt-3"
                        >
                          + Add Dates Section
                        </button>

                        {formData.workshopDates.length > 0 && (
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                              Generated Dates:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {formData.workshopDates.map((dateStr, idx) => (
                                <span key={idx} className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
                                  📅 {dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-gray-500 font-medium block">
                          Add the dates when this workshop is held. These will display in the calendar selector on the details page.
                        </span>
                        <div className="space-y-3">
                          {formData.workshopDates.map((dateStr, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <input
                                type="date"
                                value={dateStr}
                                onChange={(e) => {
                                  const updated = [...formData.workshopDates];
                                  updated[idx] = e.target.value;
                                  updateField('workshopDates', updated);
                                }}
                                className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...formData.workshopDates];
                                  updated.splice(idx, 1);
                                  updateField('workshopDates', updated);
                                }}
                                className="px-3 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold transition-colors active:scale-[0.98] cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            updateField('workshopDates', [...formData.workshopDates, '']);
                          }}
                          className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98] cursor-pointer"
                        >
                          + Add Date
                        </button>
                      </>
                    )}
                  </div>
                </CollapsibleSection>

                {/* Mentor & Workshop Outcomes */}
                <CollapsibleSection title="🎓 Mentor & Workshop Outcomes">
                  <div className="space-y-6">
                    {/* Mentor Details */}
                    <div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3 border-b border-gray-100 pb-2">
                        Mentor Details
                      </span>
                      <div className="space-y-4">
                        <FormInput
                          label="Instructor Name"
                          value={formData.instructor}
                          onChange={(v) => updateField('instructor', v)}
                          placeholder="e.g. Aman Saurav"
                        />
                        <ImageUploadInput
                          label="Instructor Image"
                          value={formData.instructorImage}
                          onChange={(v) => updateField('instructorImage', v)}
                        />
                        <FormTextArea
                          label="Instructor Description / Role / Headline"
                          value={formData.instructorDescription}
                          onChange={(v) => updateField('instructorDescription', v)}
                          placeholder="e.g. (IIT Delhi) Senior Data Analyst&#10;Director at AI for Techies"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Outcome Points */}
                    <div className="space-y-4 border-t border-gray-100 pt-6">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                        Workshop Outcome Points
                      </span>
                      <span className="text-xs text-gray-500 font-medium block">
                        Add the points outlining what students will achieve or learn in this workshop.
                      </span>
                      <div className="space-y-3">
                        {formData.learningOutcomes.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={point}
                              onChange={(e) => {
                                const updated = [...formData.learningOutcomes];
                                updated[idx] = e.target.value;
                                updateField('learningOutcomes', updated);
                              }}
                              placeholder={`Outcome point ${idx + 1}`}
                              className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-gray-50/50 focus:bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...formData.learningOutcomes];
                                updated.splice(idx, 1);
                                updateField('learningOutcomes', updated);
                              }}
                              className="px-3 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold transition-colors active:scale-[0.98] cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateField('learningOutcomes', [...formData.learningOutcomes, '']);
                        }}
                        className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98] cursor-pointer"
                      >
                        + Add Outcome Point
                      </button>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* What You'll Learn */}
                <CollapsibleSection title="📖 What You'll Learn">
                  <div className="space-y-4">
                    <span className="text-xs text-gray-500 font-medium block">
                      Add steps/topics to show under the "What You'll Learn" section on the details page.
                    </span>
                    <div className="space-y-4">
                      {formData.whatYouWillLearn.map((step, idx) => (
                        <div key={idx} className="border border-gray-150 rounded-xl p-4 bg-gray-50/30 space-y-3 relative group/step">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Step {idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...formData.whatYouWillLearn];
                                updated.splice(idx, 1);
                                updateField('whatYouWillLearn', updated);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold transition-colors active:scale-[0.98] cursor-pointer"
                            >
                              Remove Step
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <FormInput
                              label="Step Heading"
                              value={step.title}
                              onChange={(v) => {
                                const updated = [...formData.whatYouWillLearn];
                                updated[idx] = { ...updated[idx], title: v };
                                updateField('whatYouWillLearn', updated);
                              }}
                              placeholder="e.g. Social Media Handling with AI"
                            />
                            <FormTextArea
                              label="Step Description"
                              value={step.description}
                              onChange={(v) => {
                                const updated = [...formData.whatYouWillLearn];
                                updated[idx] = { ...updated[idx], description: v };
                                updateField('whatYouWillLearn', updated);
                              }}
                              placeholder="e.g. Create, schedule, analyze & grow your social media using powerful AI tools."
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updateField('whatYouWillLearn', [...formData.whatYouWillLearn, { title: '', description: '' }]);
                      }}
                      className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      + Add Step
                    </button>
                  </div>
                </CollapsibleSection>

                {/* Course Outcomes */}
                <CollapsibleSection title="🎓 Course Outcomes (Image, Heading, Description)">
                  <div className="space-y-4">
                    <span className="text-xs text-gray-500 font-medium block">
                      Add outcomes with an image, heading, and description to show in the outcomes carousel section.
                    </span>
                    <div className="space-y-4">
                      {formData.courseOutcomes && formData.courseOutcomes.map((outcome, idx) => (
                        <div key={idx} className="border border-gray-150 rounded-xl p-4 bg-gray-50/30 space-y-3 relative group/outcome">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Outcome {idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...formData.courseOutcomes];
                                updated.splice(idx, 1);
                                updateField('courseOutcomes', updated);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold transition-colors active:scale-[0.98] cursor-pointer"
                            >
                              Remove Outcome
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <ImageUploadInput
                              label="Outcome Image"
                              value={outcome.image}
                              onChange={(v) => {
                                const updated = [...formData.courseOutcomes];
                                updated[idx] = { ...updated[idx], image: v };
                                updateField('courseOutcomes', updated);
                              }}
                            />
                            <FormInput
                              label="Outcome Heading"
                              value={outcome.title}
                              onChange={(v) => {
                                const updated = [...formData.courseOutcomes];
                                updated[idx] = { ...updated[idx], title: v };
                                updateField('courseOutcomes', updated);
                              }}
                              placeholder="e.g. Generate Codes in any language with AI"
                            />
                            <FormTextArea
                              label="Outcome Description"
                              value={outcome.description}
                              onChange={(v) => {
                                const updated = [...formData.courseOutcomes];
                                updated[idx] = { ...updated[idx], description: v };
                                updateField('courseOutcomes', updated);
                              }}
                              placeholder="e.g. Discover how AI streamlines data processing, transforming raw data into actionable insights swiftly."
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updateField('courseOutcomes', [...(formData.courseOutcomes || []), { title: '', description: '', image: '' }]);
                      }}
                      className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      + Add Outcome Card
                    </button>
                  </div>
                </CollapsibleSection>
              </div>

              {/* Sticky Footer */}
              <div className="px-7 py-5 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  id="workshop-submit-btn"
                  className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {editingWorkshop ? 'Update Workshop' : 'Create Workshop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

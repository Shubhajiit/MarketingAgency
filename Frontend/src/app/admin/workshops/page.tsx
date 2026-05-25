'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { workshopApi, Workshop } from '@/lib/api/workshops';
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
  GripVertical,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────
interface ModuleEntry {
  title: string;
  content: string[];
}
interface HighlightEntry {
  title: string;
  description: string;
}
interface TargetAudienceEntry {
  title: string;
  description: string;
}
interface ExpertEntry {
  name: string;
  role: string;
  image: string;
}
interface SlotEntry {
  date: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  meetingLink: string;
}

interface WorkshopFormData {
  title: string;
  subtitle: string;
  description: string;
  instructor: string;
  price: number;
  currency: string;
  thumbnail: string;
  batchNumber: string;
  startDate: string;
  workshopTime: string;
  duration: string;
  durationDetail: string;
  fee: string;
  feeNote: string;
  eligibility: string;
  eligibilityDetail: string;
  applicationDeadline: string;
  brochureUrl: string;
  hasBrochure: boolean;
  tags: string;
  highlights: HighlightEntry[];
  modules: ModuleEntry[];
  targetAudience: TargetAudienceEntry[];
  learningOutcomes: string[];
  experts: ExpertEntry[];
  slots: SlotEntry[];
}

const defaultFormData: WorkshopFormData = {
  title: '',
  subtitle: '',
  description: '',
  instructor: '',
  price: 0,
  currency: 'INR',
  thumbnail: '',
  batchNumber: '',
  startDate: '',
  workshopTime: '',
  duration: '',
  durationDetail: '',
  fee: '',
  feeNote: '',
  eligibility: '',
  eligibilityDetail: '',
  applicationDeadline: '',
  brochureUrl: '',
  hasBrochure: true,
  tags: '',
  highlights: [],
  modules: [],
  targetAudience: [],
  learningOutcomes: [],
  experts: [],
  slots: [],
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
        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-white placeholder-gray-400"
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
        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all bg-white placeholder-gray-400 resize-none"
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
    } catch (err) {
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

// ─── Main Page ──────────────────────────────────────────────
export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState<WorkshopFormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Fetch workshops
  const fetchWorkshops = useCallback(async () => {
    try {
      setLoading(true);
      const res = await workshopApi.list({ limit: 100 });
      setWorkshops(res.data.workshops);
    } catch {
      setError('Failed to load workshops');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  // Open create modal
  const handleCreate = () => {
    setEditingWorkshop(null);
    setFormData(defaultFormData);
    setShowModal(true);
    setError('');
  };

  // Open edit modal
  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      title: workshop.title || '',
      subtitle: workshop.subtitle || '',
      description: workshop.description || '',
      instructor: workshop.instructor || '',
      price: workshop.price || 0,
      currency: workshop.currency || 'INR',
      thumbnail: workshop.thumbnail || '',
      batchNumber: workshop.batchNumber || '',
      startDate: workshop.startDate ? new Date(workshop.startDate).toISOString().split('T')[0] : '',
      workshopTime: workshop.workshopTime || '',
      duration: workshop.duration || '',
      durationDetail: workshop.durationDetail || '',
      fee: workshop.fee || '',
      feeNote: workshop.feeNote || '',
      eligibility: workshop.eligibility || '',
      eligibilityDetail: workshop.eligibilityDetail || '',
      applicationDeadline: workshop.applicationDeadline ? new Date(workshop.applicationDeadline).toISOString().split('T')[0] : '',
      brochureUrl: workshop.brochureUrl || '',
      hasBrochure: workshop.hasBrochure !== false,
      tags: (workshop.tags || []).join(', '),
      highlights: workshop.highlights?.length ? workshop.highlights : [],
      modules: workshop.modules?.length ? workshop.modules : [],
      targetAudience: workshop.targetAudience?.length ? workshop.targetAudience : [],
      learningOutcomes: workshop.learningOutcomes?.length ? workshop.learningOutcomes : [],
      experts: workshop.experts?.length ? workshop.experts : [],
      slots: workshop.slots?.length
        ? workshop.slots.map((s) => ({
            date: new Date(s.date).toISOString().split('T')[0],
            startTime: s.startTime,
            endTime: s.endTime,
            totalSeats: s.totalSeats,
            meetingLink: s.meetingLink || '',
          }))
        : [],
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
        instructor: formData.instructor,
        price: Number(formData.price),
        currency: formData.currency,
        thumbnail: formData.thumbnail,
        batchNumber: formData.batchNumber,
        startDate: formData.startDate || null,
        workshopTime: formData.workshopTime,
        duration: formData.duration,
        durationDetail: formData.durationDetail,
        fee: formData.fee,
        feeNote: formData.feeNote,
        eligibility: formData.eligibility,
        eligibilityDetail: formData.eligibilityDetail,
        applicationDeadline: formData.applicationDeadline || null,
        brochureUrl: formData.brochureUrl,
        hasBrochure: formData.hasBrochure,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        highlights: formData.highlights,
        modules: formData.modules,
        targetAudience: formData.targetAudience,
        learningOutcomes: formData.learningOutcomes.filter(Boolean),
        experts: formData.experts,
        slots: formData.slots,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Workshop Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage all workshops with dynamic detail pages</p>
        </div>
        <button
          onClick={handleCreate}
          id="create-workshop-btn"
          className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#5558e6] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-[#6366f1]/20 hover:shadow-md hover:shadow-[#6366f1]/30 active:scale-[0.98]"
        >
          <Plus size={16} />
          Create Workshop
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search workshops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="workshop-search-input"
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all placeholder-gray-400"
        />
      </div>

      {/* Workshops Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 size={28} className="animate-spin text-[#6366f1]" />
            <span className="text-sm text-gray-500 font-medium">Loading workshops...</span>
          </div>
        ) : filteredWorkshops.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {searchQuery ? 'No workshops found matching your search' : 'No workshops yet. Create your first one!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Workshop</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredWorkshops.map((w) => (
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
                          {w.batchNumber && (
                            <span className="text-[10px] font-bold text-[#6366f1] bg-[#efeefc] px-1.5 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">
                              {w.batchNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded font-mono">{w.slug || '—'}</code>
                        {w.slug && (
                          <a
                            href={`/workshops/${w.slug}`}
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
                    <td className="px-5 py-4 text-sm text-gray-600">{formatDate(w.startDate)}</td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {w.currency === 'INR' ? '₹' : w.currency === 'USD' ? '$' : w.currency === 'EUR' ? '€' : '£'}
                        {w.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(w)}
                          className="p-2 rounded-lg text-gray-400 hover:text-[#6366f1] hover:bg-[#efeefc] transition-all"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(w._id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Workshop?</h3>
            <p className="text-sm text-gray-500 mb-6">This will deactivate the workshop and hide it from public view. This action can be reversed.</p>
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#f8f9fc] rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-200 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-200 bg-white rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  {editingWorkshop ? 'Edit Workshop' : 'Create New Workshop'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingWorkshop ? 'Update workshop details and content' : 'Fill in the details to create a new workshop with a dynamic page'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-7 space-y-5 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium flex items-center gap-2">
                  <AlertTriangle size={14} />
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <CollapsibleSection title="📋 Basic Information" defaultOpen={true}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Workshop Title"
                      value={formData.title}
                      onChange={(v) => updateField('title', v)}
                      placeholder="e.g. Executive Programme in MarTech & AI"
                      required
                    />
                    <FormInput
                      label="Instructor"
                      value={formData.instructor}
                      onChange={(v) => updateField('instructor', v)}
                      placeholder="e.g. Prof. John Smith"
                      required
                    />
                  </div>
                  <FormInput
                    label="Subtitle"
                    value={formData.subtitle}
                    onChange={(v) => updateField('subtitle', v)}
                    placeholder="e.g. From strategy to stack – your roadmap to marketing in the era of AI"
                  />
                  <FormTextArea
                    label="Description"
                    value={formData.description}
                    onChange={(v) => updateField('description', v)}
                    placeholder="Full workshop description..."
                    rows={4}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Price"
                      value={formData.price}
                      onChange={(v) => updateField('price', v)}
                      type="number"
                      required
                    />
                    {editingWorkshop && (
                      <FormInput
                        label="Batch Number"
                        value={formData.batchNumber}
                        onChange={(v) => updateField('batchNumber', v)}
                        placeholder="e.g. BATCH 3"
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <ImageUploadInput
                      label="Workshop Image / Poster"
                      value={formData.thumbnail}
                      onChange={(v) => updateField('thumbnail', v)}
                      placeholder="Paste URL or select image..."
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Dates & Schedule */}
              <CollapsibleSection title="📅 Dates & Schedule">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Start Date"
                      value={formData.startDate}
                      onChange={(v) => updateField('startDate', v)}
                      type="date"
                    />
                    <FormInput
                      label="Workshop Time (shown in hero)"
                      value={formData.workshopTime}
                      onChange={(v) => updateField('workshopTime', v)}
                      placeholder="e.g. 10 AM IST"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Application Deadline"
                      value={formData.applicationDeadline}
                      onChange={(v) => updateField('applicationDeadline', v)}
                      type="date"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Duration"
                      value={formData.duration}
                      onChange={(v) => updateField('duration', v)}
                      placeholder="e.g. 26 weeks, Online"
                    />
                    <FormInput
                      label="Duration Detail"
                      value={formData.durationDetail}
                      onChange={(v) => updateField('durationDetail', v)}
                      placeholder="e.g. 4-6 hours of weekly"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Fee & Eligibility */}
              <CollapsibleSection title="💰 Fee & Eligibility">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Display Fee"
                      value={formData.fee}
                      onChange={(v) => updateField('fee', v)}
                      placeholder="e.g. ₹1,26,500"
                    />
                    <FormInput
                      label="Fee Note"
                      value={formData.feeNote}
                      onChange={(v) => updateField('feeNote', v)}
                      placeholder="e.g. GST will be charged at checkout"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Eligibility"
                      value={formData.eligibility}
                      onChange={(v) => updateField('eligibility', v)}
                      placeholder="e.g. Bachelor's Degree or 10+2+3"
                    />
                    <FormInput
                      label="Eligibility Detail"
                      value={formData.eligibilityDetail}
                      onChange={(v) => updateField('eligibilityDetail', v)}
                      placeholder="More details on eligibility..."
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Media */}
              <CollapsibleSection title="📄 Brochure Configuration">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-150 rounded-xl">
                    <div>
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">Brochure Download</span>
                      <span className="text-xs text-gray-400">Offer a downloadable syllabus brochure (PDF or auto-generated) on the page</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.hasBrochure}
                        onChange={(e) => updateField('hasBrochure', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366f1]"></div>
                    </label>
                  </div>

                  {formData.hasBrochure && (
                    <FormInput
                      label="Brochure URL (PDF link)"
                      value={formData.brochureUrl}
                      onChange={(v) => updateField('brochureUrl', v)}
                      placeholder="https://... (leave empty for auto-generated brochure)"
                    />
                  )}
                </div>
              </CollapsibleSection>

              {/* Programme Modules */}
              <CollapsibleSection title="📚 Programme Modules">
                <div className="space-y-4">
                  {formData.modules.map((mod, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 relative group">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.modules];
                          updated.splice(idx, 1);
                          updateField('modules', updated);
                        }}
                        className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                      <div className="flex items-center gap-2 mb-3">
                        <GripVertical size={14} className="text-gray-300" />
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => {
                            const updated = [...formData.modules];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            updateField('modules', updated);
                          }}
                          placeholder="Module title"
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] font-semibold"
                        />
                      </div>
                      {mod.content.map((item, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2 mb-2 ml-6">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] mt-2.5 shrink-0" />
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...formData.modules];
                              const newContent = [...updated[idx].content];
                              newContent[cIdx] = e.target.value;
                              updated[idx] = { ...updated[idx], content: newContent };
                              updateField('modules', updated);
                            }}
                            placeholder="Content point..."
                            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.modules];
                              const newContent = [...updated[idx].content];
                              newContent.splice(cIdx, 1);
                              updated[idx] = { ...updated[idx], content: newContent };
                              updateField('modules', updated);
                            }}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.modules];
                          updated[idx] = { ...updated[idx], content: [...updated[idx].content, ''] };
                          updateField('modules', updated);
                        }}
                        className="ml-6 text-xs font-semibold text-[#6366f1] hover:text-[#5558e6] transition-colors mt-1"
                      >
                        + Add content point
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateField('modules', [...formData.modules, { title: '', content: [''] }])}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#6366f1] hover:text-[#5558e6] transition-colors bg-[#efeefc] hover:bg-[#e8e6fb] px-4 py-2.5 rounded-xl"
                  >
                    <Plus size={14} /> Add Module
                  </button>
                </div>
              </CollapsibleSection>

              {/* Highlights */}
              <CollapsibleSection title="✨ Programme Highlights">
                <div className="space-y-3">
                  {formData.highlights.map((hl, idx) => (
                    <div key={idx} className="flex gap-3 items-start group">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={hl.title}
                          onChange={(e) => {
                            const updated = [...formData.highlights];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            updateField('highlights', updated);
                          }}
                          placeholder="Highlight title"
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20 focus:border-[#6366f1] font-semibold"
                        />
                        <input
                          type="text"
                          value={hl.description}
                          onChange={(e) => {
                            const updated = [...formData.highlights];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            updateField('highlights', updated);
                          }}
                          placeholder="Short description"
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.highlights];
                          updated.splice(idx, 1);
                          updateField('highlights', updated);
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateField('highlights', [...formData.highlights, { title: '', description: '' }])}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#6366f1] hover:text-[#5558e6] transition-colors bg-[#efeefc] hover:bg-[#e8e6fb] px-4 py-2.5 rounded-xl"
                  >
                    <Plus size={14} /> Add Highlight
                  </button>
                </div>
              </CollapsibleSection>

              {/* Target Audience */}
              <CollapsibleSection title="👥 Target Audience">
                <div className="space-y-3">
                  {formData.targetAudience.map((ta, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 relative group">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.targetAudience];
                          updated.splice(idx, 1);
                          updateField('targetAudience', updated);
                        }}
                        className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                      <FormInput
                        label="Audience Title"
                        value={ta.title}
                        onChange={(v) => {
                          const updated = [...formData.targetAudience];
                          updated[idx] = { ...updated[idx], title: v };
                          updateField('targetAudience', updated);
                        }}
                        placeholder="e.g. Senior Managers and Leaders"
                        className="mb-3"
                      />
                      <FormTextArea
                        label="Description"
                        value={ta.description}
                        onChange={(v) => {
                          const updated = [...formData.targetAudience];
                          updated[idx] = { ...updated[idx], description: v };
                          updateField('targetAudience', updated);
                        }}
                        placeholder="Describe the target audience..."
                        rows={2}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateField('targetAudience', [...formData.targetAudience, { title: '', description: '' }])}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#6366f1] hover:text-[#5558e6] transition-colors bg-[#efeefc] hover:bg-[#e8e6fb] px-4 py-2.5 rounded-xl"
                  >
                    <Plus size={14} /> Add Target Audience
                  </button>
                </div>
              </CollapsibleSection>

              {/* Learning Outcomes */}
              <CollapsibleSection title="🎯 Learning Outcomes">
                <div className="space-y-2">
                  {formData.learningOutcomes.map((lo, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] shrink-0" />
                      <input
                        type="text"
                        value={lo}
                        onChange={(e) => {
                          const updated = [...formData.learningOutcomes];
                          updated[idx] = e.target.value;
                          updateField('learningOutcomes', updated);
                        }}
                        placeholder="Learning outcome..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.learningOutcomes];
                          updated.splice(idx, 1);
                          updateField('learningOutcomes', updated);
                        }}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateField('learningOutcomes', [...formData.learningOutcomes, ''])}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#6366f1] hover:text-[#5558e6] transition-colors bg-[#efeefc] hover:bg-[#e8e6fb] px-4 py-2.5 rounded-xl"
                  >
                    <Plus size={14} /> Add Outcome
                  </button>
                </div>
              </CollapsibleSection>

              {/* Mentors */}
              <CollapsibleSection title="🎓 Mentors">
                <div className="space-y-3">
                  {formData.experts.map((exp, idx) => (
                    <div key={idx} className="flex gap-3 items-start group">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={exp.name}
                          onChange={(e) => {
                            const updated = [...formData.experts];
                            updated[idx] = { ...updated[idx], name: e.target.value };
                            updateField('experts', updated);
                          }}
                          placeholder="Mentor name"
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20 focus:border-[#6366f1] font-semibold"
                        />
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...formData.experts];
                            updated[idx] = { ...updated[idx], role: e.target.value };
                            updateField('experts', updated);
                          }}
                          placeholder="Role / Title (e.g. Founder, CEO)"
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
                        />
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={exp.image}
                            onChange={(e) => {
                              const updated = [...formData.experts];
                              updated[idx] = { ...updated[idx], image: e.target.value };
                              updateField('experts', updated);
                            }}
                            placeholder="Image URL or upload"
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20 focus:border-[#6366f1]"
                          />
                          <label className="px-3 py-2 bg-gray-950 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm select-none border border-transparent whitespace-nowrap active:scale-[0.98]">
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const data = await workshopApi.uploadImage(file);
                                  if (data.success && data.url) {
                                    const updated = [...formData.experts];
                                    updated[idx] = { ...updated[idx], image: data.url };
                                    updateField('experts', updated);
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.experts];
                          updated.splice(idx, 1);
                          updateField('experts', updated);
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateField('experts', [...formData.experts, { name: '', role: '', image: '' }])}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#6366f1] hover:text-[#5558e6] transition-colors bg-[#efeefc] hover:bg-[#e8e6fb] px-4 py-2.5 rounded-xl"
                  >
                    <Plus size={14} /> Add Mentor
                  </button>
                </div>
              </CollapsibleSection>

              {/* Workshop Slots */}
              <CollapsibleSection title="🗓️ Workshop Slots">
                <div className="space-y-3">
                  {formData.slots.map((slot, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 relative group">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.slots];
                          updated.splice(idx, 1);
                          updateField('slots', updated);
                        }}
                        className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Date</label>
                          <input
                            type="date"
                            value={slot.date}
                            onChange={(e) => {
                              const updated = [...formData.slots];
                              updated[idx] = { ...updated[idx], date: e.target.value };
                              updateField('slots', updated);
                            }}
                            className="px-2.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Start</label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => {
                              const updated = [...formData.slots];
                              updated[idx] = { ...updated[idx], startTime: e.target.value };
                              updateField('slots', updated);
                            }}
                            className="px-2.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">End</label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => {
                              const updated = [...formData.slots];
                              updated[idx] = { ...updated[idx], endTime: e.target.value };
                              updateField('slots', updated);
                            }}
                            className="px-2.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Seats</label>
                          <input
                            type="number"
                            value={slot.totalSeats}
                            onChange={(e) => {
                              const updated = [...formData.slots];
                              updated[idx] = { ...updated[idx], totalSeats: parseInt(e.target.value) || 1 };
                              updateField('slots', updated);
                            }}
                            min={1}
                            className="px-2.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Meeting Link</label>
                          <input
                            type="text"
                            value={slot.meetingLink}
                            onChange={(e) => {
                              const updated = [...formData.slots];
                              updated[idx] = { ...updated[idx], meetingLink: e.target.value };
                              updateField('slots', updated);
                            }}
                            placeholder="https://..."
                            className="px-2.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      updateField('slots', [
                        ...formData.slots,
                        { date: '', startTime: '10:00', endTime: '12:00', totalSeats: 50, meetingLink: '' },
                      ])
                    }
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#6366f1] hover:text-[#5558e6] transition-colors bg-[#efeefc] hover:bg-[#e8e6fb] px-4 py-2.5 rounded-xl"
                  >
                    <Plus size={14} /> Add Slot
                  </button>
                </div>
              </CollapsibleSection>
            </form>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-200 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                id="workshop-submit-btn"
                className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#5558e6] disabled:bg-[#6366f1]/60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-[#6366f1]/20"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {editingWorkshop ? 'Update Workshop' : 'Create Workshop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

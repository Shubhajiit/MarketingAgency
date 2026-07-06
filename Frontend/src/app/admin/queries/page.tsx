'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { queriesApi, UserQuery } from '@/lib/api/queries';
import {
  HelpCircle,
  Search,
  Mail,
  Phone,
  MessageSquare,
  Trash2,
  Loader2,
  Calendar,
  Layers,
  Briefcase,
  Monitor
} from 'lucide-react';

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<UserQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Fetch queries from API
  const fetchQueries = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await queriesApi.getAllQueries();
      if (res.success && res.data?.queries) {
        setQueries(res.data.queries);
      } else {
        setError('Failed to retrieve user queries.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading queries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  // Handle Query Deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this query? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(id);
      const res = await queriesApi.deleteQuery(id);
      if (res.success) {
        setQueries((prev) => prev.filter((q) => q._id !== id));
      } else {
        alert(res.message || 'Failed to delete the query.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the query.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter queries based on search query
  const filteredQueries = queries.filter((q) => {
    const query = searchQuery.toLowerCase();
    return (
      q.fullName.toLowerCase().includes(query) ||
      q.email.toLowerCase().includes(query) ||
      q.phone.includes(query) ||
      q.experience.toLowerCase().includes(query) ||
      q.querySection.toLowerCase().includes(query) ||
      q.learningMode.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 w-full">
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1f2937] tracking-tight">Query List</h1>
        <p className="text-sm text-gray-500">
          Review user questions and requests submitted via the homepage query forms. Access, search, and delete entries.
        </p>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs flex flex-col justify-between h-[120px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400">Total Queries</span>
              <h3 className="text-2xl font-extrabold text-[#1f2937] tracking-tight mt-1">
                {queries.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <MessageSquare size={18} />
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Received lifetime</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs flex flex-col justify-between h-[120px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400">Online Mode Queries</span>
              <h3 className="text-2xl font-extrabold text-[#1f2937] tracking-tight mt-1">
                {queries.filter(q => q.learningMode === 'Online').length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Monitor size={18} />
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Virtual / Remote Learner requests</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#e9ebf0] p-5 shadow-xs flex flex-col justify-between h-[120px] transition-all hover:shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400">Classroom Mode Queries</span>
              <h3 className="text-2xl font-extrabold text-[#1f2937] tracking-tight mt-1">
                {queries.filter(q => q.learningMode === 'Classroom').length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Briefcase size={18} />
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Campus / In-Person requests</span>
        </div>
      </div>

      {/* Main Table Controls & Content */}
      <div className="bg-white rounded-2xl border border-[#e9ebf0] overflow-hidden shadow-xs">
        {/* Search Header */}
        <div className="p-5 border-b border-[#e9ebf0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search queries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#e9ebf0] rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
            />
          </div>
          <div className="text-xs text-gray-400 font-semibold">
            Showing {filteredQueries.length} of {queries.length} queries
          </div>
        </div>

        {/* Table/List Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <span className="text-sm font-semibold">Loading queries...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">
            {error}
          </div>
        ) : filteredQueries.length === 0 ? (
          <div className="text-center py-20 text-gray-400 flex flex-col items-center justify-center gap-3">
            <HelpCircle size={40} className="text-gray-300" />
            <span className="text-sm font-semibold">No queries found</span>
            <p className="text-xs max-w-[280px]">Try tweaking your search or check if any forms were submitted.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e9ebf0] bg-[#f8f9fe]/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Submission Date</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4">Query Section</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9ebf0] text-sm text-slate-700">
                {filteredQueries.map((query) => (
                  <tr key={query._id} className="hover:bg-[#f8f9fc]/50 transition-colors">
                    {/* Submission Date */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="font-semibold text-slate-600">
                          {query.createdAt ? new Date(query.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4.5 font-bold text-slate-900">
                      {query.fullName}
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4.5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail size={13} className="text-gray-400" />
                          <a href={`mailto:${query.email}`} className="text-indigo-600 hover:underline">
                            {query.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone size={13} className="text-gray-400" />
                          <span className="text-slate-600">
                            {query.countryCode} {query.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg shadow-sm">
                        {query.experience}
                      </span>
                    </td>

                    {/* Query Section */}
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg">
                        <Layers size={12} />
                        {query.querySection}
                      </span>
                    </td>

                    {/* Learning Mode */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        query.learningMode === 'Online' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {query.learningMode}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(query._id)}
                        disabled={deleteLoading === query._id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                        title="Delete Query"
                      >
                        {deleteLoading === query._id ? (
                          <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

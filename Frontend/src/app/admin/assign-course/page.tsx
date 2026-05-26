'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { adminApi, AdminUser } from '@/lib/api/admin';
import { coursesApi } from '@/lib/api/courses';
import { Course } from '@/components/common/CoursesCardsUI';
import {
  Search,
  User,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  X,
  ChevronRight,
  GraduationCap,
  Mail,
  BookOpen,
  Calendar
} from 'lucide-react';

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export default function AssignCoursePage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // "assign-id" or "unassign-id"
  
  const [userSearch, setUserSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);

  // Show auto-dismissing toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch users & courses
  const fetchData = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await adminApi.getUsers();
      setUsers(res.data.users);
      if (res.data.users.length > 0) {
        // Keep the same user selected if refreshing
        setSelectedUser(prev => {
          if (!prev) return res.data.users[0];
          const updated = res.data.users.find(u => u._id === prev._id);
          return updated || res.data.users[0];
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load students list', 'error');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      setLoadingCourses(true);
      const res = await coursesApi.list({ all: true });
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
      showToast('Failed to load courses list', 'error');
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchCourses();
  }, [fetchData, fetchCourses]);

  // Handle Assign Course
  const handleAssign = async (courseId: string) => {
    if (!selectedUser) return;
    setActionLoading(`assign-${courseId}`);
    try {
      await adminApi.assignCourse(selectedUser._id, courseId);
      showToast('Course assigned successfully!');
      await fetchData(); // Refresh data to update user's list
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to assign course';
      showToast(msg, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Unassign Course
  const handleUnassign = async (courseId: string) => {
    if (!selectedUser) return;
    setActionLoading(`unassign-${courseId}`);
    try {
      await adminApi.unassignCourse(selectedUser._id, courseId);
      showToast('Course removed successfully!');
      await fetchData(); // Refresh data
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to remove course';
      showToast(msg, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Filter courses by search and availability (only active ones)
  const availableCourses = courses.filter(w => w.isActive !== false);

  // Filter courses NOT already assigned to selectedUser
  const unassignedCourses = availableCourses.filter(course => {
    if (!selectedUser) return true;
    const cid = (course as any)._id || course.id;
    return !(selectedUser.enrolledCourses || []).some(w => ((w as any)._id || w.id) === cid);
  }).filter(course => 
    course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.tag?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3.5 rounded-xl shadow-lg border text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Assign Course</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and assign certification courses to registered students directly.</p>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Students List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-[75vh]">
          {/* Header & Search */}
          <div className="p-5 border-b border-gray-100 space-y-3.5">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap size={18} className="text-[#6366f1]" />
              <span>Students List ({filteredUsers.length})</span>
            </h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] focus:bg-white transition-all placeholder-gray-400"
              />
            </div>
          </div>

          {/* Student items */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 no-scrollbar">
            {loadingUsers ? (
              <div className="h-full flex flex-col items-center justify-center p-6 gap-3">
                <Loader2 size={24} className="animate-spin text-[#6366f1]" />
                <span className="text-sm text-gray-500 font-medium">Loading students...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-400">
                <User size={32} className="opacity-50 mb-2" />
                <p className="text-sm font-medium">No students found</p>
              </div>
            ) : (
              filteredUsers.map(user => {
                const isSelected = selectedUser?._id === user._id;
                return (
                  <button
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full p-4 flex items-center justify-between text-left transition-all duration-200 ${
                      isSelected 
                        ? 'bg-[#efeefc]/40 border-l-[3.5px] border-[#6366f1]' 
                        : 'hover:bg-gray-50 border-l-[3.5px] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate leading-snug">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.enrolledCourses?.length > 0
                          ? 'bg-indigo-50 text-[#6366f1]'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {user.enrolledCourses?.length || 0} Courses
                      </span>
                      <ChevronRight size={14} className={`text-gray-400 transition-transform ${isSelected ? 'translate-x-0.5 text-[#6366f1]' : ''}`} />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Student Profile Detail */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {selectedUser ? (
            <>
              {/* Profile Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#6366f1] shrink-0 border border-indigo-100">
                  <User size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{selectedUser.name}</h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      {selectedUser.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Registered {new Date(selectedUser.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignments Container */}
              <div className="grid grid-cols-1 gap-6 flex-1">
                
                {/* Enrolled Courses */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col p-5 space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen size={16} className="text-[#6366f1]" />
                    <span>Active Enrolled Courses ({selectedUser.enrolledCourses?.length || 0})</span>
                  </h3>
                  
                  {selectedUser.enrolledCourses?.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {selectedUser.enrolledCourses.map(course => {
                        const cid = (course as any)._id || course.id;
                        const isUnassigning = actionLoading === `unassign-${cid}`;
                        return (
                          <div key={cid} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 group">
                            <div className="flex items-center gap-3">
                              {course.instructorImage ? (
                                <img src={course.instructorImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />
                              ) : (
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${course.bgGradient || 'from-[#6366f1] to-[#8b5cf6]'} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                  {course.title.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 leading-snug">{course.title}</h4>
                                <span className="text-[10px] font-bold text-[#6366f1] bg-[#efeefc] px-1.5 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">
                                  {course.tag || 'DMI'}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleUnassign(cid)}
                              disabled={actionLoading !== null}
                              className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center shrink-0 disabled:opacity-50 animate-in fade-in"
                              title="Unenroll Student"
                            >
                              {isUnassigning ? (
                                <Loader2 size={16} className="animate-spin text-red-500" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl">
                      <p className="text-xs font-medium">No courses currently assigned to this student</p>
                    </div>
                  )}
                </div>

                {/* Available Courses */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col p-5 space-y-4 h-[42vh]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <UserPlus size={16} className="text-emerald-500" />
                      <span>Available Courses to Assign</span>
                    </h3>
                    <div className="relative w-full sm:w-56 shrink-0">
                      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6366f1] focus:bg-white transition-all placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-gray-100 pr-1 no-scrollbar">
                    {loadingCourses ? (
                      <div className="h-full flex items-center justify-center py-6">
                        <Loader2 size={20} className="animate-spin text-gray-400" />
                      </div>
                    ) : unassignedCourses.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center py-8 text-center text-gray-400">
                        <p className="text-xs font-medium">No other available courses to assign</p>
                      </div>
                    ) : (
                      unassignedCourses.map(course => {
                        const cid = (course as any)._id || course.id;
                        const isAssigning = actionLoading === `assign-${cid}`;
                        return (
                          <div key={cid} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              {course.instructorImage ? (
                                <img src={course.instructorImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />
                              ) : (
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${course.bgGradient || 'from-[#6366f1] to-[#8b5cf6]'} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                  {course.title.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h4 className="text-xs font-semibold text-gray-900 leading-snug">{course.title}</h4>
                                <span className="text-[10px] text-gray-500 mt-0.5 inline-block">
                                  {course.tag || 'DMI'} • {course.hours}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAssign(cid)}
                              disabled={actionLoading !== null}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                            >
                              {isAssigning ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Plus size={12} />
                              )}
                              <span>Assign</span>
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full min-h-[400px]">
              <User size={48} className="opacity-30 mb-3" />
              <p className="text-sm font-semibold">No student selected</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">Select a student from the sidebar list to manage their course enrollments.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

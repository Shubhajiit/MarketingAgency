'use client';

export default function AdminVideosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Video Management</h1>
        <button className="bg-[#009ee3] hover:bg-[#0088cc] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Upload New Video
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 text-center text-gray-500">
          Video management functionality will be implemented here.
        </div>
      </div>
    </div>
  );
}

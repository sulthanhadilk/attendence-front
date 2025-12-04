import React from 'react';
export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:border-indigo-200 transition">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 text-xl">{icon || '■'}</div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

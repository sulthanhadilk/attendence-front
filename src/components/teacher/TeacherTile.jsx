import React from 'react';
export default function TeacherTile({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 hover:bg-indigo-50 transition text-left w-full"
    >
      <div className="p-3 rounded-full bg-indigo-50 flex-shrink-0">
        {icon || <div className="w-6 h-6" />}
      </div>
      <div className="text-sm font-medium text-gray-800">{label}</div>
    </button>
  );
}

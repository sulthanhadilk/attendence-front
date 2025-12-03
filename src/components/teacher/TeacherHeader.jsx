import React from 'react';

export default function TeacherHeader({ teacher }) {
  const initial = teacher?.name?.[0] || 'T';
  const photoUrl = teacher?.photoUrl;

  return (
    <div className="bg-indigo-600 text-white rounded-b-3xl p-4 flex items-center gap-4">
      {photoUrl ? (
        <img 
          src={photoUrl} 
          alt={teacher?.name || 'Teacher'} 
          className="w-16 h-16 rounded-full border-4 border-white object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-full border-4 border-white bg-indigo-400 flex items-center justify-center text-2xl font-semibold">
          {initial}
        </div>
      )}
      <div className="flex-1">
        <div className="text-lg font-semibold">{teacher?.name || 'Teacher'}</div>
        <div className="text-sm text-indigo-100">Staff Code: {teacher?.staffCode || 'N/A'}</div>
        {teacher?.department && teacher?.designation && (
          <div className="text-sm text-indigo-100">{teacher.department} • {teacher.designation}</div>
        )}
      </div>
    </div>
  );
}

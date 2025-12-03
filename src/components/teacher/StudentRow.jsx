import React from 'react';

export default function StudentRow({ student, showAttendance = false, showFines = false, showLastMark = false, onClick }) {
  const attendancePercent = student.attendancePercent || 0;
  const finesCount = student.finesCount || 0;
  const lastMark = student.lastMark || '-';

  const getAttendanceColor = (percent) => {
    if (percent >= 75) return 'text-green-600';
    if (percent >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:border-indigo-300 transition ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          {student.roll_number || '?'}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{student.user_id?.name || student.name || 'Student'}</p>
          <p className="text-sm text-gray-500">{student.user_id?.email || student.email || ''}</p>
        </div>
      </div>
      {(showAttendance || showFines || showLastMark) && (
        <div className="flex gap-4 mt-3 text-sm">
          {showAttendance && (
            <div>
              <span className="text-gray-500">Attendance: </span>
              <span className={`font-semibold ${getAttendanceColor(attendancePercent)}`}>
                {attendancePercent.toFixed(1)}%
              </span>
            </div>
          )}
          {showFines && (
            <div>
              <span className="text-gray-500">Fines: </span>
              <span className={`font-semibold ${finesCount > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                {finesCount}
              </span>
            </div>
          )}
          {showLastMark && (
            <div>
              <span className="text-gray-500">Last Mark: </span>
              <span className="font-semibold text-gray-700">{lastMark}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

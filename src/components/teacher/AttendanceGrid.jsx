import React from 'react';

export default function AttendanceGrid({ students, hours = [1, 2, 3, 4, 5], records, onStatusChange }) {
  const getStatus = (studentId, hourIndex) => {
    const rec = records?.find(r => String(r.studentId) === String(studentId) && r.hourIndex === hourIndex);
    return rec?.status || 'unmarked';
  };

  const statusColors = {
    present: 'bg-green-100 text-green-700',
    absent: 'bg-red-100 text-red-700',
    late: 'bg-yellow-100 text-yellow-700',
    letoff: 'bg-blue-100 text-blue-700',
    unmarked: 'bg-gray-100 text-gray-500'
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-sm">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="p-2 text-left">Student</th>
            {hours.map(h => (
              <th key={h} className="p-2 text-center">H{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id} className="border-b hover:bg-indigo-50">
              <td className="p-2">{student.user_id?.name || student.name || 'Student'}</td>
              {hours.map(h => {
                const status = getStatus(student._id, h);
                return (
                  <td key={h} className="p-2 text-center">
                    {onStatusChange ? (
                      <select
                        value={status}
                        onChange={(e) => onStatusChange(student._id, h, e.target.value)}
                        className={`px-2 py-1 rounded text-xs ${statusColors[status]}`}
                      >
                        <option value="unmarked">-</option>
                        <option value="present">P</option>
                        <option value="absent">A</option>
                        <option value="late">L</option>
                        <option value="letoff">LO</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[status]}`}>
                        {status === 'present' ? 'P' : status === 'absent' ? 'A' : status === 'late' ? 'L' : status === 'letoff' ? 'LO' : '-'}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';
export default function MarkAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [hours, setHours] = useState([1, 2, 3, 4, 5]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    apiRequest(API_ENDPOINTS.TEACHER_CLASSES)
      .then(setClasses)
      .catch(err => setMessage(err.message));
  }, []);
  useEffect(() => {
    if (!selectedClass) return;
    apiRequest(`${API_ENDPOINTS.TEACHER_CLASS_STUDENTS.replace(':classId', selectedClass)}`)
      .then(data => {
        setStudents(data);
        const initial = {};
        data.forEach(s => {
          hours.forEach(h => {
            initial[`${s._id}-${h}`] = 'present';
          });
        });
        setStatusMap(initial);
      })
      .catch(err => setMessage(err.message));
  }, [selectedClass]);
  const handleStatusChange = (studentId, hour, value) => {
    setStatusMap(prev => ({ ...prev, [`${studentId}-${hour}`]: value }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedClass) return;
    setLoading(true);
    setMessage('');
    try {
      const records = [];
      students.forEach(s => {
        hours.forEach(h => {
          records.push({
            studentId: s._id,
            hourIndex: h,
            status: statusMap[`${s._id}-${h}`] || 'unmarked'
          });
        });
      });
      await apiRequest(API_ENDPOINTS.TEACHER_ATTENDANCE_MARK, {
        method: 'POST',
        body: JSON.stringify({ classId: selectedClass, date, records })
      });
      setMessage('Attendance saved successfully');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Mark Hour-wise Attendance</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select class</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          {students.length > 0 && (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Student</th>
                    {hours.map(h => (
                      <th key={h} className="p-2 text-center">H{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id} className="border-b">
                      <td className="p-2">
                        <div className="font-medium">{s.user_id?.name || 'Student'}</div>
                        <div className="text-xs text-gray-500">{s.user_id?.roll_no}</div>
                      </td>
                      {hours.map(h => (
                        <td key={h} className="p-2 text-center">
                          <select
                            value={statusMap[`${s._id}-${h}`] || 'present'}
                            onChange={e => handleStatusChange(s._id, h, e.target.value)}
                            className="border rounded-lg px-2 py-1 text-xs"
                          >
                            <option value="present">P</option>
                            <option value="absent">A</option>
                            <option value="late">L</option>
                            <option value="letoff">LO</option>
                            <option value="unmarked">-</option>
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !selectedClass}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Attendance'}
          </button>
          {message && <div className="text-sm text-gray-700">{message}</div>}
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';

export default function PrayerAttendance() {
  const [prayerType, setPrayerType] = useState('SUBH');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes`)
      .then(setClasses)
      .catch(err => setMessage(err.message));
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes/${selectedClass}/students`)
      .then(data => {
        setStudents(data);
        const initial = {};
        data.forEach(s => {
          initial[s._id] = 'present';
        });
        setStatusMap(initial);
      })
      .catch(err => setMessage(err.message));
  }, [selectedClass]);

  const handleStatusChange = (studentId, value) => {
    setStatusMap(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedClass) {
      setMessage('Please select a class');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const records = students.map(s => ({
        studentId: s._id,
        status: statusMap[s._id] || 'absent'
      }));

      await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/prayer/mark`, {
        method: 'POST',
        body: JSON.stringify({ prayerType, date, records })
      });

      setMessage('Prayer attendance saved successfully');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const presentCount = Object.values(statusMap).filter(v => v === 'present').length;
  const absentCount = students.length - presentCount;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Prayer Attendance</h1>
          <p className="text-gray-600">Mark attendance for Subh (Fajr) and Maghrib prayers</p>
        </div>

        {/* Prayer Type Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setPrayerType('SUBH')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              prayerType === 'SUBH'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            Subh (Fajr)
          </button>
          <button
            onClick={() => setPrayerType('MAGHRIB')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              prayerType === 'MAGHRIB'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            Maghrib
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select class</option>
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name || c.section}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>

            {students.length > 0 && (
              <>
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                    <div className="text-sm text-green-700">Present</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                    <div className="text-sm text-red-700">Absent</div>
                  </div>
                </div>

                {/* Student List */}
                <div className="space-y-2">
                  {students.map(s => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          statusMap[s._id] === 'present' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {s.user_id?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{s.user_id?.name || 'Student'}</div>
                          <div className="text-sm text-gray-500">{s.user_id?.roll_no || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s._id, 'present')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            statusMap[s._id] === 'present'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s._id, 'absent')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            statusMap[s._id] === 'absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes('success') 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-blue-50 border border-blue-200 text-blue-700'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedClass || students.length === 0}
              className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : `Save ${prayerType === 'SUBH' ? 'Subh' : 'Maghrib'} Attendance`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

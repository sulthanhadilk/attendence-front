import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';
export default function AttendanceReport() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [report, setReport] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes`)
      .then(setClasses)
      .catch(err => setMessage(err.message));
  }, []);
  const loadReport = async () => {
    if (!selectedClass || !fromDate || !toDate) {
      setMessage('Please select class and date range');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const data = await apiRequest(
        `${API_ENDPOINTS.TEACHER_DASHBOARD}/attendance/report?classId=${selectedClass}&from=${fromDate}&to=${toDate}`
      );
      setReport(data);
      // Load student details
      const studentsData = await apiRequest(
        `${API_ENDPOINTS.TEACHER_DASHBOARD}/classes/${selectedClass}/students`
      );
      const studentMap = {};
      studentsData.forEach(s => {
        studentMap[s._id] = s;
      });
      setStudents(studentMap);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };
  const exportToCSV = () => {
    const headers = ['Student Name', 'Roll No', 'Total Hours', 'Present Hours', 'Attendance %'];
    const rows = report.map(r => {
      const student = students[r.studentId];
      return [
        student?.user_id?.name || 'Unknown',
        student?.user_id?.roll_no || '',
        r.totalHours,
        r.presentHours,
        r.attendancePct.toFixed(2)
      ];
    });
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${selectedClass}-${Date.now()}.csv`;
    a.click();
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
          <p className="text-gray-600">View detailed attendance statistics for your classes</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select class</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name || c.section}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={loadReport}
                disabled={loading}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Generate Report'}
              </button>
            </div>
          </div>
          {message && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              {message}
            </div>
          )}
          {report.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Report Results ({report.length} students)</h3>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  <i className="fas fa-download mr-2"></i>
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="p-3 text-left">Student Name</th>
                      <th className="p-3 text-left">Roll No</th>
                      <th className="p-3 text-center">Total Hours</th>
                      <th className="p-3 text-center">Present</th>
                      <th className="p-3 text-center">Attendance %</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map(r => {
                      const student = students[r.studentId];
                      const pct = r.attendancePct;
                      const statusColor = pct >= 75 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600';
                      const statusBg = pct >= 75 ? 'bg-green-100' : pct >= 60 ? 'bg-yellow-100' : 'bg-red-100';
                      return (
                        <tr key={r.studentId} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{student?.user_id?.name || 'Unknown'}</td>
                          <td className="p-3 text-gray-600">{student?.user_id?.roll_no || 'N/A'}</td>
                          <td className="p-3 text-center">{r.totalHours}</td>
                          <td className="p-3 text-center">{r.presentHours}</td>
                          <td className="p-3 text-center">
                            <span className={`font-semibold ${statusColor}`}>
                              {pct.toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}>
                              {pct >= 75 ? 'Good' : pct >= 60 ? 'Warning' : 'Critical'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

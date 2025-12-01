import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/api';

function DueSheet() {
  const [dueData, setDueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, unpaid, waived
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDueSheet();
  }, []);

  const fetchDueSheet = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.TEACHER_FINES}?status=unpaid,waived`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch fines');

      // Aggregate by student
      const studentMap = {};
      data.forEach(fine => {
        const studentId = fine.student?._id || fine.studentId;
        if (!studentId) return;

        if (!studentMap[studentId]) {
          studentMap[studentId] = {
            studentId,
            studentName: fine.student?.personalDetails?.name || 'Unknown',
            rollNumber: fine.student?.rollNumber || 'N/A',
            className: fine.class?.name || 'N/A',
            unpaidFines: [],
            waivedFines: [],
            totalUnpaid: 0,
            totalWaived: 0
          };
        }

        if (fine.status === 'unpaid') {
          studentMap[studentId].unpaidFines.push(fine);
          studentMap[studentId].totalUnpaid += fine.amount || 0;
        } else if (fine.status === 'waived') {
          studentMap[studentId].waivedFines.push(fine);
          studentMap[studentId].totalWaived += fine.amount || 0;
        }
      });

      const aggregated = Object.values(studentMap);
      setDueData(aggregated);
      setError('');
    } catch (err) {
      console.error('Fetch due sheet error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = dueData
    .filter(student => {
      if (filter === 'unpaid' && student.unpaidFines.length === 0) return false;
      if (filter === 'waived' && student.waivedFines.length === 0) return false;
      return true;
    })
    .filter(student =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const grandTotalUnpaid = dueData.reduce((sum, s) => sum + s.totalUnpaid, 0);
  const grandTotalWaived = dueData.reduce((sum, s) => sum + s.totalWaived, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading Due Sheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">💰 Due Sheet</h1>
              <p className="text-gray-600">Student-wise fine dues summary</p>
            </div>
            <button
              onClick={fetchDueSheet}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl w-fit"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700">⚠️ {error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-lg p-6">
            <div className="text-sm opacity-90 mb-2">Total Unpaid Amount</div>
            <div className="text-3xl font-bold">₹{grandTotalUnpaid.toFixed(2)}</div>
            <div className="text-sm opacity-75 mt-1">{dueData.filter(s => s.totalUnpaid > 0).length} students</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl shadow-lg p-6">
            <div className="text-sm opacity-90 mb-2">Total Waived Amount</div>
            <div className="text-3xl font-bold">₹{grandTotalWaived.toFixed(2)}</div>
            <div className="text-sm opacity-75 mt-1">{dueData.filter(s => s.totalWaived > 0).length} students</div>
          </div>
          <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-2xl shadow-lg p-6">
            <div className="text-sm opacity-90 mb-2">Total Students with Fines</div>
            <div className="text-3xl font-bold">{dueData.length}</div>
            <div className="text-sm opacity-75 mt-1">across all classes</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unpaid')}
                className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                  filter === 'unpaid'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unpaid Only
              </button>
              <button
                onClick={() => setFilter('waived')}
                className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                  filter === 'waived'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Waived Only
              </button>
            </div>
          </div>
        </div>

        {/* Due Sheet Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg">No fines found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Roll No.</th>
                    <th className="px-6 py-4 text-left font-semibold">Student Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Class</th>
                    <th className="px-6 py-4 text-center font-semibold">Unpaid Fines</th>
                    <th className="px-6 py-4 text-center font-semibold">Unpaid Amount</th>
                    <th className="px-6 py-4 text-center font-semibold">Waived Fines</th>
                    <th className="px-6 py-4 text-center font-semibold">Waived Amount</th>
                    <th className="px-6 py-4 text-center font-semibold">Total Due</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((student, idx) => (
                    <tr
                      key={student.studentId}
                      className={idx % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}
                    >
                      <td className="px-6 py-4 font-mono text-sm">{student.rollNumber}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{student.studentName}</td>
                      <td className="px-6 py-4 text-gray-600">{student.className}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-full font-semibold text-sm">
                          {student.unpaidFines.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-red-600">
                        ₹{student.totalUnpaid.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-sm">
                          {student.waivedFines.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-yellow-600">
                        ₹{student.totalWaived.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-800">
                        ₹{student.totalUnpaid.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DueSheet;

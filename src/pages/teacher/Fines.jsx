import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';
export default function Fines() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [fines, setFines] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    reason: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  useEffect(() => {
    loadClasses();
    loadFines();
  }, []);
  useEffect(() => {
    if (selectedClass) {
      loadStudents(selectedClass);
    }
  }, [selectedClass]);
  const loadClasses = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes`);
      setClasses(data);
    } catch (err) {
      setMessage(err.message);
    }
  };
  const loadStudents = async (classId) => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes/${classId}/students`);
      setStudents(data);
    } catch (err) {
      setMessage(err.message);
    }
  };
  const loadFines = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/fines`);
      setFines(data);
    } catch (err) {
      setMessage(err.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/fines/create`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setMessage('Fine created successfully');
      setFormData({ studentId: '', amount: '', reason: '', dueDate: '' });
      loadFines();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };
  const updateFineStatus = async (fineId, status) => {
    try {
      await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/fines/${fineId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, paidAt: status === 'paid' ? new Date() : null })
      });
      setMessage(`Fine marked as ${status}`);
      loadFines();
    } catch (err) {
      setMessage(err.message);
    }
  };
  const filteredFines = fines.filter(f => {
    if (filterStatus === 'all') return true;
    return f.status === filterStatus || (filterStatus === 'unpaid' && f.is_paid === false);
  });
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Fine Management</h1>
          <p className="text-gray-600">Create and manage student fines</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Fine</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <select
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                  disabled={!selectedClass}
                >
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.user_id?.name} ({s.user_id?.roll_no})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Enter amount"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g., Late submission, Absent without notice"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('success')
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Fine'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Fines List</h2>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="waived">Waived</option>
              </select>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredFines.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No fines found</div>
              ) : (
                filteredFines.map(fine => {
                  const statusColors = {
                    unpaid: 'bg-red-100 text-red-700',
                    paid: 'bg-green-100 text-green-700',
                    waived: 'bg-blue-100 text-blue-700'
                  };
                  const status = fine.status || (fine.is_paid ? 'paid' : 'unpaid');
                  return (
                    <div key={fine._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-gray-900">
                            {fine.student_id?.user_id?.name || 'Student'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {fine.student_id?.user_id?.roll_no}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-indigo-600">₹{fine.amount}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                            {status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{fine.reason || fine.custom_reason}</div>
                      <div className="text-xs text-gray-500 mb-3">
                        Issued: {new Date(fine.issuedAt || fine.date).toLocaleDateString()}
                        {fine.dueDate && ` • Due: ${new Date(fine.dueDate).toLocaleDateString()}`}
                      </div>
                      {status === 'unpaid' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateFineStatus(fine._id, 'paid')}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => updateFineStatus(fine._id, 'waived')}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                          >
                            Waive
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

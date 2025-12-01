import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';

export default function Conduct() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    severity: 'medium',
    remark: ''
  });
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents(selectedClass);
      loadRemarks(selectedClass);
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

  const loadRemarks = async (classId) => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/class/${classId}/conduct`);
      setRemarks(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;

    setLoading(true);
    setMessage('');

    try {
      await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/class/${selectedClass}/conduct`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setMessage('Conduct remark added successfully');
      setFormData({ studentId: '', severity: 'medium', remark: '' });
      loadRemarks(selectedClass);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Student Conduct</h1>
          <p className="text-gray-600">Add and view conduct remarks for students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Remark Form */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Add Conduct Remark</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                <textarea
                  value={formData.remark}
                  onChange={e => setFormData({ ...formData, remark: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows="4"
                  placeholder="Enter your remark about student conduct..."
                  required
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
                {loading ? 'Adding...' : 'Add Remark'}
              </button>
            </form>
          </div>

          {/* Remarks List */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Remarks</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {remarks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {selectedClass ? 'No remarks found' : 'Select a class to view remarks'}
                </div>
              ) : (
                remarks.map(remark => {
                  const severityColors = {
                    low: 'bg-blue-100 text-blue-700',
                    medium: 'bg-yellow-100 text-yellow-700',
                    high: 'bg-red-100 text-red-700'
                  };

                  return (
                    <div key={remark._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-gray-900">
                          Student ID: {remark.studentId?.slice(-6) || 'Unknown'}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[remark.severity]}`}>
                          {remark.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{remark.remark}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(remark.date || remark.createdAt).toLocaleString()}
                      </div>
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

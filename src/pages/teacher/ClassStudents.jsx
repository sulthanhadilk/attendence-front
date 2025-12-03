import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';

export default function ClassStudents() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClasses();
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
    setLoading(true);
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes/${classId}/students`);
      setStudents(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const name = s.user_id?.name?.toLowerCase() || '';
    const roll = s.user_id?.roll_no?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return name.includes(term) || roll.includes(term);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Class Students</h1>
          <p className="text-gray-600">View and manage students in your classes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name or roll number..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {selectedClass ? 'No students found' : 'Please select a class'}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStudents.map(s => (
                  <div key={s._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg">
                        {s.user_id?.name?.charAt(0) || 'S'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{s.user_id?.name || 'Student'}</h3>
                        <p className="text-sm text-gray-600">Roll No: {s.user_id?.roll_no || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Email: {s.user_id?.email || 'N/A'}</p>
                        
                        {/* Quick Stats */}
                        <div className="mt-3 flex gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            Active
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            ID: {s._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-500">Attendance</div>
                        <div className="text-sm font-semibold text-gray-900">--%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Fines</div>
                        <div className="text-sm font-semibold text-gray-900">--</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Remarks</div>
                        <div className="text-sm font-semibold text-gray-900">--</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

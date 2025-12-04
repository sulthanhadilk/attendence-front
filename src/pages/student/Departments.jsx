import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/student/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(data.departments || []);
    } catch (error) {
      console.error('Departments error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate('/student/dashboard')} className="mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Departments</h1>
        <p className="text-white/80 text-sm mt-1">Academic departments in our college</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Departments</p>
              <p className="text-3xl font-bold mt-1">{departments.length}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Departments List */}
        <div className="space-y-3">
          {departments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500">No departments available</p>
            </div>
          ) : (
            departments.map((dept) => (
              <div key={dept._id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {dept.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{dept.name}</h3>
                    {dept.code && (
                      <p className="text-sm text-gray-500 mt-1">Code: {dept.code}</p>
                    )}
                    {dept.description && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{dept.description}</p>
                    )}
                    
                    {/* Department Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {dept.hodId && (
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                          <svg className="w-5 h-5 text-blue-600 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="text-xs text-blue-700 font-medium">HOD</p>
                          <p className="text-xs text-blue-600 mt-1">{dept.hodId.name || 'Assigned'}</p>
                        </div>
                      )}
                      {dept.teacherCount !== undefined && (
                        <div className="bg-green-50 rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-green-700">{dept.teacherCount || 0}</p>
                          <p className="text-xs text-green-600 mt-1">Teachers</p>
                        </div>
                      )}
                      {dept.studentCount !== undefined && (
                        <div className="bg-purple-50 rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-purple-700">{dept.studentCount || 0}</p>
                          <p className="text-xs text-purple-600 mt-1">Students</p>
                        </div>
                      )}
                    </div>

                    {/* Department Contact */}
                    {(dept.email || dept.phone) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Contact Information:</p>
                        <div className="flex flex-wrap gap-2">
                          {dept.email && (
                            <a 
                              href={`mailto:${dept.email}`}
                              className="flex items-center text-xs bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                              <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-gray-700">{dept.email}</span>
                            </a>
                          )}
                          {dept.phone && (
                            <a 
                              href={`tel:${dept.phone}`}
                              className="flex items-center text-xs bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                              <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-gray-700">{dept.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Departments
          </h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            Each department is led by a Head of Department (HOD) and consists of faculty members 
            specializing in specific academic areas. Departments organize courses, conduct exams, 
            and maintain academic standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Departments;

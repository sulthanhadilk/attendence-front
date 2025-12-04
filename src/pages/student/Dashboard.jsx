import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/student/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboard(data);
    } catch (error) {
      console.error('Dashboard error:', error);
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

  if (!dashboard) return null;

  const { student, stats, courses } = dashboard;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-b-3xl p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold">{student.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{student.name}</h1>
            <p className="text-white/90 text-sm">{student.rollNo} • {student.class}</p>
            <p className="text-white/80 text-xs">{student.department}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="text-3xl font-bold">{stats.attendancePercentage}%</div>
            <div className="text-white/80 text-sm">Attendance</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="text-3xl font-bold">{stats.totalClasses}</div>
            <div className="text-white/80 text-sm">Total Classes</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4 mt-4">
        {/* Today's Overview */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Today's Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.todayHourly}</div>
              <div className="text-xs text-gray-600">Classes Today</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.todayPrayer}</div>
              <div className="text-xs text-gray-600">Prayers Marked</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/student/attendance')}
              className="flex flex-col items-center p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Attendance</span>
            </button>

            <button
              onClick={() => navigate('/student/fees')}
              className="flex flex-col items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition"
            >
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Fees</span>
            </button>

            <button
              onClick={() => navigate('/student/assessment')}
              className="flex flex-col items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Results</span>
            </button>

            <button
              onClick={() => navigate('/student/library')}
              className="flex flex-col items-center p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition"
            >
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Library</span>
            </button>

            <button
              onClick={() => navigate('/student/id-card')}
              className="flex flex-col items-center p-3 bg-red-50 rounded-xl hover:bg-red-100 transition"
            >
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">ID Card</span>
            </button>

            <button
              onClick={() => navigate('/student/profile')}
              className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-700">Profile</span>
            </button>
          </div>
        </div>

        {/* Enrolled Courses */}
        {courses && courses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">My Courses</h2>
            <div className="space-y-2">
              {courses.slice(0, 5).map((course) => (
                <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{course.name}</div>
                    <div className="text-xs text-gray-500">{course.code}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.type === 'school' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {course.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around">
          <button className="flex flex-col items-center text-indigo-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>
          <button onClick={() => navigate('/student/attendance')} className="flex flex-col items-center text-gray-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-xs mt-1">Attendance</span>
          </button>
          <button onClick={() => navigate('/student/assessment')} className="flex flex-col items-center text-gray-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs mt-1">Results</span>
          </button>
          <button onClick={() => navigate('/student/menu')} className="flex flex-col items-center text-gray-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

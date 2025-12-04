import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Attendance = () => {
  const [view, setView] = useState('course'); // course, hourly, prayer
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [hourlyAttendance, setHourlyAttendance] = useState([]);
  const [prayerAttendance, setPrayerAttendance] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendance();
  }, [view, selectedMonth, selectedYear]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (view === 'course') {
        const { data } = await axios.get('/api/student/attendance/course', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourseAttendance(data.attendance || []);
      } else if (view === 'hourly') {
        const { data } = await axios.get(`/api/student/attendance/hourly/${selectedYear}/${selectedMonth}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHourlyAttendance(data.attendance || []);
      } else if (view === 'prayer') {
        const { data } = await axios.get('/api/student/attendance/prayer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPrayerAttendance(data);
      }
    } catch (error) {
      console.error('Attendance error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      present: 'bg-green-100 text-green-700',
      absent: 'bg-red-100 text-red-700',
      late: 'bg-yellow-100 text-yellow-700',
      letoff: 'bg-blue-100 text-blue-700',
      unmarked: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || colors.unmarked;
  };

  const getStatusIcon = (status) => {
    if (status === 'present') return '✓';
    if (status === 'absent') return '✗';
    if (status === 'late') return '⏰';
    if (status === 'letoff') return '📝';
    return '—';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate('/student/dashboard')} className="mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-white/80 text-sm mt-1">View your attendance records</p>
      </div>

      {/* View Selector */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm p-2 flex space-x-2">
          <button
            onClick={() => setView('course')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
              view === 'course' ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
          >
            Course
          </button>
          <button
            onClick={() => setView('hourly')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
              view === 'hourly' ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setView('prayer')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
              view === 'prayer' ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
          >
            Prayer
          </button>
        </div>
      </div>

      {/* Month/Year Selector for Hourly */}
      {view === 'hourly' && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
            <button
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedMonth(12);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center">
              <div className="font-bold text-gray-800">
                {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
              </div>
            </div>
            <button
              onClick={() => {
                if (selectedMonth === 12) {
                  setSelectedMonth(1);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Course View */}
            {view === 'course' && (
              <div className="space-y-3">
                {courseAttendance.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
                    No attendance records found
                  </div>
                ) : (
                  courseAttendance.map((item, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800">{item.course?.name}</h3>
                          <p className="text-xs text-gray-500">{item.course?.code}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">{item.percentage}%</div>
                          <div className="text-xs text-gray-500">{item.present}/{item.total}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">P: {item.present}</span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded">A: {item.absent}</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">L: {item.late}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Hourly View */}
            {view === 'hourly' && (
              <div className="space-y-3">
                {hourlyAttendance.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
                    No attendance records for this month
                  </div>
                ) : (
                  hourlyAttendance.map((day, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm p-4">
                      <div className="font-bold text-gray-800 mb-3">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {['H1', 'H2', 'H3', 'H4', 'H5'].map((hour) => {
                          const hourData = day.hours[hour];
                          return (
                            <div key={hour} className="text-center">
                              <div className="text-xs font-medium text-gray-600 mb-1">{hour}</div>
                              <div className={`p-2 rounded-lg ${
                                hourData ? getStatusColor(hourData.status) : 'bg-gray-50 text-gray-400'
                              }`}>
                                <div className="text-lg">{hourData ? getStatusIcon(hourData.status) : '—'}</div>
                              </div>
                              {hourData && (
                                <div className="text-xs text-gray-500 mt-1 truncate">{hourData.course}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Prayer View */}
            {view === 'prayer' && prayerAttendance && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">🌅</div>
                      <h3 className="font-bold text-gray-800">Subh</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">{prayerAttendance.stats.subh.percentage}%</div>
                      <div className="text-sm text-gray-500">{prayerAttendance.stats.subh.present}/{prayerAttendance.stats.subh.total}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">🌆</div>
                      <h3 className="font-bold text-gray-800">Maghrib</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">{prayerAttendance.stats.maghrib.percentage}%</div>
                      <div className="text-sm text-gray-500">{prayerAttendance.stats.maghrib.present}/{prayerAttendance.stats.maghrib.total}</div>
                    </div>
                  </div>
                </div>

                {/* Recent Prayer Records */}
                <div className="bg-white rounded-2xl shadow-sm p-4">
                  <h3 className="font-bold text-gray-800 mb-3">Recent Records</h3>
                  <div className="space-y-2">
                    {prayerAttendance.records.slice(0, 10).map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{record.prayerType}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Attendance;

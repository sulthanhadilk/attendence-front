import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../utils/api';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['H1', 'H2', 'H3', 'H4', 'H5'];
function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchTimetable();
  }, []);
  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.TEACHER_TIMETABLE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch timetable');
      // data.schedule: [{ day, periods: [{ hour, subject, class }] }]
      setTimetable(data.schedule || []);
      setError('');
    } catch (err) {
      console.error('Fetch timetable error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const getPeriodData = (day, hour) => {
    const daySchedule = timetable.find(d => d.day === day);
    if (!daySchedule) return null;
    return daySchedule.periods.find(p => p.hour === hour) || null;
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading Timetable...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">📅 My Timetable</h1>
              <p className="text-gray-600">Your weekly class schedule</p>
            </div>
            <button
              onClick={fetchTimetable}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <th className="px-6 py-4 text-left text-white font-semibold border-r border-emerald-500">
                    Day / Hour
                  </th>
                  {PERIODS.map(period => (
                    <th key={period} className="px-6 py-4 text-center text-white font-semibold border-r border-emerald-500 last:border-r-0">
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day, dayIdx) => (
                  <tr key={day} className={dayIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-semibold text-gray-700 border-r border-gray-200">
                      {day}
                    </td>
                    {PERIODS.map(hour => {
                      const periodData = getPeriodData(day, hour);
                      return (
                        <td key={hour} className="px-4 py-4 text-center border-r border-gray-200 last:border-r-0">
                          {periodData ? (
                            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
                              <div className="font-semibold text-emerald-800 text-sm mb-1">
                                {periodData.subject?.name || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-600">
                                {periodData.class?.name || 'N/A'}
                              </div>
                              {periodData.startTime && periodData.endTime && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {periodData.startTime} - {periodData.endTime}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm">—</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📖 Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded"></div>
              <span className="text-sm text-gray-700">Scheduled Class</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span className="text-sm text-gray-700">Free Period</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-mono">H1-H5</span>
              <span className="text-sm text-gray-700">= Hour 1 to Hour 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Timetable;

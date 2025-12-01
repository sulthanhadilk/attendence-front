import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';

export default function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest(API_ENDPOINTS.TEACHER_DASHBOARD);
        setData(res);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">{error}</div>;

  const { teacher, stats } = data || {};

  const tiles = [
    { label: 'Mark Attendance', path: '/teacher/attendance' },
    { label: 'Attendance Report', path: '/teacher/attendance/report' },
    { label: 'Prayer Attendance', path: '/teacher/prayer' },
    { label: 'Timetable', path: '/teacher/timetable' },
    { label: 'Add Exam Marks', path: '/teacher/exams' },
    { label: 'Fines', path: '/teacher/fines' },
    { label: 'Due Sheet', path: '/teacher/due-sheet' },
    { label: 'Students List', path: '/teacher/students' },
    { label: 'Student Notifications', path: '/teacher/notifications' },
    { label: 'Student Conduct', path: '/teacher/conduct' },
    { label: 'Activities', path: '/teacher/activities' },
    { label: 'Question Bank', path: '/teacher/question-bank' },
    { label: 'Important Links', path: '/teacher/resources' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white rounded-b-3xl p-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-white bg-indigo-400 flex items-center justify-center text-2xl font-semibold">
          {teacher?.name?.[0] || 'T'}
        </div>
        <div>
          <div className="text-lg font-semibold">{teacher?.name || 'Teacher'}</div>
          <div className="text-sm opacity-80">Staff Code: {teacher?.staffCode || 'N/A'}</div>
          <div className="text-sm opacity-80">{teacher?.department} • {teacher?.designation}</div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col">
            <div className="text-xs text-gray-500">Classes</div>
            <div className="text-xl font-semibold">{stats?.classesAssigned ?? 0}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col">
            <div className="text-xs text-gray-500">Today Hours Marked</div>
            <div className="text-xl font-semibold">{stats?.todayMarkedHours ?? 0}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col">
            <div className="text-xs text-gray-500">Pending Fines</div>
            <div className="text-xl font-semibold">{stats?.pendingFines ?? 0}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col">
            <div className="text-xs text-gray-500">Upcoming Exams</div>
            <div className="text-xl font-semibold">{stats?.upcomingExams ?? 0}</div>
          </div>
        </div>

        {/* Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiles.map(tile => (
            <button
              key={tile.path}
              onClick={() => navigate(tile.path)}
              className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-start gap-1 hover:bg-indigo-50 transition"
            >
              <div className="p-3 rounded-full bg-indigo-50 mb-1" />
              <div className="text-sm font-medium text-gray-800">{tile.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

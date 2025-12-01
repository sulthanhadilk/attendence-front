import { useCallback, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function useAdminData(token) {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalClasses: 0, todayAttendance: 0 });
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const authHeader = token ? { Authorization: 'Bearer ' + token } : {};

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(API + '/api/admin/dashboard', { headers: authHeader });
      if (res.data?.stats) {
        setStats({
          totalStudents: res.data.stats.totalStudents || 0,
          totalTeachers: res.data.stats.totalTeachers || 0,
          totalClasses: res.data.stats.totalClasses || 0,
          todayAttendance: res.data.stats.todayAttendance || 0
        });
      }
    } catch (e) {
      console.error('Failed to fetch stats', e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStudents = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(API + '/api/admin/students', { headers: authHeader });
      setStudents(res.data || []);
    } catch (e) {
      console.error('Failed to fetch students', e);
    }
  }, [token]);

  const fetchTeachers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(API + '/api/admin/teachers', { headers: authHeader });
      setTeachers(res.data || []);
    } catch (e) {
      console.error('Failed to fetch teachers', e);
    }
  }, [token]);

  const fetchAttendanceReport = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(API + '/api/admin/reports/attendance', { headers: authHeader });
      setReportData({ type: 'attendance', data: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch attendance report', e);
    }
  }, [token]);

  const exportAttendance = useCallback(async () => {
    if (!token) return { ok: false, message: 'Not authenticated' };
    try {
      setLoading(true);
      const res = await axios.get(API + '/api/admin/export/attendance', { headers: authHeader });
      if (res.data.fileName) {
        const downloadUrl = `${API}/api/admin/download/${res.data.fileName}`;
        window.open(downloadUrl, '_blank');
      }
      return { ok: true, message: res.data.message, count: res.data.recordCount };
    } catch (e) {
      return { ok: false, message: e.response?.data?.msg || e.message };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteStudent = useCallback(async (studentId) => {
    if (!token) throw new Error('Not authenticated');
    await axios.delete(`${API}/api/admin/students/${studentId}`, { headers: authHeader });
  }, [token]);

  const deleteTeacher = useCallback(async (teacherId) => {
    if (!token) throw new Error('Not authenticated');
    await axios.delete(`${API}/api/admin/teachers/${teacherId}`, { headers: authHeader });
  }, [token]);

  return {
    stats,
    students,
    teachers,
    reportData,
    loading,
    fetchStats,
    fetchStudents,
    fetchTeachers,
    fetchAttendanceReport,
    exportAttendance
    , deleteStudent
    , deleteTeacher
  };
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,
  STATUS: `${API_BASE_URL}/api/auth/status`,
  // Admin endpoints
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_STUDENTS: `${API_BASE_URL}/api/admin/students`,
  ADMIN_TEACHERS: `${API_BASE_URL}/api/admin/teachers`,
  ADMIN_CLASSES: `${API_BASE_URL}/api/admin/classes`,
  ADMIN_SUBJECTS: `${API_BASE_URL}/api/admin/subjects`,
  ADMIN_SESSIONS: `${API_BASE_URL}/api/admin/sessions`,
  ADMIN_REPORTS_ATTENDANCE: `${API_BASE_URL}/api/admin/reports/attendance`,
  ADMIN_REPORTS_FINES: `${API_BASE_URL}/api/admin/reports/fines`,
  // Teacher endpoints
  TEACHER_DASHBOARD: `${API_BASE_URL}/api/teacher/dashboard`,
  TEACHER_CLASSES: `${API_BASE_URL}/api/teacher/classes`,
  TEACHER_ATTENDANCE: `${API_BASE_URL}/api/teacher/attendance`,
  TEACHER_ATTENDANCE_MARK: `${API_BASE_URL}/api/teacher/attendance/mark`,
  TEACHER_ATTENDANCE_REPORT: `${API_BASE_URL}/api/teacher/attendance/report`,
  TEACHER_ATTENDANCE_MONTHLY: `${API_BASE_URL}/api/teacher/attendance/monthly`,
  TEACHER_PRAYER_MARK: `${API_BASE_URL}/api/teacher/prayer/mark`,
  TEACHER_PRAYER_REPORT: `${API_BASE_URL}/api/teacher/prayer/report`,
  TEACHER_FINES_CREATE: `${API_BASE_URL}/api/teacher/fines/create`,
  TEACHER_FINES: `${API_BASE_URL}/api/teacher/fines`,
  TEACHER_EXAMS: `${API_BASE_URL}/api/teacher/exams`,
  TEACHER_EXAMS_RESULTS: `${API_BASE_URL}/api/teacher/exams/results`,
  TEACHER_CLASS_STUDENTS: `${API_BASE_URL}/api/teacher/classes/:classId/students`,
  TEACHER_CONDUCT: `${API_BASE_URL}/api/teacher/class/:classId/conduct`,
  TEACHER_NOTIFICATIONS: `${API_BASE_URL}/api/teacher/notifications`,
  TEACHER_ACTIVITIES: `${API_BASE_URL}/api/teacher/class/:classId/activities`,
  TEACHER_CLUBS: `${API_BASE_URL}/api/teacher/clubs`,
  TEACHER_QUESTION_BANK: `${API_BASE_URL}/api/teacher/question-bank`,
  TEACHER_RESOURCES: `${API_BASE_URL}/api/teacher/resources`,
  TEACHER_AI_WEAK_STUDENTS: `${API_BASE_URL}/api/teacher/ai/weak-students`,
  TEACHER_AI_ATTENDANCE_RISK: `${API_BASE_URL}/api/teacher/ai/attendance-risk`,
  TEACHER_AI_SCHEDULE_SUGGESTION: `${API_BASE_URL}/api/teacher/ai/schedule-suggestion`,
  TEACHER_TIMETABLE: `${API_BASE_URL}/api/teacher/timetable`,
  // Student endpoints  
  STUDENT_DASHBOARD: `${API_BASE_URL}/api/student/dashboard`,
  STUDENT_ATTENDANCE: `${API_BASE_URL}/api/student/attendance`,
  STUDENT_FINES: `${API_BASE_URL}/api/student/fines`,
  STUDENT_RESULTS: `${API_BASE_URL}/api/student/results`,
  STUDENT_PROFILE: `${API_BASE_URL}/api/student/profile`,
  // AI endpoints
  AI_BASE: `${API_BASE_URL}/api/ai`,
  STUDENTS: `${API_BASE_URL}/api/admin/students`
};
// API helper functions
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const teacherId = localStorage.getItem('teacherId');
  const config = {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      // Dev fallback: if no token but teacherId present, send x-teacher-id header
      ...(!token && teacherId ? { 'x-teacher-id': teacherId } : {}),
      ...options.headers,
    },
    ...options,
  };
  try {
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    const response = await fetch(url, config);
    if (!response.ok) {
      let error;
      try {
        error = await response.json();
      } catch (e) {
        error = { msg: `HTTP error! status: ${response.status}` };
      }
      throw new Error(error.msg || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    // Provide more specific error messages for common issues
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running and accessible.');
    }
    throw error;
  }
};
// Auth helper functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};
export const getAuthToken = () => {
  return localStorage.getItem('token');
};
export const isAuthenticated = () => {
  return !!getAuthToken();
};
export default API_BASE_URL;

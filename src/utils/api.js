// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  TEACHER_EXAMS: `${API_BASE_URL}/api/teacher/exams`,
  
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
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
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
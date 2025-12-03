import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminTeachers from './pages/admin/Teachers'
import AdminStudents from './pages/admin/Students'
import AdminClasses from './pages/admin/Classes'
import AdminCourses from './pages/admin/Courses'
import AdminTimetable from './pages/admin/Timetable'
import AttendanceAdmin from './pages/admin/AttendanceAdmin'
import PrayerAdmin from './pages/admin/PrayerAdmin'
import FinesAdmin from './pages/admin/FinesAdmin'
import FeesAdmin from './pages/admin/FeesAdmin'
import ResultsAdmin from './pages/admin/ResultsAdmin'
import LibraryAdmin from './pages/admin/LibraryAdmin'
import ConductAdmin from './pages/admin/ConductAdmin'
import AIControls from './pages/admin/AIControls'
import AuditLogs from './pages/admin/AuditLogs'
import NoticesAdmin from './pages/admin/NoticesAdmin'
import EventsAdmin from './pages/admin/EventsAdmin'
import GalleryAdmin from './pages/admin/GalleryAdmin'
import SettingsAdmin from './pages/admin/SettingsAdmin'
import AdminProfile from './pages/admin/AdminProfile'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherProfile from './pages/TeacherProfile'
import StudentDashboard from './pages/StudentDashboard'
import ProtectedRoute from './components/ProtectedRoute'

// Teacher Module Pages
import MarkAttendance from './pages/teacher/MarkAttendance'
import AttendanceReport from './pages/teacher/AttendanceReport'
import PrayerAttendance from './pages/teacher/PrayerAttendance'
import Fines from './pages/teacher/Fines'
import Exams from './pages/teacher/Exams'
import ClassStudents from './pages/teacher/ClassStudents'
import Conduct from './pages/teacher/Conduct'
import Notifications from './pages/teacher/Notifications'
import Activities from './pages/teacher/Activities'
import QuestionBank from './pages/teacher/QuestionBank'
import Resources from './pages/teacher/Resources'
import Clubs from './pages/teacher/Clubs'
import Timetable from './pages/teacher/Timetable'
import DueSheet from './pages/teacher/DueSheet'

import './styles.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          {/* Admin Module Routes */}
          <Route path="/admin/teachers" element={<ProtectedRoute requiredRole="admin"><AdminTeachers /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute requiredRole="admin"><AdminStudents /></ProtectedRoute>} />
          <Route path="/admin/classes" element={<ProtectedRoute requiredRole="admin"><AdminClasses /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute requiredRole="admin"><AdminCourses /></ProtectedRoute>} />
          <Route path="/admin/timetable" element={<ProtectedRoute requiredRole="admin"><AdminTimetable /></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute requiredRole="admin"><AttendanceAdmin /></ProtectedRoute>} />
          <Route path="/admin/prayer" element={<ProtectedRoute requiredRole="admin"><PrayerAdmin /></ProtectedRoute>} />
          <Route path="/admin/fines" element={<ProtectedRoute requiredRole="admin"><FinesAdmin /></ProtectedRoute>} />
          <Route path="/admin/fees" element={<ProtectedRoute requiredRole="admin"><FeesAdmin /></ProtectedRoute>} />
          <Route path="/admin/results" element={<ProtectedRoute requiredRole="admin"><ResultsAdmin /></ProtectedRoute>} />
          <Route path="/admin/library" element={<ProtectedRoute requiredRole="admin"><LibraryAdmin /></ProtectedRoute>} />
          <Route path="/admin/conduct" element={<ProtectedRoute requiredRole="admin"><ConductAdmin /></ProtectedRoute>} />
          <Route path="/admin/ai" element={<ProtectedRoute requiredRole="admin"><AIControls /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute requiredRole="admin"><AuditLogs /></ProtectedRoute>} />
          <Route path="/admin/notices" element={<ProtectedRoute requiredRole="admin"><NoticesAdmin /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute requiredRole="admin"><EventsAdmin /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute requiredRole="admin"><GalleryAdmin /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><SettingsAdmin /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute requiredRole="admin"><AdminProfile /></ProtectedRoute>} />
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/profile" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherProfile />
              </ProtectedRoute>
            } 
          />
          {/* Teacher Module Routes */}
          <Route 
            path="/teacher/attendance" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <MarkAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/attendance/report" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <AttendanceReport />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/prayer" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <PrayerAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/fines" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <Fines />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/exams" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <Exams />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/students" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <ClassStudents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/conduct" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <Conduct />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/notifications" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <Notifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/activities" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <Activities />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/question-bank" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <QuestionBank />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/resources" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <Resources />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/clubs" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <Clubs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/timetable" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <Timetable />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/due-sheet" 
            element={
              <ProtectedRoute requiredRole="teacher">
                <DueSheet />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student" 
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)

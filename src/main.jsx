import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
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

import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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
import { ProtectedAdminRoute, ProtectedTeacherRoute, ProtectedStudentRoute } from './utils/ProtectedRoutes'
// Student Module Pages
import StudentDashboard from './pages/student/Dashboard'
import StudentAttendance from './pages/student/Attendance'
import StudentFees from './pages/student/Fees'
import StudentAssessment from './pages/student/Assessment'
import StudentLibrary from './pages/student/Library'
import StudentIDCard from './pages/student/IDCard'
import StudentMenu from './pages/student/Menu'
import StudentPersonalDetails from './pages/student/PersonalDetails'
import StudentGuardianDetails from './pages/student/GuardianDetails'
import StudentMyAccount from './pages/student/MyAccount'
import StudentDepartments from './pages/student/Departments'
import StudentProfile from './pages/student/Profile'
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
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
          {/* Admin Module Routes */}
          <Route path="/admin/teachers" element={<ProtectedAdminRoute><AdminTeachers /></ProtectedAdminRoute>} />
          <Route path="/admin/students" element={<ProtectedAdminRoute><AdminStudents /></ProtectedAdminRoute>} />
          <Route path="/admin/classes" element={<ProtectedAdminRoute><AdminClasses /></ProtectedAdminRoute>} />
          <Route path="/admin/courses" element={<ProtectedAdminRoute><AdminCourses /></ProtectedAdminRoute>} />
          <Route path="/admin/timetable" element={<ProtectedAdminRoute><AdminTimetable /></ProtectedAdminRoute>} />
          <Route path="/admin/attendance" element={<ProtectedAdminRoute><AttendanceAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/prayer" element={<ProtectedAdminRoute><PrayerAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/fines" element={<ProtectedAdminRoute><FinesAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/fees" element={<ProtectedAdminRoute><FeesAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/results" element={<ProtectedAdminRoute><ResultsAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/library" element={<ProtectedAdminRoute><LibraryAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/conduct" element={<ProtectedAdminRoute><ConductAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/ai" element={<ProtectedAdminRoute><AIControls /></ProtectedAdminRoute>} />
          <Route path="/admin/audit" element={<ProtectedAdminRoute><AuditLogs /></ProtectedAdminRoute>} />
          <Route path="/admin/notices" element={<ProtectedAdminRoute><NoticesAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/events" element={<ProtectedAdminRoute><EventsAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/gallery" element={<ProtectedAdminRoute><GalleryAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/settings" element={<ProtectedAdminRoute><SettingsAdmin /></ProtectedAdminRoute>} />
          <Route path="/admin/profile" element={<ProtectedAdminRoute><AdminProfile /></ProtectedAdminRoute>} />
          <Route 
            path="/teacher" 
            element={
              <ProtectedTeacherRoute>
                <TeacherDashboard />
              </ProtectedTeacherRoute>
            } 
          />
          {/* Teacher Module Routes */}
          <Route 
            path="/teacher/attendance" 
            element={
              <ProtectedTeacherRoute>
                <MarkAttendance />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/attendance/report" 
            element={
              <ProtectedTeacherRoute>
                <AttendanceReport />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/prayer" 
            element={
              <ProtectedTeacherRoute>
                <PrayerAttendance />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/fines" 
            element={
              <ProtectedTeacherRoute>
                <Fines />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/exams" 
            element={
              <ProtectedTeacherRoute>
                <Exams />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/students" 
            element={
              <ProtectedTeacherRoute>
                <ClassStudents />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/conduct" 
            element={
              <ProtectedTeacherRoute>
                <Conduct />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/notifications" 
            element={
              <ProtectedTeacherRoute>
                <Notifications />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/activities" 
            element={
              <ProtectedTeacherRoute>
                <Activities />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/question-bank" 
            element={
              <ProtectedTeacherRoute>
                <QuestionBank />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/resources" 
            element={
              <ProtectedTeacherRoute>
                <Resources />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/clubs" 
            element={
              <ProtectedTeacherRoute>
                <Clubs />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/timetable" 
            element={
              <ProtectedTeacherRoute>
                <Timetable />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/teacher/due-sheet" 
            element={
              <ProtectedTeacherRoute>
                <DueSheet />
              </ProtectedTeacherRoute>
            } 
          />
          <Route 
            path="/student" 
            element={
              <ProtectedStudentRoute>
                <StudentDashboard />
              </ProtectedStudentRoute>
            } 
          />
          {/* Student Module Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedStudentRoute>
                <StudentDashboard />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/attendance" 
            element={
              <ProtectedStudentRoute>
                <StudentAttendance />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/fees" 
            element={
              <ProtectedStudentRoute>
                <StudentFees />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/assessment" 
            element={
              <ProtectedStudentRoute>
                <StudentAssessment />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedStudentRoute>
                <StudentProfile />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/library" 
            element={
              <ProtectedStudentRoute>
                <StudentLibrary />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/idcard" 
            element={
              <ProtectedStudentRoute>
                <StudentIDCard />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/menu" 
            element={
              <ProtectedStudentRoute>
                <StudentMenu />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/personal-details" 
            element={
              <ProtectedStudentRoute>
                <StudentPersonalDetails />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/guardian-details" 
            element={
              <ProtectedStudentRoute>
                <StudentGuardianDetails />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/account" 
            element={
              <ProtectedStudentRoute>
                <StudentMyAccount />
              </ProtectedStudentRoute>
            } 
          />
          <Route 
            path="/student/departments" 
            element={
              <ProtectedStudentRoute>
                <StudentDepartments />
              </ProtectedStudentRoute>
            } 
          />
        </Routes>
      </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
createRoot(document.getElementById('root')).render(<App />)

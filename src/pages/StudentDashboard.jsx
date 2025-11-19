import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import StudentProfile from '../components/StudentProfile'
import VirtualIDCard from '../components/VirtualIDCard'
import MonthlyAttendance from '../components/MonthlyAttendance'
import AIChatbot from '../components/AIChatbot'
import AIPredictionDashboard from '../components/AIPredictionDashboard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function StudentDashboard() {
  const token = localStorage.getItem('token')
  const headers = { Authorization: 'Bearer ' + token }
  
  // Form states
  const [studentId, setStudentId] = useState('')
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [result, setResult] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Student profile states
  const [profile, setProfile] = useState({
    name: 'Student',
    rollNo: '',
    totalAttendance: 0,
    currentMonth: 0,
    totalFines: 0,
    subjects: [],
    guardianInfo: {},
    studentDetails: {}
  })
  
  // Modal states
  const [showProfile, setShowProfile] = useState(false)
  const [showIdCard, setShowIdCard] = useState(false)
  const [showMonthlyAttendance, setShowMonthlyAttendance] = useState(false)
  const [editMode, setEditMode] = useState(false)
  
  // AI Features states
  const [showChatbot, setShowChatbot] = useState(false)
  const [showAIPrediction, setShowAIPrediction] = useState(false)
  const [userInfo, setUserInfo] = useState({ id: null })

  useEffect(() => {
    loadProfile()
    // Get user info from token
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUserInfo({ id: payload.userId || payload.id })
      } catch (err) {
        console.error('Error parsing token:', err)
      }
    }
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API + '/api/student/dashboard', { headers });
      
      // Check if we have valid student data
      if (res.data && res.data.student) {
        setProfile({
          name: res.data.student.user_id?.name || '',
          rollNo: res.data.student.user_id?.roll_no || res.data.student.roll_number || '',
          class: res.data.student.class_id?.name || '',
          totalAttendance: res.data.attendancePercentage || 0,
          currentMonth: res.data.monthlyAttendance || 0,
          totalFines: res.data.totalFines || 0,
          subjects: res.data.subjects || [],
          guardianInfo: res.data.student.guardian_info || {},
          studentDetails: res.data.student
        });
      } else {
        setMsg('⚠️ No student profile found. Please complete your profile.');
        setProfile(prev => ({ ...prev, name: '', rollNo: '', class: '', subjects: [] }));
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setMsg('❌ Failed to load profile.');
      setProfile(prev => ({ ...prev, name: '', rollNo: '', class: '', subjects: [] }));
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API}/api/student/profile`, updatedData, { headers });
      setProfile(prev => ({ ...prev, ...updatedData }));
      setMsg('✅ Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.msg || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getAttendance = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    
    try {
      const res = await axios.get(API + `/api/student/${studentId}/attendance/${month}`, { headers })
      setResult(res.data)
      setMsg('')
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.msg || err.message}`)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const clearMessage = () => setMsg('')

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'success'
    if (percentage >= 75) return 'warning'
    return 'error'
  }

  const getAttendanceIcon = (percentage) => {
    if (percentage >= 90) return 'fa-check-circle'
    if (percentage >= 75) return 'fa-exclamation-triangle'
    return 'fa-times-circle'
  }

  return (
    <div className="page-container fade-in">
      <Header userRole="student" userName={profile.name} />
      
      <div className="container">
        {/* Dashboard Header */}
        <div className="mb-4">
          <h1 className="login-title text-primary">
            <i className="fas fa-user-graduate"></i> Student Dashboard
          </h1>
          <p className="text-muted">Welcome back, {profile.name}! Track your attendance, view academic progress, and manage your profile</p>
        </div>

        {/* Quick Actions */}
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-bolt"></i> Quick Actions
            </h2>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <button 
                className="quick-action-btn primary"
                onClick={() => setShowProfile(true)}
              >
                <i className="fas fa-user-edit"></i>
                <span>View Profile</span>
              </button>
              <button 
                className="quick-action-btn success"
                onClick={() => setShowIdCard(true)}
              >
                <i className="fas fa-id-card"></i>
                <span>ID Card</span>
              </button>
              <button 
                className="quick-action-btn info"
                onClick={() => setShowMonthlyAttendance(true)}
              >
                <i className="fas fa-calendar-alt"></i>
                <span>Monthly Attendance</span>
              </button>
              <button 
                className="quick-action-btn purple"
                onClick={() => setShowAIPrediction(true)}
              >
                <i className="fas fa-brain"></i>
                <span>AI Analytics</span>
              </button>
              <button 
                className="quick-action-btn secondary"
                onClick={() => setShowChatbot(true)}
              >
                <i className="fas fa-robot"></i>
                <span>AI Assistant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-chart-line"></i> Academic Overview
            </h2>
          </div>
          <div className="card-body">
            <div className="dashboard-grid">
              <div className="stats-card">
                <div className="stats-header">
                  <div className="stats-icon success">
                    <i className="fas fa-percentage"></i>
                  </div>
                  <div>
                    <div className="stats-value">{profile.totalAttendance}%</div>
                    <div className="stats-label">Overall Attendance</div>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-header">
                  <div className="stats-icon primary">
                    <i className="fas fa-calendar-month"></i>
                  </div>
                  <div>
                    <div className="stats-value">{profile.currentMonth}%</div>
                    <div className="stats-label">This Month</div>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-header">
                  <div className="stats-icon warning">
                    <i className="fas fa-rupee-sign"></i>
                  </div>
                  <div>
                    <div className="stats-value">₹{profile.totalFines}</div>
                    <div className="stats-label">Total Fines</div>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-header">
                  <div className="stats-icon info">
                    <i className="fas fa-book"></i>
                  </div>
                  <div>
                    <div className="stats-value">{profile.subjects.length}</div>
                    <div className="stats-label">Subjects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Attendance */}
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-books"></i> Subject-wise Attendance
            </h2>
          </div>
          <div className="card-body">
            <div className="subjects-grid">
              {profile.subjects.map((subject, index) => (
                <div key={index} className="subject-card">
                  <div className="subject-header">
                    <h4 className="subject-name">{subject.name}</h4>
                    <span className="subject-code">{subject.code}</span>
                  </div>
                  <div className="subject-attendance">
                    <div className={`attendance-circle ${getAttendanceColor(subject.attendance)}`}>
                      <span className="attendance-percentage">{subject.attendance}%</span>
                    </div>
                    <i className={`fas ${getAttendanceIcon(subject.attendance)} attendance-status`}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Lookup */}
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-search"></i> Attendance Lookup
            </h2>
            <p className="card-subtitle">Search attendance records by student ID and month</p>
          </div>
          
          <div className="card-body">
            <form onSubmit={getAttendance}>
              <div className="dashboard-grid">
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-id-badge"></i> Student ID
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={studentId} 
                    onChange={e => setStudentId(e.target.value)} 
                    placeholder="Enter student ID"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-calendar"></i> Month
                  </label>
                  <input 
                    type="month"
                    className="form-input"
                    value={month} 
                    onChange={e => setMonth(e.target.value)} 
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                <i className="fas fa-search"></i>
                {loading ? 'Searching...' : 'Get Attendance'}
              </button>
            </form>

            {msg && (
              <div className={`message ${msg.includes('✅') ? 'success' : 'error'}`}>
                {msg}
                <button className="message-close" onClick={clearMessage}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}

            {result && (
              <div className="results-container">
                <h3 className="results-title">
                  <i className="fas fa-chart-bar"></i> Attendance Results
                </h3>
                <div className="results-grid">
                  <div className="result-card">
                    <div className="result-icon primary">
                      <i className="fas fa-calendar-days"></i>
                    </div>
                    <div className="result-info">
                      <div className="result-value">{result.totalDays}</div>
                      <div className="result-label">Total Days</div>
                    </div>
                  </div>
                  <div className="result-card">
                    <div className="result-icon success">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="result-info">
                      <div className="result-value">{result.presentDays}</div>
                      <div className="result-label">Present</div>
                    </div>
                  </div>
                  <div className="result-card">
                    <div className="result-icon error">
                      <i className="fas fa-times"></i>
                    </div>
                    <div className="result-info">
                      <div className="result-value">{result.absentDays}</div>
                      <div className="result-label">Absent</div>
                    </div>
                  </div>
                  <div className="result-card">
                    <div className="result-icon warning">
                      <i className="fas fa-percentage"></i>
                    </div>
                    <div className="result-info">
                      <div className="result-value">{result.percentage}%</div>
                      <div className="result-label">Attendance</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showProfile && (
        <StudentProfile 
          profile={profile}
          onUpdate={updateProfile}
          onClose={() => setShowProfile(false)}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      )}

      {showIdCard && (
        <VirtualIDCard 
          profile={profile}
          onClose={() => setShowIdCard(false)}
        />
      )}

      {showMonthlyAttendance && (
        <MonthlyAttendance 
          profile={profile}
          onClose={() => setShowMonthlyAttendance(false)}
        />
      )}

      {showChatbot && (
        <AIChatbot 
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
          userRole="student"
        />
      )}

      {showAIPrediction && (
        <AIPredictionDashboard 
          userRole="student"
          userId={userInfo.id}
          onClose={() => setShowAIPrediction(false)}
        />
      )}
    </div>
  )
}

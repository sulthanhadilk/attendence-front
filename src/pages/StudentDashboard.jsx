import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
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
    subjects: []
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      // Mock profile data - replace with actual API call
      setProfile({
        name: 'John Doe',
        rollNo: '2023001',
        totalAttendance: 88,
        currentMonth: 92,
        totalFines: 150,
        subjects: [
          { name: 'Computer Science', attendance: 95 },
          { name: 'Mathematics', attendance: 87 },
          { name: 'Physics', attendance: 82 },
          { name: 'English', attendance: 90 }
        ]
      })
    } catch (err) {
      console.error('Error loading profile:', err)
    }
  }

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

  // AI Features states
  const [showChatbot, setShowChatbot] = useState(false)
  const [showAIPrediction, setShowAIPrediction] = useState(false)
  const [userInfo, setUserInfo] = useState({ id: null })

  useEffect(() => {
    // Get user info from token or API
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

  return (
    <div className="page-container fade-in">
      <Header userRole="student" userName={profile.name} />
      
      <div className="container">
        {/* Dashboard Header */}
        <div className="mb-4">
          <h1 className="login-title text-primary">
            <i className="fas fa-user-graduate"></i> Student Dashboard
          </h1>
          <p className="text-muted">Track your attendance, view academic progress, and manage your profile</p>
        </div>

        {/* Profile Summary */}
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-user"></i> Profile Summary
            </h2>
          </div>
          <div className="card-body">
            <div className="dashboard-grid">
              <div className="stats-card">
                <div className="stats-header">
                  <div className="stats-icon primary">
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
                  <div className="stats-icon success">
                    <i className="fas fa-calendar-check"></i>
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
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div>
                    <div className="stats-value">₹{profile.totalFines}</div>
                    <div className="stats-label">Total Fines</div>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-header">
                  <div className="stats-icon error">
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Attendance Query */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-search"></i> Check Attendance
              </h2>
              <p className="card-subtitle">View your attendance for any month</p>
            </div>
            
            <div className="card-body">
              <form onSubmit={getAttendance}>
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-id-card"></i> Student ID *
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={studentId} 
                    onChange={e => setStudentId(e.target.value)} 
                    placeholder={`e.g., ${profile.rollNo || '2023001'}`}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-calendar"></i> Month *
                  </label>
                  <input 
                    type="month"
                    className="form-input"
                    value={month} 
                    onChange={e => setMonth(e.target.value)} 
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search"></i>
                      Get Attendance
                    </>
                  )}
                </button>
              </form>

              {/* Results */}
              {result && (
                <div className="card mt-3" style={{ background: 'var(--gray-50)' }}>
                  <div className="card-body">
                    <h4 className="mb-3">
                      <i className="fas fa-chart-pie"></i> Attendance Report
                    </h4>
                    
                    <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      <div className="text-center">
                        <div className={`stats-icon ${getAttendanceColor(result.percent)} mb-2`} style={{ margin: '0 auto' }}>
                          <i className={`fas ${getAttendanceIcon(result.percent)}`}></i>
                        </div>
                        <div className="stats-value">{result.percent}%</div>
                        <div className="stats-label">Attendance</div>
                      </div>
                      
                      <div>
                        <div className="mb-2">
                          <strong>Present:</strong> {result.present} days
                        </div>
                        <div className="mb-2">
                          <strong>Total:</strong> {result.total} days
                        </div>
                        <div>
                          <strong>Absent:</strong> {result.total - result.present} days
                        </div>
                      </div>
                    </div>

                    {result.percent < 75 && (
                      <div className="alert alert-warning mt-3">
                        <i className="fas fa-exclamation-triangle"></i>
                        <strong>Warning:</strong> Your attendance is below 75%. Please attend more classes to meet minimum requirements.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subject-wise Attendance */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-book"></i> Subject-wise Attendance
              </h2>
              <p className="card-subtitle">Your attendance across all subjects</p>
            </div>
            
            <div className="card-body">
              {profile.subjects.map((subject, index) => (
                <div key={index} className="mb-3 p-3" style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">{subject.name}</h5>
                    <span className={`badge ${getAttendanceColor(subject.attendance)}`}>
                      {subject.attendance}%
                    </span>
                  </div>
                  
                  <div className="progress" style={{ height: '8px', background: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      className={`progress-bar ${getAttendanceColor(subject.attendance)}`}
                      style={{ 
                        width: `${subject.attendance}%`,
                        height: '100%',
                        background: subject.attendance >= 90 ? 'var(--success-color)' : 
                                   subject.attendance >= 75 ? 'var(--warning-color)' : 'var(--error-color)',
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {msg && (
          <div className={`alert mt-4 ${msg.includes('✅') ? 'alert-success' : 'alert-error'}`}>
            {msg}
            <button 
              type="button" 
              onClick={clearMessage}
              style={{ 
                background: 'none', 
                border: 'none', 
                float: 'right', 
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* AI Features Section */}
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-robot"></i> AI-Powered Features
            </h3>
          </div>
          <div className="card-body">
            <div className="dashboard-grid">
              <button 
                className="btn btn-gradient-primary"
                onClick={() => setShowAIPrediction(true)}
              >
                <i className="fas fa-brain"></i>
                AI Smart Analysis
              </button>
              <button 
                className="btn btn-gradient-success"
                onClick={() => setShowChatbot(true)}
              >
                <i className="fas fa-comments"></i>
                Ask AI Assistant
              </button>
            </div>
            <p className="text-muted mt-3 mb-0">
              <i className="fas fa-info-circle"></i> 
              Get intelligent insights about your academic performance and personalized recommendations
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-bolt"></i> Quick Actions
            </h3>
          </div>
          <div className="card-body">
            <div className="dashboard-grid">
              <button className="btn btn-primary">
                <i className="fas fa-calendar-alt"></i>
                View Schedule
              </button>
              <button className="btn btn-success">
                <i className="fas fa-download"></i>
                Download Report
              </button>
              <button className="btn btn-warning">
                <i className="fas fa-dollar-sign"></i>
                Pay Fines
              </button>
              <button className="btn btn-secondary">
                <i className="fas fa-user-edit"></i>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Components */}
      <AIChatbot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        userRole="student"
      />

      {showAIPrediction && (
        <div className="ai-prediction-modal">
          <div className="modal-overlay" onClick={() => setShowAIPrediction(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>AI Smart Analysis</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAIPrediction(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <AIPredictionDashboard 
                studentId={userInfo.id}
                userRole="student"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      <button 
        className="ai-floating-btn pulse"
        onClick={() => setShowChatbot(true)}
        title="Ask AI Assistant"
      >
        <i className="fas fa-robot"></i>
      </button>
    </div>
  )
}

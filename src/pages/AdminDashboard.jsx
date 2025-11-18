import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import AIChatbot from '../components/AIChatbot'
import AIPredictionDashboard from '../components/AIPredictionDashboard'
import AIReportGenerator from '../components/AIReportGenerator'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AdminDashboard() {
  const token = localStorage.getItem('token')
  const headers = { Authorization: 'Bearer ' + token }
  
  // Check authentication on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!token || !user) {
      window.location = '/';
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        window.location = '/';
        return;
      }
    } catch (error) {
      localStorage.clear();
      window.location = '/';
      return;
    }
  }, [token]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location = '/';
  };
  
  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [roll, setRoll] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Stats states
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    todayAttendance: 0
  })

  useEffect(() => {
    // Load dashboard stats
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Mock stats for demo - replace with actual API calls
      setStats({
        totalStudents: 150,
        totalTeachers: 25,
        totalClasses: 12,
        todayAttendance: 85
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  const createUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    
    try {
      const userData = { 
        name, 
        email: email || undefined, 
        roll_no: roll || undefined, 
        password, 
        role 
      }
      
      const res = await axios.post(API + '/api/admin/create-user', userData, { headers })
      setMsg(`✅ User created successfully! ID: ${res.data.user._id}`)
      
      // Reset form
      setName('')
      setEmail('')
      setRoll('')
      setPassword('')
      setRole('student')
      
      // Refresh stats
      loadStats()
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.msg || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearMessage = () => setMsg('')

  // AI Features states
  const [showChatbot, setShowChatbot] = useState(false)
  const [showAIPrediction, setShowAIPrediction] = useState(false)
  const [showAIReports, setShowAIReports] = useState(false)
  const [activeAITab, setActiveAITab] = useState('prediction')

  return (
    <div className="page-container fade-in">
      <Header userRole="admin" userName="Administrator" />
      
      <div className="container">
        {/* Dashboard Header */}
        <div className="mb-4">
          <h1 className="login-title text-primary">
            <i className="fas fa-tachometer-alt"></i> Admin Dashboard
          </h1>
          <p className="text-muted">Manage users, monitor attendance, and oversee system operations</p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid mb-4">
          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon primary">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div>
                <div className="stats-value">{stats.totalStudents}</div>
                <div className="stats-label">Total Students</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon success">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <div>
                <div className="stats-value">{stats.totalTeachers}</div>
                <div className="stats-label">Faculty Members</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon warning">
                <i className="fas fa-book"></i>
              </div>
              <div>
                <div className="stats-value">{stats.totalClasses}</div>
                <div className="stats-label">Active Classes</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon error">
                <i className="fas fa-chart-line"></i>
              </div>
              <div>
                <div className="stats-value">{stats.todayAttendance}%</div>
                <div className="stats-label">Today&apos;s Attendance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Create User Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-user-plus"></i> Create New User
            </h2>
            <p className="card-subtitle">Add students, teachers, or administrators to the system</p>
          </div>
          
          <div className="card-body">
            <form onSubmit={createUser}>
              <div className="dashboard-grid">
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-user"></i> Full Name *
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-envelope"></i> Email {role !== 'student' && '*'}
                  </label>
                  <input 
                    type="email"
                    className="form-input"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder={role === 'student' ? 'Optional for students' : 'Required for faculty/admin'}
                    required={role !== 'student'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-id-card"></i> Roll Number {role === 'student' && '*'}
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={roll} 
                    onChange={e => setRoll(e.target.value)} 
                    placeholder={role === 'student' ? 'Required for students' : 'Leave empty for faculty/admin'}
                    required={role === 'student'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-key"></i> Password *
                  </label>
                  <input 
                    type="password"
                    className="form-input"
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Minimum 6 characters"
                    minLength="6"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-user-tag"></i> User Role *
                </label>
                <select 
                  className="form-select"
                  value={role} 
                  onChange={e => setRole(e.target.value)}
                >
                  <option value="student">👨‍🎓 Student</option>
                  <option value="teacher">👨‍🏫 Teacher</option>
                  <option value="admin">👨‍💼 Administrator</option>
                </select>
              </div>

              {msg && (
                <div className={`alert ${msg.includes('✅') ? 'alert-success' : 'alert-error'}`}>
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

              <div className="d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i>
                      Create User
                    </>
                  )}
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setName('')
                    setEmail('')
                    setRoll('')
                    setPassword('')
                    setRole('student')
                    setMsg('')
                  }}
                >
                  <i className="fas fa-undo"></i>
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* AI Features Section */}
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-robot"></i> AI-Powered Administration
            </h3>
          </div>
          <div className="card-body">
            <div className="dashboard-grid">
              <button 
                className="btn btn-gradient-primary"
                onClick={() => setShowAIPrediction(true)}
              >
                <i className="fas fa-brain"></i>
                AI Student Analysis
              </button>
              <button 
                className="btn btn-gradient-success"
                onClick={() => setShowAIReports(true)}
              >
                <i className="fas fa-file-alt"></i>
                AI Report Generator
              </button>
              <button 
                className="btn btn-gradient-info"
                onClick={() => setShowChatbot(true)}
              >
                <i className="fas fa-comments"></i>
                AI Assistant
              </button>
            </div>
            <p className="text-muted mt-3 mb-0">
              <i className="fas fa-info-circle"></i> 
              Leverage AI for predictive analytics, automated reporting, and intelligent insights
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
              <button className="btn btn-success">
                <i className="fas fa-download"></i>
                Export Attendance
              </button>
              <button className="btn btn-warning">
                <i className="fas fa-chart-bar"></i>
                View Reports
              </button>
              <button className="btn btn-info">
                <i className="fas fa-users"></i>
                Manage Users
              </button>
              <button className="btn btn-secondary">
                <i className="fas fa-cog"></i>
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Components */}
      <AIChatbot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        userRole="admin"
      />

      {showAIPrediction && (
        <div className="ai-prediction-modal">
          <div className="modal-overlay" onClick={() => setShowAIPrediction(false)}></div>
          <div className="modal-content large">
            <div className="modal-header">
              <h2>AI Student Analysis & Predictions</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAIPrediction(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <AIPredictionDashboard userRole="admin" />
            </div>
          </div>
        </div>
      )}

      {showAIReports && (
        <div className="ai-prediction-modal">
          <div className="modal-overlay" onClick={() => setShowAIReports(false)}></div>
          <div className="modal-content large">
            <div className="modal-header">
              <h2>AI-Powered Report Generator</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAIReports(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <AIReportGenerator userRole="admin" />
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

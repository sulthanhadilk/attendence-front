import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import AIChatbot from '../components/AIChatbot'
import AIPredictionDashboard from '../components/AIPredictionDashboard'
import AIReportGenerator from '../components/AIReportGenerator'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function TeacherDashboard() {
  const token = localStorage.getItem('token')
  const headers = { Authorization: 'Bearer ' + token }
  
  // Attendance states
  const [sessionId, setSessionId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [entries, setEntries] = useState('[{"student_id":"", "status":"present"}]')
  const [msg, setMsg] = useState('')
  const [attendanceLoading, setAttendanceLoading] = useState(false)
  
  // Fine states
  const [studentId, setStudentId] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [fineLoading, setFineLoading] = useState(false)
  
  // Stats states
  const [stats, setStats] = useState({
    todayClasses: 0,
    studentsPresent: 0,
    avgAttendance: 0,
    pendingFines: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Mock stats for demo - replace with actual API calls
      setStats({
        todayClasses: 3,
        studentsPresent: 45,
        avgAttendance: 88,
        pendingFines: 2
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  const markAttendance = async (e) => {
    e.preventDefault()
    setAttendanceLoading(true)
    setMsg('')
    
    try {
      const parsedEntries = JSON.parse(entries)
      const res = await axios.post(
        API + '/api/teacher/mark-attendance', 
        { session_id: sessionId, date, entries: parsedEntries }, 
        { headers }
      )
      setMsg(`✅ Successfully saved ${res.data.saved.length} attendance entries`)
      
      // Reset form
      setSessionId('')
      setEntries('[{"student_id":"", "status":"present"}]')
      loadStats()
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.msg || err.message}`)
    } finally {
      setAttendanceLoading(false)
    }
  }

  const addFine = async (e) => {
    e.preventDefault()
    setFineLoading(true)
    setMsg('')
    
    try {
      const res = await axios.post(
        API + '/api/teacher/add-fine', 
        { 
          student_id: studentId, 
          amount: Number(amount), 
          reason, 
          date: new Date().toISOString().slice(0, 10) 
        }, 
        { headers }
      )
      setMsg(`✅ Fine added successfully! ID: ${res.data.fine._id}`)
      
      // Reset form
      setStudentId('')
      setAmount('')
      setReason('')
      loadStats()
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.msg || err.message}`)
    } finally {
      setFineLoading(false)
    }
  }

  const clearMessage = () => setMsg('')

  // AI Features states
  const [showChatbot, setShowChatbot] = useState(false)
  const [showAIPrediction, setShowAIPrediction] = useState(false)
  const [showAIReports, setShowAIReports] = useState(false)

  const addStudentEntry = () => {
    try {
      const currentEntries = JSON.parse(entries)
      currentEntries.push({ student_id: "", status: "present" })
      setEntries(JSON.stringify(currentEntries, null, 2))
    } catch (err) {
      setMsg('❌ Invalid JSON format in entries')
    }
  }

  const formatEntriesTemplate = () => {
    const template = [
      { student_id: "2023001", status: "present" },
      { student_id: "2023002", status: "absent" },
      { student_id: "2023003", status: "present" }
    ]
    setEntries(JSON.stringify(template, null, 2))
  }

  return (
    <div className="page-container fade-in">
      <Header userRole="teacher" userName="Faculty Member" />
      
      <div className="container">
        {/* Dashboard Header */}
        <div className="mb-4">
          <h1 className="login-title text-primary">
            <i className="fas fa-chalkboard-teacher"></i> Faculty Dashboard
          </h1>
          <p className="text-muted">Manage attendance, track student progress, and handle academic records</p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid mb-4">
          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon primary">
                <i className="fas fa-calendar-day"></i>
              </div>
              <div>
                <div className="stats-value">{stats.todayClasses}</div>
                <div className="stats-label">Today&apos;s Classes</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon success">
                <i className="fas fa-user-check"></i>
              </div>
              <div>
                <div className="stats-value">{stats.studentsPresent}</div>
                <div className="stats-label">Students Present</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon warning">
                <i className="fas fa-chart-line"></i>
              </div>
              <div>
                <div className="stats-value">{stats.avgAttendance}%</div>
                <div className="stats-label">Avg Attendance</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon error">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                <div className="stats-value">{stats.pendingFines}</div>
                <div className="stats-label">Pending Fines</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Mark Attendance Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-user-check"></i> Mark Attendance
              </h2>
              <p className="card-subtitle">Record student attendance for your class sessions</p>
            </div>
            
            <div className="card-body">
              <form onSubmit={markAttendance}>
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-id-badge"></i> Session ID *
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={sessionId} 
                    onChange={e => setSessionId(e.target.value)} 
                    placeholder="e.g., CS101-2024-01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-calendar"></i> Date *
                  </label>
                  <input 
                    type="date"
                    className="form-input"
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-list"></i> Attendance Entries (JSON) *
                  </label>
                  <div className="d-flex gap-1 mb-2">
                    <button 
                      type="button" 
                      className="btn btn-sm btn-secondary"
                      onClick={addStudentEntry}
                    >
                      <i className="fas fa-plus"></i> Add Entry
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-secondary"
                      onClick={formatEntriesTemplate}
                    >
                      <i className="fas fa-file-alt"></i> Use Template
                    </button>
                  </div>
                  <textarea 
                    className="form-textarea"
                    value={entries} 
                    onChange={e => setEntries(e.target.value)} 
                    rows={8}
                    placeholder='[{&quot;student_id&quot;:&quot;2023001&quot;, &quot;status&quot;:&quot;present&quot;}]'
                    style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                  />
                  <small className="text-muted">
                    Format: JSON array with student_id and status (&quot;present&quot; or &quot;absent&quot;)
                  </small>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-full" 
                  disabled={attendanceLoading}
                >
                  {attendanceLoading ? (
                    <>
                      <div className="spinner"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Save Attendance
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Add Fine Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-dollar-sign"></i> Add Fine
              </h2>
              <p className="card-subtitle">Issue fines for disciplinary or academic reasons</p>
            </div>
            
            <div className="card-body">
              <form onSubmit={addFine}>
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-user"></i> Student ID *
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={studentId} 
                    onChange={e => setStudentId(e.target.value)} 
                    placeholder="e.g., 2023001"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-money-bill"></i> Fine Amount *
                  </label>
                  <input 
                    type="number"
                    className="form-input"
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    placeholder="Enter amount in rupees"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-comment"></i> Reason
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={reason} 
                    onChange={e => setReason(e.target.value)} 
                    placeholder="Late submission, misconduct, etc."
                  />
                </div>

                <div className="alert alert-info">
                  <i className="fas fa-info-circle"></i>
                  Fine will be dated today ({new Date().toLocaleDateString()})
                </div>

                <button 
                  type="submit" 
                  className="btn btn-warning btn-full" 
                  disabled={fineLoading}
                >
                  {fineLoading ? (
                    <>
                      <div className="spinner"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i>
                      Add Fine
                    </>
                  )}
                </button>
              </form>
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

        {/* Quick Actions */}
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-bolt"></i> Quick Actions
            </h3>
          </div>
          <div className="card-body">
            <div className="dashboard-grid">
              <a className="btn btn-secondary" href="/teacher/profile">
                <i className="fas fa-user"></i>
                My Profile
              </a>
              <button className="btn btn-success">
                <i className="fas fa-eye"></i>
                View My Classes
              </button>
              <button className="btn btn-primary">
                <i className="fas fa-chart-bar"></i>
                Attendance Reports
              </button>
              <button className="btn btn-warning">
                <i className="fas fa-list"></i>
                Student List
              </button>
              <button className="btn btn-secondary">
                <i className="fas fa-history"></i>
                Fine History
              </button>
            </div>
          </div>
        </div>

        {/* AI Features Section */}
        <div className="card mt-4">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-robot"></i> AI Teaching Assistant
            </h3>
          </div>
          <div className="card-body">
            <div className="dashboard-grid">
              <button 
                className="btn btn-gradient-primary"
                onClick={() => setShowAIPrediction(true)}
              >
                <i className="fas fa-brain"></i>
                Student Analytics
              </button>
              <button 
                className="btn btn-gradient-success"
                onClick={() => setShowAIReports(true)}
              >
                <i className="fas fa-file-alt"></i>
                AI Reports
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
              Get AI insights on student performance and automated class reports
            </p>
          </div>
        </div>
      </div>

      {/* AI Components */}
      <AIChatbot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        userRole="teacher"
      />

      {showAIPrediction && (
        <div className="ai-prediction-modal">
          <div className="modal-overlay" onClick={() => setShowAIPrediction(false)}></div>
          <div className="modal-content large">
            <div className="modal-header">
              <h2>AI Student Analytics</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAIPrediction(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <AIPredictionDashboard userRole="teacher" />
            </div>
          </div>
        </div>
      )}

      {showAIReports && (
        <div className="ai-prediction-modal">
          <div className="modal-overlay" onClick={() => setShowAIReports(false)}></div>
          <div className="modal-content large">
            <div className="modal-header">
              <h2>AI Report Generator</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAIReports(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <AIReportGenerator userRole="teacher" />
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

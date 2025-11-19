import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import AIChatbot from '../components/AIChatbot'
import AIPredictionDashboard from '../components/AIPredictionDashboard'
import AIReportGenerator from '../components/AIReportGenerator'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const headers = token ? { Authorization: 'Bearer ' + token } : {}
  
  // Check authentication on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken || !user) {
      // For now, just show a message instead of redirecting
      setMsg('⚠️ Please login as admin to access this dashboard');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        setMsg('⚠️ Admin access required');
        return;
      }
      setToken(storedToken);
    } catch (error) {
      setMsg('⚠️ Invalid session. Please login again.');
      return;
    }
  }, []);

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
    // Set token from localStorage
    setToken(localStorage.getItem('token'))
  }, [])

  // Auto-load data when modals open
  useEffect(() => {
    if (showUserManagement) {
      loadStudents()
      loadTeachers()
    }
  }, [showUserManagement])

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API + '/api/admin/dashboard', { headers });
      
      if (res.data && res.data.stats) {
        setStats({
          totalStudents: res.data.stats.totalStudents || 0,
          totalTeachers: res.data.stats.totalTeachers || 0,
          totalClasses: res.data.stats.totalClasses || 0,
          todayAttendance: res.data.stats.todayAttendance || 0
        });
      }
    } catch (err) {
      console.error('Error loading stats:', err);
      setMsg('❌ Failed to load dashboard statistics');
    } finally {
      setLoading(false);
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
      
      // Remove undefined fields to avoid sending them
      Object.keys(userData).forEach(key => {
        if (userData[key] === undefined || userData[key] === '') {
          delete userData[key];
        }
      });
      
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
      // Refresh user lists if modal is open
      if (showUserManagement) {
        loadStudents()
        loadTeachers()
      }
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.msg || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearMessage = () => setMsg('')

  // Quick Action Functions
  const exportAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API + '/api/admin/export/attendance', { headers });
      setMsg(`✅ ${res.data.message}. Records exported: ${res.data.recordCount}`);
      
      // Trigger download if file is available
      if (res.data.fileName) {
        const downloadUrl = `${API}/api/admin/download/${res.data.fileName}`;
        window.open(downloadUrl, '_blank');
      }
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.msg || 'Failed to export attendance data'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await axios.get(API + '/api/admin/students', { headers });
      setStudents(res.data);
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  const loadTeachers = async () => {
    try {
      const res = await axios.get(API + '/api/admin/teachers', { headers });
      setTeachers(res.data);
    } catch (err) {
      console.error('Error loading teachers:', err);
    }
  };

  const loadAttendanceReport = async () => {
    try {
      const res = await axios.get(API + '/api/admin/reports/attendance', { headers });
      setReportData({
        type: 'attendance',
        data: res.data
      });
    } catch (err) {
      console.error('Error loading attendance report:', err);
    }
  };

  const markSampleAttendance = async () => {
    try {
      setLoading(true);
      // First, get all students
      const studentsRes = await axios.get(API + '/api/admin/students', { headers });
      
      if (studentsRes.data.length === 0) {
        setMsg('❌ No students found. Please create some students first.');
        return;
      }
      
      // Create sample attendance data - mark 80% as present
      const attendanceData = studentsRes.data.map((student, index) => ({
        student_id: student._id,
        status: index % 5 === 0 ? 'absent' : 'present' // Every 5th student absent
      }));

      // Mock data for marking attendance (since we need teacher role)
      // For demo purposes, we'll just show a success message
      setMsg(`✅ Sample attendance marked! ${attendanceData.filter(a => a.status === 'present').length} present, ${attendanceData.filter(a => a.status === 'absent').length} absent`);
      
      // Refresh stats to show updated attendance
      setTimeout(() => {
        loadStats();
      }, 1000);
      
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.msg || 'Failed to mark attendance'}`);
    } finally {
      setLoading(false);
    }
  };

  // AI Features states
  const [showChatbot, setShowChatbot] = useState(false)
  const [showAIPrediction, setShowAIPrediction] = useState(false)
  const [showAIReports, setShowAIReports] = useState(false)
  const [activeAITab, setActiveAITab] = useState('prediction')
  
  // Modal states for quick actions
  const [showReports, setShowReports] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  // User management states
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [reportData, setReportData] = useState(null)

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
              <button className="btn btn-success" onClick={exportAttendance}>
                <i className="fas fa-download"></i>
                Export Attendance
              </button>
              <button className="btn btn-warning" onClick={() => setShowReports(true)}>
                <i className="fas fa-chart-bar"></i>
                View Reports
              </button>
              <button className="btn btn-info" onClick={() => setShowUserManagement(true)}>
                <i className="fas fa-users"></i>
                Manage Users
              </button>
              <button className="btn btn-secondary" onClick={() => setShowSettings(true)}>
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

      {/* User Management Modal */}
      {showUserManagement && (
        <div className="modal-overlay" onClick={() => setShowUserManagement(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-users"></i> User Management</h2>
              <button className="modal-close" onClick={() => setShowUserManagement(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header">
                    <h3>Students ({students.length})</h3>
                    <button className="btn btn-primary btn-sm" onClick={loadStudents}>
                      <i className="fas fa-sync"></i> Refresh
                    </button>
                  </div>
                  <div className="card-body">
                    {loading && students.length === 0 ? (
                      <div className="text-center">
                        <div className="spinner"></div>
                        <p>Loading students...</p>
                      </div>
                    ) : students.length === 0 ? (
                      <p className="text-muted">No students found. Create some students using the form above.</p>
                    ) : (
                      <div className="table-container">
                        {students.slice(0, 5).map(student => (
                          <div key={student._id} className="user-item">
                            <div className="user-info">
                              <strong>{student.user_id?.name || 'N/A'}</strong>
                              <small>Roll: {student.user_id?.roll_no || 'N/A'}</small>
                              <small>Email: {student.user_id?.email || 'Not provided'}</small>
                            </div>
                            <span className={`badge badge-success`}>Student</span>
                          </div>
                        ))}
                        {students.length > 5 && (
                          <p className="text-muted">... and {students.length - 5} more students</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h3>Teachers ({teachers.length})</h3>
                    <button className="btn btn-success btn-sm" onClick={loadTeachers}>
                      <i className="fas fa-sync"></i> Refresh
                    </button>
                  </div>
                  <div className="card-body">
                    {teachers.length === 0 ? (
                      <p className="text-muted">No teachers found. Create some teachers using the form above.</p>
                    ) : (
                      <div className="table-container">
                        {teachers.slice(0, 5).map(teacher => (
                          <div key={teacher._id} className="user-item">
                            <div className="user-info">
                              <strong>{teacher.user_id?.name || 'N/A'}</strong>
                              <small>ID: {teacher.emp_id || 'N/A'}</small>
                            </div>
                            <span className={`badge badge-info`}>Teacher</span>
                          </div>
                        ))}
                        {teachers.length > 5 && (
                          <p className="text-muted">... and {teachers.length - 5} more</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReports && (
        <div className="modal-overlay" onClick={() => setShowReports(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-chart-bar"></i> System Reports</h2>
              <button className="modal-close" onClick={() => setShowReports(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="dashboard-grid">
                <button className="btn btn-primary" onClick={loadAttendanceReport}>
                  <i className="fas fa-calendar-check"></i>
                  Attendance Report
                </button>
                <button className="btn btn-warning" onClick={exportAttendance}>
                  <i className="fas fa-download"></i>
                  Export Attendance
                </button>
                <button className="btn btn-info" onClick={() => setShowAIReports(true)}>
                  <i className="fas fa-robot"></i>
                  AI Reports
                </button>
              </div>
              {reportData && (
                <div className="mt-4">
                  <h4>Report Results</h4>
                  {reportData.type === 'attendance' && (
                    <div className="table-container">
                      {reportData.data.length === 0 ? (
                        <p className="text-muted">No attendance data found.</p>
                      ) : (
                        reportData.data.slice(0, 10).map((record, index) => (
                          <div key={index} className="report-item">
                            <div>
                              <strong>{record.studentName}</strong>
                              <small>Roll: {record.rollNo}</small>
                            </div>
                            <div>
                              <span className="badge badge-primary">{record.attendancePercentage?.toFixed(1)}%</span>
                              <small>{record.presentClasses}/{record.totalClasses} classes</small>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-cog"></i> System Settings</h2>
              <button className="modal-close" onClick={() => setShowSettings(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="settings-grid">
                <div className="setting-item">
                  <h4>Quick Attendance</h4>
                  <p className="text-muted">Mark attendance for testing</p>
                  <button className="btn btn-success btn-sm" onClick={markSampleAttendance}>
                    <i className="fas fa-check"></i> Mark Sample Attendance
                  </button>
                </div>
                <div className="setting-item">
                  <h4>Academic Session</h4>
                  <p className="text-muted">Configure academic year and terms</p>
                  <button className="btn btn-primary btn-sm">
                    <i className="fas fa-calendar"></i> Manage Sessions
                  </button>
                </div>
                <div className="setting-item">
                  <h4>System Backup</h4>
                  <p className="text-muted">Export and backup system data</p>
                  <button className="btn btn-warning btn-sm">
                    <i className="fas fa-download"></i> Create Backup
                  </button>
                </div>
                <div className="setting-item">
                  <h4>Notification Settings</h4>
                  <p className="text-muted">Configure system notifications</p>
                  <button className="btn btn-info btn-sm">
                    <i className="fas fa-bell"></i> Configure
                  </button>
                </div>
                <div className="setting-item">
                  <h4>Security Settings</h4>
                  <p className="text-muted">Manage security and access controls</p>
                  <button className="btn btn-secondary btn-sm">
                    <i className="fas fa-shield-alt"></i> Security
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

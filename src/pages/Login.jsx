import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS, apiRequest, setAuthToken } from '../utils/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [password, setPassword] = useState('')
  const [loginType, setLoginType] = useState('email') // 'email' or 'rollno'
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if user is already logged in and redirect appropriately
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        // Redirect to appropriate dashboard based on role
        if (userData.role === 'admin') window.location = '/admin';
        else if (userData.role === 'teacher') window.location = '/teacher';
        else if (userData.role === 'student') window.location = '/student';
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    
    try {
      const loginData = {
        password,
        ...(loginType === 'email' ? { email } : { roll_no: rollNo })
      }
      
      const response = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(loginData)
      })
      
      const { token, user } = response
      
      setAuthToken(token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('role', user.role)
      // If teacher, fetch teacher profile to store teacherId for dev auth fallback
      if (user.role === 'teacher') {
        try {
          const profile = await apiRequest(API_ENDPOINTS.PROFILE);
          if (profile?.teacher?.id) {
            localStorage.setItem('teacherId', profile.teacher.id);
          } else if (profile?.teacher?._id) {
            localStorage.setItem('teacherId', profile.teacher._id);
          }
        } catch (e) {
          // ignore profile fetch errors; token still set
          console.warn('Could not fetch teacher profile after login', e);
        }
      }
      
      // Redirect based on role
      if (user.role === 'admin') window.location = '/admin'
      if (user.role === 'teacher') window.location = '/teacher'
      if (user.role === 'student') window.location = '/student'
    } catch (err) {
      setMsg(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container fade-in">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h1 className="login-title">Islamic College</h1>
          <p className="login-subtitle">Attendance & Exam Management System</p>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Login Method</label>
            <div className="login-toggle">
              <button 
                type="button"
                className={`toggle-btn ${loginType === 'email' ? 'active' : ''}`}
                onClick={() => setLoginType('email')}
              >
                <i className="fas fa-envelope"></i> Email
              </button>
              <button 
                type="button"
                className={`toggle-btn ${loginType === 'rollno' ? 'active' : ''}`}
                onClick={() => setLoginType('rollno')}
              >
                <i className="fas fa-id-card"></i> Roll No
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className={`fas ${loginType === 'email' ? 'fa-envelope' : 'fa-id-card'}`}></i> 
              {loginType === 'email' ? 'Email Address' : 'Roll Number'}
            </label>
            {loginType === 'email' ? (
              <input 
                type="email"
                className="form-input"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your email address"
                required
              />
            ) : (
              <input 
                type="text"
                className="form-input"
                value={rollNo} 
                onChange={e => setRollNo(e.target.value.toUpperCase())} 
                placeholder="Enter your roll number (e.g., BCA24A001)"
                required
              />
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-lock"></i> Password
            </label>
            <input 
              type="password"
              className="form-input"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required
            />
          </div>

          {msg && (
            <div className={`alert ${msg.includes('success') ? 'alert-success' : 'alert-error'}`}>
              <i className={`fas ${msg.includes('success') ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
              {msg}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-lg btn-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="card-footer text-center mt-4">
          <div className="alert alert-info">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Getting Started:</strong><br />
              Students use Roll Number • Faculty/Admin use Email<br />
              Contact administrator for account setup
            </div>
          </div>
          
          <div className="mt-3 text-muted">
            <p><strong>Admin Login:</strong></p>
            <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
              <div><strong>Email:</strong> Sulusulthan230@gmail.com</div>
              <div><strong>Password:</strong> Sulu@123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    
    try {
      const res = await axios.post(API + '/api/auth/login', { identifier, password })
      const { token, user } = res.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('role', user.role)
      
      // Redirect based on role
      if (user.role === 'admin') window.location = '/admin'
      if (user.role === 'teacher') window.location = '/teacher'
      if (user.role === 'student') window.location = '/student'
    } catch (err) {
      setMsg(err.response?.data?.msg || err.message)
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
          <h1 className="login-title">EduTrack</h1>
          <p className="login-subtitle">College Attendance Management System</p>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-user"></i> Student ID / Email
            </label>
            <input 
              type="text"
              className="form-input"
              value={identifier} 
              onChange={e => setIdentifier(e.target.value)} 
              placeholder="Enter your student ID or email"
              required
            />
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
            <p><strong>Demo Credentials:</strong></p>
            <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
              <div><strong>Admin:</strong> admin@college.edu / admin123</div>
              <div><strong>Teacher:</strong> teacher@college.edu / teacher123</div>
              <div><strong>Student:</strong> 2023001 / student123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

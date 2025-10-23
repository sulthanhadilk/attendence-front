import React, { useState } from 'react'
import { API_ENDPOINTS, apiRequest, setAuthToken } from '../utils/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    
    try {
      const loginData = {
        email,
        password
      }
      
      const response = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(loginData)
      })
      
      const { token, user } = response
      
      setAuthToken(token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('role', user.role)
      
      // Only admin access allowed
      if (user.role === 'admin') {
        window.location = '/admin'
      } else {
        throw new Error('Access denied. Admin access only.')
      }
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
            <label className="form-label">
              <i className="fas fa-envelope"></i> Email Address
            </label>
            <input 
              type="email"
              className="form-input"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter admin email address"
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
            <i className="fas fa-shield-alt"></i>
            <div>
              <strong>Admin Access Only</strong><br />
              This system is restricted to administrators only.<br />
              Contact system administrator for access.
            </div>
          </div>
          
          <div className="mt-3 text-muted">
            <p><strong>System Administrator:</strong></p>
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

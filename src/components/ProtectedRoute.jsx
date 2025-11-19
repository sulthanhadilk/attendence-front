import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  const location = useLocation()

  // Missing auth entirely
  if (!token || !userRaw) {
    return (
      <div className="page-container fade-in">
        <div className="container">
          <div className="alert alert-warning">
            ⚠️ Authentication required. Please login to access this page.
          </div>
          <a className="btn btn-primary" href="/">Go to Login</a>
        </div>
      </div>
    )
  }

  try {
    const user = JSON.parse(userRaw)
    if (requiredRole && user.role !== requiredRole) {
      return (
        <div className="page-container fade-in">
          <div className="container">
            <div className="alert alert-error">
              ❌ Access denied: {requiredRole} role required.
            </div>
            <a className="btn btn-secondary" href="/">Switch Account</a>
          </div>
        </div>
      )
    }
    return children
  } catch (e) {
    console.error('Invalid user data', e)
    return <Navigate to="/" replace state={{ from: location }} />
  }
}

export default ProtectedRoute
import React from 'react'
export default function Header({ userRole, userName }) {
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    window.location.href = '/'
  }
  const getInitials = (name) => {
    if (!name) return userRole ? userRole.charAt(0).toUpperCase() : 'U'
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
  }
  const getRoleDisplay = (role) => {
    switch(role) {
      case 'admin': return 'Administrator'
      case 'teacher': return 'Faculty'
      case 'student': return 'Student'
      default: return 'User'
    }
  }
  return (
    <header className="app-header">
      <div className="header-content">
        <a href="/" className="logo">
          <div className="logo-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="logo-text">
            <div className="logo-title">EduTrack</div>
            <div className="logo-subtitle">Attendance Management</div>
          </div>
        </a>
        {userRole && (
          <div className="user-menu">
            <div className="user-info">
              <div className="user-avatar">
                {getInitials(userName)}
              </div>
              <div className="user-details">
                <div className="user-name">{userName || getRoleDisplay(userRole)}</div>
                <div className="user-role">{getRoleDisplay(userRole)}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../components/Header'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalClasses: 0, todayAttendance: 0 })

  // Minimal auth check (non-blocking)
  useEffect(() => {
    const userRaw = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!userRaw || !t) {
      setMsg('⚠️ Not authenticated. Login to see live data.')
      return
    }
    try {
      const user = JSON.parse(userRaw)
      if (user.role !== 'admin') {
        setMsg('⚠️ Admin role required. Limited view.')
        return
      }
      setToken(t)
      setMsg('')
    } catch {
      setMsg('⚠️ Session invalid. Please login again.')
    }
  }, [])

  // Fetch stats
  const fetchStats = async () => {
    if (!token) return // skip if no token
    try {
      setLoading(true)
      const res = await axios.get(API + '/api/admin/dashboard', { headers: { Authorization: 'Bearer ' + token } })
      if (res.data?.stats) {
        setStats({
          totalStudents: res.data.stats.totalStudents || 0,
            totalTeachers: res.data.stats.totalTeachers || 0,
            totalClasses: res.data.stats.totalClasses || 0,
            todayAttendance: res.data.stats.todayAttendance || 0
        })
      } else {
        setMsg('⚠️ Stats unavailable.')
      }
    } catch (e) {
      setMsg('❌ Failed to load stats. ' + (e.response?.data?.msg || e.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [token])

  return (
    <div className="page-container fade-in">
      <Header userRole="admin" userName="Administrator" />
      <div className="container">
        <h1 className="login-title text-primary"><i className="fas fa-tachometer-alt"></i> Admin Dashboard</h1>
        <p className="text-muted">System overview and key metrics</p>

        {msg && (
          <div className={`alert ${msg.startsWith('❌') ? 'alert-error' : msg.startsWith('⚠️') ? 'alert-warning' : 'alert-success'}`}> 
            {msg}
            <button type="button" onClick={() => setMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
          </div>
        )}

        <div className="dashboard-grid mb-4">
          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon primary"><i className="fas fa-user-graduate"></i></div>
              <div>
                <div className="stats-value">{stats.totalStudents}</div>
                <div className="stats-label">Students</div>
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon success"><i className="fas fa-chalkboard-teacher"></i></div>
              <div>
                <div className="stats-value">{stats.totalTeachers}</div>
                <div className="stats-label">Teachers</div>
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon warning"><i className="fas fa-book"></i></div>
              <div>
                <div className="stats-value">{stats.totalClasses}</div>
                <div className="stats-label">Classes</div>
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-header">
              <div className="stats-icon info"><i className="fas fa-chart-line"></i></div>
              <div>
                <div className="stats-value">{stats.todayAttendance}%</div>
                <div className="stats-label">Today Attendance</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title"><i className="fas fa-sync"></i> Actions</h2></div>
          <div className="card-body">
            <div className="dashboard-grid">
              <button className="btn btn-primary" disabled={loading || !token} onClick={fetchStats}>
                {loading ? 'Loading...' : 'Reload Stats'}
              </button>
              <button className="btn btn-secondary" onClick={() => { localStorage.clear(); setToken(null); setMsg('⚠️ Logged out. Please login again.') }}>Logout</button>
            </div>
            {!token && (
              <p className="text-muted mt-3">Login as admin (email: sulusulthan230@gmail.com / password: Sulu@123) to view live stats.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

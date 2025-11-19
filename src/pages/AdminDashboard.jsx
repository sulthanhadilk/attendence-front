import React, { Suspense, lazy, useEffect, useState } from 'react'
import Header from '../components/Header'
import useAdminData from '../hooks/useAdminData'
import UserCreateForm from '../components/admin/UserCreateForm'
import QuickActions from '../components/admin/QuickActions'
import UserManagementModal from '../components/admin/modals/UserManagementModal'
import ReportsModal from '../components/admin/modals/ReportsModal'
import SettingsModal from '../components/admin/modals/SettingsModal'
import AISection from '../components/admin/AISection'

const AIChatbot = lazy(()=> import('../components/AIChatbot'))
const AIPredictionDashboard = lazy(()=> import('../components/AIPredictionDashboard'))
const AIReportGenerator = lazy(()=> import('../components/AIReportGenerator'))

export default function AdminDashboard(){
  const [token,setToken]=useState(()=>localStorage.getItem('token'))
  const [authMsg,setAuthMsg]=useState('')
  const [globalMsg,setGlobalMsg]=useState('')
  const [showUsers,setShowUsers]=useState(false)
  const [showReports,setShowReports]=useState(false)
  const [showSettings,setShowSettings]=useState(false)
  const [showChatbot,setShowChatbot]=useState(false)
  const [showPrediction,setShowPrediction]=useState(false)
  const [showAIReports,setShowAIReports]=useState(false)
  const [exporting,setExporting]=useState(false)

  // Auth check (non-blocking)
  useEffect(()=>{
    const raw=localStorage.getItem('user');
    const t=localStorage.getItem('token');
    if(!raw||!t){ setAuthMsg('⚠️ Not authenticated. Login to unlock actions.'); return; }
    try{ const u=JSON.parse(raw); if(u.role!=='admin'){ setAuthMsg('⚠️ Admin role required. Limited view.'); return; } setToken(t); setAuthMsg(''); }catch{ setAuthMsg('⚠️ Session invalid. Please login again.'); }
  },[])

  const { stats, students, teachers, reportData, loading, fetchStats, fetchStudents, fetchTeachers, fetchAttendanceReport, exportAttendance } = useAdminData(token)

  useEffect(()=>{ fetchStats() },[token])

  const handleExport = async () => {
    setExporting(true)
    const res = await exportAttendance()
    setGlobalMsg(res.ok ? `✅ Exported attendance (${res.count} records)` : `❌ ${res.message}`)
    setExporting(false)
  }

  const markSampleAttendance = async () => {
    if(!students.length){ setGlobalMsg('⚠️ No students to mark sample attendance.'); return; }
    const present = students.filter((_,i)=> i%5!==0).length
    const absent = students.length - present
    setGlobalMsg(`✅ Sample attendance (demo only): ${present} present, ${absent} absent`)
    setTimeout(()=> fetchStats(),800)
  }

  const logout = () => { localStorage.clear(); setToken(null); setAuthMsg('⚠️ Logged out. Please login again.'); }

  return (
    <div className="page-container fade-in">
      <Header userRole="admin" userName="Administrator" />
      <div className="container">
        <h1 className="login-title text-primary"><i className="fas fa-tachometer-alt"/> Admin Dashboard</h1>
        <p className="text-muted">Administrative control center</p>

        {(authMsg || globalMsg) && (
          <div className={`alert ${(authMsg||globalMsg).startsWith('❌')?'alert-error':(authMsg||globalMsg).startsWith('⚠️')?'alert-warning':'alert-success'}`}>
            {authMsg || globalMsg}
            <button type="button" onClick={()=>{setAuthMsg('');setGlobalMsg('')}} style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.1rem',float:'right'}}>×</button>
          </div>
        )}

        {/* Stats */}
        <div className="dashboard-grid mb-4">
          <div className="stats-card"><div className="stats-header"><div className="stats-icon primary"><i className="fas fa-user-graduate"/></div><div><div className="stats-value">{stats.totalStudents}</div><div className="stats-label">Students</div></div></div></div>
          <div className="stats-card"><div className="stats-header"><div className="stats-icon success"><i className="fas fa-chalkboard-teacher"/></div><div><div className="stats-value">{stats.totalTeachers}</div><div className="stats-label">Teachers</div></div></div></div>
          <div className="stats-card"><div className="stats-header"><div className="stats-icon warning"><i className="fas fa-book"/></div><div><div className="stats-value">{stats.totalClasses}</div><div className="stats-label">Classes</div></div></div></div>
          <div className="stats-card"><div className="stats-header"><div className="stats-icon info"><i className="fas fa-chart-line"/></div><div><div className="stats-value">{stats.todayAttendance}%</div><div className="stats-label">Today Attendance</div></div></div></div>
        </div>

        {/* Actions */}
        <div className="card">
          <div className="card-header"><h2 className="card-title"><i className="fas fa-sync"/> Core Actions</h2></div>
          <div className="card-body">
            <div className="dashboard-grid">
              <button className="btn btn-primary" disabled={loading || !token} onClick={fetchStats}>{loading? 'Loading...' : 'Reload Stats'}</button>
              <button className="btn btn-secondary" onClick={logout}>Logout</button>
            </div>
            {!token && <p className="text-muted mt-3">Login (admin) to enable creation & exports.</p>}
          </div>
        </div>

        {/* User Create Form */}
        <UserCreateForm token={token} disabled={!token} onCreated={()=> { fetchStats(); if(showUsers){ fetchStudents(); fetchTeachers(); } }} />

        {/* AI Section */}
        <AISection onShowPrediction={()=>setShowPrediction(true)} onShowReports={()=>setShowAIReports(true)} onShowChatbot={()=>setShowChatbot(true)} />

        {/* Quick Actions */}
        <QuickActions onExport={handleExport} onShowReports={()=>setShowReports(true)} onShowUsers={()=>{ setShowUsers(true); fetchStudents(); fetchTeachers(); }} onShowSettings={()=>setShowSettings(true)} exporting={exporting} disabled={!token} />
      </div>

      {/* Modals */}
      <UserManagementModal open={showUsers} onClose={()=>setShowUsers(false)} students={students} teachers={teachers} onRefreshStudents={fetchStudents} onRefreshTeachers={fetchTeachers} loading={loading} />
      <ReportsModal open={showReports} onClose={()=>setShowReports(false)} onLoadAttendance={fetchAttendanceReport} reportData={reportData} onExportAttendance={handleExport} />
      <SettingsModal open={showSettings} onClose={()=>setShowSettings(false)} onSampleAttendance={markSampleAttendance} />

      {/* AI Modals */}
      <Suspense fallback={<div className="modal-overlay"><div className="modal-content"><div className="spinner"/> Loading AI...</div></div>}>
        {showChatbot && <AIChatbot isOpen={showChatbot} onClose={()=>setShowChatbot(false)} userRole="admin" />}
        {showPrediction && (
          <div className="ai-prediction-modal">
            <div className="modal-overlay" onClick={()=>setShowPrediction(false)} />
            <div className="modal-content large">
              <div className="modal-header"><h2>AI Student Analysis & Predictions</h2><button className="modal-close" onClick={()=>setShowPrediction(false)}><i className="fas fa-times"/></button></div>
              <div className="modal-body"><AIPredictionDashboard userRole="admin"/></div>
            </div>
          </div>
        )}
        {showAIReports && (
          <div className="ai-prediction-modal">
            <div className="modal-overlay" onClick={()=>setShowAIReports(false)} />
            <div className="modal-content large">
              <div className="modal-header"><h2>AI-Powered Report Generator</h2><button className="modal-close" onClick={()=>setShowAIReports(false)}><i className="fas fa-times"/></button></div>
              <div className="modal-body"><AIReportGenerator userRole="admin"/></div>
            </div>
          </div>
        )}
      </Suspense>

      {/* Floating AI Button */}
      <button className="ai-floating-btn pulse" onClick={()=>setShowChatbot(true)} title="Ask AI Assistant"><i className="fas fa-robot"/></button>
    </div>
  )
}

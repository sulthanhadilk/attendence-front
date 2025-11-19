import React, { useEffect } from 'react';

export default function UserManagementModal({ open, onClose, students, teachers, onRefreshStudents, onRefreshTeachers, loading }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-users"/> User Management</h2>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"/></button>
        </div>
        <div className="modal-body">
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header d-flex" style={{justifyContent:'space-between',alignItems:'center'}}>
                <h3>Students ({students.length})</h3>
                <button className="btn btn-primary btn-sm" onClick={onRefreshStudents}><i className="fas fa-sync"/> Refresh</button>
              </div>
              <div className="card-body">
                {loading && students.length===0 ? <div className="text-center"><div className="spinner"/><p>Loading...</p></div> : (
                  students.length===0 ? <p className="text-muted">No students found.</p> : (
                    <div className="table-container">
                      {students.slice(0,5).map(s=> (
                        <div key={s._id} className="user-item">
                          <div className="user-info">
                            <strong>{s.user_id?.name || 'N/A'}</strong>
                            <small>Roll: {s.user_id?.roll_no || 'N/A'}</small>
                            <small>Email: {s.user_id?.email || 'Not provided'}</small>
                          </div>
                          <span className="badge badge-success">Student</span>
                        </div>
                      ))}
                      {students.length>5 && <p className="text-muted">... and {students.length-5} more</p>}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="card">
              <div className="card-header d-flex" style={{justifyContent:'space-between',alignItems:'center'}}>
                <h3>Teachers ({teachers.length})</h3>
                <button className="btn btn-success btn-sm" onClick={onRefreshTeachers}><i className="fas fa-sync"/> Refresh</button>
              </div>
              <div className="card-body">
                {teachers.length===0 ? <p className="text-muted">No teachers found.</p> : (
                  <div className="table-container">
                    {teachers.slice(0,5).map(t=> (
                      <div key={t._id} className="user-item">
                        <div className="user-info">
                          <strong>{t.user_id?.name || 'N/A'}</strong>
                          <small>ID: {t.emp_id || 'N/A'}</small>
                        </div>
                        <span className="badge badge-info">Teacher</span>
                      </div>
                    ))}
                    {teachers.length>5 && <p className="text-muted">... and {teachers.length-5} more</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

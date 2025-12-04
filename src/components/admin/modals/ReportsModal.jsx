import React from 'react';
export default function ReportsModal({ open, onClose, onLoadAttendance, reportData, onExportAttendance, onShowAIReports }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-chart-bar"/> System Reports</h2>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"/></button>
        </div>
        <div className="modal-body">
          <div className="dashboard-grid">
            <button className="btn btn-primary" onClick={onLoadAttendance}><i className="fas fa-calendar-check"/> Attendance Report</button>
            <button className="btn btn-warning" onClick={onExportAttendance}><i className="fas fa-download"/> Export Attendance</button>
            {onShowAIReports && (
              <button className="btn btn-info" onClick={onShowAIReports}><i className="fas fa-robot"/> AI Reports</button>
            )}
          </div>
          {reportData && reportData.type==='attendance' && (
            <div className="mt-4">
              <h4>Attendance</h4>
              <div className="table-container">
                {reportData.data.length===0 ? <p className="text-muted">No attendance data.</p> : (
                  reportData.data.slice(0,10).map((r,i)=>(
                    <div key={i} className="report-item">
                      <div>
                        <strong>{r.studentName}</strong>
                        <small>Roll: {r.rollNo}</small>
                      </div>
                      <div>
                        <span className="badge badge-primary">{r.attendancePercentage?.toFixed(1)}%</span>
                        <small>{r.presentClasses}/{r.totalClasses} classes</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

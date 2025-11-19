import React from 'react';

export default function QuickActions({ onExport, onShowReports, onShowUsers, onShowSettings, exporting, disabled }) {
  return (
    <div className="card mt-4">
      <div className="card-header">
        <h3 className="card-title"><i className="fas fa-bolt"/> Quick Actions</h3>
      </div>
      <div className="card-body">
        <div className="dashboard-grid">
          <button className="btn btn-success" disabled={disabled || exporting} onClick={onExport}>
            <i className="fas fa-download"/> {exporting? 'Exporting...' : 'Export Attendance'}
          </button>
          <button className="btn btn-warning" disabled={disabled} onClick={onShowReports}>
            <i className="fas fa-chart-bar"/> View Reports
          </button>
          <button className="btn btn-info" disabled={disabled} onClick={onShowUsers}>
            <i className="fas fa-users"/> Manage Users
          </button>
          <button className="btn btn-secondary" disabled={disabled} onClick={onShowSettings}>
            <i className="fas fa-cog"/> System Settings
          </button>
        </div>
      </div>
    </div>
  );
}

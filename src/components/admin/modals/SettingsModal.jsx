import React from 'react';
export default function SettingsModal({ open, onClose, onSampleAttendance }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-cog"/> System Settings</h2>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"/></button>
        </div>
        <div className="modal-body">
          <div className="settings-grid">
            <div className="setting-item">
              <h4>Quick Attendance</h4>
              <p className="text-muted">Mark sample attendance (demo only)</p>
              <button className="btn btn-success btn-sm" onClick={onSampleAttendance}><i className="fas fa-check"/> Sample Attendance</button>
            </div>
            <div className="setting-item">
              <h4>Academic Session</h4>
              <p className="text-muted">Configure academic year</p>
              <button className="btn btn-primary btn-sm"><i className="fas fa-calendar"/> Manage Sessions</button>
            </div>
            <div className="setting-item">
              <h4>System Backup</h4>
              <p className="text-muted">Export system data</p>
              <button className="btn btn-warning btn-sm"><i className="fas fa-download"/> Create Backup</button>
            </div>
            <div className="setting-item">
              <h4>Notification Settings</h4>
              <p className="text-muted">Configure notifications</p>
              <button className="btn btn-info btn-sm"><i className="fas fa-bell"/> Configure</button>
            </div>
            <div className="setting-item">
              <h4>Security Settings</h4>
              <p className="text-muted">Access controls</p>
              <button className="btn btn-secondary btn-sm"><i className="fas fa-shield-alt"/> Security</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

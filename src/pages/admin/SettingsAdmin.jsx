import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function SettingsAdmin(){
  const [settings, setSettings] = useState({
    schoolName: 'Islamic College',
    schoolEmail: 'admin@college.edu',
    schoolPhone: '+1-234-567-8900',
    academicYear: '2024-2025',
    aiEnabled: true,
    maintenanceMode: false
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings({...settings, [key]: value});
    setSaved(false);
  };

  const handleSave = () => {
    // Save to localStorage for demo
    localStorage.setItem('schoolSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Settings" />
        <div className="p-4">
          {saved && (
            <div className="alert alert-success mb-4">✅ Settings saved successfully</div>
          )}
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">School Configuration</h3>
            </div>
            <div className="card-body">
              <div className="form-group mb-3">
                <label className="form-label">School Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.schoolName}
                  onChange={(e) => handleChange('schoolName', e.target.value)}
                />
              </div>
              
              <div className="form-group mb-3">
                <label className="form-label">School Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={settings.schoolEmail}
                  onChange={(e) => handleChange('schoolEmail', e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">School Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={settings.schoolPhone}
                  onChange={(e) => handleChange('schoolPhone', e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Academic Year</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.academicYear}
                  onChange={(e) => handleChange('academicYear', e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label d-block">
                  <input
                    type="checkbox"
                    checked={settings.aiEnabled}
                    onChange={(e) => handleChange('aiEnabled', e.target.checked)}
                  />
                  <span className="ms-2">Enable AI Features</span>
                </label>
              </div>

              <div className="form-group mb-3">
                <label className="form-label d-block">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  />
                  <span className="ms-2">Maintenance Mode</span>
                </label>
              </div>

              <button onClick={handleSave} className="btn btn-primary">Save Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

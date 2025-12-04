import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
  const [clearing, setClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState('');
  const token = localStorage.getItem('token');

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

  const handleClearTestData = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL teachers and students from the database. Admin accounts will be preserved. Are you sure?')) {
      return;
    }
    setClearing(true);
    setClearSuccess('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/debug/clear-test-data`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setClearSuccess(`✅ Successfully deleted ${data.deletedTeachers} teachers and ${data.deletedStudents} students`);
        setTimeout(() => setClearSuccess(''), 5000);
      } else {
        alert('Error: ' + data.msg);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
    setClearing(false);
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

          {/* Danger Zone */}
          <div className="bg-white rounded shadow mt-4 border-2 border-red-200">
            <div className="bg-red-50 px-4 py-3 border-b border-red-200">
              <h3 className="text-lg font-semibold text-red-800">⚠️ Danger Zone</h3>
            </div>
            <div className="p-4">
              {clearSuccess && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{clearSuccess}</div>
              )}
              <div className="mb-3">
                <h4 className="font-semibold mb-2">Clear Test Data</h4>
                <p className="text-sm text-gray-600 mb-3">
                  This will permanently delete all teachers and students from the database. 
                  Admin accounts will be preserved. Use this to start fresh or remove duplicate test data.
                </p>
                <button 
                  onClick={handleClearTestData} 
                  disabled={clearing}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                >
                  {clearing ? 'Clearing...' : '🗑️ Clear All Test Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

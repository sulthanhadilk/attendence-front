import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';

export default function Activities() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    attachments: []
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadActivities(selectedClass);
    }
  }, [selectedClass]);

  const loadClasses = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes`);
      setClasses(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const loadActivities = async (classId) => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/class/${classId}/activities`);
      setActivities(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;

    setLoading(true);
    setMessage('');

    try {
      await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/class/${selectedClass}/activity`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setMessage('Activity added successfully');
      setFormData({ title: '', description: '', date: new Date().toISOString().slice(0, 10), attachments: [] });
      loadActivities(selectedClass);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Class Activities</h1>
          <p className="text-gray-600">Record and manage class activities and events</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Activity Form */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Add Activity</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select class</option>
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name || c.section}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g., Science Fair, Cultural Program"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows="4"
                  placeholder="Describe the activity..."
                  required
                />
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('success')
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Activity'}
              </button>
            </form>
          </div>

          {/* Activities List */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {selectedClass ? 'No activities found' : 'Select a class to view activities'}
                </div>
              ) : (
                activities.map(activity => (
                  <div key={activity._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                    {activity.attachments && activity.attachments.length > 0 && (
                      <div className="text-xs text-indigo-600">
                        <i className="fas fa-paperclip mr-1"></i>
                        {activity.attachments.length} attachment(s)
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';

export default function Notifications() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    targetType: 'class',
    studentId: '',
    classId: '',
    title: '',
    body: ''
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadClasses();
    loadNotifications();
  }, []);

  useEffect(() => {
    if (formData.classId && formData.targetType === 'student') {
      loadStudents(formData.classId);
    }
  }, [formData.classId, formData.targetType]);

  const loadClasses = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes`);
      setClasses(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const loadStudents = async (classId) => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes/${classId}/students`);
      setStudents(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/notifications`);
      setNotifications(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/notifications`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setMessage('Notification sent successfully');
      setFormData({ targetType: 'class', studentId: '', classId: '', title: '', body: '' });
      loadNotifications();
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
          <h1 className="text-2xl font-bold text-gray-900">Student Notifications</h1>
          <p className="text-gray-600">Send notifications to individual students or entire classes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose Notification */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Compose Notification</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="targetType"
                      value="class"
                      checked={formData.targetType === 'class'}
                      onChange={e => setFormData({ ...formData, targetType: e.target.value, studentId: '' })}
                      className="mr-2"
                    />
                    Entire Class
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="targetType"
                      value="student"
                      checked={formData.targetType === 'student'}
                      onChange={e => setFormData({ ...formData, targetType: e.target.value })}
                      className="mr-2"
                    />
                    Individual Student
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={formData.classId}
                  onChange={e => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select class</option>
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name || c.section}</option>
                  ))}
                </select>
              </div>

              {formData.targetType === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={formData.studentId}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                    disabled={!formData.classId}
                  >
                    <option value="">Select student</option>
                    {students.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.user_id?.name} ({s.user_id?.roll_no})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Enter notification title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={formData.body}
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows="5"
                  placeholder="Enter your message..."
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
                {loading ? 'Sending...' : 'Send Notification'}
              </button>
            </form>
          </div>

          {/* Sent Notifications */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Sent Notifications</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No notifications sent yet</div>
              ) : (
                notifications.map(notif => (
                  <div key={notif._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notif.target === 'class' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {notif.target.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{notif.body}</p>
                    <div className="text-xs text-gray-500">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
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

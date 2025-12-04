import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';
export default function Resources() {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'REFERENCE',
    courseId: '',
    description: ''
  });
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filterType, setFilterType] = useState('all');
  useEffect(() => {
    loadResources();
  }, []);
  const loadResources = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/resources`);
      setResources(data);
    } catch (err) {
      setMessage(err.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/resources`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setMessage('Resource link added successfully');
      setFormData({ title: '', url: '', type: 'REFERENCE', courseId: '', description: '' });
      loadResources();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };
  const filteredResources = resources.filter(r => 
    filterType === 'all' || r.type === filterType
  );
  const getTypeIcon = (type) => {
    switch(type) {
      case 'LMS': return 'fa-graduation-cap';
      case 'VIDEO': return 'fa-video';
      case 'DOCUMENT': return 'fa-file-alt';
      default: return 'fa-link';
    }
  };
  const getTypeColor = (type) => {
    switch(type) {
      case 'LMS': return 'bg-purple-100 text-purple-700';
      case 'VIDEO': return 'bg-red-100 text-red-700';
      case 'DOCUMENT': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Resources & LMS Links</h1>
          <p className="text-gray-600">Manage learning resources and important links</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Add Resource</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g., Course LMS Portal, Chapter 3 PDF"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="LMS">LMS</option>
                  <option value="REFERENCE">Reference</option>
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Document</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course ID (Optional)</label>
                <input
                  type="text"
                  value={formData.courseId}
                  onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Link to specific course/subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Brief description of the resource..."
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
                {loading ? 'Adding...' : 'Add Resource'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Resources</h2>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">All Types</option>
                <option value="LMS">LMS</option>
                <option value="REFERENCE">Reference</option>
                <option value="VIDEO">Video</option>
                <option value="DOCUMENT">Document</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredResources.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No resources found</div>
              ) : (
                filteredResources.map(resource => (
                  <div key={resource._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                        <i className={`fas ${getTypeIcon(resource.type)}`}></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                        {resource.description && (
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                        )}
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-700 break-all"
                        >
                          {resource.url}
                          <i className="fas fa-external-link-alt ml-1 text-xs"></i>
                        </a>
                      </div>
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

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';
export default function Clubs() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: []
  });
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    loadClubs();
  }, []);
  const loadClubs = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/clubs`);
      setClubs(data);
    } catch (err) {
      setMessage(err.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/clubs`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setMessage('Club created successfully');
      setFormData({ name: '', description: '', members: [] });
      loadClubs();
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
          <h1 className="text-2xl font-bold text-gray-900">Clubs & Societies</h1>
          <p className="text-gray-600">Manage clubs and student societies</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Club</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g., Science Club, Literary Society"
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
                  placeholder="Describe the club's purpose and activities..."
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <i className="fas fa-info-circle mr-2"></i>
                You will be assigned as the club in-charge. Members can be added later.
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
                {loading ? 'Creating...' : 'Create Club'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">My Clubs</h2>
            <div className="space-y-4">
              {clubs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-users text-4xl mb-3 opacity-50"></i>
                  <p>No clubs created yet</p>
                  <p className="text-sm">Create your first club to get started</p>
                </div>
              ) : (
                clubs.map(club => (
                  <div key={club._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {club.name?.charAt(0) || 'C'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{club.name}</h3>
                        {club.description && (
                          <p className="text-sm text-gray-600 mb-3">{club.description}</p>
                        )}
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>
                            <i className="fas fa-users mr-1"></i>
                            {club.members?.length || 0} members
                          </span>
                          <span>
                            <i className="fas fa-calendar mr-1"></i>
                            {club.establishedDate 
                              ? new Date(club.establishedDate).toLocaleDateString()
                              : 'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                      <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs hover:bg-indigo-200">
                        View Members
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200">
                        Add Members
                      </button>
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

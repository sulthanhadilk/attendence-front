import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Teachers(){
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    designation: 'Teacher',
    joining_date: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/teachers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch teachers');
      }
      const data = await res.json();
      console.log('Teachers data:', data);
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teachers. Please refresh the page.');
    }
    setLoading(false);
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    console.log('Submitting teacher data:', formData);
    try {
      const res = await fetch(`${API_BASE}/api/admin/teachers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log('Response status:', res.status);
      console.log('Response data:', data);
      if (res.ok) {
        setFormData({ 
          name: '', 
          email: '', 
          phone: '', 
          designation: 'Teacher',
          joining_date: ''
        });
        setShowForm(false);
        setSuccess('Teacher created successfully!');
        fetchTeachers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.msg || data.message || 'Failed to create teacher');
        console.error('Error response:', data);
      }
    } catch (err) {
      console.error('Error adding teacher:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this teacher?')) return;
    try {
      await fetch(`${API_BASE}/api/admin/teachers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTeachers();
    } catch (err) {
      console.error('Error deleting teacher:', err);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Teachers Management" />
        <div className="p-4">
          {error && !showForm && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
          <button onClick={() => { setShowForm(!showForm); setError(''); }} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ Add Teacher'}
          </button>
          
          {showForm && (
            <form onSubmit={handleAddTeacher} className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-semibold mb-3">Add New Teacher</h3>
              {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
                {error}
                {error.includes('already exists') && (
                  <div className="mt-2 text-sm">
                    <p>💡 This email is already registered. Try:</p>
                    <ul className="list-disc ml-5 mt-1">
                      <li>Using a different email address</li>
                      <li>Check the teacher list below to see existing teachers</li>
                      <li>Delete the existing teacher if needed</li>
                    </ul>
                  </div>
                )}
              </div>}
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    placeholder="teacher@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1-234-567-8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Designation</label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Teacher">Teacher</option>
                    <option value="Senior Teacher">Senior Teacher</option>
                    <option value="Head of Department">Head of Department</option>
                    <option value="Assistant Teacher">Assistant Teacher</option>
                    <option value="Principal">Principal</option>
                    <option value="Vice Principal">Vice Principal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={formData.joining_date}
                    onChange={(e) => setFormData({...formData, joining_date: e.target.value})}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <p className="text-xs text-blue-800">ℹ️ Employee ID will be auto-generated (TCH001, TCH002, etc.)</p>
                <p className="text-xs text-blue-800">ℹ️ Default password: 123456 (teacher should change on first login)</p>
              </div>
              
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-3">
                Create Teacher
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-gray-600">Loading teachers...</p>
          ) : (
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Employee ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.length === 0 ? (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No teachers found</td></tr>
                  ) : (
                    teachers.map(teacher => (
                      <tr key={teacher._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 font-semibold text-blue-600">{teacher.employee_id || 'N/A'}</td>
                        <td className="px-4 py-2">{teacher.user_id?.name || 'N/A'}</td>
                        <td className="px-4 py-2">{teacher.user_id?.email || 'N/A'}</td>
                        <td className="px-4 py-2">{teacher.user_id?.phone || '-'}</td>
                        <td className="px-4 py-2">{teacher.department || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => handleDelete(teacher._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

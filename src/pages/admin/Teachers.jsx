import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Teachers(){
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', staffCode: '', department: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/teachers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTeachers(data.data || []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
    setLoading(false);
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/teachers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ name: '', email: '', staffCode: '', department: '' });
        setShowForm(false);
        fetchTeachers();
      }
    } catch (err) {
      console.error('Error adding teacher:', err);
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
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ Add Teacher'}
          </button>
          
          {showForm && (
            <form onSubmit={handleAddTeacher} className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-semibold mb-3">Add New Teacher</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Staff Code"
                  value={formData.staffCode}
                  onChange={(e) => setFormData({...formData, staffCode: e.target.value})}
                  required
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                  className="border p-2 rounded w-full mb-2"
                />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Teacher</button>
            </form>
          )}

          {loading ? (
            <p className="text-gray-600">Loading teachers...</p>
          ) : (
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Staff Code</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.length === 0 ? (
                    <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No teachers found</td></tr>
                  ) : (
                    teachers.map(teacher => (
                      <tr key={teacher._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{teacher.name || 'N/A'}</td>
                        <td className="px-4 py-2">{teacher.email || 'N/A'}</td>
                        <td className="px-4 py-2">{teacher.staffCode || 'N/A'}</td>
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

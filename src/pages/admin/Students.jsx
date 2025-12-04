import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Students(){
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', roll_no: '', class_id: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
    setLoading(false);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/students`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({ name: '', email: '', roll_no: '', class_id: '' });
        setShowForm(false);
        setSuccess('Student created successfully!');
        fetchStudents();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.msg || 'Failed to create student');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    try {
      await fetch(`${API_BASE}/api/admin/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Students Management" />
        <div className="p-4">
          {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">
            {showForm ? 'Cancel' : '+ Add Student'}
          </button>
          
          {showForm && (
            <form onSubmit={handleAddStudent} className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-semibold mb-3">Add New Student</h3>
              {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
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
                  placeholder="Roll No"
                  value={formData.roll_no}
                  onChange={(e) => setFormData({...formData, roll_no: e.target.value})}
                  required
                  className="border p-2 rounded w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Class ID"
                  value={formData.class_id}
                  onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                  className="border p-2 rounded w-full mb-2"
                />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Student</button>
            </form>
          )}

          {loading ? (
            <p className="text-gray-600">Loading students...</p>
          ) : (
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Roll No</th>
                    <th className="px-4 py-2 text-left">Class</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No students found</td></tr>
                  ) : (
                    students.map(student => (
                      <tr key={student._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{student.user_id?.name || 'N/A'}</td>
                        <td className="px-4 py-2">{student.user_id?.email || 'N/A'}</td>
                        <td className="px-4 py-2">{student.user_id?.roll_no || 'N/A'}</td>
                        <td className="px-4 py-2">{student.class_id?.name || student.class_id || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => handleDelete(student._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
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

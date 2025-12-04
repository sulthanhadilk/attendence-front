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
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary mb-4">
            {showForm ? 'Cancel' : '+ Add Teacher'}
          </button>
          
          {showForm && (
            <form onSubmit={handleAddTeacher} className="card mb-4">
              <div className="card-body">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="form-control mb-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  placeholder="Staff Code"
                  value={formData.staffCode}
                  onChange={(e) => setFormData({...formData, staffCode: e.target.value})}
                  required
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                  className="form-control mb-2"
                />
                <button type="submit" className="btn btn-success">Create Teacher</button>
              </div>
            </form>
          )}

          {loading ? (
            <p>Loading teachers...</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Staff Code</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.length === 0 ? (
                    <tr><td colSpan="5">No teachers found</td></tr>
                  ) : (
                    teachers.map(teacher => (
                      <tr key={teacher._id}>
                        <td>{teacher.name || 'N/A'}</td>
                        <td>{teacher.email || 'N/A'}</td>
                        <td>{teacher.staffCode || 'N/A'}</td>
                        <td>{teacher.department || 'N/A'}</td>
                        <td>
                          <button onClick={() => handleDelete(teacher._id)} className="btn btn-sm btn-danger">Delete</button>
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

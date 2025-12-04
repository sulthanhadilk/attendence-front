import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Students(){
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', roll_no: '', class_id: '' });
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
      setStudents(data.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
    setLoading(false);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/students`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ name: '', email: '', roll_no: '', class_id: '' });
        setShowForm(false);
        fetchStudents();
      }
    } catch (err) {
      console.error('Error adding student:', err);
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
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary mb-4">
            {showForm ? 'Cancel' : '+ Add Student'}
          </button>
          
          {showForm && (
            <form onSubmit={handleAddStudent} className="card mb-4">
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
                  placeholder="Roll No"
                  value={formData.roll_no}
                  onChange={(e) => setFormData({...formData, roll_no: e.target.value})}
                  required
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  placeholder="Class ID"
                  value={formData.class_id}
                  onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                  className="form-control mb-2"
                />
                <button type="submit" className="btn btn-success">Create Student</button>
              </div>
            </form>
          )}

          {loading ? (
            <p>Loading students...</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Roll No</th>
                    <th>Class</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan="5">No students found</td></tr>
                  ) : (
                    students.map(student => (
                      <tr key={student._id}>
                        <td>{student.name || 'N/A'}</td>
                        <td>{student.email || 'N/A'}</td>
                        <td>{student.roll_no || 'N/A'}</td>
                        <td>{student.class_id || 'N/A'}</td>
                        <td>
                          <button onClick={() => handleDelete(student._id)} className="btn btn-sm btn-danger">Delete</button>
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

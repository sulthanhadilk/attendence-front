import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Classes(){
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', section: '', year: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/classes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setClasses(data.data || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/admin/classes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      setFormData({ name: '', section: '', year: '' });
      setShowForm(false);
      fetchClasses();
    } catch (err) {
      console.error('Error adding class:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return;
    try {
      await fetch(`${API_BASE}/api/admin/classes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchClasses();
    } catch (err) {
      console.error('Error deleting class:', err);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Classes Management" />
        <div className="p-4">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary mb-4">
            {showForm ? 'Cancel' : '+ Add Class'}
          </button>
          
          {showForm && (
            <form onSubmit={handleAdd} className="card mb-4">
              <div className="card-body">
                <input type="text" placeholder="Class Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="form-control mb-2" />
                <input type="text" placeholder="Section" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="form-control mb-2" />
                <input type="text" placeholder="Year" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="form-control mb-2" />
                <button type="submit" className="btn btn-success">Create Class</button>
              </div>
            </form>
          )}

          {loading ? <p>Loading...</p> : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr><th>Name</th><th>Section</th><th>Year</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {classes.length === 0 ? <tr><td colSpan="4">No classes found</td></tr> : classes.map(c => (
                    <tr key={c._id}><td>{c.name}</td><td>{c.section}</td><td>{c.year}</td><td><button onClick={() => handleDelete(c._id)} className="btn btn-sm btn-danger">Delete</button></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

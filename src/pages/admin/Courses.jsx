import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function Courses(){
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', credits: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    setCourses([...courses, { ...formData, id: Date.now() }]);
    setFormData({ name: '', code: '', credits: '' });
    setShowForm(false);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Courses Management" />
        <div className="p-4">
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
            {showForm ? 'Cancel' : '+ Add Course'}
          </button>
          
          {showForm && (
            <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow mb-4">
              <input type="text" placeholder="Course Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="border p-2 w-full mb-2 rounded" />
              <input type="text" placeholder="Course Code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} required className="border p-2 w-full mb-2 rounded" />
              <input type="number" placeholder="Credits" value={formData.credits} onChange={(e) => setFormData({...formData, credits: e.target.value})} className="border p-2 w-full mb-2 rounded" />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Course</button>
            </form>
          )}

          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Code</th><th className="p-3 text-left">Credits</th><th className="p-3 text-left">Actions</th></tr>
              </thead>
              <tbody>
                {courses.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-gray-500">No courses found</td></tr> : courses.map(c => (
                  <tr key={c.id} className="border-t"><td className="p-3">{c.name}</td><td className="p-3">{c.code}</td><td className="p-3">{c.credits}</td><td className="p-3"><button onClick={() => setCourses(courses.filter(x => x.id !== c.id))} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminProfile(){
  const [profile, setProfile] = useState({name: 'Administrator', email: 'admin@college.edu', phone: '+1-234-567-8900', role: 'Super Admin'});
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Admin Profile" />
        <div className="p-4">
          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center mb-6"><div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">A</div><div className="ml-6"><h2 className="text-2xl font-bold">{profile.name}</h2><p className="text-gray-600">{profile.role}</p></div><button onClick={() => setEditing(!editing)} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded">{editing ? 'Cancel' : 'Edit Profile'}</button></div>

            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-2">Full Name</label><input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} disabled={!editing} className="border p-2 rounded w-full" /></div>
              <div><label className="block text-sm font-medium mb-2">Email</label><input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} disabled={!editing} className="border p-2 rounded w-full" /></div>
              <div><label className="block text-sm font-medium mb-2">Phone</label><input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} disabled={!editing} className="border p-2 rounded w-full" /></div>
              <div><label className="block text-sm font-medium mb-2">Role</label><input type="text" value={profile.role} disabled className="border p-2 rounded w-full bg-gray-100" /></div>
            </div>

            {editing && (<div className="mt-6"><button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded mr-2">Save Changes</button></div>)}
          </div>

          <div className="bg-white rounded shadow p-6 mt-4"><h3 className="font-semibold text-lg mb-4">Change Password</h3><input type="password" placeholder="Current Password" className="border p-2 rounded w-full mb-2" /><input type="password" placeholder="New Password" className="border p-2 rounded w-full mb-2" /><input type="password" placeholder="Confirm New Password" className="border p-2 rounded w-full mb-4" /><button className="bg-blue-600 text-white px-4 py-2 rounded">Update Password</button></div>
        </div>
      </div>
    </div>
  );
}

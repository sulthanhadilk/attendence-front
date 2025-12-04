import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function NoticesAdmin(){
  const [notices, setNotices] = useState([{id: 1, title: 'Holiday Announcement', content: 'School will be closed on December 25th', date: '2025-12-04', priority: 'High'},{id: 2, title: 'Parent-Teacher Meeting', content: 'Scheduled for next Friday', date: '2025-12-03', priority: 'Medium'}]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Notices Management" />
        <div className="p-4">
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">{showForm ? 'Cancel' : '+ Post Notice'}</button>

          {showForm && (<div className="bg-white p-4 rounded shadow mb-4"><h3 className="font-semibold mb-3">Create New Notice</h3><input type="text" placeholder="Title" className="border p-2 rounded w-full mb-2" /><textarea placeholder="Content" className="border p-2 rounded w-full mb-2" rows="4"></textarea><select className="border p-2 rounded w-full mb-2"><option>Low Priority</option><option>Medium Priority</option><option>High Priority</option></select><button className="bg-green-600 text-white px-4 py-2 rounded">Post Notice</button></div>)}

          <div className="space-y-4">{notices.map(notice => (<div key={notice.id} className="bg-white p-4 rounded shadow"><div className="flex justify-between items-start mb-2"><h3 className="font-semibold text-lg">{notice.title}</h3><span className={`px-2 py-1 rounded text-xs ${notice.priority === 'High' ? 'bg-red-100 text-red-800' : notice.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{notice.priority}</span></div><p className="text-gray-700 mb-2">{notice.content}</p><div className="text-sm text-gray-500">{notice.date}</div></div>))}</div>
        </div>
      </div>
    </div>
  );
}

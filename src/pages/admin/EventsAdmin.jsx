import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function EventsAdmin(){
  const [events, setEvents] = useState([{id: 1, name: 'Annual Sports Day', date: '2025-12-15', location: 'Main Ground', attendees: 500},{id: 2, name: 'Science Fair', date: '2025-12-20', location: 'Exhibition Hall', attendees: 300}]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Events Management" />
        <div className="p-4">
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">{showForm ? 'Cancel' : '+ Create Event'}</button>

          {showForm && (<div className="bg-white p-4 rounded shadow mb-4"><h3 className="font-semibold mb-3">Create New Event</h3><input type="text" placeholder="Event Name" className="border p-2 rounded w-full mb-2" /><input type="date" className="border p-2 rounded w-full mb-2" /><input type="text" placeholder="Location" className="border p-2 rounded w-full mb-2" /><textarea placeholder="Description" className="border p-2 rounded w-full mb-2" rows="3"></textarea><button className="bg-green-600 text-white px-4 py-2 rounded">Create Event</button></div>)}

          <div className="grid grid-cols-2 gap-4">{events.map(event => (<div key={event.id} className="bg-white p-4 rounded shadow"><h3 className="font-semibold text-lg mb-2">{event.name}</h3><div className="text-sm text-gray-600 space-y-1"><div>📅 {event.date}</div><div>📍 {event.location}</div><div>👥 {event.attendees} expected attendees</div></div><button className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm">View Details</button></div>))}</div>
        </div>
      </div>
    </div>
  );
}

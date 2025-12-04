import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function PrayerAdmin(){
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData] = useState([0, 0, 0, 0, 0]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Prayer Attendance" />
        <div className="p-4">
          <div className="bg-white p-4 rounded shadow mb-4">
            <div className="flex gap-4">
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded">View Report</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded">Export</button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {prayers.map((prayer, index) => (
              <div key={prayer} className="bg-white p-4 rounded shadow text-center">
                <div className="text-2xl font-bold text-blue-600">{attendanceData[index]}%</div>
                <div className="text-sm text-gray-600 mt-2">{prayer}</div>
                <div className="text-xs text-gray-400 mt-1">0/0</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

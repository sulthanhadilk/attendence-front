import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AttendanceAdmin(){
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Attendance Management" />
        <div className="p-4">
          <div className="bg-white p-4 rounded shadow mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Class</label>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="border p-2 rounded w-full">
                  <option value="all">All Classes</option>
                  <option value="class1">Class 1</option>
                  <option value="class2">Class 2</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Generate Report</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">Overall Attendance</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-3xl font-bold text-blue-600">450</div>
              <div className="text-sm text-gray-600">Present Today</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-3xl font-bold text-red-600">25</div>
              <div className="text-sm text-gray-600">Absent Today</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-3xl font-bold text-yellow-600">10</div>
              <div className="text-sm text-gray-600">Late Today</div>
            </div>
          </div>

          <div className="bg-white rounded shadow">
            <div className="p-4 border-b font-semibold">Recent Attendance Records</div>
            <div className="p-4 text-center text-gray-500">Select date and class to view records</div>
          </div>
        </div>
      </div>
    </div>
  );
}

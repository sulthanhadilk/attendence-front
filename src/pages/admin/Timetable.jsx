import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function Timetable(){
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '1:00-2:00', '2:00-3:00'];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Timetable Management" />
        <div className="p-4">
          <div className="mb-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2">+ Create Timetable</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Import from Excel</button>
          </div>
          
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Day/Time</th>
                  {periods.map(p => <th key={p} className="p-3 border">{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day}>
                    <td className="p-3 border font-semibold bg-gray-50">{day}</td>
                    {periods.map(p => <td key={p} className="p-3 border text-center text-gray-400 hover:bg-blue-50 cursor-pointer">-</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

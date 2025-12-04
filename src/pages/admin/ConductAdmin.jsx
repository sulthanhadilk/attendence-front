import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function ConductAdmin(){
  const [records, setRecords] = useState([{id: 1, student: 'John Doe', type: 'Warning', reason: 'Late arrival', date: '2025-12-01', severity: 'Low'},{id: 2, student: 'Jane Smith', type: 'Commendation', reason: 'Excellent behavior', date: '2025-12-02', severity: 'Positive'}]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Student Conduct" />
        <div className="p-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">+ Record Conduct</button>

          <div className="bg-white rounded shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-100"><tr><th className="p-3 text-left">Student</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Reason</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Severity</th></tr></thead><tbody>{records.map(r => (<tr key={r.id} className="border-t"><td className="p-3">{r.student}</td><td className="p-3">{r.type}</td><td className="p-3">{r.reason}</td><td className="p-3">{r.date}</td><td className="p-3"><span className={`px-2 py-1 rounded text-sm ${r.severity === 'Positive' ? 'bg-green-100 text-green-800' : r.severity === 'Low' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{r.severity}</span></td></tr>))}</tbody></table></div>
        </div>
      </div>
    </div>
  );
}

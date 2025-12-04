import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function FinesAdmin(){
  const [fines, setFines] = useState([
    { id: 1, student: 'John Doe', reason: 'Late arrival', amount: 50, date: '2025-12-01', status: 'Pending' },
    { id: 2, student: 'Jane Smith', reason: 'Uniform violation', amount: 30, date: '2025-12-02', status: 'Paid' }
  ]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Fines Management" />
        <div className="p-4">
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
            {showForm ? 'Cancel' : '+ Issue Fine'}
          </button>

          {showForm && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-semibold mb-3">Issue New Fine</h3>
              <input type="text" placeholder="Student Name" className="border p-2 rounded w-full mb-2" />
              <input type="text" placeholder="Reason" className="border p-2 rounded w-full mb-2" />
              <input type="number" placeholder="Amount" className="border p-2 rounded w-full mb-2" />
              <button className="bg-green-600 text-white px-4 py-2 rounded">Issue Fine</button>
            </div>
          )}

          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fines.map(fine => (
                  <tr key={fine.id} className="border-t">
                    <td className="p-3">{fine.student}</td>
                    <td className="p-3">{fine.reason}</td>
                    <td className="p-3">${fine.amount}</td>
                    <td className="p-3">{fine.date}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded text-sm ${fine.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{fine.status}</span></td>
                    <td className="p-3"><button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Mark Paid</button></td>
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

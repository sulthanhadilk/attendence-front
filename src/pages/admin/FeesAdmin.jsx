import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function FeesAdmin(){
  const [feeRecords, setFeeRecords] = useState([
    { id: 1, student: 'John Doe', term: 'Fall 2025', amount: 5000, paid: 3000, due: 2000, status: 'Partial' },
    { id: 2, student: 'Jane Smith', term: 'Fall 2025', amount: 5000, paid: 5000, due: 0, status: 'Paid' }
  ]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Fees Management" />
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded shadow"><div className="text-2xl font-bold text-green-600">$250,000</div><div className="text-sm text-gray-600">Total Collected</div></div>
            <div className="bg-white p-4 rounded shadow"><div className="text-2xl font-bold text-red-600">$50,000</div><div className="text-sm text-gray-600">Total Due</div></div>
            <div className="bg-white p-4 rounded shadow"><div className="text-2xl font-bold text-blue-600">83%</div><div className="text-sm text-gray-600">Collection Rate</div></div>
            <div className="bg-white p-4 rounded shadow"><div className="text-2xl font-bold text-yellow-600">45</div><div className="text-sm text-gray-600">Defaulters</div></div>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <div className="p-4 border-b"><button className="bg-blue-600 text-white px-4 py-2 rounded">+ Record Payment</button></div>
            <table className="w-full">
              <thead className="bg-gray-100"><tr><th className="p-3 text-left">Student</th><th className="p-3 text-left">Term</th><th className="p-3 text-left">Total</th><th className="p-3 text-left">Paid</th><th className="p-3 text-left">Due</th><th className="p-3 text-left">Status</th></tr></thead>
              <tbody>{feeRecords.map(fee => (<tr key={fee.id} className="border-t"><td className="p-3">{fee.student}</td><td className="p-3">{fee.term}</td><td className="p-3">${fee.amount}</td><td className="p-3">${fee.paid}</td><td className="p-3">${fee.due}</td><td className="p-3"><span className={`px-2 py-1 rounded text-sm ${fee.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{fee.status}</span></td></tr>))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

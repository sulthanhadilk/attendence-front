import React from 'react';
export default function FineCard({ fine, onUpdate }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    waived: 'bg-blue-100 text-blue-700'
  };
  const contextLabels = {
    attendance: 'Attendance',
    discipline: 'Discipline',
    other: 'Other'
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:border-indigo-200 transition">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-800">{fine.student_id?.user_id?.name || 'Student'}</p>
          <p className="text-sm text-gray-500">{fine.student_id?.roll_number || ''}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[fine.status]}`}>
          {fine.status}
        </span>
      </div>
      <p className="text-gray-700 mb-2">{fine.reason}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="font-bold text-indigo-600">₹{fine.amount}</span>
        <span>{contextLabels[fine.context] || fine.context}</span>
      </div>
      {fine.due_date && (
        <p className="text-xs text-gray-500 mt-1">Due: {new Date(fine.due_date).toLocaleDateString()}</p>
      )}
      {fine.paymentNote && (
        <p className="text-xs text-gray-600 mt-2 italic">Note: {fine.paymentNote}</p>
      )}
      {onUpdate && fine.status === 'pending' && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onUpdate(fine._id, 'paid')}
            className="flex-1 bg-green-600 text-white py-1 px-3 rounded-lg text-sm hover:bg-green-700 transition"
          >
            Mark Paid
          </button>
          <button
            onClick={() => onUpdate(fine._id, 'waived')}
            className="flex-1 bg-blue-600 text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Waive
          </button>
        </div>
      )}
    </div>
  );
}

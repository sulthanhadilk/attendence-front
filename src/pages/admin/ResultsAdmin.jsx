import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function ResultsAdmin(){
  const [selectedExam, setSelectedExam] = useState('midterm');
  const [selectedClass, setSelectedClass] = useState('all');

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Results Management" />
        <div className="p-4">
          <div className="bg-white p-4 rounded shadow mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium mb-2">Exam</label><select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="border p-2 rounded w-full"><option value="midterm">Mid Term</option><option value="final">Final Exam</option><option value="quiz">Quiz</option></select></div>
              <div><label className="block text-sm font-medium mb-2">Class</label><select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="border p-2 rounded w-full"><option value="all">All Classes</option><option value="class1">Class 1</option></select></div>
              <div className="flex items-end"><button className="bg-blue-600 text-white px-4 py-2 rounded w-full">View Results</button></div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded shadow"><div className="text-2xl font-bold text-green-600">78%</div><div className="text-sm text-gray-600">Average Score</div></div>
            <div className="bg-white p-4 rounded shadow"><div className="text-2xl font-bold text-blue-600">92%</div><div className="text-sm text-gray-600">Highest Score</div></div>
            <div className="bg-white p-4 rounded shadow"><div className="text-2xl font-bold text-yellow-600">45%</div><div className="text-sm text-gray-600">Lowest Score</div></div>
            <div className="bg-white p-4 rounded shadow"><div className="text-2xl font-bold text-purple-600">85%</div><div className="text-sm text-gray-600">Pass Rate</div></div>
          </div>

          <div className="bg-white rounded shadow"><div className="p-4 border-b font-semibold">Results by Class</div><div className="p-4 text-center text-gray-500">Select exam and class to view detailed results</div></div>
        </div>
      </div>
    </div>
  );
}

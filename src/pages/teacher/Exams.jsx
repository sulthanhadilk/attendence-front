import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';
export default function Exams() {
  const [tab, setTab] = useState('internal'); // 'internal' or 'external'
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    loadClasses();
    loadExams();
  }, []);
  useEffect(() => {
    if (selectedClass) {
      loadStudents(selectedClass);
    }
  }, [selectedClass]);
  const loadClasses = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes`);
      setClasses(data);
    } catch (err) {
      setMessage(err.message);
    }
  };
  const loadExams = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/exams`);
      setExams(data);
    } catch (err) {
      setMessage(err.message);
    }
  };
  const loadStudents = async (classId) => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/classes/${classId}/students`);
      setStudents(data);
      // Initialize marks state
      const initialMarks = {};
      data.forEach(s => {
        initialMarks[s._id] = { marksObtained: '', maxMarks: '' };
      });
      setMarks(initialMarks);
    } catch (err) {
      setMessage(err.message);
    }
  };
  const handleMarksChange = (studentId, field, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExam) {
      setMessage('Please select an exam');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const results = students.map(s => ({
        studentId: s._id,
        examId: selectedExam,
        courseId: null, // Can be enhanced to include course
        marksObtained: Number(marks[s._id]?.marksObtained || 0),
        maxMarks: Number(marks[s._id]?.maxMarks || 100),
        type: tab
      })).filter(r => r.marksObtained > 0);
      await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/exams/results`, {
        method: 'POST',
        body: JSON.stringify(results)
      });
      setMessage(`Successfully saved ${results.length} ${tab} marks`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Exam Marks Entry</h1>
          <p className="text-gray-600">Enter and manage internal and external exam marks</p>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('internal')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === 'internal'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            Internal Marks
          </button>
          <button
            onClick={() => setTab('external')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === 'external'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            External Marks
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select class</option>
                  {classes.map(c => (
                    <option key={c._id} value={c._id}>{c.name || c.section}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
                <select
                  value={selectedExam}
                  onChange={e => setSelectedExam(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select exam</option>
                  {exams.map(exam => (
                    <option key={exam._id} value={exam._id}>
                      {exam.name} - {new Date(exam.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {students.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="p-3 text-left">Roll No</th>
                        <th className="p-3 text-left">Student Name</th>
                        <th className="p-3 text-center">Marks Obtained</th>
                        <th className="p-3 text-center">Max Marks</th>
                        <th className="p-3 text-center">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const obtained = Number(marks[s._id]?.marksObtained || 0);
                        const max = Number(marks[s._id]?.maxMarks || 100);
                        const percentage = max > 0 ? ((obtained / max) * 100).toFixed(1) : 0;
                        return (
                          <tr key={s._id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-gray-600">{s.user_id?.roll_no || 'N/A'}</td>
                            <td className="p-3 font-medium">{s.user_id?.name || 'Student'}</td>
                            <td className="p-3">
                              <input
                                type="number"
                                value={marks[s._id]?.marksObtained || ''}
                                onChange={e => handleMarksChange(s._id, 'marksObtained', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-center"
                                min="0"
                                placeholder="0"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                value={marks[s._id]?.maxMarks || ''}
                                onChange={e => handleMarksChange(s._id, 'maxMarks', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-center"
                                min="1"
                                placeholder="100"
                              />
                            </td>
                            <td className="p-3 text-center">
                              <span className={`font-semibold ${
                                percentage >= 60 ? 'text-green-600' :
                                percentage >= 40 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {percentage}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {message && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    message.includes('Success')
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : `Save ${tab === 'internal' ? 'Internal' : 'External'} Marks`}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

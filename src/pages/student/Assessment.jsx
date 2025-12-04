import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Assessment = () => {
  const [view, setView] = useState('all'); // all, internal, external
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchResults();
  }, [view]);
  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let endpoint = '/api/student/assessment/results';
      if (view === 'internal') endpoint = '/api/student/assessment/internal';
      if (view === 'external') endpoint = '/api/student/assessment/external';
      const [resultsRes, summaryRes] = await Promise.all([
        axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/student/assessment/summary', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setResults(resultsRes.data.results || []);
      setSummary(summaryRes.data.summary);
    } catch (error) {
      console.error('Assessment error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  const getGradeColor = (grade) => {
    const colors = {
      'A': 'bg-green-100 text-green-700',
      'B': 'bg-blue-100 text-blue-700',
      'C': 'bg-yellow-100 text-yellow-700',
      'D': 'bg-orange-100 text-orange-700',
      'F': 'bg-red-100 text-red-700'
    };
    return colors[grade] || 'bg-gray-100 text-gray-700';
  };
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate('/student/dashboard')} className="mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Assessment Results</h1>
        <p className="text-white/80 text-sm mt-1">View your academic performance</p>
      </div>
      {summary && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Overall Average</div>
              <div className="text-3xl font-bold text-purple-600">{summary.overall.average}%</div>
              <div className="text-xs text-gray-500 mt-1">{summary.overall.total} exams</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="text-sm text-gray-600 mb-1">Pass Rate</div>
              <div className="text-3xl font-bold text-green-600">
                {summary.overall.total > 0 
                  ? Math.round((summary.overall.passed / summary.overall.total) * 100) 
                  : 0}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {summary.overall.passed}/{summary.overall.total}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3">Performance by Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">School</div>
                <div className="text-2xl font-bold text-blue-600">{summary.school.average}%</div>
                <div className="text-xs text-gray-500">{summary.school.total} exams</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Islamic</div>
                <div className="text-2xl font-bold text-green-600">{summary.islamic.average}%</div>
                <div className="text-xs text-gray-500">{summary.islamic.total} exams</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl shadow-sm p-2 flex space-x-2">
          <button
            onClick={() => setView('all')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
              view === 'all' ? 'bg-purple-600 text-white' : 'text-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setView('internal')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
              view === 'internal' ? 'bg-purple-600 text-white' : 'text-gray-600'
            }`}
          >
            Internal
          </button>
          <button
            onClick={() => setView('external')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
              view === 'external' ? 'bg-purple-600 text-white' : 'text-gray-600'
            }`}
          >
            External
          </button>
        </div>
      </div>
      <div className="px-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
            No results published yet
          </div>
        ) : (
          results.map((result, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{result.courseId?.name || result.examName}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {result.examName} • {result.examType} • {result.internalOrExternal}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(result.grade)}`}>
                  {result.grade}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Marks</div>
                  <div className="font-bold text-gray-800">
                    {result.marksObtained}/{result.maxMarks}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Percentage</div>
                  <div className="font-bold text-purple-600">{result.percentage}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Grade</div>
                  <div className="font-bold text-gray-800">{result.grade}</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      result.percentage >= 90 ? 'bg-green-500' :
                      result.percentage >= 75 ? 'bg-blue-500' :
                      result.percentage >= 60 ? 'bg-yellow-500' :
                      result.percentage >= 45 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                {result.enteredByTeacherId?.user_id?.name && (
                  <span>By: {result.enteredByTeacherId.user_id.name}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-4 py-4">
        <button
          onClick={() => navigate('/student/ai-insights')}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-bold">AI Study Advice</div>
              <div className="text-xs text-white/80">Get personalized suggestions</div>
            </div>
          </div>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
export default Assessment;

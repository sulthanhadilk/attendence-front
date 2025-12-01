import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../utils/api';

export default function QuestionBank() {
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    difficulty: 'medium',
    questions: [{ questionText: '', answerKey: '', marks: 1 }]
  });
  const [questionBanks, setQuestionBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadQuestionBanks();
  }, []);

  const loadQuestionBanks = async () => {
    try {
      const data = await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/question-bank`);
      setQuestionBanks(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: '', answerKey: '', marks: 1 }]
    });
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, questions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await apiRequest(`${API_ENDPOINTS.TEACHER_DASHBOARD}/question-bank`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setMessage('Question bank created successfully');
      setFormData({
        courseId: '',
        title: '',
        difficulty: 'medium',
        questions: [{ questionText: '', answerKey: '', marks: 1 }]
      });
      loadQuestionBanks();
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
          <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-600">Create and manage question banks for your subjects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Question Bank */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Create Question Bank</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject/Course ID</label>
                  <input
                    type="text"
                    value={formData.courseId}
                    onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Enter course ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g., Chapter 5 - Algebra"
                  required
                />
              </div>

              {/* Questions */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Questions</label>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs hover:bg-indigo-200"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.questions.map((q, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Q{index + 1}</span>
                        {formData.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 text-xs hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <textarea
                        value={q.questionText}
                        onChange={e => updateQuestion(index, 'questionText', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2"
                        rows="2"
                        placeholder="Enter question text..."
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={q.answerKey}
                          onChange={e => updateQuestion(index, 'answerKey', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Answer key (optional)"
                        />
                        <input
                          type="number"
                          value={q.marks}
                          onChange={e => updateQuestion(index, 'marks', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Marks"
                          min="1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('success')
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Question Bank'}
              </button>
            </form>
          </div>

          {/* Question Banks List */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">My Question Banks</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {questionBanks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No question banks yet</div>
              ) : (
                questionBanks.map(qb => (
                  <div key={qb._id} className="border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{qb.title}</h3>
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>{qb.questions?.length || 0} questions</span>
                      <span className={`px-2 py-1 rounded-full ${
                        qb.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        qb.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {qb.difficulty}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Library = () => {
  const [books, setBooks] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('books'); // books, myIssues, history
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (activeTab === 'books') {
      fetchBooks();
    } else if (activeTab === 'myIssues') {
      fetchMyIssues();
    }
  }, [activeTab, searchQuery, category]);
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (category !== 'all') params.append('category', category);
      const { data } = await axios.get(`/api/student/library/books?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(data.books || []);
    } catch (error) {
      console.error('Books error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchMyIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/student/library/my-issues', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyIssues(data.issues || []);
      setStats(data.stats);
    } catch (error) {
      console.error('Issues error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  const categories = ['all', 'Islamic Studies', 'Science', 'Mathematics', 'Language', 'History', 'Literature', 'Reference'];
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate('/student/dashboard')} className="mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Library</h1>
        <p className="text-white/80 text-sm mt-1">Browse and manage books</p>
      </div>
      <div className="p-4 space-y-4">
        {activeTab === 'myIssues' && stats && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl shadow-sm p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.active || 0}</p>
              <p className="text-xs text-gray-600 mt-1">Active</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.overdue || 0}</p>
              <p className="text-xs text-gray-600 mt-1">Overdue</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.returned || 0}</p>
              <p className="text-xs text-gray-600 mt-1">Returned</p>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm p-2 flex">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              activeTab === 'books' ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
          >
            Browse Books
          </button>
          <button
            onClick={() => setActiveTab('myIssues')}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              activeTab === 'myIssues' ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
          >
            My Issues
          </button>
        </div>
        {activeTab === 'books' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl shadow-sm p-3 flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    category === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 shadow-sm'
                  }`}
                >
                  {cat === 'all' ? 'All Books' : cat}
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'books' && (
          <div className="space-y-3">
            {books.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-500">No books found</p>
              </div>
            ) : (
              books.map((book) => (
                <div key={book._id} className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition">
                  <div className="flex">
                    <div className="w-16 h-20 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{book.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {book.category && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {book.category}
                          </span>
                        )}
                        {book.isbn && (
                          <span className="text-xs text-gray-500">ISBN: {book.isbn}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs">
                          <span className="text-gray-600">Available: </span>
                          <span className={`font-bold ${book.available_copies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {book.available_copies || 0} / {book.total_copies || 0}
                          </span>
                        </div>
                        {book.available_copies > 0 && (
                          <button className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-medium">
                            Request
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'myIssues' && (
          <div className="space-y-3">
            {myIssues.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No issued books</p>
              </div>
            ) : (
              myIssues.map((issue) => {
                const isOverdue = issue.status === 'overdue' || (issue.dueDate && new Date(issue.dueDate) < new Date() && issue.status === 'issued');
                const statusColor = 
                  issue.status === 'returned' ? 'bg-green-100 text-green-700' :
                  isOverdue ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700';
                return (
                  <div key={issue._id} className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{issue.bookId?.title || 'Unknown Book'}</h3>
                        <p className="text-sm text-gray-600 mt-1">{issue.bookId?.author}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {isOverdue ? 'Overdue' : issue.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issue Date:</span>
                        <span className="font-medium">{new Date(issue.issueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                          {new Date(issue.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {issue.returnDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Return Date:</span>
                          <span className="font-medium">{new Date(issue.returnDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {issue.fine > 0 && (
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-red-600 font-medium">Fine:</span>
                          <span className="text-red-600 font-bold">₹{issue.fine}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Library;

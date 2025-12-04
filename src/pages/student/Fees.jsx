import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Fees = () => {
  const [tab, setTab] = useState('due'); // due, payments, fines
  const [dueData, setDueData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, [tab]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (tab === 'due') {
        const { data } = await axios.get('/api/student/fees/due', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDueData(data);
      } else if (tab === 'payments') {
        const { data } = await axios.get('/api/student/fees/payments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(data.payments || []);
      } else if (tab === 'fines') {
        const { data } = await axios.get('/api/student/fines', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFines(data.fines || []);
      }
    } catch (error) {
      console.error('Fees error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-green-600 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate('/student/dashboard')} className="mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Fees & Fines</h1>
        <p className="text-white/80 text-sm mt-1">Manage your finances</p>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm p-2 flex space-x-2">
          <button
            onClick={() => setTab('due')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
              tab === 'due' ? 'bg-green-600 text-white' : 'text-gray-600'
            }`}
          >
            Due
          </button>
          <button
            onClick={() => setTab('payments')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
              tab === 'payments' ? 'bg-green-600 text-white' : 'text-gray-600'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setTab('fines')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition ${
              tab === 'fines' ? 'bg-green-600 text-white' : 'text-gray-600'
            }`}
          >
            Fines
          </button>
        </div>
      </div>
      <div className="px-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {tab === 'due' && dueData && (
              <>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg p-6">
                  <div className="text-sm opacity-90 mb-2">Total Fees</div>
                  <div className="text-3xl font-bold mb-4">₹{dueData.totalFees?.toLocaleString()}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs opacity-80">Paid</div>
                      <div className="text-lg font-bold">₹{dueData.totalPaid?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-80">Due</div>
                      <div className="text-lg font-bold">₹{dueData.due?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800">Fee Details</h3>
                  {dueData.structures?.map((structure, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800">{structure.title}</h4>
                          <p className="text-xs text-gray-500">
                            Semester {structure.semester} • {structure.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">₹{structure.total?.toLocaleString()}</div>
                        </div>
                      </div>
                      {structure.items && structure.items.length > 0 && (
                        <div className="space-y-1 pt-3 border-t">
                          {structure.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.label}</span>
                              <span className="font-medium">₹{item.amount?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            {tab === 'payments' && (
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800">Payment History</h3>
                {payments.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
                    No payment records found
                  </div>
                ) : (
                  payments.map((payment, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-800">₹{payment.amount?.toLocaleString()}</h4>
                          <p className="text-xs text-gray-500">{payment.structureId?.title || 'General Payment'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                        <span>{new Date(payment.date).toLocaleDateString()}</span>
                        <span className="uppercase font-medium">{payment.mode}</span>
                        {payment.receiptNo && <span>Receipt: {payment.receiptNo}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {tab === 'fines' && (
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800">Fines</h3>
                {fines.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <div className="text-5xl mb-3">🎉</div>
                    <div className="text-gray-500">No fines! Keep it up!</div>
                  </div>
                ) : (
                  <>
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-red-700 font-medium">Total Unpaid</div>
                          <div className="text-2xl font-bold text-red-600">
                            ₹{fines.filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0)}
                          </div>
                        </div>
                        <div className="text-4xl">⚠️</div>
                      </div>
                    </div>
                    {fines.map((fine, index) => (
                      <div key={index} className="bg-white rounded-2xl shadow-sm p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-bold text-gray-800 mb-1">₹{fine.amount}</div>
                            <p className="text-sm text-gray-600">{fine.reason}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              By: {fine.teacher_id?.user_id?.name || 'Unknown'}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            fine.status === 'paid' 
                              ? 'bg-green-100 text-green-700' 
                              : fine.status === 'waived'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {fine.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 pt-2 border-t">
                          {new Date(fine.createdAt).toLocaleDateString()} • {fine.context}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Fees;

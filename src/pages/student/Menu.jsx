import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Menu = () => {
  const [profile] = useState({
    name: localStorage.getItem('userName') || 'Student',
    rollNo: localStorage.getItem('rollNo') || 'N/A'
  });
  const navigate = useNavigate();
  const menuSections = [
    {
      title: 'Academic',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      items: [
        { name: 'Dashboard', path: '/student/dashboard', icon: '🏠' },
        { name: 'Attendance', path: '/student/attendance', icon: '📊' },
        { name: 'Assessment Results', path: '/student/assessment', icon: '📝' },
        { name: 'Departments', path: '/student/departments', icon: '🏛️' },
      ]
    },
    {
      title: 'Financial',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      items: [
        { name: 'Fees & Payments', path: '/student/fees', icon: '💰' },
        { name: 'Payment History', path: '/student/fees?tab=payments', icon: '🧾' },
        { name: 'Fines', path: '/student/fees?tab=fines', icon: '⚠️' },
      ]
    },
    {
      title: 'Personal',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      items: [
        { name: 'Profile', path: '/student/profile', icon: '👤' },
        { name: 'Personal Details', path: '/student/personal-details', icon: 'ℹ️' },
        { name: 'Guardian Details', path: '/student/guardian-details', icon: '👨‍👩‍👦' },
        { name: 'Virtual ID Card', path: '/student/idcard', icon: '🪪' },
      ]
    },
    {
      title: 'Resources',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      items: [
        { name: 'Library', path: '/student/library', icon: '📚' },
      ]
    },
    {
      title: 'Settings',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      items: [
        { name: 'My Account', path: '/student/account', icon: '⚙️' },
      ]
    }
  ];
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('rollNo');
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate('/student/dashboard')} className="mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur">
            <span className="text-2xl font-bold">{profile.name?.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <p className="text-white/80 text-sm">{profile.rollNo}</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {menuSections.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center text-sm uppercase tracking-wide">
              <span className="text-indigo-600 mr-2">{section.icon}</span>
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <span className="font-medium text-gray-700 group-hover:text-indigo-600">
                      {item.name}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg p-5 text-white">
          <h3 className="font-bold mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Access
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/student/attendance')}
              className="bg-white/20 backdrop-blur rounded-xl p-3 text-center hover:bg-white/30 transition"
            >
              <p className="text-2xl mb-1">📊</p>
              <p className="text-xs font-medium">Attendance</p>
            </button>
            <button
              onClick={() => navigate('/student/fees')}
              className="bg-white/20 backdrop-blur rounded-xl p-3 text-center hover:bg-white/30 transition"
            >
              <p className="text-2xl mb-1">💰</p>
              <p className="text-xs font-medium">Fees</p>
            </button>
            <button
              onClick={() => navigate('/student/assessment')}
              className="bg-white/20 backdrop-blur rounded-xl p-3 text-center hover:bg-white/30 transition"
            >
              <p className="text-2xl mb-1">📝</p>
              <p className="text-xs font-medium">Results</p>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">App Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium text-gray-800">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Build:</span>
              <span className="font-medium text-gray-800">2024.01</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Developer:</span>
              <span className="font-medium text-gray-800">Islamic College</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Support & Help</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-gray-700">Help & FAQ</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-gray-700">Contact Us</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium text-gray-700">Privacy Policy</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-4 rounded-2xl font-medium shadow-lg hover:bg-red-700 transition flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};
export default Menu;

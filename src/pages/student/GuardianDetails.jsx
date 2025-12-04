import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const GuardianDetails = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(data.student);
    } catch (error) {
      console.error('Profile error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (!profile) return null;
  const guardianInfo = profile.guardian_info || {};
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate('/student/dashboard')} className="mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Guardian Details</h1>
        <p className="text-white/80 text-sm mt-1">Parent/Guardian information</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-5 text-white">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-lg">{profile.name}</h2>
              <p className="text-white/80 text-sm">{profile.rollNo}</p>
              <p className="text-white/70 text-xs">{profile.classId?.name}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Father's Information
          </h3>
          {guardianInfo.father_name ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-800">{guardianInfo.father_name}</span>
              </div>
              {guardianInfo.father_phone && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-800">{guardianInfo.father_phone}</span>
                </div>
              )}
              {guardianInfo.father_email && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-800 break-all">{guardianInfo.father_email}</span>
                </div>
              )}
              {guardianInfo.father_occupation && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Occupation:</span>
                  <span className="font-medium text-gray-800">{guardianInfo.father_occupation}</span>
                </div>
              )}
              {guardianInfo.father_income && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Annual Income:</span>
                  <span className="font-medium text-gray-800">₹{guardianInfo.father_income.toLocaleString()}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No father information available</p>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mother's Information
          </h3>
          {guardianInfo.mother_name ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-800">{guardianInfo.mother_name}</span>
              </div>
              {guardianInfo.mother_phone && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-800">{guardianInfo.mother_phone}</span>
                </div>
              )}
              {guardianInfo.mother_email && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-800 break-all">{guardianInfo.mother_email}</span>
                </div>
              )}
              {guardianInfo.mother_occupation && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Occupation:</span>
                  <span className="font-medium text-gray-800">{guardianInfo.mother_occupation}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No mother information available</p>
          )}
        </div>
        {guardianInfo.local_guardian_name && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Local Guardian
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-800">{guardianInfo.local_guardian_name}</span>
              </div>
              {guardianInfo.local_guardian_phone && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-800">{guardianInfo.local_guardian_phone}</span>
                </div>
              )}
              {guardianInfo.local_guardian_relation && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Relation:</span>
                  <span className="font-medium text-gray-800">{guardianInfo.local_guardian_relation}</span>
                </div>
              )}
              {guardianInfo.local_guardian_address && (
                <div className="py-2">
                  <span className="text-gray-600 block mb-1">Address:</span>
                  <p className="font-medium text-gray-800">{guardianInfo.local_guardian_address}</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <h3 className="font-bold text-red-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Emergency Contact
          </h3>
          <p className="text-sm text-red-800 mb-3">In case of emergency, please contact:</p>
          <div className="space-y-2 text-sm">
            {guardianInfo.father_phone && (
              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <span className="text-gray-700">Father</span>
                <a href={`tel:${guardianInfo.father_phone}`} className="font-bold text-red-700 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {guardianInfo.father_phone}
                </a>
              </div>
            )}
            {guardianInfo.mother_phone && (
              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <span className="text-gray-700">Mother</span>
                <a href={`tel:${guardianInfo.mother_phone}`} className="font-bold text-red-700 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {guardianInfo.mother_phone}
                </a>
              </div>
            )}
            {guardianInfo.local_guardian_phone && (
              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <span className="text-gray-700">Local Guardian</span>
                <a href={`tel:${guardianInfo.local_guardian_phone}`} className="font-bold text-red-700 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {guardianInfo.local_guardian_phone}
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/student/personal-details')}
            className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Personal Info</span>
          </button>
          <button
            onClick={() => navigate('/student/profile')}
            className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default GuardianDetails;

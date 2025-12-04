import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PersonalDetails = () => {
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

  const academicInfo = profile.academic_info || {};
  const medicalInfo = profile.medical_info || {};

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate('/student/dashboard')} className="mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Personal Details</h1>
        <p className="text-white/80 text-sm mt-1">Your personal information</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Photo and Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-white">{profile.name?.charAt(0)}</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
          <p className="text-gray-600 mt-1">{profile.rollNo}</p>
          {profile.admissionNo && (
            <p className="text-sm text-gray-500 mt-1">Admission No: {profile.admissionNo}</p>
          )}
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          <div className="space-y-3 text-sm">
            {profile.email && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-800">{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-800">{profile.phone}</span>
              </div>
            )}
            {profile.dateOfBirth && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium text-gray-800">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
            {profile.gender && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium text-gray-800 capitalize">{profile.gender}</span>
              </div>
            )}
            {profile.bloodGroup && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Blood Group:</span>
                <span className="font-medium text-red-600">{profile.bloodGroup}</span>
              </div>
            )}
            {profile.address && (
              <div className="py-2">
                <span className="text-gray-600 block mb-1">Address:</span>
                <p className="font-medium text-gray-800">{profile.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            Academic Details
          </h3>
          <div className="space-y-3 text-sm">
            {profile.classId?.name && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Class:</span>
                <span className="font-medium text-gray-800">{profile.classId.name}</span>
              </div>
            )}
            {profile.departmentId?.name && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium text-gray-800">{profile.departmentId.name}</span>
              </div>
            )}
            {profile.batch && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Batch:</span>
                <span className="font-medium text-gray-800">{profile.batch}</span>
              </div>
            )}
            {profile.semester && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Semester:</span>
                <span className="font-medium text-gray-800">{profile.semester}</span>
              </div>
            )}
            {academicInfo.admission_date && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Admission Date:</span>
                <span className="font-medium text-gray-800">{new Date(academicInfo.admission_date).toLocaleDateString()}</span>
              </div>
            )}
            {academicInfo.previous_school && (
              <div className="py-2 border-b">
                <span className="text-gray-600 block mb-1">Previous School:</span>
                <p className="font-medium text-gray-800">{academicInfo.previous_school}</p>
              </div>
            )}
            {academicInfo.previous_percentage && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Previous Percentage:</span>
                <span className="font-medium text-gray-800">{academicInfo.previous_percentage}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Medical Information
          </h3>
          {medicalInfo.allergies || medicalInfo.medical_conditions || medicalInfo.emergency_contact ? (
            <div className="space-y-3 text-sm">
              {medicalInfo.allergies && (
                <div className="py-2 border-b">
                  <span className="text-gray-600 block mb-1">Allergies:</span>
                  <p className="font-medium text-red-600">{medicalInfo.allergies}</p>
                </div>
              )}
              {medicalInfo.medical_conditions && (
                <div className="py-2 border-b">
                  <span className="text-gray-600 block mb-1">Medical Conditions:</span>
                  <p className="font-medium text-gray-800">{medicalInfo.medical_conditions}</p>
                </div>
              )}
              {medicalInfo.emergency_contact && (
                <div className="py-2">
                  <span className="text-gray-600 block mb-1">Emergency Contact:</span>
                  <p className="font-medium text-gray-800">{medicalInfo.emergency_contact}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No medical information available</p>
          )}
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Documents
          </h3>
          <div className="space-y-2">
            {profile.aadharNumber && (
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Aadhar Card</p>
                    <p className="text-xs text-gray-500">{profile.aadharNumber}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-800">Student ID Card</p>
                  <p className="text-xs text-gray-500">{profile.admissionNo}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/student/idcard')}
                className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-medium"
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => navigate('/student/profile')}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-medium shadow-lg hover:bg-indigo-700 transition flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default PersonalDetails;

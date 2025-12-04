import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ photoUrl: '', phone: '' });
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
      setFormData({
        photoUrl: data.student.photoUrl || '',
        phone: data.student.user_id?.phone || ''
      });
    } catch (error) {
      console.error('Profile error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/student/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditing(false);
      fetchProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile');
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate('/student/dashboard')} className="mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-white/80 text-sm mt-1">View and update your details</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Photo */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden mb-4">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt={profile.user_id?.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-indigo-600">{profile.user_id?.name?.charAt(0)}</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{profile.user_id?.name}</h2>
          <p className="text-gray-600">{profile.user_id?.email}</p>
          <button
            onClick={() => setEditing(!editing)}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
              <input
                type="text"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="+91 1234567890"
              />
            </div>
            <button
              onClick={handleUpdate}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-gray-800 mb-3">Basic Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Roll Number</span>
              <span className="font-medium text-gray-800">{profile.roll_number || profile.user_id?.roll_no}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Admission No</span>
              <span className="font-medium text-gray-800">{profile.admission_number || profile.admissionNo}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Class</span>
              <span className="font-medium text-gray-800">{profile.class_id?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Department</span>
              <span className="font-medium text-gray-800">{profile.departmentId?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Semester</span>
              <span className="font-medium text-gray-800">{profile.semester || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Batch</span>
              <span className="font-medium text-gray-800">{profile.batch || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Guardian Info */}
        {profile.guardian_info && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3">Guardian Information</h3>
            <div className="space-y-3">
              {profile.guardian_info.father_name && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Father's Name</span>
                  <span className="font-medium text-gray-800">{profile.guardian_info.father_name}</span>
                </div>
              )}
              {profile.guardian_info.mother_name && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Mother's Name</span>
                  <span className="font-medium text-gray-800">{profile.guardian_info.mother_name}</span>
                </div>
              )}
              {profile.guardian_info.guardian_phone && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Contact</span>
                  <span className="font-medium text-gray-800">{profile.guardian_info.guardian_phone}</span>
                </div>
              )}
              {profile.guardian_info.guardian_email && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-800">{profile.guardian_info.guardian_email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enrolled Courses */}
        {profile.courseIds && profile.courseIds.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3">Enrolled Courses</h3>
            <div className="space-y-2">
              {profile.courseIds.map((course) => (
                <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-800">{course.name}</div>
                    <div className="text-xs text-gray-500">{course.code}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.type === 'school' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {course.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/student/id-card')}
            className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">ID Card</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

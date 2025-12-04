import React, { useState } from 'react';
const StudentProfile = ({ profile, onUpdate, onClose, editMode, setEditMode }) => {
  const [formData, setFormData] = useState({
    guardianInfo: {
      father_name: profile.guardianInfo?.father_name || '',
      mother_name: profile.guardianInfo?.mother_name || '',
      guardian_phone: profile.guardianInfo?.guardian_phone || '',
      guardian_email: profile.guardianInfo?.guardian_email || '',
      guardian_occupation: profile.guardianInfo?.guardian_occupation || '',
    },
    address: {
      street: profile.studentDetails?.address?.street || '',
      city: profile.studentDetails?.address?.city || '',
      state: profile.studentDetails?.address?.state || '',
      pincode: profile.studentDetails?.address?.pincode || '',
    },
    medical_info: {
      blood_group: profile.studentDetails?.medical_info?.blood_group || '',
      allergies: profile.studentDetails?.medical_info?.allergies || [],
      medical_conditions: profile.studentDetails?.medical_info?.medical_conditions || [],
    },
    house: profile.studentDetails?.house || '',
    date_of_birth: profile.studentDetails?.date_of_birth || '',
    gender: profile.studentDetails?.gender || '',
    phone: profile.studentDetails?.phone || '',
  });
  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <div className="modal-header">
          <h3>
            <i className="fas fa-user-edit"></i> Student Profile
          </h3>
          <div className="modal-actions">
            {!editMode && (
              <button 
                className="btn-secondary"
                onClick={() => setEditMode(true)}
              >
                <i className="fas fa-edit"></i> Edit
              </button>
            )}
            <button className="btn-danger" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div className="modal-body">
          {/* Basic Information */}
          <div className="profile-section">
            <h4><i className="fas fa-info-circle"></i> Basic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={profile.name} disabled className="form-input" />
              </div>
              <div className="form-group">
                <label>Roll Number</label>
                <input type="text" value={profile.rollNo} disabled className="form-input" />
              </div>
              <div className="form-group">
                <label>Class</label>
                <input type="text" value={profile.class || 'Not Assigned'} disabled className="form-input" />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input 
                  type="date" 
                  value={formData.date_of_birth} 
                  onChange={(e) => handleInputChange(null, 'date_of_birth', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select 
                  value={formData.gender} 
                  onChange={(e) => handleInputChange(null, 'gender', e.target.value)}
                  disabled={!editMode}
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                  placeholder="Student phone number"
                />
              </div>
            </div>
          </div>
          {/* Address / Residence */}
          <div className="profile-section">
            <h4><i className="fas fa-home"></i> Address / Residence</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Address Line / Landmark</label>
                <input 
                  type="text" 
                  value={formData.address.street} 
                  onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                  placeholder="House / Street / Landmark"/>
              </div>
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  value={formData.address.city} 
                  onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                  placeholder="City"/>
              </div>
              <div className="form-group">
                <label>State</label>
                <input 
                  type="text" 
                  value={formData.address.state} 
                  onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                  placeholder="State"/>
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input 
                  type="text" 
                  value={formData.address.pincode} 
                  onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                  placeholder="Pincode"/>
              </div>
            </div>
          </div>
          {/* Guardian Information */}
          <div className="profile-section">
            <h4><i className="fas fa-users"></i> Guardian Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Father's Name</label>
                <input 
                  type="text" 
                  value={formData.guardianInfo.father_name} 
                  onChange={(e) => handleInputChange('guardianInfo', 'father_name', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                  placeholder="Father's full name"
                />
              </div>
              <div className="form-group">
                <label>Mother's Name</label>
                <input 
                  type="text" 
                  value={formData.guardianInfo.mother_name} 
                  onChange={(e) => handleInputChange('guardianInfo', 'mother_name', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                  placeholder="Mother's full name"
                />
              </div>
              <div className="form-group">
                <label>Guardian Phone</label>
                <input 
                  type="tel" 
                  value={formData.guardianInfo.guardian_phone} 
                  onChange={(e) => handleInputChange('guardianInfo', 'guardian_phone', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                  placeholder="Guardian contact number"
                />
              </div>
              <div className="form-group">
                <label>Guardian Email</label>
                <input 
                  type="email" 
                  value={formData.guardianInfo.guardian_email} 
                  onChange={(e) => handleInputChange('guardianInfo', 'guardian_email', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                  placeholder="Guardian email address"
                />
              </div>
              <div className="form-group">
                <label>Guardian Occupation</label>
                <input 
                  type="text" 
                  value={formData.guardianInfo.guardian_occupation} 
                  onChange={(e) => handleInputChange('guardianInfo', 'guardian_occupation', e.target.value)}
                  disabled={!editMode}
                  className="form-input" 
                  placeholder="Guardian's profession"
                />
              </div>
            </div>
          </div>
          {/* (Removed separate address block; merged above) */}
          {/* Medical Information */}
          <div className="profile-section">
            <h4><i className="fas fa-heartbeat"></i> Medical Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Blood Group</label>
                <select 
                  value={formData.medical_info.blood_group} 
                  onChange={(e) => handleInputChange('medical_info', 'blood_group', e.target.value)}
                  disabled={!editMode}
                  className="form-input"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>
          {/* Academic Information */}
          <div className="profile-section">
            <h4><i className="fas fa-graduation-cap"></i> Academic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Overall Attendance</label>
                <input type="text" value={`${profile.totalAttendance}%`} disabled className="form-input" />
              </div>
              <div className="form-group">
                <label>Current Month Attendance</label>
                <input type="text" value={`${profile.currentMonth}%`} disabled className="form-input" />
              </div>
              <div className="form-group">
                <label>Total Fines</label>
                <input type="text" value={`₹${profile.totalFines}`} disabled className="form-input" />
              </div>
            </div>
          </div>
        </div>
        {editMode && (
          <div className="modal-footer">
            <button 
              className="btn-secondary"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={handleSubmit}
            >
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentProfile;

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL, { apiRequest } from '../utils/api'

export default function TeacherProfile() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editMode, setEditMode] = useState(false)

  const [photoPreview, setPhotoPreview] = useState(null)

  const [form, setForm] = useState({
    staff_code: '',
    name: '',
    date_of_birth: '',
    blood_group: '',
    religion: '',
    caste: '',
    category: '',
    aadhaar_number: '',
    designation: '',
    department: '',
    phone: '',
    address: { street: '', city: '', state: '', pincode: '' },
    gender: '',
    qualification: '',
    experience_years: 0,
    profile_picture: ''
  })

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await apiRequest(`${API_BASE_URL}/api/teacher/profile`, { headers })
      const { user, teacher } = data
      setForm({
        staff_code: teacher.emp_id || '',
        name: user.name || '',
        date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().slice(0,10) : '',
        blood_group: teacher.blood_group || '',
        religion: teacher.religion || '',
        caste: teacher.caste || '',
        category: teacher.category || '',
        aadhaar_number: teacher.aadhaar_number || '',
        designation: teacher.designation || '',
        department: teacher.department || '',
        phone: user.phone || '',
        address: user.address || { street: '', city: '', state: '', pincode: '' },
        gender: user.gender || '',
        qualification: teacher.qualification || '',
        experience_years: teacher.experience_years || 0,
        profile_picture: user.profile_picture || ''
      })
      setPhotoPreview(user.profile_picture || null)
    } catch (err) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProfile() }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const key = name.split('.')[1]
      setForm(prev => ({ ...prev, address: { ...prev.address, [key]: value } }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const uploadPhoto = async (file) => {
    const fd = new FormData()
    fd.append('photo', file)
    const res = await fetch(`${API_BASE_URL}/api/teacher/profile/photo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ msg: `HTTP ${res.status}` }))
      throw new Error(err.msg || 'Upload failed')
    }
    return res.json()
  }

  const onPhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setMessage('')
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result)
      reader.readAsDataURL(file)
      const out = await uploadPhoto(file)
      setForm(prev => ({ ...prev, profile_picture: out.profile_picture }))
      setMessage('✅ Photo updated')
    } catch (err) {
      setMessage(`❌ ${err.message}`)
    }
  }

  const onSave = async () => {
    try {
      setSaving(true)
      setMessage('')
      // Map fields to backend structure
      const payload = {
        name: form.name,
        phone: form.phone,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        address: form.address,
        designation: form.designation,
        department: form.department,
        qualification: form.qualification,
        experience_years: Number(form.experience_years) || 0,
        blood_group: form.blood_group,
        religion: form.religion,
        caste: form.caste,
        category: form.category,
        aadhaar_number: form.aadhaar_number
      }

      await apiRequest(`${API_BASE_URL}/api/teacher/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      setMessage('✅ Profile saved successfully')
      setEditMode(false)
      await loadProfile()
    } catch (err) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container fade-in">
      {/* Header Bar */}
      <div style={{ background: '#5b21b6', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', marginRight: 12, cursor: 'pointer' }}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 style={{ margin: 0, fontSize: '1.1rem' }}>My Profile</h1>
      </div>

      <div className="container" style={{ maxWidth: 800 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -40 }}>
          <div style={{ position: 'relative' }}>
            <img
              src={photoPreview || 'https://via.placeholder.com/120x120.png?text=Avatar'}
              alt="Profile"
              style={{ width: 120, height: 120, borderRadius: '50%', border: '4px solid white', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', objectFit: 'cover' }}
            />
            <label htmlFor="photo-input" title="Change photo"
              style={{ position: 'absolute', right: 0, bottom: 0, background: '#5b21b6', color: 'white', borderRadius: '50%', width: 36, height: 36, display: 'grid', placeItems: 'center', cursor: 'pointer', border: '2px solid white' }}>
              <i className="fas fa-camera"></i>
            </label>
            <input id="photo-input" type="file" accept="image/*" onChange={onPhotoChange} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`} style={{ marginTop: 16 }}>
            {message}
          </div>
        )}

        {/* Info Card */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Personal Information</h2>
              <p className="card-subtitle">Update your personal and professional details</p>
            </div>
            <button className="btn btn-secondary" onClick={() => setEditMode(v => !v)}>
              <i className="fas fa-edit"></i> {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="text-muted">Loading profile...</div>
            ) : (
              <>
                <div className="dashboard-grid">
                  <div className="form-group">
                    <label className="form-label">Staff Code</label>
                    <input className="form-input" value={form.staff_code} disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input name="name" className="form-input" value={form.name} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="date_of_birth" className="form-input" value={form.date_of_birth} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-input" value={form.gender} onChange={onChange} disabled={!editMode}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <input name="blood_group" className="form-input" value={form.blood_group} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Religion</label>
                    <input name="religion" className="form-input" value={form.religion} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Caste</label>
                    <input name="caste" className="form-input" value={form.caste} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input name="category" className="form-input" value={form.category} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Aadhaar Number</label>
                    <input name="aadhaar_number" className="form-input" value={form.aadhaar_number} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input name="designation" className="form-input" value={form.designation} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input name="department" className="form-input" value={form.department} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input name="phone" className="form-input" value={form.phone} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address</label>
                    <div className="dashboard-grid">
                      <input name="address.street" className="form-input" placeholder="Street" value={form.address?.street || ''} onChange={onChange} disabled={!editMode} />
                      <input name="address.city" className="form-input" placeholder="City" value={form.address?.city || ''} onChange={onChange} disabled={!editMode} />
                      <input name="address.state" className="form-input" placeholder="State" value={form.address?.state || ''} onChange={onChange} disabled={!editMode} />
                      <input name="address.pincode" className="form-input" placeholder="Pincode" value={form.address?.pincode || ''} onChange={onChange} disabled={!editMode} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Qualification</label>
                    <input name="qualification" className="form-input" value={form.qualification} onChange={onChange} disabled={!editMode} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience (years)</label>
                    <input type="number" name="experience_years" className="form-input" value={form.experience_years} onChange={onChange} disabled={!editMode} />
                  </div>
                </div>

                <div className="d-flex" style={{ gap: '0.75rem', marginTop: 12 }}>
                  <button className="btn btn-primary" onClick={onSave} disabled={!editMode || saving}>
                    {saving ? (<><div className="spinner"></div> Saving...</>) : (<><i className="fas fa-save"></i> Save</>)}
                  </button>
                  <button className="btn" onClick={() => navigate('/teacher')}>
                    <i className="fas fa-home"></i> Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

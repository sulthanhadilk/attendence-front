import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UserCreateForm({ token, onCreated, disabled }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roll, setRoll] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const headers = token ? { Authorization: 'Bearer ' + token } : {};

  const submit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMsg('⚠️ Login required');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const payload = { name, password, role };
      if (email && role !== 'student') payload.email = email; else if (email && role === 'student') payload.email = email; // optional
      if (roll && role === 'student') payload.roll_no = roll;
      const res = await axios.post(API + '/api/admin/create-user', payload, { headers });
      setMsg('✅ User created: ' + res.data.user._id);
      setName(''); setEmail(''); setRoll(''); setPassword(''); setRole('student');
      onCreated && onCreated();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.msg || e.message));
    } finally { setLoading(false); }
  };

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h2 className="card-title"><i className="fas fa-user-plus"/> Create New User</h2>
        <p className="card-subtitle">Add students, teachers, or admins</p>
      </div>
      <div className="card-body">
        <form onSubmit={submit}>
          <div className="dashboard-grid">
            <div className="form-group">
              <label className="form-label"><i className="fas fa-user"/> Full Name *</label>
              <input className="form-input" value={name} onChange={e=>setName(e.target.value)} required placeholder="Full name"/>
            </div>
            <div className="form-group">
              <label className="form-label"><i className="fas fa-envelope"/> Email {role !== 'student' && '*'} </label>
              <input type="email" className="form-input" value={email} onChange={e=>setEmail(e.target.value)} required={role !== 'student'} placeholder={role==='student'?'Optional':'Required'} />
            </div>
            <div className="form-group">
              <label className="form-label"><i className="fas fa-id-card"/> Roll {role==='student' && '*'} </label>
              <input className="form-input" value={roll} onChange={e=>setRoll(e.target.value)} required={role==='student'} placeholder={role==='student'?'Student roll number':'Leave blank'} />
            </div>
            <div className="form-group">
              <label className="form-label"><i className="fas fa-key"/> Password *</label>
              <input type="password" className="form-input" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} placeholder="Min 6 chars" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label"><i className="fas fa-user-tag"/> Role *</label>
            <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          {msg && <div className={`alert ${msg.startsWith('✅')?'alert-success':msg.startsWith('⚠️')?'alert-warning':'alert-error'}`}>{msg}</div>}
          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={loading || disabled}>{loading? 'Creating...' : 'Create User'}</button>
            <button type="button" className="btn btn-secondary" onClick={()=>{setName('');setEmail('');setRoll('');setPassword('');setRole('student');setMsg('')}}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}

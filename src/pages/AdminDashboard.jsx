import React, { useState } from 'react'
import axios from 'axios'
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export default function AdminDashboard(){
  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };
  const [name,setName]=useState(''), [email,setEmail]=useState(''), [roll,setRoll]=useState(''), [password,setPassword]=useState(''), [role,setRole]=useState('student'), [msg,setMsg]=useState('');
  const createUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API + '/api/admin/create-user', { name, email, roll_no: roll, password, role }, { headers });
      setMsg('User created: ' + res.data.user._id);
    } catch (err) {
      setMsg(err.response?.data?.msg || err.message);
    }
  }
  return (<div className="container">
    <nav><strong>Admin Dashboard</strong></nav>
    <h3>Create User (Admin only)</h3>
    <form onSubmit={createUser}>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input placeholder="Email (teachers/admin)" value={email} onChange={e=>setEmail(e.target.value)}/>
      <input placeholder="Roll No (students)" value={roll} onChange={e=>setRoll(e.target.value)}/>
      <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
      <select value={role} onChange={e=>setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </select>
      <button>Create</button>
    </form>
    {msg && <p>{msg}</p>}
  </div>)
}

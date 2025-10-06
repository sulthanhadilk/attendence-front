import React, { useState } from 'react'
import axios from 'axios'
export default function Login(){
  const [identifier,setIdentifier]=useState(''), [password,setPassword]=useState(''), [msg,setMsg]=useState('');
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API + '/api/auth/login', { identifier, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      if (user.role === 'admin') window.location = '/admin';
      if (user.role === 'teacher') window.location = '/teacher';
      if (user.role === 'student') window.location = '/student';
    } catch (err) {
      setMsg(err.response?.data?.msg || err.message);
    }
  }
  return (<div className="container">
    <h2>Login</h2>
    <form onSubmit={submit}>
      <label>Roll No or Email (students use roll no)</label>
      <input value={identifier} onChange={e=>setIdentifier(e.target.value)} required/>
      <label>Password</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
      <button>Login</button>
    </form>
    {msg && <p style={{color:'red'}}>{msg}</p>}
    <p>Note: Admin must create accounts. Use the /backend setup route to create initial admin.</p>
  </div>)
}

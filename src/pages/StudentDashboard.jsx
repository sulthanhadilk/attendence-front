import React, { useState } from 'react'
import axios from 'axios'
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export default function StudentDashboard(){
  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };
  const [studentId,setStudentId]=useState(''), [month,setMonth]=useState('2025-09'), [result,setResult]=useState(null), [msg,setMsg]=useState('');
  const getAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(API + `/api/student/${studentId}/attendance/${month}`, { headers });
      setResult(res.data);
    } catch (err) { setMsg(err.response?.data?.msg || err.message); }
  }
  return (<div className="container">
    <nav><strong>Student Dashboard</strong></nav>
    <h3>View Attendance %</h3>
    <form onSubmit={getAttendance}>
      <input placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} required/>
      <input placeholder="Year-Month (YYYY-MM)" value={month} onChange={e=>setMonth(e.target.value)} required/>
      <button>Get</button>
    </form>
    {result && <div>
      <p>Total entries: {result.total}</p>
      <p>Present: {result.present}</p>
      <p>Percentage: {result.percent}%</p>
    </div>}
    {msg && <p>{msg}</p>}
  </div>)
}

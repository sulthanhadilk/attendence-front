import React, { useState } from 'react'
import axios from 'axios'
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export default function TeacherDashboard(){
  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };
  const [sessionId,setSessionId]=useState(''), [date,setDate]=useState(''), [entries,setEntries]=useState('[{"student_id":"", "status":"present"}]'), [msg,setMsg]=useState('');
  const markAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API + '/api/teacher/mark-attendance', { session_id: sessionId, date, entries: JSON.parse(entries) }, { headers });
      setMsg('Saved ' + res.data.saved.length + ' entries');
    } catch (err) { setMsg(err.response?.data?.msg || err.message); }
  }
  // Add fine
  const [studentId,setStudentId]=useState(''), [amount,setAmount]=useState(''), [reason,setReason]=useState('');
  const addFine = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API + '/api/teacher/add-fine', { student_id: studentId, amount: Number(amount), reason, date: new Date().toISOString().slice(0,10) }, { headers });
      setMsg('Fine added: ' + res.data.fine._id);
    } catch (err) { setMsg(err.response?.data?.msg || err.message); }
  }
  return (<div className="container">
    <nav><strong>Teacher Dashboard</strong></nav>
    <h3>Mark Attendance</h3>
    <form onSubmit={markAttendance}>
      <input placeholder="Session ID" value={sessionId} onChange={e=>setSessionId(e.target.value)} required/>
      <input placeholder="Date YYYY-MM-DD" value={date} onChange={e=>setDate(e.target.value)} required/>
      <textarea value={entries} onChange={e=>setEntries(e.target.value)} rows={6}/>
      <button>Save Attendance</button>
    </form>

    <h3>Add Fine</h3>
    <form onSubmit={addFine}>
      <input placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} required/>
      <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} required/>
      <input placeholder="Reason" value={reason} onChange={e=>setReason(e.target.value)} />
      <button>Add Fine</button>
    </form>

    {msg && <p>{msg}</p>}
  </div>)
}

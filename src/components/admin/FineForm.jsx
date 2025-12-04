import React, { useState } from 'react'
import API_BASE_URL from '../../utils/api'
export default function FineForm({ onCreated }) {
  const token = localStorage.getItem('token')
  const [studentId, setStudentId] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('Custom')
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/fines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ student_id: studentId, amount: Number(amount), reason, custom_reason: custom })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Failed')
      onCreated && onCreated(data.fine)
      setStudentId(''); setAmount(''); setCustom('')
    } catch (e) { alert(e.message) } finally { setLoading(false) }
  }
  return (
    <form onSubmit={submit} className="card">
      <div className="card-header"><h3 className="card-title"><i className="fas fa-plus"/> Create Fine</h3></div>
      <div className="card-body">
        <div className="dashboard-grid">
          <div className="form-group"><label className="form-label">Student ID</label><input className="form-input" value={studentId} onChange={e=>setStudentId(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">Amount</label><input className="form-input" type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">Reason</label>
            <select className="form-input" value={reason} onChange={e=>setReason(e.target.value)}>
              <option>Late</option><option>Absent</option><option>Misbehavior</option><option>Custom</option>
            </select>
          </div>
          {reason==='Custom' && (
            <div className="form-group"><label className="form-label">Custom Reason</label><input className="form-input" value={custom} onChange={e=>setCustom(e.target.value)} /></div>
          )}
        </div>
        <button className="btn btn-primary" disabled={loading}>{loading? 'Saving...' : 'Create'}</button>
      </div>
    </form>
  )
}

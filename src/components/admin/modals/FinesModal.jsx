import React, { useEffect, useState } from 'react'
import API_BASE_URL from '../../../utils/api'
import FineForm from '../../admin/FineForm'

export default function FinesModal({ open, onClose }) {
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  const [fines, setFines] = useState([])
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchFines = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/fines`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to load fines')
      const data = await res.json()
      setFines(Array.isArray(data) ? data : [])
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const markPaid = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/fines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_paid: true })
      })
      if (!res.ok) throw new Error('Failed to update fine')
      fetchFines()
    } catch (e) { alert(e.message) }
  }

  useEffect(()=>{ if(open) fetchFines() }, [open])
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-receipt"/> Fines Management</h2>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"/></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="mb-4">
            <button className="btn btn-primary" onClick={()=>setCreating(v=>!v)}>
              <i className="fas fa-plus"/> {creating ? 'Hide Form' : 'Create Fine'}
            </button>
          </div>

          {creating && (
            <FineForm onCreated={()=>{ setCreating(false); fetchFines() }} />
          )}

          <div className="card mt-4">
            <div className="card-header">
              <h3 className="card-title"><i className="fas fa-list"/> Recent Fines</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="spinner"/>
              ) : fines.length === 0 ? (
                <p className="text-muted">No fines found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Student</th>
                        <th>Reason</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fines.map(f => (
                        <tr key={f._id}>
                          <td>{new Date(f.date || f.fine_date).toLocaleDateString()}</td>
                          <td>{f.student_id?.user_id?.name || f.student_id?.name || f.student_id || '-'}</td>
                          <td>{f.reason}{f.reason==='Custom' && f.custom_reason ? ` - ${f.custom_reason}` : ''}</td>
                          <td>₹{f.amount}</td>
                          <td>{f.is_paid ? <span className="badge badge-success">Paid</span> : <span className="badge badge-warning">Pending</span>}</td>
                          <td>
                            {!f.is_paid && (
                              <button className="btn btn-success btn-sm" onClick={()=>markPaid(f._id)}>
                                <i className="fas fa-check"/> Mark Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

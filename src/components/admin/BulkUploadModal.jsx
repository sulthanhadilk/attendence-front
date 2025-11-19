import React, { useState } from 'react'
import API_BASE_URL from '../../utils/api'

export default function BulkUploadModal({ open, onClose, onImported }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  if (!open) return null

  const upload = async (commit) => {
    if (!file) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_BASE_URL}/api/admin/import/students${commit ? '?commit=true' : ''}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Upload failed')
      if (!commit) setPreview(data)
      else { setPreview(null); onImported && onImported(data); onClose() }
    } catch (e) {
      setPreview({ error: e.message })
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Bulk Import Students (CSV)</h2>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"/></button>
        </div>
        <div className="modal-body">
          <input type="file" accept=".csv" onChange={(e)=> setFile(e.target.files?.[0]||null)} />
          <div className="d-flex" style={{gap:8, marginTop:12}}>
            <button className="btn btn-secondary" disabled={!file||loading} onClick={()=>upload(false)}><i className="fas fa-eye"/> Preview</button>
            <button className="btn btn-primary" disabled={!file||loading} onClick={()=>upload(true)}><i className="fas fa-check"/> Import</button>
          </div>
          {preview && (
            <div className="card mt-3">
              <div className="card-header"><h3 className="card-title">Preview</h3></div>
              <div className="card-body">
                <pre style={{ maxHeight: 240, overflow: 'auto' }}>{JSON.stringify(preview, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

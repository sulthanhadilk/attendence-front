import React from 'react'
import TimetableEditor from '../../admin/TimetableEditor'
export default function TimetableModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-calendar"/> Timetable Management</h2>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"/></button>
        </div>
        <div className="modal-body">
          <p className="text-muted">Click a cell to add or edit a period. Save to persist.</p>
          <TimetableEditor />
        </div>
      </div>
    </div>
  )
}

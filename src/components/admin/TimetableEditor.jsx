import React, { useMemo, useState } from 'react'
import API_BASE_URL from '../../utils/api'

const days = ['Mon','Tue','Wed','Thu','Fri','Sat']
const hours = Array.from({length:7}, (_,i)=> i+1)

export default function TimetableEditor() {
  const token = localStorage.getItem('token')
  const [entries, setEntries] = useState([]) // {id, dayOfWeek, hourIndex, room, teacherId, startTime, endTime, title}
  const map = useMemo(()=>{
    const m = {}
    for (const e of entries) m[`${e.dayOfWeek}-${e.hourIndex}`] = e
    return m
  }, [entries])

  const onCellClick = (d, h) => {
    const key = `${d}-${h}`
    const existing = map[key]
    const title = prompt('Enter subject / title', existing?.title || '')
    if (title === null) return
    const updated = { id: existing?.id || `${Date.now()}-${Math.random()}`, dayOfWeek: d, hourIndex: h, title }
    setEntries(prev => {
      const next = prev.filter(e => !(e.dayOfWeek===d && e.hourIndex===h))
      if (title.trim()) next.push(updated)
      return next
    })
  }

  const save = async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/timetable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ entries })
    })
    if (!res.ok) alert('Save failed')
    else alert('Timetable saved')
  }

  return (
    <div className="card">
      <div className="card-header"><h3 className="card-title"><i className="fas fa-calendar"/> Timetable</h3></div>
      <div className="card-body">
        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                {hours.map(h => <th key={h}>Hour {h}</th>)}
              </tr>
            </thead>
            <tbody>
              {days.map((d, di) => (
                <tr key={d}>
                  <td className="text-muted">{d}</td>
                  {hours.map(h => (
                    <td key={`${di}-${h}`} className="hover-row" onClick={()=>onCellClick(di, h)}>
                      {map[`${di}-${h}`]?.title || <span className="text-muted">Add</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex" style={{gap:8}}>
          <button className="btn btn-primary" onClick={save}><i className="fas fa-save"/> Save</button>
          <button className="btn btn-secondary" onClick={()=>setEntries([])}><i className="fas fa-eraser"/> Clear</button>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
export default function AnalyticsCharts({ stats = {} }) {
  const cards = [
    { label: 'Attendance', value: stats.attendancePct ?? 0, color: '#6366f1' },
    { label: 'On-Time', value: stats.onTimePct ?? 0, color: '#10b981' },
    { label: 'Paid Fines', value: stats.finesPaidPct ?? 0, color: '#f59e0b' }
  ]
  return (
    <div className="dashboard-grid">
      {cards.map(c => (
        <div key={c.label} className="card" style={{textAlign:'center'}}>
          <div className="card-body">
            <div style={{ width: 120, height: 120, margin:'0 auto', borderRadius:'50%', background: `conic-gradient(${c.color} ${c.value}%, #e5e7eb 0)` }} />
            <div className="stats-value" style={{ marginTop: 8 }}>{c.value}%</div>
            <div className="text-muted">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

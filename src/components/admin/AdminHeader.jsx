import React from 'react'
import Header from '../../components/Header'

export default function AdminHeader({ title }) {
  return (
    <div className="mb-4">
      <Header userRole="admin" userName="Administrator" />
      {title && (
        <div className="container">
          <h1 className="login-title text-primary" style={{display:'flex',alignItems:'center',gap:8}}>
            <i className="fas fa-tachometer-alt"></i> {title}
          </h1>
        </div>
      )}
    </div>
  )
}

import React from 'react';
export default function AdminHeader({ title, user }) {
  return (
    <div className="bg-indigo-600 text-white rounded-b-3xl p-4 shadow">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm">{user?.name}</span>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            {(user?.name||'A').slice(0,1)}
          </div>
        </div>
      </div>
    </div>
  );
}import React from 'react'
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

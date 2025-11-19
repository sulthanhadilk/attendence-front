import React from 'react'

const links = [
  { href: '/admin', icon: 'fas fa-gauge', label: 'Dashboard' },
  { href: '/admin/students', icon: 'fas fa-user-graduate', label: 'Students' },
  { href: '/admin/teachers', icon: 'fas fa-chalkboard-teacher', label: 'Teachers' },
  { href: '/admin/create-user', icon: 'fas fa-user-plus', label: 'Create User' },
  { href: '/admin/attendance', icon: 'fas fa-user-check', label: 'Attendance' },
  { href: '/admin/fines', icon: 'fas fa-money-bill-wave', label: 'Fines' },
  { href: '/admin/classes', icon: 'fas fa-door-open', label: 'Classes & Timetable' },
  { href: '/admin/courses', icon: 'fas fa-book', label: 'Courses & Depts' },
  { href: '/admin/exams', icon: 'fas fa-file-alt', label: 'Exams & Results' },
  { href: '/admin/reports', icon: 'fas fa-chart-bar', label: 'Reports' },
  { href: '/admin/notifications', icon: 'fas fa-bell', label: 'Notifications' },
  { href: '/admin/settings', icon: 'fas fa-cog', label: 'Settings' },
]

export default function AdminSidebar() {
  return (
    <aside className="card" style={{position:'sticky', top:16, alignSelf:'start'}}>
      <div className="card-header"><h3 className="card-title"><i className="fas fa-compass"/> Navigation</h3></div>
      <div className="card-body">
        <div className="dashboard-grid" style={{gridTemplateColumns:'1fr'}}>
          {links.map(link => (
            <a key={link.href} className="btn btn-secondary" href={link.href}>
              <i className={link.icon}></i> {link.label}
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}

import React from 'react';
import { NavLink } from 'react-router-dom';
const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/teachers', label: 'Teachers' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/classes', label: 'Classes' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/timetable', label: 'Timetable' },
  { to: '/admin/attendance', label: 'Attendance' },
  { to: '/admin/prayer', label: 'Prayer' },
  { to: '/admin/fines', label: 'Fines' },
  { to: '/admin/fees', label: 'Fees' },
  { to: '/admin/results', label: 'Results' },
  { to: '/admin/library', label: 'Library' },
  { to: '/admin/conduct', label: 'Conduct' },
  { to: '/admin/ai', label: 'AI Controls' },
  { to: '/admin/audit', label: 'Audit Logs' },
  { to: '/admin/notices', label: 'Notices' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/profile', label: 'Profile' },
];
export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow-sm border-r h-screen p-4">
      <h2 className="text-indigo-700 font-bold mb-4">Admin Panel</h2>
      <nav className="space-y-1">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>{l.label}</NavLink>
        ))}
      </nav>
    </aside>
  );
}import React from 'react'
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

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
}

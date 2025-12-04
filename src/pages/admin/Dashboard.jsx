import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
export default function Dashboard() {
  const user = { name: 'Admin' };
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Admin Dashboard" user={user} />
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Students" value={0} icon={'👨‍🎓'} />
          <StatCard title="Total Teachers" value={0} icon={'👩‍🏫'} />
          <StatCard title="Attendance %" value={'0%'} icon={'📈'} />
        </div>
      </div>
    </div>
  );
}

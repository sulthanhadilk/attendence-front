import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AttendanceAdmin(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Attendance Control" />
        <div className="p-4">{/* View/Override/Export UI */}</div>
      </div>
    </div>
  );
}

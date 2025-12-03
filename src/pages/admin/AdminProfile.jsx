import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminProfile(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Admin Profile" />
        <div className="p-4">{/* Profile details/edit */}</div>
      </div>
    </div>
  );
}

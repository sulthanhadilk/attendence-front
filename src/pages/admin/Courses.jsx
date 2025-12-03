import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function Courses(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Courses" />
        <div className="p-4">{/* CRUD UI here */}</div>
      </div>
    </div>
  );
}

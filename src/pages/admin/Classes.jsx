import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function Classes(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Classes" />
        <div className="p-4">{/* CRUD UI here */}</div>
      </div>
    </div>
  );
}

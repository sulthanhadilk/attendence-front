import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function FinesAdmin(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Fines Management" />
        <div className="p-4">{/* Filters/Approve/Edit/Status */}</div>
      </div>
    </div>
  );
}

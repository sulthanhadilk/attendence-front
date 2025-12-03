import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function ResultsAdmin(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Results Management" />
        <div className="p-4">{/* Approve/Edit/Publish */}</div>
      </div>
    </div>
  );
}

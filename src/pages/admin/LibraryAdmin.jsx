import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function LibraryAdmin(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Library Admin" />
        <div className="p-4">{/* Books/Issue/Return */}</div>
      </div>
    </div>
  );
}

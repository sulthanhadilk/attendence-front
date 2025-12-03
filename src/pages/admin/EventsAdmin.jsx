import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function EventsAdmin(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Events" />
        <div className="p-4">{/* CRUD events with poster */}</div>
      </div>
    </div>
  );
}

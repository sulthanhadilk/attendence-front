import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AuditLogs(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Audit Logs" />
        <div className="p-4">{/* Logs table/Export */}</div>
      </div>
    </div>
  );
}

import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function SettingsAdmin(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Settings" />
        <div className="p-4">{/* System toggles/settings */}</div>
      </div>
    </div>
  );
}

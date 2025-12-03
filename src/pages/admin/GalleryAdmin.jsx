import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function GalleryAdmin(){
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Photo Gallery" />
        <div className="p-4">{/* Upload/Manage/Tag */}</div>
      </div>
    </div>
  );
}

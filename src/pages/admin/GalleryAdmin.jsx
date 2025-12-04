import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function GalleryAdmin(){
  const [albums, setAlbums] = useState([{id: 1, name: 'Sports Day 2025', photos: 45, date: '2025-11-15'},{id: 2, name: 'Annual Function', photos: 78, date: '2025-10-20'},{id: 3, name: 'Field Trip', photos: 32, date: '2025-09-10'}]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Gallery Management" />
        <div className="p-4">
          <div className="flex gap-2 mb-4"><button className="bg-blue-600 text-white px-4 py-2 rounded">+ Create Album</button><button className="bg-green-600 text-white px-4 py-2 rounded">📤 Upload Photos</button></div>

          <div className="grid grid-cols-3 gap-4">{albums.map(album => (<div key={album.id} className="bg-white rounded shadow overflow-hidden"><div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl">📷</div><div className="p-4"><h3 className="font-semibold text-lg mb-1">{album.name}</h3><div className="text-sm text-gray-600">{album.photos} photos • {album.date}</div><div className="mt-3 flex gap-2"><button className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex-1">View</button><button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button></div></div></div>))}</div>
        </div>
      </div>
    </div>
  );
}

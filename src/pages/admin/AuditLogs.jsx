import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AuditLogs(){
  const [logs] = useState([{id: 1, user: 'Admin', action: 'Created new teacher', timestamp: '2025-12-04 10:30:00', ip: '192.168.1.1'},{id: 2, user: 'Teacher John', action: 'Marked attendance', timestamp: '2025-12-04 09:15:00', ip: '192.168.1.5'}]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Audit Logs" />
        <div className="p-4">
          <div className="bg-white p-4 rounded shadow mb-4">
            <div className="flex gap-4"><input type="date" className="border p-2 rounded" /><select className="border p-2 rounded"><option>All Users</option><option>Admin</option><option>Teachers</option></select><button className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button><button className="bg-green-600 text-white px-4 py-2 rounded">Export</button></div>
          </div>

          <div className="bg-white rounded shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-100"><tr><th className="p-3 text-left">User</th><th className="p-3 text-left">Action</th><th className="p-3 text-left">Timestamp</th><th className="p-3 text-left">IP Address</th></tr></thead><tbody>{logs.map(log => (<tr key={log.id} className="border-t"><td className="p-3 font-medium">{log.user}</td><td className="p-3">{log.action}</td><td className="p-3 text-sm text-gray-600">{log.timestamp}</td><td className="p-3 text-sm text-gray-600">{log.ip}</td></tr>))}</tbody></table></div>
        </div>
      </div>
    </div>
  );
}

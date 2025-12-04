import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function LibraryAdmin(){
  const [books, setBooks] = useState([{id: 1, title: 'Introduction to Computer Science', author: 'John Doe', isbn: '978-0-123456-78-9', available: 5, total: 10}]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="Library Management" />
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded">{showForm ? 'Cancel' : '+ Add Book'}</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Issue Book</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">Return Book</button>
          </div>

          {showForm && (<div className="bg-white p-4 rounded shadow mb-4"><h3 className="font-semibold mb-3">Add New Book</h3><input type="text" placeholder="Title" className="border p-2 rounded w-full mb-2" /><input type="text" placeholder="Author" className="border p-2 rounded w-full mb-2" /><input type="text" placeholder="ISBN" className="border p-2 rounded w-full mb-2" /><input type="number" placeholder="Quantity" className="border p-2 rounded w-full mb-2" /><button className="bg-green-600 text-white px-4 py-2 rounded">Add Book</button></div>)}

          <div className="bg-white rounded shadow overflow-hidden"><table className="w-full"><thead className="bg-gray-100"><tr><th className="p-3 text-left">Title</th><th className="p-3 text-left">Author</th><th className="p-3 text-left">ISBN</th><th className="p-3 text-left">Available</th><th className="p-3 text-left">Total</th><th className="p-3 text-left">Actions</th></tr></thead><tbody>{books.map(book => (<tr key={book.id} className="border-t"><td className="p-3">{book.title}</td><td className="p-3">{book.author}</td><td className="p-3">{book.isbn}</td><td className="p-3 text-green-600 font-semibold">{book.available}</td><td className="p-3">{book.total}</td><td className="p-3"><button className="bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2">Edit</button><button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete</button></td></tr>))}</tbody></table></div>
        </div>
      </div>
    </div>
  );
}

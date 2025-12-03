import React from 'react';

export default function NotificationCard({ notification, onMarkRead }) {
  const isRead = notification.isRead;

  const typeIcons = {
    class: '📚',
    exam: '📝',
    fine: '💰',
    conduct: '⚠️',
    activity: '🎯',
    general: '📢'
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-4 border ${isRead ? 'border-gray-100' : 'border-indigo-300'} hover:border-indigo-400 transition`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{typeIcons[notification.type] || '📢'}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <h3 className={`font-semibold ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>
              {notification.title}
            </h3>
            {!isRead && (
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            )}
          </div>
          <p className={`text-sm ${isRead ? 'text-gray-500' : 'text-gray-700'} mb-2`}>
            {notification.body}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
            {!isRead && onMarkRead && (
              <button
                onClick={() => onMarkRead(notification._id)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

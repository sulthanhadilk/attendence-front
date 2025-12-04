import React, { useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AIControls(){
  const [aiSettings, setAISettings] = useState({teacherAI: true, adminAI: true, studentAI: false, chatbot: true, predictions: true});

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title="AI Controls" />
        <div className="p-4">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">🤖 AI Feature Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"><span className="font-medium">Teacher AI Assistant</span><input type="checkbox" checked={aiSettings.teacherAI} onChange={(e) => setAISettings({...aiSettings, teacherAI: e.target.checked})} className="w-5 h-5" /></label>
              <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"><span className="font-medium">Admin AI Assistant</span><input type="checkbox" checked={aiSettings.adminAI} onChange={(e) => setAISettings({...aiSettings, adminAI: e.target.checked})} className="w-5 h-5" /></label>
              <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"><span className="font-medium">Student AI Helper</span><input type="checkbox" checked={aiSettings.studentAI} onChange={(e) => setAISettings({...aiSettings, studentAI: e.target.checked})} className="w-5 h-5" /></label>
              <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"><span className="font-medium">AI Chatbot</span><input type="checkbox" checked={aiSettings.chatbot} onChange={(e) => setAISettings({...aiSettings, chatbot: e.target.checked})} className="w-5 h-5" /></label>
              <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"><span className="font-medium">Performance Predictions</span><input type="checkbox" checked={aiSettings.predictions} onChange={(e) => setAISettings({...aiSettings, predictions: e.target.checked})} className="w-5 h-5" /></label>
            </div>
            <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}

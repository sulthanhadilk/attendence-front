import React from 'react';
export default function PrayerToggleRow({ prayer, value, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:bg-indigo-50 transition">
      <span className="text-gray-700 font-medium">{prayer}</span>
      <label className="relative inline-block w-12 h-6 cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition"></div>
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-6 transition"></div>
      </label>
    </div>
  );
}

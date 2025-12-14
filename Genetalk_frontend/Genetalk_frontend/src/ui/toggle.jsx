import React from 'react';

export default function Toggle({ label, checked, onChange, ...props }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        <div className="w-10 h-6 bg-gray-300 peer-checked:bg-emerald-600 rounded-full transition-colors"></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
      </div>
      {label && (
        <span className="text-gray-900 dark:text-gray-100 font-medium">{label}</span>
      )}
    </label>
  );
}

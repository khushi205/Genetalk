import React from 'react';
import { ChevronDown } from 'lucide-react';


export default function Dropdown({ label, error, options, className, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full px-4 py-2 pr-10 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 appearance-none transition-colors ${
            error ? 'border-red-500 dark:border-red-400' : ''
          } ${className || ''}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

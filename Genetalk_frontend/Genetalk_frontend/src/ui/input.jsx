import React from 'react';


export default function Input({
  label,
  error,
  icon,
  className,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-2 ${icon ? 'pl-10' : ''} border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors ${
            error ? 'border-red-500 dark:border-red-400' : ''
          } ${className || ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

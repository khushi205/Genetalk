import React from 'react';

export default function Textarea({
  label,
  error,
  counter,
  value,
  maxLength,
  className,
  ...props
}) {
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </label>
      )}
      <textarea
        value={value}
        maxLength={maxLength}
        className={`w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-vertical transition-colors ${
          error ? 'border-red-500 dark:border-red-400' : ''
        } ${className || ''}`}
        {...props}
      />
      <div className="flex justify-between items-center mt-2">
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        )}
        {counter && maxLength && (
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {charCount} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

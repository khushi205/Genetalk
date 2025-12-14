import React from 'react';
import { CheckCircle, AlertCircle, Zap } from 'lucide-react';

export default function ResultsDisplay({
  title,
  description,
  highlights,
  fullContent,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm ml-9">{description}</p>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((highlight, idx) => (
          <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-2">
              {highlight.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              ) : highlight.type === 'info' ? (
                <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {highlight.label}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  {highlight.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {fullContent && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800">
          {fullContent}
        </div>
      )}
    </div>
  );
}

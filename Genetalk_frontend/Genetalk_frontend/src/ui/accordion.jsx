import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';


export default function Accordion({ items, allowMultiple = false }) {
  const [expanded, setExpanded] = useState([]);

  const toggleItem = (id) => {
    setExpanded(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return allowMultiple ? [...prev, id] : [id];
      }
    });
  };

  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white text-left">{item.title}</h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                expanded.includes(item.id) ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expanded.includes(item.id) && (
            <div className="px-4 py-3 border-t border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

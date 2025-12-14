import React, { useState, useMemo } from 'react';
import { Search, Zap, Cpu, Gauge, Eye, Ear, FileText } from 'lucide-react';
import Input from '../ui/input';


const MODELS = [
  {
    id: 'vision-pro',
    name: 'Vision Pro',
    type: 'vision',
    accuracy: 0.96,
    speed: 'slow',
    costPerRequest: 0.1,
    description: 'Highest accuracy species identification with detailed behavioral analysis',
    supportedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSize: '50MB',
    features: ['Multi-species detection', 'Behavior analysis', 'Habitat identification', 'Age estimation'],
  },
  {
    id: 'vision-standard',
    name: 'Vision Standard',
    type: 'vision',
    accuracy: 0.92,
    speed: 'standard',
    costPerRequest: 0.05,
    description: 'Balanced accuracy and speed for general use cases',
    supportedFormats: ['JPG', 'PNG', 'WEBP'],
    maxFileSize: '25MB',
    features: ['Species detection', 'Basic behavior analysis', 'Confidence scoring'],
  },
  {
    id: 'vision-lite',
    name: 'Vision Lite',
    type: 'vision',
    accuracy: 0.88,
    speed: 'fast',
    costPerRequest: 0.02,
    description: 'Fast identification for real-time applications',
    supportedFormats: ['JPG', 'PNG'],
    maxFileSize: '10MB',
    features: ['Quick species detection', 'Basic metrics'],
  },
  {
    id: 'audio-pro',
    name: 'Audio Pro',
    type: 'audio',
    accuracy: 0.94,
    speed: 'slow',
    costPerRequest: 0.08,
    description: 'Advanced sound analysis with emotional state detection',
    supportedFormats: ['MP3', 'WAV', 'M4A', 'FLAC'],
    maxFileSize: '100MB',
    features: ['Sound classification', 'Emotional analysis', 'Frequency mapping', 'Pack detection'],
  },
  {
    id: 'audio-standard',
    name: 'Audio Standard',
    type: 'audio',
    accuracy: 0.90,
    speed: 'standard',
    costPerRequest: 0.04,
    description: 'Reliable audio analysis for most use cases',
    supportedFormats: ['MP3', 'WAV', 'M4A'],
    maxFileSize: '50MB',
    features: ['Sound classification', 'Intensity analysis', 'Duration detection'],
  },
  {
    id: 'audio-lite',
    name: 'Audio Lite',
    type: 'audio',
    accuracy: 0.85,
    speed: 'fast',
    costPerRequest: 0.02,
    description: 'Fast audio processing for streaming applications',
    supportedFormats: ['MP3', 'WAV'],
    maxFileSize: '25MB',
    features: ['Quick classification', 'Basic metrics'],
  },
  {
    id: 'text-pro',
    name: 'Text Pro',
    type: 'text',
    accuracy: 0.93,
    speed: 'slow',
    costPerRequest: 0.03,
    description: 'Deep behavioral understanding from text descriptions',
    supportedFormats: ['UTF-8'],
    maxFileSize: 'No limit',
    features: ['Behavior analysis', 'Context understanding', 'Risk assessment', 'Recommendations'],
  },
  {
    id: 'text-standard',
    name: 'Text Standard',
    type: 'text',
    accuracy: 0.89,
    speed: 'standard',
    costPerRequest: 0.02,
    description: 'General purpose text analysis',
    supportedFormats: ['UTF-8'],
    maxFileSize: 'No limit',
    features: ['Behavior detection', 'Classification', 'Basic insights'],
  },
  {
    id: 'text-lite',
    name: 'Text Lite',
    type: 'text',
    accuracy: 0.85,
    speed: 'fast',
    costPerRequest: 0.01,
    description: 'Quick text analysis for high-volume processing',
    supportedFormats: ['UTF-8'],
    maxFileSize: 'No limit',
    features: ['Fast classification'],
  },
];

export default function ModelsDirectory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'vision' | 'audio' | 'text'>('all');

  const filteredModels = useMemo(() => {
    return MODELS.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(search.toLowerCase()) ||
                           model.description.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || model.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const typeIcons = {
    vision: <Eye className="w-5 h-5" />,
    audio: <Ear className="w-5 h-5" />,
    text: <FileText className="w-5 h-5" />,
  };

  const speedColors = {
    fast: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
    standard: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    slow: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Available Models
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose the right AI model for your analysis needs
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <Input
            label="Search models"
            icon={<Search className="w-5 h-5" />}
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-3 flex-wrap">
            {(['all', 'vision', 'audio', 'text']).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  typeFilter === type
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No models found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                      {typeIcons[model.type]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {model.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        ID: {model.id}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  {model.description}
                </p>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
                    <div className="flex items-center gap-1">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          style={{ width: `${model.accuracy * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white w-12">
                        {Math.round(model.accuracy * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Speed</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${speedColors[model.speed]}`}>
                      {model.speed.charAt(0).toUpperCase() + model.speed.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cost</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${model.costPerRequest}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Features
                  </h4>
                  <ul className="space-y-1">
                    {model.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">Formats</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {model.supportedFormats.join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">Max Size</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {model.maxFileSize}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

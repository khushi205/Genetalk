import { Mic, Camera, MessageCircle } from 'lucide-react';

export default function ModeSelector({ currentMode, onModeChange }) {
  const modes = [
    { id: 'audio', label: 'Audio Analysis', icon: Mic, description: 'Analyze animal sounds' },
    { id: 'image', label: 'Image Analysis', icon: Camera, description: 'Identify species visually' },
    { id: 'chat', label: 'AI Chatbot', icon: MessageCircle, description: 'Converse with AI' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              isActive
                ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div className={`inline-flex p-3 rounded-xl mb-3 ${
              isActive ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-semibold mb-1 ${
              isActive ? 'text-emerald-900' : 'text-gray-900'
            }`}>
              {mode.label}
            </h3>
            <p className="text-sm text-gray-600">{mode.description}</p>
          </button>
        );
      })}
    </div>
  );
}

import { CheckCircle, TrendingUp } from 'lucide-react';

export default function ResultCard({ species, translation, confidence, type }) {
  const getTypeColor = () => {
    switch (type) {
      case 'audio':
        return 'emerald';
      case 'image':
        return 'blue';
      case 'chat':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const color = getTypeColor();
  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className="mt-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-start gap-4 mb-4">
        <div className={`flex-shrink-0 p-3 bg-${color}-100 rounded-xl`}>
          <CheckCircle className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">Species Detected</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-700`}>
              {species}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Confidence: {confidencePercentage}%</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
              <div
                className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Translation</h4>
        <p className="text-gray-900 leading-relaxed">{translation}</p>
      </div>
    </div>
  );
}

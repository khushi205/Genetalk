import React from 'react';
import { Link } from 'react-router-dom';
import { Volume2, ImageIcon, MessageCircle, ArrowRight } from 'lucide-react';

const analysisCards = [
  {
    icon: ImageIcon,
    title: 'Image Analysis',
    description: 'Upload or capture photos to identify species and get detailed information',
    href: '/analysis/image',
    color: 'from-blue-600 to-cyan-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Volume2,
    title: 'Voice Analysis',
    description: 'Record or upload audio files to analyze animal sounds and vocalizations',
    href: '/analysis/voice',
    color: 'from-amber-600 to-orange-600',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: MessageCircle,
    title: 'Text Analysis',
    description: 'Describe animal behavior in text for detailed AI-powered insights',
    href: '/analysis/text',
    color: 'from-purple-600 to-pink-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
];

export default function AnalysisHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Analysis Type
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Select how you'd like to analyze animal communication
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {analysisCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                className="group"
              >
                <div className={`${card.bgColor} rounded-2xl p-8 h-full border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 dark:hover:border-emerald-800 cursor-pointer`}>
                  <div className={`inline-flex p-4 bg-gradient-to-br ${card.color} rounded-xl mb-6 text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {card.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {card.description}
                  </p>

                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity pointer-events-none`} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Upload or Record', description: 'Provide your audio, image, or text input' },
              { step: 2, title: 'AI Analysis', description: 'Our models process and analyze your input' },
              { step: 3, title: 'Get Results', description: 'Receive detailed species identification and insights' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

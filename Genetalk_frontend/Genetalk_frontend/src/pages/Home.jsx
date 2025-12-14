import React from 'react';
import { Link } from 'react-router-dom';
import { Volume2, ImageIcon, MessageCircle, ArrowRight, Zap, Brain, Lock } from 'lucide-react';
import Button from '../ui/button';

export default function Home() {
  const features = [
    {
      icon: Volume2,
      title: 'Audio Analysis',
      description: 'Analyze animal sounds and understand what they\'re trying to communicate',
    },
    {
      icon: ImageIcon,
      title: 'Image Recognition',
      description: 'Identify species from photos and learn their behaviors instantly',
    },
    {
      icon: MessageCircle,
      title: 'AI Chatbot',
      description: 'Have natural conversations with AI-powered animal perspectives',
    },
  ];

  const benefits = [
    { icon: Zap, title: 'Lightning Fast', description: 'Real-time analysis powered by advanced AI' },
    { icon: Brain, title: 'Accurate', description: 'High-precision species identification and translation' },
    { icon: Lock, title: 'Secure', description: 'Your data is protected with enterprise-grade security' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-8 inline-block">
          <div className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Bridge the gap between species
            </p>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Speak with Any <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Species</span>
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          GeneTalk uses cutting-edge AI to translate animal communications. Analyze sounds, identify species from images, and have conversations across the animal kingdom.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link to="/analysis">
            <Button size="lg" className="group">
              Start Analyzing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/analysis">
            <Button variant="outline" size="lg">
              Explore Models
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group bg-white dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="inline-flex p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                  <Icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Why Choose GeneTalk?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center">
                  <div className="inline-flex p-4 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl mb-4">
                    <Icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Translate?</h2>
          <p className="text-lg mb-8 text-emerald-50 max-w-xl mx-auto">
            Join thousands of nature enthusiasts and scientists exploring animal communication
          </p>
          <Link to="/analysis">
            <Button variant="ghost" size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

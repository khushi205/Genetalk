import React, { useState } from 'react';
// removed unused Loader2 import
import Button from '../ui/button';
import Textarea from '../ui/textarea';
import Dropdown from '../ui/dropdown';
import ResultsDisplay from '../components/ResultsDisplay';
import { useToast } from '../lib/toast-context';
import axios from "axios";


const MODELS = [
  { value: 'text-pro', label: 'Text Pro (Recommended)' },
  { value: 'text-standard', label: 'Text Standard' },
  { value: 'text-lite', label: 'Text Lite (Fast)' },
];

export default function TextAnalysisPage() {
  const [text, setText] = useState('');
  const [model, setModel] = useState('text-pro');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const { addToast } = useToast();

  const tokenCount = text.split(/\s+/).filter(w => w).length;
  const maxTokens = 2000;

  const handleAnalyze = async () => {
    if (!text.trim()) {
      addToast('Please enter some text', 'error');
      return;
    }

    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const { data } = await axios.post(`${import.meta.env.VITE_CHATBOT_URL}/chat`, {
        message: text,
      })

      
      // const { data } = await axios.post("http://127.0.0.1:8002/chat", {
      //   message: text,
      // })

      console.log("API Response:", data.reply)

      // ✅ Store response in message (not reply)
      setResult({
        message: data.reply || "No response received from the server.",
      })

      addToast('Analysis complete!', 'success');
    } catch (error) {
      addToast('Analysis failed', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  const exampleTexts = [
    'A pack of wolves howling at night, moving in coordinated patterns through the forest',
    'A cat arching its back, hissing with ears flattened against its head',
    'An elephant trumpeting loudly, ears spread wide, moving protectively around smaller elephants',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Text Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Describe animal behavior to get AI-powered insights
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8">
          <div className="mb-6">
            <Textarea
              label="Describe the animal behavior"
              placeholder="Describe what you observe about the animal's actions, sounds, and behavior..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={maxTokens * 4}
              counter
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Tokens: {tokenCount} / ~{maxTokens}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Select AI Model
            </label>
            <Dropdown
              value={model}
              onChange={(e) => setModel(e.target.value)}
              options={MODELS}
            />
          </div>

          <div className="flex gap-3 mb-8">
            <Button
              size="lg"
              onClick={handleAnalyze}
              loading={isAnalyzing}
              disabled={!text.trim()}
              fullWidth
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Behavior'}
            </Button>
            {result && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleClear}
              >
                Clear
              </Button>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Try an example:
            </p>
            <div className="space-y-2">
              {exampleTexts.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setText(example)}
                  className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm text-gray-600 dark:text-gray-300"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div className="mb-8">
            <ResultsDisplay
              title="Analysis Results"
              description={`Analyzed with ${MODELS.find(m => m.value === model)?.label}`}
              highlights={[
                // { label: 'Analysis Type', value: result.type, type: 'success' },
                // { label: 'Animal Type', value: result.animalType, type: 'success' },
                // { label: 'Confidence', value: ${Math.round(result.confidence * 100)}%, type: 'success' },
                // { label: 'Emotion', value: result.emotion, type: 'info' },
              ]}
              fullContent={
                <div className="space-y-4">
                  <div>
                    {/* <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Detected Behaviors
                    </h4> */}
                    {/* <div className="flex flex-wrap gap-2">
                      {result.behaviors.map((behavior, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium"
                        >
                          {behavior}
                        </span>
                      ))}
                    </div> */}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Insights
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {result.message}
                    </p>
                  </div>

                  {/* <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                 </div> */}
                </div>
              }
            />

            <Button
              variant="outline"
              fullWidth
              onClick={handleClear}
              className="mt-6"
            >
              Analyze Another Behavior
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
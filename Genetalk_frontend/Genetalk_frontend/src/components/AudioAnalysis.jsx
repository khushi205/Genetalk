import { useState, useRef } from 'react';
import { Mic, Upload, Loader2, Volume2, StopCircle } from 'lucide-react';

export default function AudioAnalysis({ onAnalyze, isAnalyzing }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onAnalyze(file);
    }
  };

  const analyzeRecording = () => {
    if (audioBlob) {
      const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      onAnalyze(file);
      setAudioBlob(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-emerald-100 rounded-full mb-4">
          <Volume2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Audio Analysis</h2>
        <p className="text-gray-600">Record or upload animal sounds for translation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold text-gray-900 mb-2">Upload Audio</h3>
          <p className="text-sm text-gray-600 mb-4">Support for MP3, WAV, M4A</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Choose File
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
          <Mic className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold text-gray-900 mb-2">Record Audio</h3>
          <p className="text-sm text-gray-600 mb-4">Live recording from microphone</p>
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              disabled={isAnalyzing}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Start Recording
            </button>
          )}
          {isRecording && (
            <button
              onClick={stopRecording}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2 mx-auto"
            >
              <StopCircle className="w-4 h-4" />
              Stop Recording
            </button>
          )}
          {audioBlob && !isRecording && (
            <button
              onClick={analyzeRecording}
              disabled={isAnalyzing}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Analyze Recording
            </button>
          )}
        </div>
      </div>

      {isAnalyzing && (
        <div className="flex items-center justify-center gap-3 text-emerald-600 p-6 bg-emerald-50 rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium">Analyzing audio...</span>
        </div>
      )}
    </div>
  );
}

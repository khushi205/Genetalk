import React, { useState, useRef } from 'react';
import { Mic, Upload, Loader2, X, Play, Pause } from 'lucide-react';
import Button from '../ui/button';
import Dropdown from '../ui/dropdown';
import ResultsDisplay from '../components/ResultsDisplay';
import { useToast } from '../lib/toast-context';
import axios from 'axios';

const MODELS = [
  { value: 'audio-pro', label: 'Audio Pro (Recommended)' },
  { value: 'audio-standard', label: 'Audio Standard' },
  { value: 'audio-lite', label: 'Audio Lite (Fast)' },
];

export default function VoiceAnalysisPage() {
  const [model, setModel] = useState('audio-pro');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Feedback Form State
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    rating: 0,
    message: ""
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    addToast("Thank you for your feedback! 😊", "success");
    setFeedbackSubmitted(true);

    setFeedback({
      name: "",
      email: "",
      rating: 0,
      message: ""
    });
  };

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const { addToast } = useToast();

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
      setRecordingTime(0);
      setResult(null);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      addToast('Recording started', 'info');
    } catch (error) {
      addToast('Could not access microphone', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      addToast('Recording stopped', 'info');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        addToast('File size must be less than 25MB', 'error');
        return;
      }

      const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/aiff",
        "audio/x-aiff"
      ]

      const fileExtension = file.name.split(".").pop()?.toLowerCase()

      if (
        !allowedTypes.includes(file.type) &&
        !["mp3", "wav", "aif", "aiff"].includes(fileExtension || "")
      ) {
        addToast("❌ Only .mp3, .wav, or .aif audio files are allowed.", 'error')
        event.target.value = ""
        setAudioBlob(null)
        return
      }

      setAudioBlob(file);
      setResult(null);
      addToast('Audio file loaded', 'success');
    }
  };

  const handleAnalyze = async () => {
    if (!audioBlob) {
      addToast('Please record or upload audio first', 'error');
      return;
    }

    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const formData = new FormData()
      formData.append("file", audioBlob)

      const response = await axios.post(
        `${import.meta.env.VITE_AUDIO_URL}/audio_predict`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      const data = response.data

      setResult({
        species: data.species || "Unknown",
        emotion: data.emotion || "Unknown",
        confidence: Math.round(
          ((data.species_confidence + data.emotion_confidence) / 2) * 100
        ),
        behavior: `Species confidence: ${(data.species_confidence * 100).toFixed(
          1
        )}%. Emotion confidence: ${(data.emotion_confidence * 100).toFixed(1)}%.`,
      })

      addToast('Analysis complete!', 'success');
    } catch (error) {
      addToast('Analysis failed', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setAudioBlob(null);
    setResult(null);
    setRecordingTime(0);
    setIsPlaying(false);
    setFeedbackSubmitted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Voice Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record or upload audio to analyze animal sounds
          </p>
        </div>

        {!audioBlob && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Recording Block */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6">
                <div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Record Audio
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Record up to 5 minutes
                </p>

                {!isRecording ? (
                  <Button size="lg" onClick={startRecording} fullWidth>
                    Start Recording
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {formatTime(recordingTime)}
                    </div>
                    <Button
                      variant="danger"
                      size="lg"
                      onClick={stopRecording}
                      fullWidth
                    >
                      Stop Recording
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Block */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-500 transition-all cursor-pointer text-center"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Upload Audio
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                MP3, WAV, AIF (max 25MB)
              </p>
            </div>
          </div>
        )}

        {/* Analysis Section */}
        {audioBlob && !result && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8">
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <audio
                ref={audioRef}
                src={URL.createObjectURL(audioBlob)}
                onEnded={() => setIsPlaying(false)}
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {audioBlob instanceof File ? audioBlob.name : "Recorded Audio"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Size: {(audioBlob.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
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

            <Button
              size="lg"
              onClick={handleAnalyze}
              loading={isAnalyzing}
              fullWidth
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Audio"}
            </Button>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="mb-8">
            <ResultsDisplay
              title="Audio Analysis Results"
              description={`Analyzed with ${MODELS.find(m => m.value === model)?.label}`}
              highlights={[
                { label: "Species", value: result.species, type: "success" },
                { label: "Sound Type", value: result.emotion, type: "success" },
                { label: "Confidence", value: `${result.confidence}%`, type: "success" },
              ]}
              fullContent={
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Emotional State
                      </p>
                      <p className="text-sm capitalize font-semibold text-gray-900 dark:text-white mt-1">
                        {result.emotion}
                      </p>
                    </div>
                  </div>
                </div>
              }
            />

            <Button
              variant="outline"
              fullWidth
              onClick={handleClear}
              className="mt-6"
            >
              Analyze Another Audio
            </Button>

            {/* ------------ FEEDBACK FORM SECTION ------------ */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mt-8 border border-gray-300 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Share Your Feedback
              </h2>

              {!feedbackSubmitted ? (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">

                  {/* Name */}
                  <div>
                    <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      value={feedback.name}
                      onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                      className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={feedback.email}
                      onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                      className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedback({ ...feedback, rating: star })}
                          className={`p-2 text-xl ${
                            feedback.rating >= star
                              ? "text-amber-500"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                      Message
                    </label>
                    <textarea
                      value={feedback.message}
                      onChange={(e) =>
                        setFeedback({ ...feedback, message: e.target.value })
                      }
                      className="w-full p-3 h-24 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500"
                      placeholder="Write your feedback..."
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <Button fullWidth size="lg" type="submit">
                    Submit Feedback
                  </Button>
                </form>
              ) : (
                <div className="text-green-600 font-medium text-center">
                  🎉 Thanks for your feedback!
                </div>
              )}
            </div>
            {/* ------------ END FEEDBACK FORM ------------ */}
          </div>
        )}
      </div>
    </div>
  );
}

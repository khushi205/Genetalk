import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import Button from '../ui/button';
import Dropdown from '../ui/dropdown';
import ResultsDisplay from '../components/ResultsDisplay';
import { useToast } from '../lib/toast-context';

const MODELS = [
    { value: 'vision-pro', label: 'Vision Pro (Recommended)' },
    { value: 'vision-standard', label: 'Vision Standard' },
    { value: 'vision-lite', label: 'Vision Lite (Fast)' },
];

export default function ImageAnalysisPage() {

   


    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [model, setModel] = useState('vision-pro');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const { addToast } = useToast();

    // ⭐ Feedback State
    const [feedback, setFeedback] = useState({
        name: "",
        email: "",
        rating: 0,
        message: ""
    });
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    // ⭐ Handle Feedback Submit
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

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                addToast('File size must be less than 10MB', 'error');
                return;
            }
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreview(url);
            setResult(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-900/20');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-900/20');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-900/20');
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            setFile(droppedFile);
            const url = URL.createObjectURL(droppedFile);
            setPreview(url);
            setResult(null);
        } else {
            addToast('Please drop an image file', 'error');
        }
    };

    const startCamera = async () => {
        try {

             if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    addToast("Camera not supported on this device/browser.", "error");
}
            // Ask permission FIRST (fix for Chrome & mobile)
            await navigator.mediaDevices.getUserMedia({ video: true });

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" }   // fallback if environment is blocked
                }
            });

            streamRef.current = stream;

            // Wait a micro delay so that videoRef is mounted in DOM
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);

            setIsCameraActive(true);
        } catch (err) {
            console.error(err);
            addToast("Camera access denied or not available.", "error");
        }
    };


    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsCameraActive(false);
    };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
        if (!blob) return;

        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);

        setFile(file);
        setPreview(url);

        stopCamera();
        addToast("Photo captured successfully!", "success");
    }, "image/jpeg");
};


    const handleAnalyze = async () => {
        if (!file) {
            addToast('Please select an image first', 'error');
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setIsAnalyzing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const response = await fetch(`${import.meta.env.VITE_IMAGE_URL}/predict`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

            const data = await response.json();

            setResult({
                species: data.filename?.split(".")[0] || "Unknown",
                emotion: data.predicted_emotion || "Not detected",
                confidence: data.confidence ? Math.round(data.confidence * 100) : undefined,
                behavior: `The detected emotion is ${data.predicted_emotion}, with ${Math.round(
                    data.confidence * 100
                )}% confidence.`,
            });

            addToast('Analysis complete!', 'success');
        } catch (error) {
            addToast('Analysis failed', 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearPreview = () => {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setFile(null);
        setResult(null);
        setFeedbackSubmitted(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Image Analysis
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Upload or capture a photo to identify species
                    </p>
                </div>

                {/* Upload and Camera */}
                {!preview && !isCameraActive && (
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Upload Box */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:border-emerald-500 transition-all cursor-pointer bg-white dark:bg-gray-800"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Upload Image
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Drag and drop or click to select
                            </p>
                        </div>

                        {/* Camera Box */}
                        <div
                            onClick={startCamera}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:border-emerald-500 transition-all cursor-pointer bg-white dark:bg-gray-800"
                        >
                            <div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Camera className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                Capture Photo
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Use your device camera
                            </p>
                        </div>
                    </div>
                )}

                {/* Camera Active */}
                {isCameraActive && (
                    <div className="relative rounded-2xl overflow-hidden mb-8 bg-black">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-96 object-cover"
                        />

                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                            <Button size="lg" onClick={capturePhoto}>
                                Capture Photo
                            </Button>
                            <Button variant="outline" size="lg" onClick={stopCamera}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Preview */}
                {preview && (
                    <div className="relative mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <img src={preview} alt="Preview" className="w-full max-h-96 object-contain rounded-xl mx-auto" />
                        <button
                            onClick={clearPreview}
                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Model Select + Analyze Button */}
                {preview && !result && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8">
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

                        <div className="flex gap-3">
                            <Button size="lg" onClick={handleAnalyze} loading={isAnalyzing} fullWidth>
                                {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                            </Button>
                            <Button variant="outline" size="lg" onClick={clearPreview} disabled={isAnalyzing}>
                                Clear
                            </Button>
                        </div>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="mb-8">
                        <ResultsDisplay
                            title="Species Detected"
                            description={`Analyzed with ${MODELS.find(m => m.value === model)?.label}`}
                            highlights={[
                                { label: 'Primary Species', value: result.species, type: 'success' },
                                { label: 'Emotion', value: result.emotion, type: 'info' },
                                { label: 'Confidence', value: `${result.confidence}%`, type: 'success' },
                                { label: 'Behavior', value: result.behavior, type: 'info' },
                            ]}
                            fullContent={
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Detected Species
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                                            {result?.species}
                                        </span>
                                    </div>
                                </div>
                            }
                        />

                        <Button variant="outline" fullWidth onClick={clearPreview} className="mt-6">
                            Analyze Another Image
                        </Button>
                    </div>
                )}

                {/* ⭐ FEEDBACK FORM ⭐ */}
                {result && (
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
                                        onChange={(e) =>
                                            setFeedback({ ...feedback, name: e.target.value })
                                        }
                                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500"
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
                                        onChange={(e) =>
                                            setFeedback({ ...feedback, email: e.target.value })
                                        }
                                        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500"
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
                                                onClick={() =>
                                                    setFeedback({ ...feedback, rating: star })
                                                }
                                                className={`p-2 text-xl ${feedback.rating >= star
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
                                        required
                                    />
                                </div>

                                <Button type="submit" fullWidth size="lg">
                                    Submit Feedback
                                </Button>
                            </form>
                        ) : (
                            <div className="text-green-600 font-medium text-center">
                                🎉 Thank you for your feedback!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

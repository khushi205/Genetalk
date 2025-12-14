import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';

export default function ImageAnalysis({ onAnalyze, isAnalyzing }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onAnalyze(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            stopCamera();
            onAnalyze(file);
          }
        }, 'image/jpeg');
      }
    }
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
          <ImageIcon className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Image Analysis</h2>
        <p className="text-gray-600">Upload or capture images of animals for identification</p>
      </div>

      {!isCameraActive && !previewUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900 mb-2">Upload Image</h3>
            <p className="text-sm text-gray-600 mb-4">Support for JPG, PNG, WEBP</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Choose File
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900 mb-2">Capture Photo</h3>
            <p className="text-sm text-gray-600 mb-4">Use your device camera</p>
            <button
              onClick={startCamera}
              disabled={isAnalyzing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Open Camera
            </button>
          </div>
        </div>
      )}

      {isCameraActive && (
        <div className="relative rounded-xl overflow-hidden mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-h-96 object-cover rounded-xl"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={capturePhoto}
              className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium shadow-lg"
            >
              Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors font-medium shadow-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-96 object-contain rounded-xl mb-4"
          />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex items-center justify-center gap-3 text-blue-600 p-6 bg-blue-50 rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium">Analyzing image...</span>
        </div>
      )}
    </div>
  );
}

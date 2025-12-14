import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/theme-context';
import { ToastProvider } from './lib/toast-context';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AnalysisHub from './pages/AnalysisHub';
import ImageAnalysisPage from './pages/ImageAnalysis';
import TextAnalysisPage from './pages/TextAnalysis';
import VoiceAnalysisPage from './pages/VoiceAnalysis';
import ModelsDirectory from './pages/ModelsDirectory';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analysis" element={<AnalysisHub />} />
              <Route path="/analysis/image" element={<ImageAnalysisPage />} />
              <Route path="/analysis/text" element={<TextAnalysisPage />} />
              <Route path="/analysis/voice" element={<VoiceAnalysisPage />} />
              <Route path="/models" element={<ModelsDirectory />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

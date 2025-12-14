import { Dna } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl">
            <Dna className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">GeneTalk</h1>
            <p className="text-emerald-50 text-sm">AI-Powered Universal Species Translator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

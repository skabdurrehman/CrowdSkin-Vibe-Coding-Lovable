
import React, { useState } from 'react';

interface QuietBloomProps {
  isOpen: boolean;
  onClose: () => void;
  onDropThought: (thought: string) => void;
}

export const QuietBloom = ({ isOpen, onClose, onDropThought }: QuietBloomProps) => {
  const [rawThought, setRawThought] = useState('');
  const [isComposting, setIsComposting] = useState(false);

  const handleDrop = () => {
    if (rawThought.trim()) {
      setIsComposting(true);
      setTimeout(() => {
        onDropThought(rawThought);
        setRawThought('');
        setIsComposting(false);
        setTimeout(onClose, 2000);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white backdrop-blur rounded-3xl p-8 max-w-md w-full animate-fade-in border border-gray-700">
        {isComposting ? (
          <div className="text-center space-y-6">
            <div className="text-4xl animate-pulse">🍄</div>
            <h3 className="text-xl font-light">
              Becoming roots...
            </h3>
            <p className="text-gray-300">
              Even dark thoughts can nurture gentle growth.
            </p>
            <div className="flex justify-center space-x-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-gray-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light mb-2">
                Quiet Bloom
              </h2>
              <p className="text-gray-400 text-sm">
                Drop your raw thoughts into the soil. They won't become leaves—they become roots.
              </p>
            </div>

            <textarea
              value={rawThought}
              onChange={(e) => setRawThought(e.target.value)}
              placeholder="I hate how I look today... I feel so disconnected... Nothing feels right..."
              className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-white placeholder-gray-400"
              style={{ fontFamily: 'inherit' }}
            />

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleDrop}
                disabled={!rawThought.trim()}
                className={`flex-1 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  rawThought.trim()
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                Bury in soil
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-400 hover:text-gray-300 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

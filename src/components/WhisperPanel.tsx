
import React, { useState } from 'react';

interface WhisperPanelProps {
  onWhisper: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const WhisperPanel = ({ onWhisper, isOpen, onClose }: WhisperPanelProps) => {
  const [whisperText, setWhisperText] = useState('');
  const [isComposting, setIsComposting] = useState(false);

  const handleRelease = () => {
    if (whisperText.trim()) {
      setIsComposting(true);
      setTimeout(() => {
        onWhisper(whisperText);
        setWhisperText('');
        setIsComposting(false);
        setTimeout(onClose, 1000);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-sage-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur rounded-3xl p-8 max-w-md w-full animate-fade-in">
        {isComposting ? (
          <div className="text-center space-y-6">
            <div className="text-4xl animate-pulse">🌱</div>
            <h3 className="text-xl font-light text-sage-800">
              Composting...
            </h3>
            <p className="text-sage-600">
              Your words are becoming nourishment for your tree.
            </p>
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-sage-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-sage-800 mb-2">
                Whisper Panel
              </h2>
              <p className="text-sage-600 text-sm">
                Release what feels heavy. These words will nourish your tree's soil.
              </p>
            </div>

            <textarea
              value={whisperText}
              onChange={(e) => setWhisperText(e.target.value)}
              placeholder="I feel so disconnected today... The mirror felt cruel... I wish I could see myself differently..."
              className="w-full h-32 p-4 bg-sage-50 border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300 text-sage-800 placeholder-sage-400"
              style={{ fontFamily: 'inherit' }}
            />

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleRelease}
                disabled={!whisperText.trim()}
                className={`flex-1 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  whisperText.trim()
                    ? 'bg-sage-600 hover:bg-sage-700 text-white'
                    : 'bg-sage-200 text-sage-400 cursor-not-allowed'
                }`}
              >
                Compost into soil
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-3 text-sage-600 hover:text-sage-700 transition-all duration-300"
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

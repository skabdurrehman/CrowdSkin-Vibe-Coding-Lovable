
import React, { useState, useEffect } from 'react';

export const MirrorMode = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [tapCount, setTapCount] = useState(0);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const affirmations = [
    "You are still sacred, even when you feel disconnected.",
    "Even a foggy mirror reflects light.",
    "Your worth isn't reflected in glass—it lives in your being.",
    "This feeling will pass, like clouds across the sky.",
    "You are more than what you see. You are what you feel, think, and give.",
    "The mirror shows one moment. You contain multitudes.",
    "Breathe. You are here. You are enough.",
    "Your body is home to a beautiful mind and spirit."
  ];

  useEffect(() => {
    if (isActive) {
      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      setCurrentAffirmation(randomAffirmation);
    }
  }, [isActive]);

  useEffect(() => {
    if (tapCount === 2) {
      setEmergencyMode(true);
      setTapCount(0);
    }
    const timer = setTimeout(() => setTapCount(0), 1000);
    return () => clearTimeout(timer);
  }, [tapCount]);

  const handleScreenTap = () => {
    setTapCount(prev => prev + 1);
  };

  if (emergencyMode) {
    return (
      <div className="fixed inset-0 bg-sage-800/95 backdrop-blur-lg z-50 flex items-center justify-center p-6">
        <div className="text-center text-white space-y-6 max-w-md">
          <div className="text-4xl mb-4">🌸</div>
          <h2 className="text-2xl font-light">You're safe here</h2>
          <div className="space-y-4">
            <p className="text-lg">Let's breathe together</p>
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full animate-pulse"></div>
            <p className="text-sm opacity-80">Breathe in... breathe out...</p>
          </div>
          <button
            onClick={() => setEmergencyMode(false)}
            className="mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all duration-300"
          >
            I'm feeling calmer
          </button>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div 
        className="fixed inset-0 bg-gradient-to-br from-sage-100/90 to-lavender-100/90 backdrop-blur-xl z-40 flex items-center justify-center p-6"
        onClick={handleScreenTap}
      >
        <div className="text-center text-sage-800 space-y-6 max-w-md">
          <div className="text-3xl mb-4">✨</div>
          <p className="text-xl font-light leading-relaxed">
            {currentAffirmation}
          </p>
          <p className="text-sm text-sage-600 mt-8">
            Tap twice quickly if you need extra support
          </p>
          <button
            onClick={() => setIsActive(false)}
            className="mt-8 px-6 py-3 bg-sage-600/80 hover:bg-sage-700/80 text-white rounded-2xl transition-all duration-300"
          >
            Exit Mirror Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-light text-sage-800 mb-4">
          Mirror Mode
        </h2>
        
        <div className="bg-white/50 backdrop-blur rounded-3xl p-8 space-y-6">
          <div className="text-4xl">🪞</div>
          <p className="text-sage-700 leading-relaxed">
            When facing your reflection feels challenging, activate Mirror Mode to overlay gentle affirmations and support.
          </p>
          
          <div className="space-y-3 text-sm text-sage-600">
            <p>• Soft blur reduces harsh focus</p>
            <p>• Gentle affirmations appear</p>
            <p>• Double-tap for emergency support</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsActive(true)}
          className="w-full py-4 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl transition-all duration-300 font-medium"
        >
          Activate Mirror Mode
        </button>
        
        <p className="text-xs text-sage-500 leading-relaxed">
          Use this when you're about to look in a mirror and want gentle support. The overlay will help soften the experience.
        </p>
      </div>
    </div>
  );
};

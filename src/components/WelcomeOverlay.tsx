
import React, { useState } from 'react';

interface WelcomeOverlayProps {
  onComplete: () => void;
}

export const WelcomeOverlay = ({ onComplete }: WelcomeOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to CrowdSkin",
      content: "This isn't about how you look. It's about how you feel you look, and how those feelings shift, tangle, or soften over time."
    },
    {
      title: "No photos, no mirrors",
      content: "Instead, we'll help you sketch your self-perception using feelings, colors, and gentle awareness. Your inner experience is what matters here."
    },
    {
      title: "Your perception tree",
      content: "Each reflection becomes a leaf on your personal tree of awareness. Watch patterns emerge as you grow in understanding yourself."
    },
    {
      title: "Safe spaces",
      content: "Mirror Mode offers gentle support when facing reflections feels hard. The Dump Zone gives you space to release difficult thoughts without judgment."
    },
    {
      title: "You are already whole",
      content: "CrowdSkin isn't here to fix you. You're here to soften your mind, witness your perception, and reclaim the inner mirror—the one that matters most."
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipAll = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-sage-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur rounded-3xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-sage-600' : 'bg-sage-200'
                }`}
              />
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-light text-sage-800 mb-4">
          {steps[currentStep].title}
        </h2>
        
        <p className="text-sage-600 leading-relaxed mb-8 text-lg">
          {steps[currentStep].content}
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={nextStep}
            className="px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl transition-all duration-300 font-medium"
          >
            {currentStep < steps.length - 1 ? 'Continue' : 'Begin your journey'}
          </button>
          
          <button
            onClick={skipAll}
            className="px-6 py-2 text-sage-500 hover:text-sage-600 transition-all duration-300 text-sm"
          >
            Skip introduction
          </button>
        </div>
      </div>
    </div>
  );
};

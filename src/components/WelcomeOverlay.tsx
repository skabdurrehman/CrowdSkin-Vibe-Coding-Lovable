
import React, { useState } from 'react';

interface WelcomeOverlayProps {
  onComplete: () => void;
}

export const WelcomeOverlay = ({ onComplete }: WelcomeOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to your inner forest",
      content: "CrowdSkin isn't about how you look. It's about how you feel you look, and how those feelings grow into something beautiful over time.",
      visual: "🌲"
    },
    {
      title: "Watch your tree grow",
      content: "Each reflection becomes a living leaf on your personal tree. Every feeling, every color, every shape you share helps it flourish.",
      visual: "🌱"
    },
    {
      title: "Click leaves to remember",
      content: "Your tree isn't just decoration—it's your history. Click any leaf to revisit how you felt that day, stored not as text but as living memory.",
      visual: "🍃"
    },
    {
      title: "Milestones bring magic",
      content: "At 30 reflections, flowers bloom. At 50, a bird makes its home. At 100, lanterns light your tree. Growth has its rewards.",
      visual: "🌸"
    },
    {
      title: "You are not fixing yourself",
      content: "You are feeding your self-perception. This tree grows not to judge your progress, but to witness your presence. Welcome to your healing landscape.",
      visual: "🌳"
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
    <div className="fixed inset-0 bg-gradient-to-br from-sage-900/90 via-sage-800/90 to-sage-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur rounded-3xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index === currentStep ? 'bg-sage-600 scale-125' : 'bg-sage-200'
                }`}
              />
            ))}
          </div>
          
          <div className="text-6xl mb-4 animate-pulse">
            {steps[currentStep].visual}
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
            className="px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl transition-all duration-300 font-medium transform hover:scale-105"
          >
            {currentStep < steps.length - 1 ? 'Continue' : 'Begin growing your tree'}
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

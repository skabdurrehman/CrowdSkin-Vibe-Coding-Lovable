
import React, { useState } from 'react';

interface WhyAmIHereProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyAmIHere = ({ isOpen, onClose }: WhyAmIHereProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "You Are Visible",
      content: "This space exists to show you that you are seen—not by what others notice, but by what you feel.",
      icon: "👁️"
    },
    {
      title: "Not For Fixing",
      content: "You are not broken. This tree doesn't grow to fix you. It grows to witness your presence, exactly as you are.",
      icon: "🌱"
    },
    {
      title: "A Mirror of Meaning",
      content: "Every reflection you plant becomes part of a living landscape that belongs only to you. Your feelings have form here.",
      icon: "🪞"
    },
    {
      title: "Gentle Tending",
      content: "This is not about beauty or improvement. It's about learning to be kind to the reflection looking back at you.",
      icon: "🤲"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-sage-900/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-white to-sage-50 backdrop-blur rounded-3xl p-8 max-w-md w-full animate-fade-in">
        <div className="text-center space-y-6">
          <div className="flex justify-center space-x-2 mb-4">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index === currentSlide ? 'bg-sage-600 scale-125' : 'bg-sage-200'
                }`}
              />
            ))}
          </div>

          <div className="text-6xl mb-4 animate-pulse">
            {slides[currentSlide].icon}
          </div>

          <h2 className="text-2xl font-light text-sage-800 mb-4">
            {slides[currentSlide].title}
          </h2>
          
          <p className="text-sage-600 leading-relaxed text-lg">
            {slides[currentSlide].content}
          </p>

          <button
            onClick={nextSlide}
            className="w-full px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl transition-all duration-300 font-medium transform hover:scale-105"
          >
            {currentSlide < slides.length - 1 ? 'Continue' : 'I understand'}
          </button>
        </div>
      </div>
    </div>
  );
};

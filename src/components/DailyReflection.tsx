
import React, { useState } from 'react';

export const DailyReflection = () => {
  const [responses, setResponses] = useState({
    shape: '',
    color: '',
    focus: ''
  });
  const [currentStep, setCurrentStep] = useState(0);

  const questions = [
    {
      key: 'shape',
      question: "What shape do you feel like today?",
      placeholder: "Soft and rounded... angular and sharp... flowing like water...",
      description: "There's no right answer. Just notice what feels true."
    },
    {
      key: 'color',
      question: "What color are you carrying today?",
      placeholder: "Muted blue... vibrant orange... cloudy grey...",
      description: "Colors hold feelings. What's yours saying?"
    },
    {
      key: 'focus',
      question: "Which part of you feels loudest right now?",
      placeholder: "My shoulders feel heavy... my face feels visible... my stomach feels tight...",
      description: "Just notice without trying to change anything."
    }
  ];

  const currentQuestion = questions[currentStep];

  const handleResponseChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.key]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateSketch();
    }
  };

  const generateSketch = () => {
    // Save the reflection and show generated sketch
    console.log('Generating sketch from:', responses);
    // This would create the abstract visualization
  };

  const canProceed = responses[currentQuestion.key].trim().length > 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentStep ? 'bg-sage-600' : 
                  index < currentStep ? 'bg-sage-400' : 'bg-sage-200'
                }`}
              />
            ))}
          </div>
          <h2 className="text-xl md:text-2xl font-light text-sage-800 mb-2">
            {currentQuestion.question}
          </h2>
          <p className="text-sage-600 text-sm">
            {currentQuestion.description}
          </p>
        </div>

        <div className="space-y-4">
          <textarea
            value={responses[currentQuestion.key]}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full h-32 p-4 bg-white/70 backdrop-blur border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300 text-sage-800 placeholder-sage-400"
            style={{ fontFamily: 'inherit' }}
          />
          
          <button
            onClick={nextStep}
            disabled={!canProceed}
            className={`w-full py-3 rounded-2xl font-medium transition-all duration-300 ${
              canProceed
                ? 'bg-sage-600 hover:bg-sage-700 text-white'
                : 'bg-sage-200 text-sage-400 cursor-not-allowed'
            }`}
          >
            {currentStep < questions.length - 1 ? 'Continue' : 'Create my sketch'}
          </button>
        </div>

        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className="w-full py-2 text-sage-500 hover:text-sage-600 transition-all duration-300 text-sm"
          disabled={currentStep === 0}
        >
          {currentStep > 0 && 'Go back'}
        </button>
      </div>
    </div>
  );
};

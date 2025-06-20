
import React, { useState } from 'react';
import { useTreeGrowth } from '../hooks/useTreeGrowth';
import { Reflection } from '../types/tree';

export const DailyReflection = () => {
  const { addReflection } = useTreeGrowth();
  const [responses, setResponses] = useState({
    mood: '',
    shape: '',
    color: '',
    intensity: 5,
    notes: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const moods = [
    { id: 'peaceful', emoji: '😌', name: 'Peaceful' },
    { id: 'anxious', emoji: '😰', name: 'Anxious' },
    { id: 'heavy', emoji: '😔', name: 'Heavy' },
    { id: 'disconnected', emoji: '😶', name: 'Disconnected' },
    { id: 'overwhelmed', emoji: '😵', name: 'Overwhelmed' },
    { id: 'hopeful', emoji: '🌱', name: 'Hopeful' },
    { id: 'frustrated', emoji: '😤', name: 'Frustrated' },
    { id: 'gentle', emoji: '🕊️', name: 'Gentle' }
  ];

  const shapes = [
    { id: 'circle', name: '○ Soft circle', description: 'Flowing and complete' },
    { id: 'triangle', name: '△ Sharp triangle', description: 'Pointed and tense' },
    { id: 'oval', name: '◯ Gentle oval', description: 'Stretched but soft' },
    { id: 'diamond', name: '◊ Rigid diamond', description: 'Angular and precise' },
    { id: 'star', name: '✦ Radiating star', description: 'Reaching outward' }
  ];

  const colors = [
    { id: 'sage', name: 'Sage green', description: 'Calm and grounding' },
    { id: 'blue', name: 'Ocean blue', description: 'Deep and quiet' },
    { id: 'gray', name: 'Storm gray', description: 'Heavy and clouded' },
    { id: 'yellow', name: 'Warm yellow', description: 'Bright but anxious' },
    { id: 'red', name: 'Fire red', description: 'Intense and burning' },
    { id: 'purple', name: 'Soft purple', description: 'Mysterious and gentle' },
    { id: 'orange', name: 'Sunset orange', description: 'Energetic and restless' }
  ];

  const steps = [
    { key: 'mood', title: 'How does your inner landscape feel today?', options: moods },
    { key: 'shape', title: 'What shape holds your energy right now?', options: shapes },
    { key: 'color', title: 'What color tones are you carrying?', options: colors }
  ];

  const currentStepData = steps[currentStep];

  const handleSelection = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentStepData.key]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Move to intensity and notes
      setCurrentStep(steps.length);
    }
  };

  const generateLeaf = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newReflection: Reflection = {
        id: `reflection-${Date.now()}`,
        date: new Date().toISOString(),
        mood: responses.mood,
        shape: responses.shape,
        color: responses.color,
        intensity: responses.intensity,
        notes: responses.notes
      };

      addReflection(newReflection);
      setIsGenerating(false);
      
      // Reset form
      setResponses({
        mood: '',
        shape: '',
        color: '',
        intensity: 5,
        notes: ''
      });
      setCurrentStep(0);
    }, 2000);
  };

  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl animate-bounce">🌱</div>
          <h3 className="text-2xl font-light text-sage-800">
            Growing your leaf...
          </h3>
          <p className="text-sage-600">
            Your reflection is becoming part of your tree.
          </p>
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-sage-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const canProceed = responses[currentStepData?.key] || currentStep >= steps.length;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentStep ? 'bg-sage-600' : 
                  index < currentStep ? 'bg-sage-400' : 'bg-sage-200'
                }`}
              />
            ))}
          </div>
          
          {currentStep < steps.length ? (
            <>
              <h2 className="text-xl md:text-2xl font-light text-sage-800 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-sage-600 text-sm">
                Choose what feels truest right now.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-light text-sage-800 mb-2">
                How intense is this feeling?
              </h2>
              <p className="text-sage-600 text-sm">
                Fine-tune your reflection.
              </p>
            </>
          )}
        </div>

        {currentStep < steps.length ? (
          <div className="grid grid-cols-1 gap-3">
            {currentStepData.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelection(option.id)}
                className={`p-4 rounded-2xl transition-all duration-300 text-left ${
                  responses[currentStepData.key] === option.id
                    ? 'bg-sage-200 ring-2 ring-sage-400 transform scale-105'
                    : 'bg-white/60 hover:bg-white/80 hover:scale-102'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {option.emoji && <span className="text-2xl">{option.emoji}</span>}
                  <div>
                    <div className="font-medium text-sage-800">{option.name}</div>
                    {option.description && (
                      <div className="text-sm text-sage-600">{option.description}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sage-700 font-medium mb-3">
                Intensity ({responses.intensity}/10)
              </p>
              <input
                type="range"
                min="1"
                max="10"
                value={responses.intensity}
                onChange={(e) => setResponses(prev => ({ ...prev, intensity: Number(e.target.value) }))}
                className="w-full h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-sage-500 mt-1">
                <span>Gentle</span>
                <span>Intense</span>
              </div>
            </div>

            <div>
              <p className="text-sage-700 font-medium mb-3">
                Any words to add? (optional)
              </p>
              <textarea
                value={responses.notes}
                onChange={(e) => setResponses(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Today I noticed... I felt... This reminds me of..."
                className="w-full h-24 p-4 bg-white/70 backdrop-blur border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300 text-sage-800 placeholder-sage-400"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={currentStep < steps.length ? nextStep : generateLeaf}
            disabled={!canProceed}
            className={`w-full py-3 rounded-2xl font-medium transition-all duration-300 ${
              canProceed
                ? 'bg-sage-600 hover:bg-sage-700 text-white transform hover:scale-105'
                : 'bg-sage-200 text-sage-400 cursor-not-allowed'
            }`}
          >
            {currentStep < steps.length ? 'Continue' : 'Grow this leaf'}
          </button>

          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className="w-full py-2 text-sage-500 hover:text-sage-600 transition-all duration-300 text-sm"
            >
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

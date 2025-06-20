import React, { useState } from 'react';
import { useTreeGrowth } from '../hooks/useTreeGrowth';
import { Reflection } from '../types/tree';
import { AnimatedTree } from './AnimatedTree';

export const DailyReflection = () => {
  const { addReflection, growthState, isGrowing } = useTreeGrowth();
  const [responses, setResponses] = useState({
    mood: '',
    shape: '',
    color: '',
    intensity: 5,
    notes: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [showMorphingTransition, setShowMorphingTransition] = useState(false);
  const [showTreeView, setShowTreeView] = useState(false);

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
      setCurrentStep(steps.length);
    }
  };

  const generateLeaf = () => {
    setShowMorphingTransition(true);
    
    // Create the reflection
    const newReflection: Reflection = {
      id: `reflection-${Date.now()}`,
      date: new Date().toISOString(),
      mood: responses.mood,
      shape: responses.shape,
      color: responses.color,
      intensity: responses.intensity,
      notes: responses.notes
    };

    // Show morphing animation for 2 seconds, then add to tree
    setTimeout(() => {
      addReflection(newReflection);
      setShowMorphingTransition(false);
      setShowTreeView(true);
      
      // Auto-return to reflection form after viewing tree
      setTimeout(() => {
        setShowTreeView(false);
        // Reset form
        setResponses({
          mood: '',
          shape: '',
          color: '',
          intensity: 5,
          notes: ''
        });
        setCurrentStep(0);
      }, 4000);
    }, 2000);
  };

  const getShapeClipPath = (shape: string) => {
    const shapes = {
      triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      circle: 'circle(50%)',
      oval: 'ellipse(65% 45%)',
      diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    };
    return shapes[shape as keyof typeof shapes] || 'ellipse(65% 45%)';
  };

  const getColorClass = (color: string) => {
    const colors = {
      sage: 'bg-sage-400',
      blue: 'bg-blue-400',
      gray: 'bg-gray-500',
      yellow: 'bg-yellow-400',
      red: 'bg-red-400',
      purple: 'bg-purple-400',
      orange: 'bg-orange-400'
    };
    return colors[color as keyof typeof colors] || 'bg-sage-400';
  };

  if (showTreeView) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-sage-800 mb-4 animate-fade-in">
              Your reflection has grown
            </h2>
            <p className="text-sage-600 animate-fade-in">
              Watch as your new leaf finds its place in your tree.
            </p>
          </div>
          
          <AnimatedTree 
            growthState={growthState}
            onLeafClick={() => {}}
            isGrowing={isGrowing}
          />
          
          <div className="text-center">
            <p className="text-sage-500 text-sm animate-pulse">
              Returning to reflection space...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showMorphingTransition) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-md">
          <h3 className="text-2xl font-light text-sage-800 animate-fade-in">
            Your reflection is becoming a leaf...
          </h3>
          
          {/* Morphing shape visualization */}
          <div className="relative flex justify-center">
            <div 
              className={`w-24 h-24 ${getColorClass(responses.color)} opacity-80 animate-pulse transform transition-all duration-2000`}
              style={{
                clipPath: getShapeClipPath(responses.shape),
                animation: 'morph 2s ease-in-out infinite alternate'
              }}
            />
            
            {/* Floating particles around the shape */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-sage-300 rounded-full animate-bounce opacity-60"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.5s'
                  }}
                />
              ))}
            </div>
          </div>
          
          <p className="text-sage-600 italic animate-fade-in">
            "When you name how you feel, you feed the tree. When you feed it, it grows into clarity."
          </p>
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
                  index === currentStep ? 'bg-sage-600 scale-110' : 
                  index < currentStep ? 'bg-sage-400' : 'bg-sage-200'
                }`}
              />
            ))}
          </div>
          
          {currentStep < steps.length ? (
            <>
              <h2 className="text-xl md:text-2xl font-light text-sage-800 mb-2 animate-fade-in">
                {currentStepData.title}
              </h2>
              <p className="text-sage-600 text-sm">
                Choose what feels truest right now.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-light text-sage-800 mb-2 animate-fade-in">
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
                className={`p-4 rounded-2xl transition-all duration-500 text-left transform hover:scale-102 ${
                  responses[currentStepData.key] === option.id
                    ? 'bg-sage-200 ring-2 ring-sage-400 scale-105 shadow-lg'
                    : 'bg-white/70 hover:bg-white/90 shadow-sm hover:shadow-md'
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
                className="w-full h-3 bg-sage-200 rounded-lg appearance-none cursor-pointer"
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
                className="w-full h-24 p-4 bg-white/80 backdrop-blur border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300 text-sage-800 placeholder-sage-400"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={currentStep < steps.length ? nextStep : generateLeaf}
            disabled={!canProceed}
            className={`w-full py-3 rounded-2xl font-medium transition-all duration-300 transform ${
              canProceed
                ? 'bg-sage-600 hover:bg-sage-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-sage-200 text-sage-400 cursor-not-allowed'
            }`}
          >
            {currentStep < steps.length ? 'Continue' : 'Grow this leaf'}
          </button>

          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className="w-full py-2 text-sage-500 hover:text-sage-600 transition-all duration-300 text-sm hover:scale-105"
            >
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

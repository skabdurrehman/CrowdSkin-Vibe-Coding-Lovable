
import React, { useState } from 'react';
import { useTreeGrowth } from '../hooks/useTreeGrowth';
import { Reflection } from '../types/tree';
import { AnimatedTree } from './AnimatedTree';

export const DailyReflection = () => {
  const { addReflection, growthState, isGrowing, leafMorphing } = useTreeGrowth();
  const [responses, setResponses] = useState({
    mood: '',
    shape: '',
    color: '',
    direction: '',
    intensity: 5,
    notes: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [showTreeView, setShowTreeView] = useState(false);

  const questions = [
    {
      key: 'mood',
      title: 'If your body felt like an emotion today, what would it be?',
      subtitle: 'Listen to what feels most true right now.',
      options: [
        { id: 'peaceful', emoji: '😌', name: 'Peaceful', description: 'Calm and settled' },
        { id: 'anxious', emoji: '😰', name: 'Anxious', description: 'Restless and worried' },
        { id: 'heavy', emoji: '😔', name: 'Heavy', description: 'Weighed down' },
        { id: 'disconnected', emoji: '😶', name: 'Disconnected', description: 'Floating apart' },
        { id: 'overwhelmed', emoji: '😵', name: 'Overwhelmed', description: 'Too much at once' },
        { id: 'hopeful', emoji: '🌱', name: 'Hopeful', description: 'Growing toward light' },
        { id: 'frustrated', emoji: '😤', name: 'Frustrated', description: 'Blocked energy' },
        { id: 'gentle', emoji: '🕊️', name: 'Gentle', description: 'Soft and tender' }
      ]
    },
    {
      key: 'shape',
      title: 'If your presence had a shape today, what would it be?',
      subtitle: 'What form holds your energy?',
      options: [
        { id: 'circle', name: '○ Soft circle', description: 'Flowing and complete, no sharp edges' },
        { id: 'triangle', name: '△ Sharp triangle', description: 'Pointed and tense, ready to defend' },
        { id: 'oval', name: '◯ Gentle oval', description: 'Stretched but soft, like a breath' },
        { id: 'diamond', name: '◊ Rigid diamond', description: 'Angular and precise, holding firm' },
        { id: 'star', name: '✦ Radiating star', description: 'Reaching outward in all directions' }
      ]
    },
    {
      key: 'color',
      title: 'If today had a color, what would it feel like?',
      subtitle: 'What hue matches your inner landscape?',
      options: [
        { id: 'sage', name: 'Sage green', description: 'Calm and grounding, like deep forest' },
        { id: 'blue', name: 'Ocean blue', description: 'Deep and quiet, like still water' },
        { id: 'gray', name: 'Storm gray', description: 'Heavy and clouded, like morning mist' },
        { id: 'yellow', name: 'Warm yellow', description: 'Bright but anxious, like morning sun' },
        { id: 'red', name: 'Fire red', description: 'Intense and burning, like sunset flames' },
        { id: 'purple', name: 'Soft purple', description: 'Mysterious and gentle, like twilight' },
        { id: 'orange', name: 'Sunset orange', description: 'Energetic and restless, like autumn leaves' }
      ]
    },
    {
      key: 'direction',
      title: 'If your presence had a direction, which way would it move?',
      subtitle: 'How does your energy want to flow?',
      options: [
        { id: 'outward', name: '→ Reaching outward', description: 'Expanding toward others and the world' },
        { id: 'inward', name: '← Curling inward', description: 'Drawing back into yourself' },
        { id: 'still', name: '◦ Perfectly still', description: 'Centered and unmoving' },
        { id: 'rising', name: '↑ Rising upward', description: 'Lifting toward something higher' }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];

  const handleSelection = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.key]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(questions.length);
    }
  };

  const generateLeaf = () => {
    const newReflection: Reflection = {
      id: `reflection-${Date.now()}`,
      date: new Date().toISOString(),
      mood: responses.mood,
      shape: responses.shape,
      color: responses.color,
      direction: responses.direction as 'outward' | 'inward' | 'still' | 'rising',
      intensity: responses.intensity,
      notes: responses.notes
    };

    addReflection(newReflection);
    setShowTreeView(true);
    
    // Auto-return after viewing growth
    setTimeout(() => {
      setShowTreeView(false);
      setResponses({
        mood: '',
        shape: '',
        color: '',
        direction: '',
        intensity: 5,
        notes: ''
      });
      setCurrentStep(0);
    }, 6000);
  };

  if (showTreeView) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-light text-sage-800 mb-4">
              Your reflection becomes life
            </h2>
            <p className="text-sage-600">
              Watch your new leaf find its natural place in your growing canopy.
            </p>
          </div>
          
          <AnimatedTree 
            growthState={growthState}
            onLeafClick={() => {}}
            isGrowing={isGrowing}
            leafMorphing={leafMorphing}
          />
          
          {leafMorphing && (
            <div className="text-center animate-pulse">
              <p className="text-sage-500 text-sm">
                Your {responses.color} {responses.shape} is becoming a leaf...
              </p>
            </div>
          )}
          
          {isGrowing && !leafMorphing && (
            <div className="text-center animate-pulse">
              <p className="text-sage-500 text-sm">
                Finding its perfect place in the canopy...
              </p>
            </div>
          )}
          
          {!isGrowing && !leafMorphing && (
            <div className="text-center">
              <p className="text-sage-500 text-sm animate-fade-in">
                Your tree grows stronger. Returning to reflection space...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const canProceed = responses[currentQuestion?.key] || currentStep >= questions.length;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-sage-50 via-beige-50 to-lavender-50">
      <div className="max-w-lg w-full space-y-8">
        {/* Progress indicator */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-3 mb-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === currentStep ? 'w-8 h-3 bg-sage-600 rounded-full scale-110' : 
                  index < currentStep ? 'w-3 h-3 bg-sage-400 rounded-full' : 
                  'w-3 h-3 bg-sage-200 rounded-full'
                }`}
              />
            ))}
          </div>
          
          {currentStep < questions.length ? (
            <div className="animate-fade-in">
              <h2 className="text-xl md:text-2xl font-light text-sage-800 mb-3 leading-relaxed">
                {currentQuestion.title}
              </h2>
              <p className="text-sage-600 text-sm italic">
                {currentQuestion.subtitle}
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-xl md:text-2xl font-light text-sage-800 mb-3">
                How intense does this feeling?
              </h2>
              <p className="text-sage-600 text-sm italic">
                Fine-tune the depth of your reflection.
              </p>
            </div>
          )}
        </div>

        {/* Question content */}
        {currentStep < questions.length ? (
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleSelection(option.id)}
                className={`p-5 rounded-3xl transition-all duration-500 text-left transform hover:scale-102 ${
                  responses[currentQuestion.key] === option.id
                    ? 'bg-sage-200 ring-2 ring-sage-400 scale-105 shadow-xl'
                    : 'bg-white/80 hover:bg-white/95 shadow-md hover:shadow-lg backdrop-blur-sm'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="flex items-start space-x-4">
                  {option.emoji && (
                    <span className="text-3xl flex-shrink-0 mt-1">{option.emoji}</span>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sage-800 text-lg mb-1">{option.name}</div>
                    <div className="text-sm text-sage-600 leading-relaxed">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Intensity slider */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-md">
              <p className="text-sage-700 font-medium mb-4">
                Intensity: {responses.intensity}/10
              </p>
              <input
                type="range"
                min="1"
                max="10"
                value={responses.intensity}
                onChange={(e) => setResponses(prev => ({ ...prev, intensity: Number(e.target.value) }))}
                className="w-full h-4 bg-sage-200 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-sage-500 mt-2">
                <span>Gentle whisper</span>
                <span>Overwhelming presence</span>
              </div>
            </div>

            {/* Optional notes */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-md">
              <p className="text-sage-700 font-medium mb-3">
                Any words that want to be remembered? (optional)
              </p>
              <textarea
                value={responses.notes}
                onChange={(e) => setResponses(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Today I noticed... I felt... This reminds me of..."
                className="w-full h-28 p-4 bg-sage-50 border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300 text-sage-800 placeholder-sage-400"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="space-y-4">
          <button
            onClick={currentStep < questions.length ? nextStep : generateLeaf}
            disabled={!canProceed}
            className={`w-full py-4 rounded-3xl font-medium transition-all duration-500 transform ${
              canProceed
                ? 'bg-sage-600 hover:bg-sage-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-sage-200 text-sage-400 cursor-not-allowed'
            }`}
          >
            {currentStep < questions.length ? 'Continue' : 'Grow this into a leaf'}
          </button>

          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className="w-full py-3 text-sage-500 hover:text-sage-600 transition-all duration-300 text-sm hover:scale-105"
            >
              Go back
            </button>
          )}
        </div>

        {/* Gentle encouragement */}
        {currentStep === 0 && (
          <div className="text-center mt-8 animate-fade-in">
            <p className="text-sage-500 text-sm italic">
              "Even the sun doesn't show up every day, but when it does, it grows something beautiful."
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

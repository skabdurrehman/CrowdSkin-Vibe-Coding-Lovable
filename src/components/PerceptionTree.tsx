
import React, { useState } from 'react';
import { AnimatedTree } from './AnimatedTree';
import { WhisperPanel } from './WhisperPanel';
import { ReflectionModal } from './ReflectionModal';
import { useTreeGrowth } from '../hooks/useTreeGrowth';
import { Reflection } from '../types/tree';

export const PerceptionTree = () => {
  const { growthState, addWhisper } = useTreeGrowth();
  const [whisperOpen, setWhisperOpen] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const [stormMode, setStormMode] = useState(false);

  const handleLeafClick = (reflection: Reflection) => {
    setSelectedReflection(reflection);
  };

  const handleWhisper = (text: string) => {
    addWhisper(text);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-sage-800 mb-4">
            Your Perception Tree
          </h2>
          
          {growthState.totalReflections === 0 ? (
            <p className="text-sage-600">
              Your tree awaits its first reflection. Each feeling you share becomes a living leaf.
            </p>
          ) : (
            <p className="text-sage-600">
              {growthState.totalReflections} reflections have grown into leaves. Click any leaf to revisit that moment.
            </p>
          )}
        </div>

        <AnimatedTree 
          growthState={growthState}
          onLeafClick={handleLeafClick}
          stormMode={stormMode}
        />

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setWhisperOpen(true)}
            className="px-6 py-3 bg-sage-100 hover:bg-sage-200 text-sage-700 rounded-2xl transition-all duration-300 flex items-center space-x-2"
          >
            <span>🌱</span>
            <span>Whisper Panel</span>
          </button>

          <button
            onClick={() => setStormMode(!stormMode)}
            className={`px-6 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-2 ${
              stormMode 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
            }`}
          >
            <span>{stormMode ? '☀️' : '⛈️'}</span>
            <span>{stormMode ? 'Clear Sky' : 'Storm Mode'}</span>
          </button>
        </div>

        {growthState.totalReflections >= 30 && !growthState.hasFlowers && (
          <div className="text-center p-4 bg-pink-50 rounded-2xl animate-fade-in">
            <p className="text-pink-700">🌸 Your tree has bloomed! Flowers appear at the edges.</p>
          </div>
        )}

        {growthState.totalReflections >= 50 && !growthState.hasBird && (
          <div className="text-center p-4 bg-blue-50 rounded-2xl animate-fade-in">
            <p className="text-blue-700">🐦 A gentle bird has made its home in your tree!</p>
          </div>
        )}

        {growthState.totalReflections >= 100 && !growthState.hasLanterns && (
          <div className="text-center p-4 bg-yellow-50 rounded-2xl animate-fade-in">
            <p className="text-yellow-700">🏮 Your tree now glows with lanterns of wisdom.</p>
          </div>
        )}
      </div>

      <WhisperPanel 
        isOpen={whisperOpen}
        onClose={() => setWhisperOpen(false)}
        onWhisper={handleWhisper}
      />

      <ReflectionModal 
        reflection={selectedReflection}
        onClose={() => setSelectedReflection(null)}
      />
    </div>
  );
};

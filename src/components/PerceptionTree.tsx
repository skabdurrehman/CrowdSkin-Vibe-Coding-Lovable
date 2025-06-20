
import React, { useState } from 'react';
import { AnimatedTree } from './AnimatedTree';
import { WhisperPanel } from './WhisperPanel';
import { ReflectionModal } from './ReflectionModal';
import { useTreeGrowth } from '../hooks/useTreeGrowth';
import { Reflection } from '../types/tree';

export const PerceptionTree = () => {
  const { growthState, addWhisper, isGrowing, silentMode, toggleSilentMode } = useTreeGrowth();
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
            {silentMode ? 'Silent Garden' : 'Your Perception Tree'}
          </h2>
          
          {silentMode ? (
            <p className="text-slate-600 italic">
              A quiet space for when words feel too heavy. Just breathe.
            </p>
          ) : growthState.totalReflections === 0 ? (
            <p className="text-sage-600">
              Your tree awaits its first reflection. Each feeling you share becomes a living leaf.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sage-600">
                {growthState.totalReflections} reflections have grown into leaves. Click any leaf to revisit that moment.
              </p>
              {isGrowing && (
                <p className="text-sage-500 text-sm animate-pulse">
                  🌱 Your latest reflection is taking root...
                </p>
              )}
            </div>
          )}
        </div>

        <AnimatedTree 
          growthState={growthState}
          onLeafClick={handleLeafClick}
          stormMode={stormMode}
          silentMode={silentMode}
          isGrowing={isGrowing}
        />

        <div className="flex justify-center space-x-4 flex-wrap gap-2">
          {!silentMode && (
            <button
              onClick={() => setWhisperOpen(true)}
              className="px-6 py-3 bg-sage-100 hover:bg-sage-200 text-sage-700 rounded-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
            >
              <span>🌱</span>
              <span>Whisper Panel</span>
            </button>
          )}

          <button
            onClick={() => setStormMode(!stormMode)}
            disabled={silentMode}
            className={`px-6 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
              silentMode
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : stormMode 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
            }`}
          >
            <span>{stormMode ? '☀️' : '⛈️'}</span>
            <span>{stormMode ? 'Clear Sky' : 'Storm Mode'}</span>
          </button>

          <button
            onClick={toggleSilentMode}
            className={`px-6 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${
              silentMode
                ? 'bg-sage-200 hover:bg-sage-300 text-sage-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>{silentMode ? '🌳' : '🌙'}</span>
            <span>{silentMode ? 'Return to Tree' : 'Silent Garden'}</span>
          </button>
        </div>

        {/* Enhanced milestone celebrations */}
        {!silentMode && (
          <>
            {growthState.totalReflections >= 30 && (
              <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl animate-fade-in border border-pink-200">
                <p className="text-pink-700">🌸 Your tree has bloomed! Beautiful flowers dance at the edges.</p>
              </div>
            )}

            {growthState.totalReflections >= 50 && (
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl animate-fade-in border border-blue-200">
                <p className="text-blue-700">🐦 A gentle bird has found sanctuary in your growing tree!</p>
              </div>
            )}

            {growthState.totalReflections >= 100 && (
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl animate-fade-in border border-yellow-200">
                <p className="text-yellow-700">🏮 Your tree now glows with lanterns of accumulated wisdom.</p>
              </div>
            )}
          </>
        )}
      </div>

      {!silentMode && (
        <WhisperPanel 
          isOpen={whisperOpen}
          onClose={() => setWhisperOpen(false)}
          onWhisper={handleWhisper}
        />
      )}

      <ReflectionModal 
        reflection={selectedReflection}
        onClose={() => setSelectedReflection(null)}
      />
    </div>
  );
};

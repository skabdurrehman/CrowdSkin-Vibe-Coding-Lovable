
import React, { useState } from 'react';
import { AnimatedTree } from './AnimatedTree';
import { WhisperPanel } from './WhisperPanel';
import { ReflectionModal } from './ReflectionModal';
import { ReflectionLoop } from './ReflectionLoop';
import { QuietBloom } from './QuietBloom';
import { WhyAmIHere } from './WhyAmIHere';
import { useTreeGrowth } from '../hooks/useTreeGrowth';
import { Reflection } from '../types/tree';

export const PerceptionTree = () => {
  const { 
    growthState, 
    addWhisper, 
    addQuietThought,
    isGrowing, 
    silentMode, 
    toggleSilentMode,
    toggleQuietBloom,
    currentTrend
  } = useTreeGrowth();
  
  const [whisperOpen, setWhisperOpen] = useState(false);
  const [reflectionLoopOpen, setReflectionLoopOpen] = useState(false);
  const [quietBloomOpen, setQuietBloomOpen] = useState(false);
  const [whyAmIHereOpen, setWhyAmIHereOpen] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);

  const handleLeafClick = (reflection: Reflection) => {
    setSelectedReflection(reflection);
  };

  const handleWhisper = (text: string) => {
    addWhisper(text);
  };

  const handleQuietThought = (thought: string) => {
    addQuietThought(thought);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-sage-800 mb-4">
            {silentMode ? 'Silent Garden' : 
             growthState.isQuietBloomMode ? 'Quiet Bloom' : 
             'Your Perception Tree'}
          </h2>
          
          {silentMode ? (
            <p className="text-slate-600 italic">
              A quiet space for when words feel too heavy. Just breathe.
            </p>
          ) : growthState.isQuietBloomMode ? (
            <p className="text-gray-600 italic">
              Here, even heavy thoughts can become gentle growth.
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
              {currentTrend?.needsGentleReminder && (
                <p className="text-sage-500 text-sm bg-sage-100 rounded-xl px-4 py-2">
                  Your tree remembers gentler days. Would you like to sit together?
                </p>
              )}
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
          silentMode={silentMode}
          isGrowing={isGrowing}
        />

        <div className="flex justify-center space-x-3 flex-wrap gap-2">
          {!silentMode && !growthState.isQuietBloomMode && (
            <>
              <button
                onClick={() => setWhisperOpen(true)}
                className="px-4 py-3 bg-sage-100 hover:bg-sage-200 text-sage-700 rounded-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 text-sm"
              >
                <span>🌱</span>
                <span>Whisper Panel</span>
              </button>

              <button
                onClick={() => setReflectionLoopOpen(true)}
                disabled={!currentTrend}
                className={`px-4 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 text-sm ${
                  currentTrend
                    ? 'bg-lavender-100 hover:bg-lavender-200 text-lavender-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>🌳</span>
                <span>Tree Memory</span>
              </button>
            </>
          )}

          <button
            onClick={() => setQuietBloomOpen(true)}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 text-sm"
          >
            <span>🍄</span>
            <span>Quiet Bloom</span>
          </button>

          <button
            onClick={toggleQuietBloom}
            className={`px-4 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 text-sm ${
              growthState.isQuietBloomMode
                ? 'bg-sage-200 hover:bg-sage-300 text-sage-700'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <span>{growthState.isQuietBloomMode ? '🌱' : '🌙'}</span>
            <span>{growthState.isQuietBloomMode ? 'Return to Garden' : 'Quiet Mode'}</span>
          </button>

          <button
            onClick={toggleSilentMode}
            className={`px-4 py-3 rounded-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 text-sm ${
              silentMode
                ? 'bg-sage-200 hover:bg-sage-300 text-sage-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>{silentMode ? '🌳' : '💤'}</span>
            <span>{silentMode ? 'Return to Tree' : 'Silent Garden'}</span>
          </button>

          <button
            onClick={() => setWhyAmIHereOpen(true)}
            className="px-4 py-3 bg-beige-100 hover:bg-beige-200 text-beige-800 rounded-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 text-sm"
          >
            <span>❓</span>
            <span>Why Am I Here?</span>
          </button>
        </div>

        {/* Enhanced milestone celebrations */}
        {!silentMode && !growthState.isQuietBloomMode && (
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

            {growthState.mushroomCount > 0 && (
              <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl animate-fade-in border border-gray-200">
                <p className="text-gray-700">🍄 {growthState.mushroomCount} gentle mushroom{growthState.mushroomCount > 1 ? 's' : ''} have grown from your buried thoughts.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Components */}
      {!silentMode && (
        <WhisperPanel 
          isOpen={whisperOpen}
          onClose={() => setWhisperOpen(false)}
          onWhisper={handleWhisper}
        />
      )}

      <ReflectionLoop
        isOpen={reflectionLoopOpen}
        onClose={() => setReflectionLoopOpen(false)}
        trend={currentTrend}
        growthState={growthState}
      />

      <QuietBloom
        isOpen={quietBloomOpen}
        onClose={() => setQuietBloomOpen(false)}
        onDropThought={handleQuietThought}
      />

      <WhyAmIHere
        isOpen={whyAmIHereOpen}
        onClose={() => setWhyAmIHereOpen(false)}
      />

      <ReflectionModal 
        reflection={selectedReflection}
        onClose={() => setSelectedReflection(null)}
      />
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { WelcomeOverlay } from '../components/WelcomeOverlay';
import { Header } from '../components/Header';
import { DailyReflection } from '../components/DailyReflection';
import { PerceptionTree } from '../components/PerceptionTree';
import { MirrorMode } from '../components/MirrorMode';
import { DumpZone } from '../components/DumpZone';
import { MoodCheckin } from '../components/MoodCheckin';
import { useTreeGrowth } from '../hooks/useTreeGrowth';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeMode, setActiveMode] = useState('home');
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const { growthState } = useTreeGrowth();

  useEffect(() => {
    const seen = localStorage.getItem('crowdskin-welcome-seen');
    if (!seen) {
      setShowWelcome(true);
    } else {
      setHasSeenWelcome(true);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setHasSeenWelcome(true);
    localStorage.setItem('crowdskin-welcome-seen', 'true');
  };

  const handleShowHelp = () => {
    setShowWelcome(true);
  };

  const renderActiveMode = () => {
    switch (activeMode) {
      case 'reflect':
        return <DailyReflection />;
      case 'tree':
        return <PerceptionTree />;
      case 'mirror':
        return <MirrorMode />;
      case 'dump':
        return <DumpZone />;
      case 'mood':
        return <MoodCheckin />;
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-4">
                <div className="text-6xl animate-pulse">🌳</div>
                <h2 className="text-3xl md:text-4xl font-light text-sage-800">
                  Your Inner Forest
                </h2>
                <p className="text-sage-600 leading-relaxed text-lg">
                  This is where feelings become living things. Where self-perception grows into a sacred, ever-changing landscape that belongs only to you.
                </p>
              </div>

              {growthState.totalReflections > 0 && (
                <div className="bg-sage-50 rounded-3xl p-6 space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl">🌱</span>
                    <span className="text-sage-700 font-medium">Your tree has {growthState.totalReflections} leaves</span>
                  </div>
                  {growthState.hasFlowers && (
                    <p className="text-pink-600 text-sm">🌸 Flowers are blooming</p>
                  )}
                  {growthState.hasBird && (
                    <p className="text-blue-600 text-sm">🐦 A bird calls your tree home</p>
                  )}
                  {growthState.hasLanterns && (
                    <p className="text-yellow-600 text-sm">🏮 Lanterns light your way</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveMode('reflect')}
                  className="group p-6 bg-gradient-to-br from-sage-100 to-sage-200 hover:from-sage-200 hover:to-sage-300 rounded-3xl transition-all duration-500 text-left transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🌱</span>
                    <span className="font-medium text-sage-800 text-lg">Daily Reflection</span>
                  </div>
                  <p className="text-sm text-sage-600">Share your inner landscape and watch a new leaf grow</p>
                </button>

                <button
                  onClick={() => setActiveMode('tree')}
                  className="group p-6 bg-gradient-to-br from-lavender-100 to-lavender-200 hover:from-lavender-200 hover:to-lavender-300 rounded-3xl transition-all duration-500 text-left transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🌳</span>
                    <span className="font-medium text-sage-800 text-lg">Your Tree</span>
                  </div>
                  <p className="text-sm text-sage-600">Visit your growing forest of feelings and memories</p>
                </button>

                <button
                  onClick={() => setActiveMode('mirror')}
                  className="group p-6 bg-gradient-to-br from-beige-100 to-beige-200 hover:from-beige-200 hover:to-beige-300 rounded-3xl transition-all duration-500 text-left transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🪞</span>
                    <span className="font-medium text-sage-800 text-lg">Mirror Companion</span>
                  </div>
                  <p className="text-sm text-sage-600">Gentle support when facing your reflection feels hard</p>
                </button>

                <button
                  onClick={() => setActiveMode('dump')}
                  className="group p-6 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-3xl transition-all duration-500 text-left transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🌊</span>
                    <span className="font-medium text-sage-800 text-lg">Release Space</span>
                  </div>
                  <p className="text-sm text-sage-600">Let go of heavy thoughts and watch them transform</p>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-beige-50 to-lavender-50 flex flex-col">
      {showWelcome && (
        <WelcomeOverlay onComplete={handleWelcomeComplete} />
      )}
      
      <Header 
        onShowHelp={handleShowHelp}
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />
      
      <main className="flex-1 flex flex-col">
        {renderActiveMode()}
      </main>
      
      {hasSeenWelcome && (
        <button
          onClick={handleShowHelp}
          className="fixed bottom-6 right-6 w-14 h-14 bg-sage-200 hover:bg-sage-300 rounded-full flex items-center justify-center text-2xl transition-all duration-300 shadow-lg z-10 transform hover:scale-110"
          aria-label="How this works"
        >
          🌳
        </button>
      )}
    </div>
  );
};

export default Index;


import React, { useState, useEffect } from 'react';
import { WelcomeOverlay } from '../components/WelcomeOverlay';
import { Header } from '../components/Header';
import { DailyReflection } from '../components/DailyReflection';
import { PerceptionTree } from '../components/PerceptionTree';
import { MirrorMode } from '../components/MirrorMode';
import { DumpZone } from '../components/DumpZone';
import { MoodCheckin } from '../components/MoodCheckin';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeMode, setActiveMode] = useState('home');
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

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
            <div className="max-w-md mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-sage-800 mb-4">
                Welcome to your inner space
              </h2>
              <p className="text-sage-600 leading-relaxed mb-8">
                This is where you can be exactly as you are, feeling exactly as you feel.
                No judgment. No comparison. Just gentle witnessing.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setActiveMode('reflect')}
                  className="p-4 bg-sage-100 hover:bg-sage-200 rounded-2xl transition-all duration-500 text-sage-800 text-left"
                >
                  <div className="font-medium mb-1">Daily Reflection</div>
                  <div className="text-sm text-sage-600">Sketch how you feel today</div>
                </button>
                <button
                  onClick={() => setActiveMode('tree')}
                  className="p-4 bg-lavender-100 hover:bg-lavender-200 rounded-2xl transition-all duration-500 text-sage-800 text-left"
                >
                  <div className="font-medium mb-1">Perception Tree</div>
                  <div className="text-sm text-sage-600">Watch your patterns grow</div>
                </button>
                <button
                  onClick={() => setActiveMode('mirror')}
                  className="p-4 bg-beige-100 hover:bg-beige-200 rounded-2xl transition-all duration-500 text-sage-800 text-left"
                >
                  <div className="font-medium mb-1">Mirror Mode</div>
                  <div className="text-sm text-sage-600">Gentle mirror companion</div>
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
          className="fixed bottom-6 right-6 w-12 h-12 bg-sage-200 hover:bg-sage-300 rounded-full flex items-center justify-center text-sage-700 transition-all duration-300 shadow-lg z-10"
          aria-label="Help me understand"
        >
          🌱
        </button>
      )}
    </div>
  );
};

export default Index;


import React from 'react';

interface HeaderProps {
  onShowHelp: () => void;
  activeMode: string;
  onModeChange: (mode: string) => void;
}

export const Header = ({ onShowHelp, activeMode, onModeChange }: HeaderProps) => {
  return (
    <header className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onModeChange('home')}
          className="text-2xl md:text-3xl font-light text-sage-800 hover:text-sage-600 transition-colors duration-300"
        >
          CrowdSkin
        </button>
        
        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => onModeChange('mood')}
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              activeMode === 'mood' 
                ? 'bg-sage-200 text-sage-800' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            Mood Check
          </button>
          <button
            onClick={() => onModeChange('dump')}
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              activeMode === 'dump' 
                ? 'bg-sage-200 text-sage-800' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            Dump Zone
          </button>
        </nav>
      </div>
      
      {/* Mobile navigation */}
      <nav className="md:hidden grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => onModeChange('mood')}
          className={`px-3 py-2 rounded-xl text-sm transition-all duration-300 ${
            activeMode === 'mood' 
              ? 'bg-sage-200 text-sage-800' 
              : 'text-sage-600 hover:text-sage-800'
          }`}
        >
          Mood
        </button>
        <button
          onClick={() => onModeChange('dump')}
          className={`px-3 py-2 rounded-xl text-sm transition-all duration-300 ${
            activeMode === 'dump' 
              ? 'bg-sage-200 text-sage-800' 
              : 'text-sage-600 hover:text-sage-800'
          }`}
        >
          Dump Zone
        </button>
        <button
          onClick={onShowHelp}
          className="px-3 py-2 rounded-xl text-sm text-sage-600 hover:text-sage-800 transition-all duration-300"
        >
          Help
        </button>
      </nav>
    </header>
  );
};

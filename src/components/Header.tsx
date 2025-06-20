
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
          className="text-2xl md:text-3xl font-light text-sage-800 hover:text-sage-600 transition-colors duration-300 flex items-center space-x-2"
        >
          <span>🌳</span>
          <span>CrowdSkin</span>
        </button>
        
        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => onModeChange('reflect')}
            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
              activeMode === 'reflect' 
                ? 'bg-sage-200 text-sage-800' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            <span>🌱</span>
            <span>Reflect</span>
          </button>
          <button
            onClick={() => onModeChange('tree')}
            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
              activeMode === 'tree' 
                ? 'bg-sage-200 text-sage-800' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            <span>🌳</span>
            <span>Your Tree</span>
          </button>
          <button
            onClick={() => onModeChange('mirror')}
            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
              activeMode === 'mirror' 
                ? 'bg-sage-200 text-sage-800' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            <span>🪞</span>
            <span>Mirror</span>
          </button>
        </nav>
      </div>
      
      {/* Mobile navigation */}
      <nav className="md:hidden grid grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => onModeChange('reflect')}
          className={`px-3 py-2 rounded-xl text-sm transition-all duration-300 flex flex-col items-center space-y-1 ${
            activeMode === 'reflect' 
              ? 'bg-sage-200 text-sage-800' 
              : 'text-sage-600 hover:text-sage-800'
          }`}
        >
          <span>🌱</span>
          <span>Reflect</span>
        </button>
        <button
          onClick={() => onModeChange('tree')}
          className={`px-3 py-2 rounded-xl text-sm transition-all duration-300 flex flex-col items-center space-y-1 ${
            activeMode === 'tree' 
              ? 'bg-sage-200 text-sage-800' 
              : 'text-sage-600 hover:text-sage-800'
          }`}
        >
          <span>🌳</span>
          <span>Tree</span>
        </button>
        <button
          onClick={() => onModeChange('mirror')}
          className={`px-3 py-2 rounded-xl text-sm transition-all duration-300 flex flex-col items-center space-y-1 ${
            activeMode === 'mirror' 
              ? 'bg-sage-200 text-sage-800' 
              : 'text-sage-600 hover:text-sage-800'
          }`}
        >
          <span>🪞</span>
          <span>Mirror</span>
        </button>
        <button
          onClick={onShowHelp}
          className="px-3 py-2 rounded-xl text-sm text-sage-600 hover:text-sage-800 transition-all duration-300 flex flex-col items-center space-y-1"
        >
          <span>🌳</span>
          <span>Help</span>
        </button>
      </nav>
    </header>
  );
};

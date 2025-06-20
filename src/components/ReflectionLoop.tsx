
import React, { useState } from 'react';
import { EmotionalTrend, TreeGrowthState } from '../types/tree';

interface ReflectionLoopProps {
  isOpen: boolean;
  onClose: () => void;
  trend: EmotionalTrend | null;
  growthState: TreeGrowthState;
}

export const ReflectionLoop = ({ isOpen, onClose, trend, growthState }: ReflectionLoopProps) => {
  const [isListening, setIsListening] = useState(false);

  const generateGentleQuestion = () => {
    if (!trend) return "Take a moment to breathe with your tree.";
    
    if (trend.needsGentleReminder && trend.lastSoftDay) {
      const daysSince = Math.floor(
        (Date.now() - new Date(trend.lastSoftDay).getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${daysSince} days ago, you felt peaceful and calm. What helped that day?`;
    }
    
    if (trend.moodStreak >= 3) {
      return "You've been carrying heaviness. What would help you feel lighter today?";
    }
    
    return "Your tree remembers your gentle moments. What brought you peace before?";
  };

  const startListening = () => {
    setIsListening(true);
    // Play calming ambient sounds based on emotional trend
    setTimeout(() => setIsListening(false), 30000); // 30 second meditation
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-sage-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-sage-50 to-lavender-50 backdrop-blur rounded-3xl p-8 max-w-lg w-full animate-fade-in">
        <div className="text-center space-y-6">
          <div className="text-4xl animate-pulse">🌳</div>
          
          <h2 className="text-2xl font-light text-sage-800">
            Your Tree Remembers
          </h2>
          
          <div className="bg-white/60 rounded-2xl p-6 space-y-4">
            <p className="text-sage-700 italic leading-relaxed">
              "{generateGentleQuestion()}"
            </p>
            
            {trend?.needsGentleReminder && (
              <div className="text-sm text-sage-600 bg-sage-100 rounded-xl p-4">
                <p className="mb-2">Your tree shows patterns of strength:</p>
                <ul className="space-y-1 text-left">
                  <li>• {growthState.totalReflections} reflections planted</li>
                  <li>• {growthState.leaves.filter(l => ['peaceful', 'gentle', 'hopeful'].includes(l.reflection.mood)).length} gentle days remembered</li>
                  <li>• Your tree knows you can grow through this</li>
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={startListening}
              disabled={isListening}
              className={`w-full py-4 rounded-2xl font-medium transition-all duration-500 ${
                isListening
                  ? 'bg-sage-300 text-sage-600 cursor-not-allowed animate-pulse'
                  : 'bg-sage-600 hover:bg-sage-700 text-white transform hover:scale-105'
              }`}
            >
              {isListening ? 'Listening to your tree...' : 'Sit with your tree (30s)'}
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-sage-600 hover:text-sage-700 transition-all duration-300"
            >
              Return to your garden
            </button>
          </div>

          {isListening && (
            <div className="space-y-3">
              <p className="text-sage-600 text-sm animate-fade-in">
                Let your breathing slow. Feel the roots of your tree reaching deep.
              </p>
              <div className="flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-sage-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

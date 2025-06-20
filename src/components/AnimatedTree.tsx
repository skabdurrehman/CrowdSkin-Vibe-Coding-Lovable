
import React, { useEffect, useRef, useState } from 'react';
import { TreeGrowthState, Reflection, TreeLeaf } from '../types/tree';

interface AnimatedTreeProps {
  growthState: TreeGrowthState;
  onLeafClick: (reflection: Reflection) => void;
  stormMode?: boolean;
  silentMode?: boolean;
  isGrowing?: boolean;
}

export const AnimatedTree = ({ 
  growthState, 
  onLeafClick, 
  stormMode = false, 
  silentMode = false,
  isGrowing = false 
}: AnimatedTreeProps) => {
  const treeRef = useRef<HTMLDivElement>(null);
  const [hoveredLeaf, setHoveredLeaf] = useState<string | null>(null);
  const [windAnimation, setWindAnimation] = useState(false);
  const [newLeafAnimating, setNewLeafAnimating] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<string>('day');

  // Detect time of day for adaptive visuals
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 20) setTimeOfDay('night');
    else if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  useEffect(() => {
    // Trigger wind animation periodically
    const windInterval = setInterval(() => {
      if (!silentMode) {
        setWindAnimation(true);
        setTimeout(() => setWindAnimation(false), 3000);
      }
    }, 12000 + Math.random() * 8000);

    return () => clearInterval(windInterval);
  }, [silentMode]);

  useEffect(() => {
    // Animate new leaf when tree is growing
    if (isGrowing && growthState.leaves.length > 0) {
      const latestLeaf = growthState.leaves[growthState.leaves.length - 1];
      setNewLeafAnimating(latestLeaf.id);
      setTimeout(() => setNewLeafAnimating(null), 2000);
    }
  }, [isGrowing, growthState.leaves.length]);

  const getAdaptiveBackground = () => {
    if (silentMode) {
      return 'bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900';
    }
    
    if (growthState.isQuietBloomMode) {
      return 'bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800';
    }

    // Adapt to recent emotional patterns
    const recentMoods = growthState.leaves
      .slice(-5)
      .map(leaf => leaf.reflection.mood);
    
    const hasHeavyMoods = recentMoods.some(mood => 
      ['heavy', 'overwhelmed', 'anxious'].includes(mood)
    );

    if (hasHeavyMoods) {
      return `bg-gradient-to-b from-${growthState.moodTone}-200 via-sage-100 to-${growthState.moodTone}-300`;
    }

    return `bg-gradient-to-b from-${growthState.moodTone}-100 via-beige-100 to-${growthState.moodTone}-200`;
  };

  const getLeafStyle = (leaf: TreeLeaf, index: number) => {
    const isNew = newLeafAnimating === leaf.id;
    const baseDelay = index * 0.05;
    
    return {
      left: `${leaf.position.x}%`,
      top: `${leaf.position.y}%`,
      animationDelay: `${baseDelay}s`,
      transform: windAnimation 
        ? `rotate(${Math.sin(index * 0.8) * 8}deg) scale(${0.92 + Math.random() * 0.16})` 
        : isNew 
        ? 'scale(0) rotate(180deg)'
        : 'scale(1) rotate(0deg)',
      transition: isNew 
        ? 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' 
        : 'all 2s ease-in-out',
      opacity: isNew ? 0 : 1,
      zIndex: isNew ? 100 : 1
    };
  };

  const getLeafColor = (mood: string) => {
    const moodColors = {
      peaceful: 'bg-sage-400',
      anxious: 'bg-yellow-400',
      heavy: 'bg-gray-500',
      disconnected: 'bg-blue-400',
      overwhelmed: 'bg-red-400',
      hopeful: 'bg-green-400',
      frustrated: 'bg-orange-400',
      gentle: 'bg-lavender-400'
    };
    return moodColors[mood as keyof typeof moodColors] || 'bg-sage-400';
  };

  const getLeafShape = (shape: string) => {
    const shapes = {
      triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      circle: 'circle(50%)',
      oval: 'ellipse(65% 45%)',
      diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    };
    return shapes[shape as keyof typeof shapes] || 'ellipse(65% 45%)';
  };

  if (silentMode) {
    return (
      <div className="relative w-full h-96 overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 transition-all duration-2000">
        {/* Silent Garden - Night pond with breathing flower */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Pond reflection */}
            <div className="absolute bottom-0 w-64 h-32 bg-slate-600 rounded-full opacity-30 blur-sm" />
            
            {/* Breathing flower */}
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-lavender-300 to-sage-300 rounded-full animate-pulse opacity-70" />
              <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-sage-200 to-lavender-200 rounded-full animate-ping opacity-20" />
            </div>
          </div>
        </div>

        {/* Gentle floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-slate-400 rounded-full animate-pulse"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-4 left-4 text-slate-400 text-sm opacity-60">
          Silent Garden Mode
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={treeRef}
      className={`relative w-full h-96 overflow-hidden rounded-3xl transition-all duration-1000 ${getAdaptiveBackground()}`}
    >
      {/* Time-based ambient effects */}
      {timeOfDay === 'morning' && growthState.preferredReflectionTime === 'morning' && (
        <div className="absolute top-6 right-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute text-lg animate-bounce"
              style={{
                left: `${i * 15}px`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            >
              🐦
            </div>
          ))}
        </div>
      )}

      {timeOfDay === 'night' && growthState.preferredReflectionTime === 'night' && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: '4s'
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full transition-colors duration-1000 ${
              growthState.isQuietBloomMode ? 'bg-gray-400 animate-pulse' : `bg-${growthState.moodTone}-300 animate-pulse`
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced ground with moss and mushrooms */}
      <div className="absolute bottom-0 left-0 right-0 h-20">
        <div className={`h-full rounded-t-full transition-all duration-1000 ${
          growthState.isQuietBloomMode 
            ? 'bg-gradient-to-t from-gray-600 to-transparent' 
            : `bg-gradient-to-t from-${growthState.moodTone}-300 via-${growthState.moodTone}-200 to-transparent`
        }`} />
        
        {/* Mushrooms from quiet thoughts */}
        {[...Array(growthState.mushroomCount)].map((_, i) => (
          <div
            key={`mushroom-${i}`}
            className="absolute bottom-2 animate-fade-in"
            style={{
              left: `${25 + (i * 8) % 50}%`,
              animationDelay: `${i * 0.5}s`
            }}
          >
            <div className="text-sm opacity-70">🍄</div>
          </div>
        ))}
        
        {/* Whisper soil particles */}
        <div className="absolute bottom-0 left-0 right-0 h-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                growthState.isQuietBloomMode ? 'bg-gray-500' : `bg-${growthState.moodTone}-400`
              } opacity-60`}
              style={{
                left: `${30 + Math.random() * 40}%`,
                bottom: `${Math.random() * 8}px`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced tree trunk with growth texture */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className={`w-10 h-36 rounded-t-full transition-all duration-1000 relative overflow-hidden ${
          growthState.isQuietBloomMode ? 'bg-gray-700' : 'bg-gradient-to-t from-amber-800 to-amber-700'
        } ${windAnimation ? 'animate-pulse' : ''}`}>
          {/* Trunk texture lines */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-amber-900"
                style={{ top: `${20 + i * 20}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced branches with organic growth */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
        {[...Array(Math.min(Math.floor(growthState.totalReflections / 3) + 2, 8))].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full transition-all duration-1000 ${
              growthState.isQuietBloomMode ? 'bg-gray-600' : 'bg-gradient-to-r from-amber-700 to-amber-600'
            }`}
            style={{
              width: `${Math.max(32 - i * 2, 16)}px`,
              height: '3px',
              transform: `rotate(${-45 + i * 15}deg)`,
              transformOrigin: 'left center',
              left: '0px',
              top: `${-i * 6}px`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced leaves with better physics */}
      {growthState.leaves.map((leaf, index) => (
        <div
          key={leaf.id}
          className={`absolute cursor-pointer transform transition-all duration-500 ${
            hoveredLeaf === leaf.id ? 'z-20 scale-125' : 'hover:scale-110'
          } ${newLeafAnimating === leaf.id ? 'animate-bounce' : ''}`}
          style={{
            ...getLeafStyle(leaf, index),
            width: '28px',
            height: '28px',
            clipPath: getLeafShape(leaf.shape)
          }}
          onMouseEnter={() => setHoveredLeaf(leaf.id)}
          onMouseLeave={() => setHoveredLeaf(null)}
          onClick={() => onLeafClick(leaf.reflection)}
        >
          <div className={`w-full h-full ${getLeafColor(leaf.reflection.mood)} transition-all duration-300 ${
            hoveredLeaf === leaf.id ? 'opacity-100 shadow-lg' : 'opacity-85'
          } ${leaf.isGlowing ? 'animate-pulse' : ''}`} />
          
          {/* Special milestone glow */}
          {(index + 1) % 10 === 0 && (
            <div className="absolute inset-0 bg-yellow-300 opacity-40 rounded-full animate-pulse" />
          )}
          
          {/* New leaf entry animation */}
          {newLeafAnimating === leaf.id && (
            <div className="absolute inset-0 bg-white opacity-60 rounded-full animate-ping" />
          )}
        </div>
      ))}

      {/* Enhanced milestone features */}
      {growthState.totalReflections >= 30 && (
        <div className="absolute top-16 right-20 animate-bounce">
          <div className="relative">
            <div className="w-5 h-5 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full" />
            <div className="absolute -top-1 -left-1 w-7 h-7 bg-pink-200 rounded-full opacity-30 animate-pulse" />
          </div>
          <div className="relative mt-3">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-300 to-purple-400 rounded-full" />
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-purple-200 rounded-full opacity-30 animate-pulse delay-200" />
          </div>
        </div>
      )}

      {/* Enhanced bird at 50 leaves */}
      {growthState.totalReflections >= 50 && (
        <div className="absolute top-12 left-24 text-3xl animate-bounce" style={{ animationDuration: '3s' }}>
          <span className="drop-shadow-lg">🐦</span>
        </div>
      )}

      {/* Enhanced lanterns at 100 leaves */}
      {growthState.totalReflections >= 100 && (
        <>
          <div className="absolute top-20 left-28 group cursor-pointer">
            <div className="w-4 h-8 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full opacity-80 animate-pulse transform group-hover:scale-110 transition-transform">
              <div className="absolute inset-0 bg-yellow-100 rounded-full opacity-50 animate-ping" />
            </div>
          </div>
          <div className="absolute top-24 right-32 group cursor-pointer">
            <div className="w-4 h-8 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full opacity-80 animate-pulse delay-700 transform group-hover:scale-110 transition-transform">
              <div className="absolute inset-0 bg-yellow-100 rounded-full opacity-50 animate-ping" />
            </div>
          </div>
        </>
      )}

      {/* Growing indicator */}
      {isGrowing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20">
          <div className="text-center">
            <div className="text-4xl animate-spin">🌱</div>
            <p className="text-sage-700 text-sm mt-2">Growing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { TreeGrowthState, Reflection, TreeLeaf } from '../types/tree';

interface AnimatedTreeProps {
  growthState: TreeGrowthState;
  onLeafClick: (reflection: Reflection) => void;
  stormMode?: boolean;
  silentMode?: boolean;
  isGrowing?: boolean;
  leafMorphing?: boolean;
}

export const AnimatedTree = ({ 
  growthState, 
  onLeafClick, 
  stormMode = false, 
  silentMode = false,
  isGrowing = false,
  leafMorphing = false
}: AnimatedTreeProps) => {
  const treeRef = useRef<HTMLDivElement>(null);
  const [hoveredLeaf, setHoveredLeaf] = useState<string | null>(null);
  const [windAnimation, setWindAnimation] = useState(false);
  const [selectedLeaf, setSelectedLeaf] = useState<string | null>(null);
  const [treeScale, setTreeScale] = useState(1);

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
    
    if (growthState.twilightMode) {
      return 'bg-gradient-to-b from-indigo-900 via-purple-800 to-slate-900';
    }
    
    if (growthState.isQuietBloomMode) {
      return 'bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800';
    }

    const recentMoods = growthState.leaves.slice(-5).map(leaf => leaf.reflection.mood);
    const hasHeavyMoods = recentMoods.some(mood => 
      ['heavy', 'overwhelmed', 'anxious'].includes(mood)
    );

    if (hasHeavyMoods) {
      return `bg-gradient-to-b from-${growthState.moodTone}-200 via-sage-100 to-${growthState.moodTone}-300`;
    }

    return `bg-gradient-to-b from-${growthState.moodTone}-100 via-beige-100 to-${growthState.moodTone}-200`;
  };

  const renderIntelligentBranches = () => {
    const branchCount = growthState.branchCount || 2;
    const canopyRadius = growthState.canopyRadius || 25;
    
    return [...Array(branchCount)].map((_, i) => {
      const angle = (360 / branchCount) * i;
      const length = Math.min(canopyRadius + (i * 3), 45);
      
      return (
        <div
          key={`branch-${i}`}
          className={`absolute rounded-full transition-all duration-1000 ${
            growthState.isQuietBloomMode ? 'bg-gray-600' : 'bg-gradient-to-r from-amber-700 to-amber-600'
          }`}
          style={{
            width: `${length}px`,
            height: '4px',
            transform: `rotate(${angle - 90}deg)`,
            transformOrigin: 'left center',
            left: '50%',
            top: '50%',
            marginLeft: '-2px',
            marginTop: '-2px',
            animationDelay: `${i * 0.2}s`,
            opacity: windAnimation ? 0.8 : 1
          }}
        />
      );
    });
  };

  const getLeafStyle = (leaf: TreeLeaf, index: number) => {
    const isHovered = hoveredLeaf === leaf.id;
    const isSelected = selectedLeaf === leaf.id;
    const baseDelay = index * 0.05;
    const zIndex = Math.floor((leaf.depth || 0) * 10) + (isSelected ? 1000 : isHovered ? 100 : 1);
    
    return {
      left: `${leaf.position.x}%`,
      top: `${leaf.position.y}%`,
      animationDelay: `${baseDelay}s`,
      transform: windAnimation 
        ? `rotate(${Math.sin(index * 0.8) * 6}deg) scale(${0.95 + Math.random() * 0.1})` 
        : isSelected
        ? 'scale(1.3) rotate(0deg)'
        : isHovered 
        ? 'scale(1.15) rotate(0deg)'
        : 'scale(1) rotate(0deg)',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      opacity: leafMorphing && index === growthState.leaves.length - 1 ? 0.3 : 1,
      zIndex,
      filter: isSelected ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 
              isHovered ? 'drop-shadow(0 0 5px rgba(255,255,255,0.3))' : 'none'
    };
  };

  const handleLeafClick = (leaf: TreeLeaf) => {
    setSelectedLeaf(leaf.id);
    onLeafClick(leaf.reflection);
    
    // Brief highlight animation
    setTimeout(() => {
      setSelectedLeaf(null);
    }, 2000);
  };

  const renderSeasonalEffects = () => {
    const { totalReflections, twilightMode } = growthState;
    
    return (
      <>
        {/* Wind particles for 50+ leaves */}
        {totalReflections >= 50 && windAnimation && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={`wind-${i}`}
                className="absolute w-1 h-8 bg-sage-300 rounded-full opacity-30 animate-pulse"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Birds for 50+ leaves */}
        {totalReflections >= 50 && (
          <div className="absolute top-8 left-16 animate-bounce" style={{ animationDuration: '4s' }}>
            <span className="text-2xl drop-shadow-lg">🐦</span>
          </div>
        )}

        {/* Blossoms for 100+ leaves */}
        {totalReflections >= 100 && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={`blossom-${i}`}
                className="absolute animate-pulse"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${20 + Math.random() * 40}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              >
                <div className="w-3 h-3 bg-gradient-to-r from-pink-300 to-white rounded-full opacity-80" />
              </div>
            ))}
          </>
        )}

        {/* Twilight glow for 150+ leaves */}
        {twilightMode && (
          <div className="absolute inset-0 bg-gradient-radial from-purple-400 via-transparent to-transparent opacity-20 animate-pulse" />
        )}
      </>
    );
  };

  if (silentMode) {
    return (
      <div className="relative w-full h-96 overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 transition-all duration-2000">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute bottom-0 w-64 h-32 bg-slate-600 rounded-full opacity-30 blur-sm" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-lavender-300 to-sage-300 rounded-full animate-pulse opacity-70" />
              <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-sage-200 to-lavender-200 rounded-full animate-ping opacity-20" />
            </div>
          </div>
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
      className={`relative w-full h-96 overflow-hidden rounded-3xl transition-all duration-1000 cursor-grab active:cursor-grabbing ${getAdaptiveBackground()}`}
      style={{ transform: `scale(${treeScale})` }}
      onWheel={(e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        setTreeScale(prev => Math.max(0.5, Math.min(2, prev + delta)));
      }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full transition-colors duration-1000 ${
              growthState.twilightMode ? 'bg-purple-300 animate-pulse' :
              growthState.isQuietBloomMode ? 'bg-gray-400 animate-pulse' : 
              `bg-${growthState.moodTone}-300 animate-pulse`
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

      {/* Enhanced ground with roots indication */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <div className={`h-full rounded-t-full transition-all duration-1000 ${
          growthState.twilightMode 
            ? 'bg-gradient-to-t from-purple-900 to-transparent' 
            : growthState.isQuietBloomMode 
            ? 'bg-gradient-to-t from-gray-600 to-transparent' 
            : `bg-gradient-to-t from-${growthState.moodTone}-300 via-${growthState.moodTone}-200 to-transparent`
        }`} />
        
        {/* Root hints - subtle underground network */}
        <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={`root-${i}`}
              className={`absolute h-px opacity-20 ${
                growthState.twilightMode ? 'bg-purple-400' : `bg-${growthState.moodTone}-600`
              }`}
              style={{
                left: `${40 + i * 5}%`,
                width: `${10 + Math.random() * 20}%`,
                bottom: `${Math.random() * 20}px`,
                transform: `rotate(${(Math.random() - 0.5) * 60}deg)`
              }}
            />
          ))}
        </div>

        {/* Enhanced ground with moss and mushrooms */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <div className={`h-full rounded-t-full transition-all duration-1000 ${
            growthState.twilightMode 
              ? 'bg-gradient-to-t from-purple-900 to-transparent' 
              : growthState.isQuietBloomMode 
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
                  growthState.twilightMode ? 'bg-purple-500' : `bg-${growthState.moodTone}-400`
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
      </div>

      {/* Enhanced trunk with texture */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
        <div className={`w-12 h-40 rounded-t-full transition-all duration-1000 relative overflow-hidden ${
          growthState.twilightMode ? 'bg-gradient-to-t from-purple-900 to-purple-800' :
          growthState.isQuietBloomMode ? 'bg-gray-700' : 
          'bg-gradient-to-t from-amber-800 to-amber-700'
        } ${windAnimation ? 'animate-pulse' : ''}`}>
          {/* Trunk texture */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-amber-900"
                style={{ top: `${15 + i * 15}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Intelligent branch system */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2">
        {renderIntelligentBranches()}
      </div>

      {/* Enhanced leaves with depth and clustering */}
      {growthState.leaves.map((leaf, index) => (
        <div
          key={leaf.id}
          className={`absolute cursor-pointer transform transition-all duration-500 hover:z-50 ${
            selectedLeaf === leaf.id ? 'animate-pulse' : ''
          }`}
          style={{
            ...getLeafStyle(leaf, index),
            width: '32px',
            height: '32px',
            clipPath: getLeafShape(leaf.shape)
          }}
          onMouseEnter={() => setHoveredLeaf(leaf.id)}
          onMouseLeave={() => setHoveredLeaf(null)}
          onClick={() => handleLeafClick(leaf)}
          onTouchStart={() => setHoveredLeaf(leaf.id)}
          onTouchEnd={() => setHoveredLeaf(null)}
        >
          <div className={`w-full h-full ${getLeafColor(leaf.reflection.mood)} transition-all duration-300 ${
            selectedLeaf === leaf.id ? 'opacity-100 shadow-2xl' :
            hoveredLeaf === leaf.id ? 'opacity-100 shadow-lg' : 'opacity-90'
          } ${leaf.isGlowing ? 'animate-pulse' : ''}`} />
          
          {/* Depth shadow */}
          <div className="absolute inset-0 bg-black opacity-10 rounded-full transform translate-x-1 translate-y-1 -z-10" />
          
          {/* Special milestone highlights */}
          {(index + 1) % 30 === 0 && (
            <div className="absolute -inset-1 bg-yellow-300 opacity-30 rounded-full animate-pulse" />
          )}
        </div>
      ))}

      {/* Seasonal effects */}
      {renderSeasonalEffects()}

      {/* Growing indicator with morph transition */}
      {(isGrowing || leafMorphing) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm">
          <div className="text-center">
            <div className={`text-5xl ${leafMorphing ? 'animate-morph' : 'animate-spin'}`}>
              {leafMorphing ? '🌱' : '✨'}
            </div>
            <p className="text-sage-700 text-sm mt-2 animate-pulse">
              {leafMorphing ? 'Becoming a leaf...' : 'Growing...'}
            </p>
          </div>
        </div>
      )}

      {/* Zoom indicator */}
      {treeScale !== 1 && (
        <div className="absolute top-4 right-4 text-sage-600 text-xs bg-white bg-opacity-70 px-2 py-1 rounded-full">
          {Math.round(treeScale * 100)}%
        </div>
      )}
    </div>
  );
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

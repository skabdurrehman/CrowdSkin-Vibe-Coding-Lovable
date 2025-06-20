
import React, { useEffect, useRef, useState } from 'react';
import { TreeGrowthState, Reflection, TreeLeaf } from '../types/tree';

interface AnimatedTreeProps {
  growthState: TreeGrowthState;
  onLeafClick: (reflection: Reflection) => void;
  stormMode?: boolean;
}

export const AnimatedTree = ({ growthState, onLeafClick, stormMode = false }: AnimatedTreeProps) => {
  const treeRef = useRef<HTMLDivElement>(null);
  const [hoveredLeaf, setHoveredLeaf] = useState<string | null>(null);
  const [windAnimation, setWindAnimation] = useState(false);

  useEffect(() => {
    // Trigger wind animation periodically
    const windInterval = setInterval(() => {
      setWindAnimation(true);
      setTimeout(() => setWindAnimation(false), 2000);
    }, 8000 + Math.random() * 4000);

    return () => clearInterval(windInterval);
  }, []);

  const getLeafStyle = (leaf: TreeLeaf, index: number) => {
    const baseDelay = index * 0.1;
    const x = 50 + (Math.sin(index * 0.8) * 30);
    const y = 20 + (index * 2) + (Math.cos(index * 0.6) * 15);
    
    return {
      left: `${x}%`,
      top: `${y}%`,
      animationDelay: `${baseDelay}s`,
      transform: windAnimation ? `rotate(${Math.sin(index) * 5}deg) scale(${0.95 + Math.random() * 0.1})` : 'none',
      transition: 'all 1.5s ease-in-out'
    };
  };

  const getLeafColor = (mood: string) => {
    const moodColors = {
      peaceful: 'bg-sage-300',
      anxious: 'bg-yellow-300',
      heavy: 'bg-gray-400',
      disconnected: 'bg-blue-300',
      overwhelmed: 'bg-red-300',
      hopeful: 'bg-green-300',
      frustrated: 'bg-orange-300',
      gentle: 'bg-lavender-300'
    };
    return moodColors[mood as keyof typeof moodColors] || 'bg-sage-300';
  };

  const getLeafShape = (shape: string) => {
    const shapes = {
      triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      circle: 'circle(50%)',
      oval: 'ellipse(60% 40%)',
      diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    };
    return shapes[shape as keyof typeof shapes] || 'ellipse(60% 40%)';
  };

  return (
    <div 
      ref={treeRef}
      className={`relative w-full h-96 overflow-hidden rounded-3xl transition-all duration-1000 ${
        stormMode ? 'bg-gray-600' : 'bg-gradient-to-b from-sage-100 via-beige-100 to-sage-200'
      }`}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-pulse ${
              stormMode ? 'bg-gray-400' : 'bg-sage-300'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Ground moss */}
      <div className="absolute bottom-0 left-0 right-0 h-16">
        <div className={`h-full rounded-t-full transition-colors duration-1000 ${
          stormMode ? 'bg-gray-500' : `bg-gradient-to-t from-${growthState.moodTone || 'sage'}-200 to-transparent`
        }`} />
      </div>

      {/* Tree trunk */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className={`w-8 h-32 rounded-t-full transition-all duration-1000 ${
          stormMode ? 'bg-gray-700' : 'bg-amber-800'
        } ${windAnimation ? 'animate-pulse' : ''}`} />
      </div>

      {/* Main branches */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        {[...Array(Math.min(growthState.totalReflections, 5))].map((_, i) => (
          <div
            key={i}
            className={`absolute w-16 h-2 rounded-full transition-all duration-500 ${
              stormMode ? 'bg-gray-600' : 'bg-amber-700'
            }`}
            style={{
              transform: `rotate(${-60 + i * 30}deg)`,
              transformOrigin: 'left center',
              left: '0px',
              top: `${-i * 8}px`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* Leaves */}
      {growthState.leaves.map((leaf, index) => (
        <div
          key={leaf.id}
          className={`absolute w-6 h-6 cursor-pointer transform hover:scale-110 transition-all duration-300 animate-fade-in ${
            hoveredLeaf === leaf.id ? 'z-10 scale-125' : ''
          }`}
          style={{
            ...getLeafStyle(leaf, index),
            clipPath: getLeafShape(leaf.shape)
          }}
          onMouseEnter={() => setHoveredLeaf(leaf.id)}
          onMouseLeave={() => setHoveredLeaf(null)}
          onClick={() => onLeafClick(leaf.reflection)}
        >
          <div className={`w-full h-full ${getLeafColor(leaf.reflection.mood)} opacity-80 hover:opacity-100 transition-opacity duration-300`} />
          
          {/* Leaf glow effect for special milestones */}
          {(index + 1) % 10 === 0 && (
            <div className="absolute inset-0 bg-yellow-300 opacity-30 rounded-full animate-pulse" />
          )}
        </div>
      ))}

      {/* Flowers at 30 leaves */}
      {growthState.totalReflections >= 30 && (
        <div className="absolute top-12 right-16">
          <div className="w-4 h-4 bg-pink-300 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-purple-300 rounded-full animate-bounce delay-200 mt-2" />
        </div>
      )}

      {/* Bird at 50 leaves */}
      {growthState.totalReflections >= 50 && (
        <div className="absolute top-8 left-20 text-2xl animate-pulse">
          🐦
        </div>
      )}

      {/* Lanterns at 100 leaves */}
      {growthState.totalReflections >= 100 && (
        <>
          <div className="absolute top-16 left-24 w-3 h-6 bg-yellow-200 rounded-full opacity-70 animate-pulse" />
          <div className="absolute top-20 right-28 w-3 h-6 bg-yellow-200 rounded-full opacity-70 animate-pulse delay-500" />
        </>
      )}

      {/* Storm effects */}
      {stormMode && (
        <>
          <div className="absolute inset-0 bg-gray-800 opacity-20" />
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px h-8 bg-blue-200 opacity-60 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  transform: `rotate(${10 + Math.random() * 20}deg)`
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

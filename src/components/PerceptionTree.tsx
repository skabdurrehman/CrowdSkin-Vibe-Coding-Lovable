
import React from 'react';

export const PerceptionTree = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-light text-sage-800 mb-4">
          Your Perception Tree
        </h2>
        
        <div className="bg-white/50 backdrop-blur rounded-3xl p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">🌱</div>
            <p className="text-sage-600">
              Your tree is just beginning to grow.
            </p>
            <p className="text-sm text-sage-500">
              As you create daily reflections, new leaves will appear here, showing the patterns of your inner landscape.
            </p>
          </div>
        </div>
        
        <p className="text-sage-600 text-sm leading-relaxed">
          Each reflection becomes a leaf. Each week becomes a branch. 
          Over time, you'll see the beautiful complexity of how you experience yourself.
        </p>
      </div>
    </div>
  );
};

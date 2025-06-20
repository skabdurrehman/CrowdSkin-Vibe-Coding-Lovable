
import React, { useState } from 'react';

export const DumpZone = () => {
  const [input, setInput] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [releaseType, setReleaseType] = useState('');

  const releaseTypes = [
    { id: 'crumple', name: 'Crumple it up', emoji: '📄', description: 'Watch it crumple and disappear' },
    { id: 'water', name: 'Wash it away', emoji: '🌊', description: 'Let water carry it downstream' },
    { id: 'wind', name: 'Blow it away', emoji: '🍃', description: 'Watch the wind take it far from here' },
    { id: 'bury', name: 'Bury it deep', emoji: '🌱', description: 'Plant it where something new can grow' }
  ];

  const handleRelease = (type: string) => {
    if (input.trim()) {
      setReleaseType(type);
      setIsReleasing(true);
      
      setTimeout(() => {
        setInput('');
        setIsReleasing(false);
        setReleaseType('');
      }, 3000);
    }
  };

  if (isReleasing) {
    const release = releaseTypes.find(r => r.id === releaseType);
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl animate-pulse">{release?.emoji}</div>
          <h3 className="text-xl font-light text-sage-800">
            Releasing...
          </h3>
          <p className="text-sage-600">
            {release?.description}
          </p>
          <div className="w-16 h-1 bg-sage-300 rounded mx-auto overflow-hidden">
            <div className="w-full h-full bg-sage-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-sage-800 mb-4">
            Dump Zone
          </h2>
          <p className="text-sage-600 leading-relaxed">
            This is your space to release difficult thoughts without judgment. Write what you feel, then choose how to let it go.
          </p>
        </div>

        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I hate how I look today... I feel so uncomfortable... I wish I could disappear..."
            className="w-full h-40 p-4 bg-white/70 backdrop-blur border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300 text-sage-800 placeholder-sage-400"
            style={{ fontFamily: 'inherit' }}
          />
          
          <p className="text-xs text-sage-500 text-center">
            These words will not be saved or shared. They exist only to be released.
          </p>
        </div>

        {input.trim() && (
          <div className="space-y-3">
            <p className="text-center text-sage-700 font-medium">How would you like to release this?</p>
            <div className="grid grid-cols-2 gap-3">
              {releaseTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleRelease(type.id)}
                  className="p-4 bg-white/60 hover:bg-white/80 rounded-2xl transition-all duration-300 text-center space-y-2"
                >
                  <div className="text-2xl">{type.emoji}</div>
                  <div className="text-sm font-medium text-sage-800">{type.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

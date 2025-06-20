
import React, { useState } from 'react';

export const MoodCheckin = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');

  const moods = [
    { id: 'peaceful', emoji: '😌', name: 'Peaceful', color: 'bg-sage-200' },
    { id: 'anxious', emoji: '😰', name: 'Anxious', color: 'bg-yellow-200' },
    { id: 'heavy', emoji: '😔', name: 'Heavy', color: 'bg-gray-200' },
    { id: 'disconnected', emoji: '😶', name: 'Disconnected', color: 'bg-blue-200' },
    { id: 'overwhelmed', emoji: '😵', name: 'Overwhelmed', color: 'bg-red-200' },
    { id: 'hopeful', emoji: '🌱', name: 'Hopeful', color: 'bg-green-200' },
    { id: 'frustrated', emoji: '😤', name: 'Frustrated', color: 'bg-orange-200' },
    { id: 'gentle', emoji: '🕊️', name: 'Gentle', color: 'bg-lavender-200' }
  ];

  const handleSave = () => {
    const checkin = {
      mood: selectedMood,
      intensity,
      notes,
      timestamp: new Date().toISOString()
    };
    
    console.log('Saving mood check-in:', checkin);
    
    // Reset form
    setSelectedMood('');
    setIntensity(5);
    setNotes('');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light text-sage-800 mb-4">
            How are you feeling?
          </h2>
          <p className="text-sage-600">
            Your feelings help us understand what kind of support you might need today.
          </p>
        </div>

        <div className="space-y-6">
          {/* Mood Selection */}
          <div>
            <p className="text-sage-700 font-medium mb-3">Choose what feels closest:</p>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-4 rounded-2xl transition-all duration-300 text-center space-y-2 ${
                    selectedMood === mood.id 
                      ? `${mood.color} ring-2 ring-sage-400` 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                >
                  <div className="text-2xl">{mood.emoji}</div>
                  <div className="text-sm font-medium text-sage-800">{mood.name}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedMood && (
            <>
              {/* Intensity Slider */}
              <div>
                <p className="text-sage-700 font-medium mb-3">
                  How intense is this feeling? ({intensity}/10)
                </p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-sage-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-sage-500 mt-1">
                  <span>Gentle</span>
                  <span>Intense</span>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <p className="text-sage-700 font-medium mb-3">
                  Anything else you'd like to note? (optional)
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="I'm feeling this way because... This started when... I noticed..."
                  className="w-full h-24 p-4 bg-white/70 backdrop-blur border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all duration-300 text-sage-800 placeholder-sage-400"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl transition-all duration-300 font-medium"
              >
                Save this moment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

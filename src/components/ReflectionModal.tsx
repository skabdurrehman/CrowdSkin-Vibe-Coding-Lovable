
import React from 'react';
import { Reflection } from '../types/tree';

interface ReflectionModalProps {
  reflection: Reflection | null;
  onClose: () => void;
}

export const ReflectionModal = ({ reflection, onClose }: ReflectionModalProps) => {
  if (!reflection) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis = {
      peaceful: '😌',
      anxious: '😰',
      heavy: '😔',
      disconnected: '😶',
      overwhelmed: '😵',
      hopeful: '🌱',
      frustrated: '😤',
      gentle: '🕊️'
    };
    return moodEmojis[mood as keyof typeof moodEmojis] || '💭';
  };

  return (
    <div className="fixed inset-0 bg-sage-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur rounded-3xl p-8 max-w-md w-full animate-scale-in">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{getMoodEmoji(reflection.mood)}</div>
          <h3 className="text-xl font-light text-sage-800 mb-2">
            {formatDate(reflection.date)}
          </h3>
          <p className="text-sage-600 capitalize">
            You felt {reflection.mood}
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-sage-50 rounded-2xl p-4">
            <p className="text-sm text-sage-600 mb-1">Your shape that day</p>
            <p className="text-sage-800 capitalize">{reflection.shape}</p>
          </div>

          <div className="bg-sage-50 rounded-2xl p-4">
            <p className="text-sm text-sage-600 mb-1">Your color that day</p>
            <p className="text-sage-800 capitalize">{reflection.color}</p>
          </div>

          <div className="bg-sage-50 rounded-2xl p-4">
            <p className="text-sm text-sage-600 mb-1">Intensity</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-sage-200 rounded-full h-2">
                <div 
                  className="bg-sage-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${reflection.intensity * 10}%` }}
                />
              </div>
              <span className="text-sage-700 text-sm">{reflection.intensity}/10</span>
            </div>
          </div>

          {reflection.notes && (
            <div className="bg-sage-50 rounded-2xl p-4">
              <p className="text-sm text-sage-600 mb-1">Your words</p>
              <p className="text-sage-800 italic">"{reflection.notes}"</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl transition-all duration-300 font-medium"
        >
          Return to your tree
        </button>
      </div>
    </div>
  );
};
